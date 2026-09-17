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
    prisma.metricDaily.findMany({ where: { accountId, date: { gte: since } }, select: { date: true, campaignName: true, spend: true, clicks: true, conversions: true, conversionValue: true } }),
    prisma.orderDaily.findMany({ where: { accountId, date: { gte: since } }, select: { date: true, orders: true, revenue: true } }),
    prisma.productAdsDaily.findMany({ where: { accountId, date: { gte: ymd(31) } }, select: { itemId: true, title: true, spend: true, conversions: true, conversionValue: true } }),
  ]);

  // Brand campaigns (by explicit naming convention only — "Brand"/"Branded"/
  // "Merk" in the campaign name; matching on the shop name would misfire because
  // many teams prefix EVERY campaign with the client name). Brand search
  // inflates account-wide ROAS, so the plan gets both views.
  const isBrandCampaign = (name: string) => /(^|[^a-z])brand(ed)?([^a-z]|$)|merk(naam)?([^a-z]|$)/i.test(name);
  const brandNames = new Set<string>();

  // Per-day metric collapse → windows (ROAS/POAS across horizons), account-wide
  // AND excluding brand campaigns.
  const perDay = new Map<string, { date: string; spend: number; clicks: number; conversions: number; conversionValue: number }>();
  const perDayNb = new Map<string, { date: string; spend: number; clicks: number; conversions: number; conversionValue: number }>();
  for (const r of mRows) {
    const e = perDay.get(r.date) ?? { date: r.date, spend: 0, clicks: 0, conversions: 0, conversionValue: 0 };
    e.spend += r.spend; e.clicks += r.clicks; e.conversions += r.conversions; e.conversionValue += r.conversionValue;
    perDay.set(r.date, e);
    if (isBrandCampaign(r.campaignName)) { brandNames.add(r.campaignName); continue; }
    const n = perDayNb.get(r.date) ?? { date: r.date, spend: 0, clicks: 0, conversions: 0, conversionValue: 0 };
    n.spend += r.spend; n.clicks += r.clicks; n.conversions += r.conversions; n.conversionValue += r.conversionValue;
    perDayNb.set(r.date, n);
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
  if (brandNames.size) {
    const nbWindows = computeWindows([...perDayNb.values()], [], today, marginPct);
    const nbWin = (d: number) => nbWindows.find(w => w.days === d);
    D.push(`\nBrand campaigns detected (${[...brandNames].slice(0, 6).join(", ")}) — account-wide ROAS is inflated by brand search. EXCLUDING brand campaigns:`);
    for (const d of [90, 30, 14]) { const w = nbWin(d); if (w) D.push(`${d}d excl. brand: spend ${money(w.spend, sym)}, ROAS ${w.roas != null ? w.roas.toFixed(2) : "—"}`); }
  }
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
  add("⛔ HARD CONSTRAINTS & extra context (binding — respect every item)", ctx?.anythingElse);
  if (ctx?.netMarginPct) C.push(`Net margin: ${Math.round(ctx.netMarginPct * 100)}%`);

  return {
    account: { id: account.id, name: account.clientName || account.name, currency: account.currency },
    language, charts,
    dataBlock: D.join("\n"),
    contextBlock: C.length ? C.join("\n") : "(no context pack filled yet — plan will be generic; fill the Context Pack, especially the make-or-break factor)",
    hasMakeOrBreak: !!(ctx?.makeOrBreak && ctx.makeOrBreak.trim()),
  };
}

