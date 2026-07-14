/**
 * Order-feed ingestion (BUILD-SPEC §4.3/§8, Phase 8).
 *
 * Pulls the daily order series from Shopify for accounts that have a connection,
 * and writes OrderDaily — the table the signal engine reconciles against Google
 * Ads conversions. Idempotent: the trailing window is rewritten each run.
 */
import { prisma } from "@/lib/db";
import { fetchOrdersByDay, shopifyAppConfig } from "@/lib/integrations/shopify";

function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

export interface OrderIngestResult {
  accountId: string;
  days: number;
  orderDays: number;
  skipped?: "no-connection";
  error?: string;
}

/** Ingest the Shopify order series for one account over the trailing window. */
export async function ingestAccountOrders(accountId: string, days = 14): Promise<OrderIngestResult> {
  const conn = await prisma.shopifyConnection.findUnique({ where: { accountId } });
  if (!conn) return { accountId, days, orderDays: 0, skipped: "no-connection" };

  const start = daysAgo(days);
  const end = daysAgo(1);
  const apiVersion = shopifyAppConfig()?.apiVersion;

  try {
    const series = await fetchOrdersByDay(conn.shopDomain, conn.accessToken, start, end, apiVersion);
    const inWindow = { accountId, date: { gte: start, lte: end } };

    await prisma.$transaction([
      prisma.orderDaily.deleteMany({ where: inWindow }),
      ...(series.length
        ? [prisma.orderDaily.createMany({
            data: series.map(s => ({ accountId, date: s.date, orders: s.orders, revenue: s.revenue, currency: s.currency })),
          })]
        : []),
      prisma.shopifyConnection.update({ where: { accountId }, data: { lastSyncAt: new Date() } }),
    ]);

    return { accountId, days, orderDays: series.length };
  } catch (err) {
    return { accountId, days, orderDays: 0, error: err instanceof Error ? err.message : String(err) };
  }
}

/** Ingest orders for every connected account in an org. Sequential (OOM caution). */
export async function ingestOrgOrders(organizationId: string, days = 14): Promise<OrderIngestResult[]> {
  const conns = await prisma.shopifyConnection.findMany({
    where: { account: { organizationId, active: true, archived: false } },
    select: { accountId: true },
  });
  const out: OrderIngestResult[] = [];
  for (const c of conns) out.push(await ingestAccountOrders(c.accountId, days));
  return out;
}
