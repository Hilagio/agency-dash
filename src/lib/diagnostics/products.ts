/**
 * Product-level diagnostic (BUILD-SPEC §4 concentration, §8 buyability).
 *
 * Joins what the ads DID per product (Google Ads shopping) with what actually
 * SOLD (Shopify line items), so the team can see spend landing on products that
 * aren't selling, under-funded winners, and how concentrated revenue is. Pure —
 * the matching is best-effort (by SKU/normalised title), and unmatched rows are
 * kept, never dropped, so nothing is silently hidden.
 */
export interface AdsProductAgg { itemId: string; title: string; spend: number; clicks: number; conversions: number; conversionValue: number; }
export interface SalesProductAgg { productId: string; title: string; units: number; revenue: number; }

export interface JoinedProduct {
  key: string;
  title: string;
  matched: boolean;      // did we line up ads spend with real sales?
  spend: number;
  clicks: number;
  adConversions: number;
  units: number;         // real units sold (Shopify)
  revenue: number;       // real revenue (Shopify)
  poas: number | null;   // (revenue × margin) ÷ spend
  spendNoSales: boolean; // real ad spend, zero real units — buyability/availability flag
}

export interface ProductConcentration {
  topShare: number;         // revenue share of the single biggest product
  top3Share: number;
  productCount: number;
  breadth: "concentrated" | "balanced" | "broad" | "unknown";
}

