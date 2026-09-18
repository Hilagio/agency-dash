/**
 * POST /api/diagnostics/account/[id]/deep-analysis — a Cowork-grade client
 * update: the model RESEARCHES THE LIVE WEB (the client's own product pages,
 * competitor pricing & promo codes, Trustpilot/review profiles, marketplace
 * listings carrying the brand name) with server-side web_search + web_fetch,
 * connects what the shopper sees to the campaign-level numbers, and writes the
 * "Account Performance & Plan Forward" document in the house style.
 *
 * Streamed as SSE — the research alone runs minutes, and JSON responses of
 * that length 502 the gateway. Events: {status, detail?}, {error}, {done,...}.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { computeWindows } from "@/lib/diagnostics/windows";
import { runAgentTool } from "@/lib/diagnostics/agent-tools";
import { renderDocHtml } from "@/lib/doc/render";
import type { DocContent, DocLanguage } from "@/lib/doc/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

type Params = { params: Promise<{ id: string }> };
const CUR: Record<string, string> = { EUR: "€", USD: "$", GBP: "£", CZK: "Kč", PLN: "zł" };
const money = (n: number, cur: string) => `${cur}${Math.round(n).toLocaleString("en-GB")}`;
const ymd = (daysAgo: number) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - daysAgo); return d.toISOString().slice(0, 10); };

const client = new Anthropic();

const DEEP_SYSTEM = `You are a senior Google Ads strategist at Ecomtrada, a Dutch ecommerce PPC agency, writing a client update titled along the lines of "Account Performance & Plan Forward". You have live web research tools — USE THEM before writing a word. The bar: a reader should learn things about their own market they did not know, each one verifiable because you name what you checked and when.

RESEARCH FIRST (aim for 8-14 tool calls, largest questions first):
1. The client's own product/landing pages: real prices, promotions, shipping terms, stock status ("sold out" on a variant suppresses Merchant Center delivery — always worth flagging), on-site review widget claims.
2. Their independent review profile (Trustpilot etc.) — rating, volume, one-star share, THEMES of negative reviews, how fast the brand replies. Compare against what the on-site widget claims.
3. The main competitor(s): price, live promo codes, shipping, review profile, durability/guarantee claims — build the side-by-side a shopper actually sees.
4. Marketplace listings carrying the client's brand name (Google Shopping, Walmart, Amazon, bol.com): resellers or counterfeits undercutting the DTC price inside the client's own Shopping comparison.
Skip whatever the market makes irrelevant; add what it demands (B2B: comparison sites; lead-gen: local reviews).

THEN DIAGNOSE — connect the outside view to the account numbers provided:
- One causal story, findings ranked LARGEST FIRST. "Blended ROAS is falling because we lose the comparison at the point of sale" beats ten disconnected observations.
- The two-numbers frame when margin data exists: break-even ROAS (below it, spend is a loss) and the scaling floor (~2x margin logic or the stated target): cut below break-even, hold between, add above. Explain that a target ROAS is an average the campaign aims at, not a floor under each sale.
- Campaign-by-campaign table: every live campaign, its ROAS vs the two numbers, the action and budget direction. Mix-shift math when a sub-breakeven campaign carries a large spend share.
- A "What we are NOT doing" section: the tempting moves you recommend against, each with the reason.
- A dated plan: concrete calendar dates from today, owner per row (Ecomtrada / Client / Together), checkpoints with what gets read at each and what happens on each outcome.
- What sits OUTSIDE the ad account (reviews, price position, counterfeit listings) decides whether the account recovers or merely stabilises — say so and give those rows owners too.

HONESTY RULES: every external claim carries what you checked and the check date. If a page could not be reached or a number could not be verified, say exactly that — NEVER fill the gap with an invented figure, price, or rating. Ads conversions are a SUBSET of total shop orders: a low paid share is channel mix, never a tracking fault, and never becomes a finding. Ground every account number in the data block only.

Write in the requested language, in Ecomtrada's direct, confident voice. After your research is complete, return ONLY a JSON object (no prose before or after, no code fences):
{"docType":"Account Performance & Plan Forward","title":"a human headline naming the real story","subtitle":"scope · period · check date","sections":[{"heading":"","lead":"opening paragraph, **bold** key phrases","paras":["further prose paragraphs"],"bullets":[""],"stats":[{"key":"","value":"","sub":"","tone":"good|bad|grad|neutral"}],"table":{"columns":[""],"rows":[[""]]},"callout":"one highlighted takeaway"}]}
Use 6-12 sections in the arc: what is happening (findings largest first) → the two numbers → why the account is under pressure → what the shopper sees when they compare (the research) → campaign by campaign (table) → what we are not doing → the plan with dates (table: Date/Step/Owner) → what we need from you. Prose carries the argument; tables carry comparisons and the plan. Every section field is optional except heading.`;

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: { id: true, name: true, clientName: true, currency: true, grossMarginPercent: true, targetRoas: true, businessModel: true, country: true, landingPageUrl: true, googleAdsId: true, merchantCenterId: true, organizationId: true },
  });
  if (!account) return forbidden();

  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const language: DocLanguage = body?.language === "nl" ? "nl" : "en";
  const focus = typeof body?.request === "string" ? body.request.trim() : "";
  const cur = CUR[account.currency] ?? `${account.currency} `;

  const since = ymd(91), end = ymd(1);
  const [msgs, mRows, oRows, clientCtx] = await Promise.all([
    prisma.agentMessage.findMany({ where: { accountId: id }, orderBy: { createdAt: "desc" }, take: 16, select: { role: true, content: true } }).then(r => r.reverse()),
    prisma.metricDaily.findMany({ where: { accountId: id, date: { gte: since } }, select: { date: true, campaignName: true, spend: true, clicks: true, conversions: true, conversionValue: true } }),
    prisma.orderDaily.findMany({ where: { accountId: id, date: { gte: since } }, select: { date: true, orders: true, revenue: true } }),
    prisma.clientContext.findUnique({ where: { accountId: id } }).catch(() => null),
  ]);

  // Account-wide windows + per-campaign 30d table (the campaign-level view is
  // what lets the model do mix-shift math and per-campaign actions).
  const perDay = new Map<string, { date: string; spend: number; clicks: number; conversions: number; conversionValue: number }>();
  for (const r of mRows) {
    const e = perDay.get(r.date) ?? { date: r.date, spend: 0, clicks: 0, conversions: 0, conversionValue: 0 };
    e.spend += r.spend; e.clicks += r.clicks; e.conversions += r.conversions; e.conversionValue += r.conversionValue;
    perDay.set(r.date, e);
  }
  const marginPct = clientCtx?.netMarginPct ?? account.grossMarginPercent ?? null;
  const windows = computeWindows([...perDay.values()], oRows, end, marginPct);
  const breakEven = clientCtx?.breakEvenRoas ?? (marginPct && marginPct > 0 ? 1 / marginPct : null);

  const cutoff30 = ymd(31);
  const byCampaign = new Map<string, { spend: number; clicks: number; conv: number; value: number }>();
  let spend30 = 0;
  for (const r of mRows) {
    if (r.date < cutoff30) continue;
    const e = byCampaign.get(r.campaignName) ?? { spend: 0, clicks: 0, conv: 0, value: 0 };
    e.spend += r.spend; e.clicks += r.clicks; e.conv += r.conversions; e.value += r.conversionValue;
    byCampaign.set(r.campaignName, e); spend30 += r.spend;
  }
  const campaigns = [...byCampaign.entries()].filter(([, c]) => c.spend > 0)
    .sort((a, b) => b[1].spend - a[1].spend).slice(0, 14);

  const orders30 = oRows.filter(o => o.date >= cutoff30).reduce((s, o) => s + o.orders, 0);
  const rev30 = oRows.filter(o => o.date >= cutoff30).reduce((s, o) => s + o.revenue, 0);

  const L: string[] = [`CLIENT: ${account.clientName || account.name} — ${account.businessModel ?? "ecommerce"}, market ${account.country ?? "—"}, currency ${account.currency}`];
  if (account.landingPageUrl) L.push(`Shop / landing page (START YOUR RESEARCH HERE): ${account.landingPageUrl}`);
  if (account.targetRoas) L.push(`Target ROAS: ${account.targetRoas.toFixed(2)}`);
  if (breakEven) L.push(`Break-even ROAS: ${breakEven.toFixed(2)}${marginPct ? ` (margin ${Math.round(marginPct * 100)}%)` : ""}`);
  L.push(`Windows (spend / ROAS / POAS): ${windows.map(w => `${w.days}d ${money(w.spend, cur)} / ${w.roas != null ? w.roas.toFixed(2) : "—"} / ${w.poas != null ? w.poas.toFixed(2) : "—"}`).join(" · ")}`);
  if (orders30 > 0) {
    const conv30 = windows.find(w => w.days === 30)?.conversions ?? 0;
    L.push(`Shop total (30d): ${orders30} orders, ${money(rev30, cur)} revenue. Google Ads attributed ${conv30.toFixed(0)} of those orders (~${Math.round((conv30 / orders30) * 100)}% paid share — normal channel mix, NOT a tracking fault).`);
  }
  if (campaigns.length) {
    L.push(`\nPer campaign (30d) — name: spend · share of spend · conv · conv value · ROAS:`);
    for (const [name, c] of campaigns) L.push(`  - ${name}: ${money(c.spend, cur)} · ${spend30 > 0 ? Math.round((c.spend / spend30) * 100) : 0}% · ${c.conv.toFixed(0)} · ${money(c.value, cur)} · ${c.spend > 0 ? (c.value / c.spend).toFixed(2) : "—"}`);
  }

  // Live pulls straight from Google Ads — impression share (lost to rank vs
  // budget is THE auction diagnostic), campaign structure, and search terms.
  // Best-effort: a failed pull is named as absent, never invented.
  if (account.googleAdsId) {
    const toolAcc = { id: account.id, googleAdsId: account.googleAdsId, organizationId: account.organizationId, currency: account.currency, merchantCenterId: account.merchantCenterId };
    const pulls = await Promise.allSettled([
      runAgentTool("get_impression_share", {}, toolAcc),
      runAgentTool("get_campaign_overview", {}, toolAcc),
      runAgentTool("get_search_terms", {}, toolAcc),
    ]);
    const labels = ["IMPRESSION SHARE (lost to rank vs lost to budget — the auction diagnostic)", "CAMPAIGN STRUCTURE (live)", "SEARCH TERMS (live)"];
    pulls.forEach((p, i) => {
      if (p.status === "fulfilled" && p.value && !/^error/i.test(p.value)) L.push(`\n${labels[i]}:\n${p.value.slice(0, 5000)}`);
      else L.push(`\n${labels[i]}: could not be pulled — treat as unknown, name it as a follow-up check where relevant.`);
    });
  } else if (campaigns.length) {
    L.push(`(Impression-share and auction data are NOT available for this account — do not invent them; name them as a follow-up check where relevant.)`);
  }
  const cc = clientCtx;
  if (cc?.goal) L.push(`\nClient goal: ${cc.goal}`);
  if (cc?.mainKpi) L.push(`Main KPI: ${cc.mainKpi}`);
  if (cc?.makeOrBreak) L.push(`Make-or-break: ${cc.makeOrBreak}`);
  if (cc?.usps) L.push(`USPs: ${cc.usps}`);
  if (cc?.otherChannels) L.push(`Other paid channels: ${cc.otherChannels}`);
  if (cc?.anythingElse) L.push(`Constraints/context: ${cc.anythingElse}`);
  if (msgs.length) { L.push(`\n--- Team conversation (recent) ---`); for (const m of msgs) L.push(`${m.role === "assistant" ? "Analyst" : "Team"}: ${m.content.slice(0, 1500)}`); }

  const userMsg = `LANGUAGE: ${language === "nl" ? "Dutch (nl)" : "English (en)"}
TODAY: ${new Date().toISOString().slice(0, 10)}
${focus ? `SPECIFIC FOCUS FROM THE TEAM (address this): ${focus}\n` : ""}
--- ACCOUNT DATA (the only source for account numbers) ---
${L.join("\n")}

Research the live web first, then write the client update. Return only the JSON object.`;

  const encoder = new TextEncoder();
  const send = (c: ReadableStreamDefaultController, o: unknown) => c.enqueue(encoder.encode(`data: ${JSON.stringify(o)}\n\n`));

  const stream = new ReadableStream({
    async start(controller) {
      try {
        send(controller, { status: "start" });
        const tools: Anthropic.Messages.ToolUnion[] = [
          { type: "web_search_20260209", name: "web_search", max_uses: 14 },
          { type: "web_fetch_20260209", name: "web_fetch", max_uses: 14, max_content_tokens: 25_000 },
        ];
        const messages: Anthropic.MessageParam[] = [{ role: "user", content: userMsg }];
        let msg: Anthropic.Message | null = null;
        let researchSteps = 0;

        // Server tools can pause long turns (stop_reason "pause_turn") — resume
        // by appending the partial assistant turn and continuing.
        for (let round = 0; round < 8; round++) {
          const s = client.messages.stream({
            model: "claude-opus-4-8",
            max_tokens: 24_000,
            thinking: { type: "adaptive" },
            system: DEEP_SYSTEM,
            tools,
            messages,
          });
          let chars = 0, ticks = 0;
          for await (const ev of s) {
            if (ev.type === "content_block_start") {
              const b = ev.content_block;
              if (b.type === "server_tool_use") { researchSteps += 1; send(controller, { status: "research", step: researchSteps, tool: b.name }); }
            }
            if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
              chars += ev.delta.text.length;
              if (++ticks % 20 === 0) send(controller, { status: "writing", chars }); // keep-alive
            }
          }
          msg = await s.finalMessage();
          if (msg.stop_reason !== "pause_turn") break;
          messages.push({ role: "assistant", content: msg.content });
          send(controller, { status: "continuing" });
        }
        if (!msg) { send(controller, { error: "The analysis never produced a response — try again." }); controller.close(); return; }

        const text = msg.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map(b => b.text).join("");
        const a = text.indexOf("{"), b = text.lastIndexOf("}");
        let parsed: Partial<DocContent> | null = null;
        if (a >= 0 && b > a) { try { parsed = JSON.parse(text.slice(a, b + 1)) as Partial<DocContent>; } catch { parsed = null; } }
        if (!parsed || !Array.isArray(parsed.sections) || parsed.sections.length === 0) {
          send(controller, { error: msg.stop_reason === "max_tokens" ? "The analysis ran past the output limit — try again." : "The model returned an unreadable document — try again." });
          controller.close(); return;
        }

        const doc: DocContent = {
          language, format: "doc",
          client: account.clientName || account.name,
          docType: parsed.docType || "Account Performance & Plan Forward",
          title: parsed.title || `${account.clientName || account.name} — Account Performance & Plan Forward`,
          subtitle: parsed.subtitle,
          sections: parsed.sections,
        };
        const html = renderDocHtml(doc);
        const safe = (account.clientName || account.name).replace(/[^a-z0-9]+/gi, "-").toLowerCase();
        const filename = `${safe}-deep-analysis.html`;
        const saved = await prisma.generatedDoc.create({
          data: { accountId: id, title: doc.title, docType: doc.docType, format: "doc", language, filename, html, createdBy: ctx.email },
          select: { id: true, title: true, docType: true, format: true, language: true, filename: true, createdBy: true, createdAt: true },
        }).catch(() => null);
        send(controller, { done: true, html, filename, title: doc.title, docType: doc.docType, saved, researchSteps });
      } catch (err) {
        send(controller, { error: err instanceof Error ? err.message : "Deep analysis failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" },
  });
}
