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
