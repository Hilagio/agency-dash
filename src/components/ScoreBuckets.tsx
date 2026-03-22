"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { BUCKET_LABELS, BUCKET_DESCRIPTIONS, BUCKET_ORDER } from "@/lib/engine/types";

// ─── Static check inventory ─────────────────────────────────────────────────
// Every check the scorer evaluates, with human labels and what "passing" means.
// Used to show "what we looked at" even when a check passes.

interface CheckDef {
  id: string;
  label: string;
  what: string; // one-liner explaining the metric
  threshold: string; // what the pass bar is
}

const BUCKET_CHECKS: Record<string, CheckDef[]> = {
  MEASUREMENT: [
    { id: "conv_tracking",       label: "Conversion tracking active",     what: "Is at least one conversion action recording?",          threshold: "Must be active" },
    { id: "conv_actions_count",  label: "Conversion actions configured",  what: "How many distinct conversion actions exist?",           threshold: ">0 configured" },
    { id: "enhanced_conv",       label: "Enhanced conversions",           what: "Enhanced conversions improve modelling of missing data", threshold: "Must be enabled" },
    { id: "tag_coverage",        label: "Tag coverage",                   what: "% of sessions where the conversion tag fired",          threshold: "≥ 90% coverage" },
    { id: "ga4_linked",          label: "GA4 linked",                     what: "Google Analytics 4 linked for audience + engagement",   threshold: "Must be linked" },
    { id: "date_lag",            label: "Attribution lag",                what: "Days delay before conversions appear in reporting",     threshold: "≤ 7 days" },
  ],
  TRAFFIC: [
    { id: "is_budget",    label: "Budget impression share loss", what: "% of auctions lost because daily budget ran out",        threshold: "< 30% lost" },
    { id: "is_rank",      label: "Rank impression share loss",   what: "% of auctions lost due to low quality score or bid",     threshold: "< 25% lost" },
    { id: "ctr",          label: "Click-through rate",           what: "Clicks ÷ impressions — proxy for ad relevance",          threshold: "≥ 2%" },
    { id: "quality_score",label: "Average quality score",        what: "Google's 1–10 rating of ad + keyword + page relevance",  threshold: "≥ 7 / 10" },
    { id: "irrel_queries",label: "Irrelevant query spend",       what: "Estimated % of budget on searches that won't convert",   threshold: "< 20% wasted" },
  ],
  CONVERSION: [
    { id: "cvr_benchmark",  label: "Conversion rate vs benchmark", what: "Your CVR vs industry average — accounts for vertical",   threshold: "≥ 80% of benchmark" },
    { id: "mobile_speed",   label: "Mobile page speed",           what: "Google's 0–100 speed score for the landing page",        threshold: "≥ 70 / 100" },
    { id: "landing_page",   label: "Landing page experience",     what: "Google Ads rating of page relevance and quality",        threshold: "≥ 7 / 10" },
    { id: "bounce_rate",    label: "Bounce rate",                  what: "% of visitors who left without any interaction",        threshold: "< 70%" },
  ],
  FUNNEL: [
    { id: "cpl",            label: "Cost per lead vs target",     what: "Actual CPL vs your target — signals funnel efficiency",  threshold: "Within 10% of target" },
    { id: "lead_to_sale",   label: "Lead-to-sale rate",           what: "% of leads that eventually close as customers",         threshold: "≥ 20%" },
    { id: "lead_quality",   label: "Lead quality score",          what: "0–10 rating of whether leads match your ICP",           threshold: "≥ 5 / 10" },
    { id: "offline_import", label: "Offline conversion import",   what: "Importing closed deals back into Google Ads to train Smart Bidding on revenue, not just leads", threshold: "Must be active" },
  ],
  ECONOMICS: [
    { id: "roas",           label: "ROAS vs target",             what: "Actual ROAS vs your target — is the account profitable?",  threshold: "≥ 90% of target" },
    { id: "cpa",            label: "CPA vs target",              what: "Actual CPA vs your target — lead-gen accounts",           threshold: "Within 10% of target" },
    { id: "break_even",     label: "Break-even ROAS",            what: "Is actual ROAS above the break-even point for your margin?", threshold: "Above 1 ÷ gross margin" },
    { id: "budget_util",    label: "Budget utilisation",         what: "% of monthly budget actually spent — under-spend = over-restricted", threshold: "≥ 70% spent" },
  ],
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface BucketData {
  bucket: string;
  score: number;
  isGoverning: boolean;
  signals: string[]; // triggered penalty/warning strings from the scorer
}

interface Props {
  buckets: BucketData[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// A "signal" matches a check if it contains any of the check's keywords.
// This is a simple heuristic — the scorer already surfaces the right text.
const CHECK_KEYWORDS: Record<string, string[]> = {
  conv_tracking:      ["conversion tracking"],
  conv_actions_count: ["zero conversion actions"],
  enhanced_conv:      ["enhanced conversions not enabled", "enhanced conversions"],
  tag_coverage:       ["tag coverage"],
  ga4_linked:         ["ga4 not linked", "ga4"],
  date_lag:           ["attribution lag"],
  is_budget:          ["lost to budget", "impression share lost to budget"],
  is_rank:            ["lost to rank", "impression share lost to rank"],
  ctr:                ["ctr"],
  quality_score:      ["quality score"],
  irrel_queries:      ["irrelevant queries", "irrelevant query"],
  cvr_benchmark:      ["cvr", "conversion rate", "industry benchmark"],
  mobile_speed:       ["mobile speed"],
  landing_page:       ["landing page"],
  bounce_rate:        ["bounce rate"],
  cpl:                ["cpl", "cost per lead"],
  lead_to_sale:       ["lead-to-sale"],
  lead_quality:       ["lead quality"],
  offline_import:     ["offline conversion import"],
  roas:               ["roas"],
  cpa:                ["cpa"],
  break_even:         ["break-even"],
  budget_util:        ["budget used", "budget utilisation"],
};

function findSignalForCheck(checkId: string, signals: string[]): string | undefined {
  const keywords = CHECK_KEYWORDS[checkId] ?? [];
  return signals.find(s =>
    keywords.some(kw => s.toLowerCase().includes(kw.toLowerCase()))
  );
}

// ─── Check Row ────────────────────────────────────────────────────────────────

function CheckRow({ check, triggeredSignal }: { check: CheckDef; triggeredSignal: string | undefined }) {
  const [showDetail, setShowDetail] = useState(false);
  const passed = !triggeredSignal;

  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <div
        style={{
          display: "grid", gridTemplateColumns: "20px 1fr 20px", gap: 10,
          alignItems: "center", padding: "9px 0", cursor: "pointer",
        }}
        onClick={() => setShowDetail(v => !v)}
      >
        {/* Status icon */}
        <div>
          {passed
            ? <CheckCircle2 size={14} style={{ color: "#4ade80", flexShrink: 0 }} />
            : triggeredSignal?.toLowerCase().includes("room to improve") || triggeredSignal?.toLowerCase().includes("slightly") || triggeredSignal?.toLowerCase().includes("watch")
              ? <AlertTriangle size={14} style={{ color: "#fbbf24", flexShrink: 0 }} />
              : <XCircle size={14} style={{ color: "#f87171", flexShrink: 0 }} />}
        </div>

        {/* Label + signal summary */}
        <div>
          <div style={{
            fontSize: 12, fontWeight: 500,
            color: passed ? "var(--text-muted)" : "var(--text-2)",
          }}>
            {check.label}
          </div>
          {!passed && (
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 1, lineHeight: 1.4 }}>
              {triggeredSignal}
            </div>
          )}
        </div>

        {/* Expand */}
        <Info
          size={12}
          style={{ color: "var(--text-faint)", cursor: "pointer" }}
        />
      </div>

      {showDetail && (
        <div style={{
          background: "var(--surface-2)", borderRadius: 6, padding: "8px 12px",
          marginBottom: 6, fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5,
        }}>
          <div><strong style={{ color: "var(--text-muted)" }}>What:</strong> {check.what}</div>
          <div><strong style={{ color: "var(--text-muted)" }}>Pass bar:</strong> {check.threshold}</div>
        </div>
      )}
    </div>
  );
}

