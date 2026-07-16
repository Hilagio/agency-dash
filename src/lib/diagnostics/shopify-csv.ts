/**
 * Parse Shopify CSV exports the team uploads by hand (the no-API fallback).
 * Right now: the "Sales over time" (daily sales) report → OrderDaily rows.
 * Column detection is forgiving (case-insensitive, matches on substrings) so
 * the client can export straight from Shopify without reshaping anything.
 */

// Minimal RFC-4180-ish CSV parser: handles quoted fields, embedded commas,
// escaped quotes ("") and CRLF. Returns an array of rows of string cells.
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  const s = text.replace(/^﻿/, ""); // strip BOM
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { cell += '"'; i++; } else inQuotes = false;
      } else cell += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c === "\r") { /* skip, \n handles the break */ }
    else cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim() !== ""));
}

// "€1,234.56" / "1,234" / "1234.5" → number. Assumes English number format
// (comma thousands, dot decimal), which is how Shopify analytics CSVs export.
function num(s: string | undefined): number | null {
  if (s == null) return null;
  const m = s.replace(/[^0-9.\-]/g, "");
  if (!m || m === "-" || m === ".") return null;
  const n = Number(m);
  return Number.isFinite(n) ? n : null;
}

const ymd = (s: string): string | null => {
  const t = s.trim();
  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(t)) return t.slice(0, 10);
  // DD/MM/YYYY or MM/DD/YYYY — ambiguous; Shopify "Day" is ISO, so this is a
  // best-effort fallback only. Treat as day-first (EU) then re-order to ISO.
  const m = t.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (m) { const [, a, b, y] = m; return `${y}-${b.padStart(2, "0")}-${a.padStart(2, "0")}`; }
  return null;
};

export interface DailySalesRow { date: string; orders: number; revenue: number }
export interface DailySalesParse { rows: DailySalesRow[]; rangeStart: string | null; rangeEnd: string | null; skipped: number }

/**
 * Parse the Shopify "Sales over time" export (grouped by Day). Revenue is Net
 * sales (which already nets discounts + returns) when present, else Total/Gross.
 */
export function parseDailySales(csv: string): DailySalesParse {
  const rows = parseCsv(csv);
  if (rows.length < 2) return { rows: [], rangeStart: null, rangeEnd: null, skipped: 0 };
  const header = rows[0].map(h => h.trim().toLowerCase());
  const find = (...preds: ((h: string) => boolean)[]) => {
    for (const p of preds) { const i = header.findIndex(p); if (i >= 0) return i; }
    return -1;
  };
  const iDate = find(h => h === "day" || h === "date", h => h.includes("day") || h.includes("date"));
  const iOrders = find(h => h === "orders", h => h.includes("orders"));
  const iNet = find(h => h.includes("net sales"));
  const iTotal = find(h => h.includes("total sales"));
  const iGross = find(h => h.includes("gross sales"));
  if (iDate < 0 || (iNet < 0 && iTotal < 0 && iGross < 0)) {
    return { rows: [], rangeStart: null, rangeEnd: null, skipped: rows.length - 1 };
  }

  const out: DailySalesRow[] = [];
  let skipped = 0;
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const date = ymd(cells[iDate] ?? "");
    if (!date) { skipped++; continue; }
    const revenue = num(cells[iNet]) ?? num(cells[iTotal]) ?? num(cells[iGross]);
    if (revenue == null) { skipped++; continue; }
    const orders = iOrders >= 0 ? (num(cells[iOrders]) ?? 0) : 0;
    out.push({ date, orders: Math.round(orders), revenue });
  }
  out.sort((a, b) => a.date.localeCompare(b.date));
  return {
    rows: out,
    rangeStart: out.length ? out[0].date : null,
    rangeEnd: out.length ? out[out.length - 1].date : null,
    skipped,
  };
}
