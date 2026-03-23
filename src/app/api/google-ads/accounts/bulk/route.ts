/**
 * POST /api/google-ads/accounts/bulk
 * Body: { accounts: { googleAdsId, name, currency }[] }
 * Upserts all accounts in a single transaction instead of N individual POSTs.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const body = await req.json() as {
    accounts: { googleAdsId: string; name: string; currency?: string }[];
  };

  if (!Array.isArray(body.accounts) || body.accounts.length === 0) {
    return NextResponse.json({ error: "accounts array is required" }, { status: 400 });
  }

  await prisma.$transaction(
    body.accounts.map((a) =>
      prisma.account.upsert({
        where: { googleAdsId: a.googleAdsId },
        update: {
          name:           a.name,
          currency:       a.currency ?? "USD",
          organizationId: ctx.orgId,
        },
        create: {
          googleAdsId:    a.googleAdsId,
          name:           a.name,
          currency:       a.currency ?? "USD",
          organizationId: ctx.orgId,
        },
      })
    )
  );

  return NextResponse.json({ imported: body.accounts.length }, { status: 201 });
}
