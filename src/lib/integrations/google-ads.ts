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

import { GoogleAdsApi, Customer, enums, errors as gadsErrors } from "google-ads-api";
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
  label: string,
  timeoutMs = 15_000
): Promise<T[]> {
  const timeout = new Promise<T[]>((_, reject) =>
    setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs)
  );
  return Promise.race([queryFn(), timeout]).catch((err: unknown) => {
    console.warn(`[google-ads] ${label} failed:`, extractGoogleAdsError(err));
    return [];
  });
}

/** Extract a human-readable message from any error shape the Google Ads library may throw. */
export function extractGoogleAdsError(err: unknown): string {
  // Use the library's documented instanceof check (google-ads-api README pattern).
  // GoogleAdsFailure has `errors: GoogleAdsError[]` where each entry has
  // `message: string` and `error_code` (snake_case, not camelCase).
  if (err instanceof gadsErrors.GoogleAdsFailure) {
    const msgs = err.errors.map((e) => {
      if (e.message) return e.message;
      // Fallback: find the non-zero entry in the ErrorCode oneof (snake_case keys)
      const code = e.error_code as Record<string, unknown> | undefined;
      if (code && typeof code === "object") {
        const entry = Object.entries(code).find(([, v]) => v != null && v !== 0);
        if (entry) return `${entry[0]}: ${entry[1]}`;
      }
      return "(no message)";
    });
    return msgs.join("; ") || "GoogleAdsFailure (empty errors array)";
  }
  if (err instanceof Error) return err.message || err.toString();
  if (typeof err === "string") return err || "(empty string)";
  if (typeof err === "object" && err !== null) {
    const e = err as Record<string, unknown>;
    if (typeof e.message === "string" && e.message) return e.message;
    try {
      const json = JSON.stringify(err);
      if (json && json !== "{}") return json;
    } catch { /* circular */ }
    const keys = Object.keys(e);
    console.error("[extractGoogleAdsError] unknown shape — keys:", keys, "ctor:", (err as object).constructor?.name);
    return keys.length ? `UnknownError(${keys.join(",")})` : "UnknownError";
  }
  return `UnknownError(${typeof err})`;
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
  const fmt   = (d: Date) => d.toISOString().slice(0, 10);
  const end   = new Date(); end.setDate(end.getDate() - 1);   // yesterday — today is incomplete
  const start = new Date(); start.setDate(start.getDate() - 30);
  return { start: fmt(start), end: fmt(end) };
}

function last90Days(): { start: string; end: string } {
  const fmt   = (d: Date) => d.toISOString().slice(0, 10);
  const end   = new Date(); end.setDate(end.getDate() - 1);
  const start = new Date(); start.setDate(start.getDate() - 90);
  return { start: fmt(start), end: fmt(end) };
}

/** Last 180 days — used for non-converting keyword detection (longer window = higher confidence) */
function last180Days(): { start: string; end: string } {
  const fmt   = (d: Date) => d.toISOString().slice(0, 10);
  const end   = new Date(); end.setDate(end.getDate() - 1);
  const start = new Date(); start.setDate(start.getDate() - 180);
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
  // Conversion actions — include last_conversion_date for staleness detection
  // Wrapped in safeQuery so a permissions/auth error on this table doesn't kill the entire scorer.
  const convActions = await safeQuery(
    () => customer.query(`
      SELECT
        conversion_action.id,
        conversion_action.status,
        conversion_action.type,
        conversion_action.primary_for_goal,
        conversion_action.last_conversion_date
      FROM conversion_action
      WHERE conversion_action.status = 'ENABLED'
    `),
    "conversion_action list"
  );

  const activeConversions = convActions.filter(
    (r) => r.conversion_action?.status === enums.ConversionActionStatus.ENABLED
  );
  const conversionTrackingActive = activeConversions.length > 0;

  // Check for enhanced conversions — check ALL enabled conversion action types,
  // not just WEBPAGE. Shopify pixel, server-side, and GA4-imported conversions
  // use different types but can still have EC enabled. If no WEBPAGE actions exist
  // at all we cannot confirm EC status, so we treat it as unknown (not flagged).
  const ecActions = await safeQuery(
    () => customer.query(`
      SELECT
        conversion_action.id,
        conversion_action.type,
        conversion_action.enhanced_conversions_settings.enabled
      FROM conversion_action
      WHERE conversion_action.status = 'ENABLED'
    `),
    "enhanced conversions settings"
  );
  const webpageActions = ecActions.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r) => (r.conversion_action as any)?.type === "WEBPAGE"
  );
  const ecEnabledActions = ecActions.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r) => (r.conversion_action as any)?.enhanced_conversions_settings?.enabled === true
  );
  // Only flag as missing if we found WEBPAGE actions and none have EC enabled.
  // If there are no WEBPAGE actions, tracking is via a different mechanism
  // (server-side, GA4 import, etc.) and we can't determine EC status reliably.
  const hasEnhancedConversions = ecEnabledActions.length > 0 || webpageActions.length === 0;

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

  // Conversion staleness: enabled actions that have never fired or haven't fired in 90+ days
  const today = new Date();
  let staleConversionCount = 0;
  let neverFiredConversionCount = 0;
  for (const row of activeConversions) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lastDate = (row.conversion_action as any)?.last_conversion_date as string | null | undefined;
    if (!lastDate) {
      neverFiredConversionCount++;
    } else {
      const daysAgo = Math.floor((today.getTime() - new Date(lastDate).getTime()) / 86_400_000);
      if (daysAgo > 90) staleConversionCount++;
    }
  }

  return {
    conversionTrackingActive,
    conversionActionsCount: activeConversions.length,
    hasEnhancedConversions,
    enhancedConversionsDegraded,
    tagCoveragePercent: Math.min(1, tagCoveragePercent + 0.1), // baseline buffer
    dateLagDays: 3, // Google Ads standard attribution lag
    hasGa4Linked,
    hasMerchantCenterLinked,
    staleConversionCount,
    neverFiredConversionCount,
  };
}

// ─── Traffic signals ──────────────────────────────────────────────────────────

