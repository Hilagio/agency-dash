"use client";

/**
 * Diagnostic workspace (BUILD-SPEC §9) — the landing page for a flagged account.
 *
 * Value-first, never a chore (§5): it leads with one honest headline, shows the
 * numbers, shows *what it already checked*, and hands the specialist the
 * questions to ask. It never names a cause (§9) — that boundary is printed on
 * the page. From here you can jump to the full analysis if you want to dig.
 */
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowUpRight, Loader2, CheckCircle2, AlertTriangle, HelpCircle,
  ShieldCheck, Sprout, XCircle, MinusCircle, TrendingUp,
} from "lucide-react";

type Status = "green" | "yellow" | "red";
interface Fact { label: string; value: string; context?: string; tone: "bad" | "warn" | "good" | "neutral"; }
interface Observation { key: string; text: string; }
interface CheckRun { label: string; result: "ruled_out" | "flagged" | "not_available"; detail: string; }
interface Question { text: string; because: string; }
interface Diagnosis {
  accountId: string; name: string; clientName?: string | null;
  status: Status; dataVerified: boolean; computedAt: string;
  headline: string; unverifiedNote?: string;
  facts: Fact[]; observations: Observation[]; checksRun: CheckRun[];
  questions: Question[]; opportunities: { text: string }[]; boundary: string;
}

const STATUS_COLOR: Record<Status, string> = { green: "var(--accent)", yellow: "var(--accent-2)", red: "var(--danger)" };
const STATUS_LABEL: Record<Status, string> = { green: "Under control", yellow: "Action needed", red: "Immediate action" };
const TONE_COLOR: Record<Fact["tone"], string> = { bad: "var(--danger)", warn: "var(--accent-2)", good: "var(--accent)", neutral: "var(--text)" };

const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16 };
const eyebrow: React.CSSProperties = { fontSize: 11, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 };

function CheckIcon({ result }: { result: CheckRun["result"] }) {
  if (result === "ruled_out") return <CheckCircle2 size={16} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }} />;
  if (result === "flagged") return <XCircle size={16} style={{ color: "var(--danger)", flexShrink: 0, marginTop: 1 }} />;
  return <MinusCircle size={16} style={{ color: "var(--text-dim)", flexShrink: 0, marginTop: 1 }} />;
}

