/**
 * Google Ads Action Executor
 *
 * Implements real API mutations for safe automated actions.
 * Called from /api/actions/[id] POST handler.
 */

import { GoogleAdsApi, enums } from "google-ads-api";
import { prisma } from "@/lib/db";

async function getRefreshToken(): Promise<string> {
  if (process.env.GOOGLE_ADS_REFRESH_TOKEN) return process.env.GOOGLE_ADS_REFRESH_TOKEN;
  const cred = await prisma.oAuthCredential.findUnique({ where: { id: "singleton" } });
  if (cred?.refreshToken) return cred.refreshToken;
  throw new Error("No Google Ads refresh token configured");
}

async function getCustomer(customerId: string) {
  const refreshToken = await getRefreshToken();
  const client = new GoogleAdsApi({
    client_id:       process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });

  return client.Customer({
    customer_id:       customerId,
    login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || undefined,
    refresh_token:     refreshToken,
  });
}

// ─── Exclude irrelevant search terms ─────────────────────────────────────────
// Fetches the top wasted-spend queries (0 conversions, >5 clicks in last 30d)
// and adds them as broad-match campaign-level negatives.

export async function executeExcludeSearchTerms(googleAdsId: string): Promise<string> {
  const customer = await getCustomer(googleAdsId);

  const end   = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  // Fetch irrelevant terms: >5 clicks, 0 conversions, meaningful spend
  const terms = await customer.query(`
    SELECT
      search_term_view.search_term,
      search_term_view.ad_group,
      ad_group.campaign,
      metrics.clicks,
      metrics.conversions,
      metrics.cost_micros
    FROM search_term_view
    WHERE segments.date BETWEEN '${fmt(start)}' AND '${fmt(end)}'
      AND metrics.clicks > 5
      AND metrics.conversions = 0
    ORDER BY metrics.cost_micros DESC
    LIMIT 50
  `);

  if (terms.length === 0) {
    return "No irrelevant search terms found (0-conversion, >5 clicks). Nothing to exclude.";
  }

  // Deduplicate by term text and collect unique campaign resource names
  const termsByCampaign = new Map<string, Set<string>>();
  for (const row of terms) {
    const campaign = row.ad_group?.campaign as string | undefined;
    const term     = row.search_term_view?.search_term as string | undefined;
    if (!campaign || !term) continue;
    if (!termsByCampaign.has(campaign)) termsByCampaign.set(campaign, new Set());
    termsByCampaign.get(campaign)!.add(term);
  }

  // Build negative keyword mutations per campaign
  const mutations: Parameters<typeof customer.mutateResources>[0] = [];
  for (const [campaign, termSet] of termsByCampaign) {
    for (const term of termSet) {
      mutations.push({
        entity: "campaign_criterion",
        operation: "create",
        resource: {
          campaign,
          negative: true,
          type: enums.CriterionType.KEYWORD,
          keyword: {
            text: term,
            match_type: enums.KeywordMatchType.BROAD,
          },
        },
      });
    }
  }

  const result = await customer.mutateResources(mutations, { partial_failure: true });

  const succeeded = mutations.length - (result.partial_failure_error ? 1 : 0);
  const termCount = new Set(terms.map((r) => r.search_term_view?.search_term)).size;

  return (
    `Added ${succeeded} negative keyword(s) across ${termsByCampaign.size} campaign(s). ` +
    `Covered ${termCount} unique irrelevant search terms. ` +
    `Top excluded: ${[...termsByCampaign.values()][0] ? [...[...termsByCampaign.values()][0]].slice(0, 3).join(", ") : "—"}`
  );
}

// ─── Enable Enhanced Conversions ─────────────────────────────────────────────
// Sets enhanced_conversions_settings.enabled = true on all active WEBPAGE
// conversion actions.

