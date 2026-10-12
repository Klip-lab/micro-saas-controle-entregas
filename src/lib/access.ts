export type SessionIdentity = { userId: string; organizationId: string };

export function requireIdentity(identity: Partial<SessionIdentity> | null | undefined): SessionIdentity {
  if (!identity?.userId?.trim() || !identity?.organizationId?.trim()) {
    throw new Error("Sessão e organização válidas são obrigatórias.");
  }
  return { userId: identity.userId, organizationId: identity.organizationId };
}

export function isDeliveryVisibleToOrganization(
  delivery: { organization_id?: string | null } | null | undefined,
  organizationId: string,
): boolean {
  return Boolean(organizationId.trim() && delivery?.organization_id === organizationId);
}
