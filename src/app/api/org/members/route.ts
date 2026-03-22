/**
 * GET    /api/org/members — list members
 * DELETE /api/org/members?userId=... — remove a member
 * PATCH  /api/org/members?userId=... — change role
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const members = await prisma.organizationMember.findMany({
    where: { organizationId: ctx.orgId },
    include: { user: { select: { id: true, email: true, name: true, image: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(members);
}

export async function DELETE(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const myMembership = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: ctx.orgId, userId: ctx.userId } },
  });
  if (!myMembership || !["OWNER", "ADMIN"].includes(myMembership.role)) return forbidden();

  const targetUserId = new URL(req.url).searchParams.get("userId");
  if (!targetUserId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const targetMember = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: ctx.orgId, userId: targetUserId } },
  });

  // Can't remove the last OWNER
  if (targetMember?.role === "OWNER" && myMembership.role !== "OWNER") return forbidden();

  await prisma.organizationMember.deleteMany({
    where: { organizationId: ctx.orgId, userId: targetUserId },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const myMembership = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: ctx.orgId, userId: ctx.userId } },
  });
  if (!myMembership || myMembership.role !== "OWNER") return forbidden();

  const targetUserId = new URL(req.url).searchParams.get("userId");
  const { role } = await req.json() as { role?: string };
  const validRoles = ["OWNER", "ADMIN", "SPECIALIST"];
  if (!targetUserId || !validRoles.includes(role ?? "")) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const member = await prisma.organizationMember.update({
    where: { organizationId_userId: { organizationId: ctx.orgId, userId: targetUserId } },
    data: { role: role! },
  });

  return NextResponse.json(member);
}
