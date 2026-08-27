/**
 * Render a structured PlanContent into a standalone, client-ready HTML page in
 * the ecomtrada house style (dark theme, gold→green, the wordmark, SVG trend
 * charts drawn from real window data). Deterministic — no model output here, so
 * every plan is on-brand and the charts show real numbers.
 */
import type { PlanContent, PlanCharts } from "./types";

const esc = (s: string): string =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Inline **bold** → <b>, safely (escape first, then unescape the marker). */
function inline(s: string): string {
  return esc(s).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
}

const money = (n: number, sym: string) => `${sym}${Math.round(n).toLocaleString("en-GB")}`;

const T = {
  en: { whereWeStart: "Where we start", decides: "This decides everything", dataSays: "What the data says",
    trend: "The trend in view", levers: "The levers", weBuild: "What we build in your account",
    theDays: "The 90 days, phase by phase", forecast: "Where we aim by day 90", weNeed: "What we need from you",
    metric: "Metric", now: "Now", day90: "Day 90 target", action: "Action", who: "Who", when: "When",
    weDo: "we do this", youDo: "you do this", jointly: "jointly", roasStable: "ROAS across the windows", dayRev: "Avg daily revenue" },
  nl: { whereWeStart: "Waar we staan", decides: "Dit bepaalt alles", dataSays: "Wat de data laat zien",
    trend: "De trend in beeld", levers: "De hefbomen", weBuild: "Wat we in je account bouwen",
    theDays: "Het 90-dagen plan", forecast: "Waar we mikken op dag 90", weNeed: "Wat we van jou nodig hebben",
    metric: "Metric", now: "Nu", day90: "Doel dag 90", action: "Actie", who: "Wie", when: "Wanneer",
    weDo: "wij doen dit", youDo: "jij doet dit", jointly: "samen", roasStable: "ROAS over de windows", dayRev: "Gem. dagomzet" },
};

