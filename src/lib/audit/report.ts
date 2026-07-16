/** Render an AuditResult into a self-contained, house-style HTML report. */
import type { AuditResult, PersonaVerdict, AuditFix } from "./run";

const esc = (s: string) => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
const GREEN = "#16a34a", AMBER = "#d98a00", RED = "#dc2626", INK = "#0f2942";

const convColor = (v: PersonaVerdict["wouldConvert"]) => (v === "yes" ? GREEN : v === "no" ? RED : AMBER);
const badge = (label: string, val: string, color: string) =>
  `<span style="display:inline-block;font-size:10px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;color:${color};background:${color}14;border-radius:6px;padding:3px 8px;margin-right:6px">${esc(label)}: ${esc(val)}</span>`;

function personaCard(p: PersonaVerdict): string {
  const c = convColor(p.wouldConvert);
  return `<div style="border:1px solid #e6ebf0;border-left:4px solid ${c};border-radius:10px;padding:13px 15px;background:#fff">
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px">
      <strong style="font-size:13.5px;color:${INK}">${esc(p.name)}</strong>
      <span style="font-size:10.5px;color:#8a97a6;text-transform:uppercase;letter-spacing:.4px">${esc(p.device)}</span>
    </div>
    <div style="font-size:12px;color:#5a6b7b;margin:3px 0 9px">${esc(p.intent)} · from ${esc(p.arrivedFrom)}</div>
    <div style="margin-bottom:8px">${badge("understood", p.understood, p.understood === "yes" ? GREEN : p.understood === "no" ? RED : AMBER)}${badge("would " + (p.wouldConvert === "yes" ? "convert" : p.wouldConvert), p.wouldConvert, c)}</div>
    ${p.hurdle ? `<div style="font-size:12.5px;color:${INK}"><strong>Hurdle:</strong> ${esc(p.hurdle)}</div>` : ""}
    ${p.quote ? `<div style="font-size:12.5px;color:#5a6b7b;font-style:italic;margin-top:6px">“${esc(p.quote)}”</div>` : ""}
  </div>`;
}

function fixCard(f: AuditFix): string {
  const impC = f.impact === "high" ? GREEN : f.impact === "low" ? "#8a97a6" : AMBER;
  const effC = f.effort === "easy" ? GREEN : f.effort === "hard" ? RED : AMBER;
  return `<div style="border:1px solid #e6ebf0;border-left:4px solid ${INK};border-radius:10px;padding:14px 16px;background:#fff">
    <div style="display:flex;gap:12px;align-items:baseline"><span style="font-size:20px;font-weight:800;color:#c3ccd6">${f.rank}</span><strong style="font-size:14px;color:${INK}">${esc(f.title)}</strong></div>
    <div style="font-size:12.5px;color:#5a6b7b;margin:8px 0 4px"><strong style="color:${INK}">Problem:</strong> ${esc(f.problem)}</div>
    <div style="font-size:12.5px;color:#5a6b7b;margin-bottom:9px"><strong style="color:${INK}">Fix:</strong> ${esc(f.fix)}</div>
    <div>${badge("effort", f.effort, effC)}${badge("impact", f.impact, impC)}${badge("type", f.category, "#5a6b7b")}${f.personas.length ? `<span style="font-size:11px;color:#8a97a6">wins back: ${esc(f.personas.join(", "))}</span>` : ""}</div>
  </div>`;
}

function bar(label: string, segs: { n: number; color: string; text: string }[]): string {
  const total = segs.reduce((s, x) => s + x.n, 0) || 1;
  return `<div style="margin-bottom:12px"><div style="font-size:12px;font-weight:600;color:${INK};margin-bottom:5px">${esc(label)}</div>
    <div style="display:flex;height:26px;border-radius:7px;overflow:hidden">${segs.filter(s => s.n > 0).map(s => `<div style="flex:${s.n};background:${s.color};color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center" title="${esc(s.text)}">${s.n}</div>`).join("")}</div></div>`;
}

