/**
 * POST /api/accounts/[id]/search-terms/exclude-offbrand
 * Adds specialist-approved terms as campaign-level broad-match negatives.
 * Called from SearchTermClassifier after the specialist selects queries.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { executeExcludeOffBrandQueries } from "@/lib/integrations/google-ads-actions";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;
  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  if (!account.googleAdsId) {
    return NextResponse.json({ error: "No Google Ads account linked" }, { status: 422 });
  }

  const body = await req.json() as { terms?: string[] };
  const terms = Array.isArray(body?.terms) ? body.terms.filter(Boolean) : [];

  if (terms.length === 0) {
    return NextResponse.json({ error: "No terms provided" }, { status: 400 });
  }

  try {
    const result = await executeExcludeOffBrandQueries(account.googleAdsId, { terms });
    return NextResponse.json({ result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Failed to add negatives: ${msg}` }, { status: 502 });
  }
}
