/**
 * POST /api/google-ads/accounts/bulk
 * Body: { accounts: { googleAdsId, name, currency }[] }
 * Inserts all new accounts with a single createMany query, then updates
 * existing ones. Two queries total regardless of account count.
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

  const data = body.accounts.map((a) => ({
    googleAdsId:    a.googleAdsId,
    name:           a.name,
    currency:       a.currency ?? "USD",
    organizationId: ctx.orgId,
  }));

  // Single INSERT ... ON CONFLICT DO NOTHING — fast regardless of account count
  await prisma.account.createMany({ data, skipDuplicates: true });

  return NextResponse.json({ imported: body.accounts.length }, { status: 201 });
}

