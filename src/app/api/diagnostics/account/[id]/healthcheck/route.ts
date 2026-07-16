/**
 * GET /api/diagnostics/account/[id]/healthcheck — the fundamentals check as
 * structured data, so the diagnostic page can show a health strip the instant
 * it loads (tracking → feed → spend → sales → efficiency, each pass/⚠/fail).
 * Same computeVitals the agent runs, so the panel and the read never disagree.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { computeVitals } from "@/lib/diagnostics/agent-tools";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: { id: true, googleAdsId: true, organizationId: true, currency: true, merchantCenterId: true },
  });
  if (!account) return forbidden();

  try {
    const vitals = await computeVitals(account);
    return NextResponse.json({ vitals, checkedAt: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Health check failed." }, { status: 500 });
  }
}
