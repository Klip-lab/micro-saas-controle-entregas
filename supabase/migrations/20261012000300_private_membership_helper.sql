begin;

-- Keep the RLS helper outside Supabase's exposed public API schema.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.is_organization_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.organization_members membership
    where membership.organization_id = target_organization_id
      and membership.user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_organization_member(uuid) from public, anon;
grant execute on function private.is_organization_member(uuid) to authenticated;

drop policy if exists organizations_select_member on public.organizations;
create policy organizations_select_member
  on public.organizations for select to authenticated
  using (private.is_organization_member(id));

drop policy if exists organization_members_select_self_or_colleague on public.organization_members;
create policy organization_members_select_self_or_colleague
  on public.organization_members for select to authenticated
  using (user_id = (select auth.uid()) or private.is_organization_member(organization_id));

drop policy if exists deliveries_select_member on public.deliveries;
create policy deliveries_select_member
  on public.deliveries for select to authenticated
  using (private.is_organization_member(organization_id));

drop policy if exists deliveries_insert_member on public.deliveries;
create policy deliveries_insert_member
  on public.deliveries for insert to authenticated
  with check (
    private.is_organization_member(organization_id)
    and created_by = (select auth.uid())
  );

drop policy if exists deliveries_update_member on public.deliveries;
create policy deliveries_update_member
  on public.deliveries for update to authenticated
  using (private.is_organization_member(organization_id))
  with check (private.is_organization_member(organization_id));

drop policy if exists deliveries_delete_member on public.deliveries;
create policy deliveries_delete_member
  on public.deliveries for delete to authenticated
  using (private.is_organization_member(organization_id));

revoke all on function public.is_organization_member(uuid) from public, anon, authenticated;
drop function public.is_organization_member(uuid);

commit;
