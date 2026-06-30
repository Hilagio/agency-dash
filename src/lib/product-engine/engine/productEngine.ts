// Ecomtrada product-performance engine.
// This is a faithful port of ecomtrada-product-status-tool.py (verified: identical status
// distribution on real client data — 2Grown 90d: 6 / 10 / 142 / 15 / 1). Keep the rules in sync.

import {
  RawRow, AnalysisOptions, AnalysisResult, ProductRow, Status,
  StatusSummaryRow, CountryRow, ExclusionRow,
} from './types';

/** Required EXPECTED conversions before a 0-seller is judged dead (the fair test). */
export const SAFETY = 1.5;

export const STATUS_ORDER: Status[] = ['WINNER', 'PROMISING', 'TEST', 'DRAG', 'EXCLUDE'];

export const STATUS_ACTION: Record<Status, string> = {
  WINNER: 'Budget op concentreren',
  PROMISING: 'Voeden, kandidaat-winner',
  TEST: 'Gecontroleerd testen (batches)',
  DRAG: 'Budget knijpen - onder break-even',
  EXCLUDE: 'Uitsluiten - getest, dood',
};

/** Brand-aligned colors per status (hex, no #). */
export const STATUS_COLOR: Record<Status, { solid: string; row: string }> = {
  WINNER:    { solid: '33CC80', row: 'C9F2DE' },
  PROMISING: { solid: 'A9DFA0', row: 'E8F5D9' },
  TEST:      { solid: 'C7CED0', row: 'ECEFF0' },
  DRAG:      { solid: 'F2A60D', row: 'FBE4C9' },
  EXCLUDE:   { solid: 'DC4444', row: 'F6C9C9' },
};

/** Parse a numeric cell the way the Python engine does: strip thousands commas, treat "--"/"" as NaN. */
export function num(v: unknown): number {
  if (v == null) return NaN;
  let s = String(v).trim();
  if (s === '' || s === '--') return NaN;
  s = s.replace(/,/g, '');
  const f = parseFloat(s);
  return isNaN(f) ? NaN : f;
}

/** The classification decision for a single aggregated product. Exposed for unit testing each branch. */
export function classifyProduct(
  p: { spend: number; revenue: number; conv: number; clicks: number },
  ctx: { convRate: number; breakEven: number; useRevenue: boolean },
): Status {
  const roas = p.spend ? p.revenue / p.spend : 0;
  const sells = ctx.useRevenue ? p.revenue > 0 : p.conv > 0;

  // WINNER / PROMISING (early returns, same order as Python)
  if (ctx.useRevenue) {
    if (roas >= 2.0 && p.spend >= 30) return 'WINNER';
    if (roas >= 2.0 && p.revenue > 0) return 'PROMISING';
  } else {
    if (p.conv >= 10 && roas >= 2.0) return 'WINNER';
    if (p.conv >= 3 && roas >= 2.0) return 'PROMISING';
  }
  // EXCLUDE: truly zero sales after a fair test
  if (!sells && (p.clicks * ctx.convRate >= SAFETY || p.spend > 50)) return 'EXCLUDE';
  // DRAG: spending meaningfully, below break-even
  if (p.spend >= 50 && roas < ctx.breakEven) return 'DRAG';
  return 'TEST';
}

const sum = (arr: number[]) => arr.reduce((a, b) => a + (b || 0), 0);

function modeTitle(items: RawRow[]): string {
  const counts = new Map<string, number>();
  for (const r of items) {
    const base = String(r.title ?? '')
      .split(' - ')[0].split(' – ')[0].split(',')[0]
      .trim();
    counts.set(base, (counts.get(base) ?? 0) + 1);
  }
  let best = ''; let bestN = -1;
  for (const [k, n] of counts) if (n > bestN) { best = k; bestN = n; }
  return best;
}

