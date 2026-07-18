"use client";
/**
 * Standalone "Quick audit" tool — paste ANY url and run the 12-persona page
 * audit, no account needed. For sizing up a prospect's or competitor's page.
 */
import { useState, useRef } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Sparkles, ExternalLink, Download } from "lucide-react";

type Result = { html: string; score: number; grade: string; label: string; renderMode: string };

export default function QuickAuditPage() {
  const [url, setUrl] = useState("");
  const [pageType, setPageType] = useState<"ecom" | "leadgen">("ecom");
  const [offer, setOffer] = useState("");
  const [showOffer, setShowOffer] = useState(false);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Print the report iframe → the browser's print dialog, where "Save as PDF"
  // gives a clean, self-contained PDF of exactly what's on screen.
  function downloadPdf() {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.focus();
    win.print();
  }

  async function run() {
    const u = url.trim();
    if (!/^https?:\/\//i.test(u)) { setErr("Enter a full URL starting with http:// or https://"); return; }
    setRunning(true); setErr(null); setResult(null); setStatus("Starting…");
    try {
      const res = await fetch("/api/audit", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: u, pageType, offer: offer.trim() }),
      });
      if (!res.ok || !res.body) { const j = await res.json().catch(() => ({})); setErr(j.error ?? "Audit failed to start."); return; }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n"); buf = parts.pop() ?? "";
        for (const p of parts) {
          const line = p.split("\n").find(l => l.startsWith("data:"));
          if (!line) continue;
          try {
            const o = JSON.parse(line.slice(5).trim());
            if (o.status) setStatus(o.status);
            if (o.error) setErr(o.error);
            if (o.done) { setResult({ html: o.html, score: o.score, grade: o.grade, label: o.label, renderMode: o.renderMode }); setStatus(null); }
          } catch { /* ignore partial */ }
        }
      }
    } catch (e) { setErr(e instanceof Error ? e.message : "Audit failed."); }
    finally { setRunning(false); }
  }

  const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 };

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: "28px 20px 80px" }}>
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)", textDecoration: "none", marginBottom: 18 }}>
        <ArrowLeft size={14} /> Cockpit
      </Link>

      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.6px", margin: "0 0 4px" }}>Quick page audit</h1>
      <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 22px", lineHeight: 1.5 }}>
        Paste any landing or product page — a prospect&rsquo;s, a competitor&rsquo;s, anyone&rsquo;s. Twelve buyer personas judge it and score conversion confidence out of 100. No account needed.
      </p>

      <div style={{ ...card, padding: "18px 20px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            value={url} onChange={e => setUrl(e.target.value)} disabled={running}
            onKeyDown={e => e.key === "Enter" && !running && run()}
            placeholder="https://example.com/product/…"
            style={{ flex: "1 1 320px", fontSize: 14, padding: "11px 13px", borderRadius: 9, border: "1px solid var(--border-2)", background: "var(--surface-2)", color: "var(--text)", fontFamily: "inherit" }}
          />
          <button onClick={run} disabled={running}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700, color: "#fff", background: "var(--accent)", border: "none", borderRadius: 9, padding: "11px 20px", cursor: running ? "default" : "pointer", opacity: running ? 0.7 : 1 }}>
            {running ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} {running ? "Auditing…" : "Run audit"}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", gap: 4, background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 8, padding: 3 }}>
            {(["ecom", "leadgen"] as const).map(t => (
              <button key={t} onClick={() => setPageType(t)} disabled={running}
                style={{ fontSize: 12.5, fontWeight: 600, padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", background: pageType === t ? "var(--accent)" : "transparent", color: pageType === t ? "#fff" : "var(--text-2)" }}>
                {t === "ecom" ? "E-commerce" : "Lead-gen"}
              </button>
            ))}
          </div>
          <button onClick={() => setShowOffer(v => !v)} style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            {showOffer ? "− Hide context" : "+ Add context (optional)"}
          </button>
        </div>

        {showOffer && (
          <textarea value={offer} onChange={e => setOffer(e.target.value)} disabled={running} rows={3}
            placeholder="Optional: what does the page sell, and who's it for? Sharpens the personas — leave blank to judge the page as-is."
            style={{ width: "100%", marginTop: 10, fontSize: 13, padding: "10px 12px", borderRadius: 9, border: "1px solid var(--border-2)", background: "var(--surface-2)", color: "var(--text)", fontFamily: "inherit", resize: "vertical" }} />
        )}

        {status && <div style={{ marginTop: 14, fontSize: 13, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 8 }}><Loader2 size={14} className="animate-spin" style={{ color: "var(--accent)" }} /> {status}</div>}
        {err && <div style={{ marginTop: 14, fontSize: 13, color: "var(--danger, #d33)" }}>{err}</div>}
      </div>

      {result && (
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <a href={url} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 5 }}>
              {url} <ExternalLink size={12} />
            </a>
            {result.renderMode === "fetch" && <span style={{ fontSize: 11.5, color: "var(--accent-2)" }}>· rendered without a browser — result may be partial</span>}
            <button onClick={downloadPdf}
              style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "var(--text)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "7px 13px", cursor: "pointer" }}>
              <Download size={13} /> Download PDF
            </button>
          </div>
          <iframe title="Audit report" srcDoc={result.html} ref={iframeRef}
            style={{ width: "100%", height: "78vh", border: "1px solid var(--border)", borderRadius: 14, background: "#fff" }} />
        </div>
      )}
    </main>
  );
}
