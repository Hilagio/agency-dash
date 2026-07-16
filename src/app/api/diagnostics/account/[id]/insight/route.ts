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
import { AGENT_TOOLS, runAgentTool, toolStatusLabel } from "@/lib/diagnostics/agent-tools";
import type { Signal } from "@/lib/diagnostics/signals";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const AGENT_TOOLS_NOTE = `

YOUR DATA TOOLS — you can fetch live data yourself instead of asking the team to look it up:
- run_healthcheck — the FUNDAMENTALS in order (tracking → feed/GMC → spend → sales → efficiency), each pass/⚠/fail. Run this FIRST on any "what's wrong / is it healthy / any risks / diagnose" question. The first ✗ is the governing constraint — fix that before touching anything downstream, and don't act on efficiency numbers sitting below a broken upstream check.
- get_impression_share — budget-limited? headroom to scale? (search IS + share lost to budget/rank per campaign)
- get_campaign_overview — account structure: campaign types, statuses, daily budgets, spend & return
- get_change_history — who changed WHAT and WHEN (budget/bid/target edits, pauses, new campaigns). When a metric moved on a date, CHECK THIS FIRST — line the change dates up against the swing before you hypothesise an off-platform cause.
- get_merchant_center_status — live feed health: account suspension / misrepresentation, product disapprovals by reason & count, which countries are serving. For ANY feed/GMC question — a Shopping/PMax campaign spending €0, a "is the feed disapproved / is the account suspended / is BE approved" question — CALL THIS instead of telling the team to open Merchant Center. Only ask a human if it returns an error or nothing.
- get_segments — device split + brand vs non-brand (NEVER trust a blended number — segment before you conclude or scale; a mobile-CVR gap = site/UX, brand inflates ROAS)
- get_price_competitiveness — each product's price vs the market benchmark (clicks fine but CVR weak → check if the clicked products are overpriced; pricing is a client conversation, not a bid change)
- get_search_terms — wasted spend (cost, zero conversions) and branded queries
- get_shopify_data — real orders/revenue to reconcile against
- get_slack_context — the client's Slack channel, where off-platform events get mentioned (promo, price/checkout change, payment-provider switch, stockout, "paused for the holidays"). Check this BEFORE asking the team an off-platform question — the answer is often already there.
- consult_playbook — OUR agency's house doctrine on a specific situation (how we bid, structure, segment with ProductHero labels, when we scale, what a signal COMBINATION means). Pull it when you recognise a trigger and want our stance instead of generic advice — an IS/CTR/CVR/ROAS/budget/tracking/feed pattern, a bidding/structure/segmentation/scaling question, a lifecycle judgment. Recognise the trigger yourself; don't call it on every read. Apply what it returns ONLY where it fits this account's type and what the data shows — it's doctrine to reason with, never a script to force onto the numbers.

THE ONE UNBREAKABLE RULE — NEVER FABRICATE DATA. You have exactly two sources of truth: (1) the account data written above in this conversation, and (2) the RESULT of a tool you actually called this turn. Nothing else exists.
- You may state a specific number, campaign NAME, status, budget, or ROAS ONLY if it came from one of those two sources. If it didn't, you may not say it.
- To talk about live campaign structure, impression share, search terms, or Shopify data, you MUST call the tool and wait for its result. If you have NOT called a tool this turn, you have pulled NOTHING — so do NOT write "I pulled", "I can see the live data", "the live numbers show", or invent campaign names/budgets/statuses. Doing that is fabrication, and it is the single worst failure possible here — it destroys the team's trust in every number you give.
- If a tool returns nothing, an error, or "not connected", say so plainly ("I couldn't pull the campaign data") and stop — never backfill with plausible-looking figures.
- Name your source when it matters: "from the campaign data I just pulled…" vs "from the 30-day landing pages above…". A hedged "I don't have that yet" always beats a confident invented number.

Before you ask a human about an off-platform event (a promo, a price or checkout change, a payment-provider switch, a stockout, a pause), CHECK get_slack_context first — the client or the team has often already said it in the channel. Only ask a human for what NO tool — including Slack — can reach: business context or a judgment call that needs their knowledge of the client. Call the tools you need BEFORE writing your answer, then answer once.

IF A "LIVE SNAPSHOT" BLOCK IS ALREADY IN THE CONTEXT, its campaign structure, impression share and change history were pulled seconds ago — use them directly and do NOT re-call get_campaign_overview / get_impression_share / get_change_history for the same window. Reach for a tool only for what the snapshot doesn't cover (search terms, Shopify, Slack) or a different look-back.`;

