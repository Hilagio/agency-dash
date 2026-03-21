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

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

function getBarColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
}

function getScoreLabel(score: number): string {
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
    <div className="space-y-3">
      {ordered.map((bucket, idx) => {
        const label = BUCKET_LABELS[bucket.bucket as keyof typeof BUCKET_LABELS] ?? bucket.bucket;
        const desc = BUCKET_DESCRIPTIONS[bucket.bucket as keyof typeof BUCKET_DESCRIPTIONS] ?? "";

        return (
          <div
            key={bucket.bucket}
            className={`rounded-xl border p-4 transition-all ${
              bucket.isGoverning
                ? "border-red-300 bg-red-50 shadow-sm"
                : "border-gray-100 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  bucket.isGoverning ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{label}</span>
                    {bucket.isGoverning && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                        GOVERNING CONSTRAINT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className={`text-2xl font-bold tabular-nums ${getScoreColor(bucket.score)}`}>
                  {bucket.score}
                </div>
                <div className={`text-xs font-medium ${getScoreColor(bucket.score)}`}>
                  {getScoreLabel(bucket.score)}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(bucket.score)}`}
                  style={{ width: `${bucket.score}%` }}
                />
              </div>
            </div>

            {bucket.signals.length > 0 && (
              <ul className="mt-3 space-y-1">
                {bucket.signals.slice(0, 2).map((sig, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="mt-0.5 flex-shrink-0 text-gray-400">›</span>
                    {sig}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
