/**
 * Google Ads Signal Adapter
 *
 * Fetches all signals needed by the constraint scoring engine
 * for a single customer account over the last 30 days.
 *
 * Maps Google Ads API data → ConstraintSignals shape.
 *
 * Requires in .env:
 *   GOOGLE_ADS_DEVELOPER_TOKEN
 *   GOOGLE_ADS_CLIENT_ID
 *   GOOGLE_ADS_CLIENT_SECRET
 *   GOOGLE_ADS_REFRESH_TOKEN
 *   GOOGLE_ADS_CUSTOMER_ID         (the account to score)
 *   GOOGLE_ADS_LOGIN_CUSTOMER_ID   (MCC id, optional)
 */

import { GoogleAdsApi, Customer, enums } from "google-ads-api";
import { prisma } from "@/lib/db";
import {
  ConstraintSignals,
  MeasurementSignals,
  TrafficSignals,
  ConversionSignals,
  FunnelSignals,
  EconomicsSignals,
} from "@/lib/engine/types";

function safeQuery<T>(
  queryFn: () => Promise<T[]>,
  label: string
): Promise<T[]> {
  return queryFn().catch((err: unknown) => {
    console.warn(`[google-ads] ${label} failed:`, err instanceof Error ? err.message : err);
    return [];
  });
}

// ─── Client factory ───────────────────────────────────────────────────────────

function getClient(): GoogleAdsApi {
  return new GoogleAdsApi({
    client_id:       process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });
}

async function getRefreshToken(orgId?: string): Promise<string> {
  // DB token takes priority — it's always fresher than the env var
  const cred = orgId
    ? await prisma.oAuthCredential.findUnique({ where: { organizationId: orgId } }).catch(() => null)
    : await prisma.oAuthCredential.findFirst().catch(() => null);
  if (cred?.refreshToken) return cred.refreshToken;
  if (process.env.GOOGLE_ADS_REFRESH_TOKEN) return process.env.GOOGLE_ADS_REFRESH_TOKEN;
  throw new Error("No Google Ads refresh token configured. Complete OAuth at /api/auth/google-ads");
}

async function getLoginCustomerId(orgId?: string): Promise<string | undefined> {
  if (process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID) return process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;
  const cred = orgId
    ? await prisma.oAuthCredential.findUnique({ where: { organizationId: orgId } }).catch(() => null)
    : await prisma.oAuthCredential.findFirst().catch(() => null);
  return cred?.loginCustomerId ?? undefined;
}

async function getCustomer(client: GoogleAdsApi, customerId?: string, orgId?: string): Promise<Customer> {
  const refreshToken    = await getRefreshToken(orgId);
  const loginCustomerId = await getLoginCustomerId(orgId);
  return client.Customer({
    customer_id:       customerId ?? process.env.GOOGLE_ADS_CUSTOMER_ID!,
    login_customer_id: loginCustomerId,
    refresh_token:     refreshToken,
  });
}

// ─── Industry CVR benchmarks ──────────────────────────────────────────────────
// Sources: WordStream 2024, Google Ads benchmarks, industry-specific research.
// Higher specificity keys take priority in matching.
// CVR = macro conversions / clicks on the search network.

const INDUSTRY_CVR_BENCHMARKS: Record<string, number> = {
  // ── eCommerce verticals ────────────────────────────────────────────────────
  "ecommerce":             0.026,
  "fashion":               0.019,
  "fashion_retail":        0.019,
  "clothing":              0.019,
  "apparel":               0.019,
  "luxury_fashion":        0.012,
  "shoes":                 0.018,
  "accessories":           0.020,
  "jewelry":               0.014,
  "optics":                0.031,
  "glasses":               0.031,
  "eyewear":               0.031,
  "beauty":                0.024,
  "cosmetics":             0.024,
  "skincare":              0.023,
  "supplements":           0.027,
  "sport":                 0.022,
  "sporting_goods":        0.022,
  "outdoor":               0.021,
  "pets":                  0.028,
  "pet_supplies":          0.028,
  "baby":                  0.026,
  "toys":                  0.024,
  "electronics":           0.020,
  "computers":             0.018,
  "furniture":             0.014,
  "home_decor":            0.016,
  "kitchen":               0.024,
  "food":                  0.030,
  "grocery":               0.030,
  "wine":                  0.022,
  "horeca":                0.018,   // horeca supplies/equipment
  "catering":              0.018,
  "restaurant_supplies":   0.018,
  // ── B2C services ──────────────────────────────────────────────────────────
  "automotive":            0.064,
  "car_dealership":        0.055,
  "consumer_services":     0.065,
  "health":                0.036,
  "healthcare":            0.036,
  "dental":                0.042,
  "cosmetic_surgery":      0.025,
  "fitness":               0.038,
  "gym":                   0.038,
  "dating":                0.090,
  "travel":                0.035,
  "hotel":                 0.030,
  "vacation":              0.033,
  "home_improvement":      0.037,
  "cleaning":              0.055,
  "plumber":               0.075,
  "electrician":           0.070,
  "moving":                0.060,
  "photography":           0.045,
  "wedding":               0.040,
  // ── Education & courses ───────────────────────────────────────────────────
  "education":             0.055,
  "online_course":         0.065,
  "driving_school":        0.090, // High intent — people actively searching
  "language_school":       0.070,
  "university":            0.040,
  "tutoring":              0.075,
  // ── B2B ───────────────────────────────────────────────────────────────────
  "b2b":                   0.034,
  "saas":                  0.026,
  "software":              0.023,
  "technology":            0.023,
  "it_services":           0.028,
  "marketing_agency":      0.035,
  "recruitment":           0.057,
  "employment":            0.057,
  "industrial":            0.031,
  "manufacturing":         0.028,
  // ── Finance & legal ───────────────────────────────────────────────────────
  "finance":               0.056,
  "insurance":             0.054,
  "mortgage":              0.044,
  "accounting":            0.062,
  "legal":                 0.067,
  "lawyer":                0.067,
  // ── Real estate ───────────────────────────────────────────────────────────
  "real_estate":           0.024,
};

