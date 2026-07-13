// ─── Account Ownership System — types ─────────────────────────────────────────
// The rules engine (rules.ts) is a PURE function over these types. It never
// touches the DB, Google Ads, or Slack — those layers assemble OwnershipMetrics
// and persist the EvaluationResult.

export type OwnershipStatus = "green" | "yellow" | "red";

/** A rule only ever fires yellow or red; "not firing" means green. */
export type Severity = "yellow" | "red";

/** Stable rule ids — also used as the keys an Exception can suppress. */
export const RULE = {
  DATA_SUFFICIENCY: "data_sufficiency",
  PERFORMANCE:      "performance",
  TREND:            "trend",
  PACING:           "pacing",
  ANOMALY:          "anomaly",
  REVIEW_RECENCY:   "review_recency",
  OPEN_ACTION:      "open_action",
  BLOCKER_PAUSED:   "blocker_campaign_paused",
  BLOCKER_DISAPPROVAL: "blocker_disapprovals",
  BLOCKER_ZERO_IMPR:   "blocker_zero_impressions",
} as const;

export type RuleId = (typeof RULE)[keyof typeof RULE];

// ─── Metrics (assembled per account, per run) ─────────────────────────────────

export interface WindowMetrics {
  spend: number;            // account currency
  conversions: number;
  conversionsValue: number; // revenue
  impressions: number;
}

export interface OwnershipMetrics {
  last7: WindowMetrics;
  prev7: WindowMetrics;
  last14: WindowMetrics;
  prev14: WindowMetrics;

  // Pacing (MTD)
  mtdSpend: number;
  daysElapsed: number; // days elapsed in the current month, including today
  daysInMonth: number;

  // Conversion anomaly (all precomputed upstream)
  anomaly?: {
    baselineDailyConv: number; // median daily conversions, trailing 28d (excl zero-spend days)
    recentDailyConv: number;   // avg daily conversions, last 3–7d
    spendDropPct: number;      // 0–1, recent-vs-baseline spend drop (guards the spend story)
  };

  // Human-confirmed review log (source of truth for recency)
  review?: { lastReviewAt: string | null }; // ISO string

  // Open ownership action, if any
  openAction?: { deadlineAt: string | null }; // ISO string

  // Operational blockers
  blockers?: {
    pausedCampaigns?: Array<{ name: string; isMainSpend: boolean }>;
    disapprovedActiveAds?: number;
    zeroImpressionActiveCampaigns?: string[]; // active campaigns, 0 impressions 3d+
  };

  // Rule ids currently suppressed by an active exception (endsAt in the future)
  activeExceptions?: RuleId[];
}

// ─── Config (from the Account row) ────────────────────────────────────────────

export interface AccountConfig {
  primaryKpi: "ROAS" | "CPA" | null;
  targetValue: number | null;
  tolYellowPct: number; // e.g. 10
  tolRedPct: number;    // e.g. 25
  pacingGreenMin: number;  pacingGreenMax: number;
  pacingYellowMin: number; pacingYellowMax: number;
  reviewFrequencyDays: number;
  minSpendForEval: number;
  minConversionsForEval: number;
  monthlyBudget: number | null;
}

// ─── Result ───────────────────────────────────────────────────────────────────

export interface RuleResult {
  rule: RuleId;
  severity: Severity;
  message: string;
}

export interface EvaluationResult {
  status: OwnershipStatus;
  reasons: RuleResult[];
  /** Whether last-7d data met the sufficiency guard. */
  sufficient: boolean;
  /** Whether a current (non-overdue) review exists — an account without one caps at yellow. */
  hasCurrentReview: boolean;
}
