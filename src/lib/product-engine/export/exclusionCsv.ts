// Exclusion-list exports: a plain Item-ID list and a detailed CSV.

import { AnalysisResult } from '../engine/types';

function csvCell(v: unknown): string {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function buildExclusionCsv(result: AnalysisResult): string {
  const header = ['Item ID', 'Title', 'Clicks', 'Spend (EUR)', 'Conversions', 'Revenue (EUR)', 'Issues'];
  const lines = [header.join(',')];
  for (const e of result.exclusions) {
    lines.push([e.itemId, e.title, e.clicks, Math.round(e.spend * 100) / 100, e.conv, Math.round(e.revenue * 100) / 100, e.issues].map(csvCell).join(','));
  }
  return lines.join('\n');
}

export function buildExclusionItemIds(result: AnalysisResult): string {
  return result.exclusions.map((e) => e.itemId).join('\n');
}

export function downloadExclusionCsv(result: AnalysisResult, client: string): void {
  const blob = new Blob([buildExclusionCsv(result)], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${client}-exclusion-list.csv`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
