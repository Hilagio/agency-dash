/**
 * GET /api/accounts/[id]/persona
 * Returns all persona data: demographics, income, parental, geo, day/hour, interests.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchPersonaData } from "@/lib/integrations/google-ads";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;
  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  if (!account.googleAdsId) {
    return NextResponse.json({ error: "No Google Ads account linked" }, { status: 422 });
  }

  try {
    const data = await fetchPersonaData(account.googleAdsId, ctx.orgId);
    return NextResponse.json({
      ...data,
      accountName:   account.name,
      industry:      account.industry ?? null,
      country:       account.country ?? null,
      businessModel: account.businessModel ?? null,
      currency:      account.currency,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
