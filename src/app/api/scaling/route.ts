import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { fetchScalingReadiness, ScalingReadiness } from "@/lib/integrations/google-ads";

export interface ScalingRow {
  id:            string;
  name:          string;
  industry:      string | null;
  currency:      string;
  targetRoas:    number | null;
  googleAdsId:   string | null;
  scaling:       ScalingReadiness | null;
  scalingError:  string | null;
  /** ISO date string of the snapshot where budget was last detected as changed */
  lastScaledDate:  string | null;
  /** Budget before the change (currency units) */
  lastScaledFrom:  number | null;
  /** Budget after the change (currency units) */
  lastScaledTo:    number | null;
}

/** Derive last-scaled date from consecutive snapshot rawSignals comparisons.
 *  Returns the createdAt of the snapshot where totalDailyBudget first exceeded
 *  the previous value by >5%. Looks back up to 90 snapshots. */
function detectLastScaled(snapshots: { createdAt: Date; rawSignals: string | null }[]): {
  lastScaledDate: string | null;
  lastScaledFrom: number | null;
  lastScaledTo:   number | null;
} {
  // snapshots are newest-first
  for (let i = 0; i < snapshots.length - 1; i++) {
    const curr = parseBudget(snapshots[i].rawSignals);
    const prev = parseBudget(snapshots[i + 1].rawSignals);
    if (curr === null || prev === null || prev === 0) continue;
    // Detect a meaningful increase (>5% to ignore noise from new/removed campaigns)
    if (curr > prev * 1.05) {
      return {
        lastScaledDate: snapshots[i].createdAt.toISOString().slice(0, 10),
        lastScaledFrom: Math.round(prev),
        lastScaledTo:   Math.round(curr),
      };
    }
  }
  return { lastScaledDate: null, lastScaledFrom: null, lastScaledTo: null };
}

function parseBudget(rawSignals: string | null): number | null {
  if (!rawSignals) return null;
  try {
    const parsed = JSON.parse(rawSignals) as { economics?: { totalDailyBudget?: number } };
    const v = parsed.economics?.totalDailyBudget;
    return typeof v === "number" && v > 0 ? v : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  // Fetch accounts with their last 90 snapshots (for budget change detection)
  const accounts = await prisma.account.findMany({
    where: { organizationId: ctx.orgId },
    orderBy: { name: "asc" },
    select: {
      id: true, name: true, industry: true, currency: true,
      targetRoas: true, googleAdsId: true,
      snapshots: {
        orderBy: { createdAt: "desc" },
        take: 90,
        select: { createdAt: true, rawSignals: true },
      },
    },
  });

  const rows: ScalingRow[] = await Promise.all(
    accounts.map(async (a): Promise<ScalingRow> => {
      // Detect last scaled from snapshot history (no Google Ads API needed)
      const { lastScaledDate, lastScaledFrom, lastScaledTo } = detectLastScaled(a.snapshots);

      const base = { id: a.id, name: a.name, industry: a.industry, currency: a.currency, targetRoas: a.targetRoas, googleAdsId: a.googleAdsId };

      if (!a.googleAdsId) {
        return { ...base, scaling: null, scalingError: "No Google Ads ID", lastScaledDate, lastScaledFrom, lastScaledTo };
      }

      try {
        const scaling = await Promise.race([
          fetchScalingReadiness(a.googleAdsId, a.targetRoas ?? null, ctx.orgId),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("timed out")), 25_000)
          ),
        ]);
        return { ...base, scaling, scalingError: null, lastScaledDate, lastScaledFrom, lastScaledTo };
      } catch (err) {
        return {
          ...base, scaling: null,
          scalingError: err instanceof Error ? err.message : "fetch failed",
          lastScaledDate, lastScaledFrom, lastScaledTo,
        };
      }
    })
  );

  return NextResponse.json(rows);
}
