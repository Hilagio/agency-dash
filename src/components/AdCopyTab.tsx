"use client";

import { useState } from "react";
import { Loader2, Wand2, ChevronDown, ChevronRight, Copy, Check, AlertTriangle } from "lucide-react";
import type { RsaAd, RsaAsset, AssetPerformanceLabel, AdStrength } from "@/app/api/accounts/[id]/ads/route";

const PERF_COLORS: Record<AssetPerformanceLabel, { bg: string; text: string; label: string }> = {
  BEST:        { bg: "rgba(74,222,128,0.12)", text: "#4ade80", label: "Best"     },
  GOOD:        { bg: "rgba(148,163,184,0.12)", text: "#94a3b8", label: "Good"    },
  LEARNING:    { bg: "rgba(251,191,36,0.12)", text: "#fbbf24", label: "Learning" },
  LOW:         { bg: "rgba(248,113,113,0.12)", text: "#f87171", label: "Low"     },
  UNSPECIFIED: { bg: "rgba(148,163,184,0.08)", text: "#64748b", label: ""        },
};

const STRENGTH_COLORS: Record<AdStrength, { color: string; label: string }> = {
  EXCELLENT: { color: "#4ade80", label: "Excellent" },
  GOOD:      { color: "#86efac", label: "Good"      },
  AVERAGE:   { color: "#fbbf24", label: "Average"   },
  POOR:      { color: "#f87171", label: "Poor"      },
  PENDING:   { color: "#64748b", label: "Pending"   },
  NO_ADS:    { color: "#64748b", label: "No ads"    },
  LOADING:   { color: "#64748b", label: "Loading"   },
  UNSPECIFIED: { color: "#64748b", label: "—"       },
};

function AssetChip({ asset }: { asset: RsaAsset }) {
  const style = PERF_COLORS[asset.performanceLabel];
  const tooLong = asset.text.length > (asset.pinnedField?.startsWith("HEADLINE") ? 30 : 90);
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: style.bg, borderRadius: 5, padding: "3px 8px",
      margin: "2px",
    }}>
      <span style={{ fontSize: 12, color: "var(--text-2)" }}>{asset.text}</span>
      {tooLong && <AlertTriangle size={10} style={{ color: "#f87171", flexShrink: 0 }} />}
      {style.label && (
        <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: style.text }}>
          {style.label}
        </span>
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={copy}
      title="Copy"
      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", padding: 2, display: "flex", alignItems: "center" }}
    >
      {copied ? <Check size={12} style={{ color: "#4ade80" }} /> : <Copy size={12} />}
    </button>
  );
}

function AdStrengthBadge({ strength }: { strength: AdStrength }) {
  const s = STRENGTH_COLORS[strength];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase",
      color: s.color, background: `${s.color}18`, borderRadius: 4, padding: "2px 6px",
    }}>
      {s.label}
    </span>
  );
}

interface GenerateState {
  loading: boolean;
  text: string;
  error: string | null;
}

