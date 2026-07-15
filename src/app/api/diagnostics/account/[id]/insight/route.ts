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

Analysis rules: Base your read on the FULL multi-window picture (7 / 14 / 30 / 60 / 90 days), NOT just the last 7 days. Establish the trend — improving, declining, or stable — by comparing windows, and cite it ("ROAS 3.1 over 30d but 1.9 over 7d"). Separate a short-term blip from a real shift. Use the longer windows to judge whether a recent number is signal or noise. If CLIENT EXPECTATIONS are provided, judge performance against THEM (their target ROAS / KPI / margin), not a generic bar.

REASONING PROTOCOL — this is how a senior specialist on our team actually works an account. Reason through it IN THIS ORDER, and PREFER ASKING a sharp question over assuming a cause. Don't dump the whole checklist in the output; use it to decide what to say and, crucially, what to ASK.
1. Conversions & expectation FIRST. Do the conversions make sense — stable, growing, and matching the client's expectation? Be suspicious BOTH ways: a ROAS that looks too HIGH is as much a red flag as one too low (both smell like a tracking problem — double-counting, wrong conversion, or a broken tag). If a number looks too good or too bad to be true, question the tracking before you trust it.
2. Tracking must be confirmed before you trust ANY ROAS/conversion figure. If it hasn't been verified, say the read is provisional and ask the team to confirm tracking fires end-to-end.
3. Spend distribution — where is the money going and what's working? Most ecommerce needs a feed-only Performance Max (Shopping) campaign as the performance backbone; note if it looks absent or starved.
4. Shopping in the EEA → CSS. If they serve Shopping in the EEA and are NOT on a CSS partner (e.g. Producthero), they overpay ~20% on CPCs — flag it and ask whether they're on a CSS.
5. Brand vs non-brand. Are branded searches being paid for inside non-brand campaigns? Flag the bleed. It isn't always an error (feeding branded signal can help the algorithm find the audience), but for an ESTABLISHED brand, not separating brand from generic makes no sense.
6. Trust signals. Look at new-vs-returning, brand performance, and brand search-term quality — e.g. a low conversion rate on "[brand] + reviews" means trust/reputation is the leak, not the ads.
7. Product & search-term waste over LONGER periods. Which products or search terms have quietly burned budget over weeks (not a noisy 7 days)?
8. CRO / the site — this is an ESCALATION, not a routine checkbox. You only reach for it once the IN-ACCOUNT levers above (tracking, spend distribution, brand structure, products, search terms) do NOT explain why the account is falling short. When the ads are clearly doing their job — sending healthy, relevant traffic to the right pages — but it still isn't converting, and nothing in the account accounts for it, the bottleneck is the website. At that point, say so plainly and point the specialist to go check the site (or, if you can infer it from the data, assess it yourself), then name the most likely gains in concrete terms: above-the-fold clarity and value proposition, trust elements (reviews, guarantees, payment/shipping badges), product imagery, price presentation, checkout friction, page speed, mobile layout. Do NOT jump to CRO while an in-account cause is still unexplained.
9. Portfolio comparison. When you're unsure, benchmark this account's conversion rate / assortment against similar accounts to judge whether a number is actually bad.

DATA-PARTNER LENS (we advise on growth, not just Google Ads): when an account is healthy and scaling, the highest-leverage "Do next" may be OFF Google Ads entirely — expanding to Meta/UGC, or fixing retention. In particular, if returning-customer revenue is low, the move is email/retention marketing, not more ad spend. Say so when it fits; don't tunnel-vision on in-account levers.

Formatting rules: Start immediately with the "**The read**" header — NO preamble line. Do NOT use horizontal rules or dividers. Keep the three bold headers exactly as shown. Plain paragraphs under each header; a short bullet list is fine only under "Do next".

OFF-PLATFORM FIRST (critical): If ROAS has COLLAPSED on an account that used to perform — recent windows far below the older ones (a cliff, e.g. 2.8 over 60d → 0.1 over 7–14d) — your FIRST hypothesis must be an OFF-PLATFORM cause, not an in-account one: a broken checkout or payment provider, a site outage, a stock-out on key products, a pricing/currency error, or a tracking break. These kill conversions across the board no matter how good the ads are, and a broad, sudden, sustained collapse is exactly their signature. Say this explicitly and ASK the team to confirm ("Did anything change on the site, payments, checkout, or stock in this window?") BEFORE concluding it's a feed/bidding/product problem. Only pin it on specific products if the decline is concentrated in those products while others hold.

