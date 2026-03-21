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
import {
  ConstraintSignals,
  MeasurementSignals,
  TrafficSignals,
  ConversionSignals,
  FunnelSignals,
  EconomicsSignals,
} from "@/lib/engine/types";

// ─── Client factory ───────────────────────────────────────────────────────────

function getClient(): GoogleAdsApi {
  return new GoogleAdsApi({
    client_id:       process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });
}

function getCustomer(client: GoogleAdsApi): Customer {
  return client.Customer({
    customer_id:       process.env.GOOGLE_ADS_CUSTOMER_ID!,
    login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || undefined,
    refresh_token:     process.env.GOOGLE_ADS_REFRESH_TOKEN!,
  });
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function last30Days(): { start: string; end: string } {
  const end   = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "-");
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

  // Check for enhanced conversions (user provided data)
  const hasEnhancedConversions = activeConversions.some(
    (r) =>
      r.conversion_action?.type ===
      enums.ConversionActionType.WEBPAGE
  );

  // Customer details — GA4 and Merchant Center links
  const linkedAccounts = await customer.query(`
    SELECT
      google_ads_link.resource_name,
      google_ads_link.status
    FROM google_ads_link
  `).catch(() => []);

  // Tag coverage via campaign-level conversion tracking check
  // Approximated: campaigns with 0 conversions in 30 days vs. total
  const { start, end } = last30Days();
  const campaignConversions = await customer.query(`
    SELECT
      campaign.id,
      metrics.conversions
    FROM campaign
    WHERE campaign.status = 'ENABLED'
      AND segments.date BETWEEN '${start}' AND '${end}'
  `).catch(() => []);

  const totalCampaigns = campaignConversions.length;
  const campaignsWithConversions = campaignConversions.filter(
    (r) => (r.metrics?.conversions ?? 0) > 0
  ).length;
  const tagCoveragePercent = totalCampaigns > 0
    ? campaignsWithConversions / totalCampaigns
    : 0;

  // GA4 linked — check if any Google Analytics links exist
  const analyticsLinks = await customer.query(`
    SELECT google_analytics_link.resource_name
    FROM google_analytics_link
  `).catch(() => []);
  const hasGa4Linked = analyticsLinks.length > 0;

  // Merchant Center linked
  const merchantLinks = await customer.query(`
    SELECT merchant_center_link.id
    FROM merchant_center_link
    WHERE merchant_center_link.status = 'ENABLED'
  `).catch(() => []);
  const hasMerchantCenterLinked = merchantLinks.length > 0;

  return {
    conversionTrackingActive,
    conversionActionsCount: activeConversions.length,
    hasEnhancedConversions,
    tagCoveragePercent: Math.min(1, tagCoveragePercent + 0.1), // baseline buffer
    dateLagDays: 3, // Google Ads standard attribution lag
    hasGa4Linked,
    hasMerchantCenterLinked,
  };
}

// ─── Traffic signals ──────────────────────────────────────────────────────────

