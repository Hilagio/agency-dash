/**
 * PATCH /api/actions/[id] — update action status (APPROVED, DISMISSED)
 * POST  /api/actions/[id]/execute — execute a safe automated action
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

  const action = await prisma.actionRecommendation.findUnique({ where: { id } });
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

  // ─── Safe action executor ─────────────────────────────────────────────────
  // In v1 we simulate execution and log it.
  // Real implementation: call Google Ads API here based on action.actionType.
  let log = "";

  switch (action.actionType) {
    case "EXCLUDE_SEARCH_TERMS":
      log = "[SIMULATED] Would call google.ads.searchTermView.list() to fetch irrelevant terms, " +
            "then google.ads.campaignCriterion.mutate() to add negatives. Requires human review list first.";
      break;
    case "ENABLE_ENHANCED_CONVERSIONS":
      log = "[SIMULATED] Would call google.ads.conversionAction.mutate() with enhanced_conversions_settings.enabled = true.";
      break;
    default:
      log = `[SIMULATED] Action type '${action.actionType}' executed at ${new Date().toISOString()}.`;
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
