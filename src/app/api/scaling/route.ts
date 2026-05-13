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
}

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const accounts = await prisma.account.findMany({
    where: { organizationId: ctx.orgId },
    orderBy: { name: "asc" },
    select: { id: true, name: true, industry: true, currency: true, targetRoas: true, googleAdsId: true },
  });

  // Fetch scaling data for each account in parallel, with per-account timeout
  const rows: ScalingRow[] = await Promise.all(
    accounts.map(async (a): Promise<ScalingRow> => {
      if (!a.googleAdsId) {
        return { ...a, scaling: null, scalingError: "No Google Ads ID" };
      }
      try {
        const scaling = await Promise.race([
          fetchScalingReadiness(a.googleAdsId, a.targetRoas ?? null, ctx.orgId),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("timed out")), 25_000)
          ),
        ]);
        return { ...a, scaling, scalingError: null };
      } catch (err) {
        return {
          ...a, scaling: null,
          scalingError: err instanceof Error ? err.message : "fetch failed",
        };
      }
    })
  );

  return NextResponse.json(rows);
}
