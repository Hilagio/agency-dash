/**
 * PATCH /api/actions/[id] — update action status (APPROVED, DISMISSED)
 * POST  /api/actions/[id] — execute a safe automated action
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  executeExcludeSearchTerms,
  executeEnableEnhancedConversions,
} from "@/lib/integrations/google-ads-actions";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const { status } = body as { status: "APPROVED" | "DISMISSED" };

  const action = await prisma.actionRecommendation.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(action);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;

  const action = await prisma.actionRecommendation.findUnique({
    where: { id },
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
