/**
 * Signal library (BUILD-SPEC §8/§12.3) — pure detectors over the spine.
 *
 * Each detector returns a Signal | null (or Signal[] for per-segment ones). No
 * detector names a cause — they state facts and shapes (§9). The runner applies
 * the data-sufficiency guard (§8) so low-volume accounts don't scream.
 *
 * Includes at least one OPPORTUNITY detector (§5A): the system must bring a win,
 * not only red flags.
 */
import { roas, zeroConversionSpendShare, breakEvenRoas } from "./correctness";

export type Severity = "info" | "yellow" | "red";
export type SignalKind = "problem" | "opportunity";

export interface Signal {
  key: string;
  kind: SignalKind;
  severity: Severity;
  title: string;
  detail: string;
  evidence: Record<string, unknown>;
  /** The brand-CR canary sets this — it should auto-run a diagnosis (§8). */
  triggersDiagnosis?: boolean;
}

export interface WindowAgg { spend: number; clicks: number; conversions: number; conversionValue: number; days: number; }
export interface BudgetPoint { date: string; dailyBudget: number; }
export interface ChangeEventLite { changedAt: Date; changeType: string; }
export interface PageAgg { landingPageUrl: string; clicks: number; spend: number; conversions: number; conversionValue: number; daysZeroConv: number; }
export interface BrandWindow { clicks: number; conversions: number; }

export interface SignalConfig {
  roasFloor?: number;
  grossMarginPct?: number;
  minSpend: number;        // data-sufficiency guard (§8)
  minConversions: number;
  pageMinClicks?: number;  // for the traffic-with-zero-conversions page detector
}

const SEV_RANK: Record<Severity, number> = { red: 0, yellow: 1, info: 2 };
const pct = (x: number) => `${Math.round(x * 100)}%`;

// ─── Problem detectors ────────────────────────────────────────────────────────

/** ROAS/POAS below the floor (§8). Red when it's also below break-even margin. */
export function roasBelowFloor(cur: WindowAgg, cfg: SignalConfig): Signal | null {
  if (cfg.roasFloor == null) return null;
  const r = roas(cur.conversionValue, cur.spend);
  if (r >= cfg.roasFloor) return null;
  const belowBreakEven = cfg.grossMarginPct != null && r < breakEvenRoas(cfg.grossMarginPct);
  return {
    key: "roas_below_floor", kind: "problem",
    severity: belowBreakEven ? "red" : "yellow",
    title: "ROAS below the floor",
    detail: `ROAS is ${r.toFixed(2)} against a floor of ${cfg.roasFloor.toFixed(2)}${belowBreakEven ? " — below break-even margin" : ""}.`,
    evidence: { roas: r, floor: cfg.roasFloor, spend: cur.spend, conversionValue: cur.conversionValue },
  };
}

/**
 * THE §3 failure: budget was increased while ROAS was below the floor.
 * Fires red immediately.
 */
export function budgetRaisedWhileBelowFloor(
  cur: WindowAgg, changeEvents: ChangeEventLite[], cfg: SignalConfig,
): Signal | null {
  if (cfg.roasFloor == null) return null;
  const r = roas(cur.conversionValue, cur.spend);
  if (r >= cfg.roasFloor) return null;
  const budgetRaises = changeEvents.filter(e => e.changeType === "BUDGET");
  if (budgetRaises.length === 0) return null;
  return {
    key: "budget_raised_below_floor", kind: "problem", severity: "red",
    title: "Budget raised while ROAS was below the floor",
    detail: `${budgetRaises.length} budget change(s) in this window while ROAS was ${r.toFixed(2)} (floor ${cfg.roasFloor.toFixed(2)}).`,
    evidence: { roas: r, floor: cfg.roasFloor, budgetChanges: budgetRaises.length },
  };
}

/** Budget moved > 25% within 7 days — fast scaling outruns demand (§8). */
export function budgetChangedFast(budget: BudgetPoint[], threshold = 0.25): Signal | null {
  if (budget.length < 2) return null;
  const sorted = [...budget].sort((a, b) => a.date.localeCompare(b.date));
  const first = sorted[0].dailyBudget;
  const last = sorted[sorted.length - 1].dailyBudget;
  if (first <= 0) return null;
  const change = (last - first) / first;
  if (Math.abs(change) < threshold) return null;
  return {
    key: "budget_changed_fast", kind: "problem", severity: "yellow",
    title: "Budget changed sharply",
    detail: `Daily budget moved ${change > 0 ? "+" : ""}${pct(change)} (${first} → ${last}) inside the window.`,
    evidence: { from: first, to: last, change },
  };
}

