begin;

create table if not exists private.organization_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null check (email = lower(trim(email)) and char_length(email) between 3 and 320),
  invited_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create unique index if not exists organization_invitations_pending_email_idx
  on private.organization_invitations (organization_id, lower(email))
  where accepted_at is null;

create or replace function private.invite_organization_member(target_organization_id uuid, invite_email text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  clean_email text := lower(trim(invite_email));
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if clean_email is null or char_length(clean_email) < 3 or char_length(clean_email) > 320
     or clean_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'A valid email address is required' using errcode = '22023';
  end if;
  if not exists (
    select 1 from public.organization_members m
    where m.organization_id = target_organization_id
      and m.user_id = current_user_id
      and m.role = 'owner'
  ) then
    raise exception 'Only organization owners can invite members' using errcode = '42501';
  end if;

  insert into private.organization_invitations (organization_id, email, invited_by)
  values (target_organization_id, clean_email, current_user_id)
  on conflict (organization_id, (lower(email))) where accepted_at is null
  do update set invited_by = excluded.invited_by, created_at = now();
end;
$$;

create or replace function public.invite_organization_member(target_organization_id uuid, invite_email text)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  perform private.invite_organization_member(target_organization_id, invite_email);
end;
$$;

revoke all on function private.invite_organization_member(uuid, text) from public, anon;
grant execute on function private.invite_organization_member(uuid, text) to authenticated;
revoke all on function public.invite_organization_member(uuid, text) from public, anon;
grant execute on function public.invite_organization_member(uuid, text) to authenticated;

create or replace function private.accept_organization_invitations()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  current_email text := lower(trim(coalesce((select auth.jwt() ->> 'email'), '')));
  invitation record;
  accepted_count integer := 0;
begin
  if current_user_id is null or current_email = '' then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  for invitation in
    select i.id, i.organization_id
    from private.organization_invitations i
    where i.accepted_at is null and i.email = current_email
    for update
  loop
    insert into public.organization_members (organization_id, user_id, role)
    values (invitation.organization_id, current_user_id, 'member')
    on conflict (organization_id, user_id) do nothing;

    update private.organization_invitations
    set accepted_at = now()
    where id = invitation.id and accepted_at is null;

    accepted_count := accepted_count + 1;
  end loop;

  return accepted_count;
end;
$$;

create or replace function public.accept_organization_invitations()
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  accepted_count integer;
begin
  accepted_count := private.accept_organization_invitations();
  return accepted_count;
end;
$$;

revoke all on function private.accept_organization_invitations() from public, anon;
grant execute on function private.accept_organization_invitations() to authenticated;
revoke all on function public.accept_organization_invitations() from public, anon;
grant execute on function public.accept_organization_invitations() to authenticated;

commit;
