/**
 * The "team workspace" is the organization holding the most client accounts —
 * the single place where the agency's work lives. It is authoritative: it may
 * claim accounts that strayed into personal orgs (imported there before the
 * team flow existed); stray orgs may never claim from it.
 */
import { prisma } from "@/lib/db";

export async function mainWorkspaceId(): Promise<string | null> {
  const orgs = await prisma.organization.findMany({
    select: { id: true, _count: { select: { accounts: true } } },
  });
  return orgs.sort((a, b) => b._count.accounts - a._count.accounts)[0]?.id ?? null;
}

/**
 * Move an account (and all its child data, which is keyed by accountId) into
 * `intoOrgId`. The owner link is cleared — Owner rows are org-scoped and would
 * dangle across organizations.
 */
export async function claimAccount(googleAdsId: string, intoOrgId: string, fields?: { name?: string; currency?: string }) {
  return prisma.account.update({
    where: { googleAdsId },
    data: {
      organizationId: intoOrgId,
      ownerId: null,
      active: true,
      archived: false,
      ...(fields?.name ? { name: fields.name } : {}),
      ...(fields?.currency ? { currency: fields.currency } : {}),
    },
  });
}