function AdCard({ ad, accountId }: { ad: RsaAd; accountId: string }) {
  const [expanded, setExpanded] = useState(false);
  const [gen, setGen] = useState<GenerateState>({ loading: false, text: "", error: null });

  const lowHeadlines    = ad.headlines.filter(h => h.performanceLabel === "LOW").map(h => h.text);
  const lowDescriptions = ad.descriptions.filter(d => d.performanceLabel === "LOW").map(d => d.text);

  async function generate() {
    setGen({ loading: true, text: "", error: null });
    setExpanded(true);
    try {
      const res = await fetch(`/api/accounts/${accountId}/ads/generate`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          campaignName:        ad.campaignName,
          adGroupName:         ad.adGroupName,
          headlines:           ad.headlines.map(h => h.text),
          descriptions:        ad.descriptions.map(d => d.text),
          lowPerfHeadlines:    lowHeadlines,
          lowPerfDescriptions: lowDescriptions,
        }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({})) as { error?: string };
        setGen({ loading: false, text: "", error: j.error ?? "Generation failed" });
        return;
      }
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let result    = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setGen({ loading: false, text: result, error: null });
      }
    } catch (e) {
      setGen({ loading: false, text: "", error: e instanceof Error ? e.message : String(e) });
    }
  }

  const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : "—";
  const cvr = ad.clicks > 0 ? ((ad.conversions / ad.clicks) * 100).toFixed(1) : "—";

  return (
    <div style={{
      border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden",
      marginBottom: 12,
    }}>
      {/* Header row */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 16px", cursor: "pointer",
          background: expanded ? "var(--surface)" : "var(--bg)",
          borderBottom: expanded ? "1px solid var(--border)" : "none",
        }}
      >
        {expanded ? <ChevronDown size={14} style={{ color: "var(--text-faint)", flexShrink: 0 }} /> : <ChevronRight size={14} style={{ color: "var(--text-faint)", flexShrink: 0 }} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {ad.campaignName}
            <span style={{ color: "var(--text-faint)", fontWeight: 400 }}> / {ad.adGroupName}</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--text-faint)" }}>
            {ad.headlines.length} headlines · {ad.descriptions.length} descriptions
            {lowHeadlines.length + lowDescriptions.length > 0 && (
              <span style={{ color: "#f87171", marginLeft: 8 }}>· {lowHeadlines.length + lowDescriptions.length} low-performing</span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: "var(--text-faint)", textAlign: "right" }}>
            <span style={{ color: "var(--text-muted)" }}>{ad.clicks.toLocaleString()}</span> clk
            <span style={{ margin: "0 4px", color: "var(--border-2)" }}>·</span>
            CTR <span style={{ color: "var(--text-muted)" }}>{ctr}%</span>
            <span style={{ margin: "0 4px", color: "var(--border-2)" }}>·</span>
            CVR <span style={{ color: "var(--text-muted)" }}>{cvr}%</span>
          </div>
          <AdStrengthBadge strength={ad.adStrength} />
          <button
            onClick={e => { e.stopPropagation(); generate(); }}
            disabled={gen.loading}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "var(--accent)", color: "#fff", border: "none",
              borderRadius: 7, padding: "5px 11px", fontSize: 11, fontWeight: 600,
              cursor: gen.loading ? "not-allowed" : "pointer",
              opacity: gen.loading ? 0.7 : 1,
            }}
          >
            {gen.loading ? <Loader2 size={11} className="animate-spin" /> : <Wand2 size={11} />}
            Generate
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: "14px 16px" }}>
          {/* Current assets */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-faint)", marginBottom: 8 }}>
              Headlines
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {ad.headlines.map((h, i) => <AssetChip key={i} asset={h} />)}
            </div>
          </div>
          <div style={{ marginBottom: gen.text ? 16 : 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-faint)", marginBottom: 8 }}>
              Descriptions
            </div>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {ad.descriptions.map((d, i) => <AssetChip key={i} asset={d} />)}
            </div>
          </div>

          {/* Generated variants */}
          {(gen.text || gen.error) && (
            <div style={{
              marginTop: 16, padding: "14px 16px",
              background: "var(--surface)", borderRadius: 8,
              border: "1px solid var(--border-2)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--accent)" }}>
                  AI suggestions
                </div>
                {gen.text && <CopyButton text={gen.text} />}
              </div>
              {gen.error ? (
                <div style={{ fontSize: 12, color: "#f87171" }}>{gen.error}</div>
              ) : (
                <GeneratedOutput text={gen.text} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GeneratedOutput({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div style={{ fontSize: 12 }}>
      {lines.map((line, i) => {
        const isSection = /^(HEADLINES:|DESCRIPTIONS:)/.test(line);
        const isItem    = /^\d+\.\s/.test(line);
        const isNote    = line.length > 0 && !isSection && !isItem && !line.startsWith("---");
        if (!line.trim()) return <div key={i} style={{ height: 6 }} />;
        if (isSection) return (
          <div key={i} style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-faint)", marginTop: 10, marginBottom: 4 }}>
            {line}
          </div>
        );
        if (isItem) {
          const content = line.replace(/^\d+\.\s/, "");
          const len     = content.trim().length;
          const maxLen  = text.includes("DESCRIPTIONS:") && i > text.split("\n").findIndex(l => l.startsWith("DESCRIPTIONS:")) ? 90 : 30;
          const over    = len > maxLen;
          return (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 3, padding: "4px 8px", background: "var(--bg)", borderRadius: 5 }}>
              <span style={{ color: "var(--text-2)" }}>{content}</span>
              <span style={{ fontSize: 9, color: over ? "#f87171" : "var(--text-faint)", flexShrink: 0 }}>{len}c</span>
              <CopyButton text={content.trim()} />
            </div>
          );
        }
        if (isNote) return (
          <div key={i} style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic", marginTop: 8, lineHeight: 1.5 }}>
            {line}
          </div>
        );
        return null;
      })}
    </div>
  );
}

export function AdCopyTab({ accountId }: { accountId: string }) {
  const [ads, setAds]       = useState<RsaAd[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function loadAds() {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`/api/accounts/${accountId}/ads`);
      const json = await res.json() as { ads?: RsaAd[]; error?: string };
      if (json.error) { setError(json.error); return; }
      setAds(json.ads ?? []);
      setLoaded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  const totalLow = ads.reduce((s, a) =>
    s + a.headlines.filter(h => h.performanceLabel === "LOW").length
      + a.descriptions.filter(d => d.performanceLabel === "LOW").length, 0);

  const totalPoor = ads.filter(a => a.adStrength === "POOR" || a.adStrength === "AVERAGE").length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: 0, marginBottom: 4 }}>Ad Copy</h2>
          <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
            Live RSA assets with performance labels. Generate AI variants to replace low-performing assets.
          </p>
        </div>
        <button
          onClick={loadAds}
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "var(--btn-primary)", color: "#fff", border: "none",
            borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
          {loaded ? "Refresh" : "Load ads"}
        </button>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#f87171", marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loaded && ads.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-faint)", fontSize: 13 }}>
          No active RSAs found in the last 30 days.
        </div>
      )}

      {/* Summary chips */}
      {loaded && ads.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <SummaryChip label="Total RSAs" value={ads.length} color="var(--text-muted)" />
          {totalPoor > 0 && <SummaryChip label="Below avg strength" value={totalPoor} color="#fbbf24" />}
          {totalLow > 0 && <SummaryChip label="Low-performing assets" value={totalLow} color="#f87171" />}
        </div>
      )}

      {/* Legend */}
      {loaded && ads.length > 0 && (
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          {Object.entries(PERF_COLORS).filter(([k]) => k !== "UNSPECIFIED").map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: v.text }} />
              <span style={{ fontSize: 10, color: "var(--text-faint)" }}>{v.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Ad cards */}
      {ads.map(ad => (
        <AdCard key={ad.adId} ad={ad} accountId={accountId} />
      ))}

      {!loaded && !loading && !error && (
        <div style={{
          border: "1px dashed var(--border-2)", borderRadius: 12, padding: "48px 32px",
          textAlign: "center",
        }}>
          <Wand2 size={28} style={{ color: "var(--text-faint)", marginBottom: 12 }} />
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>
            Fetch your live RSAs from Google Ads to review asset performance and generate AI-powered variants.
          </p>
          <p style={{ fontSize: 12, color: "var(--text-faint)", margin: 0 }}>
            Assets are colour-coded: green = Best, amber = Learning, red = Low
          </p>
        </div>
      )}
    </div>
  );
}

function SummaryChip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 7, padding: "5px 10px",
    }}>
      <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}</span>
      <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{label}</span>
    </div>
  );
}