export const PLAN_SYSTEM = `You are a senior Google Ads strategist at Ecomtrada, a Dutch ecommerce PPC agency. You write the agency's strategic client plans (default horizon 90 days) following the Ecomtrada Client Strategy SOP. Ground EVERYTHING in the real numbers provided — never invent figures. The plan must be honest, specific, and client-ready.

THE SOP STRUCTURE the plan must breathe (a stranger to the account must understand where the client stands, what we're trying to achieve, and how):
1. STATUS — where the client stands today, in real numbers and concrete context (strategyLead + stats). Not "performance is okay"; write "spends ~€30k/month at blended ROAS 2.7; Zombies campaign profitable and scaling; main PMax below target".
2. GOAL — one measurable goal for the period, tied to the client's business objective and a timeframe ("goal" field). Never vague ("improve performance" is banned).
3. PATH TO GOAL — the strategic roadmap as 3–6 short steps ("pathToGoal") that make the logic visible: we do X now because it enables Y later.
4. WORKSTREAMS — the phases (see below).

PHASES ARE WORKSTREAMS, NOT A TIMELINE. This is a CHECKLIST the team ticks off over the period — not a rigid week-by-week sequence:
- Each phase is a strategic theme (e.g. "Waste & feed efficiency", "Structure & consolidation", "Scaling & expansion"), with "window" as an INDICATIVE emphasis ("from day 1", "continuous", "second half"), never a hard gate.
- Anything that can start immediately starts immediately: feed optimisation, search-term cleanup, negative keywords etc. are day-one work — NEVER artificially parked at week 4+ because they sit in a later phase.
- "when" per action is indicative: "vanaf start", "doorlopend", "na review", "zodra X staat" (or English equivalents) — only use a concrete week when a real dependency or timing anchor (e.g. Black Friday) demands it.
- Sequence ONLY where a genuine dependency exists, and then name the dependency in the action text.

OPERATIONAL HYGIENE IS NOT STRATEGY. Tracking checks, stock checks, consent-mode plumbing, basic account housekeeping do NOT appear as plan actions or phases — the platform monitors those separately. If something there is genuinely broken and material, mention it ONCE under whatWeNeed or caveats as a precondition. The plan itself is about strategy: money, structure, growth.

EVERY ACTION IS ACTIONABLE (SOP: no open-ended intentions). Each action names a concrete change someone can execute and tick off. For actions that are tests/structural changes, state in the action text what success looks like ("consolidate Heroes+Sidekicks+Zombies into one campaign; success = ROAS ≥3.0 while spend grows"). Banned: "look at", "monitor", "consider", "explore".

Pick the ARCHETYPE from the data:
- "fix_first": ROAS below break-even, or data too young/thin to steer on → the plan LEADS with restoring profitable economics before scaling.
- "scale": ROAS at/above target and above break-even, account under-spends or has headroom → the plan LEADS with disciplined scaling + steering on profit (POAS).

The make-or-break factor from the context pack is THE most important input — it must visibly shape the make-or-break section AND the strategy. If it's missing, keep that section honest and general, and note more context is needed.

Every line of the context pack is a BINDING input, not background color. The "HARD CONSTRAINTS & extra context" items are non-negotiable: budget ceilings, no-go's, stock limits, country restrictions and timing anchors must each visibly shape the workstreams, levers and forecast — and a reader must be able to point at where each constraint landed. Never propose something a constraint rules out.

Rules: real numbers only ("ROAS 1.54 vs break-even 2.0", not "ROAS is low"). When "excl. brand" numbers are provided, ground EVERY performance judgement and scaling decision in those (brand search inflates account-wide ROAS) and say which view a number comes from; account-wide figures are context only. Match the client's preferred tone (cautious vs aggressive). Never recommend raising budget while ROAS is below break-even. End with honest caveats — what you will NOT promise. Write in the requested language (en or nl), in Ecomtrada's direct, confident voice.

Return ONLY a JSON object (no prose, no code fences) matching this shape:
{"archetype":"fix_first|scale","planType":"first|next|custom","horizonDays":90,"subtitle":"goal · market · target ROAS · period · AM","goal":"one measurable goal for this period","pathToGoal":["step 1","step 2"],"strategyLead":"1 paragraph, **bold** key phrases","stats":[{"key":"","value":"","sub":"","tone":"grad|good|bad|neutral"}],"makeOrBreakTitle":"","makeOrBreakBody":"","makeOrBreakBullets":["",""],"findings":[{"title":"","body":""}],"levers":[{"title":"","body":""}],"whatWeBuild":[{"title":"","body":""}],"phases":[{"title":"Workstream 1 · …","window":"from day 1 / continuous / …","actions":[{"action":"","who":"Ecomtrada|Client|Together","when":"vanaf start|doorlopend|…"}]}],"forecastLead":"","forecast":[{"label":"","now":"","target":""}],"whatWeNeed":[""],"caveats":"what we will not promise"}
Use 4–8 stats, 3–4 findings, 2–3 levers, 4–8 whatWeBuild, exactly 3 phases (workstreams), 3–5 forecast rows, 3–5 whatWeNeed. Keep bodies tight (1–2 sentences).`;
