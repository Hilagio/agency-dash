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

  // Lazy cleanup: an invite whose email already belongs to a MEMBER of this
  // org is settled (they may have joined via domain auto-join before ever
  // logging in post-invite) — mark it used so it stops showing as pending.
  const pending = await prisma.organizationInvite.findMany({
    where: { organizationId: ctx.orgId, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  const memberEmails = new Set(
    (await prisma.organizationMember.findMany({
      where: { organizationId: ctx.orgId },
      include: { user: { select: { email: true } } },
    })).map(m => m.user.email.toLowerCase()));
  const settled = pending.filter(i => memberEmails.has(i.email.toLowerCase()));
  if (settled.length) {
    await prisma.organizationInvite.updateMany({
      where: { id: { in: settled.map(i => i.id) } },
      data: { usedAt: new Date() },
    }).catch(() => null);
  }

  return NextResponse.json(pending.filter(i => !memberEmails.has(i.email.toLowerCase())));
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

  // Already a member? Then there's nothing to invite — say so instead of
  // creating a pending invite that can never resolve.
  const existingMember = await prisma.organizationMember.findFirst({
    where: { organizationId: ctx.orgId, user: { email: email.trim().toLowerCase() } },
  });
  if (existingMember) {
    return NextResponse.json({ error: "That person is already a member of this workspace." }, { status: 409 });
  }

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

/** DELETE /api/org/invites?id=… — cancel a pending invite (admin only). */
export async function DELETE(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const isAdmin = await requireAdminRole(ctx.orgId, ctx.userId);
  if (!isAdmin) return forbidden();

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const invite = await prisma.organizationInvite.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!invite) return NextResponse.json({ error: "Invite not found" }, { status: 404 });

  await prisma.organizationInvite.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
