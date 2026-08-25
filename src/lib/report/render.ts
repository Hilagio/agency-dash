/**
 * Monthly client report — fixed HTML template (the "managementrapport" house
 * style: paper ground, Fraunces headlines, cognac accent). All tables and KPIs
 * come from computed ReportData; the model's ReportContent only fills the
 * narrative slots. Self-contained HTML: exportable, printable, mailable.
 */
import type { ReportContent, ReportData } from "./types";

const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** **bold** → <strong>, *em* → <em>, safely (escape first). */
const inline = (s: string): string =>
  esc(s).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");

const MONTHS_NL = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface T {
  eyebrow: string; period: string; basis: string; basisVal: (hasShop: boolean) => string; sources: string; drawnUp: string;
  inShort: string; kSpend: string; kAdsRev: string; kRoas: string; kRoasNb: string; kShopRev: string; kMer: string; kOrders: string;
  adsVsOrders: string; adsVsNoShop: string; mSystem: string; mAds: string; mShop: string; mOrders: string; mRevenue: string;
  googleDetail: string; cCampaign: string; cBrandTag: string; cSpend: string; cClicks: string; cConv: string; cRevenue: string; cRoas: string;
  winners: string; leaks: string; term: string; leakSum: (n: string) => string;
  products: string; pProduct: string; pUnits: string; pRevenue: string; pAdSpend: string; pAdRev: string; adsOnlyProducts: string;
  discounts: string; dCode: string; dOrders: string; dGiven: string; dNet: string;
  compare: string; cvPrev: string; cvThis: string;
  unknown: string; unknownDek: string;
  caveatLag: string; caveatNoShop: string; caveatAttribution: string; caveatTermsHidden: string; caveatTermsGone: string;
  caveatBrand: (names: string) => string; caveatChannels: string; caveatPartial: string;
  foot: (date: string, hasShop: boolean) => string;
  captionCampaigns: string; captionRecon: string; captionProducts: string; captionCompare: string;
  monthName: (m: string) => string; fullPeriod: (d: ReportData) => string;
}

const monthLabel = (m: string, names: string[]): string => {
  const [y, mo] = m.split("-");
  return `${names[Number(mo) - 1]} ${y}`;
};
const dnum = (d: string) => String(Number(d.slice(8, 10)));

