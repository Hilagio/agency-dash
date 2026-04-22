import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { randomBytes } from "crypto";

type Params = { params: Promise<{ id: string }> };

// POST — generate (or return existing) intake token for this account
export async function POST(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;
  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  // Return existing token if already set
  if (account.intakeToken) {
    return NextResponse.json({ token: account.intakeToken });
  }

  const token = randomBytes(20).toString("hex");
  await prisma.account.update({ where: { id }, data: { intakeToken: token } });
  return NextResponse.json({ token });
}