// ─── Bucket Card ─────────────────────────────────────────────────────────────

function BucketCard({ bucket, idx }: { bucket: BucketData; idx: number }) {
  const [open, setOpen] = useState(bucket.isGoverning);

  const label  = BUCKET_LABELS[bucket.bucket as keyof typeof BUCKET_LABELS] ?? bucket.bucket;
  const desc   = BUCKET_DESCRIPTIONS[bucket.bucket as keyof typeof BUCKET_DESCRIPTIONS] ?? "";
  const accent = BUCKET_ACCENT[bucket.bucket] ?? "#60a5fa";
  const color  = scoreColor(bucket.score);
  const rgb    = accent.slice(1).match(/../g)!.map(h => parseInt(h, 16)).join(",");
  const checks = BUCKET_CHECKS[bucket.bucket] ?? [];

  const failCount = bucket.signals.length;
  const passCount = Math.max(0, checks.length - failCount);

  return (
    <div style={{
      background: bucket.isGoverning ? `rgba(${rgb}, 0.05)` : "var(--surface)",
      border: `1px solid ${bucket.isGoverning ? `rgba(${rgb}, 0.25)` : "var(--border)"}`,
      borderRadius: 12, overflow: "hidden",
    }}>
      {/* Header row — always visible */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          padding: "14px 18px", cursor: "pointer",
        }}
        onClick={() => setOpen(v => !v)}
      >
        {/* Left: step + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 26, height: 26, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 7, fontSize: 11, fontWeight: 700,
            background: bucket.isGoverning ? `rgba(${rgb}, 0.18)` : "var(--surface-2)",
            color: bucket.isGoverning ? accent : "var(--text-faint)",
            border: `1px solid ${bucket.isGoverning ? `rgba(${rgb}, 0.3)` : "var(--border-2)"}`,
          }}>
            {idx + 1}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{label}</span>
              {bucket.isGoverning && (
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase",
                  background: `rgba(${rgb}, 0.18)`, color: accent,
                  padding: "2px 8px", borderRadius: 20,
                }}>
                  Governing constraint
                </span>
              )}
            </div>
            <p style={{ fontSize: 11, color: "var(--text-very-dim)", marginTop: 1 }}>{desc}</p>
          </div>
        </div>

        {/* Right: score + pass/fail count + chevron */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          {/* Pass/fail summary */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
            {failCount > 0 && (
              <span style={{ color: "#f87171", display: "flex", alignItems: "center", gap: 3 }}>
                <XCircle size={11} /> {failCount} issue{failCount !== 1 ? "s" : ""}
              </span>
            )}
            {passCount > 0 && (
              <span style={{ color: "#4ade80", display: "flex", alignItems: "center", gap: 3 }}>
                <CheckCircle2 size={11} /> {passCount} ok
              </span>
            )}
          </div>

          {/* Score */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color, letterSpacing: "-1px", lineHeight: 1 }}>
              {bucket.score}
            </div>
            <div style={{ fontSize: 9, fontWeight: 600, color, letterSpacing: "0.4px", textTransform: "uppercase" }}>
              {scoreLabel(bucket.score)}
            </div>
          </div>

          {open
            ? <ChevronDown size={15} style={{ color: "var(--text-faint)" }} />
            : <ChevronRight size={15} style={{ color: "var(--text-faint)" }} />}
        </div>
      </div>

      {/* Score bar */}
      <div style={{ height: 2, background: "var(--surface-2)", margin: "0 18px" }}>
        <div style={{
          height: "100%", width: `${bucket.score}%`,
          background: bucket.isGoverning ? accent : color,
          borderRadius: 2, transition: "width 0.5s ease",
        }} />
      </div>

      {/* Expanded: checks */}
      {open && (
        <div style={{ padding: "8px 18px 12px" }}>
          {checks.length === 0 ? (
            <p style={{ fontSize: 12, color: "var(--text-faint)", padding: "8px 0" }}>No checks defined for this bucket.</p>
          ) : (
            <>
              <p style={{ fontSize: 10, color: "var(--text-faint)", margin: "8px 0 4px", letterSpacing: "0.4px", textTransform: "uppercase", fontWeight: 600 }}>
                What we checked
              </p>
              {checks.map(check => (
                <CheckRow
                  key={check.id}
                  check={check}
                  triggeredSignal={findSignalForCheck(check.id, bucket.signals)}
                />
              ))}
              {/* Any signals not matched to a known check */}
              {bucket.signals
                .filter(sig => !checks.some(c => findSignalForCheck(c.id, [sig])))
                .map((sig, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 8,
                    padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 12,
                  }}>
                    <AlertTriangle size={13} style={{ color: "#fbbf24", marginTop: 1, flexShrink: 0 }} />
                    <span style={{ color: "var(--text-dim)" }}>{sig}</span>
                  </div>
                ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function ScoreBuckets({ buckets }: Props) {
  const ordered = BUCKET_ORDER.map(
    (b) => buckets.find((s) => s.bucket === b) ?? { bucket: b, score: 100, isGoverning: false, signals: [] }
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {ordered.map((bucket, idx) => (
        <BucketCard key={bucket.bucket} bucket={bucket} idx={idx} />
      ))}
    </div>
  );
}