const NL: T = {
  eyebrow: "Maandrapport", period: "Periode", basis: "Grondslag",
  basisVal: h => (h ? "de bestellingen in Shopify" : "de metingen van Google Ads"),
  sources: "Bronnen", drawnUp: "Opgesteld",
  inShort: "In het kort",
  kSpend: "Advertentiekosten", kAdsRev: "Omzet volgens Google", kRoas: "Per euro (alles)", kRoasNb: "Per euro, zonder merkcampagnes",
  kShopRev: "Omzet webshop", kMer: "Winkel per advertentie-euro", kOrders: "Bestellingen",
  adsVsOrders: "Advertenties tegenover echte bestellingen",
  adsVsNoShop: "Hoe u deze cijfers moet lezen",
  mSystem: "Meting", mAds: "Google Ads zelf", mShop: "Shopify (de webshop)", mOrders: "Bestellingen", mRevenue: "Omzet",
  googleDetail: "Google Ads in detail",
  cCampaign: "Campagne", cBrandTag: "merk", cSpend: "Kosten", cClicks: "Klikken", cConv: "Bestellingen", cRevenue: "Omzet", cRoas: "Per euro",
  winners: "Zoekopdrachten die verkochten", leaks: "Waar geld weglekt", term: "Zoekopdracht",
  leakSum: n => `In totaal ging er ${n} naar zoekopdrachten die geen enkele bestelling opleverden.`,
  products: "Producten", pProduct: "Product", pUnits: "Verkocht", pRevenue: "Omzet", pAdSpend: "Advertentiekosten", pAdRev: "Omzet via advertenties",
  adsOnlyProducts: "Zonder gekoppelde webshop tonen we hier wat de advertenties per product deden.",
  discounts: "Kortingscodes", dCode: "Code", dOrders: "Bestellingen", dGiven: "Weggegeven", dNet: "Netto-omzet",
  compare: "Vergeleken met de periode ervoor", cvPrev: "Vorige periode", cvThis: "Deze periode",
  unknown: "Wat we niet zeker weten", unknownDek: "Zodat u weet hoe zwaar de rest weegt.",
  caveatLag: "Conversies druppelen bij Google tot ruim een week na de klik binnen. De laatste dagen van deze periode zijn dus nog niet uitgehard en kunnen iets hoger uitvallen.",
  caveatNoShop: "Er is geen bestellingenkoppeling (Shopify) actief voor dit account. Alle omzetcijfers in dit rapport zijn de metingen van Google zelf en zijn niet tegen echte bestellingen gecontroleerd.",
  caveatAttribution: "Google en de webshop meten verschillend: Google rekent omzet toe aan de klikdag en telt ook mensen die later zelf terugkwamen. De webshopcijfers zijn de grondslag; de Google-cijfers laten zien wat de advertenties daaraan bijdroegen.",
  caveatTermsHidden: "Google houdt zoekopdrachten met weinig volume achter. Een deel van de kosten is daardoor niet naar een zoekopdracht te herleiden.",
  caveatTermsGone: "Zoektermgegevens worden 45 dagen bewaard; voor deze periode zijn ze niet meer volledig beschikbaar.",
  caveatBrand: names => `De campagnes ${names} bieden op de eigen merknaam. Die verkopen waren er grotendeels toch wel gekomen; daarom tonen we het rendement ook zónder deze campagnes.`,
  caveatChannels: "Dit rapport meet Google Ads en de gekoppelde webshop. Andere kanalen (Meta, e-mail, organisch bezoek) vallen buiten deze meting.",
  caveatPartial: "De maand is nog niet voorbij; dit rapport loopt tot en met de laatst beschikbare volledige dag.",
  foot: (date, hasShop) => `<strong>Verantwoording.</strong> Alle cijfers zijn op ${date} rechtstreeks uit de bron opgehaald: Google Ads${hasShop ? " en Shopify" : ""}. ${hasShop ? "Als grondslag gelden de bestellingen zoals ze in de webshop staan; de advertentiekosten komen altijd van het platform zelf." : "De advertentiekosten en de omzet komen van Google Ads zelf."} Waar systemen elkaar tegenspreken, staat dat benoemd in plaats van weggerekend. Er is niets gewijzigd in het advertentieaccount, er is uitsluitend gelezen.`,
  captionCampaigns: "Alle campagnes met kosten in deze periode, gesorteerd op kosten.",
  captionRecon: "Dezelfde periode, gemeten door twee systemen. De kosten komen van het advertentieplatform zelf.",
  captionProducts: "Wat er werkelijk verkocht is volgens de webshop, met wat de advertenties per product deden.",
  captionCompare: "Deze periode naast de even lange periode ervoor.",
  monthName: m => monthLabel(m, MONTHS_NL),
  fullPeriod: d => `${dnum(d.periodStart)} t/m ${dnum(d.periodEnd)} ${monthLabel(d.month, MONTHS_NL)}`,
};

