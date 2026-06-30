// 90-day plan generator. Produces a standalone, on-brand HTML document, pre-filled with the
// data scaffold from the analysis.

import { AnalysisResult } from '../engine/types';
import { BRAND } from '../brand';

export interface PlanInputs {
  client: string;
  market?: string;
  amName?: string;
  targetRoas?: number;
  periodLabel?: string;
  language?: 'nl' | 'en';
  makeOrBreak?: string;
  levers?: { title: string; body: string }[];
  phases?: { title: string; weeks: string; items: string[] }[];
  notes?: string;
}

const fmt = (n: number, d = 0) => n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function generatePlanHtml(result: AnalysisResult, input: PlanInputs): string {
  const t = result.totals;
  const cur = result.currency;
  const winners = result.products.filter((p) => p.status === 'WINNER').slice(0, 8);
  const dead = result.statusSummary.find((s) => s.status === 'EXCLUDE');
  const drag = result.statusSummary.find((s) => s.status === 'DRAG');
  const deadDragPct = ((dead?.spendPct ?? 0) + (drag?.spendPct ?? 0)) * 100;
  const lang = input.language ?? 'en';
  const L = lang === 'nl'
    ? { snapshot: 'Account-snapshot', findings: 'Wat de data zegt', spend: 'Spend', revenue: 'Omzet', roas: 'ROAS', conv: 'Conversies', convrate: 'Conv-rate', be: 'Break-even', winners: 'Winners om op te concentreren', mob: 'De make-or-break factor', levers: 'De hefbomen', phases: 'Het 90-dagen plan', wasted: 'spend naar DRAG + EXCLUDE', target: 'Doel-ROAS' }
    : { snapshot: 'Account snapshot', findings: 'What the data says', spend: 'Spend', revenue: 'Revenue', roas: 'ROAS', conv: 'Conversions', convrate: 'Conv rate', be: 'Break-even', winners: 'Winners to concentrate on', mob: 'The make-or-break factor', levers: 'The levers', phases: 'The 90-day plan', wasted: 'spend to DRAG + EXCLUDE', target: 'Target ROAS' };

  const levers = (input.levers && input.levers.length ? input.levers : [
    { title: 'Cut the dead spend', body: `${fmt(deadDragPct)}% of spend is in DRAG/EXCLUDE products. Exclude the tested zero-sellers, throttle the under-break-even drags, and redeploy to proven converters.` },
    { title: 'Concentrate on winners', body: `Push budget toward the ${winners.length} WINNER products and feed the PROMISING set into winner status.` },
    { title: 'Profit, not revenue', body: `Add COGS so we steer on POAS, not platform ROAS. Break-even is ${t.breakEven}${t.breakEvenAssumed ? ' (assumed — confirm margin)' : ''}.` },
  ]);

  const phases = (input.phases && input.phases.length ? input.phases : [
    { title: 'Phase 1 · Clean', weeks: 'Week 1-2', items: ['Exclude tested zero-sellers', 'Throttle below-break-even drags', 'Confirm tracking & margin/COGS'] },
    { title: 'Phase 2 · Concentrate', weeks: 'Week 3-6', items: ['Shift budget to winners', 'Promote PROMISING into winner status', 'Restructure feed around proven products'] },
    { title: 'Phase 3 · Scale', weeks: 'Week 7-12', items: ['Scale at or above target ROAS', 'Expand winning themes', 'Review and reset targets'] },
  ]);

  const winnerRows = winners.map((w) =>
    `<tr><td>${esc(w.product)}</td><td>${cur} ${fmt(w.spend)}</td><td>${cur} ${fmt(w.revenue)}</td><td><b>${w.roas.toFixed(2)}</b></td></tr>`
  ).join('') || `<tr><td colspan="4" style="color:${BRAND.dim}">No products in WINNER status yet — focus is on promotion from TEST/PROMISING.</td></tr>`;

  const leverCards = levers.map((l, i) =>
    `<div class="lever"><div class="ln">${i + 1}</div><div><h3>${esc(l.title)}</h3><p>${esc(l.body)}</p></div></div>`
  ).join('');

  const phaseRows = phases.map((p) =>
    `<div class="phase"><div class="pw"><b>${esc(p.title)}</b><span>${esc(p.weeks)}</span></div><ul>${p.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(input.client)} — 90-day plan</title>
<style>
  :root{--bg:${BRAND.bg};--card:${BRAND.card};--paper:${BRAND.paper};--dim:${BRAND.dim};--gold:${BRAND.gold};--green:${BRAND.green};--line:${BRAND.line};--grad:${BRAND.gradient};}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:${BRAND.fontStack};color:var(--paper);background:${BRAND.bgDeep};line-height:1.6;}
  .page{max-width:900px;margin:0 auto;background:var(--bg);}
  .hdr{padding:40px 48px 22px;border-bottom:1px solid var(--line);}
  .brand{font-size:22px;font-weight:800;}.brand .dot{color:var(--gold);}
  .hdr h1{font-size:30px;font-weight:800;letter-spacing:-1px;margin-top:14px;}
  .hdr h1 .grad{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;}
  .hdr .sub{margin-top:8px;font-size:13px;color:var(--dim);}
  .body{padding:10px 48px 48px;}
  h2{font-size:16px;font-weight:800;margin:30px 0 12px;}
  h2 .n{color:var(--green);margin-right:8px;}
  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:10px;}
  .stat{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;}
  .stat .k{font-size:11px;color:var(--dim);text-transform:uppercase;letter-spacing:1px;}
  .stat .v{font-size:24px;font-weight:800;margin-top:4px;}
  .stat .v.grad{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;}
  table{width:100%;border-collapse:collapse;margin-top:8px;font-size:13px;}
  th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);}
  th{color:var(--dim);font-size:11px;text-transform:uppercase;letter-spacing:.5px;}
  .lever{display:flex;gap:14px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px 18px;margin-bottom:10px;}
  .lever .ln{font-size:22px;font-weight:900;color:var(--gold);min-width:26px;}
  .lever h3{font-size:15px;margin-bottom:4px;}
  .lever p{font-size:13px;color:#dde2de;}
  .phase{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 18px;margin-bottom:10px;}
  .phase .pw{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
  .phase .pw span{font-size:12px;color:var(--dim);}
  .phase ul{margin-left:18px;font-size:13px;color:#dde2de;}
  .mob{background:linear-gradient(135deg,rgba(249,195,31,.10),rgba(51,204,128,.06));border:1px solid rgba(249,195,31,.3);border-radius:14px;padding:16px 20px;font-size:14px;}
  .footer{padding:18px 48px 40px;color:var(--dim);font-size:11.5px;text-align:center;}.footer .dot{color:var(--gold);}
  .editable{outline:1px dashed transparent;}.editable:focus{outline:1px dashed var(--gold);}
</style>
</head>
<body>
<div class="page">
  <div class="hdr">
    <div class="brand">ecomtrada<span class="dot">.</span></div>
    <h1>${esc(input.client)} — <span class="grad">90-day plan</span></h1>
    <div class="sub">${esc(input.periodLabel ?? '')}${input.market ? ' · ' + esc(input.market) : ''}${input.amName ? ' · ' + esc(input.amName) : ''}${result.dateRange ? ' · data: ' + esc(result.dateRange) : ''}</div>
  </div>
  <div class="body">

    <h2><span class="n">01</span>${L.snapshot}</h2>
    <div class="stats">
      <div class="stat"><div class="k">${L.spend}</div><div class="v">${cur} ${fmt(t.spend)}</div></div>
      <div class="stat"><div class="k">${L.revenue}</div><div class="v">${cur} ${fmt(t.revenue)}</div></div>
      <div class="stat"><div class="k">${L.roas}</div><div class="v grad">${t.roas.toFixed(2)}</div></div>
      <div class="stat"><div class="k">${L.conv}</div><div class="v">${fmt(t.conv)}</div></div>
      <div class="stat"><div class="k">${L.convrate}</div><div class="v">${(t.convRate * 100).toFixed(2)}%</div></div>
      <div class="stat"><div class="k">${L.be}${input.targetRoas ? ' · ' + L.target : ''}</div><div class="v">${t.breakEven}${input.targetRoas ? ' / ' + input.targetRoas.toFixed(1) : ''}</div></div>
    </div>

    <h2><span class="n">02</span>${L.findings}</h2>
    <p style="font-size:13.5px;color:#dde2de"><b>${fmt(deadDragPct)}%</b> ${L.wasted}.
       ${result.exclusions.length} ${lang === 'nl' ? 'varianten zijn nu veilig uit te sluiten' : 'variants are safe to exclude now'}
       (${cur} ${fmt(result.exclusionRecovered)} ${lang === 'nl' ? 'spend terug te winnen' : 'spend recoverable'}).</p>

    <h2><span class="n">03</span>${L.winners}</h2>
    <table>
      <tr><th>Product</th><th>${L.spend}</th><th>${L.revenue}</th><th>${L.roas}</th></tr>
      ${winnerRows}
    </table>

    <h2><span class="n">04</span>${L.mob}</h2>
    <div class="mob editable" contenteditable="true">${esc(input.makeOrBreak ?? (lang === 'nl' ? '[Vul de make-or-break factor in — het klant-specifieke ding dat de strategie bepaalt en onzichtbaar is in de cijfers.]' : '[Fill in the make-or-break factor — the client-specific thing that decides strategy and is invisible in the numbers.]'))}</div>

    <h2><span class="n">05</span>${L.levers}</h2>
    ${leverCards}

    <h2><span class="n">06</span>${L.phases}</h2>
    ${phaseRows}

    ${input.notes ? `<h2><span class="n">07</span>${lang === 'nl' ? 'Notities' : 'Notes'}</h2><p style="font-size:13.5px;color:#dde2de">${esc(input.notes)}</p>` : ''}

  </div>
  <div class="footer">ecomtrada<span class="dot">.</span> — 90-day plan${result.totals.breakEvenAssumed ? ' · break-even assumed (confirm margin)' : ''}</div>
</div>
</body>
</html>`;
}

export function downloadPlanHtml(result: AnalysisResult, input: PlanInputs): void {
  const html = generatePlanHtml(result, input);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${input.client}-90day-plan.html`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
