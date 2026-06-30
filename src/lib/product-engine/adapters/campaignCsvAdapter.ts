// Adapter: Google Ads "Campaign report" CSV export -> account totals + per-campaign rows.
// Used by the manual (SOP) plan flow to build the 90/30/14-day momentum windows and the
// campaign reads without the live API.
//
// Export layout: row 1 = report title, row 2 = date range, row 3 = headers, row 4+ = data,
// trailing "Total: …" rows are ignored.

import { num } from '../engine/productEngine';

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else { q = false; } }
      else cur += c;
    } else if (c === '"') { q = true; }
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c === '\r') { /* ignore */ }
    else cur += c;
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows;
}

export interface CampaignCsvRow {
  name:        string;
  channelType: string;
  spend:       number;
  convValue:   number;
  conv:        number;
  clicks:      number;
}

export interface CampaignCsvResult {
  dateRange: string;
  totals:    { spend: number; convValue: number; conv: number; clicks: number };
  campaigns: CampaignCsvRow[];
}

/** Find the first header that matches one of the candidate names (case-insensitive). */
function findCol(header: string[], candidates: string[]): number {
  const lower = header.map((h) => h.trim().toLowerCase());
  for (const cand of candidates) {
    const i = lower.indexOf(cand.toLowerCase());
    if (i >= 0) return i;
  }
  return -1;
}

/** Parse a Google Ads campaign-report CSV. Tolerant of column-name and locale variations. */
export function parseGoogleAdsCampaignCsv(text: string): CampaignCsvResult {
  const records = parseCsv(text);
  const empty: CampaignCsvResult = { dateRange: '', totals: { spend: 0, convValue: 0, conv: 0, clicks: 0 }, campaigns: [] };
  if (records.length < 4) return empty;

  const dateRange = (records[1]?.[0] ?? '').replace(/^"|"$/g, '').trim();
  const header = records[2].map((h) => h.trim());

  const iName  = findCol(header, ['Campaign']);
  const iType  = findCol(header, ['Campaign type', 'Campaign subtype', 'Advertising channel type']);
  const iClk   = findCol(header, ['Clicks']);
  const iCost  = findCol(header, ['Cost']);
  const iConv  = findCol(header, ['Conversions']);
  // Prefer all-conversions value (matches the UI "Actual ROAS"), fall back to conv value.
  const iVal   = findCol(header, ['All conv. value', 'All conv value', 'Conv. value', 'Conversion value', 'Conv. value (by conv. time)']);

  const campaigns: CampaignCsvRow[] = [];
  const totals = { spend: 0, convValue: 0, conv: 0, clicks: 0 };

  for (let r = 3; r < records.length; r++) {
    const cells = records[r];
    if (!cells || cells.length === 0) continue;
    const name = (iName >= 0 ? cells[iName] : '').trim();
    if (!name || /^total/i.test(name)) continue;

    const spend     = iCost >= 0 ? (num(cells[iCost]) || 0) : 0;
    const convValue = iVal  >= 0 ? (num(cells[iVal])  || 0) : 0;
    const conv      = iConv >= 0 ? (num(cells[iConv]) || 0) : 0;
    const clicks    = iClk  >= 0 ? (num(cells[iClk])  || 0) : 0;

    campaigns.push({
      name,
      channelType: iType >= 0 ? (cells[iType] ?? '').trim() : '',
      spend, convValue, conv, clicks,
    });
    totals.spend += spend; totals.convValue += convValue; totals.conv += conv; totals.clicks += clicks;
  }

  campaigns.sort((a, b) => b.spend - a.spend);
  return { dateRange, totals, campaigns };
}
