/**
 * Diagnostic engine (BUILD-SPEC §9) — turn detected signals into a diagnosis a
 * human can act on, WITHOUT ever naming a cause.
 *
 *   facts          honest numbers (§4: per-day, ROAS/POAS, no vanity)
 *   observations   shapes we can see — never "because X", only "X happened"
 *   checksRun      §5: "here's what I already checked" (ruled out / flagged)
 *   questions      §9: the questions for the SPECIALIST to ask — not answers
 *   opportunities  §5A: bring a win, not only red flags
 *
 * The hard rule (§9): the system NEVER states the cause. It points at facts and
 * hands the specialist the right questions. This file is pure — no I/O — so it
 * can be tested against the nuvaarbewijs numbers directly.
 */
import type { Signal, Severity } from "./signals";

export interface DiagnosisFact {
  label: string;
  value: string;
  context?: string;
  tone: "bad" | "warn" | "good" | "neutral";
}
export interface Observation { key: string; text: string; }
export interface CheckRun {
  label: string;
  result: "ruled_out" | "flagged" | "not_available";
  detail: string;
}
export interface DiagnosisQuestion { text: string; because: string; }
export interface Opportunity { text: string; }

export interface Diagnosis {
  accountId: string;
  name: string;
  clientName?: string | null;
  status: "green" | "yellow" | "red";
  dataVerified: boolean;
  computedAt: string;
  headline: string;
  /** §4.9 banner when the account hasn't been reconciled against real orders. */
  unverifiedNote?: string;
  facts: DiagnosisFact[];
  observations: Observation[];
  checksRun: CheckRun[];
  questions: DiagnosisQuestion[];
  opportunities: Opportunity[];
  /** The §9 line, rendered verbatim in the UI so the boundary is always visible. */
  boundary: string;
}

export interface DiagnosisInput {
  accountId: string;
  name: string;
  clientName?: string | null;
  status: "green" | "yellow" | "red";
  dataVerified: boolean;
  computedAt: string;
  signals: Signal[];
  window?: { spend: number; conversions: number; conversionValue: number; days: number };
  currency?: string;
  /** Present only when an order feed exists; drives the tracking check. */
  reconciliation?: { adsConversions: number; actualOrders: number } | null;
  /** Real orders + revenue from Shopify over the window (§4.3). */
  commerce?: { orders: number; revenue: number; currency?: string } | null;
  /** Gross margin (0–1) for POAS = gross profit ÷ spend (§4, POAS not ROAS). */
  grossMarginPct?: number | null;
}

export const BOUNDARY_LINE =
  "This points at facts and questions. It does not name the cause — that's the specialist's call.";

/**
 * Turn a raw landing-page URL into a readable product name.
 * e.g. "https://shop.nl/products/premium-kamado-bbq-13-inch?variant=123&utm_…"
 *   →  "Premium Kamado Bbq 13 Inch".  Homepage "/" → "Homepage".
 */