async function fetchTrafficSignals(customer: Customer): Promise<TrafficSignals> {
  const { start, end } = last30Days();
  const { start: r14start, end: r14end } = last14Days();
  const { start: bstart,   end: bend }   = days15to180();

  // ── Search/Shopping campaigns: IS metrics are only valid for these types ──
  // PMax campaigns return 0 for search_impression_share — averaging them in
  // produces misleading values. Query Search + Shopping only.
  // Also fetch campaign.id, campaign.name, campaign_budget.amount_micros for
  // per-campaign budget constraint detection.
  const searchShoppingRows = await safeQuery(
    () => customer.query(`
      SELECT
        campaign.id,
        campaign.name,
        campaign_budget.amount_micros,
        metrics.search_impression_share,
        metrics.search_budget_lost_impression_share,
        metrics.search_rank_lost_impression_share,
        metrics.clicks,
        metrics.impressions,
        metrics.cost_micros,
        metrics.average_cpc
      FROM campaign
      WHERE campaign.status = 'ENABLED'
        AND campaign.advertising_channel_type IN ('SEARCH', 'SHOPPING')
        AND segments.date BETWEEN '${start}' AND '${end}'
    `),
    "IS metrics search/shopping"
  );

  // ── All campaigns: for account-level CTR and total spend ──────────────────
  const allCampaignRows = await safeQuery(
    () => customer.query(`
      SELECT
        metrics.clicks,
        metrics.impressions,
        metrics.cost_micros,
        campaign.advertising_channel_type
      FROM campaign
      WHERE campaign.status = 'ENABLED'
        AND segments.date BETWEEN '${start}' AND '${end}'
    `),
    "all campaign spend"
  );

  // ── PMax channel breakdown: detect Display/YouTube spend ─────────────────
  // segments.ad_network_type shows where PMax actually served:
  //   SEARCH, SEARCH_PARTNERS = intent-based (expected for feed-only)
  //   CONTENT = Display Network (unexpected for feed-only — money leak)
  //   YOUTUBE_WATCH, YOUTUBE_SEARCH = YouTube (unexpected for feed-only)
  const pmaxChannelRows = await safeQuery(
    () => customer.query(`
      SELECT
        segments.ad_network_type,
        metrics.cost_micros
      FROM campaign
      WHERE campaign.status = 'ENABLED'
        AND campaign.advertising_channel_type = 'PERFORMANCE_MAX'
        AND segments.date BETWEEN '${start}' AND '${end}'
    `),
    "pmax channel breakdown"
  );

  // Aggregate IS metrics (Search/Shopping only) — account-level + per-campaign
  let isLostBudgetSum = 0, isLostRankSum = 0, isSum = 0, isRowCount = 0;
  let ssClicks = 0, ssImpressions = 0, ssCost = 0;

  // Per-campaign: track IS-lost-to-budget and daily budget separately.
  // One row per campaign per day — group by campaign.id.
  const campaignBudgetMap = new Map<string, {
    name: string; isLostBudgetSum: number; rows: number; dailyBudget: number;
  }>();

  for (const r of searchShoppingRows) {
    const m = r.metrics ?? {};
    ssClicks      += Number(m.clicks ?? 0);
    ssImpressions += Number(m.impressions ?? 0);
    ssCost        += Number(m.cost_micros ?? 0) / 1_000_000;
    isLostBudgetSum += Number(m.search_budget_lost_impression_share ?? 0);
    isLostRankSum   += Number(m.search_rank_lost_impression_share   ?? 0);
    isSum           += Number(m.search_impression_share             ?? 0);
    isRowCount++;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const campaignId   = String((r.campaign as any)?.id   ?? "");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const campaignName = String((r.campaign as any)?.name ?? "");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dailyBudget  = Number((r.campaign_budget as any)?.amount_micros ?? 0) / 1_000_000;
    if (campaignId) {
      const entry = campaignBudgetMap.get(campaignId)
        ?? { name: campaignName, isLostBudgetSum: 0, rows: 0, dailyBudget };
      entry.isLostBudgetSum += Number(m.search_budget_lost_impression_share ?? 0);
      entry.rows++;
      entry.dailyBudget = dailyBudget; // same value each day — just keep latest
      campaignBudgetMap.set(campaignId, entry);
    }
  }
  const avgIsLostBudget = isRowCount > 0 ? isLostBudgetSum / isRowCount : 0;
  const avgIsLostRank   = isRowCount > 0 ? isLostRankSum   / isRowCount : 0;
  const avgIs           = isRowCount > 0 ? isSum           / isRowCount : 0;

  // Build budget-constrained campaigns (avg IS-lost-to-budget > 15%)
  const budgetConstrainedCampaigns = [...campaignBudgetMap.entries()]
    .map(([id, d]) => {
      const avgIsBudget = d.rows > 0 ? d.isLostBudgetSum / d.rows : 0;
      const suggestedDailyBudget = d.dailyBudget > 0 && avgIsBudget > 0.01
        ? Math.ceil(d.dailyBudget / Math.max(0.01, 1 - avgIsBudget) / 50) * 50
        : null;
      return {
        campaignId:         id,
        campaignName:       d.name,
        currentDailyBudget: d.dailyBudget,
        isLostBudget:       Math.min(1, avgIsBudget),
        suggestedDailyBudget,
      };
    })
    .filter(c => c.isLostBudget > 0.15 && c.currentDailyBudget > 0)
    .sort((a, b) => b.isLostBudget - a.isLostBudget);

  // Account-level totals (all campaigns)
  let totalClicks = 0, totalImpressions = 0, totalCost = 0, pmaxCost = 0;
  for (const r of allCampaignRows) {
    const m   = r.metrics ?? {};
    const cost = Number(m.cost_micros ?? 0) / 1_000_000;
    totalClicks      += Number(m.clicks ?? 0);
    totalImpressions += Number(m.impressions ?? 0);
    totalCost        += cost;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((r.campaign as any)?.advertising_channel_type === "PERFORMANCE_MAX") {
      pmaxCost += cost;
    }
  }
  const ctr    = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
  const avgCpc = totalClicks > 0 ? totalCost / totalClicks : 0;

  // PMax presence and channel breakdown
  const isPmaxPrimary = totalCost > 0 && pmaxCost / totalCost > 0.5;
  let pmaxTotalCost = 0, pmaxDisplayYoutubeCost = 0;
  for (const r of pmaxChannelRows) {
    const cost    = Number(r.metrics?.cost_micros ?? 0) / 1_000_000;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const network = String((r.segments as any)?.ad_network_type ?? "");
    pmaxTotalCost += cost;
    // CONTENT = Display Network; YOUTUBE_WATCH / YOUTUBE_SEARCH = YouTube
    if (network === "CONTENT" || network === "YOUTUBE_WATCH" || network === "YOUTUBE_SEARCH") {
      pmaxDisplayYoutubeCost += cost;
    }
  }
  const pmaxDisplayYoutubePercent = pmaxTotalCost > 0
    ? pmaxDisplayYoutubeCost / pmaxTotalCost
    : 0;

  // Quality Score — average across active keywords in SEARCH campaigns only.
  // Excluding Display/PMax keywords which receive artificially low QS (1–3)
  // and would drag the average down without being actionable.
  const qsRows = await safeQuery(
    () => customer.query(`
      SELECT
        ad_group_criterion.quality_info.quality_score
      FROM ad_group_criterion
      WHERE ad_group_criterion.type = 'KEYWORD'
        AND ad_group_criterion.status = 'ENABLED'
        AND campaign.advertising_channel_type = 'SEARCH'
        AND campaign.status = 'ENABLED'
        AND ad_group.status = 'ENABLED'
        AND ad_group_criterion.quality_info.quality_score IS NOT NULL
      LIMIT 5000
    `),
    "quality scores"
  );

  const qsValues = qsRows
    .map((r) => Number(r.ad_group_criterion?.quality_info?.quality_score ?? 0))
    .filter((v) => v > 0);
  const qualityScoreCount = qsValues.length;
  const qualityScoreAvg = qsValues.length > 0
    ? qsValues.reduce((a, b) => a + b, 0) / qsValues.length
    : 7; // default if no Search campaigns

  // Product disapproval rate — relevant for Shopping / PMax feed-only accounts.
  // Capped at 10 000 rows to avoid loading entire large catalogues into memory.
  // Sampling 10k products is more than sufficient for a meaningful disapproval rate.
  const allProductRows = await safeQuery(
    () => customer.query(`
      SELECT shopping_product.item_id, shopping_product.status
      FROM shopping_product
      LIMIT 10000
    `),
    "product statuses"
  );
  const totalProducts      = allProductRows.length;
  const disapprovedProducts = allProductRows.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r) => (r as any).shopping_product?.status === "DISAPPROVED"
  ).length;
  const productDisapprovalRate = totalProducts > 0 ? disapprovedProducts / totalProducts : 0;

  // Irrelevant query estimate — search terms with 0 conversions.
  // Capped at 5 000 rows; raise click threshold to reduce set size.
  const searchTermRows = await safeQuery(
    () => customer.query(`
      SELECT
        search_term_view.search_term,
        metrics.clicks,
        metrics.conversions,
        metrics.cost_micros
      FROM search_term_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
        AND metrics.clicks > 10
      LIMIT 5000
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

  // ── Zero-impression ad groups (SEARCH only) ──────────────────────────────
  // Two-query approach: all enabled SEARCH ad groups minus those with any impressions.
  // Excludes brand-named campaigns (naming convention) and Shopping/PMax.
  const allSearchAdGroupRows = await safeQuery(
    () => customer.query(`
      SELECT ad_group.id, ad_group.name, campaign.name
      FROM ad_group
      WHERE ad_group.status = 'ENABLED'
        AND campaign.status = 'ENABLED'
        AND campaign.advertising_channel_type = 'SEARCH'
      LIMIT 1000
    `),
    "all enabled search ad groups"
  );
  const activeAdGroupRows = await safeQuery(
    () => customer.query(`
      SELECT ad_group.id
      FROM ad_group
      WHERE ad_group.status = 'ENABLED'
        AND campaign.status = 'ENABLED'
        AND campaign.advertising_channel_type = 'SEARCH'
        AND metrics.impressions > 0
        AND segments.date BETWEEN '${start}' AND '${end}'
      LIMIT 1000
    `),
    "active search ad groups 30d"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeAdGroupIds = new Set(activeAdGroupRows.map(r => String((r.ad_group as any)?.id ?? "")).filter(Boolean));
  const zeroImpressionAdGroups = allSearchAdGroupRows.filter(r => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id           = String((r.ad_group  as any)?.id   ?? "");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const campName     = String((r.campaign  as any)?.name ?? "").toLowerCase();
    if (!id) return false;
    // Skip campaigns with "brand" or "merken" in the name (naming convention)
    if (campName.includes("brand") || campName.includes("merken")) return false;
    return !activeAdGroupIds.has(id);
  });
  const zeroImpressionAdGroupCount = zeroImpressionAdGroups.length;
  const zeroImpressionAdGroupNames = zeroImpressionAdGroups
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map(r => String((r.ad_group as any)?.name ?? ""))
    .filter(Boolean)
    .slice(0, 10);

  // ── Non-converting EXACT/PHRASE keywords (180-day totals) ────────────────
  // 180 days gives strong confidence: a keyword with zero conversions over 6
  // months is genuinely wasted regardless of volume fluctuations.
  // Omit segments.date from SELECT → GAQL auto-groups by the resource fields.
  const { start: kw180start, end: kw180end } = last180Days();
  const nonConvertingKwRows = await safeQuery(
    () => customer.query(`
      SELECT
        ad_group_criterion.criterion_id,
        metrics.cost_micros,
        metrics.conversions
      FROM keyword_view
      WHERE ad_group_criterion.status = 'ENABLED'
        AND campaign.status = 'ENABLED'
        AND ad_group.status = 'ENABLED'
        AND ad_group_criterion.keyword.match_type IN ('EXACT', 'PHRASE')
        AND segments.date BETWEEN '${kw180start}' AND '${kw180end}'
      LIMIT 5000
    `),
    "non-converting keywords 180d"
  );

  // Aggregate: group by criterion_id so multi-day rows don't double-count
  const kwTotals = new Map<string, { cost: number; conversions: number }>();
  for (const r of nonConvertingKwRows) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id          = String((r.ad_group_criterion as any)?.criterion_id ?? "");
    const cost        = Number(r.metrics?.cost_micros ?? 0) / 1_000_000;
    const conversions = Number(r.metrics?.conversions ?? 0);
    const entry = kwTotals.get(id) ?? { cost: 0, conversions: 0 };
    entry.cost        += cost;
    entry.conversions += conversions;
    kwTotals.set(id, entry);
  }
  let wastedKeywordSpend = 0;
  for (const d of kwTotals.values()) {
    if (d.conversions < 1) wastedKeywordSpend += d.cost;
  }
  // totalCost here is 30-day account spend (computed from allCampaignRows above)
  const wastedKeywordSpendRatio = totalCost > 0 ? Math.min(1, wastedKeywordSpend / totalCost) : 0;

  // IS demand ceiling: low IS that can't be explained by budget or rank loss.
  // When budget loss < 10% and rank loss < 15% but IS is still < 30%, the market
  // itself is simply too small — scaling spend or improving quality won't help.
  const isDemandCeiling =
    avgIs < 0.30 &&
    avgIsLostBudget < 0.10 &&
    avgIsLostRank < 0.15 &&
    isRowCount > 0;

  return {
    impressionShareLost_budget:  Math.min(1, avgIsLostBudget),
    impressionShareLost_rank:    Math.min(1, avgIsLostRank),
    clickThroughRate:            ctr14,
    clickThroughRateBaseline,
    averageCpc:                  avgCpc,
    searchImpressionShare:       Math.min(1, avgIs),
    qualityScoreAvg,
    qualityScoreCount,
    productDisapprovalRate,
    irrelevantQueryPercent:      Math.min(1, irrelevantQueryPercent),
    isPmaxPrimary,
    pmaxDisplayYoutubePercent:   Math.min(1, pmaxDisplayYoutubePercent),
    budgetConstrainedCampaigns,
    zeroImpressionAdGroupCount,
    zeroImpressionAdGroupNames,
    wastedKeywordSpend,
    wastedKeywordSpendRatio,
    isDemandCeiling,
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
      LIMIT 2000
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
      LIMIT 2000
    `),
    "landing page views"
  );
  const realPageViewRows = lpRows.filter(r => Number(r.metrics?.average_page_views ?? 0) > 0);
  const avgPageViews = realPageViewRows.length > 0
    ? realPageViewRows.reduce((s, r) => s + Number(r.metrics?.average_page_views ?? 0), 0) / realPageViewRows.length
    : 0; // 0 = no data
  // Score: 0 = no data, 1.0 pages → 3/10, 2.0 → 6/10, 3.0+ → 9/10
  const landingPageScore = avgPageViews > 0 ? Math.min(10, Math.round(avgPageViews * 3)) : 0;
  // Bounce rate is not available from Google Ads API — only GA4 has it.
  // Setting to 0 (no data) to avoid false positives from a heuristic proxy.
  const bounceRateEstimate = 0;

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
    leadToSaleRate:    0, // Requires CRM data — 0 = no data, scorer guards against this
    averageLeadQualityScore: 0, // Requires CRM data — 0 = no data, scorer guards against this
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
  // Query returns one row per campaign per day, so totalBudget is already
  // sum of dailyBudget × numDays. Dividing spend by this gives utilization %.
  const budgetUtilizationPercent = totalBudget > 0
    ? Math.min(1, totalCost30 / totalBudget)
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

  // Sequential — not parallel — so each fetch's rows are GC'd before the next
  // begins. Parallel execution keeps all 5 datasets in memory simultaneously
  // which caused OOM crashes on Railway when scoring many accounts.
  const measurement = await fetchMeasurementSignals(customer);
  const traffic     = await fetchTrafficSignals(customer);
  const conversion  = await fetchConversionSignals(customer, industry, country, businessModel);
  const funnel      = await fetchFunnelSignals(customer);
  const economics   = await fetchEconomicsSignals(customer);

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

