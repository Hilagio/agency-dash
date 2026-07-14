/**
 * Diagnostic-engine spec (§9): the engine must produce facts, observations,
 * checks-run and QUESTIONS — and must never assert a cause.
 *   npx tsx src/lib/diagnostics/engine.test.ts
 * Pure — no I/O.
 */
import { runSignals, type SignalInput } from "./signals";
import { buildDiagnosis, BOUNDARY_LINE, type DiagnosisInput } from "./engine";

let fail = 0;
const ok = (n: string, c: boolean) => { console.log(c ? "✓" : "✗ FAIL:", n); if (!c) fail++; };

// nuvaarbewijs window, same shape as the §11 acid test.
const spendPerDay = 244, convPerDay = 3.3, clicksPerDay = 209, days = 10;
const spend = spendPerDay * days, conversions = convPerDay * days, clicks = clicksPerDay * days;
const conversionValue = 1.06 * spend;

const signalInput: SignalInput = {
  cfg: { roasFloor: 4.0, grossMarginPct: 0.5, minSpend: 500, minConversions: 10, pageMinClicks: 20 },
  current: { spend, clicks, conversions, conversionValue, days },
  changeEvents: [
    { changedAt: new Date("2026-06-24"), changeType: "BUDGET" },
    { changedAt: new Date("2026-07-10"), changeType: "BUDGET" },
  ],
  budget: [
    { date: "2026-06-03", dailyBudget: 50 },
    { date: "2026-07-10", dailyBudget: 375 },
  ],
  searchTerms: [
    { cost: 89, conversions: 0 }, { cost: 31, conversions: 0 }, { cost: 80, conversions: 6 },
  ],
  pages: [
    { landingPageUrl: "/cursus/breda", clicks: 67, spend: 89, conversions: 0, conversionValue: 0, daysZeroConv: 12 },
    { landingPageUrl: "/cursus/rotterdam", clicks: 200, spend: 100, conversions: 12, conversionValue: 800, daysZeroConv: 0 },
  ],
  brand: { before: { clicks: 100, conversions: 2.5 }, after: { clicks: 100, conversions: 0.77 } },
};

const signals = runSignals(signalInput);
const input: DiagnosisInput = {
  accountId: "acc_nuva", name: "Nuvaarbewijs", clientName: "Vaaropleiding BV",
  status: "red", dataVerified: true, computedAt: "2026-07-14T06:00:00Z",
  signals,
  window: { spend, conversions, conversionValue, days },
  currency: "€",
  reconciliation: { adsConversions: 6.2, actualOrders: 5.6 },
};

const d = buildDiagnosis(input);

console.log("\n--- diagnosis ---");
console.log("headline:", d.headline);
console.log("facts:", d.facts.map(f => `${f.label}=${f.value}`).join(", "));
console.log("observations:", d.observations.length);
console.log("checks:", d.checksRun.map(c => `${c.label}[${c.result}]`).join(", "));
console.log("questions:", d.questions.length);
for (const q of d.questions) console.log("  ?", q.text);
console.log("-----------------\n");

// Structure.
ok("has a headline", d.headline.length > 0);
ok("surfaces honest facts (spend + ROAS)", d.facts.some(f => f.label === "Spend") && d.facts.some(f => f.label === "ROAS"));
ok("ROAS fact carries the floor as context", !!d.facts.find(f => f.label === "ROAS")?.context?.includes("floor"));
ok("budget fact shows the 50→375 jump", d.facts.some(f => f.label === "Daily budget" && f.value.includes("375")));
ok("observes budget-raised-below-floor", d.observations.some(o => o.key === "budget_raised_below_floor"));
ok("observes the dead landing page", d.observations.some(o => o.key === "page_traffic_no_conversions"));
ok("observes the brand CR collapse", d.observations.some(o => o.key === "brand_cr_drop"));

// §5 — shows its work.
ok("ran the tracking/reconciliation check (ruled out here)", d.checksRun.some(c => c.label.startsWith("Tracking") && c.result === "ruled_out"));
ok("ran the brand canary check (ads vs site/offer)", d.checksRun.some(c => c.label.includes("ads, or the site")));

// §9 — questions, and THE nuvaarbewijs capacity question.
ok("asks the specialist questions, not zero", d.questions.length > 0);
ok("asks the delivery-capacity question (the nuvaarbewijs catch)", d.questions.some(q => /capacity|sold out|fulfil|stock/i.test(q.text)));
ok("asks whether the page is buyable", d.questions.some(q => /buyable|in stock|checkout|available/i.test(q.text)));

// §9 boundary — never names a cause.
ok("renders the boundary line verbatim", d.boundary === BOUNDARY_LINE);
ok("no question is phrased as a conclusion (all end in '?')", d.questions.every(q => q.text.trim().endsWith("?")));
const causeWords = /\bbecause the (business|client|site) (is|was|has|had)\b|\bthe cause is\b|\bthis is caused by\b|\bthe problem is that the\b/i;
const prose = [d.headline, ...d.observations.map(o => o.text)].join(" || ");
ok("never asserts a cause in headline/observations", !causeWords.test(prose));

// §5A — brings a win.
ok("surfaces the Rotterdam opportunity (bring a win)", d.opportunities.length > 0);

// Green account: calm, no questions, no alarm.
const green = buildDiagnosis({
  accountId: "a", name: "Healthy Co", status: "green", dataVerified: true,
  computedAt: "2026-07-14T06:00:00Z", signals: [],
  window: { spend: 1000, conversions: 40, conversionValue: 6000, days: 7 },
});
ok("green account has a calm headline", /under control/i.test(green.headline));
ok("green account asks no questions", green.questions.length === 0);

// §4.9 — unverified account carries the provisional note.
const unverified = buildDiagnosis({ ...input, dataVerified: false });
ok("unverified account carries the provisional note", !!unverified.unverifiedNote);

console.log(fail ? `\n${fail} FAILURE(S)` : "\n§9 ENGINE: PASS — facts + questions, no cause named");
process.exit(fail ? 1 : 0);