/**
 * Zero-conversion spend > threshold of the search-term spend (§8, §4.6).
 *
 * IMPORTANT: this is the *search-terms report* slice only — a subset of spend
 * (Search/Shopping queries Google itemises) that also under-attributes
 * conversions. It is NOT a share of total account spend, and a high value here
 * is compatible with a healthy account whose conversions come through
 * Shopping/PMax. We pass totalSpend so the label can say how big the slice
 * actually is instead of reading as "100% of the account is wasted".
 */
export function zeroConversionSpendHigh(
  searchTerms: Array<{ cost: number; conversions: number }>, totalSpend = 0, threshold = 0.4,
): Signal | null {
  const share = zeroConversionSpendShare(searchTerms);
  if (share < threshold) return null;
  const stTotal = searchTerms.reduce((s, t) => s + t.cost, 0);
  const wasted = searchTerms.filter(t => t.conversions === 0).reduce((s, t) => s + t.cost, 0);
  const stShareOfTotal = totalSpend > 0 ? stTotal / totalSpend : null;
  const scope = stShareOfTotal != null
    ? ` But itemised search terms are only ${pct(stShareOfTotal)} of total spend and the report under-reports conversions — read this as a search-query hygiene flag, not total waste.`
    : ` This is the search-terms-report slice only (a subset of spend that under-reports conversions), not a share of the account.`;
  return {
    key: "zero_conversion_spend", kind: "problem", severity: "yellow",
    title: "High zero-conversion search-term spend",
    detail: `${pct(share)} of itemised search-term spend had zero attributed conversions in the last 7 days.${scope}`,
    evidence: { share, stTotal, wasted, stShareOfTotal },
  };
}

/** Budget rose but no negatives were added in the window — hygiene debt (§8). */
export function budgetRoseNoNegatives(changeEvents: ChangeEventLite[]): Signal | null {
  const raisedBudget = changeEvents.some(e => e.changeType === "BUDGET");
  const addedNegative = changeEvents.some(e => e.changeType === "NEGATIVE");
  if (!raisedBudget || addedNegative) return null;
  return {
    key: "budget_rose_no_negatives", kind: "problem", severity: "yellow",
    title: "Budget rose, no negatives added",
    detail: "Budget changed but no negative keywords were added in this window — waste is likely accumulating.",
    evidence: {},
  };
}

/** A page with traffic but zero conversions for 3+ days — broken or unbuyable (§8). */
export function pagesTrafficNoConversions(pages: PageAgg[], cfg: SignalConfig): Signal[] {
  const minClicks = cfg.pageMinClicks ?? 20;
  return pages
    .filter(p => p.clicks >= minClicks && p.conversions === 0 && p.daysZeroConv >= 3)
    .map(p => ({
      key: "page_traffic_no_conversions", kind: "problem" as const, severity: "red" as const,
      title: "Page taking traffic, converting nothing",
      detail: `${p.landingPageUrl}: ${p.clicks} clicks, 0 conversions, ${p.daysZeroConv} days running.`,
      evidence: { url: p.landingPageUrl, clicks: p.clicks, spend: p.spend, daysZeroConv: p.daysZeroConv },
    }));
}

/**
 * THE canary (§8): brand conversion rate dropped > threshold. Brand searchers
 * don't get worse because you raised a PMax budget — so this is almost never the
 * ads. Fires red AND triggers a diagnosis.
 */
// THE red canary triggers a full diagnosis, so it must not fire on noise. Below
// these volumes a brand window is too thin to trust: 1 conv / 25 clicks → 0 is a
// "100% drop" that's really sampling noise, made worse by conversion lag.
const MIN_BRAND_CLICKS = 20;        // per window
const MIN_BRAND_CONV_BEFORE = 2;    // the baseline conversion count must be stable