export interface LabelDistribution {
  /** Label name (e.g. "hero", "villain", "sidekick", "zombie") or "unlabeled" */
  label:     string;
  cost:      number;   // in account currency
  revenue:   number;
  products:  number;   // distinct product count
}

export interface ShoppingOverview {
  hasShoppingCampaigns: boolean;
  noShoppingFeedData?:  boolean;
  fromMerchantFeed?:    boolean;
  /** True when more products are available beyond the current page */
  hasMore?:             boolean;
  campaignCount:        number;
  totalCost:            number;
  totalRevenue:         number;
  totalConversions:     number;
  roas:                 number;
  isLostBudget:         number;
  isLostRank:           number;
  disapprovedCount:     number;
  products:             ProductRow[];
  labelDistribution:    LabelDistribution[];
}

export async function fetchProductPerformance(
  customerId: string,
  orgId?: string,
  pageOffset = 0,
  pageSize = 10,
): Promise<ShoppingOverview> {
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
      labelDistribution: [],
    };
  }

  const totalCost        = campaignRows.reduce((s, r) => s + Number(r.metrics?.cost_micros ?? 0), 0) / 1_000_000;
  const totalRevenue     = campaignRows.reduce((s, r) => s + Number(r.metrics?.conversions_value ?? 0), 0);
  const totalConversions = campaignRows.reduce((s, r) => s + Number(r.metrics?.conversions ?? 0), 0);
  const isLostBudget     = campaignRows.reduce((s, r) => s + Number(r.metrics?.search_budget_lost_impression_share ?? 0), 0) / campaignRows.length;
  const isLostRank       = campaignRows.reduce((s, r) => s + Number(r.metrics?.search_rank_lost_impression_share ?? 0), 0) / campaignRows.length;

  // ── Product-level performance ─────────────────────────────────────────────
  // Use GAQL ORDER BY + LIMIT so Google does the sorting/pagination server-side.
  // Omitting campaign fields causes GAQL to auto-aggregate across all campaigns,
  // avoiding double-counting between Shopping and PMax. Fetch pageSize+1 to
  // determine whether a next page exists.
  const productRows = await safeQuery(
    () => customer.query(`
      SELECT
        segments.product_item_id,
        segments.product_title,
        segments.product_brand,
        segments.product_custom_label0,
        metrics.clicks,
        metrics.impressions,
        metrics.conversions,
        metrics.conversions_value,
        metrics.cost_micros
      FROM shopping_performance_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
        AND (metrics.impressions > 0 OR metrics.cost_micros > 0)
      ORDER BY metrics.conversions_value DESC, metrics.cost_micros DESC
      LIMIT ${pageOffset + pageSize + 1}
    `),
    "shopping product performance",
    30_000
  );

  // GAQL has no OFFSET — emulate it by fetching up to current page end and slicing
  const hasMore = productRows.length > pageOffset + pageSize;
  const pageRows = productRows.slice(pageOffset, pageOffset + pageSize);

  const products: ProductRow[] = pageRows.map(r => {
    const itemId      = String(r.segments?.product_item_id ?? "unknown");
    const title       = String(r.segments?.product_title   ?? "Unknown product");
    const brand       = String(r.segments?.product_brand   ?? "");
    const clicks      = Number(r.metrics?.clicks           ?? 0);
    const impressions = Number(r.metrics?.impressions      ?? 0);
    const conversions = Number(r.metrics?.conversions      ?? 0);
    const revenue     = Number(r.metrics?.conversions_value ?? 0);
    const cost        = Number(r.metrics?.cost_micros      ?? 0) / 1_000_000;
    return {
      itemId, title, brand, clicks, impressions,
      ctr:  impressions > 0 ? clicks / impressions : 0,
      conversions, revenue, cost,
      roas: cost > 0 ? revenue / cost : 0,
      cpc:  clicks > 0 ? cost / clicks : 0,
    };
  });

  const labelDistribution: LabelDistribution[] = [];

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
    noShoppingFeedData: products.length === 0,
    campaignCount: new Set(campaignRows.map(r => String(r.campaign?.id))).size,
    totalCost,
    totalRevenue,
    totalConversions,
    roas: totalCost > 0 ? totalRevenue / totalCost : 0,
    isLostBudget:  Math.min(1, isLostBudget),
    isLostRank:    Math.min(1, isLostRank),
    disapprovedCount,
    hasMore,
    products,
    labelDistribution,
  };
}

