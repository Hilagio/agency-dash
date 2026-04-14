"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2, X, ShoppingCart, Users, Package, Repeat, Globe, Wrench } from "lucide-react";

// ─── Step IDs ─────────────────────────────────────────────────────────────────

type StepId = "type" | "model" | "market" | "budget" | "economics" | "landing";

// ─── Industry chips ───────────────────────────────────────────────────────────

const INDUSTRIES = [
  "Fashion", "Electronics", "Home & Garden", "Sports & Outdoor",
  "Beauty & Care", "Food & Drink", "Automotive", "Health & Wellness",
  "Toys & Kids", "B2B", "SaaS", "Finance", "Real Estate", "Education", "Other",
];

// ─── Shared card-button style ─────────────────────────────────────────────────

function ChoiceCard({
  selected, onClick, icon, label, description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "flex-start",
        gap: 6, padding: "14px 16px", borderRadius: 10, cursor: "pointer", textAlign: "left",
        background: selected ? "rgba(59,130,246,0.07)" : "var(--bg)",
        border: `1.5px solid ${selected ? "rgba(59,130,246,0.45)" : "var(--border-2)"}`,
        transition: "all 0.12s",
      }}
    >
      <div style={{ color: selected ? "#60a5fa" : "var(--text-dim)" }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: selected ? "var(--text)" : "var(--text-muted)" }}>{label}</div>
        {description && (
          <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2, lineHeight: 1.4 }}>{description}</div>
        )}
      </div>
    </button>
  );
}

// ─── Step sub-components ──────────────────────────────────────────────────────

function StepType({
  accountType, setAccountType,
}: {
  accountType: "ecommerce" | "lead_gen" | null;
  setAccountType: (v: "ecommerce" | "lead_gen") => void;
}) {
  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: "0 0 4px" }}>
        What type of account is this?
      </h3>
      <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "0 0 16px", lineHeight: 1.5 }}>
        This determines how FUNNEL & ECONOMICS are scored.
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <ChoiceCard
          selected={accountType === "ecommerce"}
          onClick={() => setAccountType("ecommerce")}
          icon={<ShoppingCart size={20} />}
          label="Ecommerce"
          description="Sells products online — ROAS-driven"
        />
        <ChoiceCard
          selected={accountType === "lead_gen"}
          onClick={() => setAccountType("lead_gen")}
          icon={<Users size={20} />}
          label="Lead generation"
          description="Generates form fills or calls — CPA-driven"
        />
      </div>
    </div>
  );
}

function StepModel({
  businessModel, setBusinessModel,
}: {
  businessModel: string;
  setBusinessModel: (v: string) => void;
}) {
  const options = [
    { value: "dtc",          icon: <Package size={18} />,  label: "DTC (own brand)", description: "Direct-to-consumer, own warehouse" },
    { value: "dropship",     icon: <Globe size={18} />,    label: "Dropship", description: "Ships from supplier, no inventory" },
    { value: "subscription", icon: <Repeat size={18} />,   label: "Subscription", description: "Recurring billing, churn matters" },
    { value: "marketplace",  icon: <ShoppingCart size={18} />, label: "Marketplace", description: "3rd-party seller (Amazon, Bol, etc.)" },
    { value: "service",      icon: <Wrench size={18} />,   label: "Service / Other", description: "Service business or hybrid model" },
  ];

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: "0 0 4px" }}>
        What's the business model?
      </h3>
      <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "0 0 16px", lineHeight: 1.5 }}>
        Adjusts CVR benchmarks and scoring weights.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {options.map(o => (
          <ChoiceCard
            key={o.value}
            selected={businessModel === o.value}
            onClick={() => setBusinessModel(o.value)}
            icon={o.icon}
            label={o.label}
            description={o.description}
          />
        ))}
      </div>
    </div>
  );
}

