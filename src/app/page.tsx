"use client";

/**
 * "Today" dashboard — the home page.
 * A greeting-led overview: engine status, ownership stat tiles, and a focused
 * "needs attention today" list that deep-links into each account. The full
 * account grid lives on /stores.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck, Settings as SettingsIcon, Store, ListChecks, BookOpen,
  Loader2, ArrowRight, Sprout,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

type Colour = "green" | "yellow" | "red" | "unknown";

interface Overview {
  counts: Record<Colour, number>;
  totalActive: number;
  enabled: number;
  attention: Array<{
    id: string; name: string; clientName: string | null; ownerName: string | null;
    status: Colour; reason: string; reviewDue: boolean;
  }>;
  lastRunAt: string | null;
  lastNotionSyncAt: string | null;
  connections: { ads: boolean; notion: boolean; slack: boolean };
}

// Agency / PPC quotes — one per day, deterministic (no Math.random / SSR mismatch).
const QUOTES = [
  ["Half the money I spend on advertising is wasted; the trouble is I don't know which half.", "John Wanamaker"],
  ["A good ad is one that sells without drawing attention to itself.", "David Ogilvy"],
  ["The best marketing doesn't feel like marketing.", "Tom Fishburne"],
  ["Don't find customers for your products, find products for your customers.", "Seth Godin"],
  ["What gets measured gets managed.", "Peter Drucker"],
  ["Test everything. Assume nothing.", "PPC OS"],
  ["The aim of marketing is to know the customer so well the product sells itself.", "Peter Drucker"],
];

const STATUS_COLOR: Record<Colour, string> = {
  green: "var(--accent)", yellow: "var(--accent-2)", red: "var(--danger)", unknown: "var(--text-dim)",
};
const STATUS_LABEL: Record<Colour, string> = {
  green: "Under control", yellow: "Action needed", red: "Immediate action", unknown: "Couldn't evaluate",
};

function relativeTime(iso: string | null, nowMs: number | null): string {
  if (!iso) return "never";
  if (nowMs == null) return "…";
  const mins = Math.round((nowMs - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

const card: React.CSSProperties = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16 };
const eyebrow: React.CSSProperties = { fontSize: 11, letterSpacing: 0.6, textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 };
const navLink = (active: boolean): React.CSSProperties => ({
  display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "7px 12px", borderRadius: 8, textDecoration: "none",
  color: active ? "var(--text)" : "var(--text-3)", background: active ? "var(--accent-dim)" : "transparent", fontWeight: active ? 600 : 500,
});

export default function TodayPage() {
  const [name, setName] = useState<string | null>(null);
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  // Set on mount (not in a useState initializer) so SSR and first client render
  // match — avoids a hydration mismatch on the date/greeting.
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    // Stamp "now" on mount (client-only, avoids SSR hydration mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNowMs(Date.now());
    (async () => {
      const [me, ov] = await Promise.all([
        fetch("/api/auth/me", { credentials: "include" }).then(r => r.ok ? r.json() : { user: null }).catch(() => ({ user: null })),
        fetch("/api/ownership/overview", { credentials: "include" }).then(r => r.ok ? r.json() : null).catch(() => null),
      ]);
      setName(me?.user?.name ?? (me?.user?.email ? String(me.user.email).split("@")[0] : null));
      setData(ov);
      setLoading(false);
    })();
  }, []);

  const nowDate = nowMs != null ? new Date(nowMs) : null;
  const hour = nowDate?.getHours() ?? 9;
  const partOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const first = (name ?? "there").split(" ")[0];
  const quote = QUOTES[(nowMs != null ? Math.floor(nowMs / 86_400_000) : 0) % QUOTES.length];

  const c = data?.counts ?? { green: 0, yellow: 0, red: 0, unknown: 0 };
  const reviewsDue = data?.attention.filter(a => a.reviewDue).length ?? 0;

  const tiles = [
    { k: "Active stores", v: data?.totalActive ?? 0, color: "var(--text)" },
    { k: "Under control", v: c.green, color: "var(--accent)" },
    { k: "Action needed", v: c.yellow, color: "var(--accent-2)" },
    { k: "Immediate", v: c.red, color: "var(--danger)" },
    { k: "Reviews due", v: reviewsDue, color: "var(--text)" },
    { k: "Couldn't eval", v: c.unknown, color: "var(--text-dim)" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", gap: 16, height: 58, padding: "0 26px",
        position: "sticky", top: 0, zIndex: 9, background: "var(--header-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 800, letterSpacing: "-0.4px", fontSize: 15 }}>
          <div style={{ width: 27, height: 27, borderRadius: 8, background: "linear-gradient(135deg, #33cc80, #1c8a52)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, boxShadow: "0 2px 10px rgba(51,204,128,0.4)" }}>A</div>
          agency-dash
        </div>
        <div style={{ display: "flex", gap: 2, marginLeft: 8 }}>
          <Link href="/" style={navLink(true)}>Today</Link>
          <Link href="/stores" style={navLink(false)}><Store size={13} /> Stores</Link>
          <Link href="/ownership" style={navLink(false)}><ShieldCheck size={13} /> Ownership</Link>
          <Link href="/actions" style={navLink(false)}><ListChecks size={13} /> Actions</Link>
          <Link href="/sops" style={navLink(false)}><BookOpen size={13} /> SOPs</Link>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <ThemeToggle />
          <Link href="/settings" style={{ display: "flex", width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border-2)", background: "var(--surface)", alignItems: "center", justifyContent: "center", color: "var(--text-3)" }} title="Settings">
            <SettingsIcon size={15} />
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: 1160, margin: "0 auto", padding: "24px 26px 80px" }}>
        {/* Greeting + status */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18, alignItems: "stretch" }}>
          <div style={{ ...card, border: "1px solid var(--border-2)", padding: "26px 28px", background: "linear-gradient(160deg, var(--accent-dim), transparent), var(--surface)" }}>
            <div style={eyebrow}>
              {nowDate ? nowDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : " "} · Amsterdam
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1px", margin: "8px 0 14px" }}>
              Good {partOfDay}, <span style={{ color: "var(--accent)" }}>{first}</span> <Sprout size={24} style={{ verticalAlign: "-3px", color: "var(--accent)" }} />
            </h1>
            <div style={{ borderLeft: "3px solid var(--accent)", paddingLeft: 12, color: "var(--text-3)", fontStyle: "italic", fontSize: 13.5, maxWidth: 620 }}>
              &ldquo;{quote[0]}&rdquo; — {quote[1]}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ ...card, padding: "16px 18px" }}>
              <div style={{ ...eyebrow, marginBottom: 8 }}>Engine status</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 13 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: data?.connections.ads ? "var(--accent)" : "var(--accent-2)" }} />
                {data?.connections.ads ? "All systems operational" : "Google Ads not connected"}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                <span>Last scored</span><b style={{ color: "var(--text-2)" }}>{relativeTime(data?.lastRunAt ?? null, nowMs)}</b>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                <span>Notion sync</span><b style={{ color: "var(--text-2)" }}>{relativeTime(data?.lastNotionSyncAt ?? null, nowMs)}</b>
              </div>
            </div>
            <div style={{ ...card, padding: "16px 18px" }}>
              <div style={{ ...eyebrow, marginBottom: 8 }}>Pilot coverage</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
                <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-1px" }}>{data?.enabled ?? 0}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", paddingBottom: 5 }}>of {data?.totalActive ?? 0} stores in shadow mode</span>
              </div>
              <div style={{ height: 7, borderRadius: 6, background: "var(--surface-3)", marginTop: 10, overflow: "hidden" }}>
                <div style={{ width: `${data && data.totalActive ? Math.round((data.enabled / data.totalActive) * 100) : 0}%`, height: "100%", background: "var(--accent)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Stat tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, marginTop: 18 }}>
          {tiles.map(t => (
            <div key={t.k} style={{ ...card, padding: "14px 15px" }}>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-1px", color: t.color }}>{loading ? "—" : t.v}</div>
              <div style={{ ...eyebrow, marginTop: 6 }}>{t.k}</div>
            </div>
          ))}
        </div>

        {/* Needs attention today */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "26px 4px 12px" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>Needs attention today</h2>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{data ? `${data.attention.length} account${data.attention.length === 1 ? "" : "s"}` : ""}</span>
        </div>

        <section style={{ ...card, padding: 6 }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 48 }}><Loader2 size={20} className="animate-spin" style={{ color: "var(--text-dim)" }} /></div>
          ) : !data || data.attention.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "44px 20px", color: "var(--text-muted)" }}>
              <Sprout size={26} style={{ color: "var(--accent)" }} />
              <div style={{ fontWeight: 600, color: "var(--text-2)" }}>All clear</div>
              <div style={{ fontSize: 13 }}>Nothing needs a human right now.{data && data.enabled === 0 ? " Enable accounts on the Ownership screen to start." : ""}</div>
            </div>
          ) : (
            data.attention.map(a => (
              <Link key={a.id} href={`/accounts/${a.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderRadius: 12 }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--surface-2)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap",
                    color: STATUS_COLOR[a.status], background: "color-mix(in srgb, currentColor 14%, transparent)",
                    display: "inline-flex", alignItems: "center", gap: 6,
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[a.status] }} />
                    {STATUS_LABEL[a.status]}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700 }}>{a.name}{a.clientName ? <span style={{ color: "var(--text-muted)", fontWeight: 400 }}> · {a.clientName}</span> : null}</div>
                    <div style={{ fontSize: 13, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.reason}</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right", fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 12 }}>
                    <span>{a.ownerName ? `Owner · ${a.ownerName}` : "No owner"}</span>
                    <ArrowRight size={15} style={{ color: "var(--text-dim)" }} />
                  </div>
                </div>
              </Link>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
