/**
 * GET  /api/accounts/[id]/sop-progress — all SOP progress entries for this account
 * POST /api/accounts/[id]/sop-progress — toggle a step for a given sopId
 *
 * Body for POST: { sopId: string, stepIndex: number }
 * Toggles the step: adds it if not present, removes if already done.
 * Creates the progress record if it doesn't exist yet (upsert).
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

  const progress = await prisma.accountSopProgress.findMany({
    where: { accountId: id },
    include: { sop: { select: { id: true, title: true, content: true, isActive: true } } },
    orderBy: { startedAt: "asc" },
  });
  return NextResponse.json(progress);
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  const { sopId, stepIndex } = await req.json() as { sopId: string; stepIndex: number };

  // Verify SOP belongs to org
  const sop = await prisma.agencySop.findFirst({ where: { id: sopId, organizationId: ctx.orgId } });
  if (!sop) return forbidden();

  // Find or create progress record
  const existing = await prisma.accountSopProgress.findUnique({
    where: { accountId_sopId: { accountId: id, sopId } },
  });

  const completed: number[] = existing ? JSON.parse(existing.completedSteps) : [];
  const idx = completed.indexOf(stepIndex);

  // Toggle: add if missing, remove if already there
  const updated = idx === -1
    ? [...completed, stepIndex].sort((a, b) => a - b)
    : completed.filter(s => s !== stepIndex);

  const record = await prisma.accountSopProgress.upsert({
    where: { accountId_sopId: { accountId: id, sopId } },
    create: {
      accountId:      id,
      sopId,
      completedSteps: JSON.stringify(updated),
    },
    update: {
      completedSteps: JSON.stringify(updated),
    },
  });

  return NextResponse.json(record);
}