export async function executeEnableEnhancedConversions(googleAdsId: string): Promise<string> {
  const customer = await getCustomer(googleAdsId);

  const actions = await customer.query(`
    SELECT
      conversion_action.resource_name,
      conversion_action.id,
      conversion_action.name,
      conversion_action.type,
      conversion_action.enhanced_conversions_settings.enabled
    FROM conversion_action
    WHERE conversion_action.status = 'ENABLED'
      AND conversion_action.type = 'WEBPAGE'
  `);

  if (actions.length === 0) {
    return "No active WEBPAGE conversion actions found to enable Enhanced Conversions on.";
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const alreadyEnabled = actions.filter(
    (r) => (r.conversion_action as any)?.enhanced_conversions_settings?.enabled === true
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toEnable = actions.filter(
    (r) => (r.conversion_action as any)?.enhanced_conversions_settings?.enabled !== true
  );

  if (toEnable.length === 0) {
    return `Enhanced Conversions already enabled on all ${alreadyEnabled.length} WEBPAGE conversion action(s). No changes needed.`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutations: any[] = toEnable.map((r) => ({
    entity: "conversion_action",
    operation: "update",
    resource: {
      resource_name: r.conversion_action!.resource_name as string,
      enhanced_conversions_settings: { enabled: true },
    },
    update_mask: { paths: ["enhanced_conversions_settings.enabled"] },
  }));

  await customer.mutateResources(mutations);

  const names = toEnable
    .map((r) => r.conversion_action?.name as string)
    .filter(Boolean)
    .join(", ");

  return (
    `Enhanced Conversions enabled on ${toEnable.length} conversion action(s): ${names}. ` +
    (alreadyEnabled.length > 0 ? `${alreadyEnabled.length} already had it enabled.` : "")
  );
}

// ─── Pause zero-impression ad groups ─────────────────────────────────────────
// Pauses SEARCH ad groups that received 0 impressions in the last 30 days.
// Skips brand-named campaigns and Shopping/PMax (they don't use classic ad groups).
// This is safe and reversible — groups that haven't run in a month waste no money
// but clutter structure and can dilute quality score averages.

export async function executePauseZeroImpressionAdGroups(googleAdsId: string): Promise<string> {
  const customer = await getCustomer(googleAdsId);

  const end   = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  // All enabled SEARCH ad groups
  const allRows = await customer.query(`
    SELECT ad_group.id, ad_group.name, ad_group.resource_name, campaign.name
    FROM ad_group
    WHERE ad_group.status = 'ENABLED'
      AND campaign.status = 'ENABLED'
      AND campaign.advertising_channel_type = 'SEARCH'
    LIMIT 1000
  `);

  // Ad groups that had any impressions in the last 30 days
  const activeRows = await customer.query(`
    SELECT ad_group.id
    FROM ad_group
    WHERE ad_group.status = 'ENABLED'
      AND campaign.status = 'ENABLED'
      AND campaign.advertising_channel_type = 'SEARCH'
      AND metrics.impressions > 0
      AND segments.date BETWEEN '${fmt(start)}' AND '${fmt(end)}'
    LIMIT 1000
  `);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeIds = new Set(activeRows.map(r => String((r.ad_group as any)?.id ?? "")).filter(Boolean));

  const toPause = allRows.filter(r => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = String((r.ad_group as any)?.id ?? "");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const campName = String((r.campaign as any)?.name ?? "").toLowerCase();
    if (!id) return false;
    if (campName.includes("brand") || campName.includes("merken")) return false;
    return !activeIds.has(id);
  });

  if (toPause.length === 0) {
    return "No zero-impression SEARCH ad groups found to pause. All active ad groups served impressions in the last 30 days.";
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutations: any[] = toPause.map(r => ({
    entity: "ad_group",
    operation: "update",
    resource: {
      resource_name: r.ad_group!.resource_name as string,
      status: enums.AdGroupStatus.PAUSED,
    },
    update_mask: { paths: ["status"] },
  }));

  await customer.mutateResources(mutations, { partial_failure: true });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const names = toPause.slice(0, 5).map(r => (r.ad_group as any)?.name as string).filter(Boolean).join(", ");
  const more  = toPause.length > 5 ? ` +${toPause.length - 5} more` : "";

  return `Paused ${toPause.length} zero-impression ad group(s): ${names}${more}.`;
}

// ─── Pause non-converting EXACT/PHRASE keywords ───────────────────────────────
// Pauses keywords with EXACT or PHRASE match type that spent money in the last
// 30 days but had 0 conversions. Only touches EXACT/PHRASE — BROAD is excluded
// because broad match may reach converting intent even if the keyword itself
// shows 0 attributed conversions.
//
// payload.costThresholdMultiple: pause keywords that spent > N × targetCpa
// (defaults to 2× if not provided, or a flat €5 floor to avoid pausing tiny spend)

export async function executePauseNonConvertingKeywords(
  googleAdsId: string,
  payload: Record<string, unknown> = {},
): Promise<string> {
  const customer = await getCustomer(googleAdsId);

  const end   = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  // Query keywords with aggregated 30-day totals (no segments.date → GAQL auto-groups)
  const kwRows = await customer.query(`
    SELECT
      ad_group_criterion.criterion_id,
      ad_group_criterion.resource_name,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      metrics.cost_micros,
      metrics.conversions
    FROM keyword_view
    WHERE ad_group_criterion.status = 'ENABLED'
      AND campaign.status = 'ENABLED'
      AND ad_group.status = 'ENABLED'
      AND ad_group_criterion.keyword.match_type IN ('EXACT', 'PHRASE')
      AND segments.date BETWEEN '${fmt(start)}' AND '${fmt(end)}'
    LIMIT 5000
  `);

  // Group by criterion_id to aggregate multi-day rows
  const kwMap = new Map<string, { resourceName: string; text: string; matchType: string; cost: number; conversions: number }>();
  for (const r of kwRows) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id     = String((r.ad_group_criterion as any)?.criterion_id ?? "");
    const cost   = Number(r.metrics?.cost_micros ?? 0) / 1_000_000;
    const conv   = Number(r.metrics?.conversions ?? 0);
    if (!id) continue;
    const entry = kwMap.get(id) ?? {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resourceName: (r.ad_group_criterion as any)?.resource_name as string ?? "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      text:      (r.ad_group_criterion as any)?.keyword?.text      as string ?? "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      matchType: (r.ad_group_criterion as any)?.keyword?.match_type as string ?? "",
      cost: 0, conversions: 0,
    };
    entry.cost        += cost;
    entry.conversions += conv;
    kwMap.set(id, entry);
  }

  // Apply cost floor: minimum €5 spent AND 0 conversions
  const costFloor = typeof payload.costFloor === "number" ? payload.costFloor : 5;
  const toPause = [...kwMap.values()].filter(k => k.conversions < 1 && k.cost >= costFloor);

  if (toPause.length === 0) {
    return `No EXACT/PHRASE keywords found that spent ≥€${costFloor} with 0 conversions in the last 30 days.`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutations: any[] = toPause.map(k => ({
    entity: "ad_group_criterion",
    operation: "update",
    resource: {
      resource_name: k.resourceName,
      status: enums.AdGroupCriterionStatus.PAUSED,
    },
    update_mask: { paths: ["status"] },
  }));

  await customer.mutateResources(mutations, { partial_failure: true });

  const totalWasted = toPause.reduce((s, k) => s + k.cost, 0);
  const names = toPause.slice(0, 5).map(k => `[${k.matchType.toLowerCase()}] ${k.text}`).join(", ");
  const more  = toPause.length > 5 ? ` +${toPause.length - 5} more` : "";

  return (
    `Paused ${toPause.length} non-converting keyword(s) — €${Math.round(totalWasted)} reclaimed. ` +
    `Keywords: ${names}${more}.`
  );
}
