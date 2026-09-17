/**
 * Printable 90-day plan progress checklist — the paper artifact the team used
 * to build by hand in Word (Action / Status / Owner / Notes per phase), now
 * generated from the LIVE plan state so it is always current. Light house
 * style, prints cleanly (⌘P → PDF).
 */
import type { PlanContent } from "./types";

export interface ChecklistState { path: string; status: string; assignee: string | null; note: string | null; doneAt: Date | null; doneBy: string | null }

const esc = (s: string): string =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const STATUS_LABEL: Record<string, { en: string; nl: string }> = {
  done: { en: "Done", nl: "Afgerond" },
  busy: { en: "In progress", nl: "Mee bezig" },
  blocked: { en: "Blocked", nl: "Geblokkeerd" },
  open: { en: "Not started", nl: "Nog niet gestart" },
};

export function renderPlanChecklist(
  content: PlanContent,
  meta: { client: string; startedAt: Date; createdBy: string | null; updatedAt: Date },
  states: ChecklistState[],
): string {
  const nl = content.language === "nl";
  const stateBy = new Map(states.map(s => [s.path, s]));
  const day = Math.min(90, Math.max(1, Math.floor((Date.now() - meta.startedAt.getTime()) / 86_400_000) + 1));
  const today = new Date().toISOString().slice(0, 10);

  let total = 0, done = 0;
  const phaseHtml = content.phases.map((ph, pi) => {
    const rows = (ph.actions ?? []).map((a, ai) => {
      if (a.dropped) {
        return `<tr class="dropped"><td><s>${esc(a.action)}</s></td><td>${nl ? "Vervallen" : "Dropped"}</td><td></td><td>${esc(a.droppedReason ?? "")}</td></tr>`;
      }
      total += 1;
      const st = stateBy.get(`p${pi}a${ai}`);
      const status = st?.status ?? "open";
      if (status === "done") done += 1;
      const statusTxt = (STATUS_LABEL[status] ?? STATUS_LABEL.open)[nl ? "nl" : "en"]
        + (status === "done" && st?.doneAt ? ` · ${st.doneAt.toISOString().slice(0, 10)}${st.doneBy ? ` (${st.doneBy.split("@")[0]})` : ""}` : "");
      const owner = st?.assignee ? st.assignee.split("@")[0] : a.who;
      const notes = [st?.note, a.deviation ? `${nl ? "Toegevoegd" : "Added"} ${a.addedAt?.slice(0, 10) ?? ""}${a.deviationReason ? ` — ${a.deviationReason}` : ""}` : ""]
        .filter(Boolean).join(" · ");
      return `<tr class="s-${status}"><td>${esc(a.action)}</td><td class="st">${esc(statusTxt)}</td><td>${esc(owner)}</td><td>${esc(notes)}</td></tr>`;
    }).join("");
    return `<h2>${esc(ph.title)} <span>· ${esc(ph.window)}</span></h2>
<table><thead><tr><th style="width:46%">${nl ? "Actie" : "Action"}</th><th style="width:20%">Status</th><th style="width:12%">${nl ? "Eigenaar" : "Owner"}</th><th>${nl ? "Notities" : "Notes"}</th></tr></thead><tbody>${rows}</tbody></table>`;
  }).join("");

  return `<!doctype html><html lang="${content.language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.client)} — ${nl ? "90-dagenplan checklist" : "90-Day Plan Checklist"}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--paper:#F6F2EA;--card:#FFFDF9;--ink:#241D18;--ink2:#4A3F36;--dim:#7A6C5F;--cognac:#A2542C;--green:#3F6142;--line:#DED5C7;--line2:#EDE6DA}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans','Segoe UI',sans-serif;background:var(--paper);color:var(--ink);font-size:14px;line-height:1.55;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{max-width:900px;margin:0 auto;padding:44px 34px 60px}
.brand{font-weight:800;font-size:18px}.brand b{color:var(--cognac)}
h1{font-family:'League Spartan',sans-serif;font-weight:700;font-size:30px;letter-spacing:-.015em;margin:14px 0 4px}
.meta{font-size:12px;color:var(--dim);margin-bottom:6px}
.progress{display:flex;align-items:center;gap:10px;margin:12px 0 26px}
.bar{flex:1;height:9px;border:1px solid var(--line);border-radius:5px;background:var(--card);overflow:hidden}
.bar div{height:100%;background:var(--cognac)}
h2{font-family:'League Spartan',sans-serif;font-weight:700;font-size:17px;margin:26px 0 8px}
h2 span{color:var(--dim);font-weight:600;font-size:13px}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);font-size:12.5px}
th{padding:7px 10px;text-align:left;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--dim);border-bottom:1px solid var(--line)}
td{padding:8px 10px;border-bottom:1px solid var(--line2);vertical-align:top;color:var(--ink2)}
tr:last-child td{border-bottom:none}
tr.s-done td{color:var(--dim)}tr.s-done td:first-child{text-decoration:line-through}
tr.s-done .st{color:var(--green);font-weight:600;text-decoration:none}
tr.s-busy .st{color:var(--cognac);font-weight:600}
tr.s-blocked .st{color:#A33326;font-weight:700}
tr.dropped td{color:var(--dim);font-size:11.5px}
.foot{margin-top:30px;font-size:11px;color:var(--dim)}
@media print{body{background:#fff}.page{padding:10px 0}h2{page-break-after:avoid}table{page-break-inside:avoid}}
</style></head><body><div class="page">
<div class="brand">ecomtrada<b>.</b></div>
<h1>${esc(meta.client)} — ${nl ? "90-dagenplan voortgang" : "90-Day Plan Progress"}</h1>
<div class="meta">${nl ? "Plan actief sinds" : "Plan live since"} ${meta.startedAt.toISOString().slice(0, 10)}${meta.createdBy ? ` (${esc(meta.createdBy)})` : ""} · ${nl ? "dag" : "day"} ${day} ${nl ? "van" : "of"} 90 · ${nl ? "stand van" : "status as of"} ${today}</div>
<div class="progress"><div class="bar"><div style="width:${total > 0 ? Math.round((done / total) * 100) : 0}%"></div></div><span style="font-size:12px;color:var(--ink2);font-weight:600">${done}/${total}</span></div>
${phaseHtml}
<div class="foot">${nl ? "Automatisch gegenereerd uit het live 90-dagenplan in Ecomtrada AI — statussen, eigenaren en notities zijn de actuele teamstand." : "Generated from the live 90-day plan in Ecomtrada AI — statuses, owners and notes are the team's current state."}</div>
</div></body></html>`;
}
