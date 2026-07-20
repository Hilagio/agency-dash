/**
 * Product-diagnostic spec: the ads-vs-sales join, spend-no-sales, concentration.
 *   npx tsx src/lib/diagnostics/products.test.ts
 */
import {
  joinProducts, buildProductGroups, attachCatalog,
  type AdsProductAgg, type SalesProductAgg, type AdsVariantRow, type SalesVariantRow, type CatalogRow,
} from "./products";

let fail = 0;
const ok = (n: string, c: boolean) => { console.log(c ? "✓" : "✗ FAIL:", n); if (!c) fail++; };

const ads: AdsProductAgg[] = [
  { itemId: "shopify_NL_1", title: "Cursus Breda",     spend: 89, clicks: 67, conversions: 0, conversionValue: 0 },
  { itemId: "shopify_NL_2", title: "Cursus Rotterdam", spend: 40, clicks: 60, conversions: 12, conversionValue: 800 },
  { itemId: "shopify_NL_3", title: "Cursus Utrecht",   spend: 15, clicks: 20, conversions: 1, conversionValue: 60 },
];
const sales: SalesProductAgg[] = [
  // Breda: ad spend €89, ZERO real units — the buyability flag (sold out?).
  { productId: "gid://p/2", title: "Cursus Rotterdam", units: 12, revenue: 900 },
  { productId: "gid://p/3", title: "Cursus Utrecht",   units: 1,  revenue: 60 },
  { productId: "gid://p/9", title: "Cursus Delft",     units: 2,  revenue: 120 }, // sold, but no ads
];

const d = joinProducts(ads, sales, 0.5);
const breda = d.products.find(p => /breda/i.test(p.title))!;
const rotterdam = d.products.find(p => /rotterdam/i.test(p.title))!;
const delft = d.products.find(p => /delft/i.test(p.title))!;

ok("joins ads + sales by title", rotterdam.spend === 40 && rotterdam.units === 12 && rotterdam.revenue === 900);
ok("Breda flagged: real spend, zero real sales", breda.spend === 89 && breda.units === 0 && breda.spendNoSales);
ok("spend-no-sales count + total", d.spendNoSalesCount === 1 && d.spendNoSalesTotal === 89);
ok("product sold with no ad spend is still shown", delft.units === 2 && delft.spend === 0);
ok("POAS computed per matched product", rotterdam.poas != null && Math.abs(rotterdam.poas - (900 * 0.5 / 40)) < 1e-9);
ok("matched flag set only when both spend and units exist", rotterdam.matched && !breda.matched && !delft.matched);

// Concentration: Rotterdam €900 of €1080 total revenue → ~83% top share.
ok("top product revenue share computed", Math.abs(d.concentration.topShare - (900 / 1080)) < 1e-6);
ok("breadth reads as concentrated (>50% in one product)", d.concentration.breadth === "concentrated");
ok("counts products with revenue", d.concentration.productCount === 3);

// No margin → POAS null but everything else works.
const noMargin = joinProducts(ads, sales, null);
ok("without margin, POAS is null but join still works", noMargin.products.every(p => p.poas === null) && noMargin.spendNoSalesCount === 1);

// Empty → safe zeros.
const empty = joinProducts([], [], 0.5);
ok("empty input → safe zeros", empty.products.length === 0 && empty.concentration.breadth === "unknown");

// ─── Two-level rollup: variants too thin alone, clear at product level ─────────
// One product, 4 variants. Each variant has modest spend + ZERO conversions —
// individually too thin to act on, but rolled up it's €120 / 0 conv.
const vAds: AdsVariantRow[] = [
  { itemId: "shopify_NL_555_1", title: "Zomerjas", spend: 34, clicks: 20, conversions: 0, conversionValue: 0 },
  { itemId: "shopify_NL_555_2", title: "Zomerjas", spend: 30, clicks: 14, conversions: 0, conversionValue: 0 },
  { itemId: "shopify_NL_555_3", title: "Zomerjas", spend: 28, clicks: 11, conversions: 0, conversionValue: 0 },
  { itemId: "shopify_NL_555_4", title: "Zomerjas", spend: 28, clicks: 9,  conversions: 0, conversionValue: 0 },
  // A healthy product for contrast.
  { itemId: "shopify_NL_777_1", title: "Winterjas", spend: 50, clicks: 40, conversions: 8, conversionValue: 900 },
];
const vSales: SalesVariantRow[] = [
  { productId: "gid://shopify/Product/777", variantId: "gid://shopify/ProductVariant/7771", title: "Winterjas", variantTitle: "M", units: 8, revenue: 900 },
];
const g = buildProductGroups(vAds, vSales, { marginPct: 0.5, minProductSpend: 25, variantMinClicks: 15 });
const zomer = g.groups.find(p => /zomerjas/i.test(p.title))!;
const winter = g.groups.find(p => /winterjas/i.test(p.title))!;

