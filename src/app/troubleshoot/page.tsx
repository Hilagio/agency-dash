"use client";

/**
 * Hidden troubleshoot page (not in the nav) — live health of every connection.
 * Reach it at /troubleshoot. Shows nothing secret: booleans + error messages.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Loader2, CheckCircle2, AlertTriangle, XCircle, ChevronRight } from "lucide-react";

type Status = "ok" | "warn" | "fail";
interface Check {
  key: string; label: string; status: Status; detail: string; hint?: string;
  items?: { name: string; ok: boolean; note?: string }[];
}
interface Report { overall: Status; checkedAt: string; checks: Check[] }

const COLOR: Record<Status, string> = { ok: "var(--accent)", warn: "var(--accent-2)", fail: "var(--danger)" };
const LABEL: Record<Status, string> = { ok: "Healthy", warn: "Attention", fail: "Failing" };

function Icon({ s }: { s: Status }) {
  if (s === "ok") return <CheckCircle2 size={18} style={{ color: COLOR.ok }} />;
  if (s === "warn") return <AlertTriangle size={18} style={{ color: COLOR.warn }} />;
  return <XCircle size={18} style={{ color: COLOR.fail }} />;
}

const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 };

export default function TroubleshootPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggle = (k: string) => setOpen(p => { const n = new Set(p); if (n.has(k)) n.delete(k); else n.add(k); return n; });

  async function load() {
    try {
      const r = await fetch("/api/troubleshoot", { credentials: "include" });
      setReport(r.ok ? await r.json() : null);
    } catch { setReport(null); }
    setLoading(false);
  }
  async function run() { setLoading(true); await load(); }

  useEffect(() => {
    // Async loader — state is only set after the await, not synchronously.
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/troubleshoot", { credentials: "include" });
        if (alive) setReport(r.ok ? await r.json() : null);
      } catch { if (alive) setReport(null); }
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ display: "flex", alignItems: "center", gap: 16, height: 58, padding: "0 26px", borderBottom: "1px solid var(--border)", background: "var(--header-bg)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-3)", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
          <ArrowLeft size={15} /> Portfolio
        </Link>
        <div style={{ marginLeft: "auto" }}>
          <button onClick={run} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "var(--text-2)", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "7px 13px", cursor: loading ? "default" : "pointer" }}>
            {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Re-run checks
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 820, margin: "0 auto", padding: "26px 26px 80px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.6px", margin: "0 0 4px" }}>Connection health</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 20px" }}>
          Live checks of every integration. No secrets shown — only status and errors.
          {report && <> · last checked {new Date(report.checkedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</>}
        </p>

        {loading && !report ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 64 }}><Loader2 size={22} className="animate-spin" style={{ color: "var(--text-dim)" }} /></div>
        ) : !report ? (
          <div style={{ ...card, padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }}>
            <AlertTriangle size={24} style={{ color: "var(--accent-2)", marginBottom: 8 }} />
            <div style={{ fontWeight: 600, color: "var(--text-2)" }}>Couldn&rsquo;t run checks</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>You may need to sign in.</div>
          </div>
        ) : (
          <>
            {/* Overall banner */}
            <div style={{ ...card, borderColor: `color-mix(in srgb, ${COLOR[report.overall]} 35%, transparent)`, background: `color-mix(in srgb, ${COLOR[report.overall]} 8%, var(--surface))`, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 11 }}>
              <Icon s={report.overall} />
              <span style={{ fontWeight: 700, fontSize: 15 }}>
                {report.overall === "ok" ? "All connections healthy" : report.overall === "warn" ? "Some connections need attention" : "One or more connections are failing"}
              </span>
            </div>

            {/* Per-connection cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {report.checks.map(c => {
                const hasItems = !!c.items?.length;
                const isOpen = open.has(c.key);
                return (
                  <div key={c.key} style={card}>
                    <div onClick={() => hasItems && toggle(c.key)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: hasItems ? "pointer" : "default" }}>
                      <Icon s={c.status} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{c.label}</span>
                          <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: COLOR[c.status], background: `color-mix(in srgb, ${COLOR[c.status]} 14%, transparent)`, padding: "2px 7px", borderRadius: 6 }}>{LABEL[c.status]}</span>
                        </div>
                        <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 3 }}>{c.detail}</div>
                        {c.hint && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>→ {c.hint}</div>}
                      </div>
                      {hasItems && <ChevronRight size={15} style={{ color: "var(--text-dim)", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .12s" }} />}
                    </div>
                    {hasItems && isOpen && (
                      <div style={{ borderTop: "1px solid var(--border)", padding: "4px 16px 10px 44px" }}>
                        {c.items!.map((it, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 0", fontSize: 12.5 }}>
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: it.ok ? COLOR.ok : COLOR.fail, flexShrink: 0 }} />
                            <span style={{ color: "var(--text-2)", fontWeight: 500 }}>{it.name}</span>
                            {it.note && <span style={{ marginLeft: "auto", color: it.ok ? "var(--text-muted)" : "var(--danger)" }}>{it.note}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
