"use client";
/**
 * Google Shopping competitive scan — type a product/term, see which sellers rank
 * and at what price, and where a given shop/brand stands. Powered by ScraperAPI.
 */
import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Search, ExternalLink } from "lucide-react";

interface Row { position: number; title: string; merchant: string; price: string; priceValue: number | null; link: string | null; isYou: boolean; }
interface Scan { query: string; tld: string; rows: Row[]; stats: { sellers: number; min: number | null; median: number | null; max: number | null }; you: { position: number; priceValue: number | null; vsMedianPct: number | null } | null; }

const money = (n: number | null) => (n == null ? "—" : `€${n.toFixed(2)}`);

export default function ShoppingPage() {
  const [query, setQuery] = useState("");
  const [tld, setTld] = useState("nl");
  const [highlight, setHighlight] = useState("");
  const [running, setRunning] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [scan, setScan] = useState<Scan | null>(null);

  async function run() {
    const q = query.trim();
    if (!q) { setErr("Vul een product of zoekterm in."); return; }
    setRunning(true); setErr(null); setScan(null);
    try {
      const res = await fetch("/api/shopping", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, tld, highlight: highlight.trim() }),
      });
      const j = await res.json();
      if (!res.ok) { setErr(j.error ?? "Scan mislukt."); return; }
      setScan(j);
    } catch (e) { setErr(e instanceof Error ? e.message : "Scan mislukt."); }
    finally { setRunning(false); }
  }

  const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14 };
  const input: React.CSSProperties = { fontSize: 14, padding: "11px 13px", borderRadius: 9, border: "1px solid var(--border-2)", background: "var(--surface-2)", color: "var(--text)", fontFamily: "inherit" };

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 80px" }}>
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)", textDecoration: "none", marginBottom: 18 }}>
        <ArrowLeft size={14} /> Cockpit
      </Link>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.6px", margin: "0 0 4px" }}>Shopping-vergelijking</h1>
      <p style={{ fontSize: 14, color: "var(--text-muted)", margin: "0 0 22px", lineHeight: 1.5 }}>
        Typ een product of zoekterm en zie de echte Google Shopping-resultaten — welke winkels ranken, tegen welke prijs, op welke positie. Vul optioneel je eigen winkel/merk in om te zien waar jij staat.
      </p>

      <div style={{ ...card, padding: "18px 20px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input value={query} onChange={e => setQuery(e.target.value)} disabled={running}
            onKeyDown={e => e.key === "Enter" && !running && run()}
            placeholder="bijv. nike air max 90 heren" style={{ ...input, flex: "1 1 300px" }} />
          <select value={tld} onChange={e => setTld(e.target.value)} disabled={running} style={{ ...input, cursor: "pointer" }}>
            {["nl", "be", "de", "fr", "com", "co.uk"].map(t => <option key={t} value={t}>google.{t}</option>)}
          </select>
          <button onClick={run} disabled={running}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700, color: "#fff", background: "var(--accent)", border: "none", borderRadius: 9, padding: "11px 20px", cursor: running ? "default" : "pointer", opacity: running ? 0.7 : 1 }}>
            {running ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />} {running ? "Scannen…" : "Scan"}
          </button>
        </div>
        <input value={highlight} onChange={e => setHighlight(e.target.value)} disabled={running}
          placeholder="Optioneel: jouw winkel of merk (bv. 'Footlocker') — markeert waar jij staat"
          style={{ ...input, width: "100%", marginTop: 10 }} />
        {err && <div style={{ marginTop: 12, fontSize: 13, color: "var(--danger, #d33)" }}>{err}</div>}
      </div>

      {scan && (
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 14 }}>
            <Stat label="Verkopers" value={String(scan.stats.sellers)} />
            <Stat label="Laagste" value={money(scan.stats.min)} />
            <Stat label="Mediaan" value={money(scan.stats.median)} />
            <Stat label="Hoogste" value={money(scan.stats.max)} />
          </div>

          {scan.you && (
            <div style={{ ...card, padding: "13px 16px", marginBottom: 14, borderColor: "color-mix(in srgb, var(--accent) 40%, var(--border))" }}>
              <span style={{ fontSize: 13.5, color: "var(--text)" }}>
                <strong style={{ color: "var(--accent)" }}>Jij:</strong> positie {scan.you.position}
                {scan.you.priceValue != null ? ` · ${money(scan.you.priceValue)}` : ""}
                {scan.you.vsMedianPct != null && <span style={{ color: scan.you.vsMedianPct > 0 ? "var(--danger, #d33)" : "var(--accent)" }}> · {scan.you.vsMedianPct > 0 ? `${scan.you.vsMedianPct}% boven` : `${Math.abs(scan.you.vsMedianPct)}% onder`} de mediaan</span>}
              </span>
            </div>
          )}

          <div style={{ ...card, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ color: "var(--text-muted)", textAlign: "left" }}>
                  <th style={{ padding: "10px 12px", fontWeight: 600, width: 40 }}>#</th>
                  <th style={{ padding: "10px 12px", fontWeight: 600 }}>Winkel</th>
                  <th style={{ padding: "10px 12px", fontWeight: 600 }}>Product</th>
                  <th style={{ padding: "10px 12px", fontWeight: 600, textAlign: "right" }}>Prijs</th>
                </tr>
              </thead>
              <tbody>
                {scan.rows.map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)", background: r.isYou ? "color-mix(in srgb, var(--accent) 9%, transparent)" : "transparent" }}>
                    <td style={{ padding: "9px 12px", color: "var(--text-3)", fontVariantNumeric: "tabular-nums" }}>{r.position}</td>
                    <td style={{ padding: "9px 12px", fontWeight: 600, color: r.isYou ? "var(--accent)" : "var(--text-2)", whiteSpace: "nowrap" }}>{r.merchant || "—"}{r.isYou ? " ★" : ""}</td>
                    <td style={{ padding: "9px 12px", color: "var(--text-2)", maxWidth: 420, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.link ? <a href={r.link} target="_blank" rel="noreferrer" style={{ color: "inherit", display: "inline-flex", alignItems: "center", gap: 5 }}>{r.title} <ExternalLink size={11} style={{ opacity: 0.5 }} /></a> : r.title}
                    </td>
                    <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{r.price || money(r.priceValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 11.5, color: "var(--text-dim)", marginTop: 10 }}>Live Google Shopping ({scan.query} · google.{scan.tld}). Prijzen zoals getoond op het moment van scannen.</p>
        </div>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </div>
  );
}