function StepMarket({
  country, setCountry, industry, setIndustry,
}: {
  country: string; setCountry: (v: string) => void;
  industry: string; setIndustry: (v: string) => void;
}) {
  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: "0 0 4px" }}>
        Where does this client sell?
      </h3>
      <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "0 0 16px", lineHeight: 1.5 }}>
        Used for benchmark comparisons and seasonal context.
      </p>

      {/* Country input */}
      <label style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
          Primary market (country code)
        </span>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 12px",
        }}>
          <input
            type="text"
            value={country}
            onChange={e => setCountry(e.target.value.toUpperCase().slice(0, 2))}
            placeholder="NL, DE, GB, US…"
            maxLength={2}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontSize: 14, color: "var(--text)", fontFamily: "inherit",
              textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600,
            }}
          />
          <span style={{ fontSize: 11, color: "var(--text-faint)" }}>2-letter ISO</span>
        </div>
      </label>

      {/* Industry chips */}
      <div>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
          Industry
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {INDUSTRIES.map(ind => (
            <button
              key={ind}
              onClick={() => setIndustry(industry === ind ? "" : ind)}
              style={{
                padding: "5px 11px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                background: industry === ind ? "rgba(59,130,246,0.1)" : "var(--bg)",
                border: `1px solid ${industry === ind ? "rgba(59,130,246,0.4)" : "var(--border-2)"}`,
                color: industry === ind ? "#60a5fa" : "var(--text-dim)",
                fontWeight: industry === ind ? 600 : 400,
                transition: "all 0.1s",
              }}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepBudget({
  accountType, currSym,
  monthlyBudget, setMonthlyBudget,
  targetRoas, setTargetRoas,
  targetCpa, setTargetCpa,
}: {
  accountType: "ecommerce" | "lead_gen" | null;
  currSym: string;
  monthlyBudget: string; setMonthlyBudget: (v: string) => void;
  targetRoas: string;    setTargetRoas: (v: string) => void;
  targetCpa: string;     setTargetCpa: (v: string) => void;
}) {
  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: "0 0 4px" }}>
        Budget & performance target
      </h3>
      <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "0 0 16px", lineHeight: 1.5 }}>
        These numbers make budget constraint detection and ECONOMICS scoring accurate.
        Leave blank if you don't know yet.
      </p>

      {/* Monthly budget */}
      <label style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
          Agreed monthly budget
        </span>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 12px",
        }}>
          <span style={{ fontSize: 13, color: "var(--text-faint)" }}>{currSym}</span>
          <input
            type="number" step="100" min="0" placeholder="e.g. 3000"
            value={monthlyBudget}
            onChange={e => setMonthlyBudget(e.target.value)}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "var(--text)", fontFamily: "inherit" }}
          />
          <span style={{ fontSize: 11, color: "var(--text-faint)" }}>/mo</span>
        </div>
        <span style={{ fontSize: 10, color: "var(--text-very-dim, var(--text-faint))" }}>Client-approved spend — prevents budget loss from being flagged as constraint</span>
      </label>

      {/* Target ROAS (ecommerce) */}
      {accountType === "ecommerce" && (
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
            Target ROAS
          </span>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 12px",
          }}>
            <input
              type="number" step="0.1" min="0" placeholder="e.g. 4.0"
              value={targetRoas}
              onChange={e => setTargetRoas(e.target.value)}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "var(--text)", fontFamily: "inherit" }}
            />
            <span style={{ fontSize: 13, color: "var(--text-faint)" }}>x</span>
          </div>
          <span style={{ fontSize: 10, color: "var(--text-very-dim, var(--text-faint))" }}>Return on Ad Spend — feeds ECONOMICS score</span>
        </label>
      )}

      {/* Target CPA (lead gen) */}
      {accountType === "lead_gen" && (
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
            Target CPA
          </span>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 12px",
          }}>
            <span style={{ fontSize: 13, color: "var(--text-faint)" }}>{currSym}</span>
            <input
              type="number" step="1" min="0" placeholder="e.g. 25"
              value={targetCpa}
              onChange={e => setTargetCpa(e.target.value)}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "var(--text)", fontFamily: "inherit" }}
            />
          </div>
          <span style={{ fontSize: 10, color: "var(--text-very-dim, var(--text-faint))" }}>Cost per acquired lead — feeds ECONOMICS score</span>
        </label>
      )}
    </div>
  );
}

