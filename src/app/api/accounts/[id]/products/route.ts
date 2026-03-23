/**
 * GET /api/accounts/[id]/products
 *
 * Returns Shopping / PMax product performance for the last 30 days.
 * Includes campaign-level overview + per-product metrics.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchProductPerformance } from "@/lib/integrations/google-ads";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  try {
    const data = await fetchProductPerformance(account.googleAdsId, ctx.orgId);
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Google Ads API error: ${msg}` }, { status: 502 });
  }
}