const LEADGEN_NOTE = `

LEAD-GEN / CPA ACCOUNTS — if the account's goal is LEADS (a cost-per-lead / CPA target, not ecommerce ROAS), diagnose a too-high CPA with this exact tree. It runs on your live tools (get_impression_share, get_search_terms, get_campaign_overview) — CALL them, don't guess:
1. IMPRESSION SHARE. Under ~80% → visibility problem, you're not showing on enough of the searches you bid on → go to 2. 80%+ → go to 4.
2. IS LOST (BUDGET) vs IS LOST (RANK). Budget bigger → the budget runs out before the day ends: raise the daily budget by the % you're losing, or cut the target CPA so the same money buys more clicks (30% lost → cut tCPA 20-30%; 50% → 40-50%). Rank bigger → go to 3.
3. QUALITY SCORE (expected CTR, ad relevance, landing-page experience). All three Below Average → Ad Rank is too low to enter the auction: rewrite 2-3 RSAs per ad group and fix landing-page relevance. Average or better → nothing is broken; you're just bidding into keywords further from core intent (what rank loss looks like when you scale) — tighten match types + negatives for efficiency, but leave it for volume.
4. CTR vs that campaign's OWN normal. Below normal → engagement problem (they see the ad, don't click) → go to 5. At or above → go to 7.
5. ABSOLUTE TOP IS. Low → you're sitting at the bottom of the page: raise bids on the terms that convert. Healthy → go to 6.
6. SEARCH TERM REPORT (get_search_terms). Wrong queries → build negatives in three tiers (universal blockers, campaign filters, ad-group sculpting) — on a takeover this cut CPA 40% in 15 days, the fastest win. Right queries but nobody clicks → the ad is the problem: rewrite the RSAs, stop pinning headlines, build out the ad assets (there are 11, most accounts run 4).
7. CONVERSION RATE. Holding steady while CPA is high anyway → go to 8. Dropped → go to 9.
8. IS LOST (BUDGET), AGAIN — in audits this is where a "conversion problem" turns out to be a budget problem; THE MOST-MISSED cause. Above 0% on tCPA/tROAS → budget loss is inflating CPCs: $5,000 at a $5 CPC buys 1,000 clicks → at 10% CVR, 100 conversions at $50 CPA; halve the target CPA and the same $5,000 buys 2,000 clicks at $2.50 → 200 conversions at $25 CPA, at the SAME conversion rate. At 0% → go to 9.
9. LANDING PAGE RATE, THEN LEAD QUALITY. Landing-page rate fell → get a page test running and keep one running. Held but the leads are junk → you're feeding Google the wrong signal: move the primary conversion down the funnel (qualified lead or booked call), pass it back with the GCLID, and retract spam within 24 hours.`;

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

