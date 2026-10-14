/**
 * Weekly update generator — the predictable weekly cadence the team runs on.
 *
 * Computes the week-over-week numbers DETERMINISTICALLY from the spine (spend,
 * ROAS, conversions, per-campaign movers, plan progress, change events) and
 * has the model write TWO plain-text updates from them:
 *   internal — the SOP [WEEKLY REVIEW]/[WEEKLY PLAN] shape, candid, for the team
 *   client   — short, Slack/WhatsApp-ready, sendable to the client as-is
 * Every claim must carry a number; the model never invents figures.
 * Saved to the account's document library (docType "Weekly Update") so the
 * board can show who is overdue and nothing gets forgotten.
 */
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import type { PlanContent } from "@/lib/plan/types";

const client = new Anthropic();

const CUR: Record<string, string> = { EUR: "€", USD: "$", GBP: "£", CZK: "Kč", PLN: "zł" };
const ymd = (daysAgo: number) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - daysAgo); return d.toISOString().slice(0, 10); };

const SYSTEM = `You write the weekly account update for Ecomtrada, a Dutch ecommerce PPC agency, following the agency's Slack update SOP. You get the computed week-over-week numbers — you NEVER invent or recompute figures; every claim cites a number from the data.

Return ONLY a JSON object: {"internal": "...", "client": "..."}

INTERNAL (for the team, candid, the SOP [WEEKLY REVIEW] shape):
- Where are we: 1-2 lines with this week's spend/ROAS/conversions vs last week (deltas).
- Progress toward the goal: are we closer than last week? Numbers.
- What happened: plan actions completed this week (name them), notable campaign movers (name + delta).
- Active tests / next review: only if the data shows one.
- Next step: THE one thing for next week, from the open plan actions.
- Blockers: only if real (from blocked actions / missing data).

CLIENT (sendable as-is, the team may paste it straight into the client's Slack/WhatsApp):
- 6-10 short lines, warm but concrete. Open with the headline number of the week.
- What we did, what it delivered (numbers), what we do next week.
- No internal jargon, no tool names, no hedging-by-committee, no promises beyond the data.
- If the week was soft: say it plainly WITH the number and what we're doing about it — clients trust honesty with a plan.

FORMAT RULES for BOTH texts (Slack/WhatsApp-friendly): plain text only — short lines, "•" for bullets, *asterisks* for bold (Slack/WhatsApp style). NO markdown headings, NO tables, NO links, NO hashtags, NO emoji floods (max 2-3 total). Write in the requested language, native quality. Internal max ~180 words, client max ~120 words.

If the data block says numbers are missing or stale, the texts must SAY so briefly instead of guessing — and the internal version names what's needed to fix it.`;

export interface WeeklyResult { internal: string; client: string; savedId: string | null }

