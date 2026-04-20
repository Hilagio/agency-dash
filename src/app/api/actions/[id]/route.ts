/**
 * PATCH /api/actions/[id] — update action status (APPROVED, DISMISSED)
 * POST  /api/actions/[id] — execute a safe automated action
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import {
  executeExcludeSearchTerms,
  executeEnableEnhancedConversions,
  executePauseZeroImpressionAdGroups,
  executePauseNonConvertingKeywords,
} from "@/lib/integrations/google-ads-actions";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  // Verify action belongs to org
  const existing = await prisma.actionRecommendation.findFirst({
    where: { id, account: { organizationId: ctx.orgId } },
  });
  if (!existing) return forbidden();

  const { status } = await req.json() as { status: "APPROVED" | "DISMISSED" };

  const action = await prisma.actionRecommendation.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(action);
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const action = await prisma.actionRecommendation.findFirst({
    where: { id, account: { organizationId: ctx.orgId } },
    include: { account: true },
  });
  if (!action) {
    return NextResponse.json({ error: "Action not found" }, { status: 404 });
  }
  if (!action.safeToAutomate) {
    return NextResponse.json(
      { error: "This action is not marked as safe to automate" },
      { status: 400 }
    );
  }
  if (action.status !== "APPROVED") {
    return NextResponse.json(
      { error: "Action must be APPROVED before execution" },
      { status: 400 }
    );
  }

  const googleAdsId = action.account.googleAdsId;
  let log = "";

  try {
    switch (action.actionType) {
      case "EXCLUDE_SEARCH_TERMS":
        log = await executeExcludeSearchTerms(googleAdsId);
        break;
      case "ENABLE_ENHANCED_CONVERSIONS":
        log = await executeEnableEnhancedConversions(googleAdsId);
        break;
      case "PAUSE_ZERO_IMPRESSION_AD_GROUPS":
        log = await executePauseZeroImpressionAdGroups(googleAdsId);
        break;
      case "PAUSE_NON_CONVERTING_KEYWORDS": {
        const payload = action.actionPayload as Record<string, unknown> | null ?? {};
        log = await executePauseNonConvertingKeywords(googleAdsId, payload);
        break;
      }
      case "EXCLUDE_OFF_BRAND_QUERIES": {
        const payload = action.actionPayload as Record<string, unknown> | null ?? {};
        const { executeExcludeOffBrandQueries } = await import("@/lib/integrations/google-ads-actions");
        log = await executeExcludeOffBrandQueries(googleAdsId, payload);
        break;
      }
      // Future scaffolding — acknowledged, not yet automated
      case "REFRESH_RSA_ASSETS":
      case "BUILD_PMAX_ASSET_GROUP":
      case "GENERATE_MONTHLY_REPORT":
        log = `Action type '${action.actionType}' queued at ${new Date().toISOString()}. Automated execution coming — manual follow-up required for now.`;
        break;
      default:
        log = `Action type '${action.actionType}' acknowledged at ${new Date().toISOString()}. Manual follow-up required.`;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Execution failed: ${msg}` }, { status: 502 });
  }

  const updated = await prisma.actionRecommendation.update({
    where: { id },
    data: {
      status: "EXECUTED",
      executedAt: new Date(),
      executionLog: log,
    },
  });

  return NextResponse.json(updated);
}
