"use client";

import { BUCKET_LABELS } from "@/lib/engine/types";

type ConstraintBucket = "MEASUREMENT" | "TRAFFIC" | "CONVERSION" | "FUNNEL" | "ECONOMICS";

const BUCKET_COLORS: Record<ConstraintBucket, string> = {
  MEASUREMENT: "bg-purple-100 text-purple-800 border-purple-200",
  TRAFFIC:     "bg-blue-100 text-blue-800 border-blue-200",
  CONVERSION:  "bg-orange-100 text-orange-800 border-orange-200",
  FUNNEL:      "bg-yellow-100 text-yellow-800 border-yellow-200",
  ECONOMICS:   "bg-green-100 text-green-800 border-green-200",
};

interface Props {
  bucket: ConstraintBucket;
  isGoverning?: boolean;
  size?: "sm" | "md";
}

export function ConstraintBadge({ bucket, isGoverning, size = "sm" }: Props) {
  const color = BUCKET_COLORS[bucket];
  const label = BUCKET_LABELS[bucket];
  const padding = size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${color} ${padding}`}
    >
      {isGoverning && <span className="text-red-500">●</span>}
      {label}
    </span>
  );
}