const DEFAULT_CVR_BENCHMARK = 0.035; // broad average across industries

/**
 * Country multipliers relative to US baseline (where most benchmark data originates).
 * Lower trust, lower card penetration, and higher price sensitivity reduce CVR.
 */
const COUNTRY_CVR_MULTIPLIER: Record<string, number> = {
  US: 1.00, CA: 0.95, AU: 0.88, NZ: 0.85,
  GB: 0.92, IE: 0.88,
  DE: 0.85, AT: 0.82, CH: 0.83,
  NL: 0.90, BE: 0.86, LU: 0.85,
  FR: 0.82, IT: 0.76, ES: 0.74, PT: 0.72,
  SE: 0.92, NO: 0.90, DK: 0.90, FI: 0.87,
  PL: 0.68, CZ: 0.66, SK: 0.63, HU: 0.63,
  RO: 0.58, BG: 0.55, HR: 0.60, SI: 0.65,
  GR: 0.65, CY: 0.68,
  TR: 0.55, ZA: 0.52,
  BR: 0.60, MX: 0.58, AR: 0.50,
  IN: 0.55, PH: 0.50, ID: 0.48, MY: 0.60,
  SG: 0.85, HK: 0.82, JP: 0.78, KR: 0.75,
  AE: 0.72, SA: 0.68, IL: 0.80,
};

/**
 * Business model multipliers — how the fulfilment/acquisition model affects CVR.
 * Dropshippers have lower CVR due to brand unfamiliarity; DTC brands higher.
 */
const BUSINESS_MODEL_CVR_MULTIPLIER: Record<string, number> = {
  dtc:          1.10, // own brand, higher trust
  marketplace:  1.15, // high-intent, price-competitive listings
  dropship:     0.55, // unrecognised brand, slow shipping, price shopped
  subscription: 0.75, // commitment friction reduces impulse conversions
  service:      1.00,
  lead_gen:     1.00, // lead-gen CVR benchmarks are already "lead" focused
};

/**
 * Maps IANA timezone strings to ISO country codes.
 * Only the most common zones per country are listed; falls back to undefined.
 */
function timezoneToCountry(tz: string): string | undefined {
  const map: Record<string, string> = {
    "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US",
    "America/Los_Angeles": "US", "America/Phoenix": "US", "America/Anchorage": "US",
    "America/Honolulu": "US", "America/Toronto": "CA", "America/Vancouver": "CA",
    "America/Winnipeg": "CA", "America/Halifax": "CA",
    "Europe/London": "GB", "Europe/Dublin": "IE",
    "Europe/Berlin": "DE", "Europe/Vienna": "AT", "Europe/Zurich": "CH",
    "Europe/Paris": "FR", "Europe/Brussels": "BE", "Europe/Luxembourg": "LU",
    "Europe/Amsterdam": "NL",
    "Europe/Warsaw": "PL", "Europe/Prague": "CZ", "Europe/Bratislava": "SK",
    "Europe/Budapest": "HU", "Europe/Bucharest": "RO", "Europe/Sofia": "BG",
    "Europe/Zagreb": "HR", "Europe/Ljubljana": "SI",
    "Europe/Madrid": "ES", "Europe/Lisbon": "PT", "Europe/Rome": "IT",
    "Europe/Athens": "GR", "Europe/Nicosia": "CY",
    "Europe/Stockholm": "SE", "Europe/Oslo": "NO", "Europe/Copenhagen": "DK",
    "Europe/Helsinki": "FI",
    "Europe/Istanbul": "TR", "Asia/Jerusalem": "IL",
    "Asia/Dubai": "AE", "Asia/Riyadh": "SA",
    "Asia/Kolkata": "IN", "Asia/Manila": "PH", "Asia/Jakarta": "ID",
    "Asia/Kuala_Lumpur": "MY", "Asia/Singapore": "SG",
    "Asia/Hong_Kong": "HK", "Asia/Tokyo": "JP", "Asia/Seoul": "KR",
    "America/Sao_Paulo": "BR", "America/Mexico_City": "MX",
    "America/Buenos_Aires": "AR",
    "Africa/Johannesburg": "ZA",
    "Australia/Sydney": "AU", "Australia/Melbourne": "AU",
    "Australia/Brisbane": "AU", "Pacific/Auckland": "NZ",
  };
  // Try exact match first, then prefix match (e.g. "America/New_York" → "US")
  return map[tz] ?? map[Object.keys(map).find(k => tz.startsWith(k.split("/")[0] + "/")) ?? ""];
}

function getIndustryCvrBenchmark(
  industry: string | null | undefined,
  country: string | null | undefined,
  businessModel: string | null | undefined,
): number {
  const key = (industry ?? "").toLowerCase().replace(/[^a-z_]/g, "_");
  const base = INDUSTRY_CVR_BENCHMARKS[key] ?? DEFAULT_CVR_BENCHMARK;
  const countryMul = COUNTRY_CVR_MULTIPLIER[country?.toUpperCase() ?? ""] ?? 1.0;
  const bizMul = BUSINESS_MODEL_CVR_MULTIPLIER[businessModel ?? ""] ?? 1.0;
  return base * countryMul * bizMul;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function last30Days(): { start: string; end: string } {
  const end   = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "-");
  return { start: fmt(start), end: fmt(end) };
}

function last90Days(): { start: string; end: string } {
  const end   = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 90);
  const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "-");
  return { start: fmt(start), end: fmt(end) };
}