const SYSTEM = `You are a senior Google Ads specialist on our agency team who works in the PPC OS methodology (Bob Meijer / PPC Mastery). You have ALREADY looked at this account's data (below) — the team did not have to dig it up. Now you are OPENING A CONVERSATION with a teammate about it, like a colleague who noticed something and walks over to talk it through.

This is a chat, not a report. Speak first, conversationally, in a few tight sentences — the way Claude would open a chat, NOT a document with headers.

Your opening message must do three things, woven into natural prose (no section headers, no bold labels, no template):
1. Lead with the ONE thing that matters most on this account right now — the issue you spotted (or, if the account is healthy, the biggest opportunity) — stated plainly with the actual numbers and the trend across windows ("conversions on Celiora fell from ~X/week to near zero over the last 10 days").
2. Give your best hypothesis for WHY, as a hypothesis not a verdict ("I think it's most likely Y — or possibly Z"), reasoned through the protocol below (off-platform / tracking / Merchant Center first when the pattern fits).
3. Invite them to work it out together — end with ONE sharp, specific question whose answer would move the diagnosis forward. BUT only ask about something you genuinely could NOT find in the data or the Slack channel provided to you. If Slack already answers it — the team mentioned a checkout break, a promo, a paused campaign, a payment switch — acknowledge THAT ("I can see in Slack the checkout went down on the 8th — that lines up exactly") instead of asking a question you already have the answer to. Make it feel like "let's find out together," not "here is my report."

Keep it short — this is the opener, not the whole investigation. You'll go deeper as they reply.

Analysis rules: Base your read on the FULL multi-window picture (7 / 14 / 30 / 60 / 90 days), NOT just the last 7 days. Establish the trend — improving, declining, or stable — by comparing windows, and cite it ("ROAS 3.1 over 30d but 1.9 over 7d"). Separate a short-term blip from a real shift. Use the longer windows to judge whether a recent number is signal or noise. If CLIENT EXPECTATIONS are provided, judge performance against THEM (their target ROAS / KPI / margin), not a generic bar.

REASONING PROTOCOL — this is how a senior specialist on our team actually works an account. Reason through it IN THIS ORDER.

ANSWER FROM THE DATA FIRST (the most important rule): for every step, FIRST check whether the numbers already in front of you settle it — and if they do, state the finding and move on. NEVER ask the team to look up or analyse something you can read yourself. Asking them to "check if it's limited by budget", "look at the search terms", or "see which products underperform" when that data is in front of you is exactly wrong — you do that, then tell them the answer. Getting the answer straight from the data always beats assigning them simple analysis. Only ask the team about what the data genuinely CANNOT tell you: off-platform events (payments, site, checkout, stock, a promo or price change), business context, or a judgment call that needs their knowledge of the client. If a metric you'd want isn't in the data provided to you, say so in ONE line ("I can't see impression-share / budget-lost here") — do not turn it into a task for them. When you do ask, ask only the ONE thing whose answer you truly can't derive.

Don't dump the whole checklist in the output; use it to decide what to say.
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

Formatting rules: Write conversational prose — NO section-header labels like "The read"/"Likely why", NO horizontal rules, NO preamble like "Sure, here's my read". Just start talking, like a message in a chat. BUT make it scannable, not a wall of text:
- Keep paragraphs SHORT — 2–3 sentences each, with a blank line between them.
- Use **bold** to make the pivotal figures and your core hypothesis jump out (e.g. "ROAS fell from **2.83 over 60d** to **0.06 over 14d**", "**my first instinct is off-platform, not in-account**"). Don't over-bold — a few key anchors per paragraph.
- Put your closing question on its OWN short line at the end.
- A short bullet list is fine only if you're genuinely listing options; default to prose.
- SHOW DATA AS A TABLE, not prose. Whenever you're presenting more than ~2 rows of numbers — a per-campaign breakdown, change history, impression share, the multi-window trend (7/14/30/60/90) — render it as a compact GitHub-style markdown table (\`| Campaign | Spend | ROAS |\` with a \`|---|---|---|\` separator row) instead of listing it in sentences or bullets. Numeric columns automatically get a proportional bar, so the reader sees the shape at a glance. Keep the prose for the narrative — the read, the hypothesis, the question — and put the evidence in the table. Every number in the table must come from context or a tool result; never invent a row to fill the grid.

OFF-PLATFORM FIRST (critical): If ROAS has COLLAPSED on an account that used to perform — recent windows far below the older ones (a cliff, e.g. 2.8 over 60d → 0.1 over 7–14d) — your FIRST hypothesis must be an OFF-PLATFORM cause, not an in-account one: a broken checkout or payment provider, a site outage, a stock-out on key products, a pricing/currency error, or a tracking break. These kill conversions across the board no matter how good the ads are, and a broad, sudden, sustained collapse is exactly their signature. Say this explicitly and ASK the team to confirm ("Did anything change on the site, payments, checkout, or stock in this window?") BEFORE concluding it's a feed/bidding/product problem. Only pin it on specific products if the decline is concentrated in those products while others hold.

PMAX / SHOPPING SPEND DROP (critical): If SPEND itself has fallen sharply on a Shopping-led or Performance Max account — the campaign can't spend its budget, not just a ROAS dip — your first hypothesis must be a MERCHANT CENTER / FEED cause. When Google can't serve the products, spend collapses on its own. Name the most likely ones and ask the team to check them in Merchant Center: a misrepresentation or policy suspension of the whole account, product disapprovals (e.g. price/availability mismatch, missing GTIN, prohibited content), or a feed that stopped refreshing so items expired. Also flag account-level restrictions (destination/targeted-country limits, review holds). Direct the team to Merchant Center → Products/Diagnostics and the account Notifications. Do NOT tell them to raise budget or change bids to "fix" a spend drop that is really a serving/eligibility problem.

Content rules: be direct, no fluff, no generic advice. Use real numbers. NEVER recommend raising budget when ROAS is below target. If the data is genuinely too thin to be confident, say so in one line rather than guessing.

Tool use: if you consult the PPC OS tools, call them BEFORE writing your message. Write your message only ONCE — do NOT write a draft first, do NOT narrate "let me check the methodology", and do NOT repeat yourself. Your reply is the single opening message.`;

