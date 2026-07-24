/**
 * GET /api/org/workspace — where does the team's real work live, and how does
 * the current user relate to it?
 *
 * The "team workspace" is the organization holding the most accounts. Returns
 * enough for the cockpit to steer strays home: is the user already a member,
 * is it their current org, do they have a pending join request, and their role
 * in the CURRENT org (drives admin-only UI like the MCC importer).
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const orgs = await prisma.organization.findMany({
    select: { id: true, name: true, _count: { select: { accounts: true } } },
  });
  const main = orgs.sort((a, b) => b._count.accounts - a._count.accounts)[0] ?? null;

  const [myMembership, currentRole, pending] = await Promise.all([
    main ? prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: main.id, userId: ctx.userId } },
      select: { id: true },
    }) : null,
    prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: ctx.orgId, userId: ctx.userId } },
      select: { role: true },
    }),
    main ? prisma.orgJoinRequest.findUnique({
      where: { organizationId_userId: { organizationId: main.id, userId: ctx.userId } },
      select: { status: true },
    }) : null,
  ]);

  return NextResponse.json({
    main: main ? { id: main.id, name: main.name, accounts: main._count.accounts, isCurrent: main.id === ctx.orgId, isMember: !!myMembership } : null,
    myRole: currentRole?.role ?? null,
    joinRequestStatus: pending?.status ?? null,
  });
}