const CSS = `
  :root{color-scheme:dark;--bg:#0B130F;--card:#141F1A;--paper:#F5F4F0;--dim:#9fb3a8;--gold:#F9C31F;--gold2:#F2A60D;--green:#33CC80;--red:#dc4444;--line:#26342b;--grad:linear-gradient(135deg,#F9C31F 0%,#F2A60D 45%,#33CC80 100%);}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:var(--paper);background:#050806;line-height:1.6;}
  .page{max-width:900px;margin:0 auto;background:var(--bg);}
  .hdr{padding:38px 46px 30px;border-bottom:1px solid var(--line);}
  .brand{font-size:23px;font-weight:800;letter-spacing:-.5px;}.brand .dot{color:var(--gold);}
  .hdr h1{font-size:38px;line-height:1.08;margin-top:18px;font-weight:800;letter-spacing:-1px;}
  .hdr h1 .grad{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;}
  .hdr .sub{margin-top:12px;font-size:13.5px;color:var(--dim);}
  .body{padding:8px 46px 46px;}
  .sec{margin-bottom:30px;}
  .sec h2{font-size:12px;text-transform:uppercase;letter-spacing:1.6px;font-weight:800;margin:26px 0 14px;color:var(--green);}
  .card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:22px 24px;}
  .lead{font-size:15px;line-height:1.65;color:#e8eae6;}.lead b{color:var(--gold);font-weight:700;}
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
  .stat{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;}
  .stat .k{font-size:10.5px;color:var(--dim);text-transform:uppercase;letter-spacing:1px;}
  .stat .v{font-size:22px;font-weight:800;margin-top:4px;}
  .stat .v.grad{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;}
  .stat .v.bad{color:var(--red);}.stat .v.good{color:var(--green);}
  .stat .s{font-size:11px;color:var(--dim);margin-top:2px;}
  .mob{background:linear-gradient(135deg,rgba(229,72,77,.12),rgba(249,195,31,.06));border:1px solid rgba(229,72,77,.4);border-radius:14px;padding:18px 22px;}
  .mob.scale{background:linear-gradient(135deg,rgba(249,195,31,.12),rgba(51,204,128,.06));border-color:rgba(249,195,31,.4);}
  .mob .tag{display:inline-block;font-size:11px;font-weight:800;letter-spacing:1px;color:var(--red);text-transform:uppercase;margin-bottom:8px;}
  .mob.scale .tag{color:var(--gold2);}
  .mob h3{font-size:15px;color:var(--paper);margin-bottom:6px;}
  ul{margin:6px 0 4px 2px;list-style:none;}
  li{padding:5px 0 5px 22px;position:relative;font-size:13.7px;color:#dde2de;}
  li::before{content:"";position:absolute;left:2px;top:12px;width:6px;height:6px;border-radius:50%;background:var(--green);opacity:.7;}
  .findings{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
  .find{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;}
  .find h4{font-size:13px;color:var(--gold);margin-bottom:4px;}.find p{font-size:12.7px;color:#d7dcd8;}
  .lever{display:flex;gap:14px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:15px 18px;margin-bottom:10px;}
  .lever .ln{font-size:22px;font-weight:900;color:var(--gold);min-width:26px;}
  .lever h3{font-size:14.5px;margin-bottom:3px;}.lever p{font-size:12.8px;color:#dde2de;}
  table{width:100%;border-collapse:separate;border-spacing:0;font-size:13px;border:1px solid var(--line);border-radius:14px;overflow:hidden;margin-top:8px;}
  th,td{padding:10px 12px;text-align:left;vertical-align:top;border-bottom:1px solid var(--line);}
  th{background:#0e1712;color:var(--dim);font-size:10.5px;text-transform:uppercase;letter-spacing:.6px;font-weight:700;}
  td{color:#dde2de;}tr:last-child td{border-bottom:none;}td .g{color:var(--green);font-weight:700;}
  .phase-row td{background:rgba(51,204,128,.08);color:var(--green);font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:.6px;}
  .badge{display:inline-block;border-radius:99px;padding:3px 11px;font-size:11px;font-weight:700;white-space:nowrap;}
  .b-ec{background:rgba(51,204,128,.15);color:var(--green);border:1px solid rgba(51,204,128,.4);}
  .b-cl{background:rgba(249,195,31,.13);color:var(--gold);border:1px solid rgba(249,195,31,.4);}
  .b-both{background:rgba(255,255,255,.08);color:#cdd5cf;border:1px solid var(--line);}
  .legend{font-size:11.5px;color:var(--dim);margin-top:10px;}.legend .badge{margin-right:4px;}
  .need{background:linear-gradient(135deg,rgba(249,195,31,.08),rgba(51,204,128,.05));border:1px solid rgba(249,195,31,.3);border-radius:16px;padding:10px 26px;}
  .need li::before{background:var(--grad);width:14px;height:14px;top:11px;left:0;}
  .need li{padding-left:28px;font-size:14px;color:#e8eae6;}.need li b{color:var(--paper);}
  .callout{background:linear-gradient(135deg,rgba(249,195,31,.10),rgba(51,204,128,.06));border:1px solid rgba(249,195,31,.3);border-radius:12px;padding:14px 18px;font-size:13px;margin-top:12px;color:#e8eae6;}
  .note{font-size:11px;color:var(--dim);margin-top:8px;}
  .foot{padding:20px 46px 40px;color:var(--dim);font-size:11.5px;text-align:center;border-top:1px solid var(--line);}.foot .dot{color:var(--gold);}
  @media(max-width:640px){.stats{grid-template-columns:repeat(2,1fr);}.findings{grid-template-columns:1fr;}.hdr,.body{padding-left:22px;padding-right:22px;}}
`;

function roasChart(charts: PlanCharts, label: string): string {
  const pts = charts.roasWindows.filter(w => w.roas != null);
  if (pts.length < 2) return "";
  const target = charts.roasWindows.find(w => w.target != null)?.target ?? null;
  const be = charts.roasWindows.find(w => w.breakEven != null)?.breakEven ?? null;
  const vals = pts.map(p => p.roas as number).concat([target ?? 0, be ?? 0]).filter(v => v > 0);
  const max = Math.max(...vals, 1) * 1.15;
  const x = (i: number) => 70 + i * (300 / Math.max(1, pts.length - 1));
  const y = (v: number) => 180 - (v / max) * 150;
  const poly = pts.map((p, i) => `${x(i)},${y(p.roas as number)}`).join(" ");
  const tgtLine = target ? `<line x1="60" y1="${y(target)}" x2="380" y2="${y(target)}" stroke="#33CC80" stroke-width="1.3" stroke-dasharray="2 3" opacity="0.8"/><text x="380" y="${y(target) - 4}" fill="#33CC80" font-size="10" text-anchor="end" font-family="Arial">${label === "nl" ? "doel" : "target"} ${target.toFixed(1)}</text>` : "";
  const beLine = be ? `<line x1="60" y1="${y(be)}" x2="380" y2="${y(be)}" stroke="#F2A60D" stroke-width="1.3" stroke-dasharray="5 4"/><text x="62" y="${y(be) + 13}" fill="#F2A60D" font-size="10" font-family="Arial">break-even ${be.toFixed(1)}</text>` : "";
  const dots = pts.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.roas as number)}" r="5" fill="#F9C31F"/><text x="${x(i)}" y="${y(p.roas as number) - 10}" fill="#F5F4F0" font-size="12" text-anchor="middle" font-family="Arial" font-weight="700">${(p.roas as number).toFixed(2)}</text><text x="${x(i)}" y="202" fill="#9fb3a8" font-size="11" text-anchor="middle" font-family="Arial">${esc(p.label)}</text>`).join("");
  return `<line x1="60" y1="180" x2="380" y2="180" stroke="#26342b" stroke-width="1.5"/>${tgtLine}${beLine}<polyline points="${poly}" fill="none" stroke="#F9C31F" stroke-width="3"/>${dots}`;
}

