/**
 * POST /api/accounts/[id]/push-negatives
 *
 * Pushes a specialist-selected list of search terms as EXACT match negative
 * keywords directly to Google Ads — both Search and PMax campaigns.
 *
 * Body: {
 *   terms: Array<{
 *     searchTerm: string;
 *     campaignId: string;   // numeric Google Ads campaign ID
 *     source: "search" | "pmax";
 *   }>
 * }
 *
 * Returns: { pushed: number; skipped: number; log: string[] }
 */

import { NextRequest, NextResponse } from "next/server";
import { GoogleAdsApi, enums } from "google-ads-api";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

interface TermInput {
  searchTerm:  string;
  campaignId:  string;
  source:      "search" | "pmax";
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  // Verify account belongs to org
  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!account) return forbidden();

  const { terms } = await req.json() as { terms: TermInput[] };

  if (!Array.isArray(terms) || terms.length === 0) {
    return NextResponse.json({ error: "No terms provided" }, { status: 400 });
  }

  // Deduplicate: same term + same campaign = one negative
  const seen = new Set<string>();
  const dedupedTerms: TermInput[] = [];
  for (const t of terms) {
    const key = `${t.campaignId}::${t.searchTerm.trim().toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      dedupedTerms.push({ ...t, searchTerm: t.searchTerm.trim() });
    }
  }

  // Build Google Ads customer client — same credential lookup as google-ads.ts
  const cred = await prisma.oAuthCredential.findUnique({ where: { organizationId: ctx.orgId } }).catch(() => null)
    ?? await prisma.oAuthCredential.findFirst().catch(() => null);
  const refreshToken = cred?.refreshToken ?? process.env.GOOGLE_ADS_REFRESH_TOKEN;
  if (!refreshToken) {
    return NextResponse.json({ error: "Google Ads not connected" }, { status: 503 });
  }
  const loginCustomerId = cred?.loginCustomerId ?? process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID ?? undefined;

  const client = new GoogleAdsApi({
    client_id:       process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });
  const customer = client.Customer({
    customer_id:       account.googleAdsId,
    login_customer_id: loginCustomerId,
    refresh_token:     refreshToken,
  });

  // All negatives use EXACT match — prevents over-exclusion of related converting terms.
  // PMax supports EXACT match negatives via campaign_criterion (same as Search campaigns).
  const mutations: Parameters<typeof customer.mutateResources>[0] = dedupedTerms.map(t => ({
    entity:    "campaign_criterion",
    operation: "create",
    resource:  {
      campaign: `customers/${account.googleAdsId}/campaigns/${t.campaignId}`,
      negative: true,
      type:     enums.CriterionType.KEYWORD,
      keyword:  {
        text:       t.searchTerm,
        match_type: enums.KeywordMatchType.EXACT,
      },
    },
  }));

  const log: string[] = [];
  let pushed  = 0;
  let skipped = 0;

  try {
    const result = await customer.mutateResources(mutations, { partial_failure: true });

    // Count partial failures (e.g. already exists as negative)
    const failedCount = result.partial_failure_error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (result as any).partial_failure_error?.details?.length ?? 0
      : 0;

    pushed  = dedupedTerms.length - failedCount;
    skipped = failedCount;

    // Group by campaign for the log
    const byCampaign = new Map<string, string[]>();
    for (const t of dedupedTerms) {
      if (!byCampaign.has(t.campaignId)) byCampaign.set(t.campaignId, []);
      byCampaign.get(t.campaignId)!.push(t.searchTerm);
    }
    for (const [campId, termList] of byCampaign) {
      const term = dedupedTerms.find(t => t.campaignId === campId);
      log.push(`Campaign ${campId} (${term?.source ?? "?"}): added ${termList.length} EXACT negative(s) — ${termList.slice(0, 3).join(", ")}${termList.length > 3 ? ` +${termList.length - 3} more` : ""}`);
    }
    if (skipped > 0) {
      log.push(`${skipped} term(s) skipped — likely already exist as negatives`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Google Ads API error: ${msg}` }, { status: 502 });
  }

  return NextResponse.json({ pushed, skipped, log });
}