// ─── Search Term Report ───────────────────────────────────────────────────────

export interface SearchTermRow {
  searchTerm:   string;
  campaignId:   string;
  campaignName: string;
  clicks:       number;
  conversions:  number;
  costEur:      number; // 0 for PMax — cost not available per-term
  source:       "search" | "pmax"; // "search" = Search + STD Shopping via search_term_view
  recommendation: "EXCLUDE" | "WATCH" | "KEEP";
}

// Thresholds for search term classification (90-day window):
//   EXCLUDE — zero conversions and spent > €30: meaningful budget leak worth acting on
//   WATCH   — zero conversions and spent > €5:  accumulating spend, keep an eye on it
//   KEEP    — has conversions or minimal spend: leave alone
const EXCLUDE_COST_THRESHOLD  = 30;
const WATCH_COST_THRESHOLD    = 5;
// PMax: no cost per term — use click volume as proxy for wasted reach
const PMAX_EXCLUDE_CLICKS     = 30;
const PMAX_WATCH_CLICKS       = 10;
// Cap insight categories fetched per PMax campaign to keep API calls bounded
const PMAX_MAX_INSIGHTS       = 150;

export async function fetchSearchTermReport(customerId: string, orgId?: string): Promise<SearchTermRow[]> {
  const client   = getClient();
  const customer = await getCustomer(client, customerId, orgId);
  const { start, end } = last90Days();

  // ── 1. Search + Standard Shopping via search_term_view ────────────────────
  const searchRows = await safeQuery(
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

  const searchTerms: SearchTermRow[] = searchRows
    .map((r): SearchTermRow => {
      const clicks      = Number(r.metrics?.clicks      ?? 0);
      const conversions = Number(r.metrics?.conversions  ?? 0);
      const costEur     = Number(r.metrics?.cost_micros  ?? 0) / 1_000_000;
      const recommendation: SearchTermRow["recommendation"] =
        conversions === 0 && costEur >= EXCLUDE_COST_THRESHOLD ? "EXCLUDE" :
        conversions === 0 && costEur >= WATCH_COST_THRESHOLD   ? "WATCH"   : "KEEP";
      return {
        searchTerm:   r.search_term_view?.search_term ?? "",
        campaignId:   String(r.campaign?.id   ?? ""),
        campaignName: r.campaign?.name ?? "Unknown campaign",
        clicks, conversions, costEur,
        source: "search",
        recommendation,
      };
    })
    .filter(r => r.searchTerm.length > 0);

  // ── 2. Performance Max via campaign_search_term_insight ───────────────────
  // PMax terms are not in search_term_view; they require per-campaign queries.
  // Google does not expose cost per search term for PMax, so we use click
  // volume as the exclusion signal instead.
  const pmaxCampaigns = await safeQuery(
    () => customer.query(`
      SELECT campaign.id, campaign.name
      FROM campaign
      WHERE campaign.status = 'ENABLED'
        AND campaign.advertising_channel_type = 'PERFORMANCE_MAX'
    `),
    "pmax campaigns"
  );

  const pmaxTerms: SearchTermRow[] = [];

  for (const camp of pmaxCampaigns) {
    const campaignId   = String(camp.campaign?.id   ?? "");
    const campaignName = String(camp.campaign?.name ?? "Unknown PMax campaign");
    if (!campaignId) continue;

    // Query all insight categories for this campaign with their search terms.
    // Filter by campaign_id only (not insight_id) — returns all categories.
    const insightRows = await safeQuery(
      () => customer.query(`
        SELECT
          campaign_search_term_insight.id,
          campaign_search_term_insight.category_label,
          segments.search_term,
          metrics.clicks,
          metrics.impressions,
          metrics.conversions,
          metrics.conversions_value
        FROM campaign_search_term_insight
        WHERE campaign_search_term_insight.campaign_id = ${campaignId}
          AND segments.date BETWEEN '${start}' AND '${end}'
          AND metrics.clicks >= 1
        LIMIT ${PMAX_MAX_INSIGHTS}
      `),
      `pmax insights campaign ${campaignId}`
    );

    for (const r of insightRows) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const searchTerm  = (r as any).segments?.search_term ?? "";
      const clicks      = Number(r.metrics?.clicks      ?? 0);
      const conversions = Number(r.metrics?.conversions  ?? 0);
      if (!searchTerm) continue;

      const recommendation: SearchTermRow["recommendation"] =
        conversions === 0 && clicks >= PMAX_EXCLUDE_CLICKS ? "EXCLUDE" :
        conversions === 0 && clicks >= PMAX_WATCH_CLICKS   ? "WATCH"   : "KEEP";

      pmaxTerms.push({
        searchTerm,
        campaignId,
        campaignName,
        clicks,
        conversions,
        costEur: 0, // not available per-term for PMax
        source: "pmax",
        recommendation,
      });
    }
  }

  // Deduplicate: if a term appears in both search and PMax, keep both (different campaigns)
  const all = [...searchTerms, ...pmaxTerms];

  // Sort: Search/Shopping by cost desc, PMax by clicks desc; interleave by putting
  // high-signal terms first regardless of source
  return all.sort((a, b) => {
    // EXCLUDE > WATCH > KEEP
    const recOrder = { EXCLUDE: 0, WATCH: 1, KEEP: 2 };
    const recDiff  = recOrder[a.recommendation] - recOrder[b.recommendation];
    if (recDiff !== 0) return recDiff;
    // Within same recommendation: sort by costEur (search) or clicks (pmax)
    if (a.source === "search" && b.source === "search") return b.costEur - a.costEur;
    if (a.source === "pmax"   && b.source === "pmax")   return b.clicks  - a.clicks;
    return b.costEur - a.costEur; // search terms with cost first
  });
}

