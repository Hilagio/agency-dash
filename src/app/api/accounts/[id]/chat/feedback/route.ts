/**
 * POST /api/accounts/[id]/chat/feedback
 *
 * Stores thumbs-up / thumbs-down feedback on an assistant message.
 * On thumbs-down, an optional correction is stored and checked against
 * existing LearnedPatterns to detect cross-org recurring corrections.
 *
 * Cross-org learning: if the same correction text (case-insensitive, trimmed)
 * appears from 3+ distinct orgs, a global LearnedPattern is upserted automatically.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const GLOBAL_PATTERN_THRESHOLD = 3;

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id: accountId } = await params;

  // Verify account belongs to org
  const account = await prisma.account.findFirst({ where: { id: accountId, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  const { messageId, rating, correction, questionText } = await req.json() as {
    messageId:    string;
    rating:       "up" | "down";
    correction?:  string;
    questionText?: string;
  };

  if (!messageId || !["up", "down"].includes(rating)) {
    return NextResponse.json({ error: "messageId and rating (up|down) required" }, { status: 400 });
  }

  // Upsert: one feedback record per message (replace if re-rated)
  await prisma.chatFeedback.deleteMany({ where: { messageId, orgId: ctx.orgId } });
  await prisma.chatFeedback.create({
    data: {
      messageId,
      orgId:        ctx.orgId,
      rating,
      correction:   correction?.trim() || null,
      questionText: questionText?.trim() || null,
    },
  });

  // Cross-org pattern detection for thumbs-down with corrections
  if (rating === "down" && correction?.trim()) {
    const normalised = correction.trim().toLowerCase();

    // Find how many distinct orgs have submitted this same correction
    const matching = await prisma.chatFeedback.findMany({
      where: { rating: "down", correction: { not: null } },
      select: { orgId: true, correction: true },
    });

    const distinctOrgs = new Set(
      matching
        .filter(f => f.correction!.trim().toLowerCase() === normalised)
        .map(f => f.orgId)
    );

    if (distinctOrgs.size >= GLOBAL_PATTERN_THRESHOLD) {
      // Check if a global pattern for this correction already exists
      const existing = await prisma.learnedPattern.findFirst({
        where: { orgId: null, pattern: { contains: correction.trim() } },
      });

      if (!existing) {
        await prisma.learnedPattern.create({
          data: {
            orgId:        null,
            questionType: `Auto-promoted: ${(questionText ?? "").slice(0, 60) || "recurring correction"}`,
            pattern:      correction.trim(),
            seenCount:    distinctOrgs.size,
            isActive:     true,
          },
        });
      } else {
        await prisma.learnedPattern.update({
          where: { id: existing.id },
          data:  { seenCount: distinctOrgs.size, updatedAt: new Date() },
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
