/**
 * POST /api/accounts/[id]/onboarded — mark the guided setup as completed (or
 * explicitly skipped). Body: { done: boolean }. Org-scoped. Null onboardedAt is
 * what makes the setup checklist show on the account page.
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
  const done = body?.done !== false;

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId }, select: { id: true } });
  if (!account) return forbidden();

  const updated = await prisma.account.update({
    where: { id },
    data: { onboardedAt: done ? new Date() : null },
    select: { onboardedAt: true },
  });
  return NextResponse.json({ onboardedAt: updated.onboardedAt });
}