ok("rolls 4 variants under one product", zomer.variants.length === 4);
ok("product-level spend is the sum of variants (€120)", zomer.spend === 120);
ok("product-level shows 0 conversions across variants", zomer.adConversions === 0);
ok("most variants are individually thin", zomer.thinVariantCount >= 3);
ok("product is flagged an exclude-from-feed candidate", zomer.excludeCandidate && g.excludeCandidates.some(p => p.productKey === zomer.productKey));
ok("exclude reason cites spend + zero conversions + thin variants", /120/.test(zomer.excludeReason!) && /thin/.test(zomer.excludeReason!));
ok("the converting product is NOT flagged", !winter.excludeCandidate);
ok("healthy product keeps its POAS", winter.poas != null && winter.poas > 1);
ok("id-based match keeps Winterjas variant sales joined to ads product", winter.units === 8 && winter.revenue === 900);

// ─── Underperformers: ranked worst-first by wasted spend ──────────────────────
const uAds: AdsVariantRow[] = [
  { itemId: "shopify_NL_100_1", title: "Dead SKU",        spend: 200, clicks: 90, conversions: 0, conversionValue: 0 },   // 0 conv → all €200 wasted
  { itemId: "shopify_NL_200_1", title: "Thin-margin SKU", spend: 100, clicks: 50, conversions: 5, conversionValue: 120 }, // converts but unprofitable
  { itemId: "shopify_NL_300_1", title: "Winner",          spend: 100, clicks: 80, conversions: 10, conversionValue: 900 },// healthy
];
const uSales: SalesVariantRow[] = [
  { productId: "gid://shopify/Product/200", variantId: "gid://shopify/ProductVariant/2001", title: "Thin-margin SKU", variantTitle: "M", units: 5, revenue: 120 },
  { productId: "gid://shopify/Product/300", variantId: "gid://shopify/ProductVariant/3001", title: "Winner", variantTitle: "L", units: 10, revenue: 900 },
];
const ug = buildProductGroups(uAds, uSales, { marginPct: 0.5, minProductSpend: 25 });
ok("winner is NOT an underperformer", !ug.underperformers.some(p => /winner/i.test(p.title)));
ok("both problem products flagged underperforming", ug.underperformers.length === 2);
ok("ranked worst-first by wasted spend (dead SKU first)", /dead/i.test(ug.underperformers[0].title));
ok("dead SKU wastes all its spend (€200)", ug.underperformers[0].wastedSpend === 200);
ok("thin-margin SKU: below-break-even reason with POAS", /POAS|break-even/i.test(ug.underperformers[1].underperformReason ?? ""));
ok("winner keeps a healthy ROAS", (ug.groups.find(p => /winner/i.test(p.title))?.roas ?? 0) > 1);

// ─── Catalog join: exact store price/GTIN/URL onto groups ─────────────────────
const catalog: CatalogRow[] = [
  { externalId: "gid://shopify/Product/777", title: "Winterjas", price: 89.95, barcode: "8712345678901", url: "https://acme.nl/products/winterjas", vendor: "Acme" },
  { externalId: "gid://shopify/Product/999", title: "Zomerjas", price: 49.95, barcode: null, url: null, vendor: null },
];
attachCatalog(g.groups, catalog);
ok("catalog matches by product id (pid ↔ gid numeric)", winter.catalog?.price === 89.95 && winter.catalog?.gtin === "8712345678901");
ok("catalog falls back to normalised title", zomer.catalog?.price === 49.95); // ads pid is 555, catalog gid is 999 → only the title lines up
ok("catalog URL carried through", winter.catalog?.url === "https://acme.nl/products/winterjas");
attachCatalog(ug.groups, []);
ok("empty catalog → null on every group (honest fallback)", ug.groups.every(p => p.catalog === null));

console.log(fail ? `\n${fail} ROLLUP FAILURE(S)` : "\nROLLUP: PASS — thin variants roll up + underperformers ranked + catalog joins");
process.exit(fail ? 1 : 0);
