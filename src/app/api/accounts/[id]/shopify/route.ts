/**
 * Shopify connection management for an account (Phase 1 — custom-app Admin API token).
 *   GET    → connection status
 *   POST   → verify + save { shopDomain, accessToken }
 *   DELETE → disconnect
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { verifyShopifyConnection, normaliseShopDomain } from "@/lib/integrations/shopify";

type Params = { params: Promise<{ id: string }> };

async function ownAccount(id: string, orgId: string) {
  return prisma.account.findFirst({ where: { id, organizationId: orgId }, select: { id: true } });
}

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!(await ownAccount(id, ctx.orgId))) return forbidden();

  const conn = await prisma.shopifyConnection.findUnique({
    where: { accountId: id },
    select: { shopDomain: true, createdAt: true },
  });
  return NextResponse.json({ connected: !!conn, shopDomain: conn?.shopDomain ?? null });
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!(await ownAccount(id, ctx.orgId))) return forbidden();

  const body = (await req.json().catch(() => ({}))) as { shopDomain?: string; accessToken?: string };
  const shopDomain = normaliseShopDomain(body.shopDomain ?? "");
  const accessToken = (body.accessToken ?? "").trim();
  if (!shopDomain || !accessToken) {
    return NextResponse.json({ error: "Shop domain and access token are required" }, { status: 400 });
  }

  const check = await verifyShopifyConnection(shopDomain, accessToken);
  if (!check.ok) {
    return NextResponse.json({ error: `Could not connect: ${check.error}` }, { status: 400 });
  }

  await prisma.shopifyConnection.upsert({
    where: { accountId: id },
    update: { shopDomain, accessToken },
    create: { accountId: id, shopDomain, accessToken },
  });

  return NextResponse.json({ ok: true, shop: check.shop, currency: check.currency, shopDomain });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!(await ownAccount(id, ctx.orgId))) return forbidden();

  await prisma.shopifyConnection.deleteMany({ where: { accountId: id } });
  return NextResponse.json({ ok: true });
}