/**
 * Returns a map of product item_id → spend in micros over the last 30 days.
 * Used to enrich price competitiveness rows with actual ad spend.
 *
 * Deduplicates Shopping vs PMax exactly like getProductPerformance does:
 * Shopping-campaign spend wins per product; PMax fills in only for products
 * that have no Shopping data. Summing both would inflate spend ~1.7x.
 */
export async function fetchProductSpend(
  customerId: string,
  orgId?: string
): Promise<Map<string, number>> {
  try {
    const client   = getClient();
    const customer = await getCustomer(client, customerId, orgId);
    const { start, end } = last30Days();

    const rows = await safeQuery(
      () => customer.query(`
        SELECT
          segments.product_item_id,
          campaign.advertising_channel_type,
          metrics.cost_micros
        FROM shopping_performance_view
        WHERE segments.date BETWEEN '${start}' AND '${end}'
          AND metrics.cost_micros > 0
      `),
      "product spend"
    );

    // Separate Shopping and PMax spend maps — same dedup strategy as getProductPerformance.
    // A product running in both campaign types would be double-counted if summed naively.
    const shoppingSpend = new Map<string, number>();
    const pmaxSpend     = new Map<string, number>();

    for (const r of rows) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const itemId = String((r as any).segments?.product_item_id ?? "");
      const cost   = Number(r.metrics?.cost_micros ?? 0);
      const ct     = String((r as { campaign?: { advertising_channel_type?: string } } | undefined)?.campaign?.advertising_channel_type ?? "");
      if (!itemId) continue;
      const target = ct === "PERFORMANCE_MAX" ? pmaxSpend : shoppingSpend;
      target.set(itemId, (target.get(itemId) ?? 0) + cost);
    }

    // Shopping wins; PMax fills in products not present in Shopping
    const spendMap = new Map<string, number>(shoppingSpend);
    for (const [itemId, cost] of pmaxSpend) {
      if (!spendMap.has(itemId)) spendMap.set(itemId, cost);
    }
    return spendMap;
  } catch (err) {
    console.warn("[google-ads] product spend fetch failed:", err instanceof Error ? err.message : err);
    return new Map();
  }
}

