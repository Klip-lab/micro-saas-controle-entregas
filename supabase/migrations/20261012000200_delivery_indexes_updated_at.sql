begin;

create index if not exists organizations_created_by_idx
  on public.organizations(created_by);

create index if not exists deliveries_created_by_idx
  on public.deliveries(created_by);

create or replace function public.set_delivery_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function public.set_delivery_updated_at() from public, anon, authenticated;

drop trigger if exists deliveries_set_updated_at on public.deliveries;
create trigger deliveries_set_updated_at
before update on public.deliveries
for each row execute function public.set_delivery_updated_at();

commit;
