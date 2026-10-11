begin;

select plan(5);

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('10000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'tenant-a@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('20000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'tenant-b@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now())
on conflict (id) do nothing;

insert into public.organizations (id, name, created_by) values
  ('a0000000-0000-4000-8000-000000000001', 'Tenant A', '10000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000002', 'Tenant B', '20000000-0000-4000-8000-000000000002')
on conflict (id) do nothing;

insert into public.organization_members (organization_id, user_id, role) values
  ('a0000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'owner'),
  ('b0000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', 'owner')
on conflict (organization_id, user_id) do nothing;

insert into public.deliveries (id, organization_id, created_by, title, recipient, status) values
  ('a1000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Entrega A', 'Cliente A', 'pending'),
  ('b1000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', 'Entrega B', 'Cliente B', 'pending')
on conflict (id) do nothing;

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select is(
  (select count(*)::int from public.deliveries),
  1,
  'tenant A can only read tenant A deliveries'
);

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

-- An UPDATE outside the tenant's RLS visibility must affect no rows.
update public.deliveries
set title = 'Alterada indevidamente'
where id = 'b1000000-0000-4000-8000-000000000002';

select set_config('request.jwt.claim.sub', '20000000-0000-4000-8000-000000000002', true);
select is(
  (select title from public.deliveries where id = 'b1000000-0000-4000-8000-000000000002'),
  'Entrega B',
  'tenant A cannot update tenant B delivery'
);

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
delete from public.deliveries
where id = 'b1000000-0000-4000-8000-000000000002';

select set_config('request.jwt.claim.sub', '20000000-0000-4000-8000-000000000002', true);
select is(
  (select count(*)::int from public.deliveries where id = 'b1000000-0000-4000-8000-000000000002'),
  1,
  'tenant A cannot delete tenant B delivery'
);

select * from finish();
rollback;
