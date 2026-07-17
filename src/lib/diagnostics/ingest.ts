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
  fetchSpineData, describeGoogleAdsError,
  type MetricDailyRow, type ProductDailyRow, type ProductAdsDailyRow, type SearchTermDailyRow,
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
  productAds: number;
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
  // Heavy tables (landing pages / items / terms) are only kept ~30 days, so
  // fetch them for that shorter window — pulling 90 days of them into memory is
  // what took the app down during backfill.
  const heavyStart = daysAgo(Math.min(days, 30));

  try {
    const data = await fetchSpineData(account.googleAdsId, account.organizationId, start, end, heavyStart);

    const metrics = dedupe<MetricDailyRow>(data.metrics, m => `${m.date}|${m.campaignId}`,
      ["spend", "impressions", "clicks", "conversions", "conversionValue"]);
    const products = dedupe<ProductDailyRow>(data.products, p => `${p.date}|${p.landingPageUrl}`,
      ["clicks", "spend", "conversions", "conversionValue"]);
    const productAds = dedupe<ProductAdsDailyRow>(data.productAds, p => `${p.date}|${p.itemId}`,
      ["spend", "clicks", "impressions", "conversions", "conversionValue"]);
    const searchTerms = dedupe<SearchTermDailyRow>(data.searchTerms, s => `${s.date}|${s.campaignId}|${s.searchTerm}`,
      ["clicks", "cost", "conversions", "conversionValue"]);

    // The heavy tables are already fetched only for the last 30 days (heavyStart
    // above); this is a belt-and-braces filter in case a fetch returns more.
    const productsCapped = products.filter(p => p.date >= heavyStart);
    const productAdsCapped = productAds.filter(p => p.date >= heavyStart);
    const searchTermsCapped = searchTerms.filter(s => s.date >= heavyStart);

    const inWindow = { accountId: account.id, date: { gte: start, lte: end } };
    const heavyWindow = { accountId: account.id, date: { gte: heavyStart, lte: end } };

    // Rewrite each daily window (idempotent + back-fills changed history).
    await prisma.$transaction([
      prisma.metricDaily.deleteMany({ where: inWindow }),
      prisma.metricProductDaily.deleteMany({ where: heavyWindow }),
      prisma.productAdsDaily.deleteMany({ where: heavyWindow }),
      prisma.searchTermDaily.deleteMany({ where: heavyWindow }),
    ]);

    // Retention: purge stale high-cardinality rows so the volume stays bounded
    // and can never fill the disk again (this is what took Postgres down).
    const stale = { accountId: account.id, date: { lt: daysAgo(45) } };
    await prisma.$transaction([
      prisma.metricProductDaily.deleteMany({ where: stale }),
      prisma.productAdsDaily.deleteMany({ where: stale }),
      prisma.searchTermDaily.deleteMany({ where: stale }),
    ]);

    // Insert in chunks — a single multi-thousand-row INSERT blows the WAL and
    // can fill the disk mid-write; small batches keep memory + WAL bounded.
    const CHUNK = 500;
    const chunked = async <T>(rows: T[], create: (batch: T[]) => Promise<unknown>) => {
      for (let i = 0; i < rows.length; i += CHUNK) await create(rows.slice(i, i + CHUNK));
    };
    await chunked(metrics.map(m => ({ accountId: account.id, ...m })), d => prisma.metricDaily.createMany({ data: d }));
    await chunked(productsCapped.map(p => ({ accountId: account.id, ...p })), d => prisma.metricProductDaily.createMany({ data: d }));
    await chunked(productAdsCapped.map(p => ({ accountId: account.id, ...p })), d => prisma.productAdsDaily.createMany({ data: d }));
    await chunked(searchTermsCapped.map(s => ({ accountId: account.id, ...s })), d => prisma.searchTermDaily.createMany({ data: d }));

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
      products: productsCapped.length,
      productAds: productAdsCapped.length,
      searchTerms: searchTermsCapped.length,
      changeEvents: data.changeEvents.length,
    };
  } catch (err) {
    return {
      accountId: account.id, metrics: 0, products: 0, productAds: 0, searchTerms: 0, changeEvents: 0,
      error: describeGoogleAdsError(err),
    };
  }
}

/**
 * Ingest every active account for an organization with bounded concurrency.
 *
 * Sequential ingestion of a large portfolio (~79 accounts) ran past the request
 * timeout → 502. A small pool finishes it in a fraction of the wall time while
 * keeping only `concurrency` accounts' raw data in memory at once (the original
 * OOM caution), and each account still catches its own errors so one bad account
 * can't sink the run. Order is preserved.
 */
export async function ingestOrgSpine(organizationId: string, days = 14, concurrency = 5): Promise<IngestResult[]> {
  const accounts = await prisma.account.findMany({
    where: { organizationId, active: true, archived: false },
    select: { id: true, googleAdsId: true, organizationId: true },
  });
  const out: IngestResult[] = new Array(accounts.length);
  let cursor = 0;
  async function worker() {
    while (cursor < accounts.length) {
      const i = cursor++;
      try { out[i] = await ingestAccountSpine(accounts[i], days); }
      catch (err) { out[i] = { accountId: accounts[i].id, metrics: 0, products: 0, productAds: 0, searchTerms: 0, changeEvents: 0, error: describeGoogleAdsError(err) }; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, accounts.length) || 1 }, () => worker()));
  return out;
}
