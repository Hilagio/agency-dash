/**
 * GET  /api/org/invites — list pending invites for current org
 * POST /api/org/invites — create an invite link
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

async function requireAdminRole(orgId: string, userId: string) {
  const member = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: orgId, userId } },
  });
  return member && ["OWNER", "ADMIN"].includes(member.role);
}

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const isAdmin = await requireAdminRole(ctx.orgId, ctx.userId);
  if (!isAdmin) return forbidden();

  const invites = await prisma.organizationInvite.findMany({
    where: { organizationId: ctx.orgId, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invites);
}

export async function POST(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const isAdmin = await requireAdminRole(ctx.orgId, ctx.userId);
  if (!isAdmin) return forbidden();

  const { email, role } = await req.json() as { email?: string; role?: string };
  if (!email?.trim()) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const validRoles = ["OWNER", "ADMIN", "SPECIALIST"];
  const inviteRole = validRoles.includes(role ?? "") ? role! : "SPECIALIST";

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const invite = await prisma.organizationInvite.create({
    data: {
      organizationId: ctx.orgId,
      email:          email.trim().toLowerCase(),
      role:           inviteRole,
      expiresAt,
    },
  });

  return NextResponse.json(invite, { status: 201 });
}
