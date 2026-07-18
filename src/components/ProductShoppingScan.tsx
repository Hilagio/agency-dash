"use client";
/**
 * Per-product Google Shopping compare, opened from a row in the product table.
 * Data-seeded (query pre-filled from the product) but manual: you can refine the
 * query, market, and "your shop" highlight before scanning. Shows which other
 * products show up for that query and at what price — the answer to "why is this
 * product declining / getting clicks but not converting?". Reuses /api/shopping.
 */
import { useEffect, useState } from "react";
import { Loader2, X, Search, ExternalLink } from "lucide-react";

interface Row { position: number; title: string; merchant: string; price: string; priceValue: number | null; link: string | null; isYou: boolean; }
interface Scan { query: string; tld: string; rows: Row[]; stats: { sellers: number; min: number | null; median: number | null; max: number | null }; you: { position: number; priceValue: number | null; vsMedianPct: number | null } | null; }

const money = (n: number | null) => (n == null ? "—" : `€${n.toFixed(2)}`);

export function ProductShoppingScan({
  initialQuery, defaultTld = "nl", onClose,
}: { initialQuery: string; defaultTld?: string; onClose: () => void }) {
  const [query, setQuery] = useState(initialQuery);
  const [tld, setTld] = useState(defaultTld);
  const [highlight, setHighlight] = useState("");
  const [running, setRunning] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [scan, setScan] = useState<Scan | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function run() {
    const q = query.trim();
    if (!q) { setErr("Enter a search term."); return; }
    setRunning(true); setErr(null); setScan(null);
    try {
      const res = await fetch("/api/shopping", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, tld, highlight: highlight.trim() }),
      });
      const j = await res.json();
      if (!res.ok) { setErr(j.error ?? "Scan failed."); return; }
      setScan(j);
    } catch (e) { setErr(e instanceof Error ? e.message : "Scan failed."); }
    finally { setRunning(false); }
  }

  const input: React.CSSProperties = { fontSize: 13, padding: "9px 11px", borderRadius: 8, border: "1px solid var(--border-2)", background: "var(--surface-2)", color: "var(--text)", fontFamily: "inherit" };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "6vh 16px 40px", overflowY: "auto" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 16, width: "100%", maxWidth: 760, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Shopping comparison</div>
            <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 2 }}>Which products rank for this search term, and at what price?</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}><X size={18} /></button>
        </div>

        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input value={query} onChange={e => setQuery(e.target.value)} disabled={running} autoFocus
              onKeyDown={e => e.key === "Enter" && !running && run()}
              placeholder="search term" style={{ ...input, flex: "1 1 260px" }} />
            <select value={tld} onChange={e => setTld(e.target.value)} disabled={running} style={{ ...input, cursor: "pointer" }}>
              {["nl", "be", "de", "fr", "com", "co.uk"].map(t => <option key={t} value={t}>google.{t}</option>)}
            </select>
            <button onClick={run} disabled={running}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "#fff", background: "var(--accent)", border: "none", borderRadius: 8, padding: "9px 18px", cursor: running ? "default" : "pointer", opacity: running ? 0.7 : 1 }}>
              {running ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />} {running ? "Scanning…" : "Scan"}
            </button>
          </div>
          <input value={highlight} onChange={e => setHighlight(e.target.value)} disabled={running}
            placeholder="Optional: your shop/brand — highlights where you rank"
            style={{ ...input, width: "100%", marginTop: 9 }} />
          <p style={{ fontSize: 11, color: "var(--text-faint)", margin: "8px 2px 0", lineHeight: 1.5 }}>
            The search term comes from the product title — feel free to trim it (feed titles are often too specific for Shopping).
          </p>
          {err && <div style={{ marginTop: 12, fontSize: 12.5, color: "#f87171" }}>{err}</div>}

          {scan && (
            <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 12 }}>
                <Stat label="Sellers" value={String(scan.stats.sellers)} />
                <Stat label="Lowest" value={money(scan.stats.min)} />
                <Stat label="Median" value={money(scan.stats.median)} />
                <Stat label="Highest" value={money(scan.stats.max)} />
              </div>

              {scan.you && (
                <div style={{ border: "1px solid color-mix(in srgb, var(--accent) 40%, var(--border))", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: "var(--text)" }}>
                    <strong style={{ color: "var(--accent)" }}>You:</strong> position {scan.you.position}
                    {scan.you.priceValue != null ? ` · ${money(scan.you.priceValue)}` : ""}
                    {scan.you.vsMedianPct != null && <span style={{ color: scan.you.vsMedianPct > 0 ? "#f87171" : "#4ade80" }}> · {scan.you.vsMedianPct > 0 ? `${scan.you.vsMedianPct}% above` : `${Math.abs(scan.you.vsMedianPct)}% below`} the median</span>}
                  </span>
                </div>
              )}

              <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ color: "var(--text-faint)", textAlign: "left" }}>
                      <th style={{ padding: "8px 12px", fontWeight: 600, width: 34 }}>#</th>
                      <th style={{ padding: "8px 12px", fontWeight: 600 }}>Shop</th>
                      <th style={{ padding: "8px 12px", fontWeight: 600 }}>Product</th>
                      <th style={{ padding: "8px 12px", fontWeight: 600, textAlign: "right" }}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scan.rows.map((r, i) => (
                      <tr key={i} style={{ borderTop: "1px solid var(--border)", background: r.isYou ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent" }}>
                        <td style={{ padding: "8px 12px", color: "var(--text-faint)", fontVariantNumeric: "tabular-nums" }}>{r.position}</td>
                        <td style={{ padding: "8px 12px", fontWeight: 600, color: r.isYou ? "var(--accent)" : "var(--text-2)", whiteSpace: "nowrap" }}>{r.merchant || "—"}{r.isYou ? " ★" : ""}</td>
                        <td style={{ padding: "8px 12px", color: "var(--text-2)", maxWidth: 340, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {r.link ? <a href={r.link} target="_blank" rel="noreferrer" style={{ color: "inherit", display: "inline-flex", alignItems: "center", gap: 5 }}>{r.title} <ExternalLink size={10} style={{ opacity: 0.5 }} /></a> : r.title}
                        </td>
                        <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{r.price || money(r.priceValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 9 }}>Live Google Shopping · google.{scan.tld}. Prijzen zoals getoond op het moment van scannen.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: "var(--text)" }}>{value}</div>
    </div>
  );
}
