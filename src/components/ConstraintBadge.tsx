"use client";

import { BUCKET_LABELS } from "@/lib/engine/types";

type ConstraintBucket = "MEASUREMENT" | "TRAFFIC" | "CONVERSION" | "FUNNEL" | "ECONOMICS";

const BUCKET_COLORS: Record<ConstraintBucket, { bg: string; text: string }> = {
  MEASUREMENT: { bg: "rgba(192,132,252,0.12)", text: "#c084fc" },
  TRAFFIC:     { bg: "rgba(96,165,250,0.12)",  text: "#60a5fa" },
  CONVERSION:  { bg: "rgba(251,146,60,0.12)",  text: "#fb923c" },
  FUNNEL:      { bg: "rgba(251,191,36,0.12)",  text: "#fbbf24" },
  ECONOMICS:   { bg: "rgba(74,222,128,0.12)",  text: "#4ade80" },
};

interface Props {
  bucket: ConstraintBucket;
  isGoverning?: boolean;
  size?: "sm" | "md";
}

export function ConstraintBadge({ bucket, isGoverning, size = "sm" }: Props) {
  const { bg, text } = BUCKET_COLORS[bucket];
  const label = BUCKET_LABELS[bucket];
  const fontSize = size === "md" ? 12 : 10;
  const padding  = size === "md" ? "4px 12px" : "2px 8px";

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: bg, color: text,
      borderRadius: 20, fontWeight: 600,
      fontSize, padding, letterSpacing: "0.3px",
    }}>
      {isGoverning && <span style={{ color: "#f87171" }}>●</span>}
      {label}
    </span>
  );
}
