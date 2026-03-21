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
  impressionShareLost_budget: number;      // 0–1
  impressionShareLost_rank: number;        // 0–1
  clickThroughRate: number;                // e.g. 0.05
  averageCpc: number;                      // absolute value
  searchImpressionShare: number;           // 0–1
  qualityScoreAvg: number;                 // 1–10
  irrelevantQueryPercent: number;          // 0–1 (estimated % of budget wasted)
}

export interface MeasurementSignals {
  conversionTrackingActive: boolean;
  conversionActionsCount: number;
  hasEnhancedConversions: boolean;
  tagCoveragePercent: number;              // 0–1
  dateLagDays: number;                     // avg attribution lag
  hasGa4Linked: boolean;
  hasMerchantCenterLinked: boolean;        // for shopping
}

export interface ConversionSignals {
  conversionRate: number;                  // 0–1
  industryBenchmarkConversionRate: number; // 0–1
  landingPageScore: number;                // 1–10 (from Ads API)
  mobileSpeedScore: number;               // 0–100
  bounceRateEstimate: number;             // 0–1
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
  actualRoas: number;
  targetCpa: number;
  actualCpa: number;
  grossMarginPercent: number;              // 0–1
  ltv: number;                             // customer lifetime value
  budgetUtilizationPercent: number;        // 0–1 (how much of budget is spent)
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