const EN: T = {
  eyebrow: "Monthly report", period: "Period", basis: "Basis",
  basisVal: h => (h ? "the orders in Shopify" : "Google Ads' own measurements"),
  sources: "Sources", drawnUp: "Prepared",
  inShort: "In short",
  kSpend: "Ad spend", kAdsRev: "Revenue per Google", kRoas: "Per euro (all)", kRoasNb: "Per euro, excl. brand",
  kShopRev: "Store revenue", kMer: "Store per ad euro", kOrders: "Orders",
  adsVsOrders: "Ads versus real orders",
  adsVsNoShop: "How to read these numbers",
  mSystem: "Measurement", mAds: "Google Ads itself", mShop: "Shopify (the store)", mOrders: "Orders", mRevenue: "Revenue",
  googleDetail: "Google Ads in detail",
  cCampaign: "Campaign", cBrandTag: "brand", cSpend: "Cost", cClicks: "Clicks", cConv: "Orders", cRevenue: "Revenue", cRoas: "Per euro",
  winners: "Search terms that sold", leaks: "Where money leaks", term: "Search term",
  leakSum: n => `In total ${n} went to search terms that produced no order at all.`,
  products: "Products", pProduct: "Product", pUnits: "Sold", pRevenue: "Revenue", pAdSpend: "Ad spend", pAdRev: "Ad-driven revenue",
  adsOnlyProducts: "Without a connected store this shows what the ads did per product.",
  discounts: "Discount codes", dCode: "Code", dOrders: "Orders", dGiven: "Given away", dNet: "Net revenue",
  compare: "Compared with the period before", cvPrev: "Previous period", cvThis: "This period",
  unknown: "What we don't know for sure", unknownDek: "So you know how much weight the rest carries.",
  caveatLag: "Google keeps counting conversions for over a week after the click. The final days of this period are still maturing and may end slightly higher.",
  caveatNoShop: "No order feed (Shopify) is connected for this account. Every revenue figure in this report is Google's own measurement, unverified against real orders.",
  caveatAttribution: "Google and the store measure differently: Google books revenue on the click day and also counts people who came back later by themselves. The store's numbers are the basis; Google's numbers show what the ads contributed.",
  caveatTermsHidden: "Google withholds low-volume search terms, so part of the spend cannot be traced to a search term.",
  caveatTermsGone: "Search-term data is retained for 45 days; it is no longer fully available for this period.",
  caveatBrand: names => `The campaigns ${names} bid on the shop's own brand name. Most of those sales would have arrived anyway, which is why we also show the return without them.`,
  caveatChannels: "This report measures Google Ads and the connected store. Other channels (Meta, e-mail, organic traffic) fall outside this measurement.",
  caveatPartial: "The month is not over; this report runs to the last complete day available.",
  foot: (date, hasShop) => `<strong>Accountability.</strong> All figures were pulled straight from the source on ${date}: Google Ads${hasShop ? " and Shopify" : ""}. ${hasShop ? "The orders as they stand in the store are the basis; ad costs always come from the platform itself." : "Ad costs and revenue come from Google Ads itself."} Where systems disagree, that is stated rather than reconciled away. Nothing was changed in the ad account — read-only.`,
  captionCampaigns: "Every campaign with spend in this period, sorted by spend.",
  captionRecon: "The same period, measured by two systems. Costs always come from the ad platform itself.",
  captionProducts: "What actually sold according to the store, with what the ads did per product.",
  captionCompare: "This period next to the equally long period before it.",
  monthName: m => monthLabel(m, MONTHS_EN),
  fullPeriod: d => `${monthLabel(d.month, MONTHS_EN).split(" ")[0]} ${dnum(d.periodStart)}–${dnum(d.periodEnd)}, ${d.month.slice(0, 4)}`,
};