/** Main entry point. Give it RawRows (from the CSV or API adapter) and options. */
export function analyze(rows: RawRow[], opts: AnalysisOptions = {}): AnalysisResult {
  const margin = opts.margin ?? null;

  // Filter out non-product rows.
  const df = rows.filter((r) => r.itemId && String(r.itemId).trim() !== '--');

  // Currency (single-currency assumption — assert like the Python).
  const currencies = [...new Set(df.map((r) => r.currency).filter(Boolean))] as string[];
  if (currencies.length > 1) {
    throw new Error(`Multiple currencies ${currencies.join(', ')} - normalize before analyzing.`);
  }
  const currency = currencies[0] ?? '?';

  // Revenue mode failsafe: only use real revenue if requested AND present AND non-zero.
  let useRevenue = !!opts.useRevenue;
  if (useRevenue) {
    const revSum = sum(df.map((r) => r.revenue ?? 0));
    if (revSum === 0) useRevenue = false;
  }
  const rev = (r: RawRow) => (useRevenue ? (r.revenue ?? 0) : (r.convValue ?? 0));

  // Account totals.
  const totSpend = sum(df.map((r) => r.cost));
  const totRev = sum(df.map(rev));
  const totClicks = sum(df.map((r) => r.clicks));
  const totConv = sum(df.map((r) => r.conversions));
  const convRate = totClicks ? totConv / totClicks : 0.01;
  const exclClicks = Math.round(SAFETY / convRate);
  const breakEven = margin ? Math.round((1.0 / margin) * 100) / 100 : 1.70;
  const breakEvenAssumed = !margin;

  // Multi-country?
  const feedLabels = new Set(df.map((r) => r.feedLabel).filter(Boolean));
  const multi = feedLabels.size > 1;

  // Aggregate to PRODUCT level (item_group id = 3rd token of Item ID), combining variants AND countries.
  const groups = new Map<string, RawRow[]>();
  for (const r of df) {
    const parent = String(r.itemId).split('_')[2] || String(r.itemId);
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent)!.push(r);
  }

  const products: ProductRow[] = [];
  for (const [parent, items] of groups) {
    const clicks = sum(items.map((r) => r.clicks));
    const spend = sum(items.map((r) => r.cost));
    const conv = sum(items.map((r) => r.conversions));
    const revenue = sum(items.map(rev));
    const oos = items.some((r) => String(r.issues ?? '').toLowerCase().includes('out of stock'));
    const roas = spend ? revenue / spend : 0;
    const product: ProductRow = {
      parent,
      product: modeTitle(items),
      variants: new Set(items.map((r) => r.itemId)).size,
      clicks,
      expConv: Math.round(convRate * clicks * 100) / 100,
      spend,
      conv,
      revenue,
      roas: Math.round(roas * 100) / 100,
      convRate: clicks ? Math.round((conv / clicks * 100) * 100) / 100 : 0,
      status: classifyProduct({ spend, revenue, conv, clicks }, { convRate, breakEven, useRevenue }),
      oos,
    };
    if (multi) {
      const spent = items.filter((r) => (r.cost || 0) > 0);
      product.countries = new Set(spent.map((r) => r.feedLabel).filter(Boolean)).size;
      // best country by revenue
      const byC = new Map<string, number>();
      for (const r of items) {
        const c = r.feedLabel || '';
        byC.set(c, (byC.get(c) ?? 0) + rev(r));
      }
      let best = ''; let bestV = -Infinity;
      for (const [c, v] of byC) if (v > bestV) { best = c; bestV = v; }
      product.bestCountry = best;
    }
    products.push(product);
  }
  products.sort((a, b) => b.spend - a.spend);

  // Status summary.
  const statusSummary: StatusSummaryRow[] = STATUS_ORDER.map((status) => {
    const d = products.filter((p) => p.status === status);
    const spend = sum(d.map((p) => p.spend));
    const revenue = sum(d.map((p) => p.revenue));
    return {
      status,
      count: d.length,
      spend,
      spendPct: totSpend ? spend / totSpend : 0,
      revenue,
      roas: spend ? revenue / spend : 0,
      action: STATUS_ACTION[status],
    };
  });

  // Per-country breakdown.
  const countries: CountryRow[] = [];
  if (multi) {
    const byC = new Map<string, { spend: number; revenue: number; conv: number }>();
    for (const r of df) {
      const c = r.feedLabel || '';
      const cur = byC.get(c) ?? { spend: 0, revenue: 0, conv: 0 };
      cur.spend += r.cost || 0; cur.revenue += rev(r); cur.conv += r.conversions || 0;
      byC.set(c, cur);
    }
    for (const [label, v] of byC) {
      countries.push({
        label, spend: v.spend, spendPct: totSpend ? v.spend / totSpend : 0,
        revenue: v.revenue, roas: v.spend ? v.revenue / v.spend : 0, conv: v.conv,
      });
    }
    countries.sort((a, b) => b.spend - a.spend);
  }

  // Variant-level "safe to exclude now" list.
  const byItem = new Map<string, RawRow[]>();
  for (const r of df) {
    if (!byItem.has(r.itemId)) byItem.set(r.itemId, []);
    byItem.get(r.itemId)!.push(r);
  }
  const exclusions: ExclusionRow[] = [];
  for (const [itemId, items] of byItem) {
    const clicks = sum(items.map((r) => r.clicks));
    const spend = sum(items.map((r) => r.cost));
    const conv = sum(items.map((r) => r.conversions));
    const revenue = sum(items.map(rev));
    const seller = useRevenue ? revenue > 0 : conv > 0;
    const mask = !seller && (convRate * clicks >= SAFETY || spend > 50);
    const issues = [...new Set(items.map((r) => (r.issues ?? '').trim()).filter((x) => x && x !== 'nan'))].sort().join('; ');
    const oos = issues.toLowerCase().includes('out of stock');
    if (mask && !oos) {
      exclusions.push({
        itemId,
        title: items[0].title ?? '',
        clicks, spend, conv, revenue, issues,
      });
    }
  }
  exclusions.sort((a, b) => b.spend - a.spend);
  const exclusionRecovered = sum(exclusions.map((e) => e.spend));

  return {
    dateRange: opts.dateRange ?? '',
    currency,
    revenueColumnUsed: useRevenue ? 'revenue' : 'convValue',
    totals: {
      spend: totSpend, revenue: totRev, clicks: totClicks, conv: totConv,
      convRate, roas: totSpend ? totRev / totSpend : 0,
      breakEven, breakEvenAssumed, exclClicks,
    },
    multi,
    products,
    statusSummary,
    countries,
    exclusions,
    exclusionRecovered,
  };
}
