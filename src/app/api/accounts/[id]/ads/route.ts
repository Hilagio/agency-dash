/**
 * GET /api/accounts/[id]/ads
 * Returns all enabled RSAs for the account with asset performance labels.
 */
import { NextRequest, NextResponse } from "next/server";
import { GoogleAdsApi } from "google-ads-api";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export type AssetPerformanceLabel = "BEST" | "GOOD" | "LOW" | "LEARNING" | "UNSPECIFIED";
export type AdStrength = "EXCELLENT" | "GOOD" | "AVERAGE" | "POOR" | "PENDING" | "NO_ADS" | "LOADING" | "UNSPECIFIED";

export interface RsaAsset {
  text: string;
  pinnedField: string | null;
  performanceLabel: AssetPerformanceLabel;
}

export interface RsaAd {
  adId: string;
  adGroupId: string;
  adGroupName: string;
  campaignId: string;
  campaignName: string;
  adStrength: AdStrength;
  headlines: RsaAsset[];
  descriptions: RsaAsset[];
  clicks: number;
  impressions: number;
  conversions: number;
  costMicros: number;
}

function last30Days() {
  const fmt   = (d: Date) => d.toISOString().slice(0, 10);
  const end   = new Date(); end.setDate(end.getDate() - 1);
  const start = new Date(); start.setDate(start.getDate() - 30);
  return { start: fmt(start), end: fmt(end) };
}

const PERF_LABEL_MAP: Record<number, AssetPerformanceLabel> = {
  0: "UNSPECIFIED",
  1: "UNSPECIFIED",
  2: "LEARNING",
  3: "LOW",
  4: "GOOD",
  5: "BEST",
};

const AD_STRENGTH_MAP: Record<number, AdStrength> = {
  0: "UNSPECIFIED",
  1: "UNSPECIFIED",
  2: "LOADING",
  3: "NO_ADS",
  4: "POOR",
  5: "AVERAGE",
  6: "GOOD",
  7: "EXCELLENT",
  8: "PENDING",
};

function mapPerf(val: unknown): AssetPerformanceLabel {
  if (typeof val === "string") {
    const upper = val.toUpperCase() as AssetPerformanceLabel;
    const valid: AssetPerformanceLabel[] = ["BEST", "GOOD", "LOW", "LEARNING", "UNSPECIFIED"];
    return valid.includes(upper) ? upper : "UNSPECIFIED";
  }
  if (typeof val === "number") return PERF_LABEL_MAP[val] ?? "UNSPECIFIED";
  return "UNSPECIFIED";
}

function mapStrength(val: unknown): AdStrength {
  if (typeof val === "string") {
    const upper = val.toUpperCase() as AdStrength;
    const valid: AdStrength[] = ["EXCELLENT", "GOOD", "AVERAGE", "POOR", "PENDING", "NO_ADS", "LOADING", "UNSPECIFIED"];
    return valid.includes(upper) ? upper : "UNSPECIFIED";
  }
  if (typeof val === "number") return AD_STRENGTH_MAP[val] ?? "UNSPECIFIED";
  return "UNSPECIFIED";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseAssets(assets: any[]): RsaAsset[] {
  if (!Array.isArray(assets)) return [];
  return assets.map(a => ({
    text:             String(a?.text ?? ""),
    pinnedField:      a?.pinnedField ? String(a.pinnedField) : null,
    performanceLabel: mapPerf(a?.assetPerformanceLabel ?? a?.asset_performance_label),
  })).filter(a => a.text);
}

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;
  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  if (!account.googleAdsId) {
    return NextResponse.json({ error: "No Google Ads account linked" }, { status: 422 });
  }

  const cred = await prisma.oAuthCredential.findUnique({ where: { organizationId: ctx.orgId } }).catch(() => null);
  const refreshToken = cred?.refreshToken ?? process.env.GOOGLE_ADS_REFRESH_TOKEN;
  if (!refreshToken) {
    return NextResponse.json({ error: "Google Ads not connected" }, { status: 422 });
  }

  const client = new GoogleAdsApi({
    client_id:       process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });
  const customer = client.Customer({
    customer_id:       account.googleAdsId,
    login_customer_id: cred?.loginCustomerId ?? process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
    refresh_token:     refreshToken,
  });

  const { start, end } = last30Days();

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: any[] = await customer.query(`
      SELECT
        campaign.id,
        campaign.name,
        ad_group.id,
        ad_group.name,
        ad_group_ad.ad.id,
        ad_group_ad.ad.responsive_search_ad.headlines,
        ad_group_ad.ad.responsive_search_ad.descriptions,
        ad_group_ad.ad_strength,
        ad_group_ad.status,
        metrics.clicks,
        metrics.impressions,
        metrics.conversions,
        metrics.cost_micros
      FROM ad_group_ad
      WHERE ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'
        AND ad_group_ad.status = 'ENABLED'
        AND campaign.status = 'ENABLED'
        AND ad_group.status = 'ENABLED'
        AND segments.date BETWEEN '${start}' AND '${end}'
      LIMIT 200
    `);

    // Aggregate metrics per ad (rows are split by day)
    const adMap = new Map<string, RsaAd>();

    for (const row of rows) {
      const adId        = String(row.ad_group_ad?.ad?.id ?? row?.adGroupAd?.ad?.id ?? "");
      if (!adId) continue;

      if (!adMap.has(adId)) {
        const headlines    = row.ad_group_ad?.ad?.responsive_search_ad?.headlines
          ?? row?.adGroupAd?.ad?.responsiveSearchAd?.headlines ?? [];
        const descriptions = row.ad_group_ad?.ad?.responsive_search_ad?.descriptions
          ?? row?.adGroupAd?.ad?.responsiveSearchAd?.descriptions ?? [];
        const strength     = row.ad_group_ad?.ad_strength ?? row?.adGroupAd?.adStrength;

        adMap.set(adId, {
          adId,
          adGroupId:    String(row.ad_group?.id ?? row?.adGroup?.id ?? ""),
          adGroupName:  String(row.ad_group?.name ?? row?.adGroup?.name ?? ""),
          campaignId:   String(row.campaign?.id ?? ""),
          campaignName: String(row.campaign?.name ?? ""),
          adStrength:   mapStrength(strength),
          headlines:    parseAssets(headlines),
          descriptions: parseAssets(descriptions),
          clicks:       0,
          impressions:  0,
          conversions:  0,
          costMicros:   0,
        });
      }

      const entry = adMap.get(adId)!;
      entry.clicks      += Number(row.metrics?.clicks      ?? 0);
      entry.impressions += Number(row.metrics?.impressions ?? 0);
      entry.conversions += Number(row.metrics?.conversions ?? 0);
      entry.costMicros  += Number(row.metrics?.cost_micros ?? 0);
    }

    const ads = [...adMap.values()]
      .filter(a => a.headlines.length > 0)
      .sort((a, b) => b.clicks - a.clicks);

    return NextResponse.json({ ads });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Failed to fetch ads: ${msg}` }, { status: 502 });
  }
}
