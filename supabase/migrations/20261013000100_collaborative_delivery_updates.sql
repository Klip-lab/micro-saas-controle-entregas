begin;

create or replace function public.prevent_delivery_creator_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.created_by is distinct from old.created_by then
    raise exception 'Delivery creator cannot be changed' using errcode = '42501';
  end if;
  return new;
end;
$$;

revoke all on function public.prevent_delivery_creator_change() from public, anon, authenticated;

drop trigger if exists deliveries_creator_immutable on public.deliveries;
create trigger deliveries_creator_immutable
before update on public.deliveries
for each row execute function public.prevent_delivery_creator_change();

drop policy if exists deliveries_update_member on public.deliveries;
create policy deliveries_update_member
  on public.deliveries for update to authenticated
  using (public.is_organization_member(organization_id))
  with check (public.is_organization_member(organization_id));

commit;
