/**
 * Runnable spec for the ownership rules engine (no test framework in this repo).
 *   npx tsx src/lib/ownership/rules.test.ts
 * Exits non-zero on any failure. Pure — no DB / network.
 */
import { evaluateAccount } from "./rules";
import { AccountConfig, OwnershipMetrics, RULE } from "./types";

const NOW = new Date("2026-07-13T09:00:00Z"); // Monday

let failures = 0;
function check(name: string, cond: boolean) {
  if (cond) console.log("✓", name);
  else { console.error("✗ FAIL:", name); failures++; }
}

function baseConfig(over: Partial<AccountConfig> = {}): AccountConfig {
  return {
    primaryKpi: "ROAS", targetValue: 4.0,
    tolYellowPct: 10, tolRedPct: 25,
    pacingGreenMin: 90, pacingGreenMax: 110, pacingYellowMin: 80, pacingYellowMax: 120,
    reviewFrequencyDays: 7, minSpendForEval: 100, minConversionsForEval: 5,
    monthlyBudget: 3000, ...over,
  };
}

// Green baseline: ROAS 4.0 across all windows, pacing 100%, review 2 days ago.
function baseMetrics(over: Partial<OwnershipMetrics> = {}): OwnershipMetrics {
  const w = { spend: 1000, conversions: 50, conversionsValue: 4000, impressions: 20000 };
  const w14 = { spend: 2000, conversions: 100, conversionsValue: 8000, impressions: 40000 };
  return {
    last7: { ...w }, prev7: { ...w }, last14: { ...w14 }, prev14: { ...w14 },
    mtdSpend: 1200, daysElapsed: 12, daysInMonth: 30, // expected = 3000*12/30 = 1200 -> 100%
    review: { lastReviewAt: new Date(NOW.getTime() - 2 * 86_400_000).toISOString() },
    ...over,
  };
}

// ── Green baseline ──────────────────────────────────────────────────────────
{
  const r = evaluateAccount(baseConfig(), baseMetrics(), NOW);
  check("green baseline -> green", r.status === "green");
  check("green baseline -> no reasons", r.reasons.length === 0);
}

// ── 1. Performance vs target (ROAS) ─────────────────────────────────────────
{
  // ROAS 3.5 vs 4.0 -> deficit 12.5% -> yellow
  const m = baseMetrics(); m.last7.conversionsValue = 3500;
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("ROAS 12.5% below -> yellow", r.status === "yellow" && r.reasons.some(x => x.rule === RULE.PERFORMANCE && x.severity === "yellow"));
}
{
  // ROAS 2.8 vs 4.0 -> deficit 30% -> red
  const m = baseMetrics(); m.last7.conversionsValue = 2800;
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("ROAS 30% below -> red", r.status === "red" && r.reasons.some(x => x.rule === RULE.PERFORMANCE && x.severity === "red"));
}
{
  // CPA account: cpa 30 vs target 25 -> 20% over -> yellow
  const cfg = baseConfig({ primaryKpi: "CPA", targetValue: 25 });
  const m = baseMetrics(); // spend 1000 / conv 50 = cpa 20 (green)
  const green = evaluateAccount(cfg, m, NOW);
  check("CPA 20 vs 25 -> green", green.status === "green");
  const m2 = baseMetrics(); m2.last7.conversions = 33; m2.prev7.conversions = 33; // cpa ~30.3
  const r = evaluateAccount(cfg, m2, NOW);
  check("CPA ~21% over -> yellow", r.reasons.some(x => x.rule === RULE.PERFORMANCE && x.severity === "yellow"));
}

// ── 2. Trend ────────────────────────────────────────────────────────────────
{
  // last7 ROAS 3.0, prev7 ROAS 4.0 -> 25% drop -> yellow; target tolerance kept green on perf by raising target? keep target 4 -> perf also fires. Isolate trend by relaxing target.
  const cfg = baseConfig({ targetValue: 2.0 }); // perf green at ROAS 3.0
  const m = baseMetrics(); m.last7.conversionsValue = 3000; m.last14.conversionsValue = 6000;
  const r = evaluateAccount(cfg, m, NOW);
  check("trend 25% drop -> yellow", r.reasons.some(x => x.rule === RULE.TREND && x.severity === "yellow"));
}
{
  const cfg = baseConfig({ targetValue: 1.0 });
  const m = baseMetrics(); m.last7.conversionsValue = 2000; m.last14.conversionsValue = 4000; // ROAS 2.0 vs 4.0 -> 50% drop
  const r = evaluateAccount(cfg, m, NOW);
  check("trend 50% drop -> red", r.reasons.some(x => x.rule === RULE.TREND && x.severity === "red"));
}

// ── 3. Pacing ───────────────────────────────────────────────────────────────
{
  const m = baseMetrics({ mtdSpend: 1020 }); // 85% -> yellow
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("pacing 85% -> yellow", r.reasons.some(x => x.rule === RULE.PACING && x.severity === "yellow"));
}
{
  const m = baseMetrics({ mtdSpend: 1560 }); // 130% -> red
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("pacing 130% -> red", r.reasons.some(x => x.rule === RULE.PACING && x.severity === "red"));
}

