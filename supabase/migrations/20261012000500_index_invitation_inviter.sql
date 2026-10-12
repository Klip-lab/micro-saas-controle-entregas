begin;

create index if not exists organization_invitations_invited_by_idx
  on private.organization_invitations (invited_by);

commit;
