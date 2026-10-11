import { describe, expect, it } from "vitest";
import { isDeliveryVisibleToOrganization, requireIdentity } from "./access";

describe("tenant access guards", () => {
  it("rejects a missing user or organization instead of building an unscoped request", () => {
    expect(() => requireIdentity(null)).toThrow("Sessão e organização válidas são obrigatórias.");
    expect(() => requireIdentity({ userId: "user-a" })).toThrow("Sessão e organização válidas são obrigatórias.");
    expect(requireIdentity({ userId: " user-a ", organizationId: " org-a " })).toEqual({ userId: " user-a ", organizationId: " org-a " });
  });

  it("does not treat another organization's delivery as visible", () => {
    expect(isDeliveryVisibleToOrganization({ organization_id: "org-a" }, "org-a")).toBe(true);
    expect(isDeliveryVisibleToOrganization({ organization_id: "org-b" }, "org-a")).toBe(false);
    expect(isDeliveryVisibleToOrganization({ organization_id: null }, "org-a")).toBe(false);
    expect(isDeliveryVisibleToOrganization(undefined, "org-a")).toBe(false);
  });

  it("fails closed when the organization identifier is blank", () => {
    expect(isDeliveryVisibleToOrganization({ organization_id: "org-a" }, " ")).toBe(false);
  });
});