PMAX / SHOPPING SPEND DROP (critical): If SPEND itself has fallen sharply on a Shopping-led or Performance Max account — the campaign can't spend its budget, not just a ROAS dip — your first hypothesis must be a MERCHANT CENTER / FEED cause. When Google can't serve the products, spend collapses on its own. Name the most likely ones and ask the team to check them in Merchant Center: a misrepresentation or policy suspension of the whole account, product disapprovals (e.g. price/availability mismatch, missing GTIN, prohibited content), or a feed that stopped refreshing so items expired. Also flag account-level restrictions (destination/targeted-country limits, review holds). Direct the team to Merchant Center → Products/Diagnostics and the account Notifications. Do NOT tell them to raise budget or change bids to "fix" a spend drop that is really a serving/eligibility problem.

Content rules: be direct, no fluff, no generic advice. Use real numbers. NEVER recommend raising budget when ROAS is below target. If the data is genuinely too thin to be confident, say so in one line rather than guessing.

Tool use: if you consult the PPC OS tools, call them BEFORE writing your read. Output the read only ONCE — do NOT write a draft first, do NOT narrate "let me check the methodology", and do NOT repeat the read. Your reply is the single finished read.`;

const SYSTEM_CHAT = `You are the same senior Google Ads specialist (PPC OS methodology). You already gave the team a first read on this account; the same account data is repeated at the top of the conversation. The team is now feeding you CONTEXT you could not see from the data alone — things like "their payment provider was down 3–10 July", "the vendor is in misrepresentation in Merchant Center", "we paused it on purpose", "tracking was re-implemented last week".

