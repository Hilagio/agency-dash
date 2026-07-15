/**
 * Product-performance report (the automated "Lydia" report).
 *
 * Takes the per-product totals over a window and buckets every product into an
 * action — Exclude (0 sales) / Scale / Lower / Keep / Exclude (loss) — with the
 * spend + revenue per bucket, plus a one-line "kern" headline. Pure + testable.
 */
import type { ProductReportRow } from "@/lib/integrations/google-ads";

export type ProductAction = "exclude_no_sales" | "scale" | "lower" | "keep" | "exclude_loss";

export interface ProductReportConfig {
  scaleRoas?: number;   // ROAS at/above which a product is a winner to scale (default 2.5)
  breakEvenRoas?: number; // profitability floor (default 2.0, or 1/margin)
}

export interface BucketSummary {
  action: ProductAction;
  label: string;
  count: number;
  spend: number;
  revenue: number;
  spendShare: number; // of total spend
}
export interface ClassifiedProduct extends ProductReportRow {
  action: ProductAction;
  convRate: number;
}
export interface ProductReport {
  periodDays: number;
  currency: string;
  totalSpend: number;
  totalRevenue: number;
  roas: number;
  productCount: number;
  kern: string;
  buckets: BucketSummary[];
  products: ClassifiedProduct[];
}

const LABELS: Record<ProductAction, string> = {
  exclude_no_sales: "Exclude — 0 sales",
  scale: "Scale up",
  lower: "Lower / optimise",
  keep: "Keep",
  exclude_loss: "Exclude — losing money",
};
const ORDER: ProductAction[] = ["exclude_no_sales", "exclude_loss", "lower", "keep", "scale"];

export function classifyProduct(p: ProductReportRow, scaleRoas: number, breakEven: number): ProductAction {
  if (p.conversions <= 0) return p.cost > 0 ? "exclude_no_sales" : "keep";
  if (p.roas >= scaleRoas) return "scale";
  if (p.roas < 1) return "exclude_loss";        // spends more than it returns
  if (p.roas < breakEven) return "lower";        // has sales but below profitability
  return "keep";                                  // profitable, below the scale bar
}

const money = (n: number, cur: string) => `${cur}${Math.round(n).toLocaleString("en-GB")}`;
const pct = (n: number) => `${Math.round(n * 100)}%`;

export function buildProductReport(
  rows: ProductReportRow[], periodDays: number, currency: string, cfg: ProductReportConfig = {},
): ProductReport {
  const scaleRoas = cfg.scaleRoas ?? 2.5;
  const breakEven = cfg.breakEvenRoas ?? 2.0;

  const totalSpend = rows.reduce((s, r) => s + r.cost, 0);
  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0);

  const products: ClassifiedProduct[] = rows.map(r => ({
    ...r,
    action: classifyProduct(r, scaleRoas, breakEven),
    convRate: r.clicks > 0 ? r.conversions / r.clicks : 0,
  })).sort((a, b) => b.cost - a.cost);

  const buckets: BucketSummary[] = ORDER.map(action => {
    const inB = products.filter(p => p.action === action);
    const spend = inB.reduce((s, p) => s + p.cost, 0);
    return {
      action, label: LABELS[action], count: inB.length,
      spend, revenue: inB.reduce((s, p) => s + p.revenue, 0),
      spendShare: totalSpend > 0 ? spend / totalSpend : 0,
    };
  }).filter(b => b.count > 0);

  // Kern: the one-line headline, mirroring the manual report.
  const noSales = buckets.find(b => b.action === "exclude_no_sales");
  const scale = buckets.find(b => b.action === "scale");
  const scaleRows = products.filter(p => p.action === "scale");
  const scaleAvgRoas = scaleRows.length ? scaleRows.reduce((s, p) => s + p.roas, 0) / scaleRows.length : 0;
  const parts: string[] = [];
  if (noSales && totalSpend > 0) {
    parts.push(`${pct(noSales.spendShare)} of spend (${money(noSales.spend, currency)}) went to ${noSales.count.toLocaleString("en-GB")} products with 0 sales`);
  }
  if (scale && scaleAvgRoas > 0) {
    parts.push(`winners (ROAS ≥ ${scaleRoas}) run ~${scaleAvgRoas.toFixed(1)}x but get only ${pct(scale.spendShare)} of spend`);
  }
  const kern = parts.length
    ? parts.join(". ") + "."
    : `${products.length.toLocaleString("en-GB")} products, ${money(totalSpend, currency)} spend, ROAS ${(totalRevenue / (totalSpend || 1)).toFixed(2)} over ${periodDays} days.`;

  return {
    periodDays, currency, totalSpend, totalRevenue,
    roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
    productCount: products.length,
    kern, buckets, products,
  };
}
