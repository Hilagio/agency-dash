"use client";

import { useEffect, useState, use } from "react";
import { ChevronRight, Check, Loader2 } from "lucide-react";

const GOLD   = "#F5C518";
const BG     = "#1a1a1a";
const CARD   = "#242424";
const TEXT   = "#f0f0f0";
const MUTED  = "#999";
const BORDER = "#333";

interface FormData {
  businessName:        string;
  websiteUrl:          string;
  uniqueSellingPoints: string;
  monthlyBudget:       string;
  targetRoas:          string;
  targetLocations:     string;
  cookieBanner:        string;
  conversionTracking:  string;
  productHeroPro:      boolean | null;
  specialPromotions:   boolean | null;
  specialPromotionsDetail: string;
  reportEmail:         string;
  tosAccepted:         boolean;
}

const INITIAL: FormData = {
  businessName: "", websiteUrl: "", uniqueSellingPoints: "",
  monthlyBudget: "", targetRoas: "", targetLocations: "",
  cookieBanner: "", conversionTracking: "",
  productHeroPro: null, specialPromotions: null, specialPromotionsDetail: "",
  reportEmail: "", tosAccepted: false,
};

// Each step: { key(s), question, hint, type }
type StepType = "text" | "textarea" | "number" | "email" | "yesno" | "tos";
interface Step {
  id: number;
  question: string;
  hint?: string;
  type: StepType;
  field: keyof FormData | null;
  optional?: boolean;
  yesFollowup?: keyof FormData; // show a text input when "Yes" is chosen
  yesFollowupLabel?: string;
}

const STEPS: Step[] = [
  {
    id: 1, type: "text",
    question: "What is your business name and website URL?",
    hint: "Enter your business name, then your website address (e.g. acmeshop.com).",
    field: null, // handled as compound (businessName + websiteUrl)
  },
  {
    id: 2, type: "textarea",
    question: "What makes your business unique?",
    hint: "Think about what sets you apart — free shipping, lowest price guarantee, 24h delivery, exclusive products, etc.",
    field: "uniqueSellingPoints",
  },
  {
    id: 3, type: "number",
    question: "What is your approximate monthly Google Ads budget?",
    hint: "Enter the amount in euros. If you don't know yet, leave it as €2,000.",
    field: "monthlyBudget",
    optional: true,
  },
  {
    id: 4, type: "number",
    question: "What is your target ROAS for the first two months?",
    hint: "ROAS = revenue ÷ ad spend. For example, 4 means €4 revenue for every €1 spent. Leave blank if unsure.",
    field: "targetRoas",
    optional: true,
  },
  {
    id: 5, type: "textarea",
    question: "Which location(s) are you targeting for your Google Ads campaigns?",
    hint: "Please name country, province, city, or anything related that we should target.",
    field: "targetLocations",
  },
  {
    id: 6, type: "textarea",
    question: "Do you have a Cookie Banner installed on your website? If yes, note which one.",
    hint: "If you don't know, just answer 'no'.",
    field: "cookieBanner",
  },
  {
    id: 7, type: "textarea",
    question: "Do you have conversion tracking set up? If yes, note which one.",
    hint: "Examples: Google Ads tag, GA4, GTM. If you don't know, just answer 'no'.",
    field: "conversionTracking",
  },
  {
    id: 8, type: "yesno",
    question: "Can we install ProductHero Pro on your Google Merchant Center account?",
    hint: "Cost: €68 per feed/country. We can also do this later — just answer No for now.",
    field: "productHeroPro",
  },
  {
    id: 9, type: "yesno",
    question: "Are there any special products, offers or promotions you would like to highlight in your campaigns?",
    field: "specialPromotions",
    yesFollowup: "specialPromotionsDetail",
    yesFollowupLabel: "Describe the products, offers or promotions:",
  },
  {
    id: 10, type: "email",
    question: "What email should we use to send you our weekly reports?",
    hint: "This can be different from your normal email address.",
    field: "reportEmail",
  },
  {
    id: 11, type: "tos",
    question: "Terms of Service",
    field: "tosAccepted",
  },
];

