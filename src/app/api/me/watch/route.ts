/**
 * POST /api/me/watch — toggle an account on the current user's "my accounts"
 * watchlist, so the portfolio can open focused on the accounts they work on.
 *
 * Body: { accountId: string, watch: boolean }
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const body = await req.json().catch(() => ({})) as { accountId?: string; watch?: boolean };
  const accountId = body.accountId?.trim();
  if (!accountId) return NextResponse.json({ error: "accountId is required." }, { status: 400 });

  // Only accounts in the caller's org can be watched.
  const account = await prisma.account.findFirst({
    where: { id: accountId, organizationId: ctx.orgId },
    select: { id: true },
  });
  if (!account) return forbidden();

  if (body.watch === false) {
    await prisma.accountWatch.deleteMany({ where: { userId: ctx.userId, accountId } });
    return NextResponse.json({ accountId, watched: false });
  }

  // Idempotent add.
  await prisma.accountWatch.upsert({
    where: { userId_accountId: { userId: ctx.userId, accountId } },
    create: { userId: ctx.userId, accountId },
    update: {},
  });
  return NextResponse.json({ accountId, watched: true });
}
