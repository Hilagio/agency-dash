"use client";

/**
 * Monthly client report generator — pick a month + language, generate from live
 * data (Google Ads + Shopify), preview, export as self-contained HTML. The
 * narrative is written by the model; every number is computed server-side.
 */
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Sparkles, Download } from "lucide-react";

type Lang = "en" | "nl";

const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 };

/** Last 6 months as {value:"YYYY-MM", label}, newest first (current month included). */
function monthOptions(): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [];
  const d = new Date();
  for (let i = 0; i < 6; i++) {
    const y = d.getUTCFullYear(), m = d.getUTCMonth();
    const value = `${y}-${String(m + 1).padStart(2, "0")}`;
    const label = new Date(Date.UTC(y, m, 1)).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    out.push({ value, label: i === 0 ? `${label} (so far)` : label });
    d.setUTCMonth(m - 1);
  }
  return out;
}

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const months = monthOptions();
  const [month, setMonth] = useState(months[1]?.value ?? months[0].value); // default: previous full month
  const [lang, setLang] = useState<Lang>("nl");
  const [genStatus, setGenStatus] = useState<string | null>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string>("");

  useEffect(() => {
    fetch(`/api/diagnostics/account/${id}`, { credentials: "include" }).then(x => x.ok ? x.json() : null)
      .then(j => setClientName(j?.diagnosis?.clientName || j?.diagnosis?.name || "")).catch(() => {});
  }, [id]);

  async function generate() {
    setErr(null); setHtml(null); setGenStatus("Starting…");
    let finished = false;
    try {
      const r = await fetch(`/api/accounts/${id}/report`, {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang, month }),
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
          let ev: { status?: string; chars?: number; done?: boolean; html?: string; error?: string };
          try { ev = JSON.parse(line.slice(5).trim()); } catch { continue; }
          if (ev.error) { setErr(ev.error); finished = true; }
          else if (ev.status === "retrying") setGenStatus("First draft didn't come out clean — writing it again…");
          else if (ev.status) setGenStatus(ev.chars ? `Writing the report… (${ev.chars} chars)` : "Reading the month's data & writing the report…");
          else if (ev.done && ev.html) { setHtml(ev.html); finished = true; }
        }
      }
      if (!finished) setErr("The connection dropped before the report finished — hit Generate again.");
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setGenStatus(null); }
  }

  function exportHtml() {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${(clientName || "client").replace(/[^a-z0-9]+/gi, "-")}-report-${month}.html`;
    a.click(); URL.revokeObjectURL(url);
  }

  const busy = genStatus != null;
  const selStyle: React.CSSProperties = { fontSize: 13, padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border-2)", background: "var(--surface-2)", color: "var(--text)" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ display: "flex", alignItems: "center", gap: 14, height: 56, padding: "0 24px", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, background: "var(--header-bg)", backdropFilter: "blur(12px)", zIndex: 9 }}>
        <Link href={`/diagnose/${id}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-3)", textDecoration: "none", fontSize: 13 }}><ArrowLeft size={15} /> Account</Link>
        <span style={{ fontWeight: 700, fontSize: 14 }}>Monthly report{clientName ? ` · ${clientName}` : ""}</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <select value={month} onChange={e => setMonth(e.target.value)} style={selStyle} title="Month">
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <div style={{ display: "inline-flex", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: 2 }}>
            {(["nl", "en"] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", background: lang === l ? "var(--surface)" : "transparent", color: lang === l ? "var(--text)" : "var(--text-3)" }}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button onClick={generate} disabled={busy} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#fff", background: "var(--accent)", border: "none", borderRadius: 8, padding: "8px 15px", cursor: busy ? "default" : "pointer" }}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} {html ? "Regenerate" : "Generate report"}
          </button>
          {html && <button onClick={exportHtml} title="Download HTML" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--text-2)", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 13px", cursor: "pointer" }}><Download size={14} /> Export</button>}
        </div>
      </nav>

      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 24px 80px" }}>
        {err && <div style={{ ...card, padding: "13px 16px", marginBottom: 14, color: "var(--danger)", fontSize: 13 }}>Couldn&rsquo;t generate: {err}</div>}
        {genStatus && <div style={{ ...card, padding: "16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--text-2)" }}><Loader2 size={16} className="animate-spin" style={{ color: "var(--accent)" }} /> {genStatus}</div>}

        {html ? (
          <div style={{ ...card, overflow: "hidden", padding: 0 }}>
            <iframe title="monthly report preview" srcDoc={html} style={{ width: "100%", height: "82vh", border: "none", background: "#F6F2EA" }} />
          </div>
        ) : !genStatus && (
          <div style={{ ...card, padding: "48px 20px", textAlign: "center", color: "var(--text-muted)" }}>
            <Sparkles size={26} style={{ color: "var(--accent)", marginBottom: 10 }} />
            <div style={{ fontWeight: 600, color: "var(--text-2)" }}>Generate a client-ready monthly report from live data</div>
            <div style={{ fontSize: 13, marginTop: 6, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
              Pick the month, hit <b>Generate report</b>. It pulls the month&rsquo;s Google Ads + Shopify numbers itself, writes the story in plain client language, and includes an honest &ldquo;what we don&rsquo;t know&rdquo; section. Review, then export — the HTML prints cleanly to PDF.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
