/**
 * GET /api/auth/google-ads/status
 * Returns whether Google Ads credentials are configured.
 */
import { NextResponse } from "next/server";
import { isGoogleAdsConfigured } from "@/lib/integrations/google-ads";

export async function GET() {
  const connected = await isGoogleAdsConfigured();
  return NextResponse.json({ connected });
}