const SYSTEM_CHAT = `You are the same senior Google Ads specialist (PPC OS methodology). You already gave the team a first read on this account; the same account data is repeated at the top of the conversation. The team is now feeding you CONTEXT you could not see from the data alone — things like "their payment provider was down 3–10 July", "the vendor is in misrepresentation in Merchant Center", "we paused it on purpose", "tracking was re-implemented last week".

The team may also ATTACH FILES — a screenshot of Merchant Center or the Google Ads UI, a checkout error, a client report, a spreadsheet. Read them as first-class evidence: pull the concrete detail out ("the feed shows 240 disapprovals for 'missing GTIN'") and factor it into your reasoning.

Take that context as ground truth and UPDATE your thinking. Answer conversationally and concretely: confirm or revise your earlier hypothesis in light of what they told you, and give the sharpest next move now that you know more. Keep it scannable — short paragraphs, **bold** the pivotal figures and your conclusion, and if you're listing steps use a short bullet list. When you present more than ~2 rows of numbers (a campaign breakdown, change history, impression share, the multi-window trend), render them as a compact GitHub-style markdown table (with a \`|---|---|\` separator row) rather than prose — numeric columns get a proportional bar automatically. Every number in the table must come from context or a tool result; never invent a row.

ANSWER FROM THE DATA FIRST: read the numbers yourself and give the answer — never hand the team a step that says "check X" or "look at Y" when X/Y is data you already have. If asked for a plan (e.g. scaling), do the analysis on the data provided and state the conclusion; only flag a step as needing them when it depends on something outside the data (a business decision, an off-platform fact, or a metric that genuinely isn't in what you were given — say so plainly rather than assigning it). Do NOT re-print the rigid three-section read unless they ask for a full re-read — reply like a specialist talking to a colleague: a few tight sentences, real numbers, the one thing to do next. If their context resolves the mystery (e.g. payments were down during exactly the collapse window), say so plainly and stop hunting for an in-account cause. You may consult the PPC OS tools if genuinely needed; if you do, call them before replying and answer only once.`;

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
interface Attachment { name: string; mediaType: string; data: string; kind: "image" | "document" | "text" }

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  // The conversation is persisted per account (§agent memory). A follow-up feeds
  // the agent context ("payments were down") and re-reasons WITHOUT re-pulling
  // Google Ads; a fresh read pulls new data but still remembers the thread.
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const followup = typeof body?.followup === "string" ? body.followup.trim() : "";
  const attachments: Attachment[] = Array.isArray(body?.attachments)
    ? (body.attachments as unknown[])
        .filter((a): a is Attachment => !!a && typeof a === "object"
          && typeof (a as Attachment).name === "string"
          && typeof (a as Attachment).mediaType === "string"
          && typeof (a as Attachment).data === "string"
          && ["image", "document", "text"].includes((a as Attachment).kind))
        .slice(0, 4)
    : [];
  const isChat = followup.length > 0 || attachments.length > 0;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: {
      id: true, name: true, currency: true, googleAdsId: true, organizationId: true,
      grossMarginPercent: true, roasFloor: true, minSpendForEval: true, minConversionsForEval: true, dataVerified: true,
      trackingStatus: true, trackingNote: true, trackingSetAt: true, trackingSetBy: true, merchantCenterId: true,
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

        // 3. Load the persisted conversation (memory) and build the turns. A
        // fresh read with history becomes an UPDATED read that remembers; a
        // follow-up appends the team's context.
        const priorRaw = await prisma.agentMessage.findMany({
          where: { accountId: id }, orderBy: { createdAt: "asc" }, take: 12,
          select: { role: true, content: true },
        });
        const memory: Turn[] = priorRaw.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.content }));
        while (memory.length && memory[memory.length - 1].role === "user") memory.pop(); // keep alternation clean
        const hasMemory = memory.length > 0;

        // The team's turn, with any attached files as content blocks (images /
        // PDFs the model reads; text files inlined). We persist a text record of
        // it (filename markers, not the bytes — disk-safe); the understanding
        // then lives on in the agent's reply, so the thread remembers it.
        const attaNames = attachments.map(a => a.name).join(", ");
        const userText = followup || (attachments.length ? "Shared file(s) for context." : "");
        const inlineText = attachments
          .filter(a => a.kind === "text")
          .map(a => `\n\n--- ${a.name} ---\n${Buffer.from(a.data, "base64").toString("utf8").slice(0, 20000)}`)
          .join("");
        const mediaBlocks = attachments
          .filter(a => a.kind !== "text")
          .map(a => a.kind === "image"
            ? { type: "image" as const, source: { type: "base64" as const, media_type: a.mediaType as "image/png" | "image/jpeg" | "image/gif" | "image/webp", data: a.data } }
            : { type: "document" as const, source: { type: "base64" as const, media_type: "application/pdf" as const, data: a.data } });
        const finalUserContent: string | unknown[] = mediaBlocks.length
          ? [{ type: "text" as const, text: userText + inlineText }, ...mediaBlocks]
          : userText + inlineText;

        // Persist the team's message immediately (survives a mid-stream failure).
        if (isChat) {
          await prisma.agentMessage.create({
            data: { accountId: id, role: "user", content: userText + (attaNames ? ` [attached: ${attaNames}]` : ""), kind: "chat", author: ctx.email },
          }).catch(() => null);
        }

        // Ground the OPENER in live data BEFORE the model speaks: pull the
        // essentials the nightly spine doesn't carry — current campaign
        // structure & budgets, impression share (budget-limited?), and the
        // dated change history (old→new diffs for correlation). This way the
        // first message reasons from the account as it is right now, not just
        // last night's aggregates. Chat follow-ups skip it (the model pulls on
        // demand there); it's real data in context, so the no-fabrication rule
        // is satisfied and we badge it as a genuine live pull.
        const preToolsUsed: { name: string; ok: boolean }[] = [];
        let liveSnapshot = "";
        if (!isChat) {
          send(controller, { status: "Getting the full picture on this account…" });
          const acc0 = { id: account.id, googleAdsId: account.googleAdsId, organizationId: account.organizationId, currency: account.currency, merchantCenterId: account.merchantCenterId };
          // Gather ALL the context up front — including Slack, so the opener
          // already knows any off-platform event the team mentioned (a checkout
          // break, a promo, a stockout) and never asks about something that's
          // already in the channel. Merchant Center rides run_healthcheck.
          const want = ["run_healthcheck", "get_campaign_overview", "get_impression_share", "get_change_history", "get_slack_context"];
          // Bound each pull so one slow live call (Merchant Center token exchange,
          // a sluggish Slack fetch) can't hold the whole opener on "Reading…".
          // A tool that doesn't answer in time is dropped from the snapshot — the
          // model can still pull it on demand later.
          const withTimeout = <T,>(p: Promise<T>, ms: number): Promise<T | null> =>
            Promise.race([p, new Promise<null>(res => setTimeout(() => res(null), ms))]);
          const pulls = await Promise.all(want.map(async name => {
            try {
              const out = await withTimeout(runAgentTool(name, { days: name === "get_slack_context" ? 45 : 30 }, acc0), 9000);
              if (out == null) return null;
              const ok = !/(not connected|^\s*no\b|error running|couldn'?t|no stored|no data)/i.test(out.split("\n")[0]);
              return { name, out, ok };
            } catch { return null; }
          }));
          const good = (pulls.filter(Boolean) as { name: string; out: string; ok: boolean }[]).filter(p => p.ok);
          for (const p of good) preToolsUsed.push({ name: p.name, ok: true });
          if (good.length) liveSnapshot = `\n\nLIVE SNAPSHOT — pulled just now (treat as ground truth; cite freely, it's real). Read ALL of it, INCLUDING the Slack channel, BEFORE you write — if the answer to an off-platform question (checkout, payments, promo, stock) is already here, use it and don't ask the team again:\n${good.map(p => p.out).join("\n\n")}`;
        }

        const context = buildClientBlock(clientCtx) + buildContext(account.name, cur, diag, windows, pages, winners, changeRows) + liveSnapshot;
        const firstTurn = { role: "user" as const, content: `${context}\n\nGive the expert read.` };
        let messages: unknown[];
        let useChatSystem: boolean;
        if (isChat) {
          messages = [firstTurn, ...memory, { role: "user", content: finalUserContent }];
          useChatSystem = true;
        } else if (hasMemory) {
          messages = [firstTurn, ...memory, { role: "user", content: "(The team asked for a fresh read.) Give me an updated read on the account using the latest data above. Remember everything we've already discussed — build on it, and don't re-raise context or hypotheses you already have answers to." }];
          useChatSystem = true;
        } else {
          messages = [firstTurn];
          useChatSystem = false;
        }
        // Agent loop: the model can call its own data tools (impression share,
        // campaign structure, search terms, Shopify) — we execute them and feed
        // the results back until it produces its final answer. Pre-tool narration
        // ("let me check…") is reset away; only the final text is shown/persisted.
        const sysPrompt = (useChatSystem ? SYSTEM_CHAT : SYSTEM) + PPC_OS_SYSTEM_NOTE + AGENT_TOOLS_NOTE + LEADGEN_NOTE + trackingDirective;
        const allTools = [...(ppc.tools ?? []), ...AGENT_TOOLS] as Parameters<typeof client.beta.messages.stream>[0]["tools"];
        const loopMessages = messages.slice();
        const toolAcc = { id: account.id, googleAdsId: account.googleAdsId, organizationId: account.organizationId, currency: account.currency, merchantCenterId: account.merchantCenterId };
        let finalText = "";
        // Seed with the up-front pulls so the opener's badge shows they were
        // fetched live (the loop dedupes by name if the model pulls again).
        const toolsUsed: { name: string; ok: boolean }[] = [...preToolsUsed];
        const MAX_STEPS = 6;

        for (let step = 0; step < MAX_STEPS; step++) {
          const anthropicStream = client.beta.messages.stream({
            model: "claude-opus-4-8",
            // Headroom for adaptive thinking: reasoning tokens are billed as
            // output and count against max_tokens, so leave room above the
            // ~1.5k the visible answer needs or the reply can truncate mid-think.
            max_tokens: 6000,
            // Extended reasoning: let the model actually think through the
            // diagnosis (correlate the numbers, weigh hypotheses, decide which
            // tool to pull) instead of answering off the top of its head. This
            // is the single biggest quality lever for the read.
            thinking: { type: "adaptive" },
            // Medium effort keeps the reasoning sharp but gets to the first token
            // much faster than "high" — the opener is conversational, not a proof.
            output_config: { effort: "medium" },
            betas: ppc.betas,
            mcp_servers: ppc.mcp_servers,
            tools: allTools,
            system: sysPrompt,
            messages: loopMessages as Parameters<typeof client.beta.messages.stream>[0]["messages"],
          });
          let textBlocks = 0;
          for await (const ev of anthropicStream) {
            if (ev.type === "content_block_start" && ev.content_block?.type === "text") {
              textBlocks++;
              if (textBlocks > 1) { send(controller, { reset: true }); finalText = ""; }
            } else if (ev.type === "content_block_start" && ev.content_block?.type === "thinking") {
              // Thinking deltas stream as a separate block type — they never
              // reach finalText (we only capture text_delta), so surfacing a
              // status here is safe and shows the agent is actually reasoning.
              send(controller, { status: "Thinking it through…" });
            } else if (ev.type === "content_block_start" && ev.content_block?.type === "tool_use") {
              send(controller, { status: toolStatusLabel(ev.content_block.name) });
            } else if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
              send(controller, { text: ev.delta.text });
              finalText += ev.delta.text;
            }
          }
          const finalMsg = await anthropicStream.finalMessage();
          const toolUses = finalMsg.content.filter(b => b.type === "tool_use") as Array<{ id: string; name: string; input: unknown }>;
          if (finalMsg.stop_reason !== "tool_use" || toolUses.length === 0) break;

          // Execute the agent's tool calls and feed the results back. Clear any
          // pre-tool narration from the client — only the post-tool answer shows.
          send(controller, { reset: true }); finalText = "";
          loopMessages.push({ role: "assistant", content: finalMsg.content });
          const results = [];
          for (const tu of toolUses) {
            let out: string;
            try { out = await runAgentTool(tu.name, (tu.input ?? {}) as Record<string, unknown>, toolAcc); }
            catch (e) { out = `Error running ${tu.name}: ${e instanceof Error ? e.message : String(e)}. Tell the team you couldn't fetch this.`; }
            // "ok" = the source actually returned usable data (not "not connected",
            // empty, or an error) — drives whether the badge reads as data or a gap.
            const ok = !/(not connected|^\s*no\b|error running|couldn'?t|no stored|no data)/i.test(out.split("\n")[0]);
            if (!toolsUsed.some(t => t.name === tu.name)) toolsUsed.push({ name: tu.name, ok });
            results.push({ type: "tool_result" as const, tool_use_id: tu.id, content: out });
          }
          loopMessages.push({ role: "user", content: results });
        }
        // Surface which live tools actually ran, so a real pull is visible and a
        // fabricated "I pulled…" (with no tools) is obvious.
        if (toolsUsed.length) send(controller, { toolsUsed });
        // Persist the agent's message so the conversation is remembered (clean —
        // the tools-used indicator is live-only, not stored in the content).
        if (finalText.trim()) {
          await prisma.agentMessage.create({
            data: { accountId: id, role: "assistant", content: finalText.trim(), kind: isChat ? "chat" : "opener" },
          }).catch(() => null);

          // Dynamic follow-up chips — the next questions THIS conversation calls
          // for, not a static list. Cheap model, best-effort (falls back on the
          // client if this yields nothing).
          try {
            const sug = await client.messages.create({
              model: "claude-haiku-4-5-20251001",
              max_tokens: 220,
              system: `You suggest the next moves an ad-agency account manager would click after reading this analysis. Return 3-4 SHORT (max ~7 words each), specific, action-oriented follow-ups that fit THIS exact conversation — the next question to ask the agent or action to take, not generic ones. Return ONLY a JSON array of strings, no prose, no code fences.`,
              messages: [{ role: "user", content: `The account manager just ${followup ? `asked: "${followup}"` : "opened the read"}.\n\nThe agent answered:\n${finalText.trim().slice(0, 2500)}\n\nSuggest the next follow-ups.` }],
            });
            const txt = sug.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map(b => b.text).join("").trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
            const parsed = JSON.parse(txt);
            if (Array.isArray(parsed)) {
              const suggestions = parsed.filter((s): s is string => typeof s === "string" && s.length > 0).slice(0, 4);
              if (suggestions.length) send(controller, { suggestions });
            }
          } catch { /* client falls back to defaults */ }
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
