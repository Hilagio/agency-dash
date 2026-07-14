/**
 * GET /api/google-ads/health — prove the live Google Ads API works.
 *
 * Unlike /api/auth/google-ads/status (which only checks credentials exist), this
 * makes the cheapest real API call (listAccessibleCustomers) and reports a clear
 * pass/fail with the actual error + a plain-language hint. Session or CRON_SECRET.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { pingGoogleAds } from "@/lib/integrations/google-ads";

export const dynamic = "force-dynamic";

function isCron(req: NextRequest): boolean {
  const s = process.env.CRON_SECRET;
  return !!s && (req.headers.get("authorization") === `Bearer ${s}` || req.headers.get("x-cron-secret") === s);
}

export async function GET(req: NextRequest) {
  let orgId: string | undefined;
  if (!isCron(req)) {
    const ctx = await getAuthContext();
    if (!ctx) return unauthorized();
    orgId = ctx.orgId;
  }
  const result = await pingGoogleAds(orgId);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
