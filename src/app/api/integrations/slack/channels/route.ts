/**
 * GET /api/integrations/slack/channels
 *
 * Returns the list of Slack channels the bot has access to.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { listSlackChannels } from "@/lib/integrations/slack";

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const conn = await prisma.slackConnection.findUnique({ where: { organizationId: ctx.orgId } });
  if (!conn) return NextResponse.json({ error: "Slack not connected" }, { status: 404 });

  try {
    const channels = await listSlackChannels(conn.botToken);
    return NextResponse.json({ channels });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
