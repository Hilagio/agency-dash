/**
 * Diagnostic correctness core (BUILD-SPEC §4 — non-negotiable).
 *
 * A diagnostic system that computes a wrong number produces a confident wrong
 * diagnosis, and that permanently destroys trust. Every function here encodes
 * one of §4's rules and is unit-tested against the real nuvaarbewijs case-study
 * numbers (§3/§4). Pure — no DB, no network, no I/O.
 */

// ─── §4.4 Units & currency ────────────────────────────────────────────────────

/** cost_micros → account-currency units. Divide by 1,000,000 (get this wrong
 *  once and every number is off by six orders of magnitude). */
export function microsToCurrency(micros: number): number {
  return micros / 1_000_000;
}

/** Sum a set of currency amounts, refusing to mix currencies silently (§4.4). */
export function sumSameCurrency(amounts: Array<{ value: number; currency: string }>): { value: number; currency: string } {
  if (amounts.length === 0) return { value: 0, currency: "" };
  const currency = amounts[0].currency;
  for (const a of amounts) {
    if (a.currency !== currency) {
      throw new Error(`Refusing to sum across currencies (${currency} vs ${a.currency}) — convert explicitly first.`);
    }
  }
  return { value: amounts.reduce((s, a) => s + a.value, 0), currency };
}

// ─── §4.1 Per-day normalisation ───────────────────────────────────────────────

export interface NormalizedComparison {
  beforePerDay: number;
  afterPerDay: number;
  /** Fractional change of the PER-DAY figures (the honest number). */
  pctChange: number;
  /** Fractional change of the RAW totals (the misleading number — kept only to warn). */
  rawPctChange: number;
  beforeDays: number;
  afterDays: number;
  /** True when the two windows are different lengths — raw totals must not be compared. */
  unequalWindows: boolean;
}

/**
 * §4.1: never compare raw totals across unequal periods. Returns the per-day
 * normalised comparison (and the raw one, flagged, so callers can warn).
 * nuvaarbewijs: 168 conv/30d vs 49 conv/12d → raw −71%, normalised −27%.
 */
export function normalizedComparison(
  beforeTotal: number, beforeDays: number,
  afterTotal: number, afterDays: number,
): NormalizedComparison {
  if (beforeDays <= 0 || afterDays <= 0) throw new Error("window length must be > 0 days");
  const beforePerDay = beforeTotal / beforeDays;
  const afterPerDay = afterTotal / afterDays;
  return {
    beforePerDay,
    afterPerDay,
    pctChange: beforePerDay === 0 ? 0 : (afterPerDay - beforePerDay) / beforePerDay,
    rawPctChange: beforeTotal === 0 ? 0 : (afterTotal - beforeTotal) / beforeTotal,
    beforeDays,
    afterDays,
    unequalWindows: beforeDays !== afterDays,
  };
}

// ─── §4.2 Conversion lag makes short windows lie ──────────────────────────────

/** §4.2: a window shorter than 2× the client's measured conversion lag is
 *  still filling — treat as provisional (direction, not verdict). */
export function isProvisionalWindow(windowDays: number, conversionLagDays: number): boolean {
  return windowDays < 2 * conversionLagDays;
}

// ─── §4.5 ROAS is not profit ──────────────────────────────────────────────────

export function roas(conversionValue: number, spend: number): number {
  return spend > 0 ? conversionValue / spend : 0;
}

/** Profit on ad spend = gross profit / spend. gross profit = value × margin. */
export function poas(conversionValue: number, spend: number, grossMarginPct: number): number {
  return spend > 0 ? (conversionValue * grossMarginPct) / spend : 0;
}

/** Break-even ROAS = 1 / gross margin. At 50% margin → 2.0. Below it, ads lose money. */
export function breakEvenRoas(grossMarginPct: number): number {
  if (grossMarginPct <= 0) return Infinity;
  return 1 / grossMarginPct;
}

/** True when the campaign is above break-even ROAS (i.e. actually profitable). */
export function isProfitable(conversionValue: number, spend: number, grossMarginPct: number): boolean {
  return poas(conversionValue, spend, grossMarginPct) >= 1;
}

// ─── §4.3 Google Ads conversions are not orders ───────────────────────────────

/** §4.3: reconcile Google Ads conversions vs actual orders. Google Ads can
 *  never exceed reality; a large gap means fake/non-purchase conversions. */
export function conversionReconciliation(googleAdsConversions: number, actualOrders: number) {
  const delta = googleAdsConversions - actualOrders;
  const deltaPct = actualOrders > 0 ? delta / actualOrders : (googleAdsConversions > 0 ? Infinity : 0);
  return {
    delta,
    deltaPct,
    /** Google Ads reporting more than reality is the dangerous direction. */
    adsExceedsReality: googleAdsConversions > actualOrders,
  };
}

// ─── §4.6 Search-terms report: percentages, never totals ──────────────────────

/** §4.6: the search-terms report is incomplete — derive the share of spend on
 *  zero-conversion terms (a percentage), never treat its totals as truth. */
export function zeroConversionSpendShare(
  terms: Array<{ cost: number; conversions: number }>,
): number {
  const total = terms.reduce((s, t) => s + t.cost, 0);
  if (total <= 0) return 0;
  const wasted = terms.filter(t => t.conversions === 0).reduce((s, t) => s + t.cost, 0);
  return wasted / total;
}

// ─── §4.7 Concentration vs breadth (the core diagnostic distinction) ──────────

export interface ConcentrationResult {
  concentrated: boolean;
  /** Segments that collapsed (large per-day drop). */
  collapsed: string[];
  /** Segments that held or improved. */
  held: string[];
  /** Share of the total drop attributable to the collapsed segments. */
  dropShareFromCollapsed: number;
}

/**
 * §4.7: decompose before concluding. A broad decline hits everything roughly
 * proportionally; a CONCENTRATED collapse (some segments to ~zero while others
 * improve) means something is broken, not soft demand.
 *
 * Each segment carries before/after PER-DAY values (already normalised).
 * A segment "collapsed" if it fell by ≥ `collapseThreshold` (default 60%).
 * The decline is "concentrated" if some segments collapsed AND at least one
 * other held or improved (the nuvaarbewijs signature).
 */
export function analyzeConcentration(
  segments: Array<{ key: string; beforePerDay: number; afterPerDay: number }>,
  collapseThreshold = 0.6,
): ConcentrationResult {
  const collapsed: string[] = [];
  const held: string[] = [];
  let totalDrop = 0;
  let collapsedDrop = 0;

  for (const s of segments) {
    const drop = s.beforePerDay - s.afterPerDay; // positive = declined
    if (drop > 0) totalDrop += drop;
    const pct = s.beforePerDay > 0 ? drop / s.beforePerDay : 0;
    if (pct >= collapseThreshold && s.beforePerDay > 0) {
      collapsed.push(s.key);
      if (drop > 0) collapsedDrop += drop;
    } else if (s.afterPerDay >= s.beforePerDay) {
      held.push(s.key);
    }
  }

  const dropShareFromCollapsed = totalDrop > 0 ? collapsedDrop / totalDrop : 0;
  return {
    concentrated: collapsed.length > 0 && held.length > 0,
    collapsed,
    held,
    dropShareFromCollapsed,
  };
}