const CSS = `
:root{--paper:#F6F2EA;--paper-2:#FFFDF9;--ink:#241D18;--ink-2:#4A3F36;--muted:#7A6C5F;--line:#DED5C7;--line-2:#EDE6DA;
--cognac:#A2542C;--cognac-soft:#F0E2D6;--green:#3F6142;--green-soft:#E2EBE0;--amber:#8A6314;--amber-soft:#F4E9CF;
--s1:.5rem;--s2:1rem;--s3:1.5rem;--s4:2.5rem;--s5:4rem;--measure:70ch}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font-family:'Karla','Segoe UI',Helvetica,sans-serif;font-size:17px;line-height:1.65;-webkit-font-smoothing:antialiased}
.wrap{max-width:1080px;margin:0 auto;padding:0 var(--s3)}
h1,h2,h3,h4{font-family:'Fraunces',Georgia,serif;font-weight:500;line-height:1.12;margin:0;letter-spacing:-.015em}
p{margin:0 0 var(--s2);max-width:var(--measure)}
strong{font-weight:600}
.masthead{border-bottom:1px solid var(--line);background:radial-gradient(120% 90% at 88% -10%,rgba(162,84,44,.10),transparent 60%),linear-gradient(178deg,var(--paper-2),var(--paper));padding:var(--s5) 0 var(--s4)}
.eyebrow{font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;color:var(--cognac);font-weight:600;margin-bottom:var(--s2)}
.masthead h1{font-size:clamp(2.2rem,6vw,3.8rem);max-width:18ch}
.masthead h1 em{font-style:italic;color:var(--cognac)}
.dek{margin-top:var(--s3);font-size:1.12rem;color:var(--ink-2);max-width:56ch}
.meta-line{margin-top:var(--s4);padding-top:var(--s2);border-top:1px solid var(--line);display:flex;flex-wrap:wrap;gap:var(--s3) var(--s4);font-size:.82rem;color:var(--muted);letter-spacing:.04em}
.meta-line b{display:block;color:var(--ink);font-weight:600;letter-spacing:0;font-size:.95rem}
section{padding:var(--s5) 0;border-bottom:1px solid var(--line-2)}
section:last-of-type{border-bottom:0}
.sec-head{display:flex;gap:var(--s2);align-items:baseline;margin-bottom:var(--s3)}
.sec-num{font-family:'Fraunces',serif;font-size:.9rem;color:var(--cognac);font-weight:600;padding-top:.35em;min-width:2.2ch}
h2{font-size:clamp(1.5rem,3.4vw,2.2rem);max-width:24ch}
h3{font-size:1.2rem;margin:var(--s4) 0 var(--s2)}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin:var(--s3) 0}
.kpi{background:var(--paper-2);padding:var(--s3)}
.kpi .lab{font-size:.74rem;letter-spacing:.13em;text-transform:uppercase;color:var(--muted);margin-bottom:.5rem}
.kpi .val{font-family:'Fraunces',serif;font-size:2rem;line-height:1;letter-spacing:-.02em}
.kpi .sub{font-size:.82rem;color:var(--muted);margin-top:.45rem}
.kpi.hi .val{color:var(--cognac)}
.tablewrap{overflow-x:auto;margin:var(--s3) 0;border:1px solid var(--line);background:var(--paper-2)}
table{border-collapse:collapse;width:100%;min-width:560px;font-size:.9rem}
caption{text-align:left;padding:var(--s2) var(--s3);font-size:.8rem;color:var(--muted);border-bottom:1px solid var(--line-2)}
th{text-align:left;font-weight:600;font-size:.72rem;letter-spacing:.11em;text-transform:uppercase;color:var(--muted);padding:.85rem var(--s2);border-bottom:1px solid var(--line);white-space:nowrap}
td{padding:.78rem var(--s2);border-bottom:1px solid var(--line-2);vertical-align:top}
tbody tr:last-child td{border-bottom:0}
.num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
tfoot td{font-weight:700;border-top:2px solid var(--line);background:#FBF7F0}
.tag{display:inline-block;font-size:.7rem;letter-spacing:.07em;text-transform:uppercase;font-weight:700;padding:.22em .6em;border-radius:2px;white-space:nowrap;background:var(--cognac-soft);color:var(--cognac);margin-left:.5em}
.note{border-left:3px solid var(--cognac);background:var(--paper-2);padding:var(--s3);margin:var(--s3) 0}
.note p:last-child{margin-bottom:0}
ul.plain{padding-left:1.15rem;max-width:var(--measure)}
ul.plain li{margin-bottom:.6rem}
.foot{padding:var(--s4) 0 var(--s5);font-size:.85rem;color:var(--muted)}
.foot p{max-width:var(--measure)}
@media (max-width:640px){body{font-size:16px}section{padding:var(--s4) 0}.sec-head{display:block}.sec-num{display:block;margin-bottom:.3rem}.kpi .val{font-size:1.65rem}}
@media print{body{background:#fff;font-size:11pt}section{page-break-inside:avoid;border-bottom:1px solid #ddd}.masthead{padding:1rem 0}.tablewrap{overflow:visible}table{min-width:0}}
`;