function revChart(charts: PlanCharts): string {
  const bars = charts.dailyRevenue;
  if (bars.length < 2) return "";
  const max = Math.max(...bars.map(b => b.value), 1) * 1.1;
  const bw = 64, gap = (330 - bars.length * bw) / Math.max(1, bars.length - 1);
  return bars.map((b, i) => {
    const h = Math.max(4, (b.value / max) * 140);
    const bx = 460 + i * (bw + Math.max(20, gap));
    const by = 180 - h;
    const op = 0.5 + 0.5 * (i / Math.max(1, bars.length - 1));
    return `<rect x="${bx}" y="${by}" width="${bw}" height="${h}" rx="4" fill="#33CC80" opacity="${op.toFixed(2)}"/><text x="${bx + bw / 2}" y="${by - 8}" fill="#F5F4F0" font-size="12" text-anchor="middle" font-family="Arial" font-weight="700">${esc(money(b.value, charts.currencySymbol))}</text><text x="${bx + bw / 2}" y="202" fill="#9fb3a8" font-size="11" text-anchor="middle" font-family="Arial">${esc(b.label)}</text>`;
  }).join("") + `<line x1="450" y1="180" x2="800" y2="180" stroke="#26342b" stroke-width="1.5"/>`;
}

function trendSection(charts: PlanCharts, t: typeof T["en"]): string {
  const roas = roasChart(charts, charts === charts ? "en" : "en");
  const rev = revChart(charts);
  if (!roas && !rev) return "";
  return `<div class="sec"><h2>${t.trend}</h2><div class="card">
    <svg viewBox="0 0 820 220" style="width:100%;" xmlns="http://www.w3.org/2000/svg">
      <text x="60" y="22" fill="#9fb3a8" font-size="13" font-weight="700" font-family="Arial">${esc(t.roasStable)}</text>
      ${roas}
      ${rev ? `<text x="450" y="22" fill="#9fb3a8" font-size="13" font-weight="700" font-family="Arial">${esc(t.dayRev)}</text>${rev}` : ""}
    </svg>
  </div></div>`;
}

