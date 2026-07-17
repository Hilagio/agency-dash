/**
 * POST /api/shopify/disconnect — remove an account's Shopify connection.
 * Body: { accountId }. Session-scoped to the caller's org. Deletes the stored
 * token/connection so the account can be reconnected cleanly (e.g. to swap an
 * old permanent token for an expiring one). Historical OrderDaily rows are kept.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const accountId = typeof body?.accountId === "string" ? body.accountId : null;
  if (!accountId) return NextResponse.json({ error: "accountId required" }, { status: 400 });

  const account = await prisma.account.findFirst({ where: { id: accountId, organizationId: ctx.orgId }, select: { id: true } });
  if (!account) return forbidden();

  await prisma.shopifyConnection.deleteMany({ where: { accountId } });
  return NextResponse.json({ ok: true });
}