/** Last 14 days — "recent" window for trend scoring */
function last14Days(): { start: string; end: string } {
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const end   = new Date(); end.setDate(end.getDate() - 1);  // yesterday (today incomplete)
  const start = new Date(); start.setDate(start.getDate() - 14);
  return { start: fmt(start), end: fmt(end) };
}

/** Days 15–180 — "baseline" window; excludes the recent 14 days so it is unaffected by current issues */
function days15to180(): { start: string; end: string } {
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const end   = new Date(); end.setDate(end.getDate() - 15);
  const start = new Date(); start.setDate(start.getDate() - 180);
  return { start: fmt(start), end: fmt(end) };
}

// ─── Measurement signals ──────────────────────────────────────────────────────

async function fetchMeasurementSignals(customer: Customer): Promise<MeasurementSignals> {
  // Conversion actions
  const convActions = await customer.query(`
    SELECT
      conversion_action.id,
      conversion_action.status,
      conversion_action.type,
      conversion_action.primary_for_goal
    FROM conversion_action
    WHERE conversion_action.status = 'ENABLED'
  `);

  const activeConversions = convActions.filter(
    (r) => r.conversion_action?.status === enums.ConversionActionStatus.ENABLED
  );
  const conversionTrackingActive = activeConversions.length > 0;

  // Check for enhanced conversions — must actually have the setting enabled,
  // not just be of WEBPAGE type (which is necessary but not sufficient).
  const ecActions = await safeQuery(
    () => customer.query(`
      SELECT
        conversion_action.id,
        conversion_action.enhanced_conversions_settings.enabled
      FROM conversion_action
      WHERE conversion_action.status = 'ENABLED'
        AND conversion_action.type = 'WEBPAGE'
    `),
    "enhanced conversions settings"
  );
  const ecEnabledActions = ecActions.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r) => (r.conversion_action as any)?.enhanced_conversions_settings?.enabled === true
  );
  const hasEnhancedConversions = ecEnabledActions.length > 0;

  // Detect enhanced conversion degradation — EC is enabled but conversion volume
  // for those specific actions has dropped significantly vs baseline.
  let enhancedConversionsDegraded = false;
  if (hasEnhancedConversions && ecEnabledActions.length > 0) {
    const ecActionIds = ecEnabledActions
      .map((r) => r.conversion_action?.id)
      .filter(Boolean)
      .join(",");
    const { start: ecStart, end: ecEnd } = last30Days();
    const ecDailyRows = await safeQuery(
      () => customer.query(`
        SELECT
          segments.date,
          metrics.conversions
        FROM conversion_action
        WHERE conversion_action.id IN (${ecActionIds})
          AND segments.date BETWEEN '${ecStart}' AND '${ecEnd}'
      `),
      "ec daily conversions"
    );
    const ecDailySorted = ecDailyRows
      .map((r) => ({
        date: String(r.segments?.date ?? ""),
        conversions: Number(r.metrics?.conversions ?? 0),
      }))
      .filter((r) => r.date)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (ecDailySorted.length >= 14) {
      const ecRecent   = ecDailySorted.slice(-7);
      const ecBaseline = ecDailySorted.slice(0, -7);
      const ecRecentAvg   = ecRecent.reduce((s, r) => s + r.conversions, 0) / ecRecent.length;
      const ecBaselineAvg = ecBaseline.reduce((s, r) => s + r.conversions, 0) / ecBaseline.length;
      // Flag as degraded if baseline had conversions and recent dropped ≥40%
      if (ecBaselineAvg > 0 && ecRecentAvg / ecBaselineAvg < 0.6) {
        enhancedConversionsDegraded = true;
      }
    }
  }

  // Tag coverage via campaign-level conversion tracking check
  // Approximated: campaigns with 0 conversions in 30 days vs. total
  const { start, end } = last30Days();
  const campaignConversions = await safeQuery(
    () => customer.query(`
      SELECT
        campaign.id,
        metrics.conversions
      FROM campaign
      WHERE campaign.status = 'ENABLED'
        AND segments.date BETWEEN '${start}' AND '${end}'
    `),
    "campaign conversions"
  );

  // ── Data-drop detection via daily conversion trend ───────────────────────
  // For 3rd-party API tracking (no GTM/GA4 tag to inspect), the most reliable
  // signal is whether conversions suddenly stopped arriving.
  // Method: compare last 7 days vs previous 21 days (daily average).
  // A drop ≥ 40% flags potential tracking breakage.
  const totalCampaigns = campaignConversions.length;
  const campaignsWithConversions = campaignConversions.filter(
    (r) => (r.metrics?.conversions ?? 0) > 0
  ).length;

  // Daily conversion volume over last 30 days — segmented by date
  const dailyConvRows = await safeQuery(
    () => customer.query(`
      SELECT
        segments.date,
        metrics.conversions
      FROM customer
      WHERE segments.date BETWEEN '${start}' AND '${end}'
    `),
    "daily conversions"
  );

  // Sort by date
  const dailySorted = dailyConvRows
    .map(r => ({
      date: String(r.segments?.date ?? ""),
      conversions: Number(r.metrics?.conversions ?? 0),
    }))
    .filter(r => r.date)
    .sort((a, b) => a.date.localeCompare(b.date));

  let tagCoveragePercent: number;

  if (dailySorted.length >= 14) {
    const recent   = dailySorted.slice(-7);
    const baseline = dailySorted.slice(0, -7);
    const recentAvg   = recent.reduce((s, r) => s + r.conversions, 0) / recent.length;
    const baselineAvg = baseline.reduce((s, r) => s + r.conversions, 0) / baseline.length;

    if (baselineAvg > 0) {
      // tagCoveragePercent = ratio of recent to baseline (capped at 1)
      tagCoveragePercent = Math.min(1, recentAvg / baselineAvg);
    } else if (recentAvg > 0) {
      tagCoveragePercent = 1; // no baseline but conversions are coming in — healthy
    } else {
      tagCoveragePercent = 0; // zero conversions across entire window — critical
    }
  } else {
    // Not enough days — fall back to campaign coverage proxy
    tagCoveragePercent = totalCampaigns > 0
      ? Math.min(1, (campaignsWithConversions / totalCampaigns) + 0.1)
      : 0;
  }

  // GA4 linked — two checks:
  //  1. google_analytics_link covers both UA and GA4 links from Google Ads' side
  //  2. Conversion actions of type GOOGLE_ANALYTICS_4 confirm an active GA4 linkage
  const analyticsLinks = await safeQuery(
    () => customer.query(`
      SELECT google_analytics_link.resource_name, google_analytics_link.type
      FROM google_analytics_link
    `),
    "GA4 links"
  );
  // Also check for GA4 conversion actions (most reliable signal — means GA4 is ACTIVELY firing)
  const ga4ConvActions = convActions.filter(
    (r) =>
      r.conversion_action?.type === enums.ConversionActionType.GOOGLE_ANALYTICS_4_CUSTOM ||
      r.conversion_action?.type === enums.ConversionActionType.GOOGLE_ANALYTICS_4_PURCHASE
  );
  const hasGa4Linked = analyticsLinks.length > 0 || ga4ConvActions.length > 0;

  // Merchant Center linked
  const merchantLinks = await safeQuery(
    () => customer.query(`
      SELECT merchant_center_link.id
      FROM merchant_center_link
      WHERE merchant_center_link.status = 'ENABLED'
    `),
    "merchant center links"
  );
  const hasMerchantCenterLinked = merchantLinks.length > 0;

  return {
    conversionTrackingActive,
    conversionActionsCount: activeConversions.length,
    hasEnhancedConversions,
    enhancedConversionsDegraded,
    tagCoveragePercent: Math.min(1, tagCoveragePercent + 0.1), // baseline buffer
    dateLagDays: 3, // Google Ads standard attribution lag
    hasGa4Linked,
    hasMerchantCenterLinked,
  };
}