export function renderPlanHtml(plan: PlanContent, charts: PlanCharts): string {
  const t = T[plan.language] ?? T.en;
  const statTone = (s?: string) => s === "grad" ? " grad" : s === "bad" ? " bad" : s === "good" ? " good" : "";
  const stats = plan.stats.length ? `<div class="sec"><h2>${t.whereWeStart}</h2>
    <div class="stats">${plan.stats.map(s => `<div class="stat"><div class="k">${esc(s.key)}</div><div class="v${statTone(s.tone)}">${esc(s.value)}</div>${s.sub ? `<div class="s">${esc(s.sub)}</div>` : ""}</div>`).join("")}</div>
    <p class="lead" style="margin-top:14px">${inline(plan.strategyLead)}</p></div>` : `<div class="sec"><h2>${t.whereWeStart}</h2><div class="card"><p class="lead">${inline(plan.strategyLead)}</p></div></div>`;

  const mobClass = plan.archetype === "scale" ? "mob scale" : "mob";
  const mob = `<div class="sec"><div class="${mobClass}"><div class="tag">${t.decides}</div><h3>${esc(plan.makeOrBreakTitle)}</h3><p class="lead" style="font-size:13.7px">${inline(plan.makeOrBreakBody)}</p>${plan.makeOrBreakBullets?.length ? `<ul>${plan.makeOrBreakBullets.map(b => `<li>${inline(b)}</li>`).join("")}</ul>` : ""}</div></div>`;

  const findings = plan.findings.length ? `<div class="sec"><h2>${t.dataSays}</h2><div class="findings">${plan.findings.map(f => `<div class="find"><h4>${esc(f.title)}</h4><p>${inline(f.body)}</p></div>`).join("")}</div></div>` : "";

  const levers = plan.levers.length ? `<div class="sec"><h2>${t.levers}</h2>${plan.levers.map((l, i) => `<div class="lever"><div class="ln">${i + 1}</div><div><h3>${esc(l.title)}</h3><p>${inline(l.body)}</p></div></div>`).join("")}</div>` : "";

  const build = plan.whatWeBuild.length ? `<div class="sec"><h2>${t.weBuild}</h2><div class="findings">${plan.whatWeBuild.map((b, i) => `<div class="find"><h4>${i + 1} · ${esc(b.title)}</h4><p>${inline(b.body)}</p></div>`).join("")}</div></div>` : "";

  const badge = (who: string) => who === "Client" ? `<span class="badge b-cl">${plan.language === "nl" ? "Klant" : "Client"}</span>` : who === "Together" ? `<span class="badge b-both">${plan.language === "nl" ? "Samen" : "Together"}</span>` : `<span class="badge b-ec">Ecomtrada</span>`;
  const phases = plan.phases.length ? `<div class="sec"><h2>${t.theDays}</h2><table><tbody>
    <tr><th style="width:60%">${t.action}</th><th>${t.who}</th><th>${t.when}</th></tr>
    ${plan.phases.map(ph => `<tr class="phase-row"><td colspan="3">${esc(ph.title)}${ph.window ? ` · ${esc(ph.window)}` : ""}</td></tr>${ph.actions.map(a => `<tr><td>${inline(a.action)}</td><td>${badge(a.who)}</td><td>${esc(a.when)}</td></tr>`).join("")}`).join("")}
    </tbody></table>
    <div class="legend"><span class="badge b-ec">Ecomtrada</span> ${t.weDo} &nbsp; <span class="badge b-cl">${plan.language === "nl" ? "Klant" : "Client"}</span> ${t.youDo} &nbsp; <span class="badge b-both">${plan.language === "nl" ? "Samen" : "Together"}</span> ${t.jointly}</div></div>` : "";

  const forecast = plan.forecast.length ? `<div class="sec"><h2>${t.forecast}</h2>${plan.forecastLead ? `<p class="lead" style="margin-bottom:10px">${inline(plan.forecastLead)}</p>` : ""}<table><tbody>
    <tr><th>${t.metric}</th><th>${t.now}</th><th>${t.day90}</th></tr>
    ${plan.forecast.map(r => `<tr><td>${esc(r.label)}</td><td>${esc(r.now)}</td><td class="g">${esc(r.target)}</td></tr>`).join("")}
    </tbody></table>${plan.caveats ? `<div class="callout">${inline(plan.caveats)}</div>` : ""}</div>` : (plan.caveats ? `<div class="sec"><div class="callout">${inline(plan.caveats)}</div></div>` : "");

  const need = plan.whatWeNeed.length ? `<div class="sec"><h2>${t.weNeed}</h2><div class="need"><ul>${plan.whatWeNeed.map(n => `<li>${inline(n)}</li>`).join("")}</ul></div></div>` : "";

  return `<!DOCTYPE html><html lang="${plan.language}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(plan.client)} — 90-Day Plan</title><style>${CSS}</style></head>
<body><div class="page">
  <div class="hdr"><div class="brand">ecomtrada<span class="dot">.</span></div>
    <h1>${esc(plan.client)} — <span class="grad">90-Day Plan</span></h1>
    <div class="sub">${esc(plan.subtitle)}</div></div>
  <div class="body">
    ${stats}${mob}${findings}${trendSection(charts, t)}${levers}${build}${phases}${forecast}${need}
  </div>
  <div class="foot">ecomtrada<span class="dot">.</span> — ${esc(plan.client)} · 90-day plan · generated from live Google Ads + Shopify data, reviewed by your account team</div>
</div>
<script type="application/json" id="ecomtrada-plan">${JSON.stringify(plan).replace(/</g, "\\u003c")}</script>
</body></html>`;
}
