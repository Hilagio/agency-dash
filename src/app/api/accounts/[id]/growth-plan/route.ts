/**
 * POST /api/accounts/[id]/growth-plan
 *   Gathers Google Ads (90/30/14-day) + product + campaign data (and Shopify when
 *   connected), then has Claude author an Ecomtrada-style 90-day plan as JSON.
 * GET  /api/accounts/[id]/growth-plan
 *   Returns the most recently generated plan (if any).
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import {
  fetchGrowthWindows, fetchCampaignsForPlan, fetchProductEngineRows,
  fetchScalingReadiness, extractGoogleAdsError, type GrowthWindow,
} from "@/lib/integrations/google-ads";
import { analyze } from "@/lib/product-engine/engine/productEngine";
import {
  GrowthPlanData, GrowthPlanContent, GrowthPlanRender, MomentumWindow, Lang,
} from "@/lib/product-engine/plan/growthPlanTypes";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

const PLAN_MARKER = "GROWTHPLAN_V3";

// ─── System prompt — the Ecomtrada way (from NINETYDAYPLANCONTEXT.md) ──────────

const SYSTEM_PROMPT = `You are a senior Ecomtrada strategist writing a client-facing 90-day Google Ads plan.
Ecomtrada runs Google Ads for webshops. This plan is THE ANCHOR of the client relationship: every
weekly update is measured against exactly its goals. A confident-but-wrong plan at a thin margin
loses a client — accuracy and honesty beat polish.

THE ECOMTRADA PRINCIPLES (non-negotiable):
1. Root cause from data, never assumption. Diagnose the client-specific constraint (volume, stock,
   feed, website conversion, pricing/margin, channel mix). It varies — never default to one.
2. The make-or-break factor. Every plan turns on one client-specific thing that is invisible in the
   numbers. Name it explicitly in "What we need from you" / the honest read.
3. Partner, not button-pusher. Google Ads is one part of the machine. If website, pricing, feed or
   margin is the real constraint, say so — with data.
4. Honest, safe promises. Take the client's goal and make it REALISTIC. If they want 3× but 2× is
   realistic, write 2× and say so. Promise with a margin of safety, then over-deliver.
5. Name uncomfortable findings early. Surfacing problems on day 1 is what they pay for.
6. Profit, not vanity ROAS. Break-even ROAS = 1 ÷ margin. If margin/COGS is missing or assumed, say
   so and push to get real COGS in (steer on POAS). At a thin margin a "good ROAS" can still be a loss.

INTERPRETATION RULES (what the data does NOT tell you):
- Out-of-stock ≠ current waste. Never call an OOS product a villain. Plan revenue only on winners
  that can actually return (not limited editions).
- Ads are usually a fraction of total store revenue. When Shopify total revenue is given, state
  Google's share of it so the client sees the scale headroom.
- The trend across 90 → 30 → 14 day windows IS the diagnosis. A softening ROAS as spend ramps is
  the NORMAL, healthy scaling curve — not a reason to stop — as long as it stays above the KPI.

VOICE: direct, honest operator. Short sentences. No hype, no jargon-as-smokescreen. Translate every
metric into what it means for the client's business. Write the strategy/subtitle LAST: "today here →
day 90 there → how". Use the client's language (en/nl) as instructed.

OUTPUT: a single valid JSON object matching the schema given by the user. No markdown fences, no
commentary. In any prose field you may use **bold** to emphasise the few numbers/phrases that matter
(used sparingly, like the gold highlights in the brand). Keep each finding/lever body to 2–3 sentences.`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toMomentum(w: GrowthWindow, label: string): MomentumWindow {
  return { label, days: w.days, spendPerDay: w.spendPerDay, convValuePerDay: w.convValuePerDay, roas: w.roas };
}

function planPeriodLabel(): string {
  const start = new Date();
  const end = new Date(); end.setDate(start.getDate() + 90);
  const f = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return `${f(start)} – ${f(end)}`;
}

// ─── GET: latest saved plan ────────────────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId }, select: { id: true } });
  if (!account) return forbidden();

  const latest = await prisma.clientActionPlan.findFirst({
    where: { accountId: id, content: { contains: PLAN_MARKER } },
    orderBy: { createdAt: "desc" },
  });
  if (!latest) return NextResponse.json({ plan: null });

  try {
    const parsed = JSON.parse(latest.content);
    return NextResponse.json({ plan: parsed, generatedAt: latest.createdAt.toISOString() });
  } catch {
    return NextResponse.json({ plan: null });
  }
}

// ─── POST: generate a new plan ─────────────────────────────────────────────────

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: {
      googleAdsId: true, name: true, currency: true, industry: true,
      country: true, targetRoas: true, grossMarginPercent: true, clientContext: true,
    },
  });
  if (!account) return forbidden();
  if (!account.googleAdsId) {
    return NextResponse.json({ error: "No Google Ads account linked" }, { status: 400 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    amName?: string; market?: string; vertical?: string;
    periodLabel?: string; goalNotes?: string; language?: Lang;
  };
  const language: Lang = body.language === "nl" ? "nl" : "en";

  // ── Gather data ──────────────────────────────────────────────────────────────
  let data: GrowthPlanData;
  try {
    const [windows, campaigns, rows] = await Promise.all([
      fetchGrowthWindows(account.googleAdsId, ctx.orgId),
      fetchCampaignsForPlan(account.googleAdsId, ctx.orgId),
      fetchProductEngineRows(account.googleAdsId, ctx.orgId, "LAST_90_DAYS"),
    ]);

    const analysis = analyze(rows, { margin: account.grossMarginPercent ?? null });
    const winners = analysis.products
      .filter((p) => p.status === "WINNER")
      .slice(0, 8)
      .map((p) => ({ title: p.product, spend: p.spend, revenue: p.revenue, roas: p.roas }));
    const exclude = analysis.statusSummary.find((s) => s.status === "EXCLUDE");

    let dailyBudget: number | null = null, readyToScale: boolean | null = null, scalingNote: string | null = null;
    try {
      const scaling = await fetchScalingReadiness(account.googleAdsId, account.targetRoas, ctx.orgId);
      dailyBudget = scaling.currentDailyBudget;
      readyToScale = scaling.readyToScale;
      scalingNote = scaling.scalingNote;
    } catch { /* non-fatal */ }

    data = {
      client: account.name,
      currency: account.currency,
      market: body.market ?? account.country ?? null,
      vertical: body.vertical ?? account.industry ?? null,
      periodLabel: body.periodLabel ?? planPeriodLabel(),
      amName: body.amName ?? null,
      targetRoas: account.targetRoas,
      goalNotes: body.goalNotes ?? account.clientContext ?? null,
      language,
      google: {
        windows: {
          d90: toMomentum(windows.d90, "90 days"),
          d30: toMomentum(windows.d30, "30 days"),
          d14: toMomentum(windows.d14, "14 days"),
          d7:  toMomentum(windows.d7,  "7 days"),
        },
        breakEven: analysis.totals.breakEven,
        breakEvenAssumed: analysis.totals.breakEvenAssumed,
        wastedSpend: exclude?.spend ?? 0,
        winners,
        statusSummary: analysis.statusSummary.map((s) => ({
          status: s.status, count: s.count, spend: s.spend, revenue: s.revenue, roas: s.roas,
        })),
        campaigns: campaigns.map((c) => ({
          name: c.name, channelType: c.channelType, spend: c.spend,
          roas: c.roas, cvr: c.cvr, budgetLimited: c.budgetLimited, biddingLimited: c.biddingLimited,
        })),
        dailyBudget, readyToScale, scalingNote,
      },
      shopify: null, // Shopify integration pending — margin/revenue-share fields stay null for now.
    };
  } catch (err) {
    return NextResponse.json({ error: extractGoogleAdsError(err) }, { status: 500 });
  }

  // ── Author the plan ────────────────────────────────────────────────────────
  const schema = `OUTPUT JSON SCHEMA (all prose in ${language === "nl" ? "Dutch" : "English"}):
{
  "subtitle": string,  // one strategic line for the header: goal · KPI · what we'll do · market · vertical · period · AM
  "strategyLead": string,  // 4-6 sentence narrative: where they are -> the constraint -> the 90-day job
  "standToday": [ { "big": string, "body": string } ],  // EXACTLY 4 finding cards. "big" = a headline number+label (e.g. "4.72 ROAS", "~$57/day", "5.5% conv"). "body" starts with a **bold lead-in**.
  "honestRead": string,  // the uncomfortable truths; use "• " bullets separated by \\n; cover margin/COGS and the ROAS-softens-as-you-ramp read
  "momentumNote": string,  // 1-2 sentences interpreting the 90->30->14 trend
  "levers": [ { "big": string, "body": string } ],  // 3-4 levers. "big" like "1 · Scale", "2 · Brand", "3 · Feed", "+ Profit"
  "phases": [ { "title": string, "rows": [ { "action": string, "who": "Ecomtrada"|"Client"|"Together", "when": string } ] } ],  // EXACTLY 3 phases (Unlock/Foundation, Scale, Grow/Q4). who = who owns it.
  "forecastIntro": string,  // 2-3 sentences restating the goal and the realistic ambition
  "goals": [ { "goal": string, "now": string, "target": string, "assessment": string, "expand"?: boolean } ],  // 3-5 rows. Mark the headline growth goal with "expand": true.
  "forecastRead": string,  // "The honest read:" — the realistic outcome with a safety margin
  "seasonalNote": string,  // seasonal context for this vertical over the next 90 days
  "needs": string[]  // 3-4 client-side asks, each a **bold lead-in** then the ask. Include the make-or-break factor.
}`;

  const prompt = `Write the 90-day plan for this account. Base every claim on the data below; where margin/COGS is assumed or Shopify is not connected, say so and push to get real COGS in.

ACCOUNT DATA (JSON):
${JSON.stringify(data, null, 2)}

NOTES:
- Currency is ${data.currency}. Target ROAS (KPI) ${data.targetRoas ?? "not set — infer from break-even and ask to confirm"}.
- break-even ${data.google.breakEven}${data.google.breakEvenAssumed ? " (ASSUMED — margin unknown, must be confirmed)" : ""}.
- Shopify is ${data.shopify ? "connected" : "NOT connected yet — you cannot quote gross margin or Google's share of total revenue as fact; frame COGS/POAS as the thing to set up"}.
- Use the campaign reads (budgetLimited / biddingLimited) to name specific unlock opportunities.
- Momentum chart is rendered from the window data automatically — your momentumNote should interpret it.

${schema}

Return ONLY the JSON object.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonStr = rawText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```\s*$/, "").trim();
    const content = JSON.parse(jsonStr) as GrowthPlanContent;

    const render: GrowthPlanRender = {
      client: data.client,
      currency: data.currency,
      subtitle: content.subtitle,
      windows: [data.google.windows.d90, data.google.windows.d30, data.google.windows.d14],
    };

    const stored = { marker: PLAN_MARKER, content, render, data, generatedAt: new Date().toISOString() };
    await prisma.clientActionPlan.create({
      data: { accountId: id, content: JSON.stringify(stored) },
    });

    return NextResponse.json({ ok: true, content, render, generatedAt: stored.generatedAt });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