// ─── Demographics ─────────────────────────────────────────────────────────────

export interface DemographicRow {
  dimension: string; // "device" | "age" | "gender"
  label:     string; // e.g. "MOBILE", "AGE_25_34", "FEMALE"
  clicks:       number;
  impressions:  number;
  conversions:  number;
  costMicros:   number;
  convValue:    number;
}

// Google Ads API returns numeric enum IDs — map to human-readable labels
const DEVICE_LABELS: Record<string, string> = {
  "0": "Unspecified", "1": "Other",   "2": "Mobile",
  "3": "Tablet",      "4": "Desktop", "5": "Other", "6": "Connected TV",
};
const AGE_LABELS: Record<string, string> = {
  "503001": "18–24", "503002": "25–34", "503003": "35–44",
  "503004": "45–54", "503005": "55–64", "503006": "65+",
  "503999": "Undetermined",
};
const GENDER_LABELS: Record<string, string> = {
  "10": "Male", "11": "Undetermined", "20": "Female",
};
const INCOME_LABELS: Record<string, string> = {
  "510001": "Lower 50%", "510002": "41–50%", "510003": "31–40%",
  "510004": "21–30%",    "510005": "11–20%", "510006": "Top 10%",
  "510000": "Undetermined",
};

export async function fetchDemographics(
  customerId: string,
  orgId?: string
): Promise<DemographicRow[]> {
  const client   = getClient();
  const customer = await getCustomer(client, customerId, orgId);
  const { start, end } = last30Days();

  const results: DemographicRow[] = [];

  // Device split — from campaign segmented by device
  const deviceRows = await safeQuery(
    () => customer.query(`
      SELECT
        segments.device,
        metrics.clicks,
        metrics.impressions,
        metrics.conversions,
        metrics.cost_micros,
        metrics.conversions_value
      FROM campaign
      WHERE campaign.status = 'ENABLED'
        AND segments.date BETWEEN '${start}' AND '${end}'
    `),
    "device demographics"
  );

  // Aggregate by device
  const deviceMap = new Map<string, DemographicRow>();
  for (const r of deviceRows) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const device = String((r as any).segments?.device ?? "0");
    const existing = deviceMap.get(device) ?? {
      dimension: "device", label: DEVICE_LABELS[device] ?? device,
      clicks: 0, impressions: 0, conversions: 0, costMicros: 0, convValue: 0,
    };
    existing.clicks      += Number(r.metrics?.clicks ?? 0);
    existing.impressions += Number(r.metrics?.impressions ?? 0);
    existing.conversions += Number(r.metrics?.conversions ?? 0);
    existing.costMicros  += Number(r.metrics?.cost_micros ?? 0);
    existing.convValue   += Number(r.metrics?.conversions_value ?? 0);
    deviceMap.set(device, existing);
  }
  results.push(...deviceMap.values());

  // Age range
  const ageRows = await safeQuery(
    () => customer.query(`
      SELECT
        ad_group_criterion.age_range.type,
        metrics.clicks,
        metrics.impressions,
        metrics.conversions,
        metrics.cost_micros,
        metrics.conversions_value
      FROM age_range_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
    `),
    "age demographics"
  );

  const ageMap = new Map<string, DemographicRow>();
  for (const r of ageRows) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const age = String((r as any).ad_group_criterion?.age_range?.type ?? "503999");
    const existing = ageMap.get(age) ?? {
      dimension: "age", label: AGE_LABELS[age] ?? age,
      clicks: 0, impressions: 0, conversions: 0, costMicros: 0, convValue: 0,
    };
    existing.clicks      += Number(r.metrics?.clicks ?? 0);
    existing.impressions += Number(r.metrics?.impressions ?? 0);
    existing.conversions += Number(r.metrics?.conversions ?? 0);
    existing.costMicros  += Number(r.metrics?.cost_micros ?? 0);
    existing.convValue   += Number(r.metrics?.conversions_value ?? 0);
    ageMap.set(age, existing);
  }
  results.push(...ageMap.values());

  // Gender
  const genderRows = await safeQuery(
    () => customer.query(`
      SELECT
        ad_group_criterion.gender.type,
        metrics.clicks,
        metrics.impressions,
        metrics.conversions,
        metrics.cost_micros,
        metrics.conversions_value
      FROM gender_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
    `),
    "gender demographics"
  );

  const genderMap = new Map<string, DemographicRow>();
  for (const r of genderRows) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gender = String((r as any).ad_group_criterion?.gender?.type ?? "11");
    const existing = genderMap.get(gender) ?? {
      dimension: "gender", label: GENDER_LABELS[gender] ?? gender,
      clicks: 0, impressions: 0, conversions: 0, costMicros: 0, convValue: 0,
    };
    existing.clicks      += Number(r.metrics?.clicks ?? 0);
    existing.impressions += Number(r.metrics?.impressions ?? 0);
    existing.conversions += Number(r.metrics?.conversions ?? 0);
    existing.costMicros  += Number(r.metrics?.cost_micros ?? 0);
    existing.convValue   += Number(r.metrics?.conversions_value ?? 0);
    genderMap.set(gender, existing);
  }
  results.push(...genderMap.values());

  return results.filter(r => r.clicks > 0 || r.impressions > 0);
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

