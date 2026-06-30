// Core types for the Ecomtrada product-performance engine.

export type Status = 'WINNER' | 'PROMISING' | 'TEST' | 'DRAG' | 'EXCLUDE';

/** One row of input, BEFORE aggregation. Maps 1:1 to a Google Ads product-report line
 *  (one variant in one country). Use the adapters to produce these from CSV or the API. */
export interface RawRow {
  itemId: string;        // e.g. "shopify_nl_15642450395480_56853299855704"
  title?: string;        // product title (may be partial/empty from the API)
  clicks: number;
  cost: number;          // spend, in the account currency (NOT micros — divide micros by 1e6 in the adapter)
  conversions: number;
  convValue: number;     // conversion value
  revenue?: number;      // OPTIONAL real store revenue; only used in revenue mode
  currency?: string;     // account currency code, e.g. "EUR"
  feedLabel?: string;    // country / feed label (enables the per-country breakdown)
  issues?: string;       // Merchant Center issues text; used only for the out-of-stock guard
}

export interface AnalysisOptions {
  /** Gross margin as a DECIMAL (0.60 = 60%). If given, break-even = 1/margin. If omitted, 1.70 (flagged ASSUMED). */
  margin?: number | null;
  /** Use the real `revenue` field instead of `convValue` for ROAS/winner logic.
   *  Turn this on when conversion actions are mis-flagged as primary (inflated conversions). */
  useRevenue?: boolean;
  /** Optional date-range label (e.g. "March 19, 2026 - June 12, 2026"). The CSV adapter fills this in. */
  dateRange?: string;
}

export interface ProductRow {
  parent: string;        // product (item_group) id = 3rd token of the Item ID
  product: string;       // human title (most common base title across variants)
  variants: number;
  clicks: number;
  expConv: number;       // EXPECTED conversions at the account avg conv-rate (the fair-test denominator)
  spend: number;
  conv: number;
  revenue: number;
  roas: number;
  convRate: number;      // % (conv / clicks * 100)
  status: Status;
  oos: boolean;          // any variant flagged out of stock
  countries?: number;    // multi-country only
  bestCountry?: string;  // multi-country only
}

export interface StatusSummaryRow {
  status: Status;
  count: number;
  spend: number;
  spendPct: number;      // 0..1
  revenue: number;
  roas: number;
  action: string;        // Dutch action label
}

export interface CountryRow {
  label: string;
  spend: number;
  spendPct: number;      // 0..1
  revenue: number;
  roas: number;
  conv: number;
}

export interface ExclusionRow {
  itemId: string;
  title: string;
  clicks: number;
  spend: number;
  conv: number;
  revenue: number;
  issues: string;
}

export interface AnalysisResult {
  dateRange: string;
  currency: string;
  revenueColumnUsed: 'convValue' | 'revenue';
  totals: {
    spend: number;
    revenue: number;
    clicks: number;
    conv: number;
    convRate: number;     // decimal (0.0142 = 1.42%)
    roas: number;
    breakEven: number;
    breakEvenAssumed: boolean;
    exclClicks: number;   // ~clicks needed before a 0-seller is judged dead, for display
  };
  multi: boolean;
  products: ProductRow[];
  statusSummary: StatusSummaryRow[];
  countries: CountryRow[];
  exclusions: ExclusionRow[];       // variant-level, SAFE to exclude now
  exclusionRecovered: number;       // sum of spend across `exclusions`
}