export function renderReportHtml(content: ReportContent, d: ReportData): string {
  const t = d.language === "nl" ? NL : EN;
  const loc = d.language === "nl" ? "nl-NL" : "en-GB";
  const money = (n: number) => `${d.currencySymbol}${Math.round(n).toLocaleString(loc)}`;
  const x = (n: number | null) => (n != null ? `${n.toFixed(2)}×` : "—");
  const paras = (list: string[]) => list.map(p => `<p>${inline(p)}</p>`).join("");
  let secNum = 0;
  const sec = (title: string, body: string) => {
    secNum += 1;
    return `<section><div class="sec-head"><div class="sec-num">${pad2(secNum)}</div><h2>${inline(title)}</h2></div>${body}</section>`;
  };
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const today = new Date().toISOString().slice(0, 10);

  // KPIs — with Shopify the store leads; without it Google's own view leads.
  const kpis: string[] = [];
  if (d.totals.shopRevenue != null) kpis.push(`<div class="kpi"><div class="lab">${t.kShopRev}</div><div class="val">${money(d.totals.shopRevenue)}</div><div class="sub">${d.totals.shopOrders} ${t.kOrders.toLowerCase()}</div></div>`);
  kpis.push(`<div class="kpi"><div class="lab">${t.kSpend}</div><div class="val">${money(d.totals.spend)}</div><div class="sub">${d.totals.clicks.toLocaleString(loc)} ${t.cClicks.toLowerCase()}</div></div>`);
  kpis.push(`<div class="kpi hi"><div class="lab">${t.kRoas}</div><div class="val">${x(d.totals.roas)}</div><div class="sub">${money(d.totals.adsRevenue)} · ${Math.round(d.totals.adsConversions)} ${t.cConv.toLowerCase()}</div></div>`);
  if (d.totals.brandCampaigns.length) kpis.push(`<div class="kpi"><div class="lab">${t.kRoasNb}</div><div class="val">${x(d.totals.nbRoas)}</div><div class="sub">${money(d.totals.nbRevenue)} / ${money(d.totals.nbSpend)}</div></div>`);
  if (d.totals.mer != null) kpis.push(`<div class="kpi"><div class="lab">${t.kMer}</div><div class="val">${x(d.totals.mer)}</div><div class="sub">${t.basisVal(true)}</div></div>`);

  // 02 — reconciliation table (only meaningful with Shopify)
  const recon = d.hasShopify
    ? `<div class="tablewrap"><table><caption>${t.captionRecon}</caption>
<thead><tr><th>${t.mSystem}</th><th class="num">${t.mOrders}</th><th class="num">${t.mRevenue}</th></tr></thead>
<tbody>
<tr><td>${t.mShop}</td><td class="num">${d.totals.shopOrders}</td><td class="num">${money(d.totals.shopRevenue ?? 0)}</td></tr>
<tr><td>${t.mAds}</td><td class="num">${Math.round(d.totals.adsConversions)}</td><td class="num">${money(d.totals.adsRevenue)}</td></tr>
</tbody></table></div>`
    : "";

  // 03 — campaigns + terms
  const campRows = d.campaigns.map(c =>
    `<tr><td>${esc(c.name)}${c.isBrand ? `<span class="tag">${t.cBrandTag}</span>` : ""}</td><td class="num">${money(c.spend)}</td><td class="num">${c.clicks.toLocaleString(loc)}</td><td class="num">${Math.round(c.conversions)}</td><td class="num">${money(c.conversionValue)}</td><td class="num">${c.spend > 0 ? (c.conversionValue / c.spend).toFixed(2) + "×" : "—"}</td></tr>`).join("");
  const campTable = d.campaigns.length
    ? `<div class="tablewrap"><table><caption>${t.captionCampaigns}</caption>
<thead><tr><th>${t.cCampaign}</th><th class="num">${t.cSpend}</th><th class="num">${t.cClicks}</th><th class="num">${t.cConv}</th><th class="num">${t.cRevenue}</th><th class="num">${t.cRoas}</th></tr></thead>
<tbody>${campRows}</tbody>
<tfoot><tr><td>${d.language === "nl" ? "Totaal" : "Total"}</td><td class="num">${money(d.totals.spend)}</td><td class="num">${d.totals.clicks.toLocaleString(loc)}</td><td class="num">${Math.round(d.totals.adsConversions)}</td><td class="num">${money(d.totals.adsRevenue)}</td><td class="num">${x(d.totals.roas)}</td></tr></tfoot></table></div>`
    : "";
  const termTable = (rows: typeof d.termWinners, title: string) => rows.length
    ? `<h3>${title}</h3><div class="tablewrap"><table>
<thead><tr><th>${t.term}</th><th class="num">${t.cClicks}</th><th class="num">${t.cSpend}</th><th class="num">${t.cConv}</th><th class="num">${t.cRevenue}</th></tr></thead>
<tbody>${rows.map(r => `<tr><td>${esc(r.term)}</td><td class="num">${r.clicks}</td><td class="num">${d.currencySymbol}${r.cost.toFixed(2)}</td><td class="num">${Math.round(r.conversions)}</td><td class="num">${money(r.conversionValue)}</td></tr>`).join("")}</tbody></table></div>`
    : "";

  // 04 — products
  const prodSource = d.products.length ? d.products : d.adProducts;
  const showAdCols = prodSource.some(p => p.adSpend > 0 || p.adValue > 0);
  const prodTable = prodSource.length
    ? `${d.products.length ? "" : `<p>${t.adsOnlyProducts}</p>`}<div class="tablewrap"><table><caption>${t.captionProducts}</caption>
<thead><tr><th>${t.pProduct}</th>${d.products.length ? `<th class="num">${t.pUnits}</th><th class="num">${t.pRevenue}</th>` : ""}${showAdCols ? `<th class="num">${t.pAdSpend}</th><th class="num">${t.pAdRev}</th>` : ""}</tr></thead>
<tbody>${prodSource.map(p => `<tr><td>${esc(p.title)}</td>${d.products.length ? `<td class="num">${p.units}</td><td class="num">${money(p.revenue)}</td>` : ""}${showAdCols ? `<td class="num">${p.adSpend > 0 ? money(p.adSpend) : "—"}</td><td class="num">${p.adValue > 0 ? money(p.adValue) : "—"}</td>` : ""}</tr>`).join("")}</tbody></table></div>`
    : "";

  // 05 — discounts (body only; sec() is called in render order below so the
  // section numbers stay sequential)
  const discBody = d.discounts.length
    ? `<div class="tablewrap"><table>
<thead><tr><th>${t.dCode}</th><th class="num">${t.dOrders}</th><th class="num">${t.dGiven}</th><th class="num">${t.dNet}</th></tr></thead>
<tbody>${d.discounts.map(dc => `<tr><td>${esc(dc.code)}</td><td class="num">${dc.orders}</td><td class="num">${money(dc.discounted)}</td><td class="num">${money(dc.revenue)}</td></tr>`).join("")}</tbody></table></div>`
    : "";

  // Comparison table
  const cmpRow = (label: string, prevV: string, thisV: string) => `<tr><td>${label}</td><td class="num">${prevV}</td><td class="num">${thisV}</td></tr>`;
  const compareTable = `<div class="tablewrap"><table><caption>${t.captionCompare}</caption>
<thead><tr><th></th><th class="num">${t.cvPrev}</th><th class="num">${t.cvThis}</th></tr></thead>
<tbody>
${cmpRow(t.kSpend, money(d.previous.spend), money(d.totals.spend))}
${cmpRow(t.kAdsRev, money(d.previous.adsRevenue), money(d.totals.adsRevenue))}
${cmpRow(t.kRoas, x(d.previous.roas), x(d.totals.roas))}
${d.totals.brandCampaigns.length ? cmpRow(t.kRoasNb, x(d.previous.nbRoas), x(d.totals.nbRoas)) : ""}
${d.previous.shopRevenue != null && d.totals.shopRevenue != null ? cmpRow(t.kShopRev, money(d.previous.shopRevenue), money(d.totals.shopRevenue)) : ""}
</tbody></table></div>`;

  // Caveats — auto (data-driven) + the model's extra ones.
  const caveats: string[] = [];
  if (d.partialMonth) caveats.push(t.caveatPartial);
  caveats.push(t.caveatLag);
  if (!d.hasShopify) caveats.push(t.caveatNoShop); else caveats.push(t.caveatAttribution);
  if (d.hasTerms) caveats.push(t.caveatTermsHidden); else caveats.push(t.caveatTermsGone);
  if (d.totals.brandCampaigns.length) caveats.push(t.caveatBrand(d.totals.brandCampaigns.join(", ")));
  caveats.push(t.caveatChannels);
  for (const c of content.extraCaveats ?? []) caveats.push(c);

  const body = [
    sec(t.inShort, `<div class="kpis">${kpis.join("")}</div>${paras(content.inShort)}`),
    sec(d.hasShopify ? t.adsVsOrders : t.adsVsNoShop, `${recon}${paras(content.adsVsOrders)}`),
    sec(t.googleDetail, `${campTable}${paras(content.googleDetail)}${termTable(d.termWinners, t.winners)}${termTable(d.termLeaks, t.leaks)}${d.termLeaks.length ? `<p>${esc(t.leakSum(money(d.leakTotal)))}</p>` : ""}`),
    prodSource.length ? sec(t.products, `${prodTable}${paras(content.productsNote)}`) : "",
    discBody ? sec(t.discounts, discBody) : "",
    sec(t.compare, `${compareTable}${paras(content.comparisonNote)}`),
    sec(t.unknown, `<p>${esc(t.unknownDek)}</p><ul class="plain">${caveats.map(c => `<li>${inline(c)}</li>`).join("")}</ul>`),
  ].filter(Boolean).join("\n");

  return `<!doctype html><html lang="${d.language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.client)} — ${esc(t.eyebrow)} ${esc(t.monthName(d.month))}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..600&family=Karla:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>${CSS}</style></head><body>
<header class="masthead"><div class="wrap">
<div class="eyebrow">${esc(t.eyebrow)} &middot; ${esc(d.client)}</div>
<h1>${inline(content.title)}</h1>
<p class="dek">${inline(content.dek)}</p>
<div class="meta-line">
<div>${t.period}<b>${esc(t.fullPeriod(d))}</b></div>
<div>${t.basis}<b>${esc(t.basisVal(d.hasShopify))}</b></div>
<div>${t.sources}<b>Google Ads${d.hasShopify ? ", Shopify" : ""}</b></div>
<div>${t.drawnUp}<b>${today}</b></div>
</div></div></header>
<main class="wrap">${body}</main>
<div class="wrap"><div class="foot"><p>${t.foot(today, d.hasShopify)}</p></div></div>
</body></html>`;
}
