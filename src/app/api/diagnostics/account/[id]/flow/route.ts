/**
 * GET  /api/diagnostics/account/[id]/flow — the account's Shopify Flow webhook
 *      URL (minted on first request) + the JSON body to paste into Flow + status.
 * POST /api/diagnostics/account/[id]/flow — rotate the secret (old URL stops working).
 *
 * This is the free, no-app, no-review Shopify path: the merchant builds a native
 * Flow ("order created → send HTTP request") pointed at this URL. The endpoint
 * that receives the pushes is /api/shopify/flow.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

function newToken(): string {
  return (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, "");
}

function baseUrl(): string {
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN;
  return domain ? `https://${domain}` : "https://agency-dash-production.up.railway.app";
}

// The JSON body the merchant pastes into Flow's "Send HTTP request" action.
// Uses Shopify Flow's Liquid order variables; our receiver is tolerant of names.
const BODY_TEMPLATE = `{
  "id": "{{order.id}}",
  "created_at": "{{order.createdAt}}",
  "total": "{{order.currentTotalPriceSet.shopMoney.amount}}",
  "currency": "{{order.currentTotalPriceSet.shopMoney.currencyCode}}"
}`;

async function payload(accountId: string, token: string) {
  const [count, stamp] = await Promise.all([
    prisma.shopifyFlowEvent.count({ where: { accountId } }),
    prisma.shopifyUpload.findUnique({ where: { accountId_kind: { accountId, kind: "flow" } }, select: { uploadedAt: true } }),
  ]);
  return {
    url: `${baseUrl()}/api/shopify/flow?key=${token}`,
    method: "POST",
    contentType: "application/json",
    bodyTemplate: BODY_TEMPLATE,
    ordersReceived: count,
    lastReceivedAt: stamp?.uploadedAt ?? null,
    connected: count > 0,
  };
}

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId }, select: { id: true, flowToken: true } });
  if (!account) return forbidden();

  let token = account.flowToken;
  if (!token) {
    token = newToken();
    await prisma.account.update({ where: { id: account.id }, data: { flowToken: token } });
  }
  return NextResponse.json(await payload(account.id, token));
}

export async function POST(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId }, select: { id: true } });
  if (!account) return forbidden();

  const token = newToken();
  await prisma.account.update({ where: { id: account.id }, data: { flowToken: token } });
  return NextResponse.json(await payload(account.id, token));
}
