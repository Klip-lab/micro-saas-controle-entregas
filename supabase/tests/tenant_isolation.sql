begin;

select plan(14);

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('10000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'tenant-a@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('20000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'tenant-b@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('30000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'tenant-c@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now())
on conflict (id) do nothing;

insert into public.organizations (id, name, created_by) values
  ('a0000000-0000-4000-8000-000000000001', 'Tenant A', '10000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000002', 'Tenant B', '20000000-0000-4000-8000-000000000002')
on conflict (id) do nothing;

insert into public.organization_members (organization_id, user_id, role) values
  ('a0000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'owner'),
  ('b0000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', 'owner'),
  ('a0000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', 'member')
on conflict (organization_id, user_id) do nothing;

insert into public.deliveries (id, organization_id, created_by, title, recipient, status) values
  ('a1000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Entrega A', 'Cliente A', 'pending'),
  ('b1000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', 'Entrega B', 'Cliente B', 'pending')
on conflict (id) do nothing;

select has_index('public', 'organizations', 'organizations_created_by_idx', 'organizations creator foreign key is indexed');
select has_index('public', 'deliveries', 'deliveries_created_by_idx', 'deliveries creator foreign key is indexed');
select has_trigger('public', 'deliveries', 'deliveries_set_updated_at', 'delivery updates automatically refresh updated_at');

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated","email":"tenant-a@example.test"}', true);

select is((select count(*)::int from public.deliveries), 1, 'tenant A can only read deliveries from organizations it belongs to');

select lives_ok(
  $$ insert into public.deliveries (organization_id, created_by, title, recipient, status)
     values ('a0000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Nova entrega A', 'Cliente A2', 'pending') $$,
  'tenant A can insert in its own organization'
);

select throws_ok(
  $$ insert into public.deliveries (organization_id, created_by, title, recipient, status)
     values ('b0000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Entrega invasiva', 'Cliente B', 'pending') $$,
  '42501',
  'new row violates row-level security policy for table "deliveries"',
  'tenant A cannot insert into tenant B'
);

select lives_ok(
  $$ select public.invite_organization_member('a0000000-0000-4000-8000-000000000001', 'tenant-c@example.test') $$,
  'organization owner can invite an email'
);

update public.deliveries set title = 'Alterada indevidamente'
where id = 'b1000000-0000-4000-8000-000000000002';

select set_config('request.jwt.claim.sub', '20000000-0000-4000-8000-000000000002', true);
select set_config('request.jwt.claims', '{"sub":"20000000-0000-4000-8000-000000000002","role":"authenticated","email":"tenant-b@example.test"}', true);

select lives_ok(
  $$ update public.deliveries set status = 'in_transit' where id = 'a1000000-0000-4000-8000-000000000001' $$,
  'a member can update a delivery within their organization'
);

select throws_ok(
  $$ update public.deliveries set created_by = '20000000-0000-4000-8000-000000000002' where id = 'a1000000-0000-4000-8000-000000000001' $$,
  '42501',
  'Delivery creator cannot be changed',
  'a member cannot reassign the delivery creator'
);

select throws_ok(
  $$ select public.invite_organization_member('a0000000-0000-4000-8000-000000000001', 'someone@example.test') $$,
  '42501',
  'Only organization owners can invite members',
  'non-owner cannot invite members'
);

select is((select title from public.deliveries where id = 'b1000000-0000-4000-8000-000000000002'), 'Entrega B', 'tenant A cannot update tenant B delivery');

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated","email":"tenant-a@example.test"}', true);
delete from public.deliveries where id = 'b1000000-0000-4000-8000-000000000002';

select set_config('request.jwt.claim.sub', '30000000-0000-4000-8000-000000000003', true);
select set_config('request.jwt.claims', '{"sub":"30000000-0000-4000-8000-000000000003","role":"authenticated","email":"tenant-c@example.test"}', true);

select lives_ok($$ select public.accept_organization_invitations() $$, 'invited user can accept their own invitation');
select is(
  (select count(*)::int from public.organization_members where organization_id = 'a0000000-0000-4000-8000-000000000001' and user_id = '30000000-0000-4000-8000-000000000003'),
  1,
  'acceptance adds the invited email to the target organization'
);

select is((select count(*)::int from public.deliveries where id = 'b1000000-0000-4000-8000-000000000002'), 1, 'tenant A cannot delete tenant B delivery');

select * from finish();
rollback;