// ─── Traffic signals ──────────────────────────────────────────────────────────

async function fetchTrafficSignals(customer: Customer): Promise<TrafficSignals> {
  // Impression share metrics are best over a longer window for statistical stability
  const { start, end } = last30Days();
  // CTR trend: recent 14d vs days 15–180 baseline
  const { start: r14start, end: r14end } = last14Days();
  const { start: bstart,   end: bend }   = days15to180();

  const rows = await customer.query(`
    SELECT
      metrics.search_impression_share,
      metrics.search_budget_lost_impression_share,
      metrics.search_rank_lost_impression_share,
      metrics.clicks,
      metrics.impressions,
      metrics.ctr,
      metrics.average_cpc,
      campaign.status
    FROM campaign
    WHERE campaign.status = 'ENABLED'
      AND segments.date BETWEEN '${start}' AND '${end}'
  `);

  // Aggregate across all enabled campaigns
  let totalClicks = 0;
  let totalImpressions = 0;
  let totalCost = 0;
  let isLostBudgetSum = 0;
  let isLostRankSum = 0;
  let isSum = 0;
  let rowCount = 0;

  for (const r of rows) {
    const m = r.metrics ?? {};
    totalClicks      += Number(m.clicks ?? 0);
    totalImpressions += Number(m.impressions ?? 0);
    totalCost        += Number(m.cost_micros ?? 0) / 1_000_000;
    isLostBudgetSum  += Number(m.search_budget_lost_impression_share ?? 0);
    isLostRankSum    += Number(m.search_rank_lost_impression_share ?? 0);
    isSum            += Number(m.search_impression_share ?? 0);
    rowCount++;
  }

  const avgIsLostBudget = rowCount > 0 ? isLostBudgetSum / rowCount : 0;
  const avgIsLostRank   = rowCount > 0 ? isLostRankSum   / rowCount : 0;
  const avgIs           = rowCount > 0 ? isSum           / rowCount : 0;
  const ctr             = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
  const avgCpc          = totalClicks > 0 ? totalCost / totalClicks : 0;

  // Quality Score — average across active keywords
  const qsRows = await safeQuery(
    () => customer.query(`
      SELECT
        ad_group_criterion.quality_info.quality_score
      FROM ad_group_criterion
      WHERE ad_group_criterion.type = 'KEYWORD'
        AND ad_group_criterion.status = 'ENABLED'
        AND ad_group_criterion.quality_info.quality_score IS NOT NULL
    `),
    "quality scores"
  );

  const qsValues = qsRows
    .map((r) => Number(r.ad_group_criterion?.quality_info?.quality_score ?? 0))
    .filter((v) => v > 0);
  const qualityScoreAvg = qsValues.length > 0
    ? qsValues.reduce((a, b) => a + b, 0) / qsValues.length
    : 7; // default if no data

  // Irrelevant query estimate — search terms with 0 conversions & low QS
  const searchTermRows = await safeQuery(
    () => customer.query(`
      SELECT
        search_term_view.search_term,
        metrics.clicks,
        metrics.conversions,
        metrics.cost_micros
      FROM search_term_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
        AND metrics.clicks > 5
    `),
    "search terms"
  );

  const totalSearchTermCost = searchTermRows.reduce(
    (sum, r) => sum + Number(r.metrics?.cost_micros ?? 0), 0
  );
  const irrelevantCost = searchTermRows
    .filter((r) => Number(r.metrics?.conversions ?? 0) === 0)
    .reduce((sum, r) => sum + Number(r.metrics?.cost_micros ?? 0), 0);
  const irrelevantQueryPercent = totalSearchTermCost > 0
    ? irrelevantCost / totalSearchTermCost
    : 0;

  // ── CTR trend: recent 14d vs days 15–180 baseline ────────────────────────
  const ctrBaselineRows = await safeQuery(
    () => customer.query(`
      SELECT metrics.clicks, metrics.impressions
      FROM customer
      WHERE segments.date BETWEEN '${bstart}' AND '${bend}'
    `),
    "CTR baseline 15–180d"
  );
  const baseImpressions = ctrBaselineRows.reduce((s, r) => s + Number(r.metrics?.impressions ?? 0), 0);
  const baseClicks      = ctrBaselineRows.reduce((s, r) => s + Number(r.metrics?.clicks ?? 0), 0);
  const clickThroughRateBaseline = baseImpressions >= 500 ? baseClicks / baseImpressions : 0;

  // Use 14-day window for reported CTR so it matches the trend baseline period
  const recentCtrRows = await safeQuery(
    () => customer.query(`
      SELECT metrics.clicks, metrics.impressions
      FROM customer
      WHERE segments.date BETWEEN '${r14start}' AND '${r14end}'
    `),
    "CTR recent 14d"
  );
  const recentImpressions = recentCtrRows.reduce((s, r) => s + Number(r.metrics?.impressions ?? 0), 0);
  const recentClicks14    = recentCtrRows.reduce((s, r) => s + Number(r.metrics?.clicks ?? 0), 0);
  const ctr14 = recentImpressions > 0 ? recentClicks14 / recentImpressions : ctr;

  return {
    impressionShareLost_budget:  Math.min(1, avgIsLostBudget),
    impressionShareLost_rank:    Math.min(1, avgIsLostRank),
    clickThroughRate:            ctr14,
    clickThroughRateBaseline,
    averageCpc:                  avgCpc,
    searchImpressionShare:       Math.min(1, avgIs),
    qualityScoreAvg,
    irrelevantQueryPercent:      Math.min(1, irrelevantQueryPercent),
  };
}

