begin;

create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 100),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create index if not exists organization_members_user_id_idx
  on public.organization_members(user_id);

create table if not exists public.deliveries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete restrict,
  title text not null check (char_length(trim(title)) between 1 and 160),
  recipient text not null check (char_length(trim(recipient)) between 1 and 160),
  status text not null default 'pending' check (status in ('pending', 'in_transit', 'delivered', 'delayed')),
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists deliveries_org_created_at_idx
  on public.deliveries(organization_id, created_at desc);

create or replace function public.is_organization_member(target_organization_id uuid)
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

revoke all on function public.is_organization_member(uuid) from public;
grant execute on function public.is_organization_member(uuid) to authenticated;

create or replace function public.create_workspace(workspace_name text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  new_organization_id uuid;
  clean_name text := trim(workspace_name);
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if clean_name is null or char_length(clean_name) < 1 or char_length(clean_name) > 100 then
    raise exception 'Workspace name must contain 1 to 100 characters' using errcode = '22023';
  end if;

  insert into public.organizations (name, created_by)
  values (clean_name, current_user_id)
  returning id into new_organization_id;

  insert into public.organization_members (organization_id, user_id, role)
  values (new_organization_id, current_user_id, 'owner');

  return new_organization_id;
end;
$$;

revoke all on function public.create_workspace(text) from public;
grant execute on function public.create_workspace(text) to authenticated;

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.deliveries enable row level security;

drop policy if exists organizations_select_member on public.organizations;
create policy organizations_select_member
  on public.organizations for select to authenticated
  using (public.is_organization_member(id));

drop policy if exists organization_members_select_self_or_colleague on public.organization_members;
create policy organization_members_select_self_or_colleague
  on public.organization_members for select to authenticated
  using (user_id = (select auth.uid()) or public.is_organization_member(organization_id));

drop policy if exists deliveries_select_member on public.deliveries;
create policy deliveries_select_member
  on public.deliveries for select to authenticated
  using (public.is_organization_member(organization_id));

drop policy if exists deliveries_insert_member on public.deliveries;
create policy deliveries_insert_member
  on public.deliveries for insert to authenticated
  with check (
    public.is_organization_member(organization_id)
    and created_by = (select auth.uid())
  );

drop policy if exists deliveries_update_member on public.deliveries;
create policy deliveries_update_member
  on public.deliveries for update to authenticated
  using (public.is_organization_member(organization_id))
  with check (public.is_organization_member(organization_id));

drop policy if exists deliveries_delete_member on public.deliveries;
create policy deliveries_delete_member
  on public.deliveries for delete to authenticated
  using (public.is_organization_member(organization_id));

grant select on public.organizations to authenticated;
grant select on public.organization_members to authenticated;
grant select, insert, update, delete on public.deliveries to authenticated;

commit;
