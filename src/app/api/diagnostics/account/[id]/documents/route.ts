/**
 * GET /api/diagnostics/account/[id]/documents — the account's document library.
 *
 * Metadata only (no HTML) so the list is light; fetch one by id from
 * /documents/[docId] to open or download it.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId }, select: { id: true } });
  if (!account) return forbidden();

  const docs = await prisma.generatedDoc.findMany({
    where: { accountId: id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, title: true, docType: true, format: true, language: true, filename: true, createdBy: true, createdAt: true },
  });
  return NextResponse.json({ docs });
}
