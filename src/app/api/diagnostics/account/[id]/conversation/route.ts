/**
 * GET  /api/diagnostics/account/[id]/conversation — the persisted agent thread.
 * DELETE — clear it (start fresh).
 *
 * The ongoing, team-shared conversation for one account (§agent memory): the
 * agent's reads plus the context the team fed back. The cockpit hydrates from
 * this so a read isn't lost on refresh and the next person sees the thread.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

async function ownedAccount(id: string, orgId: string) {
  return prisma.account.findFirst({ where: { id, organizationId: orgId }, select: { id: true } });
}

export async function GET(_req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!(await ownedAccount(id, ctx.orgId))) return forbidden();

  const messages = await prisma.agentMessage.findMany({
    where: { accountId: id },
    orderBy: { createdAt: "asc" },
    select: { id: true, role: true, content: true, kind: true, author: true, createdAt: true },
  });
  return NextResponse.json({ messages });
}

export async function DELETE(_req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!(await ownedAccount(id, ctx.orgId))) return forbidden();

  await prisma.agentMessage.deleteMany({ where: { accountId: id } });
  return NextResponse.json({ ok: true });
}