// ── 4. Conversion anomaly ───────────────────────────────────────────────────
{
  const m = baseMetrics({ anomaly: { baselineDailyConv: 10, recentDailyConv: 5, spendDropPct: 0.05 } }); // 50% drop
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("anomaly 50% drop -> yellow", r.reasons.some(x => x.rule === RULE.ANOMALY && x.severity === "yellow"));
}
{
  const m = baseMetrics({ anomaly: { baselineDailyConv: 10, recentDailyConv: 0.5, spendDropPct: 0.05 } }); // 95% collapse
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("anomaly collapse at normal spend -> red", r.reasons.some(x => x.rule === RULE.ANOMALY && x.severity === "red"));
}
{
  const m = baseMetrics({ anomaly: { baselineDailyConv: 10, recentDailyConv: 0.5, spendDropPct: 0.6 } }); // spend story
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("anomaly suppressed when spend dropped >30%", !r.reasons.some(x => x.rule === RULE.ANOMALY));
}
{
  const cfg = baseConfig({ minConversionsForEval: 20 });
  const m = baseMetrics({ anomaly: { baselineDailyConv: 10, recentDailyConv: 0, spendDropPct: 0 } }); // baseline below threshold
  const r = evaluateAccount(cfg, m, NOW);
  check("anomaly skipped for low-conversion account", !r.reasons.some(x => x.rule === RULE.ANOMALY));
}

// ── 5. Review recency ───────────────────────────────────────────────────────
{
  const m = baseMetrics({ review: { lastReviewAt: null } });
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("no review -> never green (yellow)", r.status === "yellow" && r.reasons.some(x => x.rule === RULE.REVIEW_RECENCY));
}
{
  // due (overdue but <=1 working day): last review 7d+1h ago
  const m = baseMetrics({ review: { lastReviewAt: new Date(NOW.getTime() - (7 * 86_400_000 + 3_600_000)).toISOString() } });
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("review just due -> yellow", r.reasons.some(x => x.rule === RULE.REVIEW_RECENCY && x.severity === "yellow"));
}
{
  // overdue > 1 working day: due was 2026-07-08 (Wed) -> Thu,Fri,Mon = 3 working days
  const m = baseMetrics({ review: { lastReviewAt: new Date("2026-07-01T09:00:00Z").toISOString() } });
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("review overdue >1 working day -> red", r.reasons.some(x => x.rule === RULE.REVIEW_RECENCY && x.severity === "red"));
}

// ── 6. Open action ──────────────────────────────────────────────────────────
{
  const m = baseMetrics({ openAction: { deadlineAt: new Date(NOW.getTime() - 3_600_000).toISOString() } });
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("open action just past deadline -> yellow", r.reasons.some(x => x.rule === RULE.OPEN_ACTION && x.severity === "yellow"));
}
{
  const m = baseMetrics({ openAction: { deadlineAt: new Date("2026-07-08T09:00:00Z").toISOString() } });
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("open action overdue >1 working day -> red", r.reasons.some(x => x.rule === RULE.OPEN_ACTION && x.severity === "red"));
}

// ── 7. Operational blockers ─────────────────────────────────────────────────
{
  const m = baseMetrics({ blockers: { pausedCampaigns: [{ name: "Brand", isMainSpend: true }] } });
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("main spend campaign paused -> red", r.reasons.some(x => x.rule === RULE.BLOCKER_PAUSED && x.severity === "red"));
}
{
  const m = baseMetrics({ blockers: { pausedCampaigns: [{ name: "Retargeting", isMainSpend: false }], disapprovedActiveAds: 2, zeroImpressionActiveCampaigns: ["Display"] } });
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("non-main paused/disapprovals/zero-impr -> yellow trio", r.status === "yellow"
    && r.reasons.some(x => x.rule === RULE.BLOCKER_PAUSED && x.severity === "yellow")
    && r.reasons.some(x => x.rule === RULE.BLOCKER_DISAPPROVAL)
    && r.reasons.some(x => x.rule === RULE.BLOCKER_ZERO_IMPR));
}

// ── Data sufficiency guard ──────────────────────────────────────────────────
{
  // insufficient last7 + terrible ROAS: must NOT go red, only yellow "decision needed"
  const m = baseMetrics(); m.last7 = { spend: 50, conversions: 1, conversionsValue: 10, impressions: 500 };
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("insufficient data -> yellow, never red", r.status === "yellow" && r.reasons.some(x => x.rule === RULE.DATA_SUFFICIENCY));
  check("insufficient data -> no performance red", !r.reasons.some(x => x.rule === RULE.PERFORMANCE));
}

// ── Exceptions suppress rules ───────────────────────────────────────────────
{
  // ROAS 2.8 across BOTH 7d windows -> performance red, but no trend drop.
  const m = baseMetrics();
  m.last7.conversionsValue = 2800; m.prev7.conversionsValue = 2800;
  m.activeExceptions = [RULE.PERFORMANCE];
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("active exception suppresses performance -> back to green", r.status === "green" && !r.reasons.some(x => x.rule === RULE.PERFORMANCE));
}

// ── Worst-severity composition ──────────────────────────────────────────────
{
  const m = baseMetrics({ mtdSpend: 1020 }); // pacing yellow
  m.last7.conversionsValue = 2800;            // performance red
  const r = evaluateAccount(baseConfig(), m, NOW);
  check("worst severity wins (red over yellow)", r.status === "red" && r.reasons.length >= 2);
}

console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL PASS");
process.exit(failures ? 1 : 0);