export default function DiagnosePage() {
  const { id } = useParams<{ id: string }>();
  const [diag, setDiag] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/diagnostics/account/${id}`, { credentials: "include" });
        if (!r.ok) { setError(true); setLoading(false); return; }
        const j = await r.json();
        setDiag(j.diagnosis);
      } catch { setError(true); }
      setLoading(false);
    })();
  }, [id]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{
        display: "flex", alignItems: "center", gap: 16, height: 58, padding: "0 26px",
        position: "sticky", top: 0, zIndex: 9, background: "var(--header-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-3)", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
          <ArrowLeft size={15} /> Today
        </Link>
        <div style={{ marginLeft: "auto" }}>
          <Link href={`/accounts/${id}`} style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, textDecoration: "none",
            color: "var(--text-3)", border: "1px solid var(--border-2)", background: "var(--surface)", padding: "7px 13px", borderRadius: 8,
          }}>
            Full account analysis <ArrowUpRight size={13} />
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "26px 26px 90px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
            <Loader2 size={22} className="animate-spin" style={{ color: "var(--text-dim)" }} />
          </div>
        ) : error || !diag ? (
          <div style={{ ...card, padding: "48px 28px", textAlign: "center", color: "var(--text-muted)" }}>
            <AlertTriangle size={26} style={{ color: "var(--accent-2)", marginBottom: 10 }} />
            <div style={{ fontWeight: 600, color: "var(--text-2)" }}>Couldn&rsquo;t load this diagnosis</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>The account may not be in the pilot yet, or has no data ingested.</div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <span style={{
                fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap",
                color: STATUS_COLOR[diag.status], background: "color-mix(in srgb, currentColor 14%, transparent)",
                display: "inline-flex", alignItems: "center", gap: 7,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[diag.status] }} />
                {STATUS_LABEL[diag.status]}
              </span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                assessed {new Date(diag.computedAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.8px", margin: "2px 0 2px" }}>
              {diag.name}{diag.clientName ? <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 18 }}> · {diag.clientName}</span> : null}
            </h1>

            {/* Headline */}
            <div style={{
              ...card, border: `1px solid ${diag.status === "green" ? "var(--border)" : "var(--border-2)"}`,
              padding: "20px 22px", marginTop: 16,
              background: diag.status === "green"
                ? "linear-gradient(160deg, var(--accent-dim), transparent), var(--surface)"
                : `linear-gradient(160deg, color-mix(in srgb, ${STATUS_COLOR[diag.status]} 10%, transparent), transparent), var(--surface)`,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                {diag.status === "green"
                  ? <Sprout size={22} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
                  : <AlertTriangle size={22} style={{ color: STATUS_COLOR[diag.status], flexShrink: 0, marginTop: 2 }} />}
                <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.4 }}>{diag.headline}</div>
              </div>
            </div>

            {/* §4.9 unverified banner */}
            {diag.unverifiedNote && (
              <div style={{
                marginTop: 12, padding: "11px 15px", borderRadius: 12, fontSize: 12.5,
                color: "var(--text-3)", background: "var(--surface-2)", border: "1px dashed var(--border-2)",
                display: "flex", alignItems: "center", gap: 9,
              }}>
                <ShieldCheck size={15} style={{ color: "var(--text-dim)", flexShrink: 0 }} /> {diag.unverifiedNote}
              </div>
            )}

            {/* Facts */}
            {diag.facts.length > 0 && (
              <>
                <SectionTitle>The numbers</SectionTitle>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
                  {diag.facts.map((f, i) => (
                    <div key={i} style={{ ...card, padding: "13px 15px" }}>
                      <div style={{ ...eyebrow, marginBottom: 6 }}>{f.label}</div>
                      <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-0.6px", color: TONE_COLOR[f.tone] }}>{f.value}</div>
                      {f.context && <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 3 }}>{f.context}</div>}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Observations */}
            {diag.observations.length > 0 && (
              <>
                <SectionTitle>What I&rsquo;m seeing</SectionTitle>
                <div style={{ ...card, padding: "6px 4px" }}>
                  {diag.observations.map((o, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, padding: "11px 16px", borderBottom: i < diag.observations.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-dim)", flexShrink: 0, marginTop: 7 }} />
                      <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--text-2)" }}>{o.text}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Checks already run — §5, show the work */}
            {diag.checksRun.length > 0 && (
              <>
                <SectionTitle>What I already checked</SectionTitle>
                <div style={{ ...card, padding: "6px 4px" }}>
                  {diag.checksRun.map((c, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, padding: "12px 16px", borderBottom: i < diag.checksRun.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <CheckIcon result={c.result} />
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.label}</div>
                        <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 2, lineHeight: 1.45 }}>{c.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Questions for the specialist — §9, the heart of it */}
            {diag.questions.length > 0 && (
              <>
                <SectionTitle>Questions for you to ask</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {diag.questions.map((q, i) => (
                    <div key={i} style={{ ...card, border: "1px solid var(--border-2)", padding: "15px 17px" }}>
                      <div style={{ display: "flex", gap: 11 }}>
                        <HelpCircle size={18} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }} />
                        <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.45 }}>{q.text}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 7, paddingLeft: 29 }}>Because: {q.because}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Opportunities — §5A, bring a win */}
            {diag.opportunities.length > 0 && (
              <>
                <SectionTitle>Worth a look — a win, not a fire</SectionTitle>
                <div style={{ ...card, padding: "6px 4px" }}>
                  {diag.opportunities.map((o, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, padding: "12px 16px", borderBottom: i < diag.opportunities.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <TrendingUp size={16} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--text-2)" }}>{o.text}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* §9 boundary — always visible */}
            <div style={{
              marginTop: 28, padding: "14px 18px", borderRadius: 12, textAlign: "center",
              fontSize: 12.5, fontStyle: "italic", color: "var(--text-muted)",
              background: "var(--surface-2)", border: "1px solid var(--border)",
            }}>
              {diag.boundary}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)", margin: "26px 4px 11px", letterSpacing: "-0.2px" }}>{children}</h2>;
}
