// Adapter: Google Ads "Product report" CSV export -> RawRow[].
// The export has: row 1 = report title, row 2 = date range, row 3 = column headers, row 4+ = data.

import { RawRow } from '../engine/types';
import { num } from '../engine/productEngine';

/** Robust CSV tokenizer that handles quoted fields and newlines inside quotes. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; } else { q = false; }
      } else cur += c;
    } else if (c === '"') {
      q = true;
    } else if (c === ',') {
      row.push(cur); cur = '';
    } else if (c === '\n') {
      row.push(cur); rows.push(row); row = []; cur = '';
    } else if (c === '\r') {
      // ignore; handled by \n
    } else cur += c;
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

export interface CsvParseResult {
  dateRange: string;
  rows: RawRow[];
}

/** Parse the raw text of a Google Ads product-report CSV into RawRows. */
export function parseGoogleAdsProductCsv(text: string): CsvParseResult {
  const records = parseCsv(text);
  if (records.length < 4) return { dateRange: '', rows: [] };

  const dateRange = (records[1]?.[0] ?? '').replace(/^"|"$/g, '').trim();
  const header = records[2].map((h) => h.trim());
  const idx = (name: string) => header.indexOf(name);

  const iItem = idx('Item ID');
  const iTitle = idx('Title');
  const iClicks = idx('Clicks');
  const iCost = idx('Cost');
  const iConv = idx('Conversions');
  const iConvVal = idx('Conv. value');
  const iRevenue = idx('Revenue');
  const iCur = idx('Currency code');
  const iFeed = idx('Feed label');
  const iIssues = idx('Issues');

  const rows: RawRow[] = [];
  for (let r = 3; r < records.length; r++) {
    const cells = records[r];
    if (!cells || cells.length === 0) continue;
    const itemId = (cells[iItem] ?? '').trim();
    if (!itemId || itemId === '--') continue;
    rows.push({
      itemId,
      title: iTitle >= 0 ? cells[iTitle] : '',
      clicks: num(cells[iClicks]) || 0,
      cost: num(cells[iCost]) || 0,
      conversions: num(cells[iConv]) || 0,
      convValue: num(cells[iConvVal]) || 0,
      revenue: iRevenue >= 0 ? (num(cells[iRevenue]) || 0) : undefined,
      currency: iCur >= 0 ? (cells[iCur] || undefined) : undefined,
      feedLabel: iFeed >= 0 ? (cells[iFeed] || undefined) : undefined,
      issues: iIssues >= 0 ? (cells[iIssues] || undefined) : undefined,
    });
  }
  return { dateRange, rows };
}