export default function ClientIntakePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);

  const [accountName, setAccountName]   = useState<string | null>(null);
  const [alreadyDone, setAlreadyDone]   = useState(false);
  const [loading, setLoading]           = useState(true);
  const [step, setStep]                 = useState(0); // 0 = welcome
  const [form, setForm]                 = useState<FormData>(INITIAL);
  const [submitting, setSubmitting]     = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/client-intake/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError("This link is invalid or has expired."); }
        else { setAccountName(d.name); setAlreadyDone(d.completed); }
      })
      .catch(() => setError("Failed to load. Please try again."))
      .finally(() => setLoading(false));
  }, [token]);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function canProceed(): boolean {
    const s = STEPS[step - 1];
    if (!s) return true;
    if (s.optional) return true;
    if (s.type === "yesno")  return form[s.field as keyof FormData] !== null;
    if (s.type === "tos")    return form.tosAccepted;
    if (s.field === null) return !!(form.businessName.trim() && form.websiteUrl.trim());
    const val = form[s.field as keyof FormData];
    if (typeof val === "string") return val.trim().length > 0;
    return true;
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/client-intake/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName:        form.businessName,
          websiteUrl:          form.websiteUrl,
          uniqueSellingPoints: form.uniqueSellingPoints,
          monthlyBudget:       form.monthlyBudget ? parseFloat(form.monthlyBudget) : null,
          targetRoas:          form.targetRoas    ? parseFloat(form.targetRoas)    : null,
          targetLocations:     form.targetLocations,
          cookieBanner:        form.cookieBanner,
          conversionTracking:  form.conversionTracking,
          productHeroPro:      form.productHeroPro === true,
          specialPromotions:   form.specialPromotions === true
            ? (form.specialPromotionsDetail || "Yes")
            : "No",
          reportEmail:         form.reportEmail,
          tosAccepted:         form.tosAccepted,
        }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Submission failed");
      }
      setSubmitted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Layout wrapper ────────────────────────────────────────────────────────────
  const wrap = (children: React.ReactNode) => (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 560 }}>
        {/* Logo / brand */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: GOLD, letterSpacing: "-0.5px" }}>
            ecomtrada
          </span>
        </div>
        {children}
      </div>
    </div>
  );

  if (loading) return wrap(
    <div style={{ textAlign: "center", color: MUTED }}>
      <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
    </div>
  );

  if (error && !accountName) return wrap(
    <div style={{ textAlign: "center" }}>
      <p style={{ color: "#ef4444", fontSize: 16 }}>{error}</p>
    </div>
  );

  if (alreadyDone) return wrap(
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#22c55e22",
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <Check size={28} color="#22c55e" />
      </div>
      <h2 style={{ color: TEXT, fontSize: 22, fontWeight: 700, margin: "0 0 12px" }}>Already submitted</h2>
      <p style={{ color: MUTED, fontSize: 15 }}>
        We already received your intake form. If you have questions, reach out to your account manager.
      </p>
    </div>
  );

  if (submitted) return wrap(
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#22c55e22",
        display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <Check size={28} color="#22c55e" />
      </div>
      <h2 style={{ color: TEXT, fontSize: 22, fontWeight: 700, margin: "0 0 12px" }}>All done — thank you!</h2>
      <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.6 }}>
        We have everything we need to get started. Your account manager will be in touch shortly.
      </p>
    </div>
  );

  // ─── Welcome screen (step 0) ──────────────────────────────────────────────────
  if (step === 0) return wrap(
    <div style={{ background: CARD, borderRadius: 16, padding: "40px 36px", border: `1px solid ${BORDER}` }}>
      <h1 style={{ color: TEXT, fontSize: 24, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.3 }}>
        Welcome{accountName ? `, ${accountName}` : ""}! 👋
      </h1>
      <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.7, margin: "0 0 32px" }}>
        This short form gives us the context we need to set up your Google Ads campaigns the right
        way from day one. It takes about 5 minutes to complete.
      </p>
      <button onClick={() => setStep(1)} style={btnStyle(GOLD, "#000")}>
        Let&apos;s get started <ChevronRight size={16} />
      </button>
    </div>
  );

  // ─── Form steps ───────────────────────────────────────────────────────────────
  const currentStep = STEPS[step - 1];
  const isLast      = step === STEPS.length;
  const progress    = Math.round((step / STEPS.length) * 100);

  return wrap(
    <div>
      {/* Progress bar */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: MUTED, fontSize: 12 }}>{step} / {STEPS.length}</span>
          <span style={{ color: MUTED, fontSize: 12 }}>{progress}%</span>
        </div>
        <div style={{ height: 3, background: BORDER, borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: GOLD, borderRadius: 2,
            transition: "width 0.3s ease" }} />
        </div>
      </div>

      <div style={{ background: CARD, borderRadius: 16, padding: "36px 32px", border: `1px solid ${BORDER}` }}>
        <p style={{ color: MUTED, fontSize: 12, marginBottom: 12 }}>{step} →</p>
        <h2 style={{ color: TEXT, fontSize: 20, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.4 }}>
          {currentStep.question}
        </h2>
        {currentStep.hint && (
          <p style={{ color: MUTED, fontSize: 13, margin: "0 0 24px", lineHeight: 1.6 }}>
            {currentStep.hint}
          </p>
        )}

        {/* ── Compound: business name + website ── */}
        {currentStep.field === null && currentStep.id === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              placeholder="Business name"
              value={form.businessName}
              onChange={e => set("businessName", e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="https://yourwebsite.com"
              value={form.websiteUrl}
              onChange={e => set("websiteUrl", e.target.value)}
              style={inputStyle}
            />
          </div>
        )}

        {/* ── Textarea ── */}
        {currentStep.type === "textarea" && currentStep.field && (
          <textarea
            placeholder="Type your answer here..."
            value={form[currentStep.field as keyof FormData] as string}
            onChange={e => set(currentStep.field as keyof FormData, e.target.value as never)}
            rows={4}
            style={{ ...inputStyle, resize: "vertical", minHeight: 100 }}
          />
        )}

        {/* ── Number ── */}
        {currentStep.type === "number" && currentStep.field && (
          <div style={{ position: "relative" }}>
            {currentStep.id !== 4 && (
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                color: MUTED, fontSize: 15 }}>€</span>
            )}
            <input
              type="number"
              placeholder={currentStep.id === 3 ? "2000" : "e.g. 4"}
              value={form[currentStep.field as keyof FormData] as string}
              onChange={e => set(currentStep.field as keyof FormData, e.target.value as never)}
              style={{ ...inputStyle, paddingLeft: currentStep.id !== 4 ? 30 : 14 }}
            />
          </div>
        )}

        {/* ── Email ── */}
        {currentStep.type === "email" && currentStep.field && (
          <input
            type="email"
            placeholder="your@email.com"
            value={form[currentStep.field as keyof FormData] as string}
            onChange={e => set(currentStep.field as keyof FormData, e.target.value as never)}
            style={inputStyle}
          />
        )}

        {/* ── Yes / No ── */}
        {currentStep.type === "yesno" && currentStep.field && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(["yes", "no"] as const).map(opt => {
              const isYes     = opt === "yes";
              const current   = form[currentStep.field as keyof FormData] as boolean | null;
              const selected  = isYes ? current === true : current === false;
              return (
                <button
                  key={opt}
                  onClick={() => set(currentStep.field as keyof FormData, isYes as never)}
                  style={{
                    background: selected ? `${GOLD}22` : "#2a2a2a",
                    border: `1px solid ${selected ? GOLD : BORDER}`,
                    borderRadius: 10, padding: "14px 18px",
                    color: selected ? GOLD : TEXT, fontSize: 15, fontWeight: 500,
                    cursor: "pointer", textAlign: "left", display: "flex",
                    alignItems: "center", gap: 10,
                  }}
                >
                  <span style={{ width: 24, height: 24, borderRadius: 4, background: selected ? GOLD : BORDER,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: selected ? "#000" : MUTED, flexShrink: 0 }}>
                    {isYes ? "Y" : "N"}
                  </span>
                  {isYes ? "Yes" : "No"}
                </button>
              );
            })}
            {/* Follow-up textarea when Yes is selected */}
            {currentStep.yesFollowup && form[currentStep.field as keyof FormData] === true && (
              <textarea
                placeholder={currentStep.yesFollowupLabel ?? "Please describe..."}
                value={form[currentStep.yesFollowup] as string}
                onChange={e => set(currentStep.yesFollowup!, e.target.value)}
                rows={3}
                style={{ ...inputStyle, marginTop: 4, resize: "vertical" }}
              />
            )}
          </div>
        )}

        {/* ── Terms of Service ── */}
        {currentStep.type === "tos" && (
          <div>
            <div style={{ background: "#1e1e1e", border: `1px solid ${BORDER}`, borderRadius: 10,
              padding: "16px 18px", marginBottom: 16, fontSize: 14, color: MUTED, lineHeight: 1.7 }}>
              <p style={{ margin: "0 0 8px" }}>
                By continuing, you agree to <strong style={{ color: TEXT }}>Ecomtrada B.V.&apos;s</strong>{" "}
                <a href="https://ecomtradatos.lovable.app" target="_blank" rel="noopener noreferrer"
                  style={{ color: GOLD, textDecoration: "underline" }}>standard terms of service</a>.
              </p>
              <p style={{ margin: "0 0 4px" }}>These cover scope of work, billing, cancellation, and responsibilities on both sides.</p>
              <p style={{ margin: "0 0 4px" }}>Ad spend is paid directly to the advertising platforms.</p>
              <p style={{ margin: "0 0 4px" }}>You always remain the owner of your accounts and data.</p>
              <p style={{ margin: 0 }}>Results can&apos;t be guaranteed, but transparency and best effort are.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(["accept", "decline"] as const).map(opt => {
                const isAccept = opt === "accept";
                const selected = isAccept ? form.tosAccepted : form.tosAccepted === false;
                return (
                  <button
                    key={opt}
                    onClick={() => set("tosAccepted", isAccept)}
                    style={{
                      background: selected ? (isAccept ? "#22c55e22" : "#ef444422") : "#2a2a2a",
                      border: `1px solid ${selected ? (isAccept ? "#22c55e" : "#ef4444") : BORDER}`,
                      borderRadius: 10, padding: "14px 18px",
                      color: selected ? (isAccept ? "#22c55e" : "#ef4444") : TEXT,
                      fontSize: 15, fontWeight: 500, cursor: "pointer", textAlign: "left",
                      display: "flex", alignItems: "center", gap: 10,
                    }}
                  >
                    <span style={{ width: 24, height: 24, borderRadius: 4,
                      background: selected ? (isAccept ? "#22c55e" : "#ef4444") : BORDER,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700,
                      color: selected ? "#fff" : MUTED, flexShrink: 0 }}>
                      {isAccept ? "A" : "B"}
                    </span>
                    {isAccept ? "I accept" : "I don't accept"}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {error && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 12 }}>{error}</p>}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} style={btnStyle("#2a2a2a", MUTED, BORDER)}>
              ← Back
            </button>
          ) : <span />}

          {isLast ? (
            <button
              onClick={submit}
              disabled={!canProceed() || submitting || !form.tosAccepted}
              style={btnStyle(GOLD, "#000", undefined, !canProceed() || submitting || !form.tosAccepted)}
            >
              {submitting ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : null}
              Submit
            </button>
          ) : (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              style={btnStyle(GOLD, "#000", undefined, !canProceed())}
            >
              OK <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: #555; }
        input:focus, textarea:focus { outline: none; border-color: ${GOLD}; }
      `}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#1e1e1e", border: `1px solid ${BORDER}`,
  borderRadius: 10, padding: "14px 16px", color: TEXT,
  fontSize: 15, fontFamily: "inherit", boxSizing: "border-box",
};

function btnStyle(
  bg: string, color: string, border?: string, disabled = false
): React.CSSProperties {
  return {
    background: disabled ? "#2a2a2a" : bg,
    color:      disabled ? MUTED    : color,
    border:     `1px solid ${border ?? bg}`,
    borderRadius: 10, padding: "12px 22px",
    fontSize: 14, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    display: "flex", alignItems: "center", gap: 6,
    opacity: disabled ? 0.6 : 1,
    transition: "opacity 0.15s",
  };
}
