"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, XCircle, Sparkles, Loader2 } from "lucide-react";
import { BUCKET_LABELS, BUCKET_DESCRIPTIONS, BUCKET_ORDER } from "@/lib/engine/types";

// ─── Static check inventory ──────────────────────────────────────────────────

interface CheckDef {
  id: string;
  label: string;
  what: string;
  threshold: string;
}

const BUCKET_CHECKS: Record<string, CheckDef[]> = {
  MEASUREMENT: [
    { id: "conv_tracking",       label: "Conversion tracking active",     what: "Is at least one conversion action recording?",          threshold: "Must be active" },
    { id: "conv_actions_count",  label: "Conversion actions configured",  what: "How many distinct conversion actions exist?",           threshold: ">0 configured" },
    { id: "enhanced_conv",       label: "Enhanced conversions",           what: "Enhanced conversions improve modelling of missing data", threshold: "Must be enabled" },
    { id: "tag_coverage",        label: "Conversion data continuity",     what: "Recent 7-day conversion volume vs prior 3-week baseline — flags sudden drops that indicate tracking breakage",  threshold: "Recent volume ≥ 90% of baseline" },
    { id: "ga4_linked",          label: "GA4 linked",                     what: "Google Analytics 4 linked for audience + engagement",   threshold: "Must be linked" },
    { id: "date_lag",            label: "Attribution lag",                what: "Days delay before conversions appear in reporting",     threshold: "≤ 7 days" },
  ],
  TRAFFIC: [
    { id: "is_budget",    label: "Budget impression share loss", what: "% of auctions lost because daily budget ran out",        threshold: "< 30% lost" },
    { id: "is_rank",      label: "Rank impression share loss",   what: "% of auctions lost due to low bid or ad relevance",      threshold: "< 25% lost" },
    { id: "ctr",          label: "Click-through rate",           what: "Clicks ÷ impressions — proxy for ad relevance",          threshold: "≥ 2%" },
    { id: "feed_health",  label: "Product feed health",          what: "% of products disapproved in Merchant Center — disapproved products don't serve in Shopping or PMax", threshold: "< 5% disapproved" },
    { id: "irrel_queries",label: "Irrelevant query spend",       what: "Estimated % of budget on searches that won't convert",   threshold: "< 20% wasted" },
  ],
  CONVERSION: [
    { id: "cvr_benchmark",  label: "Conversion rate trend",        what: "Your CVR last 14 days vs your own 6-month average — flags real deterioration, not industry comparison",    threshold: "Within 7% of own baseline; or ≥ 60% of industry benchmark if no history" },
    { id: "mobile_speed",   label: "Mobile-friendly click rate",   what: "% of mobile clicks going to mobile-optimised URLs (from Google Ads API). Not a PageSpeed score — run PageSpeed Insights separately for speed.",  threshold: "≥ 70%" },
    { id: "landing_page",   label: "Landing page engagement",      what: "Average pages per session on landing pages (proxy for engagement depth)",  threshold: "Score ≥ 6 / 10" },
    { id: "bounce_rate",    label: "Bounce rate",                  what: "% of visitors who left without interaction — only available via GA4 linked to this account", threshold: "< 70% (requires GA4 data)" },
  ],
  FUNNEL: [
    { id: "cpl",            label: "Cost per lead vs target",     what: "Actual CPL vs your target — signals funnel efficiency",  threshold: "Within 10% of target" },
    { id: "lead_to_sale",   label: "Lead-to-sale rate",           what: "% of leads that eventually close as customers — requires CRM data via offline conversion import", threshold: "≥ 20% (only scored when CRM data available)" },
    { id: "lead_quality",   label: "Lead quality score",          what: "0–10 rating of whether leads match your ICP — requires CRM scoring integration",           threshold: "≥ 5 / 10 (only scored when CRM data available)" },
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
  signals: string[];
}

interface Props {
  buckets:   BucketData[];
  accountId: string;
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
  if (score >= 70) return "#4ade80";
  if (score >= 45) return "#fbbf24";
  return "#f87171";
}

function scoreLabel(score: number): string {
  if (score >= 70) return "Good";
  if (score >= 45) return "Issues";
  return "Critical";
}

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
  feed_health:        ["disapproved", "feed health"],
  irrel_queries:      ["irrelevant queries", "irrelevant query"],
  cvr_benchmark:      ["cvr", "conversion rate", "industry benchmark", "no conversions recorded"],
  mobile_speed:       ["mobile-friendly click rate", "mobile speed"],
  landing_page:       ["landing page engagement", "pages/session", "pages per session"],
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

// ─── AI Explanation ───────────────────────────────────────────────────────────

function AiExplanation({
  accountId, bucket, checkLabel, signal, threshold,
}: {
  accountId:  string;
  bucket:     string;
  checkLabel: string;
  signal:     string;
  threshold:  string;
}) {
  const [text, setText]       = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const generate = async () => {
    if (done || loading) return;
    setLoading(true);
    setText("");
    setError(null);

    try {
      const res = await fetch(`/api/accounts/${accountId}/explain-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucket, checkLabel, signal, threshold }),
      });
      if (!res.ok || !res.body) throw new Error("Failed to start stream");

      const reader = res.body.getReader();
      const dec    = new TextDecoder();

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        const lines = dec.decode(value).split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = JSON.parse(line.slice(6));
          if (payload.error) { setError(payload.error); break; }
          if (payload.done)  { setDone(true); break; }
          if (payload.text)  setText(prev => prev + payload.text);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!text && !loading && !error) {
    return (
      <button
        onClick={generate}
        style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.2)",
          borderRadius: 6, padding: "4px 10px",
          fontSize: 11, fontWeight: 500, color: "#c084fc",
          cursor: "pointer", marginTop: 6,
        }}
      >
        <Sparkles size={11} /> Why does this matter for this account?
      </button>
    );
  }

  return (
    <div style={{
      marginTop: 8,
      background: "rgba(192,132,252,0.05)",
      border: "1px solid rgba(192,132,252,0.15)",
      borderRadius: 8, padding: "10px 12px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <Sparkles size={10} style={{ color: "#c084fc" }} />
        <span style={{ fontSize: 10, fontWeight: 600, color: "#c084fc", letterSpacing: "0.4px", textTransform: "uppercase" }}>
          AI Context
        </span>
        {loading && <Loader2 size={10} className="animate-spin" style={{ color: "#c084fc" }} />}
      </div>
      {error ? (
        <span style={{ fontSize: 11, color: "#f87171" }}>{error}</span>
      ) : (
        <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.65, margin: 0 }}>
          {text}
          {loading && !done && <span style={{ opacity: 0.4 }}>▍</span>}
        </p>
      )}
    </div>
  );
}

// ─── Check Row ────────────────────────────────────────────────────────────────

function CheckRow({
  check, triggeredSignal, accountId, bucket,
}: {
  check:          CheckDef;
  triggeredSignal: string | undefined;
  accountId:      string;
  bucket:         string;
}) {
  const [showDetail, setShowDetail] = useState(false);
  const passed = !triggeredSignal;

  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <div
        style={{
          display: "grid", gridTemplateColumns: "20px 1fr", gap: 10,
          alignItems: "center", padding: "9px 0", cursor: "pointer",
        }}
        onClick={() => setShowDetail(v => !v)}
      >
        <div>
          {passed
            ? <CheckCircle2 size={14} style={{ color: "#4ade80" }} />
            : triggeredSignal?.toLowerCase().includes("room to improve") || triggeredSignal?.toLowerCase().includes("slightly") || triggeredSignal?.toLowerCase().includes("watch")
              ? <AlertTriangle size={14} style={{ color: "#fbbf24" }} />
              : <XCircle size={14} style={{ color: "#f87171" }} />}
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: passed ? "var(--text-muted)" : "var(--text-2)" }}>
            {check.label}
          </div>
          {!passed && (
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 1, lineHeight: 1.4 }}>
              {triggeredSignal}
            </div>
          )}
        </div>
      </div>

      {showDetail && (
        <div style={{ paddingBottom: 10, paddingLeft: 30 }}>
          {/* Static metadata */}
          <div style={{
            background: "var(--surface-2)", borderRadius: 6, padding: "8px 12px",
            fontSize: 11, color: "var(--text-dim)", lineHeight: 1.5,
          }}>
            <div><strong style={{ color: "var(--text-muted)" }}>What:</strong> {check.what}</div>
            <div><strong style={{ color: "var(--text-muted)" }}>Pass bar:</strong> {check.threshold}</div>
          </div>

          {/* AI explanation — only shown for failing checks */}
          {!passed && triggeredSignal && (
            <AiExplanation
              accountId={accountId}
              bucket={bucket}
              checkLabel={check.label}
              signal={triggeredSignal}
              threshold={check.threshold}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Bucket Card ─────────────────────────────────────────────────────────────

function BucketCard({ bucket, idx, accountId }: { bucket: BucketData; idx: number; accountId: string }) {
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
      {/* Header */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          padding: "14px 18px", cursor: "pointer",
        }}
        onClick={() => setOpen(v => !v)}
      >
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

        <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
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

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: color + "18", border: `1px solid ${color}40`,
            borderRadius: 20, padding: "5px 12px", flexShrink: 0,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color }}>{scoreLabel(bucket.score)}</span>
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

      {/* Expanded checks */}
      {open && (
        <div style={{ padding: "8px 18px 12px" }}>
          {checks.length === 0 ? (
            <p style={{ fontSize: 12, color: "var(--text-faint)", padding: "8px 0" }}>No checks defined.</p>
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
                  accountId={accountId}
                  bucket={bucket.bucket}
                />
              ))}
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

export function ScoreBuckets({ buckets, accountId }: Props) {
  const ordered = BUCKET_ORDER.map(
    (b) => buckets.find((s) => s.bucket === b) ?? { bucket: b, score: 100, isGoverning: false, signals: [] }
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {ordered.map((bucket, idx) => (
        <BucketCard key={bucket.bucket} bucket={bucket} idx={idx} accountId={accountId} />
      ))}
    </div>
  );
}
