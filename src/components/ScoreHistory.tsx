"use client";

import { useEffect, useState } from "react";

interface HistoryPoint {
  id: string;
  createdAt: string;
  scoreMeasurement: number;
  scoreTraffic: number;
  scoreConversion: number;
  scoreFunnel: number;
  scoreEconomics: number;
  governingConstraint: string;
}

interface Props {
  accountId: string;
  governingConstraint: string;
}

const BUCKET_LINES = [
  { key: "scoreMeasurement", label: "Measurement", color: "#c084fc" },
  { key: "scoreTraffic",     label: "Traffic",     color: "#60a5fa" },
  { key: "scoreConversion",  label: "Conversion",  color: "#fb923c" },
  { key: "scoreFunnel",      label: "Funnel",      color: "#fbbf24" },
  { key: "scoreEconomics",   label: "Economics",   color: "#4ade80" },
] as const;

const CONSTRAINT_KEY: Record<string, keyof HistoryPoint> = {
  MEASUREMENT: "scoreMeasurement",
  TRAFFIC:     "scoreTraffic",
  CONVERSION:  "scoreConversion",
  FUNNEL:      "scoreFunnel",
  ECONOMICS:   "scoreEconomics",
};

const W = 640;
const H = 160;
const PAD = { top: 12, right: 20, bottom: 28, left: 36 };

function toX(idx: number, total: number): number {
  if (total < 2) return PAD.left + (W - PAD.left - PAD.right) / 2;
  return PAD.left + (idx / (total - 1)) * (W - PAD.left - PAD.right);
}

function toY(score: number): number {
  return PAD.top + (1 - score / 100) * (H - PAD.top - PAD.bottom);
}

function polyline(points: HistoryPoint[], key: keyof HistoryPoint): string {
  return points
    .map((p, i) => `${toX(i, points.length)},${toY(Number(p[key]))}`)
    .join(" ");
}

export function ScoreHistory({ accountId, governingConstraint }: Props) {
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/accounts/${accountId}/history`)
      .then((r) => r.json())
      .then((data: HistoryPoint[]) => setHistory(data))
      .catch(() => {});
  }, [accountId]);

  if (history.length < 2) return null;

  const constraintKey = CONSTRAINT_KEY[governingConstraint] ?? "scoreMeasurement";
  const hoveredPoint  = hovered !== null ? history[hovered] : null;

  return (
    <div style={{
      background: "#111", border: "1px solid #1e1e1e", borderRadius: 12,
      padding: "18px 20px", marginTop: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "#444" }}>
          Score history
        </span>
        <span style={{ fontSize: 11, color: "#333" }}>{history.length} snapshots</span>
      </div>

      {/* SVG chart */}
      <div style={{ position: "relative" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", height: "auto", overflow: "visible" }}
          onMouseLeave={() => setHovered(null)}
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line
                x1={PAD.left} y1={toY(v)} x2={W - PAD.right} y2={toY(v)}
                stroke="#1a1a1a" strokeWidth={1}
              />
              <text x={PAD.left - 6} y={toY(v) + 4} textAnchor="end" fontSize={9} fill="#333">
                {v}
              </text>
            </g>
          ))}

          {/* All bucket lines (dimmed) */}
          {BUCKET_LINES.filter((b) => b.key !== constraintKey).map((b) => (
            <polyline
              key={b.key}
              points={polyline(history, b.key)}
              fill="none"
              stroke={b.color}
              strokeWidth={1}
              strokeOpacity={0.15}
            />
          ))}

          {/* Governing constraint line (highlighted) */}
          {BUCKET_LINES.filter((b) => b.key === constraintKey).map((b) => (
            <g key={b.key}>
              <polyline
                points={polyline(history, b.key)}
                fill="none"
                stroke={b.color}
                strokeWidth={2}
                strokeOpacity={0.9}
              />
              {history.map((p, i) => (
                <circle
                  key={i}
                  cx={toX(i, history.length)}
                  cy={toY(Number(p[b.key]))}
                  r={hovered === i ? 5 : 3}
                  fill={b.color}
                  fillOpacity={hovered === i ? 1 : 0.6}
                  style={{ cursor: "crosshair", transition: "r 0.1s" }}
                  onMouseEnter={() => setHovered(i)}
                />
              ))}
            </g>
          ))}

          {/* Hover vertical line */}
          {hovered !== null && (
            <line
              x1={toX(hovered, history.length)}
              y1={PAD.top}
              x2={toX(hovered, history.length)}
              y2={H - PAD.bottom}
              stroke="#333"
              strokeWidth={1}
              strokeDasharray="3,3"
            />
          )}

          {/* X-axis labels */}
          {history.map((p, i) => {
            // Show max ~5 date labels
            if (history.length > 5 && i % Math.ceil(history.length / 5) !== 0 && i !== history.length - 1) return null;
            const d = new Date(p.createdAt);
            const label = `${d.getMonth() + 1}/${d.getDate()}`;
            return (
              <text
                key={i}
                x={toX(i, history.length)}
                y={H - PAD.bottom + 14}
                textAnchor="middle"
                fontSize={9}
                fill="#333"
              >
                {label}
              </text>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredPoint && (
          <div style={{
            position: "absolute", top: 0, right: 0,
            background: "#0d0d0d", border: "1px solid #222",
            borderRadius: 8, padding: "8px 12px", fontSize: 11,
            pointerEvents: "none",
          }}>
            <div style={{ color: "#555", marginBottom: 6 }}>
              {new Date(hoveredPoint.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
            {BUCKET_LINES.map((b) => (
              <div key={b.key} style={{
                display: "flex", alignItems: "center", gap: 6, marginBottom: 2,
                opacity: b.key === constraintKey ? 1 : 0.4,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: b.color, flexShrink: 0 }} />
                <span style={{ color: "#666", minWidth: 70 }}>{b.label}</span>
                <span style={{ color: b.key === constraintKey ? b.color : "#555", fontWeight: 600 }}>
                  {Number(hoveredPoint[b.key])}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
        {BUCKET_LINES.map((b) => (
          <div key={b.key} style={{
            display: "flex", alignItems: "center", gap: 5,
            opacity: b.key === constraintKey ? 1 : 0.3,
          }}>
            <div style={{ width: 16, height: 2, background: b.color, borderRadius: 1 }} />
            <span style={{ fontSize: 10, color: b.key === constraintKey ? b.color : "#555" }}>
              {b.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
