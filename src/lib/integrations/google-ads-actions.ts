/**
 * Google Ads Action Executor
 *
 * Implements real API mutations for safe automated actions.
 * Called from /api/actions/[id] POST handler.
 */

import { GoogleAdsApi, enums } from "google-ads-api";

function getCustomer(customerId: string) {
  const client = new GoogleAdsApi({
    client_id:       process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });

  return client.Customer({
    customer_id:       customerId,
    login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || undefined,
    refresh_token:     process.env.GOOGLE_ADS_REFRESH_TOKEN!,
  });
}

// ─── Exclude irrelevant search terms ─────────────────────────────────────────
// Fetches the top wasted-spend queries (0 conversions, >5 clicks in last 30d)
// and adds them as broad-match campaign-level negatives.

export async function executeExcludeSearchTerms(googleAdsId: string): Promise<string> {
  const customer = getCustomer(googleAdsId);

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
  const customer = getCustomer(googleAdsId);

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
