/**
 * GET /api/accounts/[id]/spend-curve
 *
 * Fetches 12 months of monthly spend + ROAS (or CPA) from Google Ads,
 * returns them as data points so the budget scenario calculator can
 * fit a real efficiency curve instead of using a generic assumption.
 *
 * Returns: { points: Array<{ spend: number; roas: number; month: string }> }
 * Or for lead-gen: { points: Array<{ spend: number; cpa: number; month: string }> }
 */

import { NextRequest, NextResponse } from "next/server";
import { GoogleAdsApi } from "google-ads-api";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!account) return forbidden();

  const cred = await prisma.oAuthCredential.findUnique({ where: { id: "singleton" } });
  const refreshToken = cred?.refreshToken ?? process.env.GOOGLE_ADS_REFRESH_TOKEN;
  if (!refreshToken) {
    return NextResponse.json({ error: "Google Ads not connected" }, { status: 503 });
  }

  const client = new GoogleAdsApi({
    client_id:       process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });
  const customer = client.Customer({
    customer_id:       account.googleAdsId,
    login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || undefined,
    refresh_token:     refreshToken,
  });

  // Last 12 full months (exclude current partial month)
  const now = new Date();
  const endDate = new Date(now.getFullYear(), now.getMonth(), 0); // last day of prev month
  const startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth() + 1, 1);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  try {
    const rows = await customer.query(`
      SELECT
        segments.month,
        metrics.cost_micros,
        metrics.conversions_value,
        metrics.conversions
      FROM campaign
      WHERE campaign.status != 'REMOVED'
        AND segments.date BETWEEN '${fmt(startDate)}' AND '${fmt(endDate)}'
    `);

    // Aggregate by month
    const byMonth = new Map<string, { spend: number; value: number; conversions: number }>();
    for (const row of rows) {
      const month = String(row.segments?.month ?? "").slice(0, 7); // "YYYY-MM"
      if (!month) continue;
      const spend = Number(row.metrics?.cost_micros ?? 0) / 1_000_000;
      const value = Number(row.metrics?.conversions_value ?? 0);
      const conv  = Number(row.metrics?.conversions ?? 0);
      if (!byMonth.has(month)) byMonth.set(month, { spend: 0, value: 0, conversions: 0 });
      const m = byMonth.get(month)!;
      m.spend       += spend;
      m.value       += value;
      m.conversions += conv;
    }

    const points = [...byMonth.entries()]
      .filter(([, m]) => m.spend > 0)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, m]) => ({
        month,
        spend:       Math.round(m.spend),
        roas:        m.spend > 0 && m.value > 0 ? m.value / m.spend : null,
        cpa:         m.conversions > 0 ? m.spend / m.conversions : null,
        conversions: Math.round(m.conversions),
      }));

    // Also return latest snapshot signals so the frontend can estimate k from
    // IS-lost-to-budget, CTR, CVR when there are fewer than 4 months of data.
    const latestSnapshot = await prisma.constraintSnapshot.findFirst({
      where:   { accountId: id },
      orderBy: { createdAt: "desc" },
    });
    let signals: Record<string, unknown> | null = null;
    if (latestSnapshot?.rawSignals) {
      try { signals = JSON.parse(latestSnapshot.rawSignals); } catch { /* ignore */ }
    }

    return NextResponse.json({ points, signals });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