export function cleanProductLabel(rawUrl: string | undefined | null): string {
  if (!rawUrl) return "A page";
  try {
    const noProto = rawUrl.replace(/^https?:\/\//, "").replace(/[?#].*$/, "");
    const slash = noProto.indexOf("/");
    const path = slash >= 0 ? noProto.slice(slash) : "/";
    const seg = path.split("/").filter(Boolean).pop();
    if (!seg) return "Homepage";
    const words = decodeURIComponent(seg).replace(/[-_]+/g, " ").trim();
    if (!words) return "Homepage";
    return words.replace(/\b\w/g, c => c.toUpperCase());
  } catch {
    return rawUrl.slice(0, 48);
  }
}

const CURRENCY_SYMBOL: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" };
const symbolOf = (code: string) => CURRENCY_SYMBOL[code] ?? `${code} `;
const num = (n: number) => n.toLocaleString("en-GB", { maximumFractionDigits: n < 10 ? 2 : 0 });
const money = (n: number, cur: string) => `${cur}${Math.round(n).toLocaleString("en-GB")}`;
const pct = (x: number) => `${x > 0 ? "+" : ""}${Math.round(x * 100)}%`;

function find(signals: Signal[], key: string): Signal | undefined {
  return signals.find(s => s.key === key);
}
function all(signals: Signal[], key: string): Signal[] {
  return signals.filter(s => s.key === key);
}
function ev<T = number>(s: Signal | undefined, k: string): T | undefined {
  return s ? (s.evidence[k] as T | undefined) : undefined;
}

// ─── Facts (§4 — honest topline + the specific alarming numbers) ──────────────

function buildFacts(input: DiagnosisInput): DiagnosisFact[] {
  const cur = input.currency ?? "€";
  const facts: DiagnosisFact[] = [];
  const w = input.window;

  if (w && w.days > 0) {
    const perDay = w.spend / w.days;
    facts.push({
      label: "Spend", value: money(w.spend, cur),
      context: `${money(perDay, cur)}/day over ${w.days} days`, tone: "neutral",
    });
    const r = w.spend > 0 ? w.conversionValue / w.spend : 0;
    const roasSig = find(input.signals, "roas_below_floor");
    const floor = ev(roasSig, "floor");
    facts.push({
      label: "ROAS", value: r.toFixed(2),
      context: floor != null ? `floor ${Number(floor).toFixed(2)}` : "conversion value ÷ spend",
      tone: roasSig ? "bad" : r > 0 ? "good" : "neutral",
    });
    facts.push({
      label: "Conversions", value: num(w.conversions),
      context: `${num(w.conversions / w.days)}/day`, tone: "neutral",
    });

    // POAS — the number that actually matters (§4). Needs revenue + margin.
    const revenue = input.commerce?.revenue;
    const margin = input.grossMarginPct;
    if (revenue != null && margin != null && margin > 0 && w.spend > 0) {
      const poas = (revenue * margin) / w.spend;
      const breakEven = 1 / margin;
      facts.push({
        label: "POAS", value: poas.toFixed(2),
        context: `break-even ${breakEven.toFixed(2)} (margin ${Math.round(margin * 100)}%)`,
        tone: poas < breakEven ? "bad" : "good",
      });
    }
  }

  // Real orders from Shopify (§4.3) — the source of truth.
  if (input.commerce) {
    facts.push({
      label: "Orders (Shopify)", value: num(input.commerce.orders),
      context: w && w.days > 0 ? `${num(input.commerce.orders / w.days)}/day` : "real orders", tone: "neutral",
    });
    facts.push({
      label: "Revenue (Shopify)", value: money(input.commerce.revenue, input.commerce.currency ? symbolOf(input.commerce.currency) : cur),
      context: "actual store revenue", tone: "neutral",
    });
  }

  const budget = find(input.signals, "budget_changed_fast");
  if (budget) {
    const from = ev(budget, "from"), to = ev(budget, "to"), change = ev(budget, "change");
    facts.push({
      label: "Daily budget",
      value: from != null && to != null ? `${money(Number(from), cur)} → ${money(Number(to), cur)}` : "changed",
      context: change != null ? `${pct(Number(change))} in the window` : undefined,
      tone: "warn",
    });
  }

  const brand = find(input.signals, "brand_cr_drop");
  if (brand) {
    const before = ev(brand, "crBefore"), after = ev(brand, "crAfter"), drop = ev(brand, "drop");
    facts.push({
      label: "Brand conversion rate",
      value: before != null && after != null ? `${Math.round(Number(before) * 100)}% → ${Math.round(Number(after) * 100)}%` : "fell",
      context: drop != null ? `${pct(-Number(drop))} · last 7d vs prior 7d, highest-intent traffic` : "last 7d vs prior 7d",
      tone: "bad",
    });
  }

  const zero = find(input.signals, "zero_conversion_spend");
  if (zero) {
    const share = ev(zero, "share");
    const stShareOfTotal = ev(zero, "stShareOfTotal");
    facts.push({
      label: "Zero-conversion search terms", value: share != null ? `${Math.round(Number(share) * 100)}%` : "high",
      context: stShareOfTotal != null
        ? `of itemised search-term spend (only ${pct(Number(stShareOfTotal))} of total) · last 7d`
        : "of the search-terms-report slice, not total spend · last 7d",
      tone: "warn",
    });
  }

  return facts;
}

// ─── Observations (shapes, never causes) ──────────────────────────────────────

function buildObservations(signals: Signal[]): Observation[] {
  const obs: Observation[] = [];
  const push = (key: string, text: string) => obs.push({ key, text });

  if (find(signals, "budget_raised_below_floor"))
    push("budget_raised_below_floor", "Budget was raised while ROAS sat below the floor.");
  if (find(signals, "budget_rose_no_negatives"))
    push("budget_rose_no_negatives", "Budget changed but no negative keywords were added in this window.");

  const zero = find(signals, "zero_conversion_spend");
  if (zero) {
    const share = ev(zero, "share");
    const stShareOfTotal = ev(zero, "stShareOfTotal");
    const slice = stShareOfTotal != null
      ? ` — but itemised search terms are only ${Math.round(Number(stShareOfTotal) * 100)}% of total spend, so this is a search-query hygiene flag, not total waste`
      : ` (search-terms-report slice only, not total spend)`;
    push("zero_conversion_spend",
      `Over the last 7 days, ${share != null ? Math.round(Number(share) * 100) + "% of" : "a large share of"} itemised search-term spend had zero attributed conversions${slice}.`);
  }

  for (const p of all(signals, "page_traffic_no_conversions")) {
    const url = ev<string>(p, "url"), clicks = ev(p, "clicks"), days = ev(p, "daysZeroConv");
    push("page_traffic_no_conversions",
      `${cleanProductLabel(url)} took ${clicks ?? "significant"} clicks and converted nothing for ${days ?? "several"} days running.`);
  }

  const brand = find(signals, "brand_cr_drop");
  if (brand) {
    const drop = ev(brand, "drop");
    push("brand_cr_drop",
      `Brand conversion rate fell ${drop != null ? Math.round(Number(drop) * 100) + "%" : "sharply"}. Brand is the highest-intent traffic — when it converts worse, it is rarely the ads.`);
  }

  if (find(signals, "conversions_vs_orders"))
    push("conversions_vs_orders", "Google Ads conversions don't line up with actual orders in this window.");

  return obs;
}

// ─── Checks already run (§5 — show the work) ──────────────────────────────────

function buildChecks(input: DiagnosisInput): CheckRun[] {
  const checks: CheckRun[] = [];
  const s = input.signals;

  // Tracking / reconciliation.
  const mismatch = find(s, "conversions_vs_orders");
  if (mismatch) {
    checks.push({
      label: "Tracking vs real orders", result: "flagged",
      detail: "Ads conversions don't match orders. Steer on nothing else until this is resolved.",
    });
  } else if (input.reconciliation) {
    checks.push({
      label: "Tracking vs real orders", result: "ruled_out",
      detail: "Ads conversions reconcile with orders within tolerance — tracking looks intact.",
    });
  } else {
    checks.push({
      label: "Tracking vs real orders", result: "not_available",
      detail: "No order feed connected yet, so tracking can't be confirmed independently.",
    });
  }

  // Brand canary — only claimable when we actually saw brand traffic move.
  const brand = find(s, "brand_cr_drop");
  if (brand) {
    checks.push({
      label: "Is it the ads, or the site/offer?", result: "ruled_out",
      detail: "The highest-intent (brand) traffic weakened too. That points away from the ads and toward something the visitor hit — availability, pricing, checkout, delivery.",
    });
  }

  // Data sufficiency (only surfaced when performance signals were suppressed —
  // handled at the input level; here we note verification state).
  if (!input.dataVerified) {
    checks.push({
      label: "Data verified against real orders", result: "not_available",
      detail: "This account hasn't been reconciled yet — numbers are provisional and no external alert is raised until it is (§4.9).",
    });
  }

  return checks;
}

// ─── Questions for the specialist (§9 — questions, never answers) ─────────────

function buildQuestions(input: DiagnosisInput): DiagnosisQuestion[] {
  const s = input.signals;
  const qs: DiagnosisQuestion[] = [];

  const budgetUp = find(s, "budget_changed_fast") || find(s, "budget_raised_below_floor");
  const underwater = find(s, "roas_below_floor") || find(s, "brand_cr_drop") || find(s, "page_traffic_no_conversions");

  // The nuvaarbewijs question — scaled hard while returns/conversion fell.
  if (budgetUp && underwater) {
    qs.push({
      text: "Was the budget increase deliberate — and can the business absorb the extra volume right now (stock, fulfilment, delivery capacity, courses not sold out)?",
      because: "Spend scaled up while returns and/or conversion fell.",
    });
  }

  if (find(s, "page_traffic_no_conversions")) {
    qs.push({
      text: "Is that page/offer actually available and buyable right now — in stock, not sold out, checkout working?",
      because: "A page is taking real traffic and converting nothing.",
    });
  }

  if (find(s, "brand_cr_drop")) {
    qs.push({
      text: "Did something change on the site or in the business recently — pricing, availability, delivery times, checkout?",
      because: "Brand (highest-intent) conversion rate dropped.",
    });
  }

  if (find(s, "zero_conversion_spend") || find(s, "budget_rose_no_negatives")) {
    qs.push({
      text: "Are the search terms taking spend ones this business can actually serve — or is a negatives sweep overdue?",
      because: "Spend is going to terms that convert nothing, with no recent negatives.",
    });
  }

  if (find(s, "conversions_vs_orders")) {
    qs.push({
      text: "Which number is right — Ads conversions or the order system — and what's causing the gap?",
      because: "Reported conversions don't match orders.",
    });
  }

  // De-dupe by text and keep it to the few that matter (§5 — never a chore).
  const seen = new Set<string>();
  return qs.filter(q => (seen.has(q.text) ? false : (seen.add(q.text), true))).slice(0, 4);
}

// ─── Headline + opportunities ─────────────────────────────────────────────────

function buildHeadline(input: DiagnosisInput): string {
  const s = input.signals;
  if (input.status === "green") return "Under control. Nothing here needs a human right now.";
  if (find(s, "conversions_vs_orders"))
    return "The numbers don't reconcile with real orders — resolve tracking before steering anything.";
  if (find(s, "brand_cr_drop"))
    return "The highest-intent traffic is converting worse than last week — worth a specialist's eyes today.";
  if (find(s, "budget_raised_below_floor"))
    return "Budget went up while ROAS sat under the floor.";
  if (find(s, "page_traffic_no_conversions"))
    return "A page is taking real traffic and converting nothing.";
  if (input.status === "red") return "Something changed that needs a specialist today.";
  return "A few things drifted — worth a check when you have a moment.";
}

function buildOpportunities(signals: Signal[]): Opportunity[] {
  return all(signals, "high_roas_low_spend").map(o => ({ text: o.detail }));
}

// ─── Assemble ─────────────────────────────────────────────────────────────────

export function buildDiagnosis(input: DiagnosisInput): Diagnosis {
  const problems = input.signals.filter(s => s.kind === "problem");
  const worst: Severity | null = problems.length
    ? problems.reduce<Severity>((w, s) =>
        (s.severity === "red" ? "red" : s.severity === "yellow" && w !== "red" ? "yellow" : w), "info")
    : null;
  void worst; // status is authoritative from input; problems drive the narrative.

  return {
    accountId: input.accountId,
    name: input.name,
    clientName: input.clientName ?? null,
    status: input.status,
    dataVerified: input.dataVerified,
    computedAt: input.computedAt,
    headline: buildHeadline(input),
    unverifiedNote: input.dataVerified
      ? undefined
      : "Not yet reconciled against real orders — numbers are provisional and no client-facing alert is raised (§4.9).",
    facts: buildFacts(input),
    observations: buildObservations(input.signals),
    checksRun: buildChecks(input),
    questions: buildQuestions(input),
    opportunities: buildOpportunities(input.signals),
    boundary: BOUNDARY_LINE,
  };
}
