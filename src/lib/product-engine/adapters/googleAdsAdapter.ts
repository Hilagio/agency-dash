// Adapter: Google Ads API result -> RawRow[].

import { RawRow } from '../engine/types';

export type FetchProductRows = (accountId: string, opts?: { dateRange?: string }) => Promise<RawRow[]>;

/** Shape of a single row as returned by google-ads-node (snake_case nested). */
export interface GoogleAdsApiRow {
  segments?: {
    product_item_id?: string;
    product_title?: string;
    product_feed_label?: string;
  };
  metrics?: {
    clicks?: number | string;
    cost_micros?: number | string;
    conversions?: number | string;
    conversions_value?: number | string;
  };
  issues?: string;
}

/** Map raw API rows (snake_case from google-ads-node) to engine RawRows. */
export function mapGoogleAdsRows(apiRows: GoogleAdsApiRow[], currency: string): RawRow[] {
  const n = (v: unknown) => {
    const f = typeof v === 'string' ? parseFloat(v) : (v as number);
    return isNaN(f as number) ? 0 : (f as number);
  };
  return apiRows
    .filter((r) => r.segments?.product_item_id)
    .map((r) => ({
      itemId: r.segments!.product_item_id as string,
      title: r.segments?.product_title ?? '',
      clicks: n(r.metrics?.clicks),
      cost: n(r.metrics?.cost_micros) / 1e6,
      conversions: n(r.metrics?.conversions),
      convValue: n(r.metrics?.conversions_value),
      currency,
      feedLabel: r.segments?.product_feed_label || undefined,
      issues: r.issues || undefined,
    }));
}
