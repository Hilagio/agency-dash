/**
 * GET    /api/diagnostics/account/[id]/documents/[docId] — fetch a saved doc's
 *        HTML (to open/download).
 * DELETE — remove it from the library.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string; docId: string }> };

async function ownedAccount(id: string, orgId: string) {
  return prisma.account.findFirst({ where: { id, organizationId: orgId }, select: { id: true } });
}

export async function GET(_req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id, docId } = await params;
  if (!(await ownedAccount(id, ctx.orgId))) return forbidden();

  const doc = await prisma.generatedDoc.findFirst({
    where: { id: docId, accountId: id },
    select: { html: true, filename: true, title: true, docType: true },
  });
  if (!doc) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(_req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id, docId } = await params;
  if (!(await ownedAccount(id, ctx.orgId))) return forbidden();

  await prisma.generatedDoc.deleteMany({ where: { id: docId, accountId: id } });
  return NextResponse.json({ ok: true });
}
