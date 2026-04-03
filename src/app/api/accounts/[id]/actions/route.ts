/**
 * GET  /api/accounts/[id]/actions — list all actions for the account
 * PATCH /api/accounts/[id]/actions — update a single action's workflow state
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  const actions = await prisma.actionRecommendation.findMany({
    where: { accountId: id },
    orderBy: [{ impact: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(actions);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  const { actionId, status, snoozedUntil, assignedTo, doneNote } = await req.json() as {
    actionId:     string;
    status?:      string;
    snoozedUntil?: string | null;
    assignedTo?:  string | null;
    doneNote?:    string | null;
  };

  const action = await prisma.actionRecommendation.findFirst({
    where: { id: actionId, accountId: id },
  });
  if (!action) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.actionRecommendation.update({
    where: { id: actionId },
    data: {
      ...(status      !== undefined ? { status }      : {}),
      ...(snoozedUntil !== undefined ? { snoozedUntil: snoozedUntil ? new Date(snoozedUntil) : null } : {}),
      ...(assignedTo  !== undefined ? { assignedTo }  : {}),
      ...(doneNote    !== undefined ? { doneNote }    : {}),
    },
  });

  return NextResponse.json(updated);
}