function StepEconomics({
  accountType, grossMargin, setGrossMargin,
  leadToSaleRate, setLeadToSaleRate, targetRoas,
}: {
  accountType: "ecommerce" | "lead_gen" | null;
  grossMargin: string;       setGrossMargin: (v: string) => void;
  leadToSaleRate: string;    setLeadToSaleRate: (v: string) => void;
  targetRoas: string;
}) {
  const breakeven = grossMargin !== "" && parseFloat(grossMargin) > 0
    ? (100 / parseFloat(grossMargin)).toFixed(1) : null;
  const roasNum = targetRoas !== "" ? parseFloat(targetRoas) : null;
  const marginNum = grossMargin !== "" ? parseFloat(grossMargin) : null;
  const isAboveBreakeven = roasNum != null && marginNum != null
    ? roasNum >= 100 / marginNum : null;

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: "0 0 4px" }}>
        {accountType === "lead_gen" ? "Lead economics" : "Unit economics"}
      </h3>
      <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "0 0 16px", lineHeight: 1.5 }}>
        {accountType === "lead_gen"
          ? "How many leads close into sales? Used to compute true revenue per click."
          : "Required to compute break-even ROAS and ECONOMICS score. Typical ecommerce margins are 30–50%."}
      </p>

      {accountType === "ecommerce" && (
        <>
          <label style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
              Gross margin
            </span>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 12px",
            }}>
              <input
                type="number" step="1" min="0" max="100" placeholder="e.g. 38"
                value={grossMargin}
                onChange={e => setGrossMargin(e.target.value)}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "var(--text)", fontFamily: "inherit" }}
              />
              <span style={{ fontSize: 13, color: "var(--text-faint)" }}>%</span>
            </div>
          </label>

          {/* Live break-even preview */}
          {breakeven && (
            <div style={{
              background: isAboveBreakeven === true
                ? "rgba(74,222,128,0.06)"
                : isAboveBreakeven === false
                  ? "rgba(239,68,68,0.06)"
                  : "var(--bg)",
              border: `1px solid ${isAboveBreakeven === true ? "rgba(74,222,128,0.2)" : isAboveBreakeven === false ? "rgba(239,68,68,0.2)" : "var(--border)"}`,
              borderRadius: 8, padding: "10px 14px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 12, color: "var(--text-dim)" }}>Break-even ROAS</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-2)", letterSpacing: "-0.3px" }}>{breakeven}x</span>
                {isAboveBreakeven !== null && targetRoas && (
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20,
                    background: isAboveBreakeven ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)",
                    color: isAboveBreakeven ? "#4ade80" : "#f87171",
                    border: `1px solid ${isAboveBreakeven ? "rgba(74,222,128,0.25)" : "rgba(239,68,68,0.25)"}`,
                  }}>
                    Target {isAboveBreakeven ? "above" : "below"} break-even
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {accountType === "lead_gen" && (
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
            Lead-to-sale rate
          </span>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 12px",
          }}>
            <input
              type="number" step="1" min="0" max="100" placeholder="e.g. 15"
              value={leadToSaleRate}
              onChange={e => setLeadToSaleRate(e.target.value)}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: "var(--text)", fontFamily: "inherit" }}
            />
            <span style={{ fontSize: 13, color: "var(--text-faint)" }}>%</span>
          </div>
          <span style={{ fontSize: 10, color: "var(--text-very-dim, var(--text-faint))" }}>
            {leadToSaleRate !== "" && parseFloat(leadToSaleRate) > 0
              ? `${parseFloat(leadToSaleRate).toFixed(0)}% of leads close — 1 sale per ${Math.round(100 / parseFloat(leadToSaleRate))} leads`
              : "What % of form fills become paying customers?"}
          </span>
        </label>
      )}
    </div>
  );
}

