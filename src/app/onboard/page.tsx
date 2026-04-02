"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Building2, Zap } from "lucide-react";

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep]       = useState<"org" | "ads">("org");
  const [orgName, setOrgName] = useState("");
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [orgCreated, setOrgCreated] = useState(false);

  const createOrg = async () => {
    if (!orgName.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: orgName.trim() }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Failed to create organization");
      }
      setOrgCreated(true);
      setStep("ads");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 480 }}>

        {/* Progress */}
        <div style={{ display: "flex", gap: 8, marginBottom: 40, justifyContent: "center" }}>
          {["Name your agency", "Connect Google Ads"].map((label, i) => {
            const active  = (i === 0 && step === "org") || (i === 1 && step === "ads");
            const done    = (i === 0 && step === "ads");
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", fontSize: 11, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: done ? "#4ade80" : active ? "var(--btn-primary)" : "var(--surface)",
                    border: `2px solid ${done ? "#4ade80" : active ? "var(--btn-primary)" : "var(--border-2)"}`,
                    color: done || active ? "#fff" : "var(--text-faint)",
                  }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 12, color: active ? "var(--text)" : "var(--text-faint)", fontWeight: active ? 600 : 400 }}>
                    {label}
                  </span>
                </div>
                {i < 1 && <div style={{ width: 32, height: 1, background: "var(--border-2)" }} />}
              </div>
            );
          })}
        </div>

        {/* Step 1: Name */}
        {step === "org" && (
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 16, padding: "32px 28px",
          }}>
            <Building2 size={24} style={{ color: "#60a5fa", marginBottom: 16 }} />
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.5px" }}>
              What's your agency called?
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 24, lineHeight: 1.6 }}>
              This creates your workspace. You can invite your team next.
            </p>

            <input
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && createOrg()}
              placeholder="e.g. Acme Digital Agency"
              autoFocus
              style={{
                width: "100%", padding: "12px 14px", marginBottom: 12,
                background: "var(--bg)", border: "1px solid var(--border-2)",
                borderRadius: 10, color: "var(--text)", fontSize: 15, outline: "none",
                boxSizing: "border-box", fontFamily: "inherit",
              }}
            />

            {error && (
              <p style={{ fontSize: 12, color: "#ef4444", marginBottom: 12 }}>{error}</p>
            )}

            <button
              onClick={createOrg}
              disabled={saving || !orgName.trim()}
              style={{
                width: "100%", padding: "12px", borderRadius: 10,
                background: saving || !orgName.trim() ? "var(--surface-2)" : "var(--btn-primary)",
                border: "none", color: saving || !orgName.trim() ? "var(--text-faint)" : "#fff",
                fontSize: 14, fontWeight: 600, cursor: saving || !orgName.trim() ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {saving ? <><Loader2 size={14} className="animate-spin" /> Creating…</> : "Continue →"}
            </button>
          </div>
        )}

        {/* Step 2: Connect Google Ads */}
        {step === "ads" && (
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 16, padding: "32px 28px",
          }}>
            <Zap size={24} style={{ color: "#fbbf24", marginBottom: 16 }} />
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.5px" }}>
              Connect your Google Ads MCC
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 24, lineHeight: 1.6 }}>
              Grant access to your Manager (MCC) account so we can pull account data and run scoring.
              You'll only need to do this once.
            </p>

            <div style={{
              background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)",
              borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6,
            }}>
              <strong style={{ color: "var(--text-2)" }}>What access we request:</strong><br />
              Read-only access to campaign data, performance metrics, and search terms.
              We never make changes to your campaigns without explicit approval.
            </div>

            <a
              href="/api/auth/google-ads"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                width: "100%", padding: "12px", borderRadius: 10,
                background: "var(--btn-primary)", border: "none", color: "#fff",
                fontSize: 14, fontWeight: 600, textDecoration: "none",
                boxSizing: "border-box",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Connect Google Ads MCC
            </a>

            <button
              onClick={() => router.push("/")}
              style={{
                width: "100%", padding: "10px", marginTop: 10, borderRadius: 10,
                background: "transparent", border: "1px solid var(--border-2)",
                color: "var(--text-dim)", fontSize: 13, cursor: "pointer",
              }}
            >
              Skip for now — I'll connect later
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
