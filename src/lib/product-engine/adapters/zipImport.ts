// Unzip a client_90day ZIP in the browser and route each file to the right parser.
// Handles the real Sidekick + Google Ads export layout:
//   *Campaign*{90,30,14}days*.csv, *Product*90days*.csv,
//   summary_metrics_*, profit_report_*, top_products_*, inventory_levels_*

import { unzipSync, strFromU8 } from 'fflate';
import { parseGoogleAdsCampaignCsv, CampaignCsvResult } from './campaignCsvAdapter';
import { parseGoogleAdsProductCsv } from './csvAdapter';
import { buildShopifyFromSidekick, ShopifyManual, SidekickFiles } from './sidekickAdapter';
import { RawRow } from '../engine/types';

export interface ZipImportResult {
  campaign:    { d90?: CampaignCsvResult; d30?: CampaignCsvResult; d14?: CampaignCsvResult };
  products90?: { rows: RawRow[]; range: string };
  shopify?:    ShopifyManual;
  files:       string[];
  warnings:    string[];
}

export async function importPlanZip(file: File): Promise<ZipImportResult> {
  const buf = new Uint8Array(await file.arrayBuffer());
  const unzipped = unzipSync(buf);

  const result: ZipImportResult = { campaign: {}, files: [], warnings: [] };
  const sidekick: SidekickFiles = {};
  const sidekickWin: Record<keyof SidekickFiles, number> = { summary: -1, profit: -1, top: -1, inventory: -1 };

  for (const [path, data] of Object.entries(unzipped)) {
    const name = path.split('/').pop() || path;
    if (path.includes('__MACOSX') || name.startsWith('._') || !name.toLowerCase().endsWith('.csv')) continue;

    const text = strFromU8(data);
    const lower = name.toLowerCase();
    result.files.push(name);

    // ── Google Ads campaign ({90,30,14}days) ──
    const campM = lower.match(/campaign.*?(\d+)\s*days?/);
    if (lower.includes('campaign') && campM) {
      const win = Number(campM[1]);
      const parsed = parseGoogleAdsCampaignCsv(text);
      if (win >= 75) result.campaign.d90 = parsed;
      else if (win >= 25) result.campaign.d30 = parsed;
      else result.campaign.d14 = parsed;
      continue;
    }

    // ── Google Ads products (90d feeds the engine) ──
    const prodM = lower.match(/product.*?(\d+)\s*days?/);
    if (lower.includes('product') && prodM) {
      if (Number(prodM[1]) >= 75) {
        const p = parseGoogleAdsProductCsv(text);
        result.products90 = { rows: p.rows, range: p.dateRange };
      }
      continue;
    }

    // ── Shopify Sidekick (prefer the 90-day file of each type) ──
    const winOf = () => { const w = lower.match(/(\d+)\s*d/); return w ? Number(w[1]) : 90; };
    const take = (token: string, key: keyof SidekickFiles) => {
      if (!lower.includes(token)) return false;
      const w = winOf();
      if (w > sidekickWin[key]) { sidekick[key] = text; sidekickWin[key] = w; }
      return true;
    };
    if (take('summary_metrics', 'summary')) continue;
    if (take('profit_report', 'profit')) continue;
    if (take('top_products', 'top')) continue;
    if (take('inventory_levels', 'inventory')) continue;
  }

  if (sidekick.summary || sidekick.profit || sidekick.top || sidekick.inventory) {
    result.shopify = buildShopifyFromSidekick(sidekick);
  }
  if (!result.campaign.d90) result.warnings.push('Geen 90-daagse campagne-CSV gevonden.');
  if (!result.campaign.d30) result.warnings.push('Geen 30-daagse campagne-CSV gevonden.');
  if (!result.campaign.d14) result.warnings.push('Geen 14-daagse campagne-CSV gevonden.');
  if (!result.products90) result.warnings.push('Geen 90-daagse producten-CSV gevonden.');
  return result;
}
