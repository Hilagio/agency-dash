/**
 * Signal-library spec + the §11 ACID TEST: would this have caught nuvaarbewijs?
 *   npx tsx src/lib/diagnostics/signals.test.ts
 * Pure — no I/O.
 */
import {
  runSignals, conversionsVsOrders, brandConversionRateDrop, type SignalInput,
} from "./signals";

let fail = 0;
const ok = (n: string, c: boolean) => { console.log(c ? "✓" : "✗ FAIL:", n); if (!c) fail++; };

// nuvaarbewijs, current window = 4–13 Jul (10 days), from §3.
const spendPerDay = 244, convPerDay = 3.3, clicksPerDay = 209, days = 10;
const spend = spendPerDay * days;                 // 2440
const conversions = convPerDay * days;            // 33
const clicks = clicksPerDay * days;               // 2090
const conversionValue = 1.06 * spend;             // ROAS 1.06

const input: SignalInput = {
  cfg: { roasFloor: 4.0, grossMarginPct: 0.5, minSpend: 500, minConversions: 10, pageMinClicks: 20 },
  current: { spend, clicks, conversions, conversionValue, days },
  changeEvents: [
    { changedAt: new Date("2026-06-24"), changeType: "BUDGET" },
    { changedAt: new Date("2026-06-25"), changeType: "BUDGET" },
    { changedAt: new Date("2026-07-10"), changeType: "BUDGET" },
    // note: no NEGATIVE events — the whole point
  ],
  budget: [
    { date: "2026-06-03", dailyBudget: 50 },
    { date: "2026-07-10", dailyBudget: 375 },   // 7.5x
  ],
  searchTerms: [
    { cost: 89, conversions: 0 },                // "vaarbewijs" — €89, zero
    { cost: 31, conversions: 0 },
    { cost: 80, conversions: 6 },                // → 60% zero-conversion spend
  ],
  pages: [
    { landingPageUrl: "/cursus/breda",     clicks: 67, spend: 89, conversions: 0,  conversionValue: 0,   daysZeroConv: 12 },
    { landingPageUrl: "/cursus/eindhoven", clicks: 47, spend: 55, conversions: 0,  conversionValue: 0,   daysZeroConv: 10 },
    { landingPageUrl: "/cursus/rotterdam", clicks: 200, spend: 100, conversions: 12, conversionValue: 800, daysZeroConv: 0 }, // ROAS 8 on 4% of spend
  ],
  brand: { before: { clicks: 100, conversions: 2.5 }, after: { clicks: 100, conversions: 0.77 } }, // −69%
  reconciliation: { adsConversions: 6.2, actualOrders: 5.6 }, // 10.7% — below default threshold
};

const signals = runSignals(input);
const keys = new Set(signals.map(s => s.key));
console.log("\n--- signals fired ---");
for (const s of signals) console.log(`  [${s.severity}] ${s.key} — ${s.detail}`);
console.log("---------------------\n");

// The §11 acid test: each of these must fire.
ok("ROAS below floor fires", keys.has("roas_below_floor"));
ok("budget raised while below floor fires (red)", keys.has("budget_raised_below_floor") && signals.find(s => s.key === "budget_raised_below_floor")!.severity === "red");
ok("zero-conversion spend fires (60% > 40%)", keys.has("zero_conversion_spend"));
ok("budget rose, no negatives fires", keys.has("budget_rose_no_negatives"));
ok("budget changed fast fires (50 → 375)", keys.has("budget_changed_fast"));
ok("Breda: page traffic, no conversions fires (red)", keys.has("page_traffic_no_conversions"));
ok("brand CR collapse fires (red)", keys.has("brand_cr_drop") && signals.find(s => s.key === "brand_cr_drop")!.severity === "red");
ok("brand CR collapse triggers a diagnosis", signals.find(s => s.key === "brand_cr_drop")?.triggersDiagnosis === true);
ok("OPPORTUNITY: high-ROAS low-spend fires (bring a win, §5A)", keys.has("high_roas_low_spend"));
ok("worst severity first (a red leads)", signals[0].severity === "red");

// Guards / correctness.
ok("reconciliation does NOT false-fire at 10.7%", !keys.has("conversions_vs_orders"));
ok("but a 20x fake-conversion account DOES fire", conversionsVsOrders(100, 5) !== null);
// Ads conversions are a subset of total orders: under-counting is the organic
// share, never a tracking alarm.
ok("under-counting never fires (95 conv vs 200 orders = organic share)", conversionsVsOrders(95, 200) === null);
ok("mild over-count under threshold does not fire (110 vs 100)", conversionsVsOrders(110, 100) === null);
ok("heavy over-count fires red (200 vs 100)", conversionsVsOrders(200, 100)?.severity === "red");
ok("moderate over-count fires yellow (130 vs 100)", conversionsVsOrders(130, 100)?.severity === "yellow");
ok("min-sample guard: 8 conv vs 6 orders is noise, not a flag", conversionsVsOrders(8, 6) === null);

// Brand min-sample guard: THE red canary must not fire on a thin, noisy window.
ok("brand guard suppresses noise (1 conv / 25 clicks → 0)", brandConversionRateDrop({ clicks: 25, conversions: 1 }, { clicks: 20, conversions: 0 }) === null);
ok("brand guard suppresses low click volume", brandConversionRateDrop({ clicks: 12, conversions: 3 }, { clicks: 10, conversions: 0 }) === null);
ok("brand still fires on a solid base (5/100 → 1/100)", brandConversionRateDrop({ clicks: 100, conversions: 5 }, { clicks: 100, conversions: 1 }) !== null);

// Data-sufficiency guard: a low-volume account with an awful ROAS stays quiet on performance.
const lowVol = runSignals({ ...input, current: { spend: 40, clicks: 30, conversions: 1, conversionValue: 5, days: 10 } });
ok("data-sufficiency guard suppresses performance on low volume", !new Set(lowVol.map(s => s.key)).has("roas_below_floor"));

console.log(fail ? `\n${fail} FAILURE(S)` : "\n§11 ACID TEST: PASS — nuvaarbewijs would have been caught");
process.exit(fail ? 1 : 0);
