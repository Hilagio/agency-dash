/**
 * POST /api/shopify/flow?key=<flowToken> — receive an order from Shopify Flow.
 *
 * The merchant (or we, with store access) builds a free native Flow:
 *   "When an order is created → Send HTTP request (POST) to this URL"
 * with a small JSON body. No app install, no App Store review, no owner-only
 * custom app. Each account has its own secret `key`, so the URL identifies the
 * account and authorises the push.
 *
 * Idempotent: one ShopifyFlowEvent per (account, orderId), so a retried Flow run
 * can't double-count. New events roll up into OrderDaily — the same table the CSV
 * and OAuth paths feed — so reconciliation/POAS work identically.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function toYmd(v: unknown): string {
  const s = typeof v === "string" ? v : "";
  const d = s ? new Date(s) : new Date(NaN);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

/** Tolerant number parse — Flow may send "€1.234,50", "1234.5", or a number. */
function num(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v !== "string") return 0;
  let s = v.trim().replace(/[^0-9.,-]/g, "");
  const lastComma = s.lastIndexOf(","), lastDot = s.lastIndexOf(".");
  if (lastComma > lastDot) s = s.replace(/\./g, "").replace(",", "."); // EU: 1.234,50
  else s = s.replace(/,/g, "");                                        // US: 1,234.50
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

export async function POST(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key") ?? req.headers.get("x-flow-key") ?? "";
  if (!key) return NextResponse.json({ error: "missing key" }, { status: 401 });

  const account = await prisma.account.findFirst({
    where: { flowToken: key }, select: { id: true, currency: true },
  });
  if (!account) return NextResponse.json({ error: "unknown key" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "bad json" }, { status: 400 });

  // Tolerant extraction — Flow body field names vary by how the merchant set it up.
  const orderId = String(body.id ?? body.order_id ?? body.orderId ?? body.name ?? "").trim();
  if (!orderId) return NextResponse.json({ error: "missing order id" }, { status: 400 });
  const amount = num(body.total ?? body.amount ?? body.total_price ?? body.totalPrice ?? body.currentTotalPrice);
  const currency = String(body.currency ?? body.currencyCode ?? account.currency ?? "EUR").toUpperCase().slice(0, 3);
  const date = toYmd(body.created_at ?? body.createdAt ?? body.processed_at ?? body.processedAt);

  // Idempotency guard: a duplicate (account, orderId) create throws → already counted.
  try {
    await prisma.shopifyFlowEvent.create({ data: { accountId: account.id, orderId, date, amount, currency } });
  } catch {
    return NextResponse.json({ ok: true, deduped: true });
  }

  await prisma.orderDaily.upsert({
    where: { accountId_date: { accountId: account.id, date } },
    create: { accountId: account.id, date, orders: 1, revenue: amount, currency },
    update: { orders: { increment: 1 }, revenue: { increment: amount } },
  });

  // Freshness stamp so the connections strip can show "Shopify · via Flow".
  await prisma.shopifyUpload.upsert({
    where: { accountId_kind: { accountId: account.id, kind: "flow" } },
    create: { accountId: account.id, kind: "flow", source: "flow", rows: 1, rangeStart: date, rangeEnd: date },
    update: { uploadedAt: new Date(), rows: { increment: 1 }, rangeEnd: date },
  }).catch(() => null);

  return NextResponse.json({ ok: true, date, amount });
}
