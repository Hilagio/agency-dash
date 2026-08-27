"use client";

/**
 * 90-Day Plan generator (BUILD: automate the ecomtrada client plan).
 * Fill the Client Context Pack once, then generate a client-ready plan from live
 * data in seconds — review, then export the HTML. The engine supplies the
 * analysis; the human supplies the context (esp. the make-or-break factor).
 */
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Sparkles, Download, RefreshCw, Star, ChevronDown, ChevronRight, Save } from "lucide-react";

type Lang = "en" | "nl";
interface Ctx {
  amName?: string; goal?: string; mainKpi?: string; targetRoasNote?: string; adsStartedNote?: string;
  strategyPreference?: string; usps?: string; audienceNuances?: string; makeOrBreak?: string; anythingElse?: string;
  defaultLanguage?: string; netMarginPct?: number | null; breakEvenRoas?: number | null;
}

const FIELDS: { key: keyof Ctx; label: string; hint: string; star?: boolean; rows?: number }[] = [
  { key: "amName", label: "Account manager", hint: "Who owns this client" },
  { key: "goal", label: "What does the client want to achieve?", hint: "Their ambition", rows: 2 },
  { key: "mainKpi", label: "Main KPI for us to hit", hint: "e.g. ROAS 4x" },
  { key: "targetRoasNote", label: "Target ROAS — and hit it before?", hint: "Target + whether it's proven" },
  { key: "adsStartedNote", label: "When did Google Ads start spending?", hint: "Account age" },
  { key: "strategyPreference", label: "Preferred strategy", hint: "Cautious ↔ scale aggressively" },
  { key: "usps", label: "What makes this client different? (USPs)", hint: "Positioning", rows: 2 },
  { key: "audienceNuances", label: "Audience nuances the algorithm must learn", hint: "Different buyers per product", rows: 2 },
  { key: "makeOrBreak", label: "⭐ The make-or-break factor", hint: "The client-specific dynamic that decides the strategy — the one field that can't be blank", star: true, rows: 3 },
  { key: "anythingElse", label: "Anything else? (constraints, stock, no-go's)", hint: "Budget ceiling, countries, restock cadence, limited editions", rows: 2 },
];

const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 };
const inputStyle: React.CSSProperties = { width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border-2)", background: "var(--surface-2)", color: "var(--text)", fontFamily: "inherit", resize: "vertical" };
const label: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "var(--text-2)", marginBottom: 4, display: "block" };

