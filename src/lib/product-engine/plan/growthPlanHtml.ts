// Renders an AI-authored GrowthPlanContent into the on-brand Ecomtrada 90-day plan HTML.
// The template + CSS match the approved "Briller" reference exactly. The momentum chart
// is generated in code from the real window data (not authored by the model).
//
// Dependency-free (no server imports) so it can also run in the browser for downloads.

import { GrowthPlanContent, GrowthPlanRender, MomentumWindow } from './growthPlanTypes';

const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Escape, then allow **bold** and newlines. Used for all authored prose. */
function rich(s: unknown): string {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\r?\n/g, '<br>');
}

function curSymbol(currency: string): string {
  const m: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', AUD: 'A$', CAD: 'C$', SEK: 'kr', DKK: 'kr', NOK: 'kr', PLN: 'zł' };
  return m[currency] ?? `${currency} `;
}
const money = (sym: string, n: number) =>
  sym.length === 1 || sym.endsWith('$') ? `${sym}${Math.round(n).toLocaleString()}` : `${sym}${Math.round(n).toLocaleString()}`;

/** Build the momentum bar chart SVG from up to three windows. */
function momentumSvg(windows: MomentumWindow[], sym: string): string {
  const w3 = windows.slice(0, 3);
  const baseline = 210, maxH = 168;
  const maxVal = Math.max(1, ...w3.map((w) => Math.max(w.convValuePerDay, w.spendPerDay)));
  const goldX = [95, 345, 595];
  const bars = w3.map((w, i) => {
    const gx = goldX[i];
    const sx = gx + 72;
    const goldH = Math.max(6, Math.round((w.convValuePerDay / maxVal) * maxH));
    const grayH = Math.max(6, Math.round((w.spendPerDay / maxVal) * maxH));
    const goldY = baseline - goldH;
    const grayY = baseline - grayH;
    const cVal = `${money(sym, w.convValuePerDay)}/d`;
    const sVal = `${money(sym, w.spendPerDay)}/d`;
    const label = `${esc(w.label)} · ROAS ${w.roas.toFixed(2)}`;
    return `
      <rect x="${gx}" y="${goldY}" width="64" height="${goldH}" rx="3" fill="url(#g)"></rect>
      <rect x="${sx}" y="${grayY}" width="64" height="${grayH}" rx="3" fill="#2a3a32"></rect>
      <text x="${gx + 32}" y="${goldY - 8}" fill="#F9C31F" font-size="12" text-anchor="middle" font-family="Arial" font-weight="800">${cVal}</text>
      <text x="${sx + 32}" y="${grayY - 7}" fill="#cdd5cf" font-size="11" text-anchor="middle" font-family="Arial">${sVal}</text>
      <text x="${gx + 68}" y="234" fill="#9fb3a8" font-size="12" text-anchor="middle" font-family="Arial" font-weight="700">${label}</text>`;
  }).join('');
  return `<svg viewBox="0 0 820 250" style="width:100%;" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#F2A60D"></stop><stop offset="1" stop-color="#F9C31F"></stop></linearGradient></defs>
    <text x="20" y="18" fill="#9fb3a8" font-size="13" font-weight="700" font-family="Arial">Google conv. value vs spend per day — and the ROAS on each window</text>
    <line x1="20" y1="210" x2="800" y2="210" stroke="#26342b" stroke-width="1.5"></line>${bars}
  </svg>`;
}

const WHO_CLASS: Record<string, string> = { Ecomtrada: 'b-ec', Client: 'b-cl', Together: 'b-both' };
const WHO_LABEL: Record<string, string> = { Ecomtrada: 'Ecomtrada', Client: 'Client', Together: 'Together' };

