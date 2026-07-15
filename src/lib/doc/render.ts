/**
 * Render a structured DocContent into a standalone, client-ready HTML page in
 * the ecomtrada house style (dark theme, gold→green, the wordmark). Deterministic
 * — the model authors structured content, never HTML, so every doc is on-brand.
 *
 * "doc" flows as a report; "deck" lays each section out as a full-page slide.
 * Both carry print CSS so ⌘P → Save as PDF yields a clean deliverable.
 */
import type { DocContent, DocStat } from "./types";

const esc = (s: string): string =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function inline(s: string): string {
  return esc(s).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
}

const CSS = `
  :root{color-scheme:dark;--bg:#0B130F;--card:#141F1A;--paper:#F5F4F0;--dim:#9fb3a8;--gold:#F9C31F;--gold2:#F2A60D;--green:#33CC80;--red:#dc4444;--line:#26342b;--grad:linear-gradient(135deg,#F9C31F 0%,#F2A60D 45%,#33CC80 100%);}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:var(--paper);background:#050806;line-height:1.6;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .page{max-width:900px;margin:0 auto;background:var(--bg);}
  .hdr{padding:38px 46px 30px;border-bottom:1px solid var(--line);}
  .brand{font-size:23px;font-weight:800;letter-spacing:-.5px;}.brand .dot{color:var(--gold);}
  .eyebrow{margin-top:16px;font-size:11px;text-transform:uppercase;letter-spacing:1.6px;font-weight:800;color:var(--green);}
  .hdr h1{font-size:36px;line-height:1.1;margin-top:8px;font-weight:800;letter-spacing:-1px;}
  .hdr h1 .grad{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;}
  .hdr .sub{margin-top:12px;font-size:13.5px;color:var(--dim);}
  .body{padding:8px 46px 46px;}
  .sec{margin-bottom:30px;}
  .sec h2{font-size:12px;text-transform:uppercase;letter-spacing:1.6px;font-weight:800;margin:26px 0 14px;color:var(--green);}
  .card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:22px 24px;}
  .lead{font-size:15px;line-height:1.65;color:#e8eae6;}.lead b{color:var(--gold);font-weight:700;}
  .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:6px 0;}
  .stat{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;}
  .stat .k{font-size:10.5px;color:var(--dim);text-transform:uppercase;letter-spacing:1px;}
  .stat .v{font-size:22px;font-weight:800;margin-top:4px;}
  .stat .v.grad{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;}
  .stat .v.bad{color:var(--red);}.stat .v.good{color:var(--green);}
  .stat .s{font-size:11px;color:var(--dim);margin-top:2px;}
  ul{margin:8px 0 4px 2px;list-style:none;}
  li{padding:5px 0 5px 22px;position:relative;font-size:14px;color:#dde2de;}
  li::before{content:"";position:absolute;left:2px;top:12px;width:6px;height:6px;border-radius:50%;background:var(--green);opacity:.75;}
  li b{color:var(--paper);}
  table{width:100%;border-collapse:separate;border-spacing:0;font-size:13px;border:1px solid var(--line);border-radius:14px;overflow:hidden;margin-top:8px;}
  th,td{padding:10px 12px;text-align:left;vertical-align:top;border-bottom:1px solid var(--line);}
  th{background:#0e1712;color:var(--dim);font-size:10.5px;text-transform:uppercase;letter-spacing:.6px;font-weight:700;}
  td{color:#dde2de;}tr:last-child td{border-bottom:none;}
  .callout{background:linear-gradient(135deg,rgba(249,195,31,.10),rgba(51,204,128,.06));border:1px solid rgba(249,195,31,.3);border-radius:12px;padding:14px 18px;font-size:13.5px;margin-top:12px;color:#e8eae6;}
  .callout b{color:var(--gold);}
  .foot{padding:20px 46px 40px;color:var(--dim);font-size:11.5px;text-align:center;border-top:1px solid var(--line);}.foot .dot{color:var(--gold);}
  /* Deck: each section becomes a slide */
  .deck .slide{min-height:92vh;padding:52px 60px;border-bottom:1px solid var(--line);display:flex;flex-direction:column;justify-content:center;}
  .deck .slide.title{justify-content:flex-end;}
  .deck .slide h2{font-size:14px;margin:0 0 18px;}
  .deck .slide .lead{font-size:19px;line-height:1.6;}
  .deck .slide li{font-size:17px;padding-top:8px;padding-bottom:8px;}
  .deck .hdr{border-bottom:none;}
  @media(max-width:640px){.hdr,.body{padding-left:22px;padding-right:22px;}.deck .slide{padding:30px 24px;min-height:auto;}}
  @page{margin:0;}
  @media print{
    body{background:#050806;}
    .page{max-width:none;}
    .deck .slide{page-break-after:always;min-height:100vh;}
    .sec{page-break-inside:avoid;}
  }
`;

const statTone = (s?: string) => s === "grad" ? " grad" : s === "bad" ? " bad" : s === "good" ? " good" : "";
const statGrid = (stats: DocStat[]) =>
  `<div class="stats">${stats.map(s => `<div class="stat"><div class="k">${esc(s.key)}</div><div class="v${statTone(s.tone)}">${esc(s.value)}</div>${s.sub ? `<div class="s">${esc(s.sub)}</div>` : ""}</div>`).join("")}</div>`;

function sectionInner(sec: DocContent["sections"][number]): string {
  const parts: string[] = [];
  if (sec.lead) parts.push(`<p class="lead">${inline(sec.lead)}</p>`);
  if (sec.stats?.length) parts.push(statGrid(sec.stats));
  if (sec.bullets?.length) parts.push(`<ul>${sec.bullets.map(b => `<li>${inline(b)}</li>`).join("")}</ul>`);
  if (sec.table?.columns?.length) {
    parts.push(`<table><thead><tr>${sec.table.columns.map(c => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${(sec.table.rows ?? []).map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
  }
  if (sec.callout) parts.push(`<div class="callout">${inline(sec.callout)}</div>`);
  return parts.join("");
}

export function renderDocHtml(doc: DocContent): string {
  const isDeck = doc.format === "deck";
  const header = `<div class="hdr">
    <div class="brand">ecomtrada<span class="dot">.</span></div>
    ${doc.docType ? `<div class="eyebrow">${esc(doc.docType)}</div>` : ""}
    <h1>${inline(doc.title.replace(/\*/g, ""))}</h1>
    ${doc.subtitle ? `<div class="sub">${esc(doc.subtitle)}</div>` : ""}
  </div>`;

  const body = isDeck
    ? doc.sections.map(sec => `<div class="slide"><h2>${esc(sec.heading)}</h2>${sectionInner(sec)}</div>`).join("")
    : `<div class="body">${doc.sections.map(sec => `<div class="sec"><h2>${esc(sec.heading)}</h2>${sectionInner(sec)}</div>`).join("")}</div>`;

  const foot = `<div class="foot">ecomtrada<span class="dot">.</span> — ${esc(doc.client)}${doc.docType ? ` · ${esc(doc.docType)}` : ""} · generated from live Google Ads + Shopify data, reviewed by your account team</div>`;

  return `<!DOCTYPE html><html lang="${doc.language}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(doc.client)} — ${esc(doc.docType || doc.title)}</title><style>${CSS}</style></head>
<body><div class="page${isDeck ? " deck" : ""}">
  ${isDeck ? `<div class="slide title">${header}</div>` : header}
  ${body}
  ${foot}
</div></body></html>`;
}
