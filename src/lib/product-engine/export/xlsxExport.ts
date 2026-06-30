// Branded XLSX export (ExcelJS). Mirrors the Python workbook: Status-overzicht (+ pies as images
// if provided), Landen-overzicht (multi-country), and a filterable Producten sheet.
//
// Peer dependency: `exceljs` (npm i exceljs). Imported dynamically so the engine stays dependency-free.

import { AnalysisResult } from '../engine/types';
import { STATUS_ORDER, STATUS_COLOR, STATUS_ACTION } from '../engine/productEngine';

const DARK = '0B130F';
const HEADER = '26342B';
const round = (n: number, d = 0) => { const f = 10 ** d; return Math.round(n * f) / f; };

export interface XlsxMeta {
  client: string;
  charts?: { spendPie?: string; countPie?: string };
}

export async function buildWorkbook(result: AnalysisResult, meta: XlsxMeta): Promise<unknown> {
  const ExcelJS = (await import('exceljs')).default ?? (await import('exceljs'));
  const wb = new (ExcelJS as any).Workbook();
  wb.creator = 'Ecomtrada';
  const { currency, totals, dateRange, multi } = result;
  const beNote = totals.breakEvenAssumed ? ' (ASSUMED - margin unknown)' : '';
  const revNote = result.revenueColumnUsed === 'revenue' ? ' | REVENUE MODE (echte omzet)' : '';

  // ---- Sheet 1: Status-overzicht ----
  const ws = wb.addWorksheet('Status-overzicht');
  ws.mergeCells('A1:G1');
  ws.getCell('A1').value =
    `${meta.client} - Productstatus (varianten${multi ? ' + landen' : ''} samengevoegd | ${dateRange})${revNote}` +
    ` | spend ${currency} ${round(totals.spend).toLocaleString()} | omzet ${currency} ${round(totals.revenue).toLocaleString()}` +
    ` | ROAS ${round(totals.roas, 2)} | break-even ${totals.breakEven}${beNote}`;
  styleTitle(ws.getCell('A1'));
  ws.getRow(1).height = 26;

  const head1 = ['Status', 'Producten', 'Spend', '% spend', 'Omzet', 'ROAS', 'Actie'];
  head1.forEach((h: string, j: number) => styleHeader(ws.getCell(2, j + 1), h));

  let r = 3;
  for (const s of STATUS_ORDER) {
    const row = result.statusSummary.find((x) => x.status === s)!;
    const vals = [s, row.count, round(row.spend), round(row.spendPct, 2), round(row.revenue), round(row.roas, 2), STATUS_ACTION[s]];
    vals.forEach((v, j) => { ws.getCell(r, j + 1).value = v as any; });
    ws.getCell(r, 4).numFmt = '0%';
    for (let j = 1; j <= 7; j++) fill(ws.getCell(r, j), STATUS_COLOR[s].row);
    r++;
  }
  const totRow = ['TOTAAL', result.products.length, round(totals.spend), 1.0, round(totals.revenue), round(totals.roas, 2), ''];
  totRow.forEach((v, j) => { const c = ws.getCell(r, j + 1); c.value = v as any; c.font = { bold: true }; });
  ws.getCell(r, 4).numFmt = '0%';
  [12, 11, 12, 9, 12, 7, 32].forEach((w, j) => { ws.getColumn(j + 1).width = w; });

  if (meta.charts?.spendPie) addImage(wb, ws, meta.charts.spendPie, 8, 1);
  if (meta.charts?.countPie) addImage(wb, ws, meta.charts.countPie, 8, 17);

  // ---- Sheet 2: Landen-overzicht (multi only) ----
  if (multi) {
    const wl = wb.addWorksheet('Landen-overzicht');
    wl.mergeCells('A1:F1');
    wl.getCell('A1').value = `${meta.client} - Performance per land (${dateRange})`;
    styleTitle(wl.getCell('A1')); wl.getRow(1).height = 24;
    ['Land', 'Spend', '% spend', 'Omzet', 'ROAS', 'Conversies'].forEach((h: string, j: number) => styleHeader(wl.getCell(2, j + 1), h));
    let rr = 3;
    for (const c of result.countries) {
      [c.label, round(c.spend), round(c.spendPct, 2), round(c.revenue), round(c.roas, 2), round(c.conv)]
        .forEach((v, j) => { wl.getCell(rr, j + 1).value = v as any; });
      wl.getCell(rr, 3).numFmt = '0%';
      const col = c.roas >= 2.0 ? 'C9F2DE' : (c.roas < 1.5 ? 'F6C9C9' : 'FBE4C9');
      fill(wl.getCell(rr, 5), col);
      rr++;
    }
    [10, 12, 9, 12, 8, 11].forEach((w, j) => { wl.getColumn(j + 1).width = w; });
  }

  // ---- Sheet 3: Producten (filterable) ----
  const ws2 = wb.addWorksheet('Producten');
  const cols = ['Product ID', 'Product', 'Varianten']
    .concat(multi ? ['Landen', 'Beste land'] : [])
    .concat(['Clicks', 'Verw. conv', 'Spend', 'Conversies', 'Omzet', 'ROAS', 'Conv %', 'Status', 'OOS']);
  ws2.mergeCells(1, 1, 1, cols.length);
  ws2.getCell('A1').value = `${meta.client} - Productperformance op PRODUCTniveau${revNote} | filter op Status | break-even ${totals.breakEven}${beNote}`;
  styleTitle(ws2.getCell('A1')); ws2.getRow(1).height = 26;
  cols.forEach((h: string, j: number) => styleHeader(ws2.getCell(2, j + 1), h));

  let r2 = 3;
  for (const p of result.products) {
    const row: any[] = [p.parent, String(p.product).slice(0, 55), p.variants];
    if (multi) row.push(p.countries ?? 0, p.bestCountry ?? '');
    row.push(p.clicks, p.expConv, round(p.spend, 2), round(p.conv, 1), round(p.revenue, 2), round(p.roas, 2), round(p.convRate, 2), p.status, p.oos ? 'OOS' : '');
    row.forEach((v, j) => { ws2.getCell(r2, j + 1).value = v; });
    for (let j = 1; j <= cols.length; j++) fill(ws2.getCell(r2, j), STATUS_COLOR[p.status].row);
    r2++;
  }
  const widths = [20, 40, 9].concat(multi ? [7, 9] : []).concat([8, 9, 10, 10, 11, 7, 7, 11, 6]);
  widths.forEach((w, j) => { ws2.getColumn(j + 1).width = w; });
  ws2.views = [{ state: 'frozen', ySplit: 2 }];
  ws2.autoFilter = { from: { row: 2, column: 1 }, to: { row: Math.max(2, r2 - 1), column: cols.length } };

  return wb;
}

export async function downloadXlsx(result: AnalysisResult, meta: XlsxMeta): Promise<void> {
  const wb = await buildWorkbook(result, meta);
  const buf = await (wb as any).xlsx.writeBuffer();
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  triggerDownload(blob, `${meta.client}-product-performance.xlsx`);
}

function styleTitle(cell: any) {
  cell.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + DARK } };
}
function styleHeader(cell: any, value: string) {
  cell.value = value;
  cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + HEADER } };
}
function fill(cell: any, hex: string) {
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + hex } };
}
function addImage(wb: any, ws: any, dataUrl: string, col: number, row: number) {
  const base64 = dataUrl.split(',')[1] ?? dataUrl;
  const id = wb.addImage({ base64, extension: 'png' });
  ws.addImage(id, { tl: { col, row }, ext: { width: 360, height: 240 } });
}
function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