export function renderGrowthPlanHtml(content: GrowthPlanContent, render: GrowthPlanRender): string {
  const sym = curSymbol(render.currency);

  const findingCards = (items: { big: string; body: string }[]) =>
    items.map((f) => `<div class="finding"><div class="big">${esc(f.big)}</div><div class="t">${rich(f.body)}</div></div>`).join('');

  const planRows = content.phases.map((ph) => {
    const head = `<tr class="phase-row"><td colspan="3">${esc(ph.title)}</td></tr>`;
    const body = ph.rows.map((r) =>
      `<tr><td>${rich(r.action)}</td><td><span class="badge ${WHO_CLASS[r.who] ?? 'b-both'}">${WHO_LABEL[r.who] ?? r.who}</span></td><td>${esc(r.when)}</td></tr>`
    ).join('');
    return head + body;
  }).join('');

  const goalRows = content.goals.map((g) =>
    `<tr${g.expand ? ' class="exp"' : ''}><td>${esc(g.goal)}</td><td>${rich(g.now)}</td><td>${rich(g.target)}</td><td>${rich(g.assessment)}</td></tr>`
  ).join('');

  const needItems = content.needs.map((n) => `<li>${rich(n)}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ecomtrada — 90-Day Plan — ${esc(render.client)}</title>
<style>
  :root{color-scheme:dark;--bg:#0B130F;--card:#141F1A;--paper:#F5F4F0;--dim:#9fb3a8;--gold:#F9C31F;--gold-dark:#F2A60D;--green:#33CC80;--red:#dc4444;--line:#26342b;--grad:linear-gradient(135deg,#F9C31F 0%,#F2A60D 45%,#33CC80 100%);}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:var(--paper);background:#050806;}
  .page{max-width:900px;margin:0 auto;background:var(--bg);}
  .hdr{padding:38px 46px 34px;position:relative;}
  .brand{font-size:23px;font-weight:800;letter-spacing:-.5px;}.brand .dot{color:var(--gold);}
  .hdr h1{font-size:40px;line-height:1.08;margin-top:22px;font-weight:800;letter-spacing:-1px;}
  .hdr h1 .grad{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;}
  .hdr .sub{margin-top:14px;font-size:14px;color:var(--dim);}
  .body{padding:8px 46px 46px;}
  .sec{margin-bottom:30px;}
  .sec h2{font-size:12px;text-transform:uppercase;letter-spacing:1.6px;font-weight:800;margin-bottom:14px;color:var(--green);}
  .card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:24px 26px;}
  .card.glow{position:relative;overflow:hidden;}
  .card.glow::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 12% 0%,rgba(249,195,31,.10),transparent 45%),radial-gradient(circle at 90% 100%,rgba(51,204,128,.10),transparent 45%);pointer-events:none;}
  .lead{font-size:15.5px;line-height:1.65;color:#e8eae6;position:relative;}
  .lead b{color:var(--gold);font-weight:700;}
  .findings{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .finding{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:18px 20px;}
  .finding .big{font-size:27px;font-weight:800;line-height:1;background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;}
  .finding .t{font-size:13px;line-height:1.5;color:#d7dcd8;margin-top:8px;}
  .finding .t b{color:var(--paper);font-weight:700;}
  table{width:100%;border-collapse:separate;border-spacing:0;font-size:13px;border:1px solid var(--line);border-radius:14px;overflow:hidden;}
  th,td{padding:11px 13px;text-align:left;vertical-align:top;border-bottom:1px solid var(--line);}
  th{background:#0e1712;color:var(--dim);font-size:10.5px;text-transform:uppercase;letter-spacing:.6px;font-weight:700;}
  td{color:#dde2de;} tr:last-child td{border-bottom:none;}
  td b{color:var(--gold);}
  .phase-row td{background:rgba(51,204,128,.08);color:var(--green);font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:.6px;}
  .badge{display:inline-block;border-radius:99px;padding:3px 11px;font-size:11px;font-weight:700;white-space:nowrap;}
  .b-ec{background:rgba(51,204,128,.15);color:var(--green);border:1px solid rgba(51,204,128,.4);}
  .b-cl{background:rgba(249,195,31,.13);color:var(--gold);border:1px solid rgba(249,195,31,.4);}
  .b-both{background:rgba(255,255,255,.08);color:#cdd5cf;border:1px solid var(--line);}
  .scen .exp td{background:rgba(51,204,128,.10);} .scen td b{color:var(--gold);}
  .need{background:linear-gradient(135deg,rgba(249,195,31,.08),rgba(51,204,128,.05));border:1px solid rgba(249,195,31,.3);border-radius:16px;padding:8px 26px;}
  .need li{margin:12px 0;font-size:14px;line-height:1.5;color:#e8eae6;list-style:none;padding-left:30px;position:relative;}
  .need li::before{content:"";position:absolute;left:0;top:3px;width:16px;height:16px;border-radius:50%;background:var(--grad);}
  .need li b{color:var(--paper);}
  .legend{font-size:11.5px;color:var(--dim);margin-top:10px;} .legend .badge{margin-right:4px;}
  .note{font-size:11px;color:var(--dim);margin-top:8px;}
  .footer{padding:22px 46px 40px;color:var(--dim);font-size:11.5px;text-align:center;border-top:1px solid var(--line);} .footer .dot{color:var(--gold);}
  @page{margin:0;background:#0B130F;}
</style>
</head>
<body>
<div class="page">
  <div class="hdr">
    <div class="brand">ecomtrada<span class="dot">.</span></div>
    <h1>90-Day Plan<br><span class="grad">${esc(render.client)}</span></h1>
    <div class="sub">${rich(render.subtitle)}</div>
  </div>

  <div class="body">

    <div class="sec">
      <h2>The strategy</h2>
      <div class="card glow"><p class="lead">${rich(content.strategyLead)}</p></div>
    </div>

    <div class="sec">
      <h2>Where ${esc(render.client)} stands today (Google, last 90 days)</h2>
      <div class="findings">${findingCards(content.standToday)}</div>
    </div>

    <div class="sec">
      <h2>The honest read on the numbers</h2>
      <div class="card"><p class="lead">${rich(content.honestRead)}</p></div>
    </div>

    <div class="sec">
      <h2>Momentum: the last 90 → 30 → 14 days</h2>
      <div class="card">
        ${momentumSvg(render.windows, sym)}
        <p class="note">${rich(content.momentumNote)}</p>
      </div>
    </div>

    <div class="sec">
      <h2>The levers we pull</h2>
      <div class="findings">${findingCards(content.levers)}</div>
    </div>

    <div class="sec">
      <h2>The 90-day plan</h2>
      <table><tbody>
        <tr><th style="width:58%">Action</th><th>Who</th><th>When</th></tr>
        ${planRows}
      </tbody></table>
      <div class="legend"><span class="badge b-ec">Ecomtrada</span> we do this &nbsp; <span class="badge b-cl">Client</span> you do this &nbsp; <span class="badge b-both">Together</span> jointly</div>
    </div>

    <div class="sec">
      <h2>The forecast &amp; your goals</h2>
      <div class="card" style="margin-bottom:16px"><p class="lead">${rich(content.forecastIntro)}</p></div>
      <div class="card">
        <table class="scen"><tbody>
          <tr><th>Goal</th><th>Where you are now</th><th>90-day target</th><th>Assessment</th></tr>
          ${goalRows}
        </tbody></table>
        <p class="note">${rich(content.forecastRead)}</p>
      </div>
      <div class="card" style="margin-top:16px"><p class="lead">${rich(content.seasonalNote)}</p></div>
    </div>

    <div class="sec">
      <h2>What we need from you</h2>
      <div class="need"><ul>${needItems}</ul></div>
    </div>

  </div>
  <div class="footer">ecomtrada<span class="dot">.</span> — Google Ads for webshops · This plan is the anchor of our collaboration; you'll hear from us weekly against exactly these goals.</div>
</div>
</body></html>`;
}
