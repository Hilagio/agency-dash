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
import { computeAccountSignals } from "@/lib/diagnostics/run-signals";
import { parseDailySales, parseProductSales, parseDiscounts, detectCsvKind } from "@/lib/diagnostics/shopify-csv";

// Stable synthetic id for CSV-sourced products/variants — ProductSalesDaily
// keys on (productId, variantId); the CSV only has titles, so the slug IS the id.
const slugId = (s: string) => "csv:" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Params = { params: Promise<{ id: string }> };

async function ownedAccount(id: string, orgId: string) {
  return prisma.account.findFirst({
    where: { id, organizationId: orgId },
    select: {
      id: true, currency: true, name: true, roasFloor: true, grossMarginPercent: true,
      minSpendForEval: true, minConversionsForEval: true, dataVerified: true,
    },
  });
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
  const csv = typeof body.csv === "string" ? body.csv : "";
  if (!csv.trim()) return NextResponse.json({ error: "No CSV content." }, { status: 400 });
  // "auto" (or no kind): recognise which Shopify report this is from its header,
  // so the team can drop all three exports on the same button.

  // Recompute the diagnosis from the fresh order data so a corrected upload
  // clears (or raises) flags immediately — the status banner reads the stored
  // signals, which otherwise only refresh on the nightly run.
  const recompute = () => computeAccountSignals({
    id: account.id, name: account.name, roasFloor: account.roasFloor,
    grossMarginPercent: account.grossMarginPercent, minSpendForEval: account.minSpendForEval,
    minConversionsForEval: account.minConversionsForEval, dataVerified: account.dataVerified,
  }).catch(() => null);

  const kind = !body.kind || body.kind === "auto" ? detectCsvKind(csv) : body.kind;
  if (kind !== "daily_sales" && kind !== "product_sales" && kind !== "discounts") {
    return NextResponse.json({
      error: "Couldn't recognise this CSV. Supported Shopify reports (each grouped by Day): 'Sales over time', 'Sales by product' / 'Sales by product variant', and 'Sales by discount' — keep Shopify's default column headers.",
    }, { status: 422 });
  }

  // Don't let a manual CSV overwrite live-synced order data.
  const live = await prisma.shopifyConnection.findUnique({ where: { accountId: id }, select: { shopDomain: true } });
  if (live) {
    return NextResponse.json({ error: `This account has a live Shopify connection (${live.shopDomain}) — its orders sync automatically, so a CSV isn't needed and won't be imported.` }, { status: 409 });
  }

  const cur = account.currency ?? "EUR";
  const uploadMark = (rows: number, rangeStart: string | null, rangeEnd: string | null) =>
    prisma.shopifyUpload.upsert({
      where: { accountId_kind: { accountId: id, kind } },
      create: { accountId: id, kind, source: "csv", uploadedBy: ctx.email, rows, rangeStart, rangeEnd },
      update: { source: "csv", uploadedBy: ctx.email, rows, rangeStart, rangeEnd, uploadedAt: new Date() },
    });
  const emptyErr = (report: string) => NextResponse.json({
    error: `Couldn't read any rows. Export Analytics → Reports → '${report}' grouped by Day, and keep Shopify's default column headers.`,
  }, { status: 422 });

  // Each kind replaces the window its file covers, then re-writes it — so a
  // re-upload corrects prior values for the same dates instead of duplicating.
  if (kind === "daily_sales") {
    const parsed = parseDailySales(csv);
    if (!parsed.rows.length) return emptyErr("Sales over time");
    await prisma.$transaction([
      prisma.orderDaily.deleteMany({ where: { accountId: id, date: { gte: parsed.rangeStart!, lte: parsed.rangeEnd! } } }),
      prisma.orderDaily.createMany({
        data: parsed.rows.map(r => ({ accountId: id, date: r.date, orders: r.orders, revenue: r.revenue, currency: cur })),
      }),
      uploadMark(parsed.rows.length, parsed.rangeStart, parsed.rangeEnd),
    ]);
    await recompute();
    return NextResponse.json({ ok: true, kind, rows: parsed.rows.length, skipped: parsed.skipped, rangeStart: parsed.rangeStart, rangeEnd: parsed.rangeEnd });
  }

  if (kind === "product_sales") {
    const parsed = parseProductSales(csv);
    if (!parsed.rows.length) return emptyErr("Sales by product variant");
    await prisma.$transaction([
      prisma.productSalesDaily.deleteMany({ where: { accountId: id, date: { gte: parsed.rangeStart!, lte: parsed.rangeEnd! } } }),
      prisma.productSalesDaily.createMany({
        data: parsed.rows.map(r => ({
          accountId: id, date: r.date,
          productId: slugId(r.title), variantId: r.variantTitle ? slugId(r.variantTitle) : "",
          title: r.title, variantTitle: r.variantTitle,
          units: r.units, revenue: r.revenue, currency: cur,
        })),
      }),
      uploadMark(parsed.rows.length, parsed.rangeStart, parsed.rangeEnd),
    ]);
    await recompute();
    return NextResponse.json({ ok: true, kind, rows: parsed.rows.length, skipped: parsed.skipped, hasVariants: parsed.hasVariants, rangeStart: parsed.rangeStart, rangeEnd: parsed.rangeEnd });
  }

  // kind === "discounts"
  const parsed = parseDiscounts(csv);
  if (!parsed.rows.length) return emptyErr("Sales by discount");
  await prisma.$transaction([
    prisma.discountDaily.deleteMany({ where: { accountId: id, date: { gte: parsed.rangeStart!, lte: parsed.rangeEnd! } } }),
    prisma.discountDaily.createMany({
      data: parsed.rows.map(r => ({ accountId: id, date: r.date, code: r.code, orders: r.orders, discounted: r.discounted, revenue: r.revenue, currency: cur })),
    }),
    uploadMark(parsed.rows.length, parsed.rangeStart, parsed.rangeEnd),
  ]);
  await recompute();
  return NextResponse.json({ ok: true, kind, rows: parsed.rows.length, skipped: parsed.skipped, rangeStart: parsed.rangeStart, rangeEnd: parsed.rangeEnd });
}
