// ─── Constraint Buckets ───────────────────────────────────────────────────────
// Ordered by optimization sequence. Fix earlier buckets first.

export type ConstraintBucket =
  | "MEASUREMENT"
  | "TRAFFIC"
  | "CONVERSION"
  | "FUNNEL"
  | "ECONOMICS";

export const BUCKET_ORDER: ConstraintBucket[] = [
  "MEASUREMENT",
  "TRAFFIC",
  "CONVERSION",
  "FUNNEL",
  "ECONOMICS",
];

export const BUCKET_LABELS: Record<ConstraintBucket, string> = {
  MEASUREMENT: "Measurement",
  TRAFFIC:     "Traffic",
  CONVERSION:  "Website Conversion",
  FUNNEL:      "Funnel",
  ECONOMICS:   "Business Economics",
};

export const BUCKET_DESCRIPTIONS: Record<ConstraintBucket, string> = {
  MEASUREMENT: "Tracking, attribution, and data quality",
  TRAFFIC:     "Reach, impressions, clicks, and query relevance",
  CONVERSION:  "Landing page experience and conversion rate",
  FUNNEL:      "Lead quality, nurture, and close rate",
  ECONOMICS:   "Margins, LTV, ROAS targets, and profitability",
};

// ─── Raw Signals ──────────────────────────────────────────────────────────────
// What the Google Ads API / Merchant Center provides.

export interface TrafficSignals {
  impressionShareLost_budget: number;      // 0–1 (Search/Shopping campaigns only — 0 if no such campaigns)
  impressionShareLost_rank: number;        // 0–1 (Search/Shopping campaigns only — 0 if no such campaigns)
  clickThroughRate: number;                // last 14 days (account-level)
  clickThroughRateBaseline: number;        // days 15–180 avg (0 = insufficient history)
  averageCpc: number;                      // absolute value
  searchImpressionShare: number;           // 0–1 (Search/Shopping only)
  qualityScoreAvg: number;                 // 1–10
  qualityScoreCount: number;               // 0 = no keywords / feed-only account
  productDisapprovalRate: number;          // 0–1 (disapproved ÷ total products; 0 = no shopping data)
  irrelevantQueryPercent: number;          // 0–1 (Search/Shopping search_term_view only; excludes PMax)
  // ── PMax-specific ──────────────────────────────────────────────────────────
  isPmaxPrimary: boolean;                  // PMax > 50% of account spend
  pmaxDisplayYoutubePercent: number;       // 0–1, share of PMax spend on Display+YouTube (0 = no pmax / no data)
  // ── Per-campaign budget constraint ─────────────────────────────────────────
  budgetConstrainedCampaigns: {
    campaignId:         string;
    campaignName:       string;
    currentDailyBudget: number;            // in account currency
    isLostBudget:       number;            // 0–1 fraction of impressions lost to budget
    suggestedDailyBudget: number | null;   // rounded up to nearest 50
  }[];
  // ── Inactive ad groups ──────────────────────────────────────────────────────
  zeroImpressionAdGroupCount: number;      // enabled ad groups with 0 impressions last 30 days
  zeroImpressionAdGroupNames: string[];    // first 10 names for logging
  // ── Non-converting keyword waste ───────────────────────────────────────────
  wastedKeywordSpend: number;             // total spend on EXACT/PHRASE keywords with 0 conv (account currency)
  wastedKeywordSpendRatio: number;        // wastedKeywordSpend / totalSpend30d (0–1)
}

export interface MeasurementSignals {
  conversionTrackingActive: boolean;
  conversionActionsCount: number;
  hasEnhancedConversions: boolean;
  enhancedConversionsDegraded: boolean;    // EC enabled but conversion volume dropped ≥40%
  tagCoveragePercent: number;              // 0–1
  dateLagDays: number;                     // avg attribution lag
  hasGa4Linked: boolean;
  hasMerchantCenterLinked: boolean;        // for shopping
}

export interface ConversionSignals {
  conversionRate: number;                  // last 14 days CVR
  conversionRateBaseline: number;          // days 15–180 avg CVR (0 = insufficient history)
  industryBenchmarkConversionRate: number; // 0–1 — adjusted for country + businessModel (fallback only)
  landingPageScore: number;                // 1–10 from Ads API (0 = no data)
  mobileSpeedScore: number;               // 0–100 (0 = not measured)
  bounceRateEstimate: number;             // 0–1 (0 = not measured)
}

export interface FunnelSignals {
  costPerLead: number;
  targetCostPerLead: number;
  leadToSaleRate: number;                  // 0–1
  averageLeadQualityScore: number;         // 0–10 (can be manual)
  offlineConversionImportActive: boolean;
}

export interface EconomicsSignals {
  targetRoas: number;                      // e.g. 4.0
  actualRoas: number;                      // last 14 days
  actualRoasBaseline: number;              // days 15–180 avg (0 = insufficient history)
  targetCpa: number;
  actualCpa: number;                       // last 14 days
  actualCpaBaseline: number;               // days 15–180 avg (0 = insufficient history)
  grossMarginPercent: number;              // 0–1
  ltv: number;                             // customer lifetime value (0 = unknown)
  budgetUtilizationPercent: number;        // 0–1 (how much of budget is spent)
  avgOrderValue: number;                   // computed: conversions_value / conversions (0 = unknown)
  monthlyChurnRate: number;                // 0–1, subscription only — drives LTV = AOV / churnRate
}

export interface ConstraintSignals {
  measurement: MeasurementSignals;
  traffic: TrafficSignals;
  conversion: ConversionSignals;
  funnel: FunnelSignals;
  economics: EconomicsSignals;
}

// ─── Scoring Output ───────────────────────────────────────────────────────────

export interface BucketScore {
  bucket: ConstraintBucket;
  score: number;   // 0–100, higher = healthier
  signals: string[]; // human-readable signal summaries
  isGoverning: boolean;
}

export interface ScoringResult {
  buckets: BucketScore[];
  governingConstraint: ConstraintBucket;
  constraintReason: string;
  recommendations: ActionRecommendation[];
}

// ─── Action Recommendations ───────────────────────────────────────────────────

export type ActionImpact = "HIGH" | "MEDIUM" | "LOW";
export type ActionEffort = "EASY" | "MEDIUM" | "HARD";

export interface ActionRecommendation {
  bucket: ConstraintBucket;
  title: string;
  description: string;
  impact: ActionImpact;
  effort: ActionEffort;
  safeToAutomate: boolean;
  actionType: string;
  actionPayload?: Record<string, unknown>;
  isEscalation: boolean;
}
