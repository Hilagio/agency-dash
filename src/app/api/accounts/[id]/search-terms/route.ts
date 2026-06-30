/**
 * GET /api/accounts/[id]/search-terms
 * Fetches the last 90 days of search terms for an account, grouped by
 * recommendation (EXCLUDE / WATCH / KEEP) with cost attribution per campaign.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchSearchTermReport, isGoogleAdsConfigured, extractGoogleAdsError } from "@/lib/integrations/google-ads";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  if (!(await isGoogleAdsConfigured(ctx.orgId))) {
    return NextResponse.json({ error: "Google Ads not configured" }, { status: 422 });
  }

  try {
    const rows = await fetchSearchTermReport(account.googleAdsId, ctx.orgId);
    return NextResponse.json(rows);
  } catch (err) {
    const msg = extractGoogleAdsError(err);
    return NextResponse.json({ error: `Google Ads API error: ${msg}` }, { status: 502 });
  }
}
