begin;

revoke all on function public.create_workspace(text) from public, anon, authenticated;
grant execute on function public.create_workspace(text) to authenticated;

revoke all on function public.is_organization_member(uuid) from public, anon, authenticated;
grant execute on function public.is_organization_member(uuid) to authenticated;

commit;