// ─── Persona Data ─────────────────────────────────────────────────────────────

export interface GeoRow {
  criterionId: number;
  name:        string;  // resolved from geo_target_constant
  countryCode: string;
  targetType:  string;  // Country | Region | City etc.
  clicks:       number;
  conversions:  number;
  costMicros:   number;
  convValue:    number;
}

export interface IncomeRow {
  label:       string;  // INCOME_RANGE_0_50 etc.
  clicks:       number;
  conversions:  number;
  costMicros:   number;
  convValue:    number;
}

export interface ParentalRow {
  label:       string;  // PARENT / NOT_A_PARENT / UNDETERMINED
  clicks:       number;
  conversions:  number;
  costMicros:   number;
  convValue:    number;
}

export interface DayHourRow {
  dimension: "day" | "hour";
  label:     string;  // MON / TUE … or "0"–"23"
  clicks:       number;
  conversions:  number;
  costMicros:   number;
}

export interface AudienceInterestRow {
  name:       string;
  type:       string;  // USER_INTEREST | USER_LIST | CUSTOM_AUDIENCE etc.
  clicks:     number;
  conversions: number;
  costMicros: number;
  convValue:  number;
}

export interface PersonaData {
  demographics:   DemographicRow[];
  income:         IncomeRow[];
  parental:       ParentalRow[];
  geo:            GeoRow[];
  dayHour:        DayHourRow[];
  interests:      AudienceInterestRow[];
}

