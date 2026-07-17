/**
 * POST /api/diagnostics/briefings — generate the portfolio morning briefing.
 *
 * For every flagged (red/yellow) account, produce a one-line agent opener from
 * already-stored data and persist it on the account. Runs AFTER run-signals in
 * the nightly refresh. Session (caller's org) or CRON_SECRET (all orgs).
 *
 * Bounded fan-out: one cheap model call per flagged account, a few at a time —
 * enough to finish a large portfolio inside the request timeout without a
 * thundering herd of model calls.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { generateAccountBriefing } from "@/lib/diagnostics/briefing";
import { postSlackMessage } from "@/lib/integrations/slack";

/**
 * Proactive alert: after the briefings are written, post the accounts in the RED
 * to an INTERNAL Slack channel (env SLACK_ALERTS_CHANNEL) so the team is pinged
 * at ~7am instead of waiting to open the cockpit. Never posts to a client's own
 * channel. No-op if the channel isn't configured or there's no Slack bot.
 */
async function postRedAlert(organizationId: string): Promise<void> {
  const channel = process.env.SLACK_ALERTS_CHANNEL;
  if (!channel) return;
  const conn = await prisma.slackConnection.findUnique({ where: { organizationId }, select: { botToken: true } });
  if (!conn) return;

  const accounts = await prisma.account.findMany({
    where: { organizationId, active: true, archived: false },
    select: { id: true, name: true, briefing: true },
  });
  const reds: { name: string; briefing: string | null }[] = [];
  for (const a of accounts) {
    const st = await prisma.accountStatus.findFirst({ where: { accountId: a.id }, orderBy: { computedAt: "desc" }, select: { status: true } });
    if (st?.status === "red") reds.push({ name: a.name, briefing: a.briefing });
  }
  if (!reds.length) return;

  const base = process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : "";
  const lines = reds.slice(0, 25).map(r => `🔴 *${r.name}* — ${r.briefing ?? "flagged, needs a look"}`);
  const text = `*Ecomtrada AI — overnight check*\n${reds.length} account${reds.length === 1 ? "" : "s"} in the red:\n${lines.join("\n")}${base ? `\n\nOpen the cockpit → ${base}/` : ""}`;
  await postSlackMessage(conn.botToken, channel, text);
}

export const dynamic = "force-dynamic";
export const maxDuration = 800;

function isCron(req: NextRequest): boolean {
  const s = process.env.CRON_SECRET;
  return !!s && (req.headers.get("authorization") === `Bearer ${s}` || req.headers.get("x-cron-secret") === s);
}

async function run(where: { organizationId?: string }) {
  const accounts = await prisma.account.findMany({
    where: { ...where, active: true, archived: false },
    select: { id: true },
  });
  let generated = 0, cleared = 0, failed = 0;
  let cursor = 0;
  const concurrency = 4;
  async function worker() {
    while (cursor < accounts.length) {
      const a = accounts[cursor++];
      try {
        const r = await generateAccountBriefing(a.id);
        if (r?.text) generated++; else cleared++;
      } catch { failed++; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, accounts.length) || 1 }, () => worker()));
  // Ping the team on Slack about the reds (best-effort, internal channel only).
  if (where.organizationId) await postRedAlert(where.organizationId).catch(() => null);
  return { accounts: accounts.length, generated, cleared, failed };
}

export async function POST(req: NextRequest) {
  if (isCron(req)) {
    const orgs = await prisma.account.findMany({ where: { active: true }, select: { organizationId: true }, distinct: ["organizationId"] });
    const results = [];
    for (const o of orgs) results.push({ organizationId: o.organizationId, ...(await run({ organizationId: o.organizationId })) });
    return NextResponse.json({ mode: "cron", orgs: results.length, results });
  }
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  return NextResponse.json({ mode: "manual", ...(await run({ organizationId: ctx.orgId })) });
}
