"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, MessageSquare, ListChecks, BarChart2, Loader2 } from "lucide-react";
import { ScoreBuckets } from "@/components/ScoreBuckets";
import { ActionList } from "@/components/ActionList";
import { ChatAssistant } from "@/components/ChatAssistant";
import { BUCKET_LABELS } from "@/lib/engine/types";

type Tab = "overview" | "actions" | "chat";

interface Snapshot {
  id: string;
  createdAt: string;
  governingConstraint: string;
  constraintReason: string;
  scoreMeasurement: number;
  scoreTraffic: number;
  scoreConversion: number;
  scoreFunnel: number;
  scoreEconomics: number;
  actions: Action[];
}

interface Action {
  id: string;
  bucket: string;
  title: string;
  description: string;
  impact: string;
  effort: string;
  safeToAutomate: boolean;
  actionType: string;
  status: string;
  isEscalation: boolean;
}

interface Account {
  id: string;
  name: string;
  googleAdsId: string;
  industry: string | null;
  monthlyBudget: number | null;
  currency: string;
}

function buildBuckets(snap: Snapshot) {
  return [
    { bucket: "MEASUREMENT", score: snap.scoreMeasurement, isGoverning: snap.governingConstraint === "MEASUREMENT", signals: [] },
    { bucket: "TRAFFIC",     score: snap.scoreTraffic,     isGoverning: snap.governingConstraint === "TRAFFIC",     signals: [] },
    { bucket: "CONVERSION",  score: snap.scoreConversion,  isGoverning: snap.governingConstraint === "CONVERSION",  signals: [] },
    { bucket: "FUNNEL",      score: snap.scoreFunnel,      isGoverning: snap.governingConstraint === "FUNNEL",      signals: [] },
    { bucket: "ECONOMICS",   score: snap.scoreEconomics,   isGoverning: snap.governingConstraint === "ECONOMICS",   signals: [] },
  ];
}

const CONSTRAINT_ACCENT: Record<string, string> = {
  MEASUREMENT: "#c084fc",
  TRAFFIC:     "#60a5fa",
  CONVERSION:  "#fb923c",
  FUNNEL:      "#fbbf24",
  ECONOMICS:   "#4ade80",
};

const CONSTRAINT_GLOW: Record<string, string> = {
  MEASUREMENT: "rgba(192, 132, 252, 0.08)",
  TRAFFIC:     "rgba(96, 165, 250, 0.08)",
  CONVERSION:  "rgba(251, 146, 60, 0.08)",
  FUNNEL:      "rgba(251, 191, 36, 0.08)",
  ECONOMICS:   "rgba(74, 222, 128, 0.08)",
};

