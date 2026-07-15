/**
 * Assemble everything the 90-day plan generator needs for one account: the
 * live spine data (Google Ads + Shopify over 90/30/14d), real chart series, and
 * the Client Context Pack. The endpoint feeds `dataBlock` + the context to Opus,
 * which fills the structured PlanContent; the charts are computed here (never by
 * the model) so the plan's numbers are real.
 */
import { prisma } from "@/lib/db";
import { computeWindows } from "@/lib/diagnostics/windows";
import { cleanProductLabel } from "@/lib/diagnostics/engine";
import type { PlanCharts, PlanLanguage } from "./types";

const CUR: Record<string, string> = { EUR: "€", USD: "$", GBP: "£", CZK: "Kč", PLN: "zł" };
const ymd = (daysAgo: number) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - daysAgo); return d.toISOString().slice(0, 10); };
const money = (n: number, sym: string) => `${sym}${Math.round(n).toLocaleString("en-GB")}`;

export interface PlanInputs {
  account: { id: string; name: string; currency: string };
  language: PlanLanguage;
  charts: PlanCharts;
  dataBlock: string;
  contextBlock: string;
  hasMakeOrBreak: boolean;
}

export async function buildPlanInputs(accountId: string, orgId: string, langOverride?: PlanLanguage): Promise<PlanInputs | null> {
  const account = await prisma.account.findFirst({
    where: { id: accountId, organizationId: orgId },
    select: {
      id: true, name: true, clientName: true, currency: true, targetRoas: true,
      grossMarginPercent: true, businessModel: true, country: true,
      clientContextPack: true,
    },
  });
  if (!account) return null;
  const sym = CUR[account.currency] ?? `${account.currency} `;
  const ctx = account.clientContextPack;
  const language: PlanLanguage = langOverride ?? ((ctx?.defaultLanguage === "nl" ? "nl" : "en"));

  const since = ymd(91), today = new Date().toISOString().slice(0, 10);
  const [mRows, oRows, adRows] = await Promise.all([
    prisma.metricDaily.findMany({ where: { accountId, date: { gte: since } }, select: { date: true, spend: true, clicks: true, conversions: true, conversionValue: true } }),
    prisma.orderDaily.findMany({ where: { accountId, date: { gte: since } }, select: { date: true, orders: true, revenue: true } }),
    prisma.productAdsDaily.findMany({ where: { accountId, date: { gte: ymd(31) } }, select: { itemId: true, title: true, spend: true, conversions: true, conversionValue: true } }),
  ]);

  // Per-day metric collapse → windows (ROAS/POAS across horizons).
  const perDay = new Map<string, { date: string; spend: number; clicks: number; conversions: number; conversionValue: number }>();
  for (const r of mRows) {
    const e = perDay.get(r.date) ?? { date: r.date, spend: 0, clicks: 0, conversions: 0, conversionValue: 0 };
    e.spend += r.spend; e.clicks += r.clicks; e.conversions += r.conversions; e.conversionValue += r.conversionValue;
    perDay.set(r.date, e);
  }
  const marginPct = ctx?.netMarginPct ?? account.grossMarginPercent ?? null;
  const windows = computeWindows([...perDay.values()], oRows, today, marginPct);
  const win = (d: number) => windows.find(w => w.days === d);
  const targetRoas = account.targetRoas ?? null;
  const breakEven = ctx?.breakEvenRoas ?? (marginPct && marginPct > 0 ? 1 / marginPct : null);

  const roasWindows = [90, 30, 14].map(d => ({
    label: `${d}d`, roas: win(d)?.roas ?? null,
    target: d === 90 ? targetRoas : null, breakEven: d === 90 ? breakEven : null,
  }));

  // Daily revenue (Shopify if present, else ads conv value) over full/30/7 — shows the trend.
  const revByDay = new Map<string, number>();
  if (oRows.length) for (const o of oRows) revByDay.set(o.date, (revByDay.get(o.date) ?? 0) + o.revenue);
  else for (const [d, v] of perDay) revByDay.set(d, v.conversionValue);
  const avgDaily = (days: number) => {
    const from = ymd(days + 1);
    let sum = 0; for (const [d, v] of revByDay) if (d >= from) sum += v;
    return sum / days;
  };
  const dailyRevenue = [
    { label: language === "nl" ? "hele periode" : "full period", value: avgDaily(90) },
    { label: language === "nl" ? "laatste 30d" : "last 30d", value: avgDaily(30) },
    { label: language === "nl" ? "laatste 7d" : "last 7d", value: avgDaily(7) },
  ];

  const charts: PlanCharts = { roasWindows, dailyRevenue, currencySymbol: sym };

  // Winners: top products by ad conversion value (30d).
  const prodAgg = new Map<string, { title: string; spend: number; conv: number; value: number }>();
  for (const r of adRows) {
    const e = prodAgg.get(r.itemId) ?? { title: r.title || r.itemId, spend: 0, conv: 0, value: 0 };
    e.spend += r.spend; e.conv += r.conversions; e.value += r.conversionValue;
    if (!e.title && r.title) e.title = r.title;
    prodAgg.set(r.itemId, e);
  }
  const winners = [...prodAgg.values()].filter(p => p.value > 0 || p.conv > 0)
    .sort((a, b) => b.value - a.value).slice(0, 8);

  // Reconciliation (Ads conversions vs real orders, 30d).
  const conv30 = win(30)?.conversions ?? 0;
  const orders30 = oRows.filter(o => o.date >= ymd(31)).reduce((s, o) => s + o.orders, 0);
  const rev30 = oRows.filter(o => o.date >= ymd(31)).reduce((s, o) => s + o.revenue, 0);
  const spend30 = win(30)?.spend ?? 0;
  const blendedMer = spend30 > 0 && rev30 > 0 ? rev30 / spend30 : null;

  // ── Data block for the model (grounded numbers only) ───────────────────────
  const D: string[] = [`ACCOUNT: ${account.name} — ${account.businessModel ?? "ecommerce"}, market ${account.country ?? "—"}, currency ${account.currency}`];
  D.push(`\nROAS by window (ads): ${roasWindows.map(w => `${w.label} ${w.roas != null ? w.roas.toFixed(2) : "—"}`).join(" · ")}`);
  if (targetRoas) D.push(`Target ROAS: ${targetRoas.toFixed(2)}`);
  if (breakEven) D.push(`Break-even ROAS: ${breakEven.toFixed(2)} (margin ${marginPct ? Math.round(marginPct * 100) + "%" : "unknown"})`);
  for (const d of [90, 30, 14]) { const w = win(d); if (w) D.push(`${d}d: spend ${money(w.spend, sym)}, ROAS ${w.roas != null ? w.roas.toFixed(2) : "—"}, POAS ${w.poas != null ? w.poas.toFixed(2) : "—"}`); }
  if (oRows.length) D.push(`Shopify (30d): ${orders30} orders, ${money(rev30, sym)} revenue${blendedMer ? `, blended MER ${blendedMer.toFixed(2)}` : ""}`);
  D.push(`Avg daily revenue: ${dailyRevenue.map(x => `${x.label} ${money(x.value, sym)}`).join(" · ")}`);
  if (conv30 || orders30) D.push(`Reconciliation (30d): ${conv30.toFixed(1)} Ads conversions vs ${orders30} real orders${orders30 && conv30 < orders30 * 0.7 ? " — Ads is UNDER-COUNTING (likely tracking gap)" : ""}`);
  if (winners.length) { D.push(`\nWinners (top products by ad revenue, 30d):`); for (const w of winners) D.push(`  - ${w.title}: ${Math.round(w.conv)} conv, ${money(w.value, sym)} rev, ${money(w.spend, sym)} spend, ROAS ${w.spend > 0 ? (w.value / w.spend).toFixed(2) : "—"}`); }

  // ── Context pack block ─────────────────────────────────────────────────────
  const C: string[] = [];
  const add = (label: string, v?: string | null) => { if (v && v.trim()) C.push(`${label}: ${v.trim()}`); };
  add("Account manager", ctx?.amName);
  add("Goal / ambition", ctx?.goal);
  add("Main KPI", ctx?.mainKpi);
  add("Target ROAS (and hit before?)", ctx?.targetRoasNote);
  add("Ads account started", ctx?.adsStartedNote);
  add("Preferred strategy (tone)", ctx?.strategyPreference);
  add("USPs / positioning", ctx?.usps);
  add("Audience nuances", ctx?.audienceNuances);
  add("⭐ MAKE-OR-BREAK factor", ctx?.makeOrBreak);
  add("Anything else / constraints / stock", ctx?.anythingElse);
  if (ctx?.netMarginPct) C.push(`Net margin: ${Math.round(ctx.netMarginPct * 100)}%`);

  return {
    account: { id: account.id, name: account.clientName || account.name, currency: account.currency },
    language, charts,
    dataBlock: D.join("\n"),
    contextBlock: C.length ? C.join("\n") : "(no context pack filled yet — plan will be generic; fill the Context Pack, especially the make-or-break factor)",
    hasMakeOrBreak: !!(ctx?.makeOrBreak && ctx.makeOrBreak.trim()),
  };
}

