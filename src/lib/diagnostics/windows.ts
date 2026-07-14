/**
 * Multi-window aggregation (BUILD-SPEC §4 — honest comparison across horizons).
 *
 * The spine stores one row per day, so any horizon can be computed from it. A
 * nuvaarbewijs is visible precisely because the short windows (3/7d) diverge
 * from the long baseline (30/90d): spend up, ROAS/POAS down. This is pure so it
 * can be tested; the view renders the table and highlights the divergence.
 */
export const HORIZONS = [3, 7, 14, 30, 60, 90] as const;

export interface DailyMetric { date: string; spend: number; clicks: number; conversions: number; conversionValue: number; }
export interface DailyOrder { date: string; orders: number; revenue: number; }

export interface WindowRow {
  days: number;
  coverageDays: number;   // distinct dates actually present in the window
  partial: boolean;       // true when history doesn't yet cover the full horizon
  spend: number;
  clicks: number;
  conversions: number;
  conversionValue: number;
  roas: number | null;
  orders: number | null;  // null when no order feed
  revenue: number | null;
  poas: number | null;    // null when no revenue/margin
}

export interface WindowTrend {
  /** Short window (7d) POAS/ROAS materially below the long baseline (30d)? */
  acuteDrop: boolean;
  /** Short window daily spend materially above the long baseline? */
  spendSpike: boolean;
  note: string | null;
}

/** YYYY-MM-DD `n` days before `todayYmd` (UTC, pure). */
function minusDays(todayYmd: string, n: number): string {
  const d = new Date(`${todayYmd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

function sumIn<T extends { date: string }>(rows: T[], start: string, end: string, f: (r: T) => number): number {
  return rows.reduce((s, r) => (r.date >= start && r.date <= end ? s + f(r) : s), 0);
}
function distinctDates<T extends { date: string }>(rows: T[], start: string, end: string): number {
  const set = new Set<string>();
  for (const r of rows) if (r.date >= start && r.date <= end) set.add(r.date);
  return set.size;
}

/**
 * Compute one aggregate row per horizon, each ending yesterday (today is
 * incomplete). `marginPct` (0–1) enables POAS.
 */
export function computeWindows(
  metrics: DailyMetric[],
  orders: DailyOrder[],
  todayYmd: string,
  marginPct: number | null,
  horizons: readonly number[] = HORIZONS,
): WindowRow[] {
  const end = minusDays(todayYmd, 1); // yesterday
  const hasOrders = orders.length > 0;

  return horizons.map(h => {
    const start = minusDays(todayYmd, h);
    const spend = sumIn(metrics, start, end, m => m.spend);
    const clicks = sumIn(metrics, start, end, m => m.clicks);
    const conversions = sumIn(metrics, start, end, m => m.conversions);
    const conversionValue = sumIn(metrics, start, end, m => m.conversionValue);
    const revenue = hasOrders ? sumIn(orders, start, end, o => o.revenue) : null;
    const orderCount = hasOrders ? sumIn(orders, start, end, o => o.orders) : null;
    const coverageDays = distinctDates(metrics, start, end);

    return {
      days: h,
      coverageDays,
      partial: coverageDays < h,
      spend, clicks, conversions, conversionValue,
      roas: spend > 0 ? conversionValue / spend : null,
      orders: orderCount,
      revenue,
      poas: revenue != null && marginPct != null && marginPct > 0 && spend > 0 ? (revenue * marginPct) / spend : null,
    };
  });
}

/**
 * Flag acute divergence: the short window (7d) meaningfully worse than the
 * 30-day baseline. This is the shape a runaway-scale incident makes. Facts only
 * — it names no cause.
 */
export function detectTrend(windows: WindowRow[], dropThreshold = 0.25, spikeThreshold = 0.4): WindowTrend {
  const short = windows.find(w => w.days === 7);
  const base = windows.find(w => w.days === 30);
  if (!short || !base || base.coverageDays < 14) return { acuteDrop: false, spendSpike: false, note: null };

  const shortReturn = short.poas ?? short.roas;
  const baseReturn = base.poas ?? base.roas;
  const acuteDrop = shortReturn != null && baseReturn != null && baseReturn > 0
    && (baseReturn - shortReturn) / baseReturn >= dropThreshold;

  const shortPerDay = short.spend / 7;
  const basePerDay = base.spend / 30;
  const spendSpike = basePerDay > 0 && (shortPerDay - basePerDay) / basePerDay >= spikeThreshold;

  const bits: string[] = [];
  if (spendSpike) bits.push(`daily spend is ${Math.round(((shortPerDay - basePerDay) / basePerDay) * 100)}% above the 30-day baseline`);
  if (acuteDrop) bits.push(`recent ${short.poas != null ? "POAS" : "ROAS"} is down vs the 30-day baseline`);
  return { acuteDrop, spendSpike, note: bits.length ? `Last 7 days: ${bits.join("; ")}.` : null };
}