export default function PlanPage() {
  const { id } = useParams<{ id: string }>();
  const [ctx, setCtx] = useState<Ctx>({});
  const [lang, setLang] = useState<Lang>("en");
  const [loaded, setLoaded] = useState(false);
  const [formOpen, setFormOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [genStatus, setGenStatus] = useState<string | null>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [plan, setPlan] = useState<Record<string, unknown> | null>(null);
  const [reviseText, setReviseText] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [err, setErr] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string>("");

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/accounts/${id}/context`, { credentials: "include" }).then(x => x.ok ? x.json() : null).catch(() => null);
      if (r?.context) { setCtx(r.context); if (r.context.defaultLanguage === "nl") setLang("nl"); }
      fetch(`/api/diagnostics/account/${id}`, { credentials: "include" }).then(x => x.ok ? x.json() : null).then(j => setClientName(j?.diagnosis?.clientName || j?.diagnosis?.name || "")).catch(() => {});
      setLoaded(true);
    })();
  }, [id]);

  const set = (k: keyof Ctx, v: string) => setCtx(c => ({ ...c, [k]: v }));

  async function save() {
    setSaving(true);
    try {
      const r = await fetch(`/api/accounts/${id}/context`, {
        method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...ctx, defaultLanguage: lang }),
      });
      if (r.ok) setSavedAt(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    } finally { setSaving(false); }
  }

  async function generate(reviseInstr?: string) {
    const base = reviseInstr ? plan : null;
    setErr(null); setHtml(null); setGenStatus(reviseInstr ? "Applying your changes…" : "Starting…");
    // `finished` guards the stuck state: if the stream dies without a done/error
    // event (gateway timeout, dropped connection), the button used to stay
    // disabled forever because genStatus was never cleared.
    let finished = false;
    try {
      // Persist context first so the generation uses the latest.
      await save();
      const r = await fetch(`/api/accounts/${id}/plan`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(base ? { language: lang, revise: reviseInstr, basePlan: base } : { language: lang }),
      });
      if (!r.ok || !r.body) { const j = await r.json().catch(() => ({})); setErr(j.error ?? `HTTP ${r.status}`); return; }
      const reader = r.body.getReader(); const dec = new TextDecoder(); let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n"); buf = parts.pop() ?? "";
        for (const p of parts) {
          const line = p.trim(); if (!line.startsWith("data:")) continue;
          let ev: { status?: string; chars?: number; done?: boolean; html?: string; plan?: Record<string, unknown>; error?: string };
          try { ev = JSON.parse(line.slice(5).trim()); } catch { continue; }
          if (ev.error) { setErr(ev.error); finished = true; }
          else if (ev.status === "generating_no_makeorbreak") setGenStatus("Generating… (no make-or-break set — plan may be generic)");
          else if (ev.status === "retrying") setGenStatus("First draft didn't come out clean — writing it again…");
          else if (ev.status === "generating" || ev.status === "writing") setGenStatus(ev.chars ? `Writing the plan… (${ev.chars} chars)` : "Reading your data & writing the plan…");
          else if (ev.done && ev.html) { setHtml(ev.html); if (ev.plan) setPlan(ev.plan); setReviseText(""); setEditMode(false); setFormOpen(false); finished = true; }
        }
      }
      if (!finished) setErr("The connection dropped before the plan finished — hit Generate again.");
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setGenStatus(null); }
  }

  // ── Block editor: every plan part becomes a block with delete + a feedback
  // note. Deletes re-render instantly (no AI); notes are applied in ONE
  // targeted revision that leaves untouched blocks verbatim.
  type Block = { path: string; label: string; text: string };
  /* eslint-disable @typescript-eslint/no-explicit-any */
  function planBlocks(p: any): Block[] {
    const out: Block[] = [];
    const push = (path: string, label: string, text: unknown) => { const t = String(text ?? "").trim(); if (t) out.push({ path, label, text: t }); };
    push("strategyLead", "Strategy lead", p.strategyLead);
    (p.stats ?? []).forEach((s: any, i: number) => push(`stats[${i}]`, `Stat · ${s.key ?? i + 1}`, `${s.value ?? ""}${s.sub ? ` — ${s.sub}` : ""}`));
    push("makeOrBreak", "Make-or-break", `${p.makeOrBreakTitle ?? ""} — ${p.makeOrBreakBody ?? ""}`);
    (p.findings ?? []).forEach((f: any, i: number) => push(`findings[${i}]`, `Finding ${i + 1}`, `${f.title}: ${f.body}`));
    (p.levers ?? []).forEach((l: any, i: number) => push(`levers[${i}]`, `Lever ${i + 1}`, `${l.title}: ${l.body}`));
    (p.whatWeBuild ?? []).forEach((b: any, i: number) => push(`whatWeBuild[${i}]`, `We build ${i + 1}`, `${b.title}: ${b.body}`));
    (p.phases ?? []).forEach((ph: any, i: number) => {
      (ph.actions ?? []).forEach((a: any, j: number) => push(`phases[${i}].actions[${j}]`, `${ph.title ?? `Phase ${i + 1}`} · action ${j + 1}`, `${a.action} (${a.who}, ${a.when})`));
    });
    (p.forecast ?? []).forEach((r: any, i: number) => push(`forecast[${i}]`, `Forecast · ${r.label ?? i + 1}`, `${r.now} → ${r.target}`));
    (p.whatWeNeed ?? []).forEach((n: any, i: number) => push(`whatWeNeed[${i}]`, `From the client ${i + 1}`, n));
    push("caveats", "Caveats", p.caveats);
    return out;
  }

  async function applyRenderOnly(p: Record<string, unknown>) {
    setGenStatus("Updating the document…");
    try {
      const r = await fetch(`/api/accounts/${id}/plan`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang, renderOnly: true, basePlan: p }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.html) { setPlan(j.plan ?? p); setHtml(j.html); setErr(null); }
      else setErr(j.error ?? "Couldn't re-render the plan.");
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setGenStatus(null); }
  }

  function deleteBlock(path: string) {
    if (!plan) return;
    const p = JSON.parse(JSON.stringify(plan)) as any;
    const m = path.match(/^(\w+)(?:\[(\d+)\])?(?:\.actions\[(\d+)\])?$/);
    if (!m) return;
    const [, field, idx, aIdx] = m;
    if (aIdx !== undefined && idx !== undefined) (p[field][Number(idx)].actions as unknown[]).splice(Number(aIdx), 1);
    else if (idx !== undefined) (p[field] as unknown[]).splice(Number(idx), 1);
    else if (field === "makeOrBreak") { p.makeOrBreakTitle = ""; p.makeOrBreakBody = ""; p.makeOrBreakBullets = []; }
    else p[field] = "";
    setNotes(n => { const c = { ...n }; delete c[path]; return c; });
    applyRenderOnly(p);
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  function applyNotes() {
    if (!plan) return;
    const blocks = planBlocks(plan);
    const entries = Object.entries(notes).filter(([, v]) => v.trim());
    if (!entries.length) return;
    const instr = "Block-specific changes — apply each ONLY to its named block, leave every other block verbatim:\n"
      + entries.map(([k, v]) => {
          const b = blocks.find(x => x.path === k);
          return `- [${b?.label ?? k}] (current: "${(b?.text ?? "").slice(0, 140)}"): ${v.trim()}`;
        }).join("\n");
    setNotes({});
    generate(instr);
  }

  async function importPlanFile(file: File) {
    const text = await file.text();
    const m = text.match(/<script type="application\/json" id="ecomtrada-plan">([\s\S]*?)<\/script>/);
    if (!m) { setErr("This file has no editable plan data — it was exported before the revision feature. Generate once fresh; new exports are editable."); return; }
    try {
      const p = JSON.parse(m[1]) as Record<string, unknown>;
      setPlan(p); setHtml(text); setErr(null); setFormOpen(false);
      if (p.language === "nl" || p.language === "en") setLang(p.language as Lang);
    } catch { setErr("Couldn't read the plan data in this file."); }
  }

  function exportHtml() {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${(clientName || "client").replace(/[^a-z0-9]+/gi, "-")}-90day-plan.html`;
    a.click(); URL.revokeObjectURL(url);
  }

  const busy = genStatus != null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ display: "flex", alignItems: "center", gap: 14, height: 56, padding: "0 24px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--header-bg)", backdropFilter: "blur(12px)", zIndex: 9 }}>
        <Link href={`/diagnose/${id}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-3)", textDecoration: "none", fontSize: 13 }}><ArrowLeft size={15} /> Account</Link>
        <span style={{ fontWeight: 700, fontSize: 14 }}>90-Day Plan{clientName ? ` · ${clientName}` : ""}</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "inline-flex", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: 2 }}>
            {(["en", "nl"] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", background: lang === l ? "var(--surface)" : "transparent", color: lang === l ? "var(--text)" : "var(--text-3)" }}>{l.toUpperCase()}</button>
            ))}
          </div>
          <label title="Import an exported 90-day plan to adjust it" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text-2)", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 13px", cursor: "pointer" }}>
            Import
            <input type="file" accept=".html,text/html" style={{ display: "none" }}
              onChange={e => { const f = e.target.files?.[0]; if (f) importPlanFile(f); e.target.value = ""; }} />
          </label>
          <button onClick={() => generate()} disabled={busy} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#fff", background: "var(--accent)", border: "none", borderRadius: 8, padding: "8px 15px", cursor: busy ? "default" : "pointer" }}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} {html ? "Regenerate" : "Generate plan"}
          </button>
          {html && <button onClick={exportHtml} title="Download HTML" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text-2)", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 13px", cursor: "pointer" }}><Download size={14} /> Export</button>}
        </div>
      </nav>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 24px 80px" }}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f && /\.html?$/i.test(f.name)) importPlanFile(f); }}>
        {/* Context Pack */}
        <div style={{ ...card, marginBottom: 16 }}>
          <button onClick={() => setFormOpen(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "13px 16px", background: "none", border: "none", cursor: "pointer", color: "var(--text)" }}>
            {formOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <span style={{ fontWeight: 700, fontSize: 13.5 }}>Client Context Pack</span>
            <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>the enrichment the data can&rsquo;t fetch — fill once per client</span>
            {savedAt && <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--accent)" }}>saved {savedAt}</span>}
          </button>
          {formOpen && (
            <div style={{ padding: "0 16px 16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
                {FIELDS.map(f => (
                  <div key={f.key} style={f.star ? { gridColumn: "1 / -1", padding: 12, borderRadius: 10, background: "var(--accent-dim)", border: "1px solid color-mix(in srgb, var(--accent) 30%, var(--border))" } : undefined}>
                    <label style={label}>{f.star && <Star size={12} style={{ verticalAlign: -1, fill: "currentColor", color: "var(--accent)" }} />} {f.label}</label>
                    <textarea value={(ctx[f.key] as string) ?? ""} onChange={e => set(f.key, e.target.value)} rows={f.rows ?? 1} placeholder={f.hint} style={inputStyle} />
                  </div>
                ))}
                <div>
                  <label style={label}>Net margin % (from P&amp;L, optional)</label>
                  <input type="number" step="1" min="0" max="100" value={ctx.netMarginPct != null ? Math.round(ctx.netMarginPct * 100) : ""} onChange={e => setCtx(c => ({ ...c, netMarginPct: e.target.value ? Number(e.target.value) / 100 : null }))} placeholder="e.g. 28" style={inputStyle} />
                </div>
                <div>
                  <label style={label}>Break-even ROAS (from P&amp;L, optional)</label>
                  <input type="number" step="0.1" min="0" value={ctx.breakEvenRoas ?? ""} onChange={e => setCtx(c => ({ ...c, breakEvenRoas: e.target.value ? Number(e.target.value) : null }))} placeholder="e.g. 2.0" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <button onClick={save} disabled={saving} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "var(--text-2)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "7px 13px", cursor: saving ? "default" : "pointer" }}>
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save context
                </button>
                {!ctx.makeOrBreak?.trim() && <span style={{ fontSize: 11.5, color: "var(--accent-2, #d0972a)" }}>⭐ The make-or-break factor is empty — the plan will be generic without it.</span>}
              </div>
            </div>
          )}
        </div>

        {err && <div style={{ ...card, padding: "13px 16px", marginBottom: 14, color: "var(--danger)", fontSize: 13 }}>Couldn&rsquo;t generate: {err}</div>}
        {genStatus && <div style={{ ...card, padding: "16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--text-2)" }}><Loader2 size={16} className="animate-spin" style={{ color: "var(--accent)" }} /> {genStatus}</div>}

        {html && plan && !genStatus && (
          <div style={{ ...card, padding: "14px 16px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>Adjust this plan</div>
              <button onClick={() => setEditMode(m => !m)} style={{ fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 7, border: "1px solid var(--border-2)", cursor: "pointer", background: editMode ? "var(--btn-primary, var(--accent))" : "var(--surface-2)", color: editMode ? "#fff" : "var(--text-3)" }}>
                {editMode ? "Back to preview" : "Edit blocks"}
              </button>
              {Object.values(notes).filter(v => v.trim()).length > 0 && (
                <button onClick={applyNotes} disabled={busy} style={{ fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 7, border: "none", cursor: "pointer", background: "var(--btn-primary, var(--accent))", color: "#fff" }}>
                  Apply {Object.values(notes).filter(v => v.trim()).length} note{Object.values(notes).filter(v => v.trim()).length === 1 ? "" : "s"}
                </button>
              )}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>{editMode ? "Delete a block directly, or leave a note on the blocks that need to change — then apply all notes in one go. Untouched blocks stay word-for-word." : "Describe what's wrong, missing, or should go — only that changes; the rest stays word-for-word. Or use Edit blocks to point at a specific part."}</div>
            {!editMode && (
              <div style={{ display: "flex", gap: 8 }}>
                <textarea value={reviseText} onChange={e => setReviseText(e.target.value)} rows={2} placeholder="What should be different?" style={{ ...inputStyle, flex: 1 }} />
                <button onClick={() => reviseText.trim() && generate(reviseText.trim())} disabled={busy || !reviseText.trim()}
                  style={{ alignSelf: "flex-end", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#fff", background: "var(--btn-primary, var(--accent))", border: "none", borderRadius: 8, padding: "9px 14px", cursor: busy || !reviseText.trim() ? "default" : "pointer", whiteSpace: "nowrap" }}>
                  <Sparkles size={13} /> Apply changes
                </button>
              </div>
            )}
          </div>
        )}

        {html && plan && editMode && !genStatus ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {planBlocks(plan).map(b => (
              <div key={b.path} style={{ ...card, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: 0.4, whiteSpace: "nowrap" }}>{b.label}</div>
                  <div style={{ fontSize: 13, color: "var(--text-2)", flex: 1, lineHeight: 1.45 }}>{b.text.length > 220 ? b.text.slice(0, 220) + "…" : b.text}</div>
                  <button onClick={() => deleteBlock(b.path)} disabled={busy} title="Delete this block (instant, no AI)" style={{ fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 7, border: "1px solid var(--border-2)", cursor: "pointer", background: "var(--surface-2)", color: "#e5484d", whiteSpace: "nowrap" }}>Delete</button>
                </div>
                <input
                  value={notes[b.path] ?? ""}
                  onChange={e => setNotes(n => ({ ...n, [b.path]: e.target.value }))}
                  placeholder="Feedback for this block — what should change here?"
                  style={{ ...inputStyle, marginTop: 8, fontSize: 12.5, padding: "6px 9px" }}
                />
              </div>
            ))}
          </div>
        ) : html ? (
          <div style={{ ...card, overflow: "hidden", padding: 0 }}>
            <iframe title="90-day plan preview" srcDoc={html} style={{ width: "100%", height: "80vh", border: "none", background: "#050806" }} />
          </div>
        ) : !genStatus && (
          <div style={{ ...card, padding: "48px 20px", textAlign: "center", color: "var(--text-muted)" }}>
            <Sparkles size={26} style={{ color: "var(--accent)", marginBottom: 10 }} />
            <div style={{ fontWeight: 600, color: "var(--text-2)" }}>Generate a client-ready 90-day plan from live data</div>
            <div style={{ fontSize: 13, marginTop: 6, maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>Fill the Context Pack above (especially the make-or-break factor), then hit <b>Generate plan</b>. The engine pulls Google Ads + Shopify itself and writes the plan in your house style. You review, then export.</div>
          </div>
        )}
      </main>
    </div>
  );
}
