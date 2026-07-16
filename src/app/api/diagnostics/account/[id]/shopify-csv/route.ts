/**
 * POST /api/diagnostics/account/[id]/shopify-csv — upload a Shopify CSV export
 * by hand (the no-API fallback for accounts we can't connect live).
 * GET — the current upload marks (so the UI can show "uploaded N days ago").
 *
 * kind "daily_sales": the "Sales over time" report → OrderDaily. The data is
 * kept and used until it's replaced; a ShopifyUpload mark records WHEN it was
 * uploaded and the range it covers, so the agent always states how old it is.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { parseDailySales } from "@/lib/diagnostics/shopify-csv";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Params = { params: Promise<{ id: string }> };

async function ownedAccount(id: string, orgId: string) {
  return prisma.account.findFirst({ where: { id, organizationId: orgId }, select: { id: true, currency: true } });
}

export async function GET(_req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!(await ownedAccount(id, ctx.orgId))) return forbidden();
  const uploads = await prisma.shopifyUpload.findMany({
    where: { accountId: id },
    select: { kind: true, source: true, uploadedAt: true, uploadedBy: true, rows: true, rangeStart: true, rangeEnd: true },
  });
  return NextResponse.json({ uploads });
}

export async function POST(req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  const account = await ownedAccount(id, ctx.orgId);
  if (!account) return forbidden();

  let body: { kind?: string; csv?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid body." }, { status: 400 }); }
  const kind = body.kind ?? "daily_sales";
  const csv = typeof body.csv === "string" ? body.csv : "";
  if (!csv.trim()) return NextResponse.json({ error: "No CSV content." }, { status: 400 });

  if (kind !== "daily_sales") {
    return NextResponse.json({ error: `Upload kind "${kind}" isn't supported yet — only daily_sales.` }, { status: 400 });
  }

  const parsed = parseDailySales(csv);
  if (!parsed.rows.length) {
    return NextResponse.json({
      error: "Couldn't read any daily rows. Export Analytics → Reports → 'Sales over time' grouped by Day, and keep Shopify's default column headers (Day, Orders, Net sales).",
    }, { status: 422 });
  }

  const cur = account.currency ?? "EUR";
  // Replace the window this file covers, then re-write it — so a re-upload
  // corrects any prior values for the same dates instead of duplicating.
  await prisma.$transaction([
    prisma.orderDaily.deleteMany({ where: { accountId: id, date: { gte: parsed.rangeStart!, lte: parsed.rangeEnd! } } }),
    prisma.orderDaily.createMany({
      data: parsed.rows.map(r => ({ accountId: id, date: r.date, orders: r.orders, revenue: r.revenue, currency: cur })),
    }),
    prisma.shopifyUpload.upsert({
      where: { accountId_kind: { accountId: id, kind } },
      create: { accountId: id, kind, source: "csv", uploadedBy: ctx.email, rows: parsed.rows.length, rangeStart: parsed.rangeStart, rangeEnd: parsed.rangeEnd },
      update: { source: "csv", uploadedBy: ctx.email, rows: parsed.rows.length, rangeStart: parsed.rangeStart, rangeEnd: parsed.rangeEnd, uploadedAt: new Date() },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    kind,
    rows: parsed.rows.length,
    skipped: parsed.skipped,
    rangeStart: parsed.rangeStart,
    rangeEnd: parsed.rangeEnd,
  });
}
