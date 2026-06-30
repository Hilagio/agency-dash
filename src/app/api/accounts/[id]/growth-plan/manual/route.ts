/**
 * POST /api/accounts/[id]/growth-plan/manual
 *
 * The SOP (manual) path: the team uploads Google Ads CSVs and types the Shopify numbers
 * client-side; this route receives the already-parsed payload, builds the same
 * GrowthPlanData the live path produces, and has Claude author the plan.
 *
 * This keeps teams unblocked today while the automated fetch is finished.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { analyze } from "@/lib/product-engine/engine/productEngine";
import { RawRow } from "@/lib/product-engine/engine/types";
import { authorGrowthPlan, planPeriodLabel, PLAN_MARKER } from "@/lib/product-engine/plan/authorGrowthPlan";
import {
  GrowthPlanData, MomentumWindow, Lang, ContextPack,
} from "@/lib/product-engine/plan/growthPlanTypes";

type Params = { params: Promise<{ id: string }> };

interface WindowTotals { spend: number; convValue: number; conv: number; clicks: number }

interface ManualPayload {
  amName?: string; market?: string; vertical?: string; periodLabel?: string;
  language?: Lang;
  contextPack?: ContextPack;
  scalingStrategy?: string;
  grossMarginPct?: number | null;   // percentage 0–100 (from P/L or Shopify)
  windows: { d90: WindowTotals; d30: WindowTotals; d14: WindowTotals };
  products: RawRow[];
  campaigns?: { name: string; channelType?: string; spend: number; convValue: number; conv: number; clicks: number }[];
  shopify?: {
    totalRevenue?: number | null; aov?: number | null; grossMarginPct?: number | null;
    cogs?: number | null; netSales?: number | null; mostSold?: string | null; inStock?: string | null;
  } | null;
}

function win(days: number, w: WindowTotals | undefined, label: string): MomentumWindow {
  const t = w ?? { spend: 0, convValue: 0, conv: 0, clicks: 0 };
  return {
    label, days,
    spendPerDay: t.spend / days,
    convValuePerDay: t.convValue / days,
    roas: t.spend > 0 ? t.convValue / t.spend : 0,
  };
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: { name: true, currency: true, industry: true, country: true, targetRoas: true, grossMarginPercent: true, contextPack: true },
  });
  if (!account) return forbidden();

  const body = (await req.json().catch(() => null)) as ManualPayload | null;
  if (!body || !body.windows || !Array.isArray(body.products)) {
    return NextResponse.json({ error: "Missing parsed campaign windows or product rows" }, { status: 400 });
  }
  const language: Lang = body.language === "nl" ? "nl" : "en";

  // Persist the Context Pack (reused on every regenerate).
  let contextPack: ContextPack | null = body.contextPack ?? null;
  if (!contextPack && account.contextPack) {
    try { contextPack = JSON.parse(account.contextPack); } catch { /* ignore */ }
  }
  if (body.contextPack) {
    await prisma.account.update({ where: { id }, data: { contextPack: JSON.stringify(body.contextPack) } });
  }

  // Margin: prefer explicit manual %, then Shopify %, then the stored account margin.
  const pct = body.grossMarginPct ?? body.shopify?.grossMarginPct ?? null;
  const margin = pct != null && pct > 0 ? pct / 100 : (account.grossMarginPercent ?? null);

  const analysis = analyze(body.products, { margin });
  const winners = analysis.products
    .filter((p) => p.status === "WINNER").slice(0, 8)
    .map((p) => ({ title: p.product, spend: p.spend, revenue: p.revenue, roas: p.roas }));
  const exclude = analysis.statusSummary.find((s) => s.status === "EXCLUDE");

  const d90 = win(90, body.windows.d90, "90 days");
  const d30 = win(30, body.windows.d30, "30 days");
  const d14 = win(14, body.windows.d14, "14 days");

  const shopify = body.shopify && (body.shopify.totalRevenue || body.shopify.grossMarginPct)
    ? {
        totalRevenue:   body.shopify.totalRevenue ?? 0,
        grossMarginPct: body.shopify.grossMarginPct ?? null,
        cogsConfigured: body.shopify.cogs != null && body.shopify.cogs > 0,
        netSales:       body.shopify.netSales ?? null,
        googleSharePct: body.shopify.totalRevenue
          ? (body.windows.d90.convValue / body.shopify.totalRevenue) * 100
          : null,
        aov:            body.shopify.aov ?? null,
      }
    : null;

  const data: GrowthPlanData = {
    client: account.name,
    currency: account.currency,
    market: body.market ?? account.country ?? null,
    vertical: body.vertical ?? account.industry ?? null,
    periodLabel: body.periodLabel ?? planPeriodLabel(),
    amName: body.amName ?? null,
    targetRoas: account.targetRoas,
    goalNotes: null,
    contextPack,
    scalingStrategy: body.scalingStrategy ?? null,
    language,
    google: {
      windows: { d90, d30, d14 },
      breakEven: analysis.totals.breakEven,
      breakEvenAssumed: analysis.totals.breakEvenAssumed,
      wastedSpend: exclude?.spend ?? 0,
      winners,
      statusSummary: analysis.statusSummary.map((s) => ({
        status: s.status, count: s.count, spend: s.spend, revenue: s.revenue, roas: s.roas,
      })),
      campaigns: (body.campaigns ?? []).slice(0, 12).map((c) => ({
        name: c.name, channelType: c.channelType ?? "",
        spend: c.spend, roas: c.spend > 0 ? c.convValue / c.spend : 0,
        cvr: c.clicks > 0 ? c.conv / c.clicks : 0,
        budgetLimited: false, biddingLimited: false,   // not available from manual CSVs
      })),
      dailyBudget: null, readyToScale: null, scalingNote: null,
    },
    shopify,
  };

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
