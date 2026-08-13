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

  async function generate() {
    setErr(null); setHtml(null); setGenStatus("Starting…");
    // Persist context first so the generation uses the latest.
    await save();
    try {
      const r = await fetch(`/api/accounts/${id}/plan`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang }),
      });
      if (!r.ok || !r.body) { const j = await r.json().catch(() => ({})); setErr(j.error ?? `HTTP ${r.status}`); setGenStatus(null); return; }
      const reader = r.body.getReader(); const dec = new TextDecoder(); let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n"); buf = parts.pop() ?? "";
        for (const p of parts) {
          const line = p.trim(); if (!line.startsWith("data:")) continue;
          let ev: { status?: string; chars?: number; done?: boolean; html?: string; error?: string };
          try { ev = JSON.parse(line.slice(5).trim()); } catch { continue; }
          if (ev.error) { setErr(ev.error); setGenStatus(null); }
          else if (ev.status === "generating_no_makeorbreak") setGenStatus("Generating… (no make-or-break set — plan may be generic)");
          else if (ev.status === "retrying") setGenStatus("First draft didn't come out clean — writing it again…");
          else if (ev.status === "generating" || ev.status === "writing") setGenStatus(ev.chars ? `Writing the plan… (${ev.chars} chars)` : "Reading your data & writing the plan…");
          else if (ev.done && ev.html) { setHtml(ev.html); setGenStatus(null); setFormOpen(false); }
        }
      }
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); setGenStatus(null); }
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
          <button onClick={generate} disabled={busy} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#fff", background: "var(--accent)", border: "none", borderRadius: 8, padding: "8px 15px", cursor: busy ? "default" : "pointer" }}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} {html ? "Regenerate" : "Generate plan"}
          </button>
          {html && <button onClick={exportHtml} title="Download HTML" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text-2)", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 13px", cursor: "pointer" }}><Download size={14} /> Export</button>}
        </div>
      </nav>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 24px 80px" }}>
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

        {html ? (
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