// ─── Conversion signals ───────────────────────────────────────────────────────

async function fetchConversionSignals(
  customer: Customer,
  industry?: string | null,
  country?: string | null,
  businessModel?: string | null,
): Promise<ConversionSignals> {
  const { start: r14start, end: r14end }  = last14Days();
  const { start: bstart,   end: bend }    = days15to180();

  // ── Recent 14-day CVR ──────────────────────────────────────────────────────
  const recentRows = await safeQuery(
    () => customer.query(`
      SELECT
        metrics.clicks,
        metrics.conversions,
        metrics.mobile_friendly_clicks_percentage
      FROM landing_page_view
      WHERE segments.date BETWEEN '${r14start}' AND '${r14end}'
    `),
    "landing page recent 14d"
  );

  const recentClicks      = recentRows.reduce((s, r) => s + Number(r.metrics?.clicks ?? 0), 0);
  const recentConversions = recentRows.reduce((s, r) => s + Number(r.metrics?.conversions ?? 0), 0);
  const conversionRate    = recentClicks > 0 ? recentConversions / recentClicks : 0;

  // ── Baseline CVR (days 15–180) ────────────────────────────────────────────
  // Queried from customer (account-level) because landing_page_view data thins out at 180d
  const baselineRows = await safeQuery(
    () => customer.query(`
      SELECT metrics.clicks, metrics.conversions
      FROM customer
      WHERE segments.date BETWEEN '${bstart}' AND '${bend}'
    `),
    "CVR baseline 15–180d"
  );
  const baselineClicks      = baselineRows.reduce((s, r) => s + Number(r.metrics?.clicks ?? 0), 0);
  const baselineConversions = baselineRows.reduce((s, r) => s + Number(r.metrics?.conversions ?? 0), 0);
  // Require ≥100 baseline clicks for a statistically meaningful rate
  const conversionRateBaseline = baselineClicks >= 100
    ? baselineConversions / baselineClicks
    : 0;

  // ── Landing page engagement ────────────────────────────────────────────────
  // Note: Google Ads API does not expose PageSpeed scores; mobile_friendly_clicks_percentage
  // is the share of mobile clicks that went to a mobile-friendly URL — NOT a speed score.
  // We surface it as-is but do not pretend it is a speed benchmark.
  const mobilePercents = recentRows
    .map((r) => Number(r.metrics?.mobile_friendly_clicks_percentage ?? 0))
    .filter((v) => v > 0);
  // 0 = no data (don't fabricate a default that triggers false penalties)
  const mobileSpeedScore = mobilePercents.length > 0
    ? Math.round(mobilePercents.reduce((a, b) => a + b, 0) / mobilePercents.length)
    : 0;

  // Average pages-per-session from the Ads API — only score when real data exists
  const lpRows = await safeQuery(
    () => customer.query(`
      SELECT metrics.average_page_views
      FROM landing_page_view
      WHERE segments.date BETWEEN '${r14start}' AND '${r14end}'
    `),
    "landing page views"
  );
  const realPageViewRows = lpRows.filter(r => Number(r.metrics?.average_page_views ?? 0) > 0);
  const avgPageViews = realPageViewRows.length > 0
    ? realPageViewRows.reduce((s, r) => s + Number(r.metrics?.average_page_views ?? 0), 0) / realPageViewRows.length
    : 0; // 0 = no data
  // Score: 0 = no data, 1.0 pages → 3/10, 2.0 → 6/10, 3.0+ → 9/10
  const landingPageScore = avgPageViews > 0 ? Math.min(10, Math.round(avgPageViews * 3)) : 0;
  // Bounce-rate proxy: only set when page view data is present and meaningful
  const bounceRateEstimate = avgPageViews > 0
    ? (avgPageViews < 1.2 ? 0.75 : avgPageViews < 1.8 ? 0.55 : 0.35)
    : 0; // 0 = not measured

  return {
    conversionRate,
    conversionRateBaseline,
    industryBenchmarkConversionRate: getIndustryCvrBenchmark(industry, country, businessModel),
    landingPageScore,
    mobileSpeedScore,
    bounceRateEstimate,
  };
}