function StepLanding({
  landingUrl, setLandingUrl,
}: {
  landingUrl: string; setLandingUrl: (v: string) => void;
}) {
  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: "0 0 4px" }}>
        Client's landing page
      </h3>
      <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "0 0 16px", lineHeight: 1.5 }}>
        Optional. Enables AI CRO review and auto-generated client briefs later.
      </p>
      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
          Landing page URL
        </span>
        <div style={{
          display: "flex", alignItems: "center",
          background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 12px",
        }}>
          <input
            type="url" placeholder="https://www.example.com"
            value={landingUrl}
            onChange={e => setLandingUrl(e.target.value)}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--text)", fontFamily: "inherit" }}
          />
        </div>
        <span style={{ fontSize: 10, color: "var(--text-very-dim, var(--text-faint))" }}>
          Used for "Generate brief from website" and landing page CRO analysis
        </span>
      </label>
    </div>
  );
}

// ─── Main wizard ───────────────────────────────────────────────────────────────

interface WizardValues {
  businessModel:      string | null;
  country:            string | null;
  industry:           string | null;
  monthlyBudget:      number | null;
  targetRoas:         number | null;
  targetCpa:          number | null;
  grossMarginPercent: number | null;
  leadToSaleRate:     number | null;
  landingPageUrl:     string | null;
}

interface Props {
  accountId:   string;
  accountName: string;
  currency:    string;
  onSaved:     (values: Partial<WizardValues>) => void;
  onSkip:      () => void;
  onScore:     () => void;
}

