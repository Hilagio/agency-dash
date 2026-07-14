/**
 * POST /api/diagnostics/account/[id]/insight — an expert PPC OS read of ONE
 * account, so the team doesn't have to figure it out themselves.
 *
 * Feeds the account's real diagnostic numbers (windows, issues, products, change
 * events) to Claude with the PPC OS knowledge base attached (MCP connector), and
 * returns a short, direct read: what's happening, the likely why/correlation, and
 * the single next move. Grounded in the actual data + PPC OS methodology.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { computeWindows } from "@/lib/diagnostics/windows";
import { cleanProductLabel } from "@/lib/diagnostics/engine";
import { ppcOsMcp, PPC_OS_SYSTEM_NOTE } from "@/lib/integrations/ppc-os";
import type { Signal } from "@/lib/diagnostics/signals";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

type Params = { params: Promise<{ id: string }> };
const client = new Anthropic();

interface DiagMetrics {
  source?: string;
  window?: { spend: number; conversions: number; conversionValue: number; days: number };
  commerce?: { orders: number; revenue: number; currency: string } | null;
  reconciliation?: { adsConversions: number; actualOrders: number } | null;
  grossMarginPct?: number | null;
  signals?: Signal[];
}
const money = (n: number, cur: string) => `${cur}${Math.round(n).toLocaleString("en-GB")}`;

const SYSTEM = `You are a senior Google Ads specialist who works in the PPC OS methodology (Bob Meijer / PPC Mastery). An agency team opens an account and wants your at-a-glance expert read so they don't have to dig through the data themselves.

Give a SHORT, direct read in exactly these three sections, using the actual numbers provided. Format each section header on its own line as bold markdown, with NO numbers, exactly like this:

**The read**
What's actually happening, in 1–2 sentences.

**Likely why**
Connect the dots: correlate a change (budget/negatives, dates) with a metric shift, or name the product/segment dragging or lifting the account. State it as a hypothesis, not certainty.

**Do next**
The single highest-leverage move, specific and concrete.

Formatting rules: Start immediately with the "**The read**" header — NO preamble line like "Here's the read:". Do NOT use horizontal rules or dividers (no "---"). Keep the three bold headers exactly as shown. Use plain paragraphs under each header; a short bullet list is fine only under "Do next" if there are genuinely multiple moves.

Content rules: be direct, no fluff, no generic advice. Use real numbers ("ROAS fell from 3.1 to 1.9", not "ROAS is low"). Consult the PPC OS knowledge base (the ppc-os tools) when the reasoning touches methodology. NEVER recommend raising budget when ROAS is below target. If the data is too thin to be confident, say so in one line rather than guessing.`;

function buildContext(name: string, cur: string, diag: DiagMetrics | null, windows: Awaited<ReturnType<typeof computeWindows>>, pages: { name: string; spend: number; clicks: number; conversions: number; roas: number | null }[], changes: { changeType: string; changedAt: Date }[]): string {
  const L: string[] = [`ACCOUNT: ${name} (currency ${cur})`];
  const w = diag?.window;
  if (w) {
    const roas = w.spend > 0 ? w.conversionValue / w.spend : 0;
    L.push(`\n7-day: spend ${money(w.spend, cur)}, ${Math.round(w.conversions)} conversions, ROAS ${roas.toFixed(2)}`);
  }
  if (diag?.commerce) L.push(`Shopify: ${diag.commerce.orders} orders, ${money(diag.commerce.revenue, cur)} revenue`);
  if (diag?.reconciliation) L.push(`Reconciliation: ${diag.reconciliation.adsConversions.toFixed(1)} Ads conversions vs ${diag.reconciliation.actualOrders} real orders`);
  if (diag?.grossMarginPct) L.push(`Gross margin: ${Math.round(diag.grossMarginPct * 100)}% (break-even ROAS ${(1 / diag.grossMarginPct).toFixed(2)})`);

  if (windows.some(x => x.spend > 0)) {
    L.push(`\nAcross windows (spend / ROAS / POAS):`);
    for (const x of windows) L.push(`  ${x.days}d: ${money(x.spend, cur)} / ${x.roas != null ? x.roas.toFixed(2) : "—"} / ${x.poas != null ? x.poas.toFixed(2) : "—"}${x.partial ? " (partial history)" : ""}`);
  }

  const issues = (diag?.signals ?? []).filter(s => s.kind === "problem");
  if (issues.length) { L.push(`\nDetected issues:`); for (const s of issues) L.push(`  - ${s.detail}`); }

  if (pages.length) {
    L.push(`\nProduct/page performance (7d, by spend — spend / clicks / conv / ROAS):`);
    for (const p of pages.slice(0, 10)) L.push(`  - ${p.name}: ${money(p.spend, cur)} / ${p.clicks} / ${Math.round(p.conversions)} / ${p.roas != null ? p.roas.toFixed(2) : "—"}`);
  }
  if (changes.length) {
    const counts = changes.reduce((m, c) => { m[c.changeType] = (m[c.changeType] ?? 0) + 1; return m; }, {} as Record<string, number>);
    L.push(`\nRecent account changes (last 14d): ${Object.entries(counts).map(([t, n]) => `${n}× ${t}`).join(", ")}`);
  }
  return L.join("\n");
}

const CUR: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" };

export async function POST(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: {
      id: true, name: true, currency: true, grossMarginPercent: true,
      trackingStatus: true, trackingNote: true, trackingSetAt: true, trackingSetBy: true,
    },
  });
  if (!account) return forbidden();
  const cur = CUR[account.currency] ?? `${account.currency} `;

  // Team-confirmed tracking verdict → the read reasons from certainty instead of
  // re-hypothesising a tag break every time.
  let trackingDirective = "";
  if (account.trackingStatus === "verified") {
    const who = account.trackingSetBy ? ` by ${account.trackingSetBy}` : "";
    const when = account.trackingSetAt ? ` on ${account.trackingSetAt.toISOString().slice(0, 10)}` : "";
    trackingDirective = `\n\nTEAM-CONFIRMED FACT${who}${when}: Conversion tracking has been verified working end-to-end${account.trackingNote ? ` (${account.trackingNote})` : ""}. Treat every conversion and ROAS figure below as ACCURATE. Do NOT hypothesise a tracking or tag break. If brand or overall CVR is low or 0%, reason about it as a REAL performance / demand / landing-page / competition issue — not a measurement artefact.`;
  } else if (account.trackingStatus === "broken") {
    const who = account.trackingSetBy ? ` by ${account.trackingSetBy}` : "";
    const when = account.trackingSetAt ? ` on ${account.trackingSetAt.toISOString().slice(0, 10)}` : "";
    trackingDirective = `\n\nTEAM-CONFIRMED FACT${who}${when}: Conversion tracking is BROKEN${account.trackingNote ? ` (${account.trackingNote})` : ""}. Every conversion and ROAS figure below is UNRELIABLE and almost certainly understated. The single highest priority is restoring tracking; do NOT draw ROAS/profitability conclusions or recommend bidding/budget changes until it is fixed and clean data re-accrues.`;
  }

  const ppc = ppcOsMcp();
  if (!ppc) return NextResponse.json({ error: "PPC OS is not connected (set PPC_OS_MCP_TOKEN)." }, { status: 400 });

  // Gather the same diagnostic data the cockpit shows.
  const since = new Date(); since.setUTCDate(since.getUTCDate() - 91);
  const sinceYmd = since.toISOString().slice(0, 10);
  const win7 = new Date(); win7.setUTCDate(win7.getUTCDate() - 7);
  const win7Ymd = win7.toISOString().slice(0, 10);
  const endYmd = new Date(Date.now() - 864e5).toISOString().slice(0, 10);

  const [statusRow, mRows, pageRows, changeRows] = await Promise.all([
    prisma.accountStatus.findMany({ where: { accountId: id }, orderBy: { computedAt: "desc" }, take: 6 }),
    prisma.metricDaily.findMany({ where: { accountId: id, date: { gte: sinceYmd } }, select: { date: true, spend: true, clicks: true, conversions: true, conversionValue: true } }),
    prisma.metricProductDaily.findMany({ where: { accountId: id, date: { gte: win7Ymd, lte: endYmd } }, select: { landingPageUrl: true, spend: true, clicks: true, conversions: true, conversionValue: true } }),
    prisma.changeEvent.findMany({ where: { accountId: id, changedAt: { gte: win7 } }, select: { changeType: true, changedAt: true } }),
  ]);

  let diag: DiagMetrics | null = null;
  for (const s of statusRow) { try { const m = JSON.parse(s.metrics); if (m?.source === "diagnostics") { diag = m; break; } } catch { /* skip */ } }

  const perDay = new Map<string, { date: string; spend: number; clicks: number; conversions: number; conversionValue: number }>();
  for (const r of mRows) {
    const e = perDay.get(r.date) ?? { date: r.date, spend: 0, clicks: 0, conversions: 0, conversionValue: 0 };
    e.spend += r.spend; e.clicks += r.clicks; e.conversions += r.conversions; e.conversionValue += r.conversionValue;
    perDay.set(r.date, e);
  }
  const windows = computeWindows([...perDay.values()], [], endYmd, account.grossMarginPercent ?? null);

  const pageAgg = new Map<string, { name: string; spend: number; clicks: number; conversions: number; conversionValue: number }>();
  for (const r of pageRows) {
    const e = pageAgg.get(r.landingPageUrl) ?? { name: cleanProductLabel(r.landingPageUrl), spend: 0, clicks: 0, conversions: 0, conversionValue: 0 };
    e.spend += r.spend; e.clicks += r.clicks; e.conversions += r.conversions; e.conversionValue += r.conversionValue;
    pageAgg.set(r.landingPageUrl, e);
  }
  const pages = [...pageAgg.values()].map(p => ({ ...p, roas: p.spend > 0 ? p.conversionValue / p.spend : null })).sort((a, b) => b.spend - a.spend);

  if (!diag && windows.every(w => w.spend === 0)) {
    return NextResponse.json({ error: "No data ingested yet — hit Refresh data first." }, { status: 400 });
  }

  const context = buildContext(account.name, cur, diag, windows, pages, changeRows);

  try {
    const msg = await client.beta.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      betas: ppc.betas,
      mcp_servers: ppc.mcp_servers,
      tools: ppc.tools,
      system: SYSTEM + PPC_OS_SYSTEM_NOTE + trackingDirective,
      messages: [{ role: "user", content: `${context}\n\nGive the expert read.` }],
    });
    const insight = msg.content.filter(b => b.type === "text").map(b => (b as { text: string }).text).join("\n").trim();
    return NextResponse.json({ insight, generatedAt: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Insight generation failed" }, { status: 502 });
  }
}