export default function AccountPage() {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [rescoring, setRescoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [acctRes, snapRes] = await Promise.all([
        fetch(`/api/accounts`),
        fetch(`/api/accounts/${id}/snapshot`),
      ]);
      if (!acctRes.ok) throw new Error("Failed to load account");
      const accounts: Account[] = await acctRes.json();
      const acct = accounts.find((a) => a.id === id);
      if (!acct) throw new Error("Account not found");
      setAccount(acct);
      if (snapRes.ok) {
        const snap: Snapshot = await snapRes.json();
        setSnapshot(snap);
        setActions(snap.actions ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const rescore = async () => {
    setRescoring(true);
    try {
      await fetch(`/api/accounts/${id}/snapshot?source=google-ads`, { method: "POST" });
      await load();
    } finally {
      setRescoring(false);
    }
  };

  const handleStatusChange = async (actionId: string, status: "APPROVED" | "DISMISSED") => {
    await fetch(`/api/actions/${actionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setActions((prev) => prev.map((a) => (a.id === actionId ? { ...a, status } : a)));
  };

  const handleExecute = async (actionId: string) => {
    const res = await fetch(`/api/actions/${actionId}`, { method: "POST" });
    if (res.ok) {
      const updated: Action = await res.json();
      setActions((prev) => prev.map((a) => (a.id === actionId ? updated : a)));
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a0a",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#444",
      }}>
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (error || !account) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0a0a0a",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
      }}>
        <p style={{ color: "#f87171", fontSize: 14 }}>{error ?? "Account not found"}</p>
        <Link href="/" style={{ color: "#3b82f6", fontSize: 13, textDecoration: "none" }}>← Back to overview</Link>
      </div>
    );
  }

  const buckets       = snapshot ? buildBuckets(snapshot) : [];
  const constraint    = snapshot?.governingConstraint ?? "MEASUREMENT";
  const label         = BUCKET_LABELS[constraint as keyof typeof BUCKET_LABELS] ?? constraint;
  const accent        = CONSTRAINT_ACCENT[constraint] ?? "#60a5fa";
  const glow          = CONSTRAINT_GLOW[constraint] ?? "rgba(96,165,250,0.08)";
  const pendingActions  = actions.filter((a) => a.status === "PENDING");
  const automatable     = pendingActions.filter((a) => a.safeToAutomate);

  const TABS: { key: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: "overview", label: "Overview",   icon: <BarChart2 size={14} /> },
    { key: "actions",  label: "Actions",    icon: <ListChecks size={14} />, badge: pendingActions.length },
    { key: "chat",     label: "AI Advisor", icon: <MessageSquare size={14} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f0f0f0" }}>

      {/* Top nav */}
      <header style={{
        borderBottom: "1px solid #1a1a1a", padding: "0 32px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0,
        background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)", zIndex: 10,
      }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 6,
          color: "#555", fontSize: 13, textDecoration: "none",
          transition: "color 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#aaa"}
        onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#555"}
        >
          <ArrowLeft size={14} />
          All accounts
        </Link>

        <button
          onClick={rescore}
          disabled={rescoring}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "transparent", border: "1px solid #222",
            borderRadius: 7, color: "#555", fontSize: 12, fontWeight: 500,
            padding: "6px 12px", cursor: rescoring ? "not-allowed" : "pointer",
            opacity: rescoring ? 0.5 : 1,
          }}
        >
          {rescoring ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
          {rescoring ? "Scoring…" : "Rescore"}
        </button>
      </header>

      {/* Constraint hero */}
      {snapshot && (
        <div style={{
          padding: "32px 32px 28px",
          background: glow,
          borderBottom: "1px solid #1a1a1a",
        }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
              <div>
                <div style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>{account.name} · {account.googleAdsId}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: "#f0f0f0" }}>
                    Governing Constraint
                  </h1>
                  <span style={{
                    fontSize: 12, fontWeight: 600, letterSpacing: "0.4px",
                    background: `rgba(${accent.slice(1).match(/../g)!.map(h => parseInt(h, 16)).join(",")}, 0.15)`,
                    color: accent,
                    padding: "3px 10px", borderRadius: 20,
                  }}>
                    {label}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#777", maxWidth: 560, lineHeight: 1.6 }}>
                  {snapshot.constraintReason}
                </p>
              </div>

              {automatable.length > 0 && (
                <div style={{
                  flexShrink: 0,
                  background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                  borderRadius: 10, padding: "10px 16px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#60a5fa" }}>{automatable.length}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>ready to run</div>
                </div>
              )}
            </div>

            <div style={{ fontSize: 11, color: "#333", marginTop: 12 }}>
              Last scored {new Date(snapshot.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "0 32px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", gap: 0 }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "14px 16px", fontSize: 13, fontWeight: 500,
                borderTop: "none", borderLeft: "none", borderRight: "none",
                borderBottom: `2px solid ${tab === t.key ? accent : "transparent"}`,
                color: tab === t.key ? "#e8e8e8" : "#555",
                background: "transparent",
                cursor: "pointer", transition: "color 0.15s",
                marginBottom: -1,
              }}
            >
              {t.icon}
              {t.label}
              {t.badge !== undefined && t.badge > 0 && (
                <span style={{
                  background: "rgba(59,130,246,0.15)", color: "#60a5fa",
                  borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 700,
                }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 32px" }}>

        {tab === "overview" && (
          <>
            {!snapshot ? (
              <div style={{
                border: "1px dashed #222", borderRadius: 14,
                padding: "60px 32px", textAlign: "center", color: "#444", fontSize: 13,
              }}>
                No score yet — click Rescore above to pull live data.
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "#444" }}>
                    Bucket health
                  </span>
                </div>
                <ScoreBuckets buckets={buckets} />

                <div style={{
                  background: "#111", border: "1px solid #1e1e1e", borderRadius: 12,
                  padding: "20px 22px", marginTop: 20,
                }}>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>
                    <strong style={{ color: "#888" }}>{label}</strong> is your governing constraint —
                    the single bottleneck blocking growth. Fix this before anything downstream.
                    Go to the <strong style={{ color: "#888" }}>Actions</strong> tab for prioritized moves,
                    or use the <strong style={{ color: "#888" }}>AI Advisor</strong> to think it through.
                  </p>
                </div>
              </>
            )}
          </>
        )}

        {tab === "actions" && (
          <>
            <div style={{ marginBottom: 18, display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "#444" }}>
                Recommended actions
              </span>
              <span style={{ fontSize: 11, color: "#333" }}>
                Governing constraint first · ⚡ = safe to automate · ⚠ = requires client
              </span>
            </div>
            <ActionList
              actions={actions}
              onStatusChange={handleStatusChange}
              onExecute={handleExecute}
            />
          </>
        )}

        {tab === "chat" && snapshot && (
          <div style={{
            height: 580, borderRadius: 14, border: "1px solid #1a1a1a",
            background: "#0f0f0f", overflow: "hidden",
          }}>
            <ChatAssistant
              accountId={id}
              constraintBucket={label}
              constraintReason={snapshot.constraintReason}
            />
          </div>
        )}

        {tab === "chat" && !snapshot && (
          <div style={{
            border: "1px dashed #222", borderRadius: 14,
            padding: "60px 32px", textAlign: "center", color: "#444", fontSize: 13,
          }}>
            Run a constraint score first to unlock the advisor.
          </div>
        )}
      </div>
    </div>
  );
}
