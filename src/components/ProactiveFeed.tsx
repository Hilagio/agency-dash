"use client";

import { useMemo } from "react";
import { AlertTriangle, XCircle, TrendingUp, Zap, Eye, Target, DollarSign, BarChart2, ArrowRight } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Severity = "critical" | "high" | "medium";
type Bucket = "MEASUREMENT" | "TRAFFIC" | "CONVERSION" | "FUNNEL" | "ECONOMICS";

export interface FeedItem {
  id: string;
  severity: Severity;
  bucket: Bucket;
  title: string;
  body: string;
  action?: {
    label: string;
    tab?: string;
  };
  kbRef?: string;
}

interface BucketSignals {
  bucket: string;
  score: number;
  signals: string[];
  isGoverning: boolean;
}

interface Props {
  buckets: BucketSignals[];
  onNavigate: (tab: string) => void;
}

// ─── Signal → FeedItem mapping ────────────────────────────────────────────────
// Maps signal text patterns to structured items with severity, action, KB ref.
// Critical = account is flying blind or losing money structurally
// High = significant performance impact, needs immediate attention
// Medium = real issue, can wait 1-2 days

const SIGNAL_RULES: {
  pattern: RegExp;
  severity: Severity;
  mkTitle: (match: RegExpMatchArray, signal: string) => string;
  mkBody: (match: RegExpMatchArray, signal: string) => string;
  action?: { label: string; tab?: string };
  kbRef?: string;
}[] = [
  // MEASUREMENT — critical
  {
    pattern: /no active conversion tracking/i,
    severity: "critical",
    mkTitle: () => "Conversion tracking is off",
    mkBody: () => "All optimization is blind. Smart Bidding is learning from zero signal. Every euro spent cannot be attributed.",
    action: { label: "Fix tracking", tab: "chat" },
    kbRef: "Account Health Checklist",
  },
  {
    pattern: /zero conversion actions/i,
    severity: "critical",
    mkTitle: () => "No conversion actions configured",
    mkBody: () => "Nothing is being measured. Set up at least one primary conversion action before running any campaigns.",
    action: { label: "Set up tracking", tab: "chat" },
    kbRef: "Conversion Tracking Setup Checklist",
  },
  {
    pattern: /conversion data dropped (\d+)%.*tracking breakage/i,
    severity: "critical",
    mkTitle: (m) => `Conversion volume dropped ${m[1]}% — tracking likely broken`,
    mkBody: (_, signal) => signal,
    action: { label: "Diagnose", tab: "chat" },
    kbRef: "Account Health Checklist",
  },
  {
    pattern: /enhanced conversions enabled but conversion volume dropped/i,
    severity: "critical",
    mkTitle: () => "Enhanced conversions degraded",
    mkBody: () => "EC is enabled but conversion volume dropped ≥40% vs baseline. EC tag is likely broken.",
    action: { label: "Check EC", tab: "chat" },
    kbRef: "Conversion Tracking Setup Checklist",
  },
  // MEASUREMENT — high
  {
    pattern: /conversion volume (\d+)% below.*baseline/i,
    severity: "high",
    mkTitle: (m) => `Conversions down ${m[1]}% vs recent baseline`,
    mkBody: (_, signal) => signal,
    action: { label: "Investigate", tab: "chat" },
  },
  {
    pattern: /enhanced conversions not enabled/i,
    severity: "high",
    mkTitle: () => "Enhanced conversions not enabled",
    mkBody: () => "You're losing 15-40% of conversion signal. Enable EC to improve Smart Bidding accuracy and match rate.",
    action: { label: "Enable EC", tab: "chat" },
    kbRef: "Conversion Tracking Setup Checklist",
  },
  {
    pattern: /attribution lag (\d+)d/i,
    severity: "medium",
    mkTitle: (m) => `Attribution lag: ${m[1]} days`,
    mkBody: () => "Recent reporting data is unreliable. Decisions made in the last few days are based on incomplete conversions.",
  },
  // TRAFFIC — critical
  {
    pattern: /profitable.*budget limited.*missed opportunity/i,
    severity: "critical",
    mkTitle: () => "Profitable campaigns capped by budget",
    mkBody: () => "Best-performing campaigns are below target CPA/ROAS but losing impression share to budget. You're leaving money on the table.",
    action: { label: "Review budgets", tab: "explorer" },
    kbRef: "Diagnostic Thresholds Reference",
  },
  // TRAFFIC — high
  {
    // "72% impression share lost to budget — Search/Shopping campaigns are underfunded"
    pattern: /(\d+)% impression share lost to budget/i,
    severity: "high",
    mkTitle: (m) => `${m[1]}% impression share lost to budget`,
    mkBody: (_, signal) => signal,
    action: { label: "Review budgets", tab: "explorer" },
    kbRef: "Diagnostic Thresholds Reference",
  },
  {
    // "45% of PMax spend going to Display/YouTube — feed-only campaigns shouldn't serve here..."
    pattern: /(\d+)% of PMax spend going to Display\/YouTube/i,
    severity: "high",
    mkTitle: (m) => `${m[1]}% of PMax budget on Display/YouTube`,
    mkBody: () => "Feed-only PMax campaigns shouldn't serve here. Google is broadening beyond the product feed — likely wasting budget on low-intent inventory.",
    action: { label: "Check PMax", tab: "search-terms" },
    kbRef: "Diagnostic Thresholds Reference",
  },
  {
    // "18% of products disapproved in Merchant Center — feed health issues reducing reach"
    // "18% of products disapproved — fix feed issues to improve reach"
    pattern: /(\d+)% of products disapproved/i,
    severity: "high",
    mkTitle: (m) => `${m[1]}% of products disapproved`,
    mkBody: () => "Disapproved products don't serve in Shopping or PMax. Fix feed errors in Merchant Center to restore coverage.",
    action: { label: "Check products", tab: "products" },
    kbRef: "Account Health Checklist",
  },
  {
    // "~28% of query spend has no conversion history — review search terms report for clear irrelevancies"
    pattern: /~?(\d+)% of query spend has no conversion history/i,
    severity: "high",
    mkTitle: (m) => `${m[1]}% of spend on non-converting search terms`,
    mkBody: () => "A significant portion of budget is going to searches with no conversion history. Review search terms and add negatives.",
    action: { label: "Review terms", tab: "search-terms" },
    kbRef: "Diagnostic Thresholds Reference",
  },
  {
    // "55% IS lost to rank with QS 4.2/10 — rank loss is bid competitiveness..."
    // "55% impression share lost to rank — review keyword bids..."
    // "55% impression share lost to rank — check feed title quality..."
    pattern: /(\d+)%\s+(?:impression share|IS) lost to rank/i,
    severity: "medium",
    mkTitle: (m) => `${m[1]}% impression share lost to rank`,
    mkBody: (_, signal) => signal,
    action: { label: "Review ads & bids", tab: "ads" },
    kbRef: "Diagnostic Thresholds Reference",
  },
  {
    // "CTR down 55% vs 6-month average — review ad copy and keyword match types"
    // "CTR down 55% vs 6-month average with QS 8.1/10 — ad quality is not the issue..."
    pattern: /CTR down (\d+)% vs 6-month average/i,
    severity: "medium",
    mkTitle: (m) => `CTR down ${m[1]}% vs 6-month average`,
    mkBody: (_, signal) => signal,
    action: { label: "Improve ads", tab: "ads" },
  },
  {
    // "18% of PMax spend on Display/YouTube — monitor; feed-only campaigns ideally stay in Shopping/Search"
    pattern: /(\d+)% of PMax spend on Display\/YouTube — monitor/i,
    severity: "medium",
    mkTitle: (m) => `${m[1]}% of PMax on Display/YouTube — monitor`,
    mkBody: () => "Within acceptable range but trending toward Display spend. Monitor weekly.",
    action: { label: "Check PMax", tab: "search-terms" },
  },
  // CONVERSION — high
  {
    // "No conversions recorded in the last 14 days — conversion has stopped"
    pattern: /No conversions recorded in the last 14 days/i,
    severity: "critical",
    mkTitle: () => "Zero conversions in last 14 days",
    mkBody: () => "Conversion has stopped completely. Check tracking first, then landing pages, then campaign targeting.",
    action: { label: "Diagnose", tab: "chat" },
    kbRef: "Account Health Checklist",
  },
  {
    // "CVR 1.2% vs 2.8% baseline (57% below) — check for landing page changes"
    // "Conversion rate 1.2% is 57% below your 6-month average..."
    pattern: /CVR.*below.*6-month|Conversion rate.*below.*baseline/i,
    severity: "high",
    mkTitle: () => "CVR dropped below 6-month baseline",
    mkBody: (_, signal) => signal,
    action: { label: "Check landing pages", tab: "chat" },
    kbRef: "Account Health Checklist",
  },
  {
    // "Mobile-friendly click rate 42% — many mobile visitors reach non-mobile-optimised pages"
    pattern: /Mobile-friendly click rate (\d+)%/i,
    severity: "medium",
    mkTitle: (m) => `Mobile-friendly click rate: ${m[1]}%`,
    mkBody: (_, signal) => signal,
    action: { label: "Check mobile UX", tab: "chat" },
  },
  // ECONOMICS — critical
  {
    // "Below break-even ROAS (3.1x needed at 32% margin)"
    pattern: /Below break-even ROAS/i,
    severity: "critical",
    mkTitle: () => "ROAS is below break-even — losing money on every sale",
    mkBody: (_, signal) => signal,
    action: { label: "Review economics", tab: "chat" },
    kbRef: "Diagnostic Thresholds Reference",
  },
  // ECONOMICS — high
  {
    // "ROAS 2.1x vs target 4.0x — significantly below target"
    pattern: /ROAS ([\d.]+)x vs target ([\d.]+)x/i,
    severity: "high",
    mkTitle: (m) => `ROAS ${m[1]}× vs target ${m[2]}× — below target`,
    mkBody: (_, signal) => signal,
    action: { label: "Review bidding", tab: "chat" },
  },
  {
    // "CPA 42 is 38% over target"
    pattern: /CPA [\d.]+ is (\d+)% over target/i,
    severity: "high",
    mkTitle: (m) => `CPA ${m[1]}% over target`,
    mkBody: (_, signal) => signal,
    action: { label: "Review bidding", tab: "chat" },
  },
  {
    // "Only 42% of budget used — campaigns may be over-restricted"
    pattern: /Only (\d+)% of budget used.*over-restricted/i,
    severity: "high",
    mkTitle: (m) => `Only ${m[1]}% of budget spent — campaigns over-constrained`,
    mkBody: () => "Significant budget is going unspent. Review ROAS targets, bid strategies, and budget caps to free up reach.",
    action: { label: "Review bidding", tab: "explorer" },
  },
  // FUNNEL — high
  {
    // "Offline conversion import not active — Google optimizes for leads, not sales"
    pattern: /Offline conversion import not active/i,
    severity: "high",
    mkTitle: () => "Offline conversion import not set up",
    mkBody: () => "Smart Bidding optimizes for form fills, not revenue. Import closed deals to train bidding on actual customer value.",
    action: { label: "Set up OCT", tab: "chat" },
    kbRef: "Conversion Tracking Setup Checklist",
  },
  {
    // "CPL 142 is 88% above target — funnel economics broken"
    pattern: /CPL [\d.]+ is (\d+)% above target/i,
    severity: "high",
    mkTitle: (m) => `CPL ${m[1]}% above target`,
    mkBody: (_, signal) => signal,
    action: { label: "Review funnel", tab: "chat" },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BUCKET_ICONS: Record<Bucket, any> = {
  MEASUREMENT: <Eye size={13} />,
  TRAFFIC:     <TrendingUp size={13} />,
  CONVERSION:  <Target size={13} />,
  FUNNEL:      <BarChart2 size={13} />,
  ECONOMICS:   <DollarSign size={13} />,
};

const BUCKET_COLORS: Record<Bucket, string> = {
  MEASUREMENT: "#c084fc",
  TRAFFIC:     "#60a5fa",
  CONVERSION:  "#fb923c",
  FUNNEL:      "#fbbf24",
  ECONOMICS:   "#4ade80",
};

const BUCKET_LABELS: Record<Bucket, string> = {
  MEASUREMENT: "Measurement",
  TRAFFIC:     "Traffic",
  CONVERSION:  "Conversion",
  FUNNEL:      "Funnel",
  ECONOMICS:   "Economics",
};

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bg: string; border: string }> = {
  critical: { label: "Critical",  color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.25)" },
  high:     { label: "High",      color: "#fb923c", bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.25)"  },
  medium:   { label: "Medium",    color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.2)"   },
};

function signalToFeedItem(signal: string, bucket: Bucket, _score: number): FeedItem | null {
  for (const rule of SIGNAL_RULES) {
    const m = signal.match(rule.pattern);
    if (m) {
      return {
        id: `${bucket}-${rule.pattern.source.slice(0, 20)}`,
        severity: rule.severity,
        bucket,
        title: rule.mkTitle(m, signal),
        body: rule.mkBody(m, signal),
        action: rule.action,
        kbRef: rule.kbRef,
      };
    }
  }
  // Fallback: unmatched signal becomes a medium item
  if (signal.trim()) {
    return {
      id: `${bucket}-${signal.slice(0, 30)}`,
      severity: "medium",
      bucket,
      title: signal.length > 80 ? signal.slice(0, 77) + "…" : signal,
      body: signal,
    };
  }
  return null;
}

const SEV_ORDER: Severity[] = ["critical", "high", "medium"];

// ─── Component ────────────────────────────────────────────────────────────────

export function ProactiveFeed({ buckets, onNavigate }: Props) {
  const items = useMemo(() => {
    const all: FeedItem[] = [];
    const seen = new Set<string>();

    for (const b of buckets) {
      for (const signal of b.signals) {
        const item = signalToFeedItem(signal, b.bucket as Bucket, b.score);
        if (item && !seen.has(item.id)) {
          seen.add(item.id);
          all.push(item);
        }
      }
    }

    return all.sort((a, b) => SEV_ORDER.indexOf(a.severity) - SEV_ORDER.indexOf(b.severity));
  }, [buckets]);

  if (items.length === 0) {
    return (
      <div style={{
        border: "1px solid rgba(74,222,128,0.2)",
        borderRadius: 12,
        padding: "20px 22px",
        background: "rgba(74,222,128,0.04)",
        display: "flex", alignItems: "center", gap: 14,
        marginBottom: 24,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(74,222,128,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={16} style={{ color: "#4ade80" }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#4ade80" }}>Account looks healthy</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>No critical issues detected across all five buckets.</div>
        </div>
      </div>
    );
  }

  const criticalCount = items.filter(i => i.severity === "critical").length;
  const highCount = items.filter(i => i.severity === "high").length;

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Zap size={14} style={{ color: "var(--accent)" }} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Diagnostic feed
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {criticalCount > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.4px",
                background: "rgba(248,113,113,0.12)", color: "#f87171",
                padding: "2px 8px", borderRadius: 20, border: "1px solid rgba(248,113,113,0.2)",
              }}>
                {criticalCount} critical
              </span>
            )}
            {highCount > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.4px",
                background: "rgba(251,146,60,0.1)", color: "#fb923c",
                padding: "2px 8px", borderRadius: 20, border: "1px solid rgba(251,146,60,0.2)",
              }}>
                {highCount} high
              </span>
            )}
          </div>
        </div>
        <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
          {items.length} issue{items.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map(item => (
          <FeedCard key={item.id} item={item} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

function FeedCard({ item, onNavigate }: { item: FeedItem; onNavigate: (tab: string) => void }) {
  const sev = SEVERITY_CONFIG[item.severity];
  const bucketColor = BUCKET_COLORS[item.bucket];
  const bucketLabel = BUCKET_LABELS[item.bucket];
  const bucketIcon  = BUCKET_ICONS[item.bucket];

  return (
    <div style={{
      border: `1px solid ${sev.border}`,
      borderLeft: `3px solid ${sev.color}`,
      borderRadius: 10,
      padding: "13px 16px",
      background: sev.bg,
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: 12,
      alignItems: "start",
    }}>
      {/* Left: content */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          {/* Severity icon */}
          {item.severity === "critical"
            ? <XCircle size={13} style={{ color: sev.color, flexShrink: 0 }} />
            : <AlertTriangle size={13} style={{ color: sev.color, flexShrink: 0 }} />}

          {/* Severity label */}
          <span style={{ fontSize: 10, fontWeight: 700, color: sev.color, letterSpacing: "0.4px", textTransform: "uppercase" }}>
            {sev.label}
          </span>

          {/* Separator */}
          <span style={{ color: "var(--text-very-dim)", fontSize: 10 }}>·</span>

          {/* Bucket */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 10, fontWeight: 500, color: bucketColor,
          }}>
            {bucketIcon} {bucketLabel}
          </span>

          {/* KB ref */}
          {item.kbRef && (
            <>
              <span style={{ color: "var(--text-very-dim)", fontSize: 10 }}>·</span>
              <span style={{ fontSize: 10, color: "var(--text-faint)", fontStyle: "italic" }}>{item.kbRef}</span>
            </>
          )}
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", lineHeight: 1.4, marginBottom: item.body !== item.title ? 4 : 0 }}>
          {item.title}
        </div>

        {item.body !== item.title && (
          <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.55 }}>
            {item.body}
          </div>
        )}
      </div>

      {/* Right: action */}
      {item.action && (
        <button
          onClick={() => item.action?.tab && onNavigate(item.action.tab)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "var(--surface-2)", border: "1px solid var(--border-2)",
            borderRadius: 7, padding: "6px 11px",
            fontSize: 11, fontWeight: 500, color: "var(--text-2)",
            cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-3)")}
          onMouseLeave={e => (e.currentTarget.style.background = "var(--surface-2)")}
        >
          {item.action.label} <ArrowRight size={11} />
        </button>
      )}
    </div>
  );
}