export async function fetchPersonaData(
  customerId: string,
  orgId?: string
): Promise<PersonaData> {
  const client   = getClient();
  const customer = await getCustomer(client, customerId, orgId);
  const { start, end } = last30Days();

  // Run all queries in parallel
  const [
    demographicRows,
    incomeRaw,
    parentalRaw,
    dayRaw,
    hourRaw,
    audienceRaw,
  ] = await Promise.all([
    // Demographics (age, gender, device) — reuse existing fetcher
    fetchDemographics(customerId, orgId).catch((): DemographicRow[] => []),

    // Income range
    safeQuery(() => customer.query(`
      SELECT ad_group_criterion.income_range.type,
             metrics.clicks, metrics.impressions, metrics.conversions,
             metrics.cost_micros, metrics.conversions_value
      FROM income_range_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
    `), "income range"),

    // Parental status
    safeQuery(() => customer.query(`
      SELECT ad_group_criterion.parental_status.type,
             metrics.clicks, metrics.impressions, metrics.conversions,
             metrics.cost_micros, metrics.conversions_value
      FROM parental_status_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
    `), "parental status"),

    // Day of week
    safeQuery(() => customer.query(`
      SELECT segments.day_of_week,
             metrics.clicks, metrics.conversions, metrics.cost_micros
      FROM customer
      WHERE segments.date BETWEEN '${start}' AND '${end}'
    `), "day of week"),

    // Hour of day
    safeQuery(() => customer.query(`
      SELECT segments.hour,
             metrics.clicks, metrics.conversions, metrics.cost_micros
      FROM customer
      WHERE segments.date BETWEEN '${start}' AND '${end}'
    `), "hour of day"),

    // Audience / interest performance from ad group audience view
    safeQuery(() => customer.query(`
      SELECT ad_group_criterion.type,
             ad_group_criterion.user_interest.user_interest_category,
             ad_group_criterion.user_list.user_list,
             ad_group_criterion.display_name,
             metrics.clicks, metrics.conversions,
             metrics.cost_micros, metrics.conversions_value
      FROM ad_group_audience_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
        AND metrics.impressions > 0
      LIMIT 200
    `), "audience interests"),
  ]);

  // ── Income ───────────────────────────────────────────────────────────────────
  const incomeMap = new Map<string, IncomeRow>();
  for (const r of incomeRaw) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = String((r as any).ad_group_criterion?.income_range?.type ?? "510000");
    const label = INCOME_LABELS[raw] ?? raw.replace("INCOME_RANGE_", "").replace(/_/g, "–").replace("UP", "+");
    const existing = incomeMap.get(label) ?? { label, clicks: 0, conversions: 0, costMicros: 0, convValue: 0 };
    existing.clicks      += Number(r.metrics?.clicks ?? 0);
    existing.conversions += Number(r.metrics?.conversions ?? 0);
    existing.costMicros  += Number(r.metrics?.cost_micros ?? 0);
    existing.convValue   += Number(r.metrics?.conversions_value ?? 0);
    incomeMap.set(label, existing);
  }

  // ── Parental ─────────────────────────────────────────────────────────────────
  const parentalMap = new Map<string, ParentalRow>();
  for (const r of parentalRaw) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = String((r as any).ad_group_criterion?.parental_status?.type ?? "UNKNOWN");
    const label = raw === "PARENT" ? "Parent" : raw === "NOT_A_PARENT" ? "Not a parent" : "Unknown";
    const existing = parentalMap.get(label) ?? { label, clicks: 0, conversions: 0, costMicros: 0, convValue: 0 };
    existing.clicks      += Number(r.metrics?.clicks ?? 0);
    existing.conversions += Number(r.metrics?.conversions ?? 0);
    existing.costMicros  += Number(r.metrics?.cost_micros ?? 0);
    existing.convValue   += Number(r.metrics?.conversions_value ?? 0);
    parentalMap.set(label, existing);
  }

  // ── Day of week ──────────────────────────────────────────────────────────────
  const dayMap = new Map<string, DayHourRow>();
  const DAY_ORDER = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];
  for (const r of dayRaw) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const label = String((r as any).segments?.day_of_week ?? "UNKNOWN");
    const existing = dayMap.get(label) ?? { dimension: "day", label, clicks: 0, conversions: 0, costMicros: 0 };
    existing.clicks      += Number(r.metrics?.clicks ?? 0);
    existing.conversions += Number(r.metrics?.conversions ?? 0);
    existing.costMicros  += Number(r.metrics?.cost_micros ?? 0);
    dayMap.set(label, existing);
  }
  const days = DAY_ORDER
    .map(d => dayMap.get(d))
    .filter((d): d is DayHourRow => d !== undefined && d.clicks > 0);

  // ── Hour of day ──────────────────────────────────────────────────────────────
  const hourMap = new Map<number, DayHourRow>();
  for (const r of hourRaw) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const h = Number((r as any).segments?.hour ?? -1);
    if (h < 0) continue;
    const existing = hourMap.get(h) ?? { dimension: "hour", label: String(h), clicks: 0, conversions: 0, costMicros: 0 };
    existing.clicks      += Number(r.metrics?.clicks ?? 0);
    existing.conversions += Number(r.metrics?.conversions ?? 0);
    existing.costMicros  += Number(r.metrics?.cost_micros ?? 0);
    hourMap.set(h, existing);
  }
  const hours = Array.from({ length: 24 }, (_, h) => hourMap.get(h) ?? { dimension: "hour" as const, label: String(h), clicks: 0, conversions: 0, costMicros: 0 });

  // ── Audiences / Interests ────────────────────────────────────────────────────
  const audienceMap = new Map<string, AudienceInterestRow>();
  for (const r of audienceRaw) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rc  = r as any;
    const type = String(rc.ad_group_criterion?.type ?? "UNKNOWN");
    const name = rc.ad_group_criterion?.display_name
      ?? rc.ad_group_criterion?.user_interest?.user_interest_category
      ?? rc.ad_group_criterion?.user_list?.user_list
      ?? "Unknown audience";
    const key = `${type}::${name}`;
    const existing = audienceMap.get(key) ?? { name: String(name), type, clicks: 0, conversions: 0, costMicros: 0, convValue: 0 };
    existing.clicks      += Number(r.metrics?.clicks ?? 0);
    existing.conversions += Number(r.metrics?.conversions ?? 0);
    existing.costMicros  += Number(r.metrics?.cost_micros ?? 0);
    existing.convValue   += Number(r.metrics?.conversions_value ?? 0);
    audienceMap.set(key, existing);
  }
  const interests = Array.from(audienceMap.values())
    .filter(a => !["UNKNOWN", "KEYWORD", "NEGATIVE"].includes(a.type) && a.clicks > 0)
    .sort((a, b) => b.costMicros - a.costMicros)
    .slice(0, 30);

  // ── Geographic ───────────────────────────────────────────────────────────────
  // Query user_location_view for where users actually were (not targeted)
  const geoRaw = await safeQuery(() => customer.query(`
    SELECT user_location_view.country_criterion_id,
           user_location_view.targeting_location,
           metrics.clicks, metrics.conversions,
           metrics.cost_micros, metrics.conversions_value
    FROM user_location_view
    WHERE segments.date BETWEEN '${start}' AND '${end}'
      AND user_location_view.targeting_location = false
      AND metrics.clicks > 0
    ORDER BY metrics.cost_micros DESC
    LIMIT 50
  `), "user location");

  // Collect unique criterion IDs to resolve names
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const criterionIds = [...new Set(geoRaw.map(r => Number((r as any).user_location_view?.country_criterion_id ?? 0)).filter(Boolean))];

  let geoNameMap = new Map<number, { name: string; countryCode: string; targetType: string }>();
  if (criterionIds.length > 0) {
    const nameRows = await safeQuery(() => customer.query(`
      SELECT geo_target_constant.id, geo_target_constant.name,
             geo_target_constant.country_code, geo_target_constant.target_type,
             geo_target_constant.canonical_name
      FROM geo_target_constant
      WHERE geo_target_constant.id IN (${criterionIds.slice(0, 20).join(",")})
    `), "geo target names");
    for (const nr of nameRows) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nrc = nr as any;
      const id = Number(nrc.geo_target_constant?.id ?? 0);
      if (id) geoNameMap.set(id, {
        name:       String(nrc.geo_target_constant?.canonical_name ?? nrc.geo_target_constant?.name ?? id),
        countryCode: String(nrc.geo_target_constant?.country_code ?? ""),
        targetType:  String(nrc.geo_target_constant?.target_type ?? ""),
      });
    }
  }

  const geoMap = new Map<number, GeoRow>();
  for (const r of geoRaw) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rc = r as any;
    const criterionId = Number(rc.user_location_view?.country_criterion_id ?? 0);
    if (!criterionId) continue;
    const meta = geoNameMap.get(criterionId);
    const existing = geoMap.get(criterionId) ?? {
      criterionId,
      name:        meta?.name ?? `Location ${criterionId}`,
      countryCode: meta?.countryCode ?? "",
      targetType:  meta?.targetType ?? "",
      clicks: 0, conversions: 0, costMicros: 0, convValue: 0,
    };
    existing.clicks      += Number(r.metrics?.clicks ?? 0);
    existing.conversions += Number(r.metrics?.conversions ?? 0);
    existing.costMicros  += Number(r.metrics?.cost_micros ?? 0);
    existing.convValue   += Number(r.metrics?.conversions_value ?? 0);
    geoMap.set(criterionId, existing);
  }
  const geo = Array.from(geoMap.values())
    .sort((a, b) => b.costMicros - a.costMicros)
    .slice(0, 20);

  return {
    demographics: demographicRows,
    income:       Array.from(incomeMap.values()).filter(r => r.clicks > 0 && !r.label.includes("UNKNOWN")),
    parental:     Array.from(parentalMap.values()).filter(r => r.clicks > 0 && r.label !== "Unknown"),
    geo,
    dayHour:      [...days, ...hours],
    interests,
  };
}