async function fetchTrafficSignals(customer: Customer): Promise<TrafficSignals> {
  const { start, end } = last30Days();

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
  const qsRows = await customer.query(`
    SELECT
      ad_group_criterion.quality_info.quality_score
    FROM ad_group_criterion
    WHERE ad_group_criterion.type = 'KEYWORD'
      AND ad_group_criterion.status = 'ENABLED'
      AND ad_group_criterion.quality_info.quality_score IS NOT NULL
  `).catch(() => []);

  const qsValues = qsRows
    .map((r) => Number(r.ad_group_criterion?.quality_info?.quality_score ?? 0))
    .filter((v) => v > 0);
  const qualityScoreAvg = qsValues.length > 0
    ? qsValues.reduce((a, b) => a + b, 0) / qsValues.length
    : 7; // default if no data

  // Irrelevant query estimate — search terms with 0 conversions & low QS
  const searchTermRows = await customer.query(`
    SELECT
      search_term_view.search_term,
      metrics.clicks,
      metrics.conversions,
      metrics.cost_micros
    FROM search_term_view
    WHERE segments.date BETWEEN '${start}' AND '${end}'
      AND metrics.clicks > 5
  `).catch(() => []);

  const totalSearchTermCost = searchTermRows.reduce(
    (sum, r) => sum + Number(r.metrics?.cost_micros ?? 0), 0
  );
  const irrelevantCost = searchTermRows
    .filter((r) => Number(r.metrics?.conversions ?? 0) === 0)
    .reduce((sum, r) => sum + Number(r.metrics?.cost_micros ?? 0), 0);
  const irrelevantQueryPercent = totalSearchTermCost > 0
    ? irrelevantCost / totalSearchTermCost
    : 0;

  return {
    impressionShareLost_budget: Math.min(1, avgIsLostBudget),
    impressionShareLost_rank:   Math.min(1, avgIsLostRank),
    clickThroughRate:           ctr,
    averageCpc:                 avgCpc,
    searchImpressionShare:      Math.min(1, avgIs),
    qualityScoreAvg,
    irrelevantQueryPercent:     Math.min(1, irrelevantQueryPercent),
  };
}

// ─── Conversion signals ───────────────────────────────────────────────────────

async function fetchConversionSignals(customer: Customer): Promise<ConversionSignals> {
  const { start, end } = last30Days();

  const rows = await customer.query(`
    SELECT
      metrics.clicks,
      metrics.conversions,
      landing_page_view.resource_name,
      metrics.mobile_friendly_clicks_percentage
    FROM landing_page_view
    WHERE segments.date BETWEEN '${start}' AND '${end}'
  `).catch(() => []);

  const totalClicks      = rows.reduce((s, r) => s + Number(r.metrics?.clicks ?? 0), 0);
  const totalConversions = rows.reduce((s, r) => s + Number(r.metrics?.conversions ?? 0), 0);
  const conversionRate   = totalClicks > 0 ? totalConversions / totalClicks : 0;

  // Landing page experience — from expanded landing page view
  const lpRows = await customer.query(`
    SELECT
      ad_group_ad.ad.final_urls,
      metrics.average_page_views,
      landing_page_view.unexpanded_final_url
    FROM landing_page_view
    WHERE segments.date BETWEEN '${start}' AND '${end}'
  `).catch(() => []);

  // Google Ads doesn't expose mobile speed score directly via API;
  // we use mobile-friendly clicks as a proxy (0–100)
  const mobilePercents = rows
    .map((r) => Number(r.metrics?.mobile_friendly_clicks_percentage ?? 0))
    .filter((v) => v > 0);
  const mobileSpeedScore = mobilePercents.length > 0
    ? Math.round(mobilePercents.reduce((a, b) => a + b, 0) / mobilePercents.length)
    : 65; // default

  // Landing page score: approximated from average page views (>1 = engaging)
  const avgPageViews = lpRows.length > 0
    ? lpRows.reduce((s, r) => s + Number(r.metrics?.average_page_views ?? 0), 0) / lpRows.length
    : 1;
  const landingPageScore = Math.min(10, Math.round(avgPageViews * 2));

  return {
    conversionRate,
    industryBenchmarkConversionRate: 0.03, // 3% generic e-commerce default; will be industry-specific later
    landingPageScore: Math.max(1, landingPageScore),
    mobileSpeedScore,
    bounceRateEstimate: avgPageViews < 1.2 ? 0.75 : avgPageViews < 1.5 ? 0.55 : 0.4,
  };
}

// ─── Funnel signals ───────────────────────────────────────────────────────────

