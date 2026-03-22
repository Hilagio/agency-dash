/**
 * GET /api/accounts/[id]/search-terms
 * Fetches the last 30 days of search terms for an account, grouped by
 * recommendation (EXCLUDE / WATCH / KEEP) with cost attribution per campaign.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchSearchTermReport, isGoogleAdsConfigured } from "@/lib/integrations/google-ads";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const account = await prisma.account.findUnique({ where: { id } });
  if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

  if (!(await isGoogleAdsConfigured())) {
    return NextResponse.json({ error: "Google Ads not configured" }, { status: 422 });
  }

  try {
    const rows = await fetchSearchTermReport(account.googleAdsId);
    return NextResponse.json(rows);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Google Ads API error: ${msg}` }, { status: 502 });
  }
}
