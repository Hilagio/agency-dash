/**
 * Diagnostic-spine ingestion (BUILD-SPEC §12.1–2).
 *
 * Pulls the daily time-series + change events for one account and writes them
 * into the spine. The window is re-fetched each run and rewritten, so historical
 * rows back-fill as conversions land (§4.2). Change events are additive
 * (skip-duplicates on their stable key).
 */
import { prisma } from "@/lib/db";
import {
  fetchSpineData, type MetricDailyRow, type ProductDailyRow, type SearchTermDailyRow,
} from "@/lib/integrations/google-ads";

/** YYYY-MM-DD, `n` days before today (UTC). */
function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Aggregate rows by a key so the (unique-indexed) createMany can't collide. */
function dedupe<T>(rows: T[], keyOf: (r: T) => string, sumFields: (keyof T)[]): T[] {
  const map = new Map<string, T>();
  for (const r of rows) {
    const k = keyOf(r);
    const existing = map.get(k);
    if (!existing) { map.set(k, { ...r }); continue; }
    for (const f of sumFields) {
      (existing[f] as unknown as number) = (existing[f] as unknown as number) + (r[f] as unknown as number);
    }
  }
  return [...map.values()];
}

export interface IngestResult {
  accountId: string;
  metrics: number;
  products: number;
  searchTerms: number;
  changeEvents: number;
  error?: string;
}

/** Ingest the spine for one account over the trailing `days` window. */
export async function ingestAccountSpine(
  account: { id: string; googleAdsId: string; organizationId: string },
  days = 14,
): Promise<IngestResult> {
  const start = daysAgo(days);
  const end = daysAgo(1); // yesterday — today is incomplete

  try {
    const data = await fetchSpineData(account.googleAdsId, account.organizationId, start, end);

    const metrics = dedupe<MetricDailyRow>(data.metrics, m => `${m.date}|${m.campaignId}`,
      ["spend", "impressions", "clicks", "conversions", "conversionValue"]);
    const products = dedupe<ProductDailyRow>(data.products, p => `${p.date}|${p.landingPageUrl}`,
      ["clicks", "spend", "conversions", "conversionValue"]);
    const searchTerms = dedupe<SearchTermDailyRow>(data.searchTerms, s => `${s.date}|${s.campaignId}|${s.searchTerm}`,
      ["clicks", "cost", "conversions", "conversionValue"]);

    const inWindow = { accountId: account.id, date: { gte: start, lte: end } };

    // Rewrite each daily window (idempotent + back-fills changed history).
    await prisma.$transaction([
      prisma.metricDaily.deleteMany({ where: inWindow }),
      prisma.metricProductDaily.deleteMany({ where: inWindow }),
      prisma.searchTermDaily.deleteMany({ where: inWindow }),
    ]);
    if (metrics.length)     await prisma.metricDaily.createMany({ data: metrics.map(m => ({ accountId: account.id, ...m })) });
    if (products.length)    await prisma.metricProductDaily.createMany({ data: products.map(p => ({ accountId: account.id, ...p })) });
    if (searchTerms.length) await prisma.searchTermDaily.createMany({ data: searchTerms.map(s => ({ accountId: account.id, ...s })) });

    // Change events are immutable once logged — add new ones, skip seen.
    if (data.changeEvents.length) {
      await prisma.changeEvent.createMany({
        data: data.changeEvents.map(c => ({ accountId: account.id, ...c })),
        skipDuplicates: true,
      });
    }

    return {
      accountId: account.id,
      metrics: metrics.length,
      products: products.length,
      searchTerms: searchTerms.length,
      changeEvents: data.changeEvents.length,
    };
  } catch (err) {
    return {
      accountId: account.id, metrics: 0, products: 0, searchTerms: 0, changeEvents: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/** Ingest every active account for an organization. Sequential (OOM caution). */
export async function ingestOrgSpine(organizationId: string, days = 14): Promise<IngestResult[]> {
  const accounts = await prisma.account.findMany({
    where: { organizationId, active: true, archived: false },
    select: { id: true, googleAdsId: true, organizationId: true },
  });
  const out: IngestResult[] = [];
  for (const a of accounts) out.push(await ingestAccountSpine(a, days));
  return out;
}
