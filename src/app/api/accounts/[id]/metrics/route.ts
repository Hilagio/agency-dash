/**
 * POST /api/accounts/[id]/metrics
 *
 * Flexible metric query endpoint. Returns a flat list of rows where each row
 * has a label (dimension value) and every available metric for that dimension.
 *
 * Body: { view: ViewKey, dateRange: "7d"|"14d"|"30d"|"90d" }
 *
 * Supported views:
 *   campaign, ad_group, device, age, gender, income, parental,
 *   geo, dayofweek, hour, keyword, searchterm, product
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { GoogleAdsApi } from "google-ads-api";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export type ViewKey =
  | "campaign" | "ad_group" | "device" | "age" | "gender"
  | "income"   | "parental" | "geo"    | "dayofweek" | "hour"
  | "keyword"  | "searchterm" | "product";

export interface MetricRow {
  label:            string;
  sublabel?:        string;
  impressions:      number;
  clicks:           number;
  ctr:              number;   // 0–1
  cost:             number;   // in account currency
  avgCpc:           number;
  conversions:      number;
  conversionRate:   number;   // 0–1
  revenue:          number;   // conversions_value
  roas:             number;   // revenue / cost
  cpa:              number;   // cost / conversions
  cpm:              number;   // cost / impressions * 1000
  impressionShare:  number;   // 0–1 (0 = not available for this view)
  isLostBudget:     number;   // 0–1
  isLostRank:       number;   // 0–1
}

function dateRange(range: string, customStart?: string, customEnd?: string): { start: string; end: string } {
  if (range === "custom" && customStart && customEnd) {
    return { start: customStart, end: customEnd };
  }
  const days = range === "3d" ? 3 : range === "7d" ? 7 : range === "14d" ? 14 : range === "90d" ? 90 : 30;
  const end   = new Date(); end.setDate(end.getDate() - 1);
  const start = new Date(end); start.setDate(start.getDate() - (days - 1));
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { start: fmt(start), end: fmt(end) };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRow(label: string, m: any, sublabel?: string, extra: Partial<MetricRow> = {}): MetricRow {
  const impressions    = Number(m?.impressions ?? 0);
  const clicks         = Number(m?.clicks ?? 0);
  const costMicros     = Number(m?.cost_micros ?? 0);
  const cost           = costMicros / 1_000_000;
  const conversions    = Number(m?.conversions ?? 0);
  const revenue        = Number(m?.conversions_value ?? 0);
  const avgCpc         = Number(m?.average_cpc ?? 0) / 1_000_000;
  const is             = Number(m?.search_impression_share ?? 0);
  const isLostBudget   = Number(m?.search_budget_lost_impression_share ?? 0);
  const isLostRank     = Number(m?.search_rank_lost_impression_share ?? 0);
  return {
    label,
    sublabel,
    impressions,
    clicks,
    ctr:            impressions > 0 ? clicks / impressions : 0,
    cost,
    avgCpc,
    conversions,
    conversionRate: clicks > 0 ? conversions / clicks : 0,
    revenue,
    roas:           cost > 0 ? revenue / cost : 0,
    cpa:            conversions > 0 ? cost / conversions : 0,
    cpm:            impressions > 0 ? (cost / impressions) * 1000 : 0,
    impressionShare: is,
    isLostBudget,
    isLostRank,
    ...extra,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function aggregate(rows: any[], keyFn: (r: any) => string, labelFn: (r: any) => string, subFn?: (r: any) => string): MetricRow[] {
  const map = new Map<string, MetricRow & { _impr: number; _clicks: number; _cost: number; _conv: number; _rev: number; _is: number; _isB: number; _isR: number; _cpcSum: number; _cpcN: number }>();
  for (const r of rows) {
    const key = keyFn(r);
    if (!key) continue;
    const m = r.metrics ?? {};
    const cost      = Number(m.cost_micros ?? 0) / 1_000_000;
    const impr      = Number(m.impressions ?? 0);
    const clicks    = Number(m.clicks ?? 0);
    const conv      = Number(m.conversions ?? 0);
    const rev       = Number(m.conversions_value ?? 0);
    const is        = Number(m.search_impression_share ?? 0);
    const isB       = Number(m.search_budget_lost_impression_share ?? 0);
    const isR       = Number(m.search_rank_lost_impression_share ?? 0);
    const cpc       = Number(m.average_cpc ?? 0) / 1_000_000;
    const existing  = map.get(key);
    if (!existing) {
      map.set(key, {
        label: labelFn(r), sublabel: subFn?.(r),
        impressions: impr, clicks, cost,
        conversions: conv, revenue: rev,
        ctr: 0, avgCpc: 0, conversionRate: 0,
        roas: 0, cpa: 0, cpm: 0,
        impressionShare: 0, isLostBudget: 0, isLostRank: 0,
        _impr: impr, _clicks: clicks, _cost: cost,
        _conv: conv, _rev: rev,
        _is: is, _isB: isB, _isR: isR,
        _cpcSum: cpc * clicks, _cpcN: clicks,
      });
    } else {
      existing.impressions += impr;
      existing.clicks      += clicks;
      existing.cost        += cost;
      existing.conversions += conv;
      existing.revenue     += rev;
      existing._is         += is;
      existing._isB        += isB;
      existing._isR        += isR;
      existing._cpcSum     += cpc * clicks;
      existing._cpcN       += clicks;
    }
  }
  return Array.from(map.values()).map(r => {
    const n = map.size; void n;
    return {
      label:          r.label,
      sublabel:       r.sublabel,
      impressions:    r.impressions,
      clicks:         r.clicks,
      cost:           r.cost,
      conversions:    r.conversions,
      revenue:        r.revenue,
      ctr:            r.impressions > 0 ? r.clicks / r.impressions : 0,
      avgCpc:         r._cpcN > 0 ? r._cpcSum / r._cpcN : 0,
      conversionRate: r.clicks > 0 ? r.conversions / r.clicks : 0,
      roas:           r.cost > 0 ? r.revenue / r.cost : 0,
      cpa:            r.conversions > 0 ? r.cost / r.conversions : 0,
      cpm:            r.impressions > 0 ? (r.cost / r.impressions) * 1000 : 0,
      impressionShare: r._is,
      isLostBudget:   r._isB,
      isLostRank:     r._isR,
    };
  }).filter(r => r.clicks > 0 || r.impressions > 0);
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;
  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();
  if (!account.googleAdsId) return NextResponse.json({ error: "No Google Ads account" }, { status: 422 });

  const { view, dateRange: dr = "30d", customStart, customEnd } = await req.json() as { view: ViewKey; dateRange?: string; customStart?: string; customEnd?: string };
  const { start, end } = dateRange(dr, customStart, customEnd);

  const gads = new GoogleAdsApi({
    client_id:       process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });
  const cred = await prisma.oAuthCredential.findFirst().catch(() => null);
  const refreshToken = cred?.refreshToken ?? process.env.GOOGLE_ADS_REFRESH_TOKEN ?? "";
  if (!refreshToken) return NextResponse.json({ error: "No auth token" }, { status: 401 });

  const customer = gads.Customer({
    customer_id:       account.googleAdsId,
    login_customer_id: cred?.loginCustomerId ?? process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
    refresh_token:     refreshToken,
  });

  const CORE_METRICS = `
    metrics.impressions, metrics.clicks, metrics.ctr,
    metrics.cost_micros, metrics.average_cpc,
    metrics.conversions, metrics.conversions_value,
    metrics.conversions_from_interactions_rate,
    metrics.search_impression_share,
    metrics.search_budget_lost_impression_share,
    metrics.search_rank_lost_impression_share`;

  const safe = async (q: string, label: string) => {
    try { return await customer.query(q); }
    catch (e) { console.warn(`[metrics] ${label}:`, e instanceof Error ? e.message : e); return []; }
  };

  let rows: MetricRow[] = [];

  if (view === "campaign") {
    const raw = await safe(`
      SELECT campaign.id, campaign.name, campaign.advertising_channel_type,
             ${CORE_METRICS}
      FROM campaign
      WHERE campaign.status = 'ENABLED'
        AND segments.date BETWEEN '${start}' AND '${end}'
    `, "campaign");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows = aggregate(raw, r => String((r as any).campaign?.id), r => (r as any).campaign?.name ?? "Unknown",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => (r as any).campaign?.advertising_channel_type ?? "");
  }

  else if (view === "ad_group") {
    const raw = await safe(`
      SELECT ad_group.id, ad_group.name, campaign.name,
             ${CORE_METRICS}
      FROM ad_group
      WHERE ad_group.status = 'ENABLED'
        AND campaign.status = 'ENABLED'
        AND segments.date BETWEEN '${start}' AND '${end}'
    `, "ad_group");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows = aggregate(raw, r => String((r as any).ad_group?.id), r => (r as any).ad_group?.name ?? "Unknown",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => (r as any).campaign?.name ?? "");
  }

  else if (view === "device") {
    const raw = await safe(`
      SELECT segments.device, ${CORE_METRICS}
      FROM campaign
      WHERE campaign.status = 'ENABLED'
        AND segments.date BETWEEN '${start}' AND '${end}'
    `, "device");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows = aggregate(raw, r => String((r as any).segments?.device ?? "UNKNOWN"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => String((r as any).segments?.device ?? "UNKNOWN"));
  }

  else if (view === "age") {
    const raw = await safe(`
      SELECT ad_group_criterion.age_range.type, ${CORE_METRICS}
      FROM age_range_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
    `, "age");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows = aggregate(raw, r => String((r as any).ad_group_criterion?.age_range?.type ?? "UNKNOWN"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => String((r as any).ad_group_criterion?.age_range?.type ?? "UNKNOWN").replace("AGE_RANGE_", "").replace(/_/g, "–"));
  }

  else if (view === "gender") {
    const raw = await safe(`
      SELECT ad_group_criterion.gender.type, ${CORE_METRICS}
      FROM gender_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
    `, "gender");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows = aggregate(raw, r => String((r as any).ad_group_criterion?.gender?.type ?? "UNKNOWN"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => String((r as any).ad_group_criterion?.gender?.type ?? "UNKNOWN"));
  }

  else if (view === "income") {
    const raw = await safe(`
      SELECT ad_group_criterion.income_range.type, ${CORE_METRICS}
      FROM income_range_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
    `, "income");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows = aggregate(raw, r => String((r as any).ad_group_criterion?.income_range?.type ?? "UNKNOWN"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => String((r as any).ad_group_criterion?.income_range?.type ?? "UNKNOWN").replace("INCOME_RANGE_", "").replace(/_/g, "–").replace("UP", "+"));
  }

  else if (view === "parental") {
    const raw = await safe(`
      SELECT ad_group_criterion.parental_status.type, ${CORE_METRICS}
      FROM parental_status_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
    `, "parental");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows = aggregate(raw, r => String((r as any).ad_group_criterion?.parental_status?.type ?? "UNKNOWN"),
      r => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const t = String((r as any).ad_group_criterion?.parental_status?.type ?? "UNKNOWN");
        return t === "PARENT" ? "Parent" : t === "NOT_A_PARENT" ? "Not a parent" : t;
      });
  }

  else if (view === "geo") {
    const raw = await safe(`
      SELECT user_location_view.country_criterion_id, user_location_view.targeting_location,
             ${CORE_METRICS}
      FROM user_location_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
        AND user_location_view.targeting_location = false
        AND metrics.clicks > 0
      LIMIT 200
    `, "geo");

    // Resolve criterion IDs → names
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ids = [...new Set(raw.map(r => Number((r as any).user_location_view?.country_criterion_id ?? 0)).filter(Boolean))];
    const nameMap = new Map<number, string>();
    if (ids.length > 0) {
      const nameRows = await safe(`
        SELECT geo_target_constant.id, geo_target_constant.canonical_name
        FROM geo_target_constant
        WHERE geo_target_constant.id IN (${ids.slice(0, 50).join(",")})
      `, "geo names");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const nr of nameRows) nameMap.set(Number((nr as any).geo_target_constant?.id), String((nr as any).geo_target_constant?.canonical_name ?? ""));
    }

    rows = aggregate(
      raw,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => String((r as any).user_location_view?.country_criterion_id ?? ""),
      r => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const id = Number((r as any).user_location_view?.country_criterion_id ?? 0);
        return nameMap.get(id) ?? `Location ${id}`;
      }
    );
  }

  else if (view === "dayofweek") {
    const raw = await safe(`
      SELECT segments.day_of_week, ${CORE_METRICS}
      FROM customer
      WHERE segments.date BETWEEN '${start}' AND '${end}'
    `, "dayofweek");
    const DOW_ORDER = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows = aggregate(raw, r => String((r as any).segments?.day_of_week ?? ""),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => String((r as any).segments?.day_of_week ?? ""));
    rows.sort((a, b) => DOW_ORDER.indexOf(a.label) - DOW_ORDER.indexOf(b.label));
  }

  else if (view === "hour") {
    const raw = await safe(`
      SELECT segments.hour, ${CORE_METRICS}
      FROM customer
      WHERE segments.date BETWEEN '${start}' AND '${end}'
    `, "hour");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows = aggregate(raw, r => String((r as any).segments?.hour ?? ""),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => `${(r as any).segments?.hour}:00`);
    rows.sort((a, b) => parseInt(a.label) - parseInt(b.label));
  }

  else if (view === "keyword") {
    const raw = await safe(`
      SELECT ad_group_criterion.keyword.text,
             ad_group_criterion.keyword.match_type,
             campaign.name, ad_group.name,
             ${CORE_METRICS}
      FROM keyword_view
      WHERE ad_group_criterion.status = 'ENABLED'
        AND campaign.status = 'ENABLED'
        AND segments.date BETWEEN '${start}' AND '${end}'
        AND metrics.impressions > 0
      ORDER BY metrics.cost_micros DESC
      LIMIT 500
    `, "keyword");
    rows = aggregate(
      raw,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => `${(r as any).ad_group_criterion?.keyword?.text}::${(r as any).ad_group_criterion?.keyword?.match_type}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => `${(r as any).ad_group_criterion?.keyword?.text} [${String((r as any).ad_group_criterion?.keyword?.match_type ?? "").replace("EXACT","E").replace("PHRASE","P").replace("BROAD","B")}]`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => `${(r as any).campaign?.name} › ${(r as any).ad_group?.name}`
    );
  }

  else if (view === "searchterm") {
    const raw = await safe(`
      SELECT search_term_view.search_term,
             search_term_view.status,
             campaign.name,
             ${CORE_METRICS}
      FROM search_term_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
        AND metrics.impressions > 0
      ORDER BY metrics.cost_micros DESC
      LIMIT 500
    `, "searchterm");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows = aggregate(raw, r => String((r as any).search_term_view?.search_term ?? ""),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => String((r as any).search_term_view?.search_term ?? ""),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => (r as any).campaign?.name ?? "");
  }

  else if (view === "product") {
    const raw = await safe(`
      SELECT segments.product_item_id,
             segments.product_title,
             segments.product_brand,
             ${CORE_METRICS}
      FROM shopping_performance_view
      WHERE segments.date BETWEEN '${start}' AND '${end}'
        AND metrics.impressions > 0
      ORDER BY metrics.cost_micros DESC
      LIMIT 500
    `, "product");
    rows = aggregate(
      raw,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => String((r as any).segments?.product_item_id ?? ""),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => String((r as any).segments?.product_title ?? (r as any).segments?.product_item_id ?? "Unknown"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      r => (r as any).segments?.product_brand ?? ""
    );
  }

  rows.sort((a, b) => b.cost - a.cost);
  return NextResponse.json({ rows, view, dateRange: dr, currency: account.currency });
}