export function renderAuditHtml(r: AuditResult, date: string): string {
  const scoreColor = r.score >= 70 ? GREEN : r.score >= 55 ? AMBER : RED;
  const yes = r.personas.filter(p => p.wouldConvert === "yes").length;
  const hes = r.personas.filter(p => p.wouldConvert === "hesitant").length;
  const no = r.personas.filter(p => p.wouldConvert === "no").length;
  const uY = r.personas.filter(p => p.understood === "yes").length;
  const uP = r.personas.filter(p => p.understood === "partly").length;
  const uN = r.personas.filter(p => p.understood === "no").length;
  const action = r.pageType === "ecom" ? "buy" : "submit";
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${INK};background:#f4f6f8;padding:22px;max-width:900px;margin:0 auto">
    <div style="background:linear-gradient(135deg,#0f2942,#173a5c);color:#fff;border-radius:16px;padding:24px 26px;display:flex;gap:22px;align-items:center;flex-wrap:wrap">
      <div style="width:96px;height:96px;border-radius:50%;border:8px solid ${scoreColor};display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0">
        <span style="font-size:30px;font-weight:800;line-height:1">${r.score}</span><span style="font-size:10px;opacity:.7">/100 · ${esc(r.grade)}</span>
      </div>
      <div style="flex:1;min-width:220px">
        <div style="font-size:11px;letter-spacing:.6px;text-transform:uppercase;opacity:.7">Persona test · ${r.pageType === "ecom" ? "product page" : "landing page"}</div>
        <div style="font-size:22px;font-weight:800;margin:4px 0">Conversion confidence: ${r.score}/100 — ${esc(r.label)}</div>
        <div style="font-size:12.5px;opacity:.85;word-break:break-all">${esc(r.finalUrl)} · ${esc(date)}${r.renderMode === "fetch" ? " · fetched (no browser)" : " · rendered in browser"}</div>
      </div>
    </div>
    ${r.summary ? `<p style="font-size:14px;line-height:1.6;color:#3a4a5a;margin:18px 4px">${esc(r.summary)}</p>` : ""}
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:16px 0">
      ${[[`${yes}/${r.total}`, `Would ${action}`, yes ? GREEN : RED], [`${uY}/${r.total}`, "Understood the offer", GREEN], [`${r.total}`, "Personas", INK], [r.renderMode === "browser" ? "browser" : "fetch", "Render mode", INK]].map(([v, l, c]) => `<div style="background:#fff;border:1px solid #e6ebf0;border-radius:12px;padding:16px;text-align:center"><div style="font-size:24px;font-weight:800;color:${c}">${esc(String(v))}</div><div style="font-size:11px;text-transform:uppercase;letter-spacing:.4px;color:#8a97a6;margin-top:3px">${esc(String(l))}</div></div>`).join("")}
    </div>
    <div style="background:#fff;border:1px solid #e6ebf0;border-radius:12px;padding:16px;margin-bottom:18px">
      ${bar(`Would ${action}?`, [{ n: yes, color: GREEN, text: "yes" }, { n: hes, color: AMBER, text: "hesitant" }, { n: no, color: RED, text: "no" }])}
      ${bar("Understood the offer?", [{ n: uY, color: GREEN, text: "yes" }, { n: uP, color: AMBER, text: "partly" }, { n: uN, color: RED, text: "no" }])}
    </div>
    <h3 style="font-size:16px;margin:0 4px 12px">The ${r.fixes.length} fixes that matter</h3>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:22px">${r.fixes.map(fixCard).join("") || '<div style="color:#8a97a6;font-size:13px">No fixes generated.</div>'}</div>
    <h3 style="font-size:16px;margin:0 4px 12px">The ${r.personas.length} personas in detail</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px">${r.personas.map(personaCard).join("")}</div>
  </div>`;
}