export async function generateWeeklyUpdate(
  accountId: string,
  opts?: { createdBy?: string | null; onTick?: () => void },
): Promise<WeeklyResult> {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: { id: true, name: true, clientName: true, currency: true },
  });
  if (!account) throw new Error("account not found");
  const sym = CUR[account.currency] ?? `${account.currency} `;
  const money = (n: number) => `${sym}${Math.round(n).toLocaleString("en-GB")}`;

  const [mRows, oRows, inst, changes, clientCtx, rulings] = await Promise.all([
    prisma.metricDaily.findMany({ where: { accountId, date: { gte: ymd(15), lte: ymd(1) } }, select: { date: true, campaignName: true, spend: true, conversions: true, conversionValue: true } }),
    prisma.orderDaily.findMany({ where: { accountId, date: { gte: ymd(15), lte: ymd(1) } }, select: { date: true, orders: true, revenue: true }, orderBy: { date: "asc" } }),
    prisma.planInstance.findUnique({ where: { accountId }, include: { states: true } }).catch(() => null),
    prisma.changeEvent.count({ where: { accountId, changedAt: { gte: new Date(Date.now() - 7 * 86_400_000) } } }).catch(() => 0),
    prisma.clientContext.findUnique({ where: { accountId } }).catch(() => null),
    prisma.accountRuling.findMany({ where: { accountId, active: true }, orderBy: { createdAt: "desc" }, take: 15 }).catch(() => []),
  ]);

  // Two full 7-day windows, ending yesterday (today is always partial).
  const splitDate = ymd(8);
  const agg = (rows: typeof mRows, from: string, to: string) => {
    let spend = 0, conv = 0, value = 0;
    for (const r of rows) if (r.date >= from && r.date <= to) { spend += r.spend; conv += r.conversions; value += r.conversionValue; }
    return { spend, conv, value, roas: spend > 0 ? value / spend : 0 };
  };
  const thisW = agg(mRows, splitDate, ymd(1));
  const lastW = agg(mRows, ymd(15), ymd(9));

  const byCampaign = new Map<string, { t: number; l: number; tv: number; lv: number }>();
  for (const r of mRows) {
    const e = byCampaign.get(r.campaignName) ?? { t: 0, l: 0, tv: 0, lv: 0 };
    if (r.date >= splitDate) { e.t += r.spend; e.tv += r.conversionValue; } else { e.l += r.spend; e.lv += r.conversionValue; }
    byCampaign.set(r.campaignName, e);
  }
  const movers = [...byCampaign.entries()].filter(([, c]) => c.t + c.l > 50)
    .sort((a, b) => (b[1].t + b[1].l) - (a[1].t + a[1].l)).slice(0, 6);

  const D: string[] = [`ACCOUNT: ${account.clientName || account.name}`];
  D.push(`THIS WEEK (${splitDate} → ${ymd(1)}): spend ${money(thisW.spend)}, ${thisW.conv.toFixed(0)} conversions, value ${money(thisW.value)}, ROAS ${thisW.roas.toFixed(2)}`);
  D.push(`LAST WEEK (${ymd(15)} → ${ymd(9)}): spend ${money(lastW.spend)}, ${lastW.conv.toFixed(0)} conversions, value ${money(lastW.value)}, ROAS ${lastW.roas.toFixed(2)}`);
  if (thisW.spend === 0 && lastW.spend === 0) D.push(`NOTE: no spend data in either window — the update must say data is missing, not that performance is zero.`);
  const orders = oRows.filter(o => o.date >= splitDate).reduce((s, o) => s + o.orders, 0);
  const ordersPrev = oRows.filter(o => o.date < splitDate).reduce((s, o) => s + o.orders, 0);
  const orderEnd = oRows.length ? oRows[oRows.length - 1]?.date : null;
  if (oRows.length && orderEnd && orderEnd >= splitDate) D.push(`Shop orders: ${orders} this week vs ${ordersPrev} last week (order data through ${orderEnd}).`);
  else if (oRows.length) D.push(`Shop order data ends ${orderEnd} — the recent window is NOT covered; do not read it as zero orders.`);
  if (movers.length) {
    D.push(`Per campaign (spend this week vs last · ROAS this week):`);
    for (const [name, c] of movers) D.push(`  - ${name}: ${money(c.t)} vs ${money(c.l)} · ROAS ${c.t > 0 ? (c.tv / c.t).toFixed(2) : "—"}`);
  }
  if (clientCtx?.goal) D.push(`Client goal: ${clientCtx.goal}`);
  if (clientCtx?.mainKpi) D.push(`Main KPI: ${clientCtx.mainKpi}`);

  if (inst) {
    let content: PlanContent | null = null;
    try { content = JSON.parse(inst.content) as PlanContent; } catch { /* ignore */ }
    if (content) {
      const stBy = new Map(inst.states.map(s => [s.path, s]));
      const weekAgo = new Date(Date.now() - 7 * 86_400_000);
      const doneThisWeek: string[] = []; const open: string[] = []; const blocked: string[] = [];
      content.phases.forEach((ph, pi) => (ph.actions ?? []).forEach((a, ai) => {
        if (a.dropped) return;
        const st = stBy.get(`p${pi}a${ai}`);
        if (st?.status === "done") { if (st.doneAt && st.doneAt >= weekAgo) doneThisWeek.push(`${a.action}${st.doneBy ? ` (${st.doneBy.split("@")[0]})` : ""}`); }
        else if (st?.status === "blocked") blocked.push(`${a.action}${st.note ? ` — ${st.note}` : ""}`);
        else open.push(a.action);
      }));
      const day = Math.max(1, Math.floor((Date.now() - inst.startedAt.getTime()) / 86_400_000) + 1);
      const hd = content.horizonDays && content.horizonDays > 0 ? content.horizonDays : 90;
      D.push(`\nLIVE PLAN: day ${day} of ${hd}${content.goal ? ` · goal: ${content.goal}` : ""}`);
      if (doneThisWeek.length) D.push(`Completed THIS WEEK: ${doneThisWeek.slice(0, 6).map(t => `"${t}"`).join("; ")}`);
      if (open.length) D.push(`Next open actions: ${open.slice(0, 3).map(t => `"${t}"`).join("; ")}`);
      if (blocked.length) D.push(`Blocked: ${blocked.slice(0, 3).map(t => `"${t}"`).join("; ")}`);
    }
  } else {
    D.push(`\nNo live 90-day plan on this account — the internal update should note that as the gap to fix.`);
  }
  if (changes > 0) D.push(`Google Ads change events logged in the last 7 days: ${changes}.`);
  if (rulings.length) D.push(`\nTEAM RULINGS (binding — never contradict or re-raise these):\n${rulings.map(r => `- ${r.text}`).join("\n")}`);

  const language = clientCtx?.defaultLanguage === "nl" ? "nl" : "en";
  const userMsg = `LANGUAGE: ${language === "nl" ? "Dutch (nl)" : "English (en)"}\nTODAY: ${new Date().toISOString().slice(0, 10)}\n\n--- COMPUTED WEEK DATA (the only source of numbers) ---\n${D.join("\n")}\n\nWrite the two updates. Return only the JSON object.`;

  const s = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 6000,
    thinking: { type: "adaptive" },
    system: SYSTEM,
    messages: [{ role: "user", content: userMsg }],
  });
  let acc = "", ticks = 0;
  for await (const ev of s) {
    if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
      acc += ev.delta.text;
      if (++ticks % 10 === 0) opts?.onTick?.();
    }
  }

  const a = acc.indexOf("{"), b = acc.lastIndexOf("}");
  let parsed: { internal?: string; client?: string } | null = null;
  if (a >= 0 && b > a) { try { parsed = JSON.parse(acc.slice(a, b + 1)); } catch { parsed = null; } }
  if (!parsed?.internal || !parsed?.client) throw new Error("weekly update came back unreadable — try again");

  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const nl = language === "nl";
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(account.clientName || account.name)} — Weekly Update</title>
<style>body{font-family:-apple-system,'Segoe UI',sans-serif;max-width:760px;margin:40px auto;padding:0 20px;color:#222;line-height:1.6}h2{font-size:15px;margin:28px 0 8px}pre{white-space:pre-wrap;background:#f6f4ef;border:1px solid #e3ddd1;border-radius:10px;padding:16px;font-family:inherit;font-size:14px}</style></head>
<body><h1 style="font-size:20px">${esc(account.clientName || account.name)} — Weekly Update · ${new Date().toISOString().slice(0, 10)}</h1>
<h2>${nl ? "Intern (team)" : "Internal (team)"}</h2><pre>${esc(parsed.internal)}</pre>
<h2>${nl ? "Klantversie (direct verstuurbaar)" : "Client version (sendable as-is)"}</h2><pre>${esc(parsed.client)}</pre></body></html>`;
  const safe = (account.clientName || account.name).replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const saved = await prisma.generatedDoc.create({
    data: { accountId, title: `${account.clientName || account.name} — Weekly Update ${new Date().toISOString().slice(0, 10)}`, docType: "Weekly Update", format: "doc", language, filename: `${safe}-weekly-update.html`, html, createdBy: opts?.createdBy ?? "weekly-cron" },
    select: { id: true },
  }).catch(() => null);

  return { internal: parsed.internal, client: parsed.client, savedId: saved?.id ?? null };
}