export function AccountSetupWizard({
  accountId, accountName, currency, onSaved, onSkip, onScore,
}: Props) {
  const [accountType, setAccountType] = useState<"ecommerce" | "lead_gen" | null>(null);
  const [businessModel, setBusinessModel] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [targetRoas, setTargetRoas] = useState("");
  const [targetCpa, setTargetCpa] = useState("");
  const [grossMargin, setGrossMargin] = useState("");
  const [leadToSaleRate, setLeadToSaleRate] = useState("");
  const [landingUrl, setLandingUrl] = useState("");
  const [stepIdx, setStepIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const currSym = currency === "EUR" ? "€" : currency === "GBP" ? "£" : "$";

  const activeSteps: StepId[] = accountType === "lead_gen"
    ? ["type", "market", "budget", "economics", "landing"]
    : ["type", "model", "market", "budget", "economics", "landing"];

  const currentStep = activeSteps[stepIdx];
  const totalSteps = activeSteps.length;
  // Progress fills completely on last step (before done), then 100% on done
  const progress = totalSteps > 1 ? (stepIdx / (totalSteps - 1)) * 100 : 100;

  const canContinue = currentStep === "type"  ? accountType !== null
    : currentStep === "model"                 ? businessModel !== ""
    : true; // all other steps are optional

  const patch = async (data: Partial<WizardValues>) => {
    const res = await fetch(`/api/accounts/${accountId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) onSaved(data);
  };

  const handleContinue = async () => {
    setSaving(true);
    try {
      if (currentStep === "type" && accountType === "lead_gen") {
        await patch({ businessModel: "lead_gen" });
      } else if (currentStep === "model" && businessModel) {
        await patch({ businessModel });
      } else if (currentStep === "market") {
        const d: Partial<WizardValues> = {};
        if (country.trim())  d.country  = country.trim().toUpperCase();
        if (industry.trim()) d.industry = industry.trim();
        if (Object.keys(d).length > 0) await patch(d);
      } else if (currentStep === "budget") {
        const d: Partial<WizardValues> = {};
        if (monthlyBudget !== "")                             d.monthlyBudget = parseFloat(monthlyBudget);
        if (accountType === "ecommerce" && targetRoas !== "") d.targetRoas    = parseFloat(targetRoas);
        if (accountType === "lead_gen"  && targetCpa  !== "") d.targetCpa     = parseFloat(targetCpa);
        if (Object.keys(d).length > 0) await patch(d);
      } else if (currentStep === "economics") {
        const d: Partial<WizardValues> = {};
        if (accountType === "ecommerce" && grossMargin    !== "") d.grossMarginPercent = parseFloat(grossMargin) / 100;
        if (accountType === "lead_gen"  && leadToSaleRate !== "") d.leadToSaleRate     = parseFloat(leadToSaleRate) / 100;
        if (Object.keys(d).length > 0) await patch(d);
      } else if (currentStep === "landing") {
        if (landingUrl.trim()) await patch({ landingPageUrl: landingUrl.trim() });
      }

      if (stepIdx < totalSteps - 1) {
        setStepIdx(stepIdx + 1);
      } else {
        setIsDone(true);
      }
    } finally {
      setSaving(false);
    }
  };

  // ── Done screen ──────────────────────────────────────────────────────────────
  if (isDone) {
    const savedModel = accountType === "lead_gen" ? "lead_gen" : businessModel;
    const modelLabel: Record<string, string> = {
      dtc: "DTC (own brand)", dropship: "Dropship", subscription: "Subscription",
      marketplace: "Marketplace", service: "Service", lead_gen: "Lead generation",
    };

    return (
      <div style={{
        maxWidth: 520, margin: "0 auto",
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 16, overflow: "hidden",
      }}>
        {/* Full progress bar */}
        <div style={{ height: 3, background: "var(--accent-blue, #3b82f6)" }} />

        <div style={{ padding: "20px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <CheckCircle size={20} style={{ color: "#4ade80", flexShrink: 0 }} />
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", margin: 0 }}>Setup complete</h2>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-dim)", margin: 0, lineHeight: 1.6 }}>
            Here's what was saved for <strong style={{ color: "var(--text)" }}>{accountName}</strong>.
            Score the account now to apply everything.
          </p>
        </div>

        {/* Summary chips */}
        <div style={{
          margin: "16px 24px",
          background: "var(--bg)", border: "1px solid var(--border)",
          borderRadius: 10, padding: "14px 16px",
          display: "flex", flexWrap: "wrap", gap: "12px 24px",
        }}>
          {savedModel && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", textTransform: "capitalize" }}>
                {modelLabel[savedModel] ?? savedModel}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Model</div>
            </div>
          )}
          {country && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{country.toUpperCase()}</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Market</div>
            </div>
          )}
          {industry && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{industry}</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Industry</div>
            </div>
          )}
          {monthlyBudget && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{currSym}{parseFloat(monthlyBudget).toLocaleString()}/mo</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Budget</div>
            </div>
          )}
          {targetRoas && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{targetRoas}x</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Target ROAS</div>
            </div>
          )}
          {targetCpa && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{currSym}{targetCpa}</div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Target CPA</div>
            </div>
          )}
          {grossMargin && (
            <>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{grossMargin}%</div>
                <div style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Gross margin</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>
                  {(100 / parseFloat(grossMargin)).toFixed(1)}x
                </div>
                <div style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Break-even ROAS</div>
              </div>
            </>
          )}
          {landingUrl && (
            <div style={{ minWidth: "100%" }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: "#60a5fa", wordBreak: "break-all" }}>
                {landingUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Landing page</div>
            </div>
          )}
          {!savedModel && !country && !monthlyBudget && !targetRoas && !targetCpa && !grossMargin && (
            <p style={{ fontSize: 12, color: "var(--text-faint)", margin: 0 }}>
              Nothing saved yet — you can fill in targets in the Account setup section below.
            </p>
          )}
        </div>

        <div style={{ padding: "0 24px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={onScore}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "var(--btn-primary)", border: "none", borderRadius: 8,
              color: "#fff", fontSize: 13, fontWeight: 600,
              padding: "10px 20px", cursor: "pointer",
            }}
          >
            Score this account <ArrowRight size={13} />
          </button>
          <button
            onClick={onSkip}
            style={{
              background: "transparent", border: "none",
              color: "var(--text-faint)", fontSize: 12, cursor: "pointer", padding: "4px 8px",
            }}
          >
            I'll explore first
          </button>
        </div>
      </div>
    );
  }

  // ── Step layout ──────────────────────────────────────────────────────────────
  return (
    <div style={{
      maxWidth: 520, margin: "0 auto",
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 16, overflow: "hidden",
    }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: "var(--border-2)" }}>
        <div style={{
          height: "100%",
          background: "var(--accent-blue, #3b82f6)",
          width: `${progress}%`,
          transition: "width 0.35s ease",
        }} />
      </div>

      {/* Step counter + skip */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px 0",
      }}>
        <span style={{ fontSize: 11, color: "var(--text-faint)", fontWeight: 500 }}>
          Step {stepIdx + 1} of {totalSteps}
        </span>
        <button
          onClick={onSkip}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--text-faint)", fontSize: 11, padding: "2px 4px",
          }}
        >
          <X size={11} /> Skip setup
        </button>
      </div>

      {/* Step body */}
      <div style={{ padding: "10px 20px 18px" }}>
        {currentStep === "type" && (
          <StepType accountType={accountType} setAccountType={setAccountType} />
        )}
        {currentStep === "model" && (
          <StepModel businessModel={businessModel} setBusinessModel={setBusinessModel} />
        )}
        {currentStep === "market" && (
          <StepMarket country={country} setCountry={setCountry} industry={industry} setIndustry={setIndustry} />
        )}
        {currentStep === "budget" && (
          <StepBudget
            accountType={accountType}
            currSym={currSym}
            monthlyBudget={monthlyBudget} setMonthlyBudget={setMonthlyBudget}
            targetRoas={targetRoas}       setTargetRoas={setTargetRoas}
            targetCpa={targetCpa}         setTargetCpa={setTargetCpa}
          />
        )}
        {currentStep === "economics" && (
          <StepEconomics
            accountType={accountType}
            grossMargin={grossMargin}         setGrossMargin={setGrossMargin}
            leadToSaleRate={leadToSaleRate}   setLeadToSaleRate={setLeadToSaleRate}
            targetRoas={targetRoas}
          />
        )}
        {currentStep === "landing" && (
          <StepLanding landingUrl={landingUrl} setLandingUrl={setLandingUrl} />
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 20px 18px", borderTop: "1px solid var(--border)",
      }}>
        {stepIdx > 0 ? (
          <button
            onClick={() => setStepIdx(stepIdx - 1)}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--text-dim)", fontSize: 13, padding: "4px 0",
            }}
          >
            ← Back
          </button>
        ) : <span />}

        <button
          onClick={handleContinue}
          disabled={!canContinue || saving}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: canContinue && !saving ? "var(--btn-primary)" : "var(--surface-2)",
            border: "none", borderRadius: 8,
            color: canContinue && !saving ? "#fff" : "var(--text-faint)",
            fontSize: 13, fontWeight: 600,
            padding: "9px 20px",
            cursor: !canContinue || saving ? "not-allowed" : "pointer",
            transition: "background 0.15s, color 0.15s",
          }}
        >
          {saving
            ? <><Loader2 size={12} className="animate-spin" /> Saving…</>
            : stepIdx === totalSteps - 1
              ? <>Finish <CheckCircle size={12} /></>
              : <>Continue <ArrowRight size={12} /></>}
        </button>
      </div>
    </div>
  );
}
