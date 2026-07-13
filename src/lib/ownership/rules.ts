// ─── Account Ownership System — rules engine ──────────────────────────────────
// Pure function. Each rule returns null | RuleResult. Final status = worst
// severity. Active exceptions suppress the rules they list. See AGENTS.md §5.

import {
  AccountConfig, EvaluationResult, OwnershipMetrics, OwnershipStatus,
  RULE, RuleId, RuleResult, Severity, WindowMetrics,
} from "./types";
import { workingDaysBetween } from "./workdays";

// ─── Small helpers ────────────────────────────────────────────────────────────

const roas = (w: WindowMetrics) => (w.spend > 0 ? w.conversionsValue / w.spend : 0);
const cpa  = (w: WindowMetrics) => (w.conversions > 0 ? w.spend / w.conversions : Infinity);

/** Sufficiency guard for a window (spend + conversions thresholds). */
function windowSufficient(w: WindowMetrics, cfg: AccountConfig): boolean {
  return w.spend >= cfg.minSpendForEval && w.conversions >= cfg.minConversionsForEval;
}

function worst(a: OwnershipStatus, b: Severity): OwnershipStatus {
  if (a === "red" || b === "red") return "red";
  return "yellow";
}

// ─── Rules ────────────────────────────────────────────────────────────────────

/** 1. Performance vs target — only when last-7d data is sufficient. */
function rulePerformance(cfg: AccountConfig, m: OwnershipMetrics): RuleResult | null {
  if (!cfg.primaryKpi || cfg.targetValue == null || cfg.targetValue <= 0) return null;

  let deficit: number; // fraction; >0 means below target
  let actualLabel: string;
  if (cfg.primaryKpi === "ROAS") {
    const actual = roas(m.last7);
    deficit = (cfg.targetValue - actual) / cfg.targetValue;
    actualLabel = `ROAS ${actual.toFixed(2)} vs target ${cfg.targetValue.toFixed(2)}`;
  } else {
    const actual = cpa(m.last7);
    if (!isFinite(actual)) return null;
    deficit = (actual - cfg.targetValue) / cfg.targetValue; // higher CPA is worse
    actualLabel = `CPA ${actual.toFixed(2)} vs target ${cfg.targetValue.toFixed(2)}`;
  }

  const pct = Math.round(deficit * 100);
  if (deficit > cfg.tolRedPct / 100) {
    return { rule: RULE.PERFORMANCE, severity: "red", message: `${cfg.primaryKpi} is ${pct}% below target (${actualLabel}).` };
  }
  if (deficit > cfg.tolYellowPct / 100) {
    return { rule: RULE.PERFORMANCE, severity: "yellow", message: `${cfg.primaryKpi} is ${pct}% below target (${actualLabel}).` };
  }
  return null;
}

/** 2. Trend — worst of 7v7 and 14v14, each window guarded by sufficiency. */
function ruleTrend(cfg: AccountConfig, m: OwnershipMetrics): RuleResult | null {
  const kpi = (w: WindowMetrics) => (cfg.primaryKpi === "CPA" ? cpa(w) : roas(w));

  // decline > 0 means performance worsened between prev → last.
  function declineFor(last: WindowMetrics, prev: WindowMetrics): number | null {
    if (!windowSufficient(last, cfg) || !windowSufficient(prev, cfg)) return null;
    const kLast = kpi(last), kPrev = kpi(prev);
    if (!isFinite(kLast) || !isFinite(kPrev) || kPrev === 0) return null;
    return cfg.primaryKpi === "CPA"
      ? (kLast - kPrev) / kPrev   // CPA rising = worse
      : (kPrev - kLast) / kPrev;  // ROAS falling = worse
  }

  const declines = [declineFor(m.last7, m.prev7), declineFor(m.last14, m.prev14)]
    .filter((d): d is number => d !== null);
  if (declines.length === 0) return null;

  const worstDrop = Math.max(...declines);
  const pct = Math.round(worstDrop * 100);
  if (worstDrop > 0.40) return { rule: RULE.TREND, severity: "red",    message: `${cfg.primaryKpi ?? "Performance"} dropped ${pct}% vs the prior period.` };
  if (worstDrop > 0.20) return { rule: RULE.TREND, severity: "yellow", message: `${cfg.primaryKpi ?? "Performance"} declining ${pct}% vs the prior period.` };
  return null;
}

/** 3. Pacing (MTD). */
function rulePacing(cfg: AccountConfig, m: OwnershipMetrics): RuleResult | null {
  if (!cfg.monthlyBudget || cfg.monthlyBudget <= 0 || m.daysInMonth <= 0) return null;
  const expected = cfg.monthlyBudget * (m.daysElapsed / m.daysInMonth);
  if (expected <= 0) return null;
  const pacing = (m.mtdSpend / expected) * 100;
  const p = Math.round(pacing);

  if (pacing < cfg.pacingYellowMin || pacing > cfg.pacingYellowMax) {
    return { rule: RULE.PACING, severity: "red", message: `Spend pacing at ${p}% of expected (target ${cfg.pacingGreenMin}–${cfg.pacingGreenMax}%).` };
  }
  if (pacing < cfg.pacingGreenMin || pacing > cfg.pacingGreenMax) {
    return { rule: RULE.PACING, severity: "yellow", message: `Spend pacing at ${p}% of expected (target ${cfg.pacingGreenMin}–${cfg.pacingGreenMax}%).` };
  }
  return null;
}