async function fetchFunnelSignals(customer: Customer): Promise<FunnelSignals> {
  const { start, end } = last30Days();

  // Cost per conversion (lead proxy)
  const rows = await customer.query(`
    SELECT
      metrics.cost_micros,
      metrics.conversions,
      metrics.cost_per_conversion
    FROM customer
    WHERE segments.date BETWEEN '${start}' AND '${end}'
  `).catch(() => []);

  const totalCost        = rows.reduce((s, r) => s + Number(r.metrics?.cost_micros ?? 0), 0) / 1_000_000;
  const totalConversions = rows.reduce((s, r) => s + Number(r.metrics?.conversions ?? 0), 0);
  const costPerLead      = totalConversions > 0 ? totalCost / totalConversions : 0;

  // Offline conversions — check if any offline action type is configured
  const offlineActions = await customer.query(`
    SELECT conversion_action.type
    FROM conversion_action
    WHERE conversion_action.status = 'ENABLED'
      AND conversion_action.type IN (
        'UPLOAD_CLICKS',
        'UPLOAD_CALLS',
        'SALESFORCE',
        'ZAPIER'
      )
  `).catch(() => []);

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
  const { start, end } = last30Days();

  // Account-level ROAS and budget
  const rows = await customer.query(`
    SELECT
      metrics.cost_micros,
      metrics.conversions_value,
      metrics.conversions,
      campaign.target_roas.target_roas,
      campaign.target_cpa.target_cpa_micros,
      campaign.budget_amount_micros
    FROM campaign
    WHERE campaign.status = 'ENABLED'
      AND segments.date BETWEEN '${start}' AND '${end}'
  `).catch(() => []);

  const totalCost             = rows.reduce((s, r) => s + Number(r.metrics?.cost_micros ?? 0), 0) / 1_000_000;
  const totalConversionValue  = rows.reduce((s, r) => s + Number(r.metrics?.conversions_value ?? 0), 0);
  const totalConversions      = rows.reduce((s, r) => s + Number(r.metrics?.conversions ?? 0), 0);

  const actualRoas = totalCost > 0 ? totalConversionValue / totalCost : 0;
  const actualCpa  = totalConversions > 0 ? totalCost / totalConversions : 0;

  // Target ROAS — use most common target across campaigns
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

  // Budget utilization
  const budgetRows = await customer.query(`
    SELECT
      campaign_budget.amount_micros,
      metrics.cost_micros
    FROM campaign
    WHERE campaign.status = 'ENABLED'
      AND segments.date BETWEEN '${start}' AND '${end}'
  `).catch(() => []);

  const totalBudget = budgetRows.reduce(
    (s, r) => s + Number(r.campaign_budget?.amount_micros ?? 0), 0
  ) / 1_000_000;
  const budgetUtilizationPercent = totalBudget > 0
    ? Math.min(1, totalCost / (totalBudget * 30))
    : 0.8;

  return {
    targetRoas,
    actualRoas,
    targetCpa,
    actualCpa,
    grossMarginPercent: 0,   // Requires Shopify/manual input — will be 0 until connected
    ltv: 0,                  // Same — needs Shopify/CRM
    budgetUtilizationPercent,
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function fetchGoogleAdsSignals(): Promise<ConstraintSignals> {
  const client   = getClient();
  const customer = getCustomer(client);

  const [measurement, traffic, conversion, funnel, economics] = await Promise.all([
    fetchMeasurementSignals(customer),
    fetchTrafficSignals(customer),
    fetchConversionSignals(customer),
    fetchFunnelSignals(customer),
    fetchEconomicsSignals(customer),
  ]);

  return { measurement, traffic, conversion, funnel, economics };
}

export function isGoogleAdsConfigured(): boolean {
  return !!(
    process.env.GOOGLE_ADS_DEVELOPER_TOKEN &&
    process.env.GOOGLE_ADS_CLIENT_ID &&
    process.env.GOOGLE_ADS_CLIENT_SECRET &&
    process.env.GOOGLE_ADS_REFRESH_TOKEN &&
    process.env.GOOGLE_ADS_CUSTOMER_ID
  );
}
