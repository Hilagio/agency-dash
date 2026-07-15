/**
 * POST /api/diagnostics/account/[id]/insight — an expert PPC OS read of ONE
 * account, so the team doesn't have to figure it out themselves.
 *
 * Pressing the button PULLS FRESH DATA first (Google Ads spine + Shopify orders,
 * 90 days) and recomputes signals, then feeds the full multi-window picture
 * (7/14/30/60/90d), issues, winners, landing pages and change events to Claude
 * with the PPC OS knowledge base attached (MCP), and streams a short, direct
 * read: what's happening, the likely why/correlation, and the single next move.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { computeWindows } from "@/lib/diagnostics/windows";
import { cleanProductLabel } from "@/lib/diagnostics/engine";
import { ingestAccountSpine } from "@/lib/diagnostics/ingest";
import { ingestAccountOrders } from "@/lib/diagnostics/orders";
import { computeAccountSignals } from "@/lib/diagnostics/run-signals";
import { ppcOsMcp, PPC_OS_SYSTEM_NOTE } from "@/lib/integrations/ppc-os";
import type { Signal } from "@/lib/diagnostics/signals";

export const dynamic = "force-dynamic";
export const maxDuration = 240;

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
interface Page { name: string; spend: number; clicks: number; conversions: number; roas: number | null }
interface Winner { title: string; spend: number; conv: number; value: number }
const money = (n: number, cur: string) => `${cur}${Math.round(n).toLocaleString("en-GB")}`;

const SYSTEM = `You are a senior Google Ads specialist who works in the PPC OS methodology (Bob Meijer / PPC Mastery). An agency team opens an account and wants your at-a-glance expert read so they don't have to dig through the data themselves.

Give a SHORT, direct read in exactly these three sections, using the actual numbers provided. Format each section header on its own line as bold markdown, with NO numbers, exactly like this:

**The read**
What's actually happening, in 1–2 sentences.

**Likely why**
Connect the dots: correlate a change (budget/negatives, dates) with a metric shift, or name the product/segment dragging or lifting the account. State it as a hypothesis, not certainty.

**Do next**
The single highest-leverage move, specific and concrete.

Analysis rules: Base your read on the FULL multi-window picture (7 / 14 / 30 / 60 / 90 days), NOT just the last 7 days. Establish the trend — improving, declining, or stable — by comparing windows, and cite it ("ROAS 3.1 over 30d but 1.9 over 7d"). Separate a short-term blip from a real shift. Use the longer windows to judge whether a recent number is signal or noise.

Formatting rules: Start immediately with the "**The read**" header — NO preamble line. Do NOT use horizontal rules or dividers. Keep the three bold headers exactly as shown. Plain paragraphs under each header; a short bullet list is fine only under "Do next".

Content rules: be direct, no fluff, no generic advice. Use real numbers. Consult the PPC OS knowledge base (the ppc-os tools) when the reasoning touches methodology. NEVER recommend raising budget when ROAS is below target. If the data is genuinely too thin to be confident, say so in one line rather than guessing.`;

function buildContext(
  name: string, cur: string, diag: DiagMetrics | null,
  windows: Awaited<ReturnType<typeof computeWindows>>,
  pages: Page[], winners: Winner[], changes: { changeType: string; changedAt: Date }[],
): string {
  const L: string[] = [`ACCOUNT: ${name} (currency ${cur})`];

  // Lead with the full multi-window picture — the trend is the story.
  if (windows.some(x => x.spend > 0)) {
    L.push(`\nPerformance across windows (spend / ROAS / POAS${windows.some(w => w.orders != null) ? " / orders" : ""}):`);
    for (const x of windows) {
      L.push(`  ${x.days}d: ${money(x.spend, cur)} / ${x.roas != null ? x.roas.toFixed(2) : "—"} / ${x.poas != null ? x.poas.toFixed(2) : "—"}${x.orders != null ? ` / ${x.orders} orders` : ""}${x.partial ? " (partial history)" : ""}`);
    }
  } else {
    L.push(`\nNo spend recorded in any window (7–90d) — the account is likely paused, or delivery is blocked (billing/policy).`);
  }

  if (diag?.commerce) L.push(`Shopify (recent): ${diag.commerce.orders} orders, ${money(diag.commerce.revenue, cur)} revenue`);
  if (diag?.reconciliation) L.push(`Reconciliation: ${diag.reconciliation.adsConversions.toFixed(1)} Ads conversions vs ${diag.reconciliation.actualOrders} real orders`);
  if (diag?.grossMarginPct) L.push(`Gross margin: ${Math.round(diag.grossMarginPct * 100)}% (break-even ROAS ${(1 / diag.grossMarginPct).toFixed(2)})`);

  const issues = (diag?.signals ?? []).filter(s => s.kind === "problem");
  if (issues.length) { L.push(`\nDetected issues:`); for (const s of issues) L.push(`  - ${s.detail}`); }

  if (winners.length) {
    L.push(`\nTop products by ad revenue (30d — conv / revenue / spend / ROAS):`);
    for (const w of winners.slice(0, 10)) L.push(`  - ${w.title}: ${Math.round(w.conv)} / ${money(w.value, cur)} / ${money(w.spend, cur)} / ${w.spend > 0 ? (w.value / w.spend).toFixed(2) : "—"}`);
  }
  if (pages.length) {
    L.push(`\nLanding-page performance (30d, by spend — spend / clicks / conv / ROAS):`);
    for (const p of pages.slice(0, 12)) L.push(`  - ${p.name}: ${money(p.spend, cur)} / ${p.clicks} / ${Math.round(p.conversions)} / ${p.roas != null ? p.roas.toFixed(2) : "—"}`);
  }
  if (changes.length) {
    const counts = changes.reduce((m, c) => { m[c.changeType] = (m[c.changeType] ?? 0) + 1; return m; }, {} as Record<string, number>);
    L.push(`\nAccount changes (last 30d): ${Object.entries(counts).map(([t, n]) => `${n}× ${t}`).join(", ")}`);
  }
  return L.join("\n");
}

const CUR: Record<string, string> = { EUR: "€", USD: "$", GBP: "£", CZK: "Kč", PLN: "zł" };
const ymd = (daysAgo: number) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - daysAgo); return d.toISOString().slice(0, 10); };

export async function POST(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: {
      id: true, name: true, currency: true, googleAdsId: true, organizationId: true,
      grossMarginPercent: true, roasFloor: true, minSpendForEval: true, minConversionsForEval: true, dataVerified: true,
      trackingStatus: true, trackingNote: true, trackingSetAt: true, trackingSetBy: true,
    },
  });
  if (!account) return forbidden();
  const cur = CUR[account.currency] ?? `${account.currency} `;

  const ppc = ppcOsMcp();
  if (!ppc) return NextResponse.json({ error: "PPC OS is not connected (set PPC_OS_MCP_TOKEN)." }, { status: 400 });

  // Team-confirmed tracking verdict → the read reasons from certainty.
  let trackingDirective = "";
  const who = account.trackingSetBy ? ` by ${account.trackingSetBy}` : "";
  const when = account.trackingSetAt ? ` on ${account.trackingSetAt.toISOString().slice(0, 10)}` : "";
  if (account.trackingStatus === "verified") {
    trackingDirective = `\n\nTEAM-CONFIRMED FACT${who}${when}: Conversion tracking has been verified working end-to-end${account.trackingNote ? ` (${account.trackingNote})` : ""}. Treat every conversion and ROAS figure below as ACCURATE. Do NOT hypothesise a tracking or tag break. If brand or overall CVR is low or 0%, reason about it as a REAL performance / demand / landing-page / competition issue.`;
  } else if (account.trackingStatus === "broken") {
    trackingDirective = `\n\nTEAM-CONFIRMED FACT${who}${when}: Conversion tracking is BROKEN${account.trackingNote ? ` (${account.trackingNote})` : ""}. Every conversion and ROAS figure below is UNRELIABLE and almost certainly understated. The single highest priority is restoring tracking; do NOT draw ROAS/profitability conclusions or recommend bidding/budget changes until it is fixed and clean data re-accrues.`;
  }

  const encoder = new TextEncoder();
  const send = (c: ReadableStreamDefaultController, o: unknown) => c.enqueue(encoder.encode(`data: ${JSON.stringify(o)}\n\n`));

  const stream = new ReadableStream({
    async start(controller) {
      try {
        send(controller, { started: true });

        // 1. Pull the most recent data BEFORE reading it (90-day window).
        send(controller, { status: "refreshing" });
        const spine = await ingestAccountSpine(
          { id: account.id, googleAdsId: account.googleAdsId, organizationId: account.organizationId }, 90,
        ).catch((e) => ({ metrics: 0, productAds: 0, searchTerms: 0, changeEvents: 0, error: e instanceof Error ? e.message : String(e) }));
        await ingestAccountOrders(account.id, 90).catch(() => null);
        await computeAccountSignals({
          id: account.id, name: account.name, roasFloor: account.roasFloor,
          grossMarginPercent: account.grossMarginPercent, minSpendForEval: account.minSpendForEval,
          minConversionsForEval: account.minConversionsForEval, dataVerified: account.dataVerified,
        }).catch(() => null);

        // 2. Gather the full multi-window picture from the freshly-pulled spine.
        send(controller, { status: "reading" });
        const since = ymd(91), win30 = ymd(31), end = ymd(1);
        const [statusRow, mRows, oRows, pageRows, adRows, changeRows] = await Promise.all([
          prisma.accountStatus.findMany({ where: { accountId: id }, orderBy: { computedAt: "desc" }, take: 6 }),
          prisma.metricDaily.findMany({ where: { accountId: id, date: { gte: since } }, select: { date: true, spend: true, clicks: true, conversions: true, conversionValue: true } }),
          prisma.orderDaily.findMany({ where: { accountId: id, date: { gte: since } }, select: { date: true, orders: true, revenue: true } }),
          prisma.metricProductDaily.findMany({ where: { accountId: id, date: { gte: win30, lte: end } }, select: { landingPageUrl: true, spend: true, clicks: true, conversions: true, conversionValue: true } }),
          prisma.productAdsDaily.findMany({ where: { accountId: id, date: { gte: win30, lte: end } }, select: { itemId: true, title: true, spend: true, conversions: true, conversionValue: true } }),
          prisma.changeEvent.findMany({ where: { accountId: id, changedAt: { gte: new Date(win30) } }, select: { changeType: true, changedAt: true } }),
        ]);

        let diag: DiagMetrics | null = null;
        for (const s of statusRow) { try { const m = JSON.parse(s.metrics); if (m?.source === "diagnostics") { diag = m; break; } } catch { /* skip */ } }

        const perDay = new Map<string, { date: string; spend: number; clicks: number; conversions: number; conversionValue: number }>();
        for (const r of mRows) {
          const e = perDay.get(r.date) ?? { date: r.date, spend: 0, clicks: 0, conversions: 0, conversionValue: 0 };
          e.spend += r.spend; e.clicks += r.clicks; e.conversions += r.conversions; e.conversionValue += r.conversionValue;
          perDay.set(r.date, e);
        }
        const windows = computeWindows([...perDay.values()], oRows, end, diag?.grossMarginPct ?? account.grossMarginPercent ?? null);

        const pageAgg = new Map<string, Page & { conversionValue: number }>();
        for (const r of pageRows) {
          const e = pageAgg.get(r.landingPageUrl) ?? { name: cleanProductLabel(r.landingPageUrl), spend: 0, clicks: 0, conversions: 0, conversionValue: 0, roas: null };
          e.spend += r.spend; e.clicks += r.clicks; e.conversions += r.conversions; e.conversionValue += r.conversionValue;
          pageAgg.set(r.landingPageUrl, e);
        }
        const pages = [...pageAgg.values()].map(p => ({ ...p, roas: p.spend > 0 ? p.conversionValue / p.spend : null })).sort((a, b) => b.spend - a.spend);

        const winAgg = new Map<string, Winner>();
        for (const r of adRows) {
          const e = winAgg.get(r.itemId) ?? { title: r.title || r.itemId, spend: 0, conv: 0, value: 0 };
          e.spend += r.spend; e.conv += r.conversions; e.value += r.conversionValue;
          if (!e.title && r.title) e.title = r.title;
          winAgg.set(r.itemId, e);
        }
        const winners = [...winAgg.values()].filter(w => w.value > 0 || w.conv > 0).sort((a, b) => b.value - a.value);

        if (!diag && windows.every(w => w.spend === 0)) {
          send(controller, { error: spine.error ? `Google Ads returned no data: ${spine.error}` : "Google Ads returned no data for this account (paused, or no access?)." });
          controller.close();
          return;
        }

        // 3. Stream the expert read.
        const context = buildContext(account.name, cur, diag, windows, pages, winners, changeRows);
        const anthropicStream = client.beta.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 1024,
          betas: ppc.betas,
          mcp_servers: ppc.mcp_servers,
          tools: ppc.tools,
          system: SYSTEM + PPC_OS_SYSTEM_NOTE + trackingDirective,
          messages: [{ role: "user", content: `${context}\n\nGive the expert read.` }],
        });
        for await (const ev of anthropicStream) {
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") send(controller, { text: ev.delta.text });
        }
        send(controller, { done: true, generatedAt: new Date().toISOString() });
      } catch (err) {
        send(controller, { error: err instanceof Error ? err.message : "Insight generation failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
}