// ─── Funnel signals ───────────────────────────────────────────────────────────

async function fetchFunnelSignals(customer: Customer): Promise<FunnelSignals> {
  const { start, end } = last30Days();

  // Cost per conversion (lead proxy)
  const rows = await safeQuery(
    () => customer.query(`
      SELECT
        metrics.cost_micros,
        metrics.conversions,
        metrics.cost_per_conversion
      FROM customer
      WHERE segments.date BETWEEN '${start}' AND '${end}'
    `),
    "funnel cost per conversion"
  );

  const totalCost        = rows.reduce((s, r) => s + Number(r.metrics?.cost_micros ?? 0), 0) / 1_000_000;
  const totalConversions = rows.reduce((s, r) => s + Number(r.metrics?.conversions ?? 0), 0);
  const costPerLead      = totalConversions > 0 ? totalCost / totalConversions : 0;

  // Offline conversions — check if any offline action type is configured
  const offlineActions = await safeQuery(
    () => customer.query(`
      SELECT conversion_action.type
      FROM conversion_action
      WHERE conversion_action.status = 'ENABLED'
        AND conversion_action.type IN (
          'UPLOAD_CLICKS',
          'UPLOAD_CALLS',
          'SALESFORCE',
          'ZAPIER'
        )
    `),
    "offline conversion actions"
  );

  return {
    costPerLead,
    targetCostPerLead: 0, // Set manually or from account config table
    leadToSaleRate:    0, // Requires CRM data — placeholder until offline imports active
    averageLeadQualityScore: 5, // Placeholder until CRM scoring available
    offlineConversionImportActive: offlineActions.length > 0,
  };
}

// ─── Economics signals ────────────────────────────────────────────────────────

