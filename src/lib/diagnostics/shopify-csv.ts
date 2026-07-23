/**
 * Parse Shopify CSV exports the team uploads by hand (the no-API fallback).
 * Supported reports (all grouped by Day):
 *   - "Sales over time"               → OrderDaily        (kind: daily_sales)
 *   - "Sales by product [variant]"    → ProductSalesDaily (kind: product_sales)
 *   - "Sales by discount"             → DiscountDaily     (kind: discounts)
 * Column detection is forgiving (case-insensitive, matches on substrings) so
 * the client can export straight from Shopify without reshaping anything, and
 * detectCsvKind() recognises which report a file is from its header.
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

// Parse a money/number cell in EITHER English ("1,234.56") or European
// ("1.234,56") format — the client is Dutch, so a Shopify export may come in
// either. Rule: strip currency/spaces; if both separators appear, the RIGHTMOST
// is the decimal and the other is thousands; if only one appears, decide by the
// trailing group (a 1–2 digit tail = decimal, a 3-digit tail = thousands).
function num(s: string | undefined): number | null {
  if (s == null) return null;
  let t = s.replace(/[^0-9.,\-]/g, "").trim();
  if (!t || t === "-" || t === "." || t === ",") return null;
  const lastComma = t.lastIndexOf(","), lastDot = t.lastIndexOf(".");
  if (lastComma > -1 && lastDot > -1) {
    if (lastComma > lastDot) t = t.replace(/\./g, "").replace(",", "."); // EU: 1.234,56
    else t = t.replace(/,/g, "");                                        // US: 1,234.56
  } else if (lastComma > -1) {
    const tail = t.length - lastComma - 1;
    t = (t.indexOf(",") === lastComma && tail <= 2) ? t.replace(",", ".") : t.replace(/,/g, "");
  } else if (lastDot > -1) {
    const tail = t.length - lastDot - 1;
    // Multiple dots, or a single dot with a 3-digit tail (e.g. "1.234"), = thousands.
    if (t.indexOf(".") !== lastDot || tail === 3) t = t.replace(/\./g, "");
  }
  const n = Number(t);
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

  // Collapse to one row per date (summing) — a report grouped by Day plus a
  // second dimension (channel, etc.) yields several rows per date; the unique
  // (accountId, date) constraint would otherwise reject the upload.
  const byDate = new Map<string, DailySalesRow>();
  let skipped = 0;
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const date = ymd(cells[iDate] ?? "");
    if (!date) { skipped++; continue; }
    const revenue = num(cells[iNet]) ?? num(cells[iTotal]) ?? num(cells[iGross]);
    if (revenue == null) { skipped++; continue; }
    const orders = iOrders >= 0 ? (num(cells[iOrders]) ?? 0) : 0;
    const e = byDate.get(date) ?? { date, orders: 0, revenue: 0 };
    e.orders += Math.round(orders); e.revenue += revenue;
    byDate.set(date, e);
  }
  const out = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  return {
    rows: out,
    rangeStart: out.length ? out[0].date : null,
    rangeEnd: out.length ? out[out.length - 1].date : null,
    skipped,
  };
}

// Shared header lookup: first predicate that matches wins.
function findCol(header: string[], ...preds: ((h: string) => boolean)[]): number {
  for (const p of preds) { const i = header.findIndex(p); if (i >= 0) return i; }
  return -1;
}

const hasProductCol = (header: string[]) =>
  findCol(header, h => h === "product title", h => h === "product", h => h.includes("product title")) >= 0;
const hasDiscountNameCol = (header: string[]) =>
  findCol(header, h => h === "discount name", h => h === "discount code", h => h === "discount", h => h.includes("discount name") || h.includes("discount code")) >= 0;

/**
 * Which Shopify report is this file? Decided from the header row alone:
 * a product-title column → product_sales; a discount-name/code column →
 * discounts (the product report's "Discounts" AMOUNT column doesn't match);
 * otherwise a date + sales column → daily_sales.
 */
export function detectCsvKind(csv: string): "daily_sales" | "product_sales" | "discounts" | null {
  const first = parseCsv(csv.slice(0, 4000))[0];
  if (!first) return null;
  const header = first.map(h => h.trim().toLowerCase());
  if (hasProductCol(header)) return "product_sales";
  if (hasDiscountNameCol(header)) return "discounts";
  const iDate = findCol(header, h => h === "day" || h === "date", h => h.includes("day") || h.includes("date"));
  const iSales = findCol(header, h => h.includes("net sales"), h => h.includes("total sales"), h => h.includes("gross sales"));
  return iDate >= 0 && iSales >= 0 ? "daily_sales" : null;
}

export interface ProductSalesRow { date: string; title: string; variantTitle: string; units: number; revenue: number; discounts: number }
export interface ProductSalesParse { rows: ProductSalesRow[]; rangeStart: string | null; rangeEnd: string | null; skipped: number; hasVariants: boolean }

/**
 * Parse "Sales by product" / "Sales by product variant" grouped by Day.
 * Revenue is Net sales when present (nets discounts + returns), else
 * Total/Gross. The Discounts column (Shopify exports it negative) is kept as a
 * positive "amount discounted" so discount pressure per product is visible.
 */
