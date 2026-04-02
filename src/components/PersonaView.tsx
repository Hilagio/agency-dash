"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, RefreshCw, Users, MapPin, Clock, TrendingUp, Info } from "lucide-react";
import type { DemographicRow, IncomeRow, ParentalRow, GeoRow, DayHourRow, AudienceInterestRow } from "@/lib/integrations/google-ads";

interface PersonaData {
  demographics:  DemographicRow[];
  income:        IncomeRow[];
  parental:      ParentalRow[];
  geo:           GeoRow[];
  dayHour:       DayHourRow[];
  interests:     AudienceInterestRow[];
  currency:      string;
  industry:      string | null;
  businessModel: string | null;
  error?:        string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pctOf(val: number, total: number) {
  return total > 0 ? (val / total) * 100 : 0;
}

const DAY_SHORT: Record<string, string> = {
  MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed", THURSDAY: "Thu",
  FRIDAY: "Fri", SATURDAY: "Sat", SUNDAY: "Sun",
};

const ACCENT = "#6366f1";

// ─── Mini bar chart row ────────────────────────────────────────────────────────

function BarRow({ label, value, total, secondary, color = ACCENT }: {
  label:     string;
  value:     number;
  total:     number;
  secondary?: string;
  color?:    string;
}) {
  const pct = Math.max(0, pctOf(value, total));
  return (
    <div style={{ marginBottom: 7 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</span>
        <div style={{ display: "flex", gap: 8 }}>
          {secondary && <span style={{ fontSize: 10, color: "var(--text-faint)" }}>{secondary}</span>}
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-2)", minWidth: 32, textAlign: "right" }}>{pct.toFixed(0)}%</span>
        </div>
      </div>
      <div style={{ height: 5, background: "var(--surface-2)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, padding: "16px 18px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
        <span style={{ color: ACCENT }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", color: "var(--text-dim)" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

// ─── Heatmap for hours ────────────────────────────────────────────────────────

function HourHeatmap({ hours }: { hours: DayHourRow[] }) {
  const vals = hours.map(h => h.conversions);
  const max  = Math.max(...vals, 1);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(24, 1fr)", gap: 2 }}>
        {hours.map((h, i) => {
          const intensity = h.conversions / max;
          const bg = intensity < 0.01
            ? "var(--surface-2)"
            : `rgba(99,102,241,${0.12 + intensity * 0.88})`;
          return (
            <div
              key={i}
              title={`${h.label}:00 — ${h.conversions.toFixed(1)} conv`}
              style={{ height: 20, borderRadius: 2, background: bg, cursor: "default" }}
            />
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        {[0, 6, 12, 18, 23].map(h => (
          <span key={h} style={{ fontSize: 9, color: "var(--text-faint)" }}>{h}:00</span>
        ))}
      </div>
    </div>
  );
}

// ─── Day-of-week bars ─────────────────────────────────────────────────────────

function DayBars({ days }: { days: DayHourRow[] }) {
  const maxConv = Math.max(...days.map(d => d.conversions), 1);
  const DAY_ORDER = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];
  const sorted = DAY_ORDER.map(k => days.find(d => d.label === k)).filter(Boolean) as DayHourRow[];

  return (
    <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 48 }}>
      {sorted.map(d => {
        const h = Math.max(4, (d.conversions / maxConv) * 44);
        const isTop = d.conversions === maxConv;
        return (
          <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ width: "100%", height: h, background: isTop ? ACCENT : "rgba(99,102,241,0.25)", borderRadius: "2px 2px 0 0", transition: "height 0.3s" }} />
            <span style={{ fontSize: 8, color: "var(--text-faint)" }}>{DAY_SHORT[d.label] ?? d.label.slice(0,3)}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── AI Persona card ──────────────────────────────────────────────────────────

function AiPersonaCard({ accountId, data }: { accountId: string; data: PersonaData }) {
  const [text,    setText]    = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const generate = async () => {
    if (loading) return;
    setLoading(true); setText(""); setDone(false); setError(null);

    try {
      const res = await fetch(`/api/accounts/${accountId}/persona/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok || !res.body) throw new Error("Failed to start stream");

      const reader = res.body.getReader();
      const dec    = new TextDecoder();
      while (true) {
        const { done: sd, value } = await reader.read();
        if (sd) break;
        for (const line of dec.decode(value).split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const j = JSON.parse(line.slice(6)) as { text?: string; done?: boolean; error?: string };
          if (j.text) setText(t => t + j.text);
          if (j.done) setDone(true);
          if (j.error) setError(j.error);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  // Simple markdown renderer (bold, headers, bullets)
  const renderMarkdown = (md: string) => {
    return md.split("\n").map((line, i) => {
      if (line.startsWith("## "))  return <h2 key={i} style={{ fontSize: 14, fontWeight: 700, color: "var(--text-2)", margin: "16px 0 6px" }}>{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", margin: "12px 0 4px" }}>{line.slice(4)}</h3>;
      if (line.startsWith("**") && line.endsWith("**")) return <p key={i} style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", margin: "2px 0" }}>{line.slice(2, -2)}</p>;
      if (line.startsWith("- ") || line.startsWith("* ")) return <li key={i} style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 14, marginBottom: 3 }}>{renderInline(line.slice(2))}</li>;
      if (line.trim() === "") return <div key={i} style={{ height: 4 }} />;
      return <p key={i} style={{ fontSize: 12, color: "var(--text-muted)", margin: "2px 0", lineHeight: 1.6 }}>{renderInline(line)}</p>;
    });
  };

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") ? <strong key={i} style={{ color: "var(--text-2)" }}>{p.slice(2, -2)}</strong> : p
    );
  };

  return (
    <div style={{ background: "var(--surface)", border: `1px solid var(--border)`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{
        padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: text ? "1px solid var(--border)" : "none",
        background: `linear-gradient(135deg, rgba(99,102,241,0.06), rgba(168,85,247,0.04))`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={14} style={{ color: ACCENT }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)" }}>AI Target Persona</span>
          <span style={{ fontSize: 10, color: "var(--text-faint)" }}>synthesised from Google Ads data</span>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: done ? "var(--surface-2)" : ACCENT,
            color: done ? "var(--text-muted)" : "#fff",
            border: "none", borderRadius: 7, padding: "6px 14px",
            fontSize: 11, fontWeight: 600, cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? <><Loader2 size={11} className="animate-spin" /> Generating…</> : done ? <><RefreshCw size={11} /> Regenerate</> : <><Sparkles size={11} /> Generate Persona</>}
        </button>
      </div>

      {!text && !loading && (
        <div style={{ padding: "32px 24px", textAlign: "center", color: "var(--text-faint)", fontSize: 12 }}>
          Click "Generate Persona" to synthesise a data-driven audience portrait from the signals above.
        </div>
      )}

      {error && (
        <div style={{ padding: "12px 18px", color: "#f87171", fontSize: 12 }}>{error}</div>
      )}

      {text && (
        <div style={{ padding: "16px 20px" }}>
          {renderMarkdown(text)}
          {loading && <span style={{ opacity: 0.4, fontSize: 12 }}>▍</span>}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PersonaView({ accountId, currency }: { accountId: string; currency: string }) {
  const [data,    setData]    = useState<PersonaData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/accounts/${accountId}/persona`);
      setData(await res.json());
    } catch {
      setData({ demographics: [], income: [], parental: [], geo: [], dayHour: [], interests: [], currency, industry: null, businessModel: null, error: "Failed to load" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [accountId]);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "60px 0", justifyContent: "center", color: "var(--text-dim)", fontSize: 13 }}>
      <Loader2 size={16} className="animate-spin" /> Fetching audience data from Google Ads…
    </div>
  );

  if (!data || data.error) return (
    <div style={{ color: "#f87171", fontSize: 13, padding: "20px 0" }}>{data?.error ?? "No data"}</div>
  );

  const sym = data.currency === "EUR" ? "€" : data.currency === "GBP" ? "£" : "$";

  // Demographics
  const devices  = data.demographics.filter(r => r.dimension === "device");
  const ages     = data.demographics.filter(r => r.dimension === "age"    && r.label !== "UNKNOWN" && r.label !== "UNDETERMINED");
  const genders  = data.demographics.filter(r => r.dimension === "gender" && r.label !== "UNKNOWN" && r.label !== "UNDETERMINED");

  const totalDeviceCost  = devices.reduce((s, r) => s + r.costMicros, 0);
  const totalAgeCost     = ages.reduce((s, r) => s + r.costMicros, 0);
  const totalGenderCost  = genders.reduce((s, r) => s + r.costMicros, 0);
  const totalIncomeCost  = data.income.reduce((s, r) => s + r.costMicros, 0);
  const totalParentalCost = data.parental.reduce((s, r) => s + r.costMicros, 0);
  const totalGeoCost     = data.geo.reduce((s, r) => s + r.costMicros, 0);

  const days  = data.dayHour.filter(r => r.dimension === "day");
  const hours = data.dayHour.filter(r => r.dimension === "hour").sort((a, b) => parseInt(a.label) - parseInt(b.label));

  const hasAnyData = devices.length > 0 || ages.length > 0 || data.geo.length > 0;

  return (
    <div>
      {/* Header note */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 8,
        background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.12)",
        borderRadius: 8, padding: "10px 14px", marginBottom: 20, fontSize: 11, color: "var(--text-muted)",
      }}>
        <Info size={12} style={{ marginTop: 1, flexShrink: 0, color: ACCENT }} />
        <span>
          Data from Google Ads API — last 30 days. <strong style={{ color: "var(--text-2)" }}>Ethnicity is not available</strong> from Google Ads.
          Geographic concentration can be used as a proxy (e.g. regional market research).
          "Unknown" segments (common in PMax) are filtered out.
        </span>
      </div>

      {!hasAnyData && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-faint)", fontSize: 13 }}>
          No demographic data available yet — the account may need more traffic or demographic targeting enabled.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

        {/* Device */}
        {devices.length > 0 && (
          <Section title="Device" icon={<TrendingUp size={13} />}>
            {devices.sort((a, b) => b.costMicros - a.costMicros).map(r => (
              <BarRow key={r.label} label={r.label} value={r.costMicros} total={totalDeviceCost}
                secondary={`CVR ${r.clicks > 0 ? ((r.conversions / r.clicks) * 100).toFixed(1) : 0}%`}
                color={r.label === "MOBILE" ? "#6366f1" : r.label === "DESKTOP" ? "#8b5cf6" : "#a78bfa"} />
            ))}
          </Section>
        )}

        {/* Gender */}
        {genders.length > 0 && (
          <Section title="Gender" icon={<Users size={13} />}>
            {genders.sort((a, b) => b.costMicros - a.costMicros).map(r => (
              <BarRow key={r.label} label={r.label} value={r.costMicros} total={totalGenderCost}
                secondary={`${r.conversions.toFixed(0)} conv`} />
            ))}
          </Section>
        )}

        {/* Age */}
        {ages.length > 0 && (
          <Section title="Age range" icon={<Users size={13} />}>
            {ages.sort((a, b) => b.costMicros - a.costMicros).map(r => {
              const label = r.label.replace("AGE_RANGE_", "").replace("_", "–").replace("UNDETERMINED", "Unknown");
              return (
                <BarRow key={r.label} label={label} value={r.costMicros} total={totalAgeCost}
                  secondary={`${r.conversions.toFixed(0)} conv`} />
              );
            })}
          </Section>
        )}

        {/* Income */}
        {data.income.length > 0 && (
          <Section title="Household income" icon={<TrendingUp size={13} />}>
            {data.income.sort((a, b) => b.costMicros - a.costMicros).map(r => (
              <BarRow key={r.label} label={r.label} value={r.costMicros} total={totalIncomeCost}
                secondary={`${r.conversions.toFixed(0)} conv`}
                color={`hsl(${220 + data.income.indexOf(r) * 15},70%,60%)`} />
            ))}
          </Section>
        )}

        {/* Parental */}
        {data.parental.length > 0 && (
          <Section title="Parental status" icon={<Users size={13} />}>
            {data.parental.sort((a, b) => b.costMicros - a.costMicros).map(r => (
              <BarRow key={r.label} label={r.label} value={r.costMicros} total={totalParentalCost}
                secondary={`${r.conversions.toFixed(0)} conv`} color="#8b5cf6" />
            ))}
          </Section>
        )}

        {/* Geography */}
        {data.geo.length > 0 && (
          <Section title={`Geography (top ${Math.min(data.geo.length, 12)})`} icon={<MapPin size={13} />}>
            {data.geo.slice(0, 12).map(r => (
              <BarRow key={r.criterionId} label={r.name}
                value={r.costMicros} total={totalGeoCost}
                secondary={`${r.conversions.toFixed(0)} conv · ${sym}${(r.costMicros / 1_000_000).toFixed(0)}`}
                color="#06b6d4" />
            ))}
          </Section>
        )}

        {/* Interests */}
        {data.interests.length > 0 && (
          <div style={{ gridColumn: "span 2" }}>
            <Section title="Audience interests & segments" icon={<Sparkles size={13} />}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px 16px" }}>
                {data.interests.slice(0, 24).map((r, i) => (
                  <div key={i} style={{
                    padding: "6px 10px", borderRadius: 7,
                    background: "var(--surface-2)", border: "1px solid var(--border)",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: "var(--text-2)", lineHeight: 1.3 }}>{r.name}</div>
                    <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 2 }}>
                      {r.type.replace("_", " ").toLowerCase()} · {r.clicks} clicks · {r.conversions.toFixed(0)} conv
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}

        {/* Day of week */}
        {days.length > 0 && (
          <Section title="Day of week performance" icon={<Clock size={13} />}>
            <DayBars days={days} />
            <p style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 8 }}>Height = conversions</p>
          </Section>
        )}

        {/* Hour of day */}
        {hours.length > 0 && (
          <Section title="Hour of day (conversions)" icon={<Clock size={13} />}>
            <HourHeatmap hours={hours} />
            <p style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 6 }}>Darker = more conversions</p>
          </Section>
        )}

      </div>

      {/* AI Persona generation */}
      {hasAnyData && (
        <div style={{ marginTop: 20 }}>
          <AiPersonaCard accountId={accountId} data={data} />
        </div>
      )}
    </div>
  );
}
