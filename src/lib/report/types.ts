/**
 * Monthly client report — computed data (never authored by the model) plus the
 * narrative structure the model fills. The template in ./render.ts combines
 * both into the client-facing HTML.
 */

export type ReportLanguage = "en" | "nl";

export interface CampaignRow { name: string; isBrand: boolean; spend: number; clicks: number; conversions: number; conversionValue: number; }
export interface TermRow { term: string; clicks: number; cost: number; conversions: number; conversionValue: number; }
export interface ProductRow { title: string; units: number; revenue: number; adSpend: number; adValue: number; }
export interface DiscountRow { code: string; orders: number; discounted: number; revenue: number; }

export interface ReportData {
  client: string;
  accountName: string;
  shopDomain: string | null;
  currencySymbol: string;
  language: ReportLanguage;
  month: string;          // "YYYY-MM"
  periodStart: string;    // YYYY-MM-DD
  periodEnd: string;
  partialMonth: boolean;
  businessModel: string | null;
  targetRoas: number | null;
  breakEven: number | null;
  totals: {
    spend: number; adsConversions: number; adsRevenue: number; roas: number | null;
    clicks: number; impressions: number;
    nbSpend: number; nbRevenue: number; nbRoas: number | null;
    brandCampaigns: string[];
    shopOrders: number | null; shopRevenue: number | null;
    mer: number | null;                 // shop revenue ÷ ad spend
    adsShareOfRevenue: number | null;   // ads-attributed ÷ shop revenue (capped at 1)
  };
  previous: {
    start: string; end: string;
    spend: number; adsRevenue: number; roas: number | null; nbRoas: number | null;
    shopRevenue: number | null; shopOrders: number | null;
  };
  campaigns: CampaignRow[];
  termWinners: TermRow[];
  termLeaks: TermRow[];
  leakTotal: number;
  termCount: number;
  products: ProductRow[];    // Shopify best sellers (with matched ad spend)
  adProducts: ProductRow[];  // ads-side top products (fallback when no Shopify)
  discounts: DiscountRow[];
  hasShopify: boolean;
  hasTerms: boolean;
}

/** What the model writes — narrative only, grounded in the data block. */
export interface ReportContent {
  title: string;
  dek: string;
  inShort: string[];
  adsVsOrders: string[];
  googleDetail: string[];
  productsNote: string[];
  comparisonNote: string[];
  extraCaveats: string[];
}
