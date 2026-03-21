"use client";

import { BUCKET_LABELS, BUCKET_DESCRIPTIONS, BUCKET_ORDER } from "@/lib/engine/types";

interface BucketData {
  bucket: string;
  score: number;
  isGoverning: boolean;
  signals: string[];
}

interface Props {
  buckets: BucketData[];
}

const BUCKET_ACCENT: Record<string, string> = {
  MEASUREMENT: "#c084fc",
  TRAFFIC:     "#60a5fa",
  CONVERSION:  "#fb923c",
  FUNNEL:      "#fbbf24",
  ECONOMICS:   "#4ade80",
};

function scoreColor(score: number): string {
  if (score >= 80) return "#4ade80";
  if (score >= 60) return "#fbbf24";
  if (score >= 40) return "#fb923c";
  return "#f87171";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Healthy";
  if (score >= 60) return "At Risk";
  if (score >= 40) return "Weak";
  return "Critical";
}

export function ScoreBuckets({ buckets }: Props) {
  const ordered = BUCKET_ORDER.map(
    (b) => buckets.find((s) => s.bucket === b) ?? { bucket: b, score: 100, isGoverning: false, signals: [] }
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {ordered.map((bucket, idx) => {
        const label  = BUCKET_LABELS[bucket.bucket as keyof typeof BUCKET_LABELS] ?? bucket.bucket;
        const desc   = BUCKET_DESCRIPTIONS[bucket.bucket as keyof typeof BUCKET_DESCRIPTIONS] ?? "";
        const accent = BUCKET_ACCENT[bucket.bucket] ?? "#60a5fa";
        const color  = scoreColor(bucket.score);
        const rgb    = accent.slice(1).match(/../g)!.map(h => parseInt(h, 16)).join(",");

        return (
          <div
            key={bucket.bucket}
            style={{
              background: bucket.isGoverning ? `rgba(${rgb}, 0.06)` : "var(--surface)",
              border: `1px solid ${bucket.isGoverning ? `rgba(${rgb}, 0.2)` : "var(--surface-3)"}`,
              borderRadius: 12,
              padding: "16px 18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

              {/* Left: step + info */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 28, height: 28, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 8, fontSize: 12, fontWeight: 700,
                  background: bucket.isGoverning ? `rgba(${rgb}, 0.15)` : "var(--surface-2)",
                  color: bucket.isGoverning ? accent : "var(--text-faint)",
                  border: `1px solid ${bucket.isGoverning ? `rgba(${rgb}, 0.25)` : "var(--border-2)"}`,
                }}>
                  {idx + 1}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-2)" }}>{label}</span>
                    {bucket.isGoverning && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase",
                        background: `rgba(${rgb}, 0.15)`,
                        color: accent,
                        padding: "2px 8px", borderRadius: 20,
                      }}>
                        Governing constraint
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--text-very-dim)", marginTop: 1 }}>{desc}</p>
                </div>
              </div>

              {/* Right: score */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 26, fontWeight: 700, color, letterSpacing: "-1px", lineHeight: 1 }}>
                  {bucket.score}
                </div>
                <div style={{ fontSize: 10, fontWeight: 500, color, marginTop: 2, letterSpacing: "0.3px" }}>
                  {scoreLabel(bucket.score)}
                </div>
              </div>
            </div>

            {/* Score bar */}
            <div style={{ marginTop: 12, height: 3, background: "var(--surface-2)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${bucket.score}%`,
                background: bucket.isGoverning ? accent : color,
                borderRadius: 2, transition: "width 0.6s ease",
              }} />
            </div>

            {/* Signals */}
            {bucket.signals.length > 0 && (
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 4 }}>
                {bucket.signals.slice(0, 2).map((sig, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, color: "var(--text-dim)" }}>
                    <span style={{ color: "var(--text-faint)", marginTop: 1 }}>›</span>
                    {sig}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
