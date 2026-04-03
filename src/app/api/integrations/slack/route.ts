/**
 * /api/integrations/slack
 *
 * GET    — return connection status
 * POST   — connect (save bot token, test connection)
 * DELETE — disconnect
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { testSlackConnection } from "@/lib/integrations/slack";

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const conn = await prisma.slackConnection.findUnique({
    where: { organizationId: ctx.orgId },
  });

  if (!conn) return NextResponse.json({ connected: false });
  return NextResponse.json({ connected: true, teamName: conn.teamName, teamId: conn.teamId });
}

export async function POST(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { token } = await req.json() as { token: string };
  if (!token?.trim()) return NextResponse.json({ error: "token required" }, { status: 400 });

  let teamId: string, teamName: string;
  try {
    ({ teamId, teamName } = await testSlackConnection(token.trim()));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Invalid token: ${msg}` }, { status: 400 });
  }

  await prisma.slackConnection.upsert({
    where:  { organizationId: ctx.orgId },
    update: { botToken: token.trim(), teamId, teamName },
    create: { organizationId: ctx.orgId, botToken: token.trim(), teamId, teamName },
  });

  return NextResponse.json({ connected: true, teamName, teamId });
}

export async function DELETE() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  await prisma.slackConnection.deleteMany({ where: { organizationId: ctx.orgId } });
  return NextResponse.json({ ok: true });
}