/** 4. Conversion anomaly — only when sufficient; never claims a tracking bug. */
function ruleAnomaly(cfg: AccountConfig, m: OwnershipMetrics): RuleResult | null {
  const a = m.anomaly;
  if (!a) return null;
  // Guards: skip if it's a spend story, or the account is inherently low-conversion.
  if (a.spendDropPct > 0.30) return null;
  if (a.baselineDailyConv < cfg.minConversionsForEval) return null;
  if (a.baselineDailyConv <= 0) return null;

  const drop = (a.baselineDailyConv - a.recentDailyConv) / a.baselineDailyConv;
  const MSG = "Conversion volume deviates strongly from the normal pattern. Investigation required.";
  // Near-total collapse at normal spend -> red.
  if (drop > 0.80) return { rule: RULE.ANOMALY, severity: "red", message: MSG };
  if (drop > 0.40) return { rule: RULE.ANOMALY, severity: "yellow", message: MSG };
  return null;
}

/** 5. Review recency (hard rule). Returns [result, hasCurrentReview]. */
function ruleReviewRecency(cfg: AccountConfig, m: OwnershipMetrics, now: Date): { result: RuleResult | null; current: boolean } {
  const last = m.review?.lastReviewAt ? new Date(m.review.lastReviewAt) : null;
  if (!last || isNaN(last.getTime())) {
    // No current review -> can never be green (cap at yellow).
    return { result: { rule: RULE.REVIEW_RECENCY, severity: "yellow", message: "No review on record — a review is required." }, current: false };
  }
  const due = new Date(last.getTime() + cfg.reviewFrequencyDays * 86_400_000);
  if (now <= due) return { result: null, current: true };

  const overdueWorkingDays = workingDaysBetween(due, now);
  if (overdueWorkingDays > 1) {
    return { result: { rule: RULE.REVIEW_RECENCY, severity: "red", message: `Review overdue by ${overdueWorkingDays} working days.` }, current: false };
  }
  return { result: { rule: RULE.REVIEW_RECENCY, severity: "yellow", message: "Review is due." }, current: false };
}

/** 6. Open action past deadline. */
function ruleOpenAction(m: OwnershipMetrics, now: Date): RuleResult | null {
  const dl = m.openAction?.deadlineAt ? new Date(m.openAction.deadlineAt) : null;
  if (!dl || isNaN(dl.getTime()) || now <= dl) return null;
  const overdue = workingDaysBetween(dl, now);
  if (overdue > 1) return { rule: RULE.OPEN_ACTION, severity: "red", message: `Open action past deadline by ${overdue} working days.` };
  return { rule: RULE.OPEN_ACTION, severity: "yellow", message: "Open action past its deadline." };
}

/** 7. Operational blockers. */
function ruleBlockers(m: OwnershipMetrics): RuleResult[] {
  const out: RuleResult[] = [];
  const b = m.blockers;
  if (!b) return out;

  const paused = b.pausedCampaigns ?? [];
  if (paused.length > 0) {
    const mainDown = paused.some(c => c.isMainSpend);
    out.push({
      rule: RULE.BLOCKER_PAUSED,
      severity: mainDown ? "red" : "yellow",
      message: mainDown
        ? `Main spend campaign unexpectedly paused/removed (${paused.find(c => c.isMainSpend)!.name}).`
        : `${paused.length} campaign(s) unexpectedly paused/removed.`,
    });
  }
  if ((b.disapprovedActiveAds ?? 0) > 0) {
    out.push({ rule: RULE.BLOCKER_DISAPPROVAL, severity: "yellow", message: `${b.disapprovedActiveAds} disapproved ad(s) on active campaigns.` });
  }
  const zero = b.zeroImpressionActiveCampaigns ?? [];
  if (zero.length > 0) {
    out.push({ rule: RULE.BLOCKER_ZERO_IMPR, severity: "yellow", message: `${zero.length} active campaign(s) with 0 impressions for 3+ days.` });
  }
  return out;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

/**
 * Evaluate one account. Pure — pass `now` for deterministic results.
 * Final status is the worst severity across all firing rules; green only when
 * nothing fires AND a current review exists AND data is sufficient.
 */
export function evaluateAccount(
  cfg: AccountConfig,
  m: OwnershipMetrics,
  now: Date = new Date(),
): EvaluationResult {
  const suppressed = new Set<RuleId>(m.activeExceptions ?? []);
  const reasons: RuleResult[] = [];
  const push = (r: RuleResult | null) => { if (r && !suppressed.has(r.rule)) reasons.push(r); };

  const sufficient = windowSufficient(m.last7, cfg);

  // Performance / trend / anomaly are gated by the sufficiency guard.
  if (sufficient) {
    push(rulePerformance(cfg, m));
    push(ruleTrend(cfg, m));
    push(ruleAnomaly(cfg, m));
  } else if (!suppressed.has(RULE.DATA_SUFFICIENCY)) {
    // May only produce yellow — never red — when data is insufficient.
    reasons.push({ rule: RULE.DATA_SUFFICIENCY, severity: "yellow", message: "Not enough data to judge — decision needed." });
  }

  // Always-on rules.
  push(rulePacing(cfg, m));

  const review = ruleReviewRecency(cfg, m, now);
  if (!suppressed.has(RULE.REVIEW_RECENCY)) push(review.result);
  const hasCurrentReview = review.current || suppressed.has(RULE.REVIEW_RECENCY);

  push(ruleOpenAction(m, now));
  ruleBlockers(m).forEach(push);

  // Final status: worst severity; green requires a current review.
  let status: OwnershipStatus = "green";
  for (const r of reasons) status = worst(status, r.severity);
  if (status === "green" && !hasCurrentReview) status = "yellow";

  return { status, reasons, sufficient, hasCurrentReview };
}
