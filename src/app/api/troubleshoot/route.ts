/**
 * GET /api/troubleshoot — connection health for the whole system.
 *
 * Live-probes each integration (database, Google Ads, Shopify per store, Notion,
 * Slack) and reports which env config is present. No secret VALUES are ever
 * returned — only booleans and error messages. Session-scoped.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { pingGoogleAds } from "@/lib/integrations/google-ads";
import { pingShopify, shopifyAppConfig } from "@/lib/integrations/shopify";
import { pingNotion } from "@/lib/integrations/notion";
import { testSlackConnection } from "@/lib/integrations/slack";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Status = "ok" | "warn" | "fail";
interface Check {
  key: string;
  label: string;
  status: Status;
  detail: string;
  hint?: string;
  items?: { name: string; ok: boolean; note?: string }[];
}

const HOURS = 3600_000;

async function checkDatabase(): Promise<Check> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { key: "database", label: "Database", status: "ok", detail: "Reachable." };
  } catch (err) {
    return { key: "database", label: "Database", status: "fail", detail: err instanceof Error ? err.message : String(err), hint: "Check DATABASE_URL and that Postgres is up." };
  }
}

async function checkGoogleAds(orgId: string): Promise<Check> {
  const p = await pingGoogleAds(orgId);
  if (p.ok) return { key: "google_ads", label: "Google Ads API", status: "ok", detail: `Live — ${p.accountCount ?? 0} accessible account(s).` };
  return { key: "google_ads", label: "Google Ads API", status: "fail", detail: p.error ?? "unknown error", hint: p.hint };
}

async function checkShopify(orgId: string, now: Date): Promise<Check> {
  const app = shopifyAppConfig();
  const conns = await prisma.shopifyConnection.findMany({
    where: { account: { organizationId: orgId } },
    select: { shopDomain: true, accessToken: true, lastSyncAt: true, account: { select: { name: true } } },
    take: 20,
  });
  if (conns.length === 0) {
    return {
      key: "shopify", label: "Shopify",
      status: "warn",
      detail: app ? "App configured, but no stores connected yet." : "Not set up (no app credentials, no stores).",
      hint: app ? "Connect a store from its diagnosis page." : "Set SHOPIFY_API_KEY / SHOPIFY_API_SECRET, then connect stores.",
    };
  }
  const apiVersion = app?.apiVersion;
  const items = await Promise.all(conns.map(async (c) => {
    const p = await pingShopify(c.shopDomain, c.accessToken, apiVersion);
    const stale = !c.lastSyncAt || (now.getTime() - c.lastSyncAt.getTime()) > 48 * HOURS;
    return {
      name: `${c.account?.name ?? c.shopDomain}`,
      ok: p.ok,
      note: p.ok ? (stale ? "token OK · sync stale (>48h)" : "OK") : (p.error ?? "failed"),
    };
  }));
  const failing = items.filter(i => !i.ok).length;
  const stale = items.filter(i => i.ok && i.note?.includes("stale")).length;
  return {
    key: "shopify", label: "Shopify",
    status: failing ? "fail" : stale ? "warn" : "ok",
    detail: `${items.length} store(s) · ${items.length - failing} live${failing ? ` · ${failing} failing` : ""}${stale ? ` · ${stale} stale` : ""}.`,
    hint: failing ? "A failing token usually means the store uninstalled the app or the token was revoked — reconnect it." : undefined,
    items,
  };
}

async function checkNotion(orgId: string): Promise<Check> {
  const conn = await prisma.notionConnection.findUnique({ where: { organizationId: orgId } });
  if (!conn) return { key: "notion", label: "Notion", status: "warn", detail: "Not connected." };
  const p = await pingNotion(conn.accessToken);
  return p.ok
    ? { key: "notion", label: "Notion", status: "ok", detail: `Live — ${p.workspace ?? "connected"}.` }
    : { key: "notion", label: "Notion", status: "fail", detail: p.error ?? "unknown error", hint: "Re-authorize the Notion integration." };
}

async function checkSlack(orgId: string): Promise<Check> {
  const conn = await prisma.slackConnection.findUnique({ where: { organizationId: orgId } });
  if (!conn) return { key: "slack", label: "Slack", status: "warn", detail: "Not connected." };
  try {
    const r = await testSlackConnection(conn.botToken);
    return { key: "slack", label: "Slack", status: "ok", detail: `Live — ${r.teamName || r.teamId}.` };
  } catch (err) {
    return { key: "slack", label: "Slack", status: "fail", detail: err instanceof Error ? err.message : String(err), hint: "Bot token may be revoked or missing scopes — reinstall the Slack app." };
  }
}

function checkConfig(): Check {
  const vars: [string, boolean][] = [
    ["DATABASE_URL", !!process.env.DATABASE_URL],
    ["GOOGLE_ADS_DEVELOPER_TOKEN", !!process.env.GOOGLE_ADS_DEVELOPER_TOKEN],
    ["GOOGLE_ADS_CLIENT_ID", !!process.env.GOOGLE_ADS_CLIENT_ID],
    ["GOOGLE_ADS_CLIENT_SECRET", !!process.env.GOOGLE_ADS_CLIENT_SECRET],
    ["SHOPIFY_API_KEY", !!process.env.SHOPIFY_API_KEY],
    ["SHOPIFY_API_SECRET", !!process.env.SHOPIFY_API_SECRET],
    ["CRON_SECRET", !!process.env.CRON_SECRET],
    ["RAILWAY_PUBLIC_DOMAIN", !!process.env.RAILWAY_PUBLIC_DOMAIN],
    ["ANTHROPIC_API_KEY", !!process.env.ANTHROPIC_API_KEY],
  ];
  const missing = vars.filter(([, set]) => !set).map(([n]) => n);
  return {
    key: "config", label: "Environment config",
    status: missing.length === 0 ? "ok" : "warn",
    detail: missing.length === 0 ? "All expected variables are set." : `Missing: ${missing.join(", ")}.`,
    hint: missing.length ? "Set the missing variables on Railway (values are never shown here)." : undefined,
    items: vars.map(([name, set]) => ({ name, ok: set, note: set ? "set" : "missing" })),
  };
}

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const now = new Date();

  const checks = await Promise.all([
    checkDatabase(),
    checkGoogleAds(ctx.orgId),
    checkShopify(ctx.orgId, now),
    checkNotion(ctx.orgId),
    checkSlack(ctx.orgId),
    Promise.resolve(checkConfig()),
  ]);

  const worst: Status = checks.some(c => c.status === "fail") ? "fail" : checks.some(c => c.status === "warn") ? "warn" : "ok";
  return NextResponse.json({ overall: worst, checkedAt: now.toISOString(), checks });
}
