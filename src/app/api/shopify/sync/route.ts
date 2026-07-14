/**
 * POST /api/shopify/sync — pull the order feed for one account on demand.
 * Body: { accountId: string, days?: number }. Session-scoped to the caller's org.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { ingestAccountOrders } from "@/lib/diagnostics/orders";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const accountId = typeof body?.accountId === "string" ? body.accountId : null;
  const days = Number.isFinite(Number(body?.days)) ? Math.min(365, Math.max(1, Math.floor(Number(body.days)))) : 60;
  if (!accountId) return NextResponse.json({ error: "accountId required" }, { status: 400 });

  const account = await prisma.account.findFirst({ where: { id: accountId, organizationId: ctx.orgId }, select: { id: true } });
  if (!account) return forbidden();

  const result = await ingestAccountOrders(accountId, days);
  return NextResponse.json(result);
}