Take that context as ground truth and UPDATE your thinking. Answer conversationally and concretely: confirm or revise your earlier hypothesis in light of what they told you, and give the sharpest next move now that you know more. Do NOT re-print the rigid three-section read unless they ask for a full re-read — reply like a specialist talking to a colleague: a few tight sentences, real numbers, the one thing to do next. If their context resolves the mystery (e.g. payments were down during exactly the collapse window), say so plainly and stop hunting for an in-account cause. You may consult the PPC OS tools if genuinely needed; if you do, call them before replying and answer only once.`;

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

interface ClientCtx {
  goal?: string | null; mainKpi?: string | null; targetRoasNote?: string | null;
  strategyPreference?: string | null; usps?: string | null; audienceNuances?: string | null;
  makeOrBreak?: string | null; anythingElse?: string | null; adsStartedNote?: string | null;
  netMarginPct?: number | null; breakEvenRoas?: number | null;
}

/** The client's own expectations & context — so the read judges "does this match
 * what they want" instead of guessing at a target. Empty string if nothing set. */
function buildClientBlock(c: ClientCtx | null): string {
  if (!c) return "";
  const L: string[] = [];
  if (c.goal) L.push(`  Goal: ${c.goal}`);
  if (c.mainKpi) L.push(`  Main KPI: ${c.mainKpi}`);
  if (c.targetRoasNote) L.push(`  Target ROAS: ${c.targetRoasNote}`);
  if (c.breakEvenRoas) L.push(`  Break-even ROAS: ${c.breakEvenRoas.toFixed(2)}`);
  if (c.netMarginPct) L.push(`  Net margin: ${Math.round(c.netMarginPct * 100)}%`);
  if (c.strategyPreference) L.push(`  Strategy preference: ${c.strategyPreference}`);
  if (c.makeOrBreak) L.push(`  Make-or-break: ${c.makeOrBreak}`);
  if (c.usps) L.push(`  USPs: ${c.usps}`);
  if (c.audienceNuances) L.push(`  Audience nuances: ${c.audienceNuances}`);
  if (c.adsStartedNote) L.push(`  Ads history: ${c.adsStartedNote}`);
  if (c.anythingElse) L.push(`  Constraints/notes: ${c.anythingElse}`);
  return L.length ? `CLIENT EXPECTATIONS & CONTEXT (judge performance against THIS, not a generic target):\n${L.join("\n")}\n\n` : "";
}

const CUR: Record<string, string> = { EUR: "€", USD: "$", GBP: "£", CZK: "Kč", PLN: "zł" };
const ymd = (daysAgo: number) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - daysAgo); return d.toISOString().slice(0, 10); };

type Turn = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  // Conversational follow-up: the team feeds context ("payments were down",
  // "vendor in misrep") and we re-reason WITHOUT re-pulling Google Ads.
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const followup = typeof body?.followup === "string" ? body.followup.trim() : "";
  const thread: Turn[] = Array.isArray(body?.thread)
    ? (body.thread as unknown[])
        .filter((t): t is Turn => !!t && typeof t === "object"
          && ((t as Turn).role === "user" || (t as Turn).role === "assistant")
          && typeof (t as Turn).content === "string" && (t as Turn).content.length > 0)
        .slice(-8)
    : [];
  const isChat = followup.length > 0 && thread.length > 0;

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

        // 1. Pull the most recent data BEFORE reading it (90-day window). Skipped
        // on a conversational follow-up — the data is already fresh from the read.
        let spine: { error?: string } = {};
        if (!isChat) {
          send(controller, { status: "refreshing" });
          spine = await ingestAccountSpine(
            { id: account.id, googleAdsId: account.googleAdsId, organizationId: account.organizationId }, 90,
          ).catch((e) => ({ metrics: 0, productAds: 0, searchTerms: 0, changeEvents: 0, error: e instanceof Error ? e.message : String(e) }));
          await ingestAccountOrders(account.id, 90).catch(() => null);
          await computeAccountSignals({
            id: account.id, name: account.name, roasFloor: account.roasFloor,
            grossMarginPercent: account.grossMarginPercent, minSpendForEval: account.minSpendForEval,
            minConversionsForEval: account.minConversionsForEval, dataVerified: account.dataVerified,
          }).catch(() => null);
        }

        // 2. Gather the full multi-window picture from the spine.
        send(controller, { status: isChat ? "thinking" : "reading" });
        const since = ymd(91), win30 = ymd(31), end = ymd(1);
        const [statusRow, mRows, oRows, pageRows, adRows, changeRows, clientCtx] = await Promise.all([
          prisma.accountStatus.findMany({ where: { accountId: id }, orderBy: { computedAt: "desc" }, take: 6 }),
          prisma.metricDaily.findMany({ where: { accountId: id, date: { gte: since } }, select: { date: true, spend: true, clicks: true, conversions: true, conversionValue: true } }),
          prisma.orderDaily.findMany({ where: { accountId: id, date: { gte: since } }, select: { date: true, orders: true, revenue: true } }),
          prisma.metricProductDaily.findMany({ where: { accountId: id, date: { gte: win30, lte: end } }, select: { landingPageUrl: true, spend: true, clicks: true, conversions: true, conversionValue: true } }),
          prisma.productAdsDaily.findMany({ where: { accountId: id, date: { gte: win30, lte: end } }, select: { itemId: true, title: true, spend: true, conversions: true, conversionValue: true } }),
          prisma.changeEvent.findMany({ where: { accountId: id, changedAt: { gte: new Date(win30) } }, select: { changeType: true, changedAt: true } }),
          prisma.clientContext.findUnique({ where: { accountId: id } }).catch(() => null),
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

        if (!isChat && !diag && windows.every(w => w.spend === 0)) {
          send(controller, { error: spine.error ? `Google Ads returned no data: ${spine.error}` : "Google Ads returned no data for this account (paused, or no access?)." });
          controller.close();
          return;
        }

        // 3. Stream the expert read — or, on a follow-up, continue the thread with
        // the team's added context on top of the same account data.
        const context = buildClientBlock(clientCtx) + buildContext(account.name, cur, diag, windows, pages, winners, changeRows);
        const messages = isChat
          ? [
              { role: "user" as const, content: `${context}\n\nGive the expert read.` },
              ...thread,
              { role: "user" as const, content: followup },
            ]
          : [{ role: "user" as const, content: `${context}\n\nGive the expert read.` }];
        const anthropicStream = client.beta.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 1024,
          betas: ppc.betas,
          mcp_servers: ppc.mcp_servers,
          tools: ppc.tools,
          system: (isChat ? SYSTEM_CHAT : SYSTEM) + PPC_OS_SYSTEM_NOTE + trackingDirective,
          messages,
        });
        // With MCP tool use the model can emit a draft text block, call a tool,
        // then emit the FINAL read as a second text block — which showed up as a
        // duplicated read. Keep only the last text block: on every text block
        // after the first, tell the client to reset what it has rendered so far.
        let textBlocks = 0;
        for await (const ev of anthropicStream) {
          if (ev.type === "content_block_start" && ev.content_block?.type === "text") {
            textBlocks++;
            if (textBlocks > 1) send(controller, { reset: true });
          } else if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
            send(controller, { text: ev.delta.text });
          }
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
