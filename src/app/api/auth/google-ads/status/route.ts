/**
 * GET /api/auth/google-ads/status
 * Returns whether Google Ads credentials are configured for the current org.
 */
import { NextResponse } from "next/server";
import { isGoogleAdsConfigured } from "@/lib/integrations/google-ads";
import { getAuthContext, unauthorized } from "@/lib/auth";

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const connected = await isGoogleAdsConfigured(ctx.orgId);
  return NextResponse.json({ connected });
}
