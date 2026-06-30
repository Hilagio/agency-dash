// Adapter: Shopify Sidekick CSV exports -> a single Shopify metrics block for the plan.
// The Sidekick output is four tidy files per window:
//   summary_metrics_*  : Average order value, Total sales, Orders
//   profit_report_*    : Gross profit, Cost of goods sold, Gross margin (decimal), Net sales, …
//   top_products_*     : Product title, Quantity ordered, Net sales, Total sales
//   inventory_levels_* : Product title, Ending inventory units, Days in/out of stock, Sell-through
//
// All numbers are parsed best-effort and surfaced for the AM to confirm before generating.

import { num } from '../engine/productEngine';

function tokenize(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c === '\r') { /* ignore */ }
    else cur += c;
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

/** Parse a header+single-row CSV into a lowercased-header -> value map. */
function parseKeyed(text: string): Record<string, string> {
  const recs = tokenize(text);
  if (recs.length < 2) return {};
  const head = recs[0].map((h) => h.trim().toLowerCase());
  const out: Record<string, string> = {};
  head.forEach((h, i) => { out[h] = (recs[1][i] ?? '').trim(); });
  return out;
}

/** Parse a header+many-rows CSV into objects keyed by lowercased header. */
function parseTable(text: string): Record<string, string>[] {
  const recs = tokenize(text);
  if (recs.length < 2) return [];
  const head = recs[0].map((h) => h.trim().toLowerCase());
  return recs.slice(1).map((r) => {
    const o: Record<string, string> = {};
    head.forEach((h, i) => { o[h] = (r[i] ?? '').trim(); });
    return o;
  });
}

const pick = (m: Record<string, string>, ...keys: string[]) => {
  for (const k of keys) { const hit = Object.keys(m).find((h) => h.includes(k)); if (hit) return m[hit]; }
  return '';
};

export interface ShopifyManual {
  totalRevenue:   number | null;
  aov:            number | null;
  orders:         number | null;
  grossMarginPct: number | null;   // percentage 0–100
  cogs:           number | null;
  netSales:       number | null;
  mostSold:       string | null;
  inStock:        string | null;
}

export interface SidekickFiles {
  summary?:   string;
  profit?:    string;
  top?:       string;
  inventory?: string;
}

/** Combine the four Sidekick CSVs into one Shopify block (any subset is fine). */
export function buildShopifyFromSidekick(files: SidekickFiles): ShopifyManual {
  const out: ShopifyManual = {
    totalRevenue: null, aov: null, orders: null,
    grossMarginPct: null, cogs: null, netSales: null, mostSold: null, inStock: null,
  };

  if (files.summary) {
    const s = parseKeyed(files.summary);
    const aov = num(pick(s, 'average order value', 'aov'));
    const total = num(pick(s, 'total sales'));
    const orders = num(pick(s, 'orders'));
    out.aov = isNaN(aov) ? null : aov;
    out.totalRevenue = isNaN(total) ? null : total;
    out.orders = isNaN(orders) ? null : orders;
  }

  if (files.profit) {
    const p = parseKeyed(files.profit);
    const cogs = num(pick(p, 'cost of goods sold', 'cogs'));
    const net = num(pick(p, 'net sales'));
    const marginRaw = num(pick(p, 'gross margin'));
    out.cogs = isNaN(cogs) ? null : cogs;
    out.netSales = isNaN(net) ? null : net;
    // Sidekick reports gross margin as a decimal (0.927). Normalise to a percentage.
    if (!isNaN(marginRaw)) out.grossMarginPct = marginRaw <= 1 ? Math.round(marginRaw * 1000) / 10 : Math.round(marginRaw * 10) / 10;
  }

  if (files.top) {
    const rows = parseTable(files.top);
    const top = rows.slice(0, 5).map((r) => {
      const title = pick(r, 'product title', 'title');
      const qty = num(pick(r, 'quantity ordered', 'quantity'));
      return title ? `${title}${isNaN(qty) ? '' : ` (${qty})`}` : '';
    }).filter(Boolean);
    if (top.length) out.mostSold = top.join('; ');
  }

  if (files.inventory) {
    const rows = parseTable(files.inventory);
    const oos = rows
      .map((r) => ({ title: pick(r, 'product title', 'title'), days: num(pick(r, 'days out of stock')) }))
      .filter((x) => x.title && !isNaN(x.days) && x.days > 0)
      .slice(0, 8)
      .map((x) => `${x.title}: ${x.days}d OOS`);
    out.inStock = oos.length ? oos.join('; ') : 'Core products in stock (no out-of-stock days reported)';
  }

  return out;
}