async function fetchEconomicsSignals(customer: Customer): Promise<EconomicsSignals> {
  const { start: r14start, end: r14end } = last14Days();
  const { start: bstart,   end: bend }   = days15to180();

  // ── Recent 14-day performance ─────────────────────────────────────────────
  const rows = await safeQuery(
    () => customer.query(`
      SELECT
        metrics.cost_micros,
        metrics.conversions_value,
        metrics.conversions,
        campaign.target_roas.target_roas,
        campaign.target_cpa.target_cpa_micros,
        campaign.budget_amount_micros
      FROM campaign
      WHERE campaign.status = 'ENABLED'
        AND segments.date BETWEEN '${r14start}' AND '${r14end}'
    `),
    "economics campaign rows 14d"
  );

  const totalCost            = rows.reduce((s, r) => s + Number(r.metrics?.cost_micros ?? 0), 0) / 1_000_000;
  const totalConversionValue = rows.reduce((s, r) => s + Number(r.metrics?.conversions_value ?? 0), 0);
  const totalConversions     = rows.reduce((s, r) => s + Number(r.metrics?.conversions ?? 0), 0);

  const actualRoas = totalCost > 0 ? totalConversionValue / totalCost : 0;
  const actualCpa  = totalConversions > 0 ? totalCost / totalConversions : 0;

  // Target ROAS — average across campaigns
  const roasTargets = rows
    .map((r) => Number(r.campaign?.target_roas?.target_roas ?? 0))
    .filter((v) => v > 0);
  const targetRoas = roasTargets.length > 0
    ? roasTargets.reduce((a, b) => a + b, 0) / roasTargets.length
    : 0;

  // Target CPA
  const cpaTargets = rows
    .map((r) => Number(r.campaign?.target_cpa?.target_cpa_micros ?? 0) / 1_000_000)
    .filter((v) => v > 0);
  const targetCpa = cpaTargets.length > 0
    ? cpaTargets.reduce((a, b) => a + b, 0) / cpaTargets.length
    : 0;

  // ── Baseline ROAS/CPA (days 15–180) ──────────────────────────────────────
  const baselineRows = await safeQuery(
    () => customer.query(`
      SELECT metrics.cost_micros, metrics.conversions_value, metrics.conversions
      FROM customer
      WHERE segments.date BETWEEN '${bstart}' AND '${bend}'
    `),
    "economics baseline 15–180d"
  );
  const baseCost  = baselineRows.reduce((s, r) => s + Number(r.metrics?.cost_micros ?? 0), 0) / 1_000_000;
  const baseValue = baselineRows.reduce((s, r) => s + Number(r.metrics?.conversions_value ?? 0), 0);
  const baseConv  = baselineRows.reduce((s, r) => s + Number(r.metrics?.conversions ?? 0), 0);
  // Require ≥€50 spend for a meaningful baseline
  const actualRoasBaseline = baseCost >= 50 ? (baseCost > 0 ? baseValue / baseCost : 0) : 0;
  const actualCpaBaseline  = baseCost >= 50 ? (baseConv > 0 ? baseCost / baseConv : 0) : 0;

  // ── Budget utilization (30d for stable reading) ───────────────────────────
  const { start: b30start, end: b30end } = last30Days();
  const budgetRows = await safeQuery(
    () => customer.query(`
      SELECT campaign_budget.amount_micros, metrics.cost_micros
      FROM campaign
      WHERE campaign.status = 'ENABLED'
        AND segments.date BETWEEN '${b30start}' AND '${b30end}'
    `),
    "budget utilization"
  );
  const totalBudget = budgetRows.reduce(
    (s, r) => s + Number(r.campaign_budget?.amount_micros ?? 0), 0
  ) / 1_000_000;
  const totalCost30 = budgetRows.reduce((s, r) => s + Number(r.metrics?.cost_micros ?? 0), 0) / 1_000_000;
  const budgetUtilizationPercent = totalBudget > 0
    ? Math.min(1, totalCost30 / (totalBudget * 30))
    : 0.8;

  // AOV — computed from recent 14-day window
  const avgOrderValue = totalConversions > 0 ? totalConversionValue / totalConversions : 0;

  return {
    targetRoas,
    actualRoas,
    actualRoasBaseline,
    targetCpa,
    actualCpa,
    actualCpaBaseline,
    grossMarginPercent: 0,   // Requires Shopify/manual input — overridden in snapshot route
    ltv: 0,                  // Requires CRM — overridden in snapshot route if monthlyChurnRate set
    avgOrderValue,
    monthlyChurnRate: 0,     // Overridden in snapshot route from account.monthlyChurnRate
    budgetUtilizationPercent,
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function fetchGoogleAdsSignals(
  customerId?: string,
  industry?: string | null,
  orgId?: string,
  countryOverride?: string | null,
  businessModel?: string | null,
): Promise<ConstraintSignals> {
  const client   = getClient();

  const loginCustomerId = await getLoginCustomerId(orgId);
  console.log(`[google-ads] fetchGoogleAdsSignals customerId=${customerId} loginCustomerId=${loginCustomerId ?? "(none)"} orgId=${orgId}`);

  const customer = await getCustomer(client, customerId, orgId);

  // Auto-detect country from customer time_zone unless the account has an explicit override
  let country = countryOverride ?? null;
  if (!country) {
    const tzRows = await safeQuery(
      () => customer.query("SELECT customer.time_zone FROM customer LIMIT 1"),
      "customer time_zone"
    );
    const tz = tzRows[0]?.customer?.time_zone as string | undefined;
    country = (tz ? timezoneToCountry(tz) : null) ?? null;
    if (country) console.log(`[google-ads] auto-detected country=${country} from tz=${tz}`);
  }

  const [measurement, traffic, conversion, funnel, economics] = await Promise.all([
    fetchMeasurementSignals(customer),
    fetchTrafficSignals(customer),
    fetchConversionSignals(customer, industry, country, businessModel),
    fetchFunnelSignals(customer),
    fetchEconomicsSignals(customer),
  ]);

  console.log(`[google-ads] fetchGoogleAdsSignals done for ${customerId} country=${country ?? "(unknown)"} businessModel=${businessModel ?? "(unset)"}`);
  return { measurement, traffic, conversion, funnel, economics };
}

// ─── Product Performance Report ──────────────────────────────────────────────

export interface ProductRow {
  itemId:      string;
  title:       string;
  brand:       string;
  clicks:      number;
  impressions: number;
  ctr:         number;
  conversions: number;
  revenue:     number;  // conversions_value in account currency
  cost:        number;
  roas:        number;  // revenue / cost (0 if no cost)
  cpc:         number;
}

export interface ShoppingOverview {
  hasShoppingCampaigns: boolean;
  campaignCount:        number;
  totalCost:            number;
  totalRevenue:         number;
  totalConversions:     number;
  roas:                 number;
  isLostBudget:         number;  // avg impression share lost to budget
  isLostRank:           number;  // avg impression share lost to rank
  disapprovedCount:     number;
  products:             ProductRow[];
}

export async function fetchProductPerformance(customerId: string, orgId?: string): Promise<ShoppingOverview> {
  const client   = getClient();
  const customer = await getCustomer(client, customerId, orgId);
  const { start, end } = last30Days();

  // ── Shopping / PMax campaign overview ────────────────────────────────────
  const campaignRows = await safeQuery(
    () => customer.query(`
      SELECT
        campaign.id,
        campaign.name,
        campaign.advertising_channel_type,
        metrics.cost_micros,
        metrics.conversions_value,
        metrics.conversions,
        metrics.search_budget_lost_impression_share,
        metrics.search_rank_lost_impression_share
      FROM campaign
      WHERE campaign.status = 'ENABLED'
        AND campaign.advertising_channel_type IN ('SHOPPING', 'PERFORMANCE_MAX')
        AND segments.date BETWEEN '${start}' AND '${end}'
    `),
    "shopping campaigns"
  );

  if (campaignRows.length === 0) {
    return {
      hasShoppingCampaigns: false,
      campaignCount: 0, totalCost: 0, totalRevenue: 0, totalConversions: 0,
      roas: 0, isLostBudget: 0, isLostRank: 0, disapprovedCount: 0, products: [],
    };
  }

  const totalCost        = campaignRows.reduce((s, r) => s + Number(r.metrics?.cost_micros ?? 0), 0) / 1_000_000;
  const totalRevenue     = campaignRows.reduce((s, r) => s + Number(r.metrics?.conversions_value ?? 0), 0);
  const totalConversions = campaignRows.reduce((s, r) => s + Number(r.metrics?.conversions ?? 0), 0);
  const isLostBudget     = campaignRows.reduce((s, r) => s + Number(r.metrics?.search_budget_lost_impression_share ?? 0), 0) / campaignRows.length;
  const isLostRank       = campaignRows.reduce((s, r) => s + Number(r.metrics?.search_rank_lost_impression_share ?? 0), 0) / campaignRows.length;

  // ── Product-level performance ─────────────────────────────────────────────
  const productRows = await safeQuery(
    () => customer.query(`
      SELECT
        segments.product_item_id,
        segments.product_title,
        segments.product_brand,
        metrics.clicks,
        metrics.impressions,
        metrics.ctr,
        metrics.conversions,
        metrics.conversions_value,
        metrics.cost_micros
      FROM shopping_performance_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
        AND metrics.impressions > 0
    `),
    "shopping product performance"
  );

  // Aggregate by product item ID (same product can appear across campaigns)
  const productMap = new Map<string, ProductRow>();
  for (const r of productRows) {
    const itemId = String(r.segments?.product_item_id ?? "unknown");
    const title  = String(r.segments?.product_title  ?? "Unknown product");
    const brand  = String(r.segments?.product_brand  ?? "");
    const clicks      = Number(r.metrics?.clicks           ?? 0);
    const impressions = Number(r.metrics?.impressions       ?? 0);
    const conversions = Number(r.metrics?.conversions       ?? 0);
    const revenue     = Number(r.metrics?.conversions_value ?? 0);
    const cost        = Number(r.metrics?.cost_micros       ?? 0) / 1_000_000;

    const existing = productMap.get(itemId);
    if (existing) {
      existing.clicks      += clicks;
      existing.impressions += impressions;
      existing.conversions += conversions;
      existing.revenue     += revenue;
      existing.cost        += cost;
    } else {
      productMap.set(itemId, { itemId, title, brand, clicks, impressions, ctr: 0, conversions, revenue, cost, roas: 0, cpc: 0 });
    }
  }

  // Compute derived metrics
  const products: ProductRow[] = Array.from(productMap.values()).map(p => ({
    ...p,
    ctr:  p.impressions > 0 ? p.clicks / p.impressions : 0,
    roas: p.cost > 0 ? p.revenue / p.cost : 0,
    cpc:  p.clicks > 0 ? p.cost / p.clicks : 0,
  }));

  // Sort by revenue desc, take top 50
  products.sort((a, b) => b.revenue - a.revenue);

  // ── Disapproved products ──────────────────────────────────────────────────
  const disapprovedRows = await safeQuery(
    () => customer.query(`
      SELECT shopping_product.item_id
      FROM shopping_product
      WHERE shopping_product.status = 'DISAPPROVED'
    `),
    "disapproved products"
  );
  const disapprovedCount = disapprovedRows.length;

  return {
    hasShoppingCampaigns: true,
    campaignCount: new Set(campaignRows.map(r => String(r.campaign?.id))).size,
    totalCost,
    totalRevenue,
    totalConversions,
    roas: totalCost > 0 ? totalRevenue / totalCost : 0,
    isLostBudget:  Math.min(1, isLostBudget),
    isLostRank:    Math.min(1, isLostRank),
    disapprovedCount,
    products: products.slice(0, 50),
  };
}

// ─── Search Term Report ───────────────────────────────────────────────────────

export interface SearchTermRow {
  searchTerm:   string;
  campaignId:   string;
  campaignName: string;
  clicks:       number;
  conversions:  number;
  costEur:      number; // cost in account currency
  recommendation: "EXCLUDE" | "WATCH" | "KEEP";
}

// Thresholds for search term classification (90-day window):
//   EXCLUDE — zero conversions and spent > €30: meaningful budget leak worth acting on
//   WATCH   — zero conversions and spent > €5:  accumulating spend, keep an eye on it
//   KEEP    — has conversions or minimal spend: leave alone
const EXCLUDE_COST_THRESHOLD = 30;
const WATCH_COST_THRESHOLD   = 5;

export async function fetchSearchTermReport(customerId: string, orgId?: string): Promise<SearchTermRow[]> {
  const client   = getClient();
  const customer = await getCustomer(client, customerId, orgId);
  const { start, end } = last90Days(); // 90-day window for meaningful spend signal

  const rows = await safeQuery(
    () => customer.query(`
      SELECT
        search_term_view.search_term,
        search_term_view.status,
        campaign.id,
        campaign.name,
        metrics.clicks,
        metrics.conversions,
        metrics.cost_micros
      FROM search_term_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
        AND metrics.clicks >= 1
        AND search_term_view.status != 'EXCLUDED'
    `),
    "search term report"
  );

  return rows
    .map((r): SearchTermRow => {
      const clicks      = Number(r.metrics?.clicks      ?? 0);
      const conversions = Number(r.metrics?.conversions  ?? 0);
      const costEur     = Number(r.metrics?.cost_micros  ?? 0) / 1_000_000;

      // Cost-based thresholds: only flag when there's meaningful spend to recover
      const recommendation: SearchTermRow["recommendation"] =
        conversions === 0 && costEur >= EXCLUDE_COST_THRESHOLD ? "EXCLUDE" :
        conversions === 0 && costEur >= WATCH_COST_THRESHOLD   ? "WATCH"   : "KEEP";

      return {
        searchTerm:   r.search_term_view?.search_term ?? "",
        campaignId:   String(r.campaign?.id   ?? ""),
        campaignName: r.campaign?.name ?? "Unknown campaign",
        clicks,
        conversions,
        costEur,
        recommendation,
      };
    })
    .filter(r => r.searchTerm.length > 0)
    .sort((a, b) => b.costEur - a.costEur); // highest spend first
}

export async function isGoogleAdsConfigured(orgId?: string): Promise<boolean> {
  const hasEnvToken = !!(
    process.env.GOOGLE_ADS_DEVELOPER_TOKEN &&
    process.env.GOOGLE_ADS_CLIENT_ID &&
    process.env.GOOGLE_ADS_CLIENT_SECRET &&
    process.env.GOOGLE_ADS_REFRESH_TOKEN &&
    process.env.GOOGLE_ADS_CUSTOMER_ID
  );
  if (hasEnvToken) return true;

  // Fall back to DB-stored credentials
  if (
    process.env.GOOGLE_ADS_DEVELOPER_TOKEN &&
    process.env.GOOGLE_ADS_CLIENT_ID &&
    process.env.GOOGLE_ADS_CLIENT_SECRET
  ) {
    const cred = orgId
      ? await prisma.oAuthCredential.findUnique({ where: { organizationId: orgId } }).catch(() => null)
      : await prisma.oAuthCredential.findFirst().catch(() => null);
    return !!(cred?.refreshToken);
  }
  return false;
}
