/**
 * POST /api/accounts/[id]/worklist-done — tick (or untick) the account's nightly
 * worklist action. Body: { done: boolean }. Org-scoped. The nightly worklist run
 * clears this when it writes a new action, so "done" never carries over.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const done = !!body?.done;

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId }, select: { id: true } });
  if (!account) return forbidden();

  const updated = await prisma.account.update({
    where: { id },
    data: done ? { worklistDoneAt: new Date(), worklistDoneBy: ctx.email } : { worklistDoneAt: null, worklistDoneBy: null },
    select: { worklistDoneAt: true, worklistDoneBy: true },
  });
  return NextResponse.json({ doneAt: updated.worklistDoneAt, doneBy: updated.worklistDoneBy });
}
