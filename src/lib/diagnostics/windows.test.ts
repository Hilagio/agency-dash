/**
 * Multi-window aggregation spec.
 *   npx tsx src/lib/diagnostics/windows.test.ts
 */
import { computeWindows, detectTrend, type DailyMetric, type DailyOrder } from "./windows";

let fail = 0;
const ok = (n: string, c: boolean) => { console.log(c ? "✓" : "✗ FAIL:", n); if (!c) fail++; };

const TODAY = "2026-07-14";
function minus(n: number): string { const d = new Date(`${TODAY}T00:00:00Z`); d.setUTCDate(d.getUTCDate() - n); return d.toISOString().slice(0, 10); }

// 40 days of history. Baseline: €100/day spend, ROAS 4. Last 7 days: spend
// jumps to €400/day and ROAS collapses to 1 — the nuvaarbewijs shape.
const metrics: DailyMetric[] = [];
const orders: DailyOrder[] = [];
for (let i = 1; i <= 40; i++) {
  const date = minus(i);
  const recent = i <= 7;
  const spend = recent ? 400 : 100;
  const roas = recent ? 1 : 4;
  metrics.push({ date, spend, clicks: 50, conversions: 5, conversionValue: spend * roas });
  orders.push({ date, orders: recent ? 6 : 5, revenue: spend * roas });
}

const w = computeWindows(metrics, orders, TODAY, 0.5);
const by = (d: number) => w.find(x => x.days === d)!;

ok("produces all six horizons", w.length === 6 && [3,7,14,30,60,90].every(h => w.some(x => x.days === h)));
ok("7-day window sums 7 days of spend (€2,800)", Math.abs(by(7).spend - 2800) < 1e-6);
ok("7-day ROAS ~1 (the collapse)", Math.abs((by(7).roas ?? 0) - 1) < 1e-6);
ok("30-day ROAS well above the 7-day", (by(30).roas ?? 0) > (by(7).roas ?? 0));
ok("90-day window is marked partial (only 40 days of history)", by(90).partial);
ok("14-day window covers 14 distinct days", by(14).coverageDays === 14);
ok("POAS computed from revenue × margin", by(7).poas != null && Math.abs((by(7).poas ?? 0) - (2800 * 0.5 / 2800)) < 1e-6);
ok("orders summed for the window", by(7).orders === 42);

const trend = detectTrend(w);
ok("trend flags the spend spike", trend.spendSpike);
ok("trend flags the acute return drop", trend.acuteDrop);
ok("trend note is human-readable", !!trend.note && /baseline/.test(trend.note!));

// No order feed → orders/revenue/poas null, still computes ad metrics.
const noOrders = computeWindows(metrics, [], TODAY, 0.5);
ok("without an order feed, orders/poas are null but ROAS still computes", noOrders.find(x => x.days === 7)!.orders === null && noOrders.find(x => x.days === 7)!.roas != null);

console.log(fail ? `\n${fail} FAILURE(S)` : "\nWINDOWS: PASS — horizons + trend divergence");
process.exit(fail ? 1 : 0);
