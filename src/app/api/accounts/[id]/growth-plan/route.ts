/**
 * POST /api/accounts/[id]/growth-plan
 *   Auto-fetches Google Ads (90/30/14-day) + product + campaign data (and Shopify when
 *   connected), then has Claude author an Ecomtrada-style 90-day plan. This is the
 *   "live"/automated path. Manual (CSV upload) generation lives at ./growth-plan/manual.
 * GET  /api/accounts/[id]/growth-plan
 *   Returns the most recently generated plan + the saved Context Pack.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import {
  fetchGrowthWindows, fetchCampaignsForPlan, fetchProductEngineRows,
  fetchScalingReadiness, extractGoogleAdsError, type GrowthWindow,
} from "@/lib/integrations/google-ads";
import { analyze } from "@/lib/product-engine/engine/productEngine";
import { fetchShopifyMetrics } from "@/lib/integrations/shopify";
import { authorGrowthPlan, planPeriodLabel, PLAN_MARKER } from "@/lib/product-engine/plan/authorGrowthPlan";
import { GrowthPlanData, MomentumWindow, Lang, ContextPack } from "@/lib/product-engine/plan/growthPlanTypes";

type Params = { params: Promise<{ id: string }> };

function toMomentum(w: GrowthWindow, label: string): MomentumWindow {
  return { label, days: w.days, spendPerDay: w.spendPerDay, convValuePerDay: w.convValuePerDay, roas: w.roas };
}

// ─── GET: latest saved plan + context pack ─────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: { id: true, contextPack: true },
  });
  if (!account) return forbidden();

  let contextPack: ContextPack | null = null;
  try { contextPack = account.contextPack ? JSON.parse(account.contextPack) : null; } catch { /* ignore */ }

  const latest = await prisma.clientActionPlan.findFirst({
    where: { accountId: id, content: { contains: PLAN_MARKER } },
    orderBy: { createdAt: "desc" },
  });

  let plan = null, generatedAt: string | null = null;
  if (latest) {
    try { plan = JSON.parse(latest.content); generatedAt = latest.createdAt.toISOString(); } catch { /* ignore */ }
  }
  return NextResponse.json({ plan, generatedAt, contextPack });
}

// ─── POST: generate from live data ─────────────────────────────────────────────

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: {
      googleAdsId: true, name: true, currency: true, industry: true,
      country: true, targetRoas: true, grossMarginPercent: true, clientContext: true, contextPack: true,
    },
  });
  if (!account) return forbidden();
  if (!account.googleAdsId) {
    return NextResponse.json({ error: "No Google Ads account linked" }, { status: 400 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    amName?: string; market?: string; vertical?: string;
    periodLabel?: string; language?: Lang;
    contextPack?: ContextPack; scalingStrategy?: string;
  };
  const language: Lang = body.language === "nl" ? "nl" : "en";

  // Persist the Context Pack if supplied (the human input is reused on every regenerate).
  let contextPack: ContextPack | null = body.contextPack ?? null;
  if (!contextPack && account.contextPack) {
    try { contextPack = JSON.parse(account.contextPack); } catch { /* ignore */ }
  }
  if (body.contextPack) {
    await prisma.account.update({ where: { id }, data: { contextPack: JSON.stringify(body.contextPack) } });
  }

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
      .filter((p) => p.status === "WINNER").slice(0, 8)
      .map((p) => ({ title: p.product, spend: p.spend, revenue: p.revenue, roas: p.roas }));
    const exclude = analysis.statusSummary.find((s) => s.status === "EXCLUDE");

    let dailyBudget: number | null = null, readyToScale: boolean | null = null, scalingNote: string | null = null;
    try {
      const scaling = await fetchScalingReadiness(account.googleAdsId, account.targetRoas, ctx.orgId);
      dailyBudget = scaling.currentDailyBudget;
      readyToScale = scaling.readyToScale;
      scalingNote = scaling.scalingNote;
    } catch { /* non-fatal */ }

    // ── Shopify (Phase 1 — auto-fetch total revenue/AOV when connected) ──────────
    let shopify: GrowthPlanData["shopify"] = null;
    const conn = await prisma.shopifyConnection.findUnique({ where: { accountId: id } });
    if (conn) {
      try {
        const m = await fetchShopifyMetrics(conn.shopDomain, conn.accessToken);
        const tot = m.windows.d90.totalSales;
        shopify = {
          totalRevenue: tot,
          grossMarginPct: null,   // Phase 1: COGS/margin not fetched — stays manual
          cogsConfigured: false,
          netSales: m.windows.d90.netSales,
          googleSharePct: tot > 0 ? (windows.d90.convValue / tot) * 100 : null,
          aov: m.windows.d90.aov,
        };
      } catch { /* non-fatal — fall back to no Shopify data */ }
    }

    data = {
      client: account.name,
      currency: account.currency,
      market: body.market ?? account.country ?? null,
      vertical: body.vertical ?? account.industry ?? null,
      periodLabel: body.periodLabel ?? planPeriodLabel(),
      amName: body.amName ?? null,
      targetRoas: account.targetRoas,
      goalNotes: account.clientContext ?? null,
      contextPack,
      scalingStrategy: body.scalingStrategy ?? null,
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
      shopify,
    };
  } catch (err) {
    return NextResponse.json({ error: extractGoogleAdsError(err) }, { status: 500 });
  }

  // ── Author + persist ───────────────────────────────────────────────────────
  try {
    const { content, render } = await authorGrowthPlan(data);
    const stored = { marker: PLAN_MARKER, content, render, data, generatedAt: new Date().toISOString() };
    await prisma.clientActionPlan.create({ data: { accountId: id, content: JSON.stringify(stored) } });
    return NextResponse.json({ ok: true, content, render, generatedAt: stored.generatedAt });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
