/**
 * Correctness-core spec, validated against the REAL nuvaarbewijs numbers (§3/§4).
 *   npx tsx src/lib/diagnostics/correctness.test.ts
 * These are the numbers a wrong answer would have gotten wrong. Pure — no I/O.
 */
import {
  microsToCurrency, sumSameCurrency, normalizedComparison, isProvisionalWindow,
  roas, poas, breakEvenRoas, isProfitable, conversionReconciliation,
  zeroConversionSpendShare, analyzeConcentration,
} from "./correctness";

let fail = 0;
const ok = (n: string, c: boolean) => { console.log(c ? "✓" : "✗ FAIL:", n); if (!c) fail++; };
const near = (a: number, b: number, eps = 0.01) => Math.abs(a - b) <= eps;

// ── §4.4 units & currency ─────────────────────────────────────────────────────
ok("cost_micros → EUR (÷1e6)", microsToCurrency(114_000_000) === 114);
ok("sum same currency", sumSameCurrency([{ value: 10, currency: "EUR" }, { value: 5, currency: "EUR" }]).value === 15);
let threw = false; try { sumSameCurrency([{ value: 1, currency: "EUR" }, { value: 1, currency: "PLN" }]); } catch { threw = true; }
ok("refuses to sum across currencies", threw);

// ── §4.1 per-day normalisation (the near-miss that started §4) ────────────────
const cmp = normalizedComparison(168, 30, 49, 12);
ok("raw comparison is the misleading −71%", near(cmp.rawPctChange, -0.708, 0.01));
ok("normalised comparison is the honest −27%", near(cmp.pctChange, -0.271, 0.01));
ok("unequal windows flagged", cmp.unequalWindows === true);
ok("per-day before = 5.6", near(cmp.beforePerDay, 5.6));
ok("per-day after ≈ 4.08", near(cmp.afterPerDay, 4.083, 0.01));

// ── §4.2 conversion lag / provisional windows ─────────────────────────────────
ok("12d window at 4d lag is NOT provisional (12 ≥ 8)", isProvisionalWindow(12, 4) === false);
ok("6d window at 4d lag IS provisional (6 < 8)", isProvisionalWindow(6, 4) === true);

// ── §4.5 ROAS is not profit ───────────────────────────────────────────────────
ok("break-even ROAS at 50% margin = 2.0", breakEvenRoas(0.5) === 2);
ok("break-even ROAS at 15% margin ≈ 6.67", near(breakEvenRoas(0.15), 6.667, 0.01));
ok("5x ROAS on 15% margin → POAS 0.75 (loses money)", near(poas(500, 100, 0.15), 0.75) && roas(500, 100) === 5);
ok("5x ROAS on 15% margin is NOT profitable", isProfitable(500, 100, 0.15) === false);
ok("5x ROAS on 50% margin IS profitable", isProfitable(500, 100, 0.5) === true);

// ── §4.3 conversions ≠ orders ─────────────────────────────────────────────────
const rec = conversionReconciliation(6.2, 5.6); // Google Ads 6.2/day vs checkout 5.6/day
ok("Google Ads exceeding reality is flagged", rec.adsExceedsReality === true && near(rec.delta, 0.6));
const fake = conversionReconciliation(100, 5); // the "20x ROAS" fake-conversion account
ok("fake-conversion account: huge positive delta", fake.adsExceedsReality && fake.deltaPct >= 5);

// ── §4.6 search-terms: share of zero-conversion spend (60%) ───────────────────
const share = zeroConversionSpendShare([
  { cost: 89, conversions: 0 },   // "vaarbewijs" — €89, zero conversions
  { cost: 31, conversions: 0 },
  { cost: 80, conversions: 6 },
]);
ok("zero-conversion spend share = 60%", near(share, 0.6));

// ── §4.7 concentration vs breadth (the whole ballgame) ────────────────────────
const concentrated = analyzeConcentration([
  { key: "Breda",     beforePerDay: 2.0, afterPerDay: 0.0 },
  { key: "Eindhoven", beforePerDay: 1.5, afterPerDay: 0.0 },
  { key: "Alkmaar",   beforePerDay: 1.2, afterPerDay: 0.0 },
  { key: "Utrecht",   beforePerDay: 2.5, afterPerDay: 0.2 },
  { key: "Rotterdam", beforePerDay: 2.0, afterPerDay: 2.6 }, // improved
  { key: "Roermond",  beforePerDay: 1.0, afterPerDay: 1.3 }, // improved
]);
ok("nuvaarbewijs decline is CONCENTRATED (broken, not soft)", concentrated.concentrated === true);
ok("collapsed set = the four location pages", concentrated.collapsed.length === 4 && concentrated.collapsed.includes("Breda"));
ok("held set = the ones that improved", concentrated.held.includes("Rotterdam") && concentrated.held.includes("Roermond"));

const broad = analyzeConcentration([
  { key: "A", beforePerDay: 10, afterPerDay: 7 },
  { key: "B", beforePerDay: 8,  afterPerDay: 5.6 },
  { key: "C", beforePerDay: 6,  afterPerDay: 4.2 },
]); // everything −30%, uniform — weather/demand
ok("a uniform −30% decline is NOT concentrated (soft demand)", broad.concentrated === false);

console.log(fail ? `\n${fail} FAILURE(S)` : "\nALL PASS");
process.exit(fail ? 1 : 0);
