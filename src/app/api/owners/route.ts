/**
 * GET   /api/owners — list owners (with their assigned account counts)
 * POST  /api/owners — create an owner { name, slackUserId?, isTeamLead? }
 * PATCH /api/owners?id=... — update { name?, slackUserId?, isTeamLead? }
 *
 * Owners are the AMs the ownership system DMs / @mentions. Set slackUserId to
 * each person's Slack member ID (U0123456789) so the bot can reach them.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const owners = await prisma.owner.findMany({
    where: { organizationId: ctx.orgId },
    include: { _count: { select: { accounts: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(owners);
}

export async function POST(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const body = await req.json() as { name?: string; slackUserId?: string | null; isTeamLead?: boolean };
  if (!body.name?.trim()) return NextResponse.json({ error: "name required" }, { status: 400 });

  try {
    const owner = await prisma.owner.create({
      data: {
        organizationId: ctx.orgId,
        name: body.name.trim(),
        slackUserId: body.slackUserId ?? null,
        isTeamLead: body.isTeamLead ?? false,
      },
    });
    return NextResponse.json(owner, { status: 201 });
  } catch {
    // Unique on (organizationId, name)
    return NextResponse.json({ error: "an owner with that name already exists" }, { status: 409 });
  }
}

export async function PATCH(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const existing = await prisma.owner.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!existing) return NextResponse.json({ error: "owner not found" }, { status: 404 });

  const body = await req.json() as { name?: string; slackUserId?: string | null; isTeamLead?: boolean };
  const owner = await prisma.owner.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.slackUserId !== undefined && { slackUserId: body.slackUserId }),
      ...(body.isTeamLead !== undefined && { isTeamLead: body.isTeamLead }),
    },
  });
  return NextResponse.json(owner);
}