export function parseProductSales(csv: string): ProductSalesParse {
  const rows = parseCsv(csv);
  if (rows.length < 2) return { rows: [], rangeStart: null, rangeEnd: null, skipped: 0, hasVariants: false };
  const header = rows[0].map(h => h.trim().toLowerCase());
  const iDate = findCol(header, h => h === "day" || h === "date", h => h.includes("day") || h.includes("date"));
  const iTitle = findCol(header, h => h === "product title", h => h === "product", h => h.includes("product title"));
  const iVariant = findCol(header, h => h.includes("variant title"), h => h === "variant");
  const iUnits = findCol(header, h => h.includes("net quantity"), h => h.includes("net items"), h => h.includes("items sold"), h => h === "quantity" || h.includes("quantity"), h => h === "units" || h.includes("units"));
  const iNet = findCol(header, h => h.includes("net sales"));
  const iTotal = findCol(header, h => h.includes("total sales"));
  const iGross = findCol(header, h => h.includes("gross sales"));
  const iDisc = findCol(header, h => h === "discounts", h => h.includes("amount discounted"));
  if (iDate < 0 || iTitle < 0 || (iNet < 0 && iTotal < 0 && iGross < 0)) {
    return { rows: [], rangeStart: null, rangeEnd: null, skipped: rows.length - 1, hasVariants: false };
  }

  const byKey = new Map<string, ProductSalesRow>();
  let skipped = 0;
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const date = ymd(cells[iDate] ?? "");
    const title = (cells[iTitle] ?? "").trim();
    if (!date || !title) { skipped++; continue; }
    const revenue = num(cells[iNet]) ?? num(cells[iTotal]) ?? num(cells[iGross]);
    if (revenue == null) { skipped++; continue; }
    const variantTitle = iVariant >= 0 ? (cells[iVariant] ?? "").trim() : "";
    const units = iUnits >= 0 ? Math.round(num(cells[iUnits]) ?? 0) : 0;
    const discounts = iDisc >= 0 ? Math.abs(num(cells[iDisc]) ?? 0) : 0;
    const key = `${date}|${title}|${variantTitle}`;
    const e = byKey.get(key) ?? { date, title, variantTitle, units: 0, revenue: 0, discounts: 0 };
    e.units += units; e.revenue += revenue; e.discounts += discounts;
    byKey.set(key, e);
  }
  const out = [...byKey.values()].sort((a, b) => a.date.localeCompare(b.date) || b.revenue - a.revenue);
  return {
    rows: out,
    rangeStart: out.length ? out[0].date : null,
    rangeEnd: out.length ? out[out.length - 1].date : null,
    skipped,
    hasVariants: iVariant >= 0 && out.some(r => r.variantTitle !== ""),
  };
}

export interface DiscountRow { date: string; code: string; orders: number; discounted: number; revenue: number }
export interface DiscountParse { rows: DiscountRow[]; rangeStart: string | null; rangeEnd: string | null; skipped: number }

/** Parse "Sales by discount" grouped by Day → which codes drove which sales. */
export function parseDiscounts(csv: string): DiscountParse {
  const rows = parseCsv(csv);
  if (rows.length < 2) return { rows: [], rangeStart: null, rangeEnd: null, skipped: 0 };
  const header = rows[0].map(h => h.trim().toLowerCase());
  const iDate = findCol(header, h => h === "day" || h === "date", h => h.includes("day") || h.includes("date"));
  const iCode = findCol(header, h => h === "discount name", h => h === "discount code", h => h === "discount", h => h.includes("discount name") || h.includes("discount code"));
  const iOrders = findCol(header, h => h === "orders", h => h.includes("orders"));
  const iDisc = findCol(header, h => h === "discounts", h => h.includes("amount discounted"), h => h.includes("discount amount"));
  const iNet = findCol(header, h => h.includes("net sales"));
  const iTotal = findCol(header, h => h.includes("total sales"));
  const iGross = findCol(header, h => h.includes("gross sales"));
  if (iDate < 0 || iCode < 0) return { rows: [], rangeStart: null, rangeEnd: null, skipped: rows.length - 1 };

  const byKey = new Map<string, DiscountRow>();
  let skipped = 0;
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const date = ymd(cells[iDate] ?? "");
    const code = (cells[iCode] ?? "").trim();
    if (!date || !code || code === "—" || code === "-") { skipped++; continue; }
    const e = byKey.get(`${date}|${code}`) ?? { date, code, orders: 0, discounted: 0, revenue: 0 };
    e.orders += Math.round(iOrders >= 0 ? (num(cells[iOrders]) ?? 0) : 0);
    e.discounted += Math.abs(iDisc >= 0 ? (num(cells[iDisc]) ?? 0) : 0);
    e.revenue += (iNet >= 0 ? num(cells[iNet]) : null) ?? (iTotal >= 0 ? num(cells[iTotal]) : null) ?? (iGross >= 0 ? num(cells[iGross]) : null) ?? 0;
    byKey.set(`${date}|${code}`, e);
  }
  const out = [...byKey.values()].sort((a, b) => a.date.localeCompare(b.date) || b.revenue - a.revenue);
  return {
    rows: out,
    rangeStart: out.length ? out[0].date : null,
    rangeEnd: out.length ? out[out.length - 1].date : null,
    skipped,
  };
}
