/**
 * POST /api/diagnostics/account/[id]/tracking — record the team's verdict on
 * conversion tracking for one account.
 *
 * The Expert read's #1 hypothesis is often a tracking break (brand CVR → 0%).
 * Once someone actually fires a test purchase and checks the tag, they mark it
 * here — verified working, or confirmed broken — and it becomes a durable team
 * fact that the read reasons from instead of re-hypothesising every time.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

const VALID = new Set(["verified", "broken"]);

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: { id: true },
  });
  if (!account) return forbidden();

  const body = await req.json().catch(() => ({})) as { status?: string | null; note?: string };
  const raw = body.status;
  // null / "" / "unknown" clears the verdict back to unknown.
  const clearing = raw == null || raw === "" || raw === "unknown";
  if (!clearing && !VALID.has(raw as string)) {
    return NextResponse.json({ error: "status must be 'verified', 'broken', or null." }, { status: 400 });
  }

  const now = new Date();
  const updated = await prisma.account.update({
    where: { id },
    data: clearing
      ? { trackingStatus: null, trackingNote: null, trackingSetAt: null, trackingSetBy: null }
      : {
          trackingStatus: raw as string,
          trackingNote: body.note?.slice(0, 500) ?? null,
          trackingSetAt: now,
          trackingSetBy: ctx.email || ctx.userId,
        },
    select: { trackingStatus: true, trackingNote: true, trackingSetAt: true, trackingSetBy: true },
  });

  return NextResponse.json({ tracking: updated });
}