export function brandConversionRateDrop(before: BrandWindow, after: BrandWindow, threshold = 0.4): Signal | null {
  if (before.clicks === 0 || after.clicks === 0) return null;
  // Min-sample guard: too little brand volume to red-alert on.
  if (before.clicks < MIN_BRAND_CLICKS || after.clicks < MIN_BRAND_CLICKS || before.conversions < MIN_BRAND_CONV_BEFORE) return null;
  const crBefore = before.conversions / before.clicks;
  const crAfter = after.conversions / after.clicks;
  if (crBefore === 0) return null;
  const drop = (crBefore - crAfter) / crBefore;
  if (drop < threshold) return null;
  return {
    key: "brand_cr_drop", kind: "problem", severity: "red", triggersDiagnosis: true,
    title: "Brand conversion rate collapsed",
    detail: `Brand conversion rate fell ${pct(drop)} (${pct(crBefore)} → ${pct(crAfter)}) over the last 7 days vs the prior 7. Brand is the highest-intent traffic — when it converts worse, it is almost never the ads. (Recent days aren't fully matured for conversion lag; confirm before it's fully attributed.)`,
    evidence: { crBefore, crAfter, drop },
  };
}

/** Google Ads conversions ≠ actual orders (§4.3/§8). Steer on nothing until resolved. */
export function conversionsVsOrders(adsConversions: number, actualOrders: number, threshold = 0.15): Signal | null {
  if (actualOrders <= 0) return null;
  const delta = (adsConversions - actualOrders) / actualOrders;
  if (Math.abs(delta) < threshold) return null;
  return {
    key: "conversions_vs_orders", kind: "problem", severity: "red",
    title: "Google Ads conversions don't match orders",
    detail: `Google Ads reports ${adsConversions.toFixed(1)} vs ${actualOrders.toFixed(1)} actual orders (${delta > 0 ? "+" : ""}${pct(delta)}). Steer on nothing until this is resolved.`,
    evidence: { adsConversions, actualOrders, delta },
  };
}

// ─── Opportunity detector (§5A — bring a win) ─────────────────────────────────

/**
 * A segment converting profitably on a small budget — room to scale. e.g. §5A's
 * "Rotterdam converting at 5.8% on €12/day, there's headroom." Pure over pages.
 */
export function highRoasLowSpend(pages: PageAgg[], cfg: SignalConfig, totalSpend: number): Signal[] {
  if (cfg.roasFloor == null || totalSpend <= 0) return [];
  return pages
    .filter(p => p.spend > 0 && p.conversions >= 1 && roas(p.conversionValue, p.spend) >= cfg.roasFloor! * 1.5 && p.spend / totalSpend < 0.05)
    .map(p => ({
      key: "high_roas_low_spend", kind: "opportunity" as const, severity: "info" as const,
      title: "Profitable and under-funded — room to scale",
      detail: `${p.landingPageUrl}: ROAS ${roas(p.conversionValue, p.spend).toFixed(1)} on only ${pct(p.spend / totalSpend)} of spend. There is headroom.`,
      evidence: { url: p.landingPageUrl, roas: roas(p.conversionValue, p.spend), spendShare: p.spend / totalSpend },
    }));
}

// ─── Runner ───────────────────────────────────────────────────────────────────

export interface SignalInput {
  cfg: SignalConfig;
  current: WindowAgg;
  changeEvents: ChangeEventLite[];
  budget: BudgetPoint[];
  searchTerms: Array<{ cost: number; conversions: number }>;
  pages: PageAgg[];
  brand?: { before: BrandWindow; after: BrandWindow };
  reconciliation?: { adsConversions: number; actualOrders: number };
}

/**
 * Run all detectors. Performance detectors are gated by the data-sufficiency
 * guard; buyability/canary/opportunity ones aren't. Returns worst-severity-first.
 */
export function runSignals(input: SignalInput): Signal[] {
  const { cfg, current } = input;
  const sufficient = current.spend >= cfg.minSpend && current.conversions >= cfg.minConversions;
  const out: (Signal | null)[] = [];

  if (sufficient) {
    out.push(roasBelowFloor(current, cfg));
    out.push(budgetRaisedWhileBelowFloor(current, input.changeEvents, cfg));
    out.push(zeroConversionSpendHigh(input.searchTerms, current.spend));
  }
  // Always-on (hygiene, buyability shape, canary, reconciliation, opportunity).
  out.push(budgetChangedFast(input.budget));
  out.push(budgetRoseNoNegatives(input.changeEvents));
  out.push(...pagesTrafficNoConversions(input.pages, cfg));
  if (input.brand) out.push(brandConversionRateDrop(input.brand.before, input.brand.after));
  if (input.reconciliation) out.push(conversionsVsOrders(input.reconciliation.adsConversions, input.reconciliation.actualOrders));
  out.push(...highRoasLowSpend(input.pages, cfg, current.spend));

  return out
    .filter((s): s is Signal => s !== null)
    .sort((a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity]);
}
