/**
 * POST /api/org/join-request — ask to join the team workspace (the org with
 * the most accounts). Idempotent: re-requesting while pending is a no-op; a
 * denied request can be re-opened.
 *
 * PATCH /api/org/join-request — decide one: { requestId, approve }. Only an
 * OWNER/ADMIN of the workspace being joined can decide. Approval creates the
 * SPECIALIST membership — the requester then switches (or next login lands
 * there automatically).
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const orgs = await prisma.organization.findMany({ select: { id: true, _count: { select: { accounts: true } } } });
  const main = orgs.sort((a, b) => b._count.accounts - a._count.accounts)[0];
  if (!main) return NextResponse.json({ error: "No workspace found." }, { status: 404 });
  if (main.id === ctx.orgId) return NextResponse.json({ error: "You're already in the team workspace." }, { status: 400 });

  const existingMember = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: main.id, userId: ctx.userId } },
  });
  if (existingMember) return NextResponse.json({ status: "member" });

  const req = await prisma.orgJoinRequest.upsert({
    where: { organizationId_userId: { organizationId: main.id, userId: ctx.userId } },
    create: { organizationId: main.id, userId: ctx.userId },
    update: { status: "pending", decidedBy: null, decidedAt: null },
  });
  return NextResponse.json({ status: req.status });
}

export async function PATCH(req: Request) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const body = await req.json().catch(() => ({})) as { requestId?: string; approve?: boolean };
  if (!body.requestId) return NextResponse.json({ error: "requestId required" }, { status: 400 });

  const request = await prisma.orgJoinRequest.findUnique({ where: { id: body.requestId } });
  if (!request || request.status !== "pending") return NextResponse.json({ error: "Request not found or already decided." }, { status: 404 });

  const decider = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: request.organizationId, userId: ctx.userId } },
    select: { role: true },
  });
  if (!decider || !["OWNER", "ADMIN"].includes(decider.role)) return forbidden();

  if (body.approve) {
    await prisma.organizationMember.upsert({
      where: { organizationId_userId: { organizationId: request.organizationId, userId: request.userId } },
      create: { organizationId: request.organizationId, userId: request.userId, role: "SPECIALIST" },
      update: {},
    });
  }
  await prisma.orgJoinRequest.update({
    where: { id: request.id },
    data: { status: body.approve ? "approved" : "denied", decidedBy: ctx.email, decidedAt: new Date() },
  });
  return NextResponse.json({ ok: true, status: body.approve ? "approved" : "denied" });
}
