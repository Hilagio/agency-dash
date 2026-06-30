import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { fetchScalingReadiness } from "@/lib/integrations/google-ads";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId ?? undefined },
    select: { googleAdsId: true, targetRoas: true, currency: true },
  });
  if (!account) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!account.googleAdsId) return NextResponse.json({ error: "no google ads id" }, { status: 400 });

  try {
    const data = await fetchScalingReadiness(account.googleAdsId, account.targetRoas ?? null, ctx.orgId ?? undefined);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[scaling] fetchScalingReadiness failed:", err);
    return NextResponse.json({ error: "failed to fetch scaling data" }, { status: 500 });
  }
}