export const PLAN_SYSTEM = `You are a senior Google Ads strategist at Ecomtrada, a Dutch ecommerce PPC agency. You write the agency's 90-day client plans. Ground EVERYTHING in the real numbers provided — never invent figures. The plan must be honest, specific, and client-ready.

Pick the ARCHETYPE from the data:
- "fix_first": tracking/measurement/consent is broken, or ROAS is below break-even, or data is too young/thin → the plan LEADS with fixing measurement before scaling.
- "scale": ROAS is at/above target and above break-even, account under-spends or has headroom → the plan LEADS with disciplined scaling + steering on profit (POAS).

The make-or-break factor from the context pack is THE most important input — it must visibly shape the make-or-break section AND the strategy. If it's missing, keep that section honest and general, and note more context is needed.

Rules: real numbers only ("ROAS 1.54 vs break-even 2.0", not "ROAS is low"). Match the client's preferred tone (cautious vs aggressive) from the context. Never recommend raising budget while ROAS is below break-even. Be concrete about the 3 phases (weeks + who does what). End with honest caveats — what you will NOT promise. Write in the requested language (en or nl), in Ecomtrada's direct, confident voice.

Return ONLY a JSON object (no prose, no code fences) matching this shape:
{"archetype":"fix_first|scale","subtitle":"goal · market · target ROAS · 90-day period · AM","strategyLead":"1 paragraph, **bold** key phrases","stats":[{"key":"","value":"","sub":"","tone":"grad|good|bad|neutral"}],"makeOrBreakTitle":"","makeOrBreakBody":"","makeOrBreakBullets":["",""],"findings":[{"title":"","body":""}],"levers":[{"title":"","body":""}],"whatWeBuild":[{"title":"","body":""}],"phases":[{"title":"Phase 1 · …","window":"Week 1–2","actions":[{"action":"","who":"Ecomtrada|Client|Together","when":"Week 1"}]}],"forecastLead":"","forecast":[{"label":"","now":"","target":""}],"whatWeNeed":[""],"caveats":"what we will not promise"}
Use 4–8 stats, 3–4 findings, 2–3 levers, 4–8 whatWeBuild, exactly 3 phases, 3–5 forecast rows, 3–5 whatWeNeed. Keep bodies tight (1–2 sentences).`;
