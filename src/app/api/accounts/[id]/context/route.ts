/**
 * GET/PUT /api/accounts/[id]/context — the Client Context Pack (SOP v2.0).
 * The six enrichment inputs the data can't fetch; drives the 90-day plan.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

export const dynamic = "force-dynamic";
type Params = { params: Promise<{ id: string }> };

const FIELDS = ["amName", "goal", "mainKpi", "targetRoasNote", "adsStartedNote", "strategyPreference", "usps", "audienceNuances", "makeOrBreak", "anythingElse"] as const;

async function ensureAccount(id: string, orgId: string) {
  return prisma.account.findFirst({ where: { id, organizationId: orgId }, select: { id: true } });
}

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!(await ensureAccount(id, ctx.orgId))) return forbidden();
  const pack = await prisma.clientContext.findUnique({ where: { accountId: id } });
  return NextResponse.json({ context: pack });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!(await ensureAccount(id, ctx.orgId))) return forbidden();

  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  const data: Record<string, unknown> = { updatedBy: ctx.email || ctx.userId };
  for (const f of FIELDS) if (f in body) data[f] = typeof body[f] === "string" ? (body[f] as string).slice(0, 4000) : null;
  if ("defaultLanguage" in body) data.defaultLanguage = body.defaultLanguage === "nl" ? "nl" : "en";
  if ("netMarginPct" in body) { const n = Number(body.netMarginPct); data.netMarginPct = Number.isFinite(n) && n > 0 && n <= 1 ? n : null; }
  if ("breakEvenRoas" in body) { const n = Number(body.breakEvenRoas); data.breakEvenRoas = Number.isFinite(n) && n > 0 ? n : null; }

  const pack = await prisma.clientContext.upsert({
    where: { accountId: id },
    create: { accountId: id, ...data },
    update: data,
  });
  return NextResponse.json({ context: pack });
}