export interface ProductDiagnostic {
  products: JoinedProduct[];
  concentration: ProductConcentration;
  spendNoSalesCount: number;
  spendNoSalesTotal: number;   // ad spend on products with zero real sales
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Join ads + sales per product. Matching priority: exact normalised title. Ads
 * item ids (Merchant offer ids) rarely equal Shopify product ids, so title is
 * the pragmatic key; unmatched rows from either side are still returned.
 */
export function joinProducts(
  ads: AdsProductAgg[],
  sales: SalesProductAgg[],
  marginPct: number | null,
  minSpendNoSales = 10,
): ProductDiagnostic {
  const byTitle = new Map<string, JoinedProduct>();
  const keyOf = (title: string, fallback: string) => (norm(title) || `id:${fallback}`);

  for (const a of ads) {
    const k = keyOf(a.title, a.itemId);
    const e = byTitle.get(k) ?? blank(k, a.title);
    e.spend += a.spend; e.clicks += a.clicks; e.adConversions += a.conversions;
    byTitle.set(k, e);
  }
  for (const s of sales) {
    const k = keyOf(s.title, s.productId);
    const e = byTitle.get(k) ?? blank(k, s.title);
    e.units += s.units; e.revenue += s.revenue;
    byTitle.set(k, e);
  }

  const products = [...byTitle.values()].map(p => {
    p.matched = p.spend > 0 && p.units > 0;
    p.poas = p.revenue > 0 && marginPct != null && marginPct > 0 && p.spend > 0 ? (p.revenue * marginPct) / p.spend : null;
    p.spendNoSales = p.spend >= minSpendNoSales && p.units === 0;
    return p;
  }).sort((a, b) => (b.revenue - a.revenue) || (b.spend - a.spend));

  const totalRevenue = products.reduce((s, p) => s + p.revenue, 0);
  const sortedByRev = [...products].sort((a, b) => b.revenue - a.revenue);
  const topShare = totalRevenue > 0 ? (sortedByRev[0]?.revenue ?? 0) / totalRevenue : 0;
  const top3Share = totalRevenue > 0 ? sortedByRev.slice(0, 3).reduce((s, p) => s + p.revenue, 0) / totalRevenue : 0;
  const withRevenue = products.filter(p => p.revenue > 0).length;

  const breadth: ProductConcentration["breadth"] =
    totalRevenue <= 0 ? "unknown" : topShare >= 0.5 ? "concentrated" : top3Share >= 0.8 ? "balanced" : "broad";

  const spendNoSales = products.filter(p => p.spendNoSales);

  return {
    products,
    concentration: { topShare, top3Share, productCount: withRevenue, breadth },
    spendNoSalesCount: spendNoSales.length,
    spendNoSalesTotal: spendNoSales.reduce((s, p) => s + p.spend, 0),
  };
}

function blank(key: string, title: string): JoinedProduct {
  return { key, title, matched: false, spend: 0, clicks: 0, adConversions: 0, units: 0, revenue: 0, poas: null, spendNoSales: false };
}

// ─── Two-level rollup: variant ↔ product (§4 data-sufficiency) ─────────────────
// Google Ads item_ids are variant/offer-level (thin); rolling them up to the
// product is where a real "high spend, no conversions → exclude from feed" call
// can be made. Shopify sales come in at variant level too, so both sides line up.

export interface AdsVariantRow { itemId: string; title: string; spend: number; clicks: number; conversions: number; conversionValue: number; }
export interface SalesVariantRow { productId: string; variantId: string; title: string; variantTitle: string; units: number; revenue: number; }

export interface VariantLine {
  variantKey: string;
  label: string;
  spend: number; clicks: number; adConversions: number;
  units: number; revenue: number; poas: number | null;
  thin: boolean;          // individually too little data to judge
  spendNoSales: boolean;
}
export interface ProductGroup {
  productKey: string;
  title: string;
  spend: number; clicks: number; adConversions: number;
  units: number; revenue: number; poas: number | null;
  roas: number | null;
  variantCount: number;
  thinVariantCount: number;
  variants: VariantLine[];
  excludeCandidate: boolean;
  excludeReason: string | null;
  /** Spend that isn't returning: full spend if nothing converts, else spend above break-even POAS. */
  wastedSpend: number;
  /** Why it's underperforming (null if it isn't). */
  underperformReason: string | null;
}
export interface ProductGroupResult {
  groups: ProductGroup[];
  excludeCandidates: ProductGroup[];
  /** Products with real spend and poor return, ranked by wasted spend (worst first). */
  underperformers: ProductGroup[];
  concentration: ProductConcentration;
}
export interface ProductGroupConfig {
  marginPct: number | null;
  minProductSpend?: number;   // product-level spend before an exclude call is fair
  variantMinClicks?: number;  // below this a variant is "thin" on its own
  variantMinSpend?: number;
}

/** Trailing digits of a Shopify GID, e.g. gid://shopify/Product/123 → "123". */
function gidNumeric(gid: string): string {
  const m = /(\d+)\s*$/.exec(gid || "");
  return m ? m[1] : "";
}
/** Parse a Merchant offer id like "shopify_NL_<productId>_<variantId>". */
function parseOffer(itemId: string): { productRef: string; variantRef: string } {
  const parts = (itemId || "").split("_");
  if (parts[0] === "shopify" && parts.length >= 4) {
    return { productRef: parts[parts.length - 2], variantRef: parts[parts.length - 1] };
  }
  return { productRef: "", variantRef: itemId };
}

/**
 * Group variants under their product, rolling metrics up. Matching prefers real
 * ids (parsed offer id ↔ Shopify GID), falling back to normalised title. Flags
 * exclude-from-feed candidates on the ROLLUP, not on any single thin variant.
 */
export function buildProductGroups(
  ads: AdsVariantRow[], sales: SalesVariantRow[], cfg: ProductGroupConfig,
): ProductGroupResult {
  const minProductSpend = cfg.minProductSpend ?? 25;
  const variantMinClicks = cfg.variantMinClicks ?? 15;
  const variantMinSpend = cfg.variantMinSpend ?? 10;
  const margin = cfg.marginPct;

  interface G { productKey: string; title: string; variants: Map<string, VariantLine>; }
  const groups = new Map<string, G>();

  const pkFromRef = (ref: string, title: string) => (/^\d+$/.test(ref) ? `pid:${ref}` : `t:${norm(title)}`);
  const getGroup = (pk: string, title: string): G => {
    const g = groups.get(pk) ?? { productKey: pk, title, variants: new Map() };
    if (!g.title && title) g.title = title;
    groups.set(pk, g);
    return g;
  };
  const getVariant = (g: G, vk: string, label: string): VariantLine => {
    const v = g.variants.get(vk) ?? {
      variantKey: vk, label, spend: 0, clicks: 0, adConversions: 0, units: 0, revenue: 0, poas: null, thin: false, spendNoSales: false,
    };
    if ((!v.label || /^item |^variant$/.test(v.label)) && label) v.label = label;
    g.variants.set(vk, v);
    return v;
  };

  for (const a of ads) {
    const { productRef, variantRef } = parseOffer(a.itemId);
    const pk = pkFromRef(productRef, a.title);
    const g = getGroup(pk, a.title);
    const vk = variantRef ? `vid:${gidNumeric(variantRef) || variantRef}` : `item:${a.itemId}`;
    const v = getVariant(g, vk, `item ${variantRef || a.itemId}`);
    v.spend += a.spend; v.clicks += a.clicks; v.adConversions += a.conversions;
  }
  for (const s of sales) {
    const pnum = gidNumeric(s.productId);
    const pk = pnum ? `pid:${pnum}` : `t:${norm(s.title)}`;
    const g = getGroup(pk, s.title);
    const vnum = gidNumeric(s.variantId);
    const vk = vnum ? `vid:${vnum}` : `vid:__default`;
    const v = getVariant(g, vk, s.variantTitle || "variant");
    v.units += s.units; v.revenue += s.revenue;
  }

  const out: ProductGroup[] = [...groups.values()].map(g => {
    const variants = [...g.variants.values()].map(v => {
      v.poas = v.revenue > 0 && margin != null && margin > 0 && v.spend > 0 ? (v.revenue * margin) / v.spend : null;
      v.thin = v.spend < variantMinSpend || v.clicks < variantMinClicks;
      v.spendNoSales = v.spend >= variantMinSpend && v.units === 0;
      return v;
    }).sort((a, b) => b.spend - a.spend);

    const spend = sum(variants, "spend"), clicks = sum(variants, "clicks");
    const adConversions = sum(variants, "adConversions"), units = sum(variants, "units"), revenue = sum(variants, "revenue");
    const poas = revenue > 0 && margin != null && margin > 0 && spend > 0 ? (revenue * margin) / spend : null;
    const roas = revenue > 0 && spend > 0 ? revenue / spend : null;
    const thinVariantCount = variants.filter(v => v.thin).length;

    // The user's call: judge at the product level (rollup), not the thin variant.
    const excludeCandidate = spend >= minProductSpend && adConversions < 1;
    const excludeReason = excludeCandidate
      ? `${money(spend)} spend, ${clicks} clicks, 0 conversions across ${variants.length} variant${variants.length === 1 ? "" : "s"}`
        + (thinVariantCount ? ` (${thinVariantCount} too thin to judge alone)` : "")
      : null;

    // Underperforming = real spend, poor return. Wasted spend = the part not
    // paying its way (all of it if nothing converts, else spend above break-even).
    const belowBreakEven = poas != null && poas < 1;
    const noConversions = spend >= minProductSpend && adConversions < 1;
    const underperforming = spend >= minProductSpend && (noConversions || belowBreakEven);
    const wastedSpend = !underperforming ? 0
      : belowBreakEven ? spend * (1 - poas!)   // fraction of spend not covered by profit
      : spend;                                  // nothing converting → all of it
    const underperformReason = !underperforming ? null
      : noConversions ? `${money(spend)} spent, ${clicks} clicks, 0 conversions`
      : `POAS ${poas!.toFixed(2)} on ${money(spend)} — below break-even (${money(wastedSpend)} not returning)`;

    return {
      productKey: g.productKey, title: g.title || "Untitled product",
      spend, clicks, adConversions, units, revenue, poas, roas,
      variantCount: variants.length, thinVariantCount, variants,
      excludeCandidate, excludeReason, wastedSpend, underperformReason,
    };
  }).sort((a, b) => (b.revenue - a.revenue) || (b.spend - a.spend));

  const totalRevenue = out.reduce((s, p) => s + p.revenue, 0);
  const byRev = [...out].sort((a, b) => b.revenue - a.revenue);
  const topShare = totalRevenue > 0 ? (byRev[0]?.revenue ?? 0) / totalRevenue : 0;
  const top3Share = totalRevenue > 0 ? byRev.slice(0, 3).reduce((s, p) => s + p.revenue, 0) / totalRevenue : 0;
  const breadth: ProductConcentration["breadth"] =
    totalRevenue <= 0 ? "unknown" : topShare >= 0.5 ? "concentrated" : top3Share >= 0.8 ? "balanced" : "broad";

  return {
    groups: out,
    excludeCandidates: out.filter(p => p.excludeCandidate).sort((a, b) => b.spend - a.spend),
    underperformers: out.filter(p => p.underperformReason !== null).sort((a, b) => b.wastedSpend - a.wastedSpend),
    concentration: { topShare, top3Share, productCount: out.filter(p => p.revenue > 0).length, breadth },
  };
}

function sum<T>(rows: T[], f: keyof T): number { return rows.reduce((s, r) => s + (r[f] as unknown as number), 0); }
function money(n: number): string { return `€${Math.round(n).toLocaleString("en-GB")}`; }
