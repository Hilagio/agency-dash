/**
 * Product-diagnostic spec: the ads-vs-sales join, spend-no-sales, concentration.
 *   npx tsx src/lib/diagnostics/products.test.ts
 */
import { joinProducts, type AdsProductAgg, type SalesProductAgg } from "./products";

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

console.log(fail ? `\n${fail} FAILURE(S)` : "\nPRODUCTS: PASS — ads×sales join, spend-no-sales, concentration");
process.exit(fail ? 1 : 0);
