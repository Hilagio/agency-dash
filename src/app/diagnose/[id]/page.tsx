"use client";

/**
 * Diagnostic workspace (BUILD-SPEC §9) — the landing page for a flagged account.
 *
 * Value-first, never a chore (§5): it leads with one honest headline, shows the
 * numbers, shows *what it already checked*, and hands the specialist the
 * questions to ask. It never names a cause (§9) — that boundary is printed on
 * the page. From here you can jump to the full analysis if you want to dig.
 */
import { useEffect, useRef, useState, Fragment } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowUpRight, Loader2, CheckCircle2, AlertTriangle, HelpCircle,
  ShieldCheck, Sprout, XCircle, MinusCircle, TrendingUp, ShoppingBag, RefreshCw, ChevronRight, Sparkles,
  Paperclip, X, FileText, Download, Trash2, Plug,
} from "lucide-react";

interface Attachment { name: string; mediaType: string; data: string; kind: "image" | "document" | "text" }
interface DocMeta { id: string; title: string; docType: string; format: "doc" | "deck"; language: string; filename: string; createdBy: string | null; createdAt: string }
interface Connections { googleAds: string; merchantCenter: string; shopify: string; shopifySource: string | null; shopifyUploadedAt: string | null; shopifyCsvRange: { start: string | null; end: string | null } | null; slack: string; slackConfigured: boolean; slackChannelName: string | null; context: string; contextFilled: number; contextTotal: number }
interface SlackChannel { id: string; name: string; isPrivate: boolean; memberCount?: number }

// The context we ask the team to fill so the agent knows the client — the things
// the data can't tell it. Keys map to the ClientContext / Typeform fields.
const CONTEXT_QUESTIONS: { key: string; q: string }[] = [
  { key: "goal", q: "What does this client want to achieve?" },
  { key: "mainKpi", q: "Their main KPI for us to hit?" },
  { key: "targetRoasNote", q: "Target ROAS — and have they hit it before?" },
  { key: "makeOrBreak", q: "The one make-or-break factor for this client?" },
  { key: "usps", q: "What makes them different (USPs)?" },
  { key: "audienceNuances", q: "Audiences the algorithm must learn separately?" },
  { key: "adsStartedNote", q: "When did their Google Ads start spending?" },
  { key: "strategyPreference", q: "Scale aggressively, cautiously, or balanced?" },
  { key: "anythingElse", q: "Anything else / constraints (stock, seasonality…)?" },
];
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB/file, ≤4 files — base64 stays under the 32MB request cap

/** Read a File into a base64 Attachment for the chat. Images, PDF, and text/CSV. */
async function fileToAttachment(file: File): Promise<Attachment> {
  if (file.size > MAX_FILE_BYTES) throw new Error(`${file.name} is too large (max 8 MB).`);
  const bytes = new Uint8Array(await file.arrayBuffer());
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const data = btoa(bin);
  const mt = file.type || "";
  const kind: Attachment["kind"] | null =
    mt.startsWith("image/") ? "image"
    : mt === "application/pdf" ? "document"
    : (mt.startsWith("text/") || /\.(csv|tsv|txt|md|json)$/i.test(file.name)) ? "text"
    : null;
  if (!kind) throw new Error(`${file.name}: unsupported type — attach an image, PDF, or CSV/text file.`);
  return { name: file.name, mediaType: mt || "text/plain", data, kind };
}

/** Minimal inline markdown: render **bold** segments safely as React nodes. */
function renderInline(text: string): React.ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} style={{ color: "var(--text)" }}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>);
}

/**
 * Block-level markdown for the Expert read. Handles the shapes the model
 * actually emits — `**The read**` / `**1. Likely why**` section headers, `---`
 * rules, `#` headings, `-`/`*`/`1.` bullets — instead of dumping raw asterisks.
 */
// Pull the first number out of a cell ("€4,200" → 4200, "41%" → 41, "3.1 → 1.9"
// → 3.1) so numeric columns can get a proportional trend bar. null = not numeric.
function cellNum(s: string): number | null {
  const m = s.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}
const isTableRow = (l: string) => /^\|.*\|.*$/.test(l.trim());
const isTableSep = (l: string) => { const t = l.trim(); return /^[|\s:-]+$/.test(t) && t.includes("-") && t.includes("|"); };
const splitCells = (l: string) => l.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim());

/** Render a GitHub-style markdown table with a proportional mini-bar behind each
 * numeric column — the bar is scaled from the real cell values, so it can never
 * show anything the numbers don't. */
function renderTable(header: string[], rows: string[][], key: number): React.ReactNode {
  const cols = header.length;
  // A column is "numeric" (gets bars, right-aligned) if most of its cells parse.
  const colMax: (number | null)[] = [];
  const colNumeric: boolean[] = [];
  for (let c = 0; c < cols; c++) {
    const nums = rows.map(r => cellNum(r[c] ?? "")).filter((n): n is number => n != null);
    colNumeric[c] = nums.length >= Math.max(2, Math.ceil(rows.length / 2));
    colMax[c] = nums.length ? Math.max(...nums.map(Math.abs)) : null;
  }
  return (
    <div key={key} style={{ overflowX: "auto", margin: "10px 0 12px" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12.5 }}>
        <thead>
          <tr>
            {header.map((h, c) => (
              <th key={c} style={{ textAlign: colNumeric[c] ? "right" : "left", padding: "5px 10px", borderBottom: "1px solid var(--border-2)", color: "var(--text-2)", fontWeight: 600, whiteSpace: "nowrap" }}>{renderInline(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {Array.from({ length: cols }).map((_, c) => {
                const cell = r[c] ?? "";
                const val = colNumeric[c] ? cellNum(cell) : null;
                const max = colMax[c];
                const w = val != null && max && max > 0 ? Math.max(2, Math.round((Math.abs(val) / max) * 100)) : 0;
                return (
                  <td key={c} style={{ padding: "5px 10px", borderBottom: "1px solid var(--border-3, var(--border-2))", textAlign: colNumeric[c] ? "right" : "left", verticalAlign: "middle", color: "var(--text)", whiteSpace: "nowrap" }}>
                    <span>{renderInline(cell)}</span>
                    {w > 0 && (
                      <span style={{ display: "block", height: 3, marginTop: 3, borderRadius: 2, background: "var(--accent)", opacity: 0.55, width: `${w}%`, marginLeft: "auto" }} />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderMarkdown(md: string): React.ReactNode {
  const blocks: React.ReactNode[] = [];
  let k = 0;
  const lines = md.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) continue;
    // Table: a header row, a |---|---| separator, then body rows.
    if (isTableRow(line) && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const header = splitCells(line);
      const rows: string[][] = [];
      let j = i + 2;
      for (; j < lines.length && isTableRow(lines[j]) && !isTableSep(lines[j]); j++) {
        rows.push(splitCells(lines[j]));
      }
      blocks.push(renderTable(header, rows, k++));
      i = j - 1;
      continue;
    }
    // Horizontal rule (---, ***, ___, or a stray --).
    if (/^([-*_])\1+$/.test(line) || line === "--") {
      blocks.push(<hr key={k++} style={{ border: "none", borderTop: "1px solid var(--border-2)", margin: "13px 0" }} />);
      continue;
    }
    // Markdown heading (# … ######).
    let m = line.match(/^#{1,6}\s+(.*)$/);
    if (m) {
      blocks.push(<div key={k++} style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3, color: "var(--accent)", margin: "16px 0 6px" }}>{renderInline(m[1])}</div>);
      continue;
    }
    // A line that is entirely bold → treat as a section header, dropping any
    // leading ordinal ("**1. The read**" → "THE READ").
    m = line.match(/^\*\*(.+?)\*\*[:.]?$/);
    if (m) {
      const label = m[1].replace(/^\d+[.)]\s*/, "");
      blocks.push(<div key={k++} style={{ fontSize: 12.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--accent)", margin: "16px 0 7px" }}>{renderInline(label)}</div>);
      continue;
    }
    // List item (-, *, or 1.).
    m = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (m) {
      blocks.push(
        <div key={k++} style={{ display: "flex", gap: 9, margin: "0 0 6px", alignItems: "flex-start" }}>
          <span style={{ color: "var(--accent)", lineHeight: 1.6, flexShrink: 0 }}>•</span>
          <span style={{ flex: 1 }}>{renderInline(m[1])}</span>
        </div>
      );
      continue;
    }
    // Paragraph.
    blocks.push(<p key={k++} style={{ margin: "0 0 10px" }}>{renderInline(line)}</p>);
  }
  return blocks;
}

/** Consume the insight SSE stream, accumulating text and firing handlers. */
async function consumeInsightStream(
  body: ReadableStream<Uint8Array>,
  h: { onText: (acc: string) => void; onReset: () => void; onStatus: (s: string) => void; onError: (e: string) => void; onTools?: (t: { name: string; ok: boolean }[]) => void; onSuggestions?: (s: string[]) => void },
): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "", acc = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const parts = buf.split("\n\n");
    buf = parts.pop() ?? "";
    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload) continue;
      let ev: { text?: string; error?: string; status?: string; reset?: boolean; toolsUsed?: { name: string; ok: boolean }[]; suggestions?: string[] };
      try { ev = JSON.parse(payload); } catch { continue; }
      if (ev.error) h.onError(ev.error);
      else if (ev.reset) { acc = ""; h.onReset(); }
      else if (ev.toolsUsed) h.onTools?.(ev.toolsUsed);
      else if (ev.suggestions) h.onSuggestions?.(ev.suggestions);
      else if (ev.status) h.onStatus(ev.status);
      else if (ev.text) { acc += ev.text; h.onText(acc); }
    }
  }
  return acc;
}

interface Msg { id?: string; role: "assistant" | "user"; content: string; kind?: string; tools?: { name: string; ok: boolean }[] }

// Friendly labels for the live data tools, so a real pull is shown to the team.
// "3d ago" / "today" — for showing how fresh an uploaded CSV is.
function agoLabel(iso: string | null): string {
  if (!iso) return "";
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return d <= 0 ? "today" : d === 1 ? "1d ago" : `${d}d ago`;
}

const TOOL_LABELS: Record<string, string> = {
  get_impression_share: "impression share",
  get_campaign_overview: "campaign structure",
  get_change_history: "change history",
  get_search_terms: "search terms",
  get_shopify_data: "Shopify orders",
  get_slack_context: "client Slack channel",
  consult_playbook: "agency playbook",
};

// One-click follow-ups so the team can steer without typing.
const PRESET_QUESTIONS = [
  "What should we check first?",
  "What's the single highest-leverage fix?",
  "What would confirm your hypothesis?",
  "How does this compare to similar accounts?",
  "Draft the next steps for the team",
  "Summarise this for the client",
];

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
interface WindowRow {
  days: number; coverageDays: number; partial: boolean;
  spend: number; conversions: number; roas: number | null;
  orders: number | null; revenue: number | null; poas: number | null;
}
interface Trend { acuteDrop: boolean; spendSpike: boolean; note: string | null; }
interface ShopifyStatus { appConfigured: boolean; connected: boolean; shopDomain: string | null; lastSyncAt: string | null; }
interface TrackingStatus { status: "verified" | "broken" | null; note: string | null; setAt: string | null; setBy: string | null; }
interface ProductPage { url: string; name: string; spend: number; clicks: number; conversions: number; conversionValue: number; roas: number | null; }
interface VariantLine {
  variantKey: string; label: string;
  spend: number; clicks: number; adConversions: number;
  units: number; revenue: number; poas: number | null; thin: boolean; spendNoSales: boolean;
}
interface ProductGroup {
  productKey: string; title: string;
  spend: number; clicks: number; adConversions: number;
  units: number; revenue: number; poas: number | null; roas: number | null;
  variantCount: number; thinVariantCount: number; variants: VariantLine[];
  excludeCandidate: boolean; excludeReason: string | null;
  wastedSpend: number; underperformReason: string | null;
}
interface ProductDiagnostic {
  groups: ProductGroup[];
  excludeCandidates: ProductGroup[];
  underperformers: ProductGroup[];
  concentration: { topShare: number; top3Share: number; productCount: number; breadth: "concentrated" | "balanced" | "broad" | "unknown" };
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
  const search = useSearchParams();
  const [diag, setDiag] = useState<Diagnosis | null>(null);
  const [windows, setWindows] = useState<WindowRow[]>([]);
  const [trend, setTrend] = useState<Trend | null>(null);
  const [shopify, setShopify] = useState<ShopifyStatus | null>(null);
  const [connections, setConnections] = useState<Connections | null>(null);
  const [ctxOpen, setCtxOpen] = useState(false);
  const [ctxValues, setCtxValues] = useState<Record<string, string>>({});
  const [ctxLoading, setCtxLoading] = useState(false);
  const [ctxSaving, setCtxSaving] = useState(false);
  // Inline Slack-channel linking — connect the client's channel without leaving the chat.
  const [slackOpen, setSlackOpen] = useState(false);
  const [slackChannels, setSlackChannels] = useState<SlackChannel[]>([]);
  const [slackLoading, setSlackLoading] = useState(false);
  const [slackSaving, setSlackSaving] = useState<string | null>(null);
  const [slackErr, setSlackErr] = useState<string | null>(null);
  const [slackFilter, setSlackFilter] = useState("");
  // Manual Shopify CSV upload (the no-API fallback).
  const [csvBusy, setCsvBusy] = useState(false);
  const [csvMsg, setCsvMsg] = useState<string | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<ProductDiagnostic | null>(null);
  const [productPages, setProductPages] = useState<ProductPage[]>([]);
  const [wins, setWins] = useState<string[]>([]);
  // The persisted agent conversation (§agent memory): one ongoing thread.
  const [thread, setThread] = useState<Msg[]>([]);
  const [convoLoaded, setConvoLoaded] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const connRef = useRef<HTMLDivElement>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightErr, setInsightErr] = useState<string | null>(null);
  const [insightStatus, setInsightStatus] = useState<string | null>(null);
  const [followInput, setFollowInput] = useState("");
  const [followSending, setFollowSending] = useState(false);
  const [pending, setPending] = useState<Attachment[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  // Quick-answer to the agent's closing question (Yes → "what changed?").
  const [whatChanged, setWhatChanged] = useState<string | null>(null);
  // Brand document generation (§agent → files out).
  const [docOpen, setDocOpen] = useState(false);
  const [docBusy, setDocBusy] = useState(false);
  const [docErr, setDocErr] = useState<string | null>(null);
  const [docFocus, setDocFocus] = useState("");
  const [docFormat, setDocFormat] = useState<"doc" | "deck">("doc");
  const [docLang, setDocLang] = useState<"en" | "nl">("nl");
  const [library, setLibrary] = useState<DocMeta[]>([]);
  const [tracking, setTracking] = useState<TrackingStatus | null>(null);
  const [trackingSaving, setTrackingSaving] = useState<"verified" | "broken" | "clear" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shopDomain, setShopDomain] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); if (n.has(k)) n.delete(k); else n.add(k); return n; });

  async function load() {
    try {
      const r = await fetch(`/api/diagnostics/account/${id}`, { credentials: "include" });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setError(j.error ? `${j.error} (HTTP ${r.status})` : `Request failed (HTTP ${r.status})`);
        setLoading(false);
        return;
      }
      const j = await r.json();
      setError(null);
      setDiag(j.diagnosis);
      setWindows(j.windows ?? []);
      setTrend(j.trend ?? null);
      setShopify(j.shopify ?? null);
      setConnections(j.connections ?? null);
      setProducts(j.products ?? null);
      setProductPages(j.productPages ?? []);
      setWins(j.wins ?? []);
      setTracking(j.tracking ?? null);
    } catch (e) { setError(e instanceof Error ? e.message : "Network error"); }
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // The platform speaks first (§agent): on a flagged account, auto-open the
  // conversation so the teammate lands on "here's what I noticed", not a button —
  // and the analytical sections collapse to "evidence" behind the conversation.
  // On a green account there's nothing to talk about, so show the numbers.
  const inited = useRef(false);
  useEffect(() => {
    if (inited.current || !diag || !convoLoaded) return;
    inited.current = true;
    const flagged = diag.status === "yellow" || diag.status === "red";
    // Flagged + no conversation yet → the agent speaks first. Flagged with an
    // existing thread → show it (don't re-generate). Green → show the numbers.
    if (flagged && thread.length === 0 && !insightLoading) getInsight();
    else if (!flagged) setDetailsOpen(true);
  }, [diag, convoLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  function connectShopify() {
    const shop = shopDomain.trim();
    if (!shop) return;
    window.location.href = `/api/shopify/install?accountId=${encodeURIComponent(id)}&shop=${encodeURIComponent(shop)}`;
  }
  async function syncNow() {
    setSyncing(true);
    try {
      await fetch(`/api/shopify/sync`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: id, days: 60 }),
      });
      await load();
    } finally { setSyncing(false); }
  }

  const [refreshing, setRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState<string | null>(null);
  async function refreshData() {
    setRefreshing(true); setRefreshMsg(null);
    try {
      const r = await fetch(`/api/diagnostics/account/${id}/refresh`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 30 }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.error) {
        setRefreshMsg(`Couldn't pull data: ${j.error ?? `HTTP ${r.status}`}`);
      } else if (!j.ok) {
        setRefreshMsg("Google Ads returned no data for this window (is the account active?).");
      } else {
        setRefreshMsg(`Pulled ${j.pulled?.metricDays ?? 0} metric-days, ${j.pulled?.productRows ?? 0} product rows · Shopify: ${j.pulled?.shopify ?? "—"}.`);
      }
      await load();
    } catch (e) {
      setRefreshMsg(e instanceof Error ? e.message : "Network error");
    } finally { setRefreshing(false); }
  }

  // Keep the conversation pinned to the latest message as it streams — but only
  // if the reader is already near the bottom, so scrolling up to re-read holds.
  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 140) el.scrollTop = el.scrollHeight;
  }, [thread]);

  // Load the persisted conversation so a read survives refresh and the next
  // teammate sees the thread + the context already fed in.
  async function loadConversation() {
    try {
      const r = await fetch(`/api/diagnostics/account/${id}/conversation`, { credentials: "include" });
      if (r.ok) {
        const j = await r.json();
        setThread((j.messages ?? []).map((m: Msg) => ({ id: m.id, role: m.role, content: m.content, kind: m.kind })));
      }
    } catch { /* leave empty */ }
    setConvoLoaded(true);
  }
  useEffect(() => { loadConversation(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stream one agent turn into the thread. Appends an assistant placeholder and
  // streams into it; the server persists both sides. Returns whether fresh data
  // was pulled (so we can refresh the cockpit numbers).
  async function runStream(reqBody: Record<string, unknown>): Promise<boolean> {
    setInsightErr(null); setSuggestions([]);
    setThread(prev => [...prev, { role: "assistant", content: "" }]);
    const setLast = (next: string) => setThread(prev => {
      const copy = prev.slice();
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === "assistant") { copy[i] = { ...copy[i], content: next }; break; }
      }
      return copy;
    });
    let pulled = false;
    try {
      const r = await fetch(`/api/diagnostics/account/${id}/insight`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify(reqBody),
      });
      if (!r.ok || !r.body || !r.headers.get("content-type")?.includes("text/event-stream")) {
        const j = await r.json().catch(() => ({}));
        setInsightErr(j.error ?? `HTTP ${r.status}`);
        setThread(prev => prev.filter((m, i) => !(i === prev.length - 1 && m.role === "assistant" && !m.content)));
        return false;
      }
      await consumeInsightStream(r.body, {
        onReset: () => setLast(""),
        onText: (acc) => { setInsightStatus(null); setLast(acc); },
        onStatus: (s) => {
          if (s === "refreshing") { setInsightStatus("Pulling the latest Google Ads + Shopify data…"); pulled = true; }
          else if (s === "reading") setInsightStatus("Reading across 7/14/30/60/90-day windows…");
          else if (s === "thinking") setInsightStatus("Thinking…");
          else setInsightStatus(s); // tool-use labels ("Checking impression share…")
        },
        onTools: (t) => setThread(prev => {
          const copy = prev.slice();
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].role === "assistant") { copy[i] = { ...copy[i], tools: t }; break; }
          }
          return copy;
        }),
        onSuggestions: (s) => setSuggestions(s),
        onError: (e) => setInsightErr(e),
      });
    } catch (e) {
      setInsightErr(e instanceof Error ? e.message : "Failed");
      setThread(prev => prev.filter((m, i) => !(i === prev.length - 1 && m.role === "assistant" && !m.content)));
    }
    return pulled;
  }

  // Fresh read — pulls the latest data and opens (or re-opens) the read. With an
  // existing thread it comes back as an updated read that remembers.
  async function getInsight() {
    if (insightLoading || followSending) return;
    setInsightLoading(true); setInsightStatus("Pulling fresh data…");
    const pulled = await runStream({});
    setInsightLoading(false); setInsightStatus(null);
    if (pulled) load();
  }

  // Read picked files into pending attachments (deduped, capped at 6).
  async function onPickFiles(files: FileList | null) {
    if (!files?.length) return;
    setInsightErr(null);
    const added: Attachment[] = [];
    for (const f of Array.from(files)) {
      try { added.push(await fileToAttachment(f)); }
      catch (e) { setInsightErr(e instanceof Error ? e.message : "Couldn't read file"); }
    }
    if (added.length) setPending(prev => [...prev, ...added].slice(0, 4));
  }

  // Feed the agent context it can't see — typed ("payments were down") or as
  // files (Merchant Center screenshot, a report). No Google Ads re-pull; the
  // agent's takeaway is persisted so the thread remembers it.
  async function askFollowup() {
    const q = followInput.trim();
    const atts = pending;
    if ((!q && atts.length === 0) || followSending || insightLoading) return;
    setFollowSending(true); setInsightErr(null); setFollowInput(""); setPending([]); setWhatChanged(null);
    const label = q + (atts.length ? `${q ? "  " : ""}📎 ${atts.map(a => a.name).join(", ")}` : "");
    setThread(prev => [...prev, { role: "user", content: label }]);
    await runStream({ followup: q, attachments: atts });
    setFollowSending(false);
  }

  // One-click preset / quick-answer — sends without typing.
  async function sendPreset(text: string) {
    if (followSending || insightLoading) return;
    setFollowSending(true); setInsightErr(null); setWhatChanged(null);
    setThread(prev => [...prev, { role: "user", content: text }]);
    await runStream({ followup: text });
    setFollowSending(false);
  }

  // Add-context form — the questions the data can't answer.
  async function openContextForm() {
    setCtxOpen(true); setCtxLoading(true);
    try {
      const r = await fetch(`/api/accounts/${id}/context`, { credentials: "include" });
      if (r.ok) {
        const j = await r.json();
        const pack = j.context ?? {};
        const vals: Record<string, string> = {};
        for (const { key } of CONTEXT_QUESTIONS) vals[key] = pack[key] ?? "";
        setCtxValues(vals);
      }
    } catch { /* start blank */ }
    setCtxLoading(false);
  }
  async function saveContext() {
    setCtxSaving(true);
    try {
      await fetch(`/api/accounts/${id}/context`, {
        method: "PUT", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ctxValues),
      });
      setCtxOpen(false);
      load(); // refresh the connections completeness
    } finally { setCtxSaving(false); }
  }

  // Link the client's Slack channel from inside the chat — the agent reads it
  // for off-platform context (a promo, a checkout change, a payment switch).
  async function openSlackLink() {
    setSlackOpen(true); setSlackErr(null);
    if (slackChannels.length) return; // already loaded
    setSlackLoading(true);
    try {
      const r = await fetch(`/api/integrations/slack/channels`, { credentials: "include" });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) setSlackErr(j.error === "Slack not connected" ? "No Slack workspace is connected for your organisation yet — add the bot token in Settings → Slack, then link a channel here." : (j.error ?? "Couldn't load Slack channels."));
      else setSlackChannels(j.channels ?? []);
    } catch { setSlackErr("Couldn't reach Slack."); }
    setSlackLoading(false);
  }
  async function linkSlackChannel(ch: SlackChannel | null) {
    setSlackSaving(ch?.id ?? "unlink"); setSlackErr(null);
    try {
      const r = await fetch(`/api/accounts/${id}`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slackChannelId: ch?.id ?? null, slackChannelName: ch?.name ?? null }),
      });
      if (!r.ok) { setSlackErr("Couldn't save the channel."); return; }
      setSlackOpen(false);
      load(); // refresh the connections strip
    } catch { setSlackErr("Couldn't save the channel."); }
    finally { setSlackSaving(null); }
  }

  // Upload a Shopify "Sales over time" CSV — the data is kept and reconciled
  // against until it's replaced; the server stamps when it was uploaded.
  async function uploadShopifyCsv(file: File) {
    setCsvBusy(true); setCsvMsg(null);
    try {
      const csv = await file.text();
      const r = await fetch(`/api/diagnostics/account/${id}/shopify-csv`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "daily_sales", csv }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setCsvMsg(j.error ?? "Upload failed."); return; }
      setCsvMsg(`Loaded ${j.rows} days${j.rangeStart ? ` (${j.rangeStart} → ${j.rangeEnd})` : ""}.${j.skipped ? ` Skipped ${j.skipped} unreadable rows.` : ""}`);
      load();
    } catch { setCsvMsg("Couldn't read that file."); }
    finally { setCsvBusy(false); if (csvInputRef.current) csvInputRef.current.value = ""; }
  }

  function scrollToConn() { connRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }
  // Turn a "No data — not connected" tool result into a one-click connect action
  // right inside the conversation, so a missing source is fixable on the spot.
  function connectActions(tools: { name: string; ok: boolean }[]) {
    const notOk = new Set(tools.filter(t => !t.ok).map(t => t.name));
    const actions: { key: string; label: string; onClick: () => void }[] = [];
    if (notOk.has("get_slack_context") && connections?.slack !== "green") {
      actions.push({ key: "slack", label: connections?.slackConfigured ? "Link Slack channel" : "Connect Slack", onClick: () => { openSlackLink(); scrollToConn(); } });
    }
    if (notOk.has("get_shopify_data") && connections?.shopify !== "green") {
      actions.push({ key: "shopify", label: "Connect Shopify", onClick: () => { setDetailsOpen(true); scrollToConn(); } });
    }
    return actions;
  }

  // Wipe the conversation and start over.
  async function clearConversation() {
    if (insightLoading || followSending) return;
    await fetch(`/api/diagnostics/account/${id}/conversation`, { method: "DELETE", credentials: "include" }).catch(() => null);
    setThread([]); setInsightErr(null);
  }

  // Download an HTML deliverable and open a preview tab.
  function deliverHtml(html: string, filename: string) {
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    const a = document.createElement("a"); a.href = url; a.download = filename || "ecomtrada-document.html"; a.click();
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  async function loadLibrary() {
    try {
      const r = await fetch(`/api/diagnostics/account/${id}/documents`, { credentials: "include" });
      if (r.ok) { const j = await r.json(); setLibrary(j.docs ?? []); }
    } catch { /* leave empty */ }
  }
  useEffect(() => { loadLibrary(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Generate a client-ready brand document (findings / report / deck) from the
  // conversation + data, save it to the library, download it, open a preview.
  async function generateDocument() {
    if (docBusy) return;
    setDocBusy(true); setDocErr(null);
    try {
      const r = await fetch(`/api/diagnostics/account/${id}/document`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: docFocus.trim(), format: docFormat, language: docLang }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.html) { setDocErr(j.error ?? `HTTP ${r.status}`); return; }
      deliverHtml(j.html, j.filename);
      if (j.saved) setLibrary(prev => [j.saved as DocMeta, ...prev]);
      setDocFocus("");
    } catch (e) { setDocErr(e instanceof Error ? e.message : "Failed"); }
    finally { setDocBusy(false); }
  }

  // Reopen (or re-download) a saved deliverable from the library.
  async function openSavedDoc(docId: string, filename: string) {
    try {
      const r = await fetch(`/api/diagnostics/account/${id}/documents/${docId}`, { credentials: "include" });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.html) deliverHtml(j.html, j.filename || filename);
      else setDocErr(j.error ?? "Couldn't open that document.");
    } catch { setDocErr("Couldn't open that document."); }
  }

  async function deleteSavedDoc(docId: string) {
    setLibrary(prev => prev.filter(d => d.id !== docId));
    await fetch(`/api/diagnostics/account/${id}/documents/${docId}`, { method: "DELETE", credentials: "include" }).catch(() => null);
  }

  // Record the team's tracking verdict, then re-run the read so it reasons from
  // certainty. Clearing (null) drops back to "unknown".
  async function setTrackingStatus(status: "verified" | "broken" | null) {
    setTrackingSaving(status ?? "clear");
    try {
      const r = await fetch(`/api/diagnostics/account/${id}/tracking`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.tracking) {
        setTracking({ status: j.tracking.trackingStatus, note: j.tracking.trackingNote, setAt: j.tracking.trackingSetAt, setBy: j.tracking.trackingSetBy });
        // Re-reason if a conversation is already on screen — a fresh read that
        // now reasons from the confirmed tracking verdict, keeping the thread.
        if (thread.length > 0 || insightErr) await getInsight();
      }
    } finally { setTrackingSaving(null); }
  }

  const shopifyMsg = search.get("shopify");
  const shopifyReason = search.get("reason");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{
        display: "flex", alignItems: "center", gap: 16, height: 58, padding: "0 26px",
        position: "sticky", top: 0, zIndex: 9, background: "var(--header-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-3)", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
          <ArrowLeft size={15} /> Portfolio
        </Link>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={refreshData} disabled={refreshing} style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600,
            color: "#fff", border: "none", background: "var(--btn-primary, var(--accent))", padding: "7px 14px", borderRadius: 8, cursor: refreshing ? "default" : "pointer",
          }}>
            {refreshing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} {refreshing ? "Pulling…" : "Refresh data"}
          </button>
          <Link href={`/plan/${id}`} style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, textDecoration: "none",
            color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 35%, var(--border))", background: "var(--accent-dim)", padding: "7px 13px", borderRadius: 8,
          }}>
            <Sparkles size={13} /> 90-day plan
          </Link>
          <Link href={`/accounts/${id}`} style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, textDecoration: "none",
            color: "var(--text-3)", border: "1px solid var(--border-2)", background: "var(--surface)", padding: "7px 13px", borderRadius: 8,
          }}>
            Full analysis <ArrowUpRight size={13} />
          </Link>
        </div>
      </nav>
      {refreshMsg && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "10px 26px 0" }}>
          <div style={{ fontSize: 12.5, padding: "9px 13px", borderRadius: 10, background: "var(--surface-2)", border: "1px solid var(--border-2)", color: "var(--text-3)" }}>{refreshMsg}</div>
        </div>
      )}

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "26px 26px 90px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
            <Loader2 size={22} className="animate-spin" style={{ color: "var(--text-dim)" }} />
          </div>
        ) : error || !diag ? (
          <div style={{ ...card, padding: "40px 28px", textAlign: "center", color: "var(--text-muted)" }}>
            <AlertTriangle size={26} style={{ color: "var(--accent-2)", marginBottom: 10 }} />
            <div style={{ fontWeight: 600, color: "var(--text-2)" }}>Couldn&rsquo;t load this diagnosis</div>
            {error ? (
              <div style={{ fontSize: 13, marginTop: 8, color: "var(--danger)", fontFamily: "ui-monospace, monospace", wordBreak: "break-word", maxWidth: 560, margin: "8px auto 0" }}>{error}</div>
            ) : (
              <div style={{ fontSize: 13, marginTop: 6 }}>The account may not be in the pilot yet, or has no data ingested.</div>
            )}
            <button onClick={() => { setLoading(true); setError(null); load(); }} style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "var(--text-2)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "7px 14px", cursor: "pointer" }}>
              <RefreshCw size={13} /> Retry
            </button>
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
            <div id="overview" style={{
              ...card, border: `1px solid ${diag.status === "green" ? "var(--border)" : "var(--border-2)"}`,
              padding: "20px 22px", marginTop: 16, scrollMarginTop: 116,
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

            {/* Shopify connect / status banner */}
            {shopifyMsg === "connected" && (
              <div style={{ marginTop: 12, padding: "11px 15px", borderRadius: 12, fontSize: 13, color: "var(--accent)", background: "var(--accent-dim)", border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)", display: "flex", alignItems: "center", gap: 9 }}>
                <CheckCircle2 size={15} /> Shopify connected. Click <b>Sync orders</b> below to pull the order history.
              </div>
            )}
            {shopifyMsg === "error" && (
              <div style={{ marginTop: 12, padding: "11px 15px", borderRadius: 12, fontSize: 13, color: "var(--danger)", background: "color-mix(in srgb, var(--danger) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--danger) 30%, transparent)", display: "flex", alignItems: "center", gap: 9 }}>
                <XCircle size={15} /> Shopify connection failed{shopifyReason ? `: ${shopifyReason}` : ""}.
              </div>
            )}

            {/* Section nav — only when the evidence is expanded (its targets live there) */}
            {detailsOpen && (
              <SectionNav items={[
                { id: "overview", label: "Overview" },
                ...(windows.some(w => w.spend > 0) ? [{ id: "trends", label: "Trends" }] : []),
                ...(products && products.groups.length ? [{ id: "products", label: "Products" }] : []),
                ...((diag.observations.length || diag.checksRun.length || diag.questions.length) ? [{ id: "diagnosis", label: "Diagnosis" }] : []),
                ...(shopify ? [{ id: "data", label: "Data & connections" }] : []),
              ]} />
            )}

            {/* Connections & context — what this account knows, at a glance */}
            {connections && (
              <div ref={connRef} style={{ ...card, padding: "12px 15px", marginTop: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--text-muted)", marginRight: 4 }}>Connected</span>
                  <ConnPill label="Google Ads" status={connections.googleAds} note="spend & performance" />
                  <ConnPill label="Merchant Center" status={connections.merchantCenter} note={connections.merchantCenter === "green" ? "feed & products" : "not detected"} />
                  <ConnPill label="Shopify" status={connections.shopify} note={connections.shopifySource === "live" ? (shopify?.shopDomain ?? "live") : connections.shopifySource === "csv" ? `CSV · ${agoLabel(connections.shopifyUploadedAt)}` : "orders & POAS"} onClick={connections.shopifySource === "live" ? undefined : () => csvInputRef.current?.click()} />
                  <ConnPill label="Slack" status={connections.slack} note={connections.slack === "green" ? `#${connections.slackChannelName}` : connections.slackConfigured ? "link a channel" : "not connected"} onClick={connections.slackConfigured ? () => (slackOpen ? setSlackOpen(false) : openSlackLink()) : undefined} />
                  <ConnPill label="Context" status={connections.context} note={`${connections.contextFilled}/${connections.contextTotal} answered`} onClick={openContextForm} />
                </div>

                {/* Manual Shopify CSV — the no-API fallback. Data is kept and used
                    until replaced; we stamp when it was uploaded. */}
                <input ref={csvInputRef} type="file" accept=".csv,text/csv" style={{ display: "none" }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadShopifyCsv(f); }} />
                {connections.shopifySource !== "live" && (
                  <div style={{ marginTop: 9, display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap", fontSize: 11.5, color: "var(--text-muted)" }}>
                    <button onClick={() => csvInputRef.current?.click()} disabled={csvBusy} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: "var(--text-2)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 7, padding: "4px 10px", cursor: csvBusy ? "default" : "pointer" }}>
                      {csvBusy ? <Loader2 size={12} className="animate-spin" /> : <FileText size={12} />} {connections.shopifySource === "csv" ? "Replace Shopify CSV" : "Upload Shopify sales CSV"}
                    </button>
                    {connections.shopifySource === "csv" && connections.shopifyCsvRange && (
                      <span>Using {connections.shopifyCsvRange.start} → {connections.shopifyCsvRange.end}, uploaded {agoLabel(connections.shopifyUploadedAt)}{agoLabel(connections.shopifyUploadedAt) !== "today" && Math.floor((Date.now() - new Date(connections.shopifyUploadedAt ?? 0).getTime()) / 86_400_000) >= 14 ? " — may be stale, consider a fresh export" : ""}</span>
                    )}
                    {csvMsg && <span style={{ color: "var(--text-2)" }}>{csvMsg}</span>}
                    <span style={{ opacity: 0.7 }}>Analytics → Reports → Sales over time (by Day) → Export</span>
                  </div>
                )}

                {/* Inline Slack-channel picker — link the client's channel without leaving the chat */}
                {slackOpen && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-2)" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 3 }}>Link this client&rsquo;s Slack channel</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginBottom: 11 }}>The agent reads it for off-platform context — a promo, a checkout or price change, a payment switch, &ldquo;paused for the holidays.&rdquo; Invite the bot to the channel first if it&rsquo;s not listed.</div>
                    {slackErr && <div style={{ fontSize: 12, color: "var(--danger, #d33)", marginBottom: 10 }}>{slackErr}</div>}
                    {slackLoading ? (
                      <div style={{ fontSize: 12.5, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 8 }}><Loader2 size={13} className="animate-spin" /> Loading channels…</div>
                    ) : slackChannels.length > 0 ? (
                      <>
                        <input value={slackFilter} onChange={e => setSlackFilter(e.target.value)} placeholder="Filter channels…" style={{ width: "100%", fontSize: 12.5, color: "var(--text)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "7px 10px", marginBottom: 8, fontFamily: "inherit" }} />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 180, overflowY: "auto" }}>
                          {slackChannels.filter(c => c.name.toLowerCase().includes(slackFilter.toLowerCase())).slice(0, 60).map(ch => (
                            <button key={ch.id} onClick={() => linkSlackChannel(ch)} disabled={!!slackSaving} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "var(--text-2)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 999, padding: "5px 11px", cursor: slackSaving ? "default" : "pointer" }}>
                              {slackSaving === ch.id ? <Loader2 size={11} className="animate-spin" /> : null}#{ch.name}{ch.isPrivate ? " 🔒" : ""}
                            </button>
                          ))}
                        </div>
                        {connections.slack === "green" && (
                          <button onClick={() => linkSlackChannel(null)} disabled={!!slackSaving} style={{ marginTop: 10, fontSize: 12, fontWeight: 600, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Unlink current channel</button>
                        )}
                      </>
                    ) : !slackErr ? (
                      <div style={{ fontSize: 12.5, color: "var(--text-3)" }}>No channels the bot can see. Invite it to the client&rsquo;s channel with <code>/invite</code>, then reopen this.</div>
                    ) : null}
                  </div>
                )}

                {/* Add-context form — the questions the data can't answer */}
                {ctxOpen && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-2)" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 3 }}>Tell the agent about this client</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginBottom: 11 }}>The things the data can&rsquo;t know — so its read reasons against what the client actually wants. Fill what you can; blanks are fine.</div>
                    {ctxLoading ? (
                      <div style={{ fontSize: 12.5, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 8 }}><Loader2 size={13} className="animate-spin" /> Loading…</div>
                    ) : (
                      <>
                        <div style={{ display: "grid", gap: 10 }}>
                          {CONTEXT_QUESTIONS.map(({ key, q }) => (
                            <div key={key}>
                              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 4 }}>{q}</label>
                              <textarea
                                value={ctxValues[key] ?? ""}
                                onChange={e => setCtxValues(v => ({ ...v, [key]: e.target.value }))}
                                rows={key === "makeOrBreak" || key === "goal" || key === "usps" ? 2 : 1}
                                style={{ width: "100%", resize: "vertical", fontSize: 12.5, lineHeight: 1.5, color: "var(--text)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "7px 10px", fontFamily: "inherit" }}
                              />
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                          <button onClick={saveContext} disabled={ctxSaving} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "#fff", background: "var(--btn-primary, var(--accent))", border: "none", borderRadius: 8, padding: "8px 16px", cursor: ctxSaving ? "default" : "pointer" }}>
                            {ctxSaving ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />} Save context
                          </button>
                          <button onClick={() => setCtxOpen(false)} disabled={ctxSaving} style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-3)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 14px", cursor: "pointer" }}>Cancel</button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Expert read (PPC OS) — the agent conversation; the hero of the page */}
            <div style={{ ...card, border: "1px solid color-mix(in srgb, var(--accent) 30%, var(--border))", padding: "15px 17px", marginTop: 14, background: "linear-gradient(160deg, var(--accent-dim), transparent), var(--surface)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <Sparkles size={16} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: 13.5, fontWeight: 700 }}>Expert read</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>PPC OS</span>
                {thread.length === 0 ? (
                  <button onClick={getInsight} disabled={insightLoading} style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "#fff", background: "var(--btn-primary, var(--accent))", border: "none", borderRadius: 8, padding: "7px 14px", cursor: insightLoading ? "default" : "pointer" }}>
                    {insightLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />} {insightLoading ? "Looking…" : "Start the read"}
                  </button>
                ) : (
                  <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <button onClick={clearConversation} disabled={insightLoading || followSending} title="Clear this conversation and start over" style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-3)", background: "none", border: "none", cursor: insightLoading || followSending ? "default" : "pointer", textDecoration: "underline" }}>Clear</button>
                    <button onClick={() => setDocOpen(o => !o)} title="Turn this into a client-ready document or deck" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: docOpen ? "var(--accent)" : "var(--text-3)", background: "var(--surface-2)", border: `1px solid ${docOpen ? "color-mix(in srgb, var(--accent) 40%, var(--border))" : "var(--border-2)"}`, borderRadius: 7, padding: "5px 10px", cursor: "pointer" }}>
                      <FileText size={12} /> Document
                    </button>
                    <button onClick={getInsight} disabled={insightLoading || followSending} title="Fresh read with the latest data — keeps the conversation" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "var(--text-3)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 7, padding: "5px 10px", cursor: insightLoading || followSending ? "default" : "pointer" }}>
                      {insightLoading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Fresh read
                    </button>
                  </span>
                )}
              </div>
              {insightErr && <div style={{ fontSize: 12.5, color: "var(--danger)", marginTop: 10 }}>{insightErr}</div>}

              {/* Brand document generator — turn the conversation into a client-ready deliverable */}
              {docOpen && thread.length > 0 && (
                <div style={{ marginTop: 12, padding: "13px 14px", borderRadius: 11, background: "var(--surface-2)", border: "1px solid var(--border-2)" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 9, display: "flex", alignItems: "center", gap: 7 }}>
                    <FileText size={14} style={{ color: "var(--accent)" }} /> Create a client-ready document
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
                    <div style={{ display: "inline-flex", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 8, padding: 2 }}>
                      {(["doc", "deck"] as const).map(f => (
                        <button key={f} onClick={() => setDocFormat(f)} style={{ fontSize: 11.5, fontWeight: 600, padding: "5px 11px", borderRadius: 6, border: "none", cursor: "pointer", background: docFormat === f ? "var(--accent)" : "transparent", color: docFormat === f ? "#fff" : "var(--text-3)" }}>{f === "doc" ? "Document" : "Slide deck"}</button>
                      ))}
                    </div>
                    <div style={{ display: "inline-flex", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 8, padding: 2 }}>
                      {(["nl", "en"] as const).map(l => (
                        <button key={l} onClick={() => setDocLang(l)} style={{ fontSize: 11.5, fontWeight: 600, padding: "5px 11px", borderRadius: 6, border: "none", cursor: "pointer", background: docLang === l ? "var(--accent)" : "transparent", color: docLang === l ? "#fff" : "var(--text-3)" }}>{l === "nl" ? "Nederlands" : "English"}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                    <input
                      value={docFocus}
                      onChange={e => setDocFocus(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); generateDocument(); } }}
                      placeholder="What should it cover? (optional — defaults to the findings so far)"
                      disabled={docBusy}
                      style={{ flex: 1, fontSize: 12.5, color: "var(--text)", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "8px 11px" }}
                    />
                    <button onClick={generateDocument} disabled={docBusy} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "#fff", background: "var(--btn-primary, var(--accent))", border: "none", borderRadius: 8, padding: "8px 14px", cursor: docBusy ? "default" : "pointer", whiteSpace: "nowrap" }}>
                      {docBusy ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} />} {docBusy ? "Writing…" : "Generate"}
                    </button>
                  </div>
                  {docErr && <div style={{ fontSize: 12, color: "var(--danger)", marginTop: 8 }}>{docErr}</div>}
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>Downloads an on-brand HTML file (opens in the browser; ⌘P → Save as PDF to share). Every generation is saved to the library below.</div>

                  {/* Library — versioned deliverables for this account */}
                  {library.length > 0 && (
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border-2)" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: "var(--text-muted)", marginBottom: 9 }}>Library · {library.length}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {library.map(d => (
                          <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border-2)" }}>
                            <FileText size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
                            <span style={{ flex: 1, minWidth: 0 }}>
                              <span style={{ fontSize: 12.5, fontWeight: 600, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.title}</span>
                              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                                {d.docType} · {d.format === "deck" ? "deck" : "doc"} · {d.language.toUpperCase()} · {new Date(d.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}{d.createdBy ? ` · ${d.createdBy}` : ""}
                              </span>
                            </span>
                            <button onClick={() => openSavedDoc(d.id, d.filename)} title="Open / download" style={{ display: "inline-flex", padding: 5, background: "none", border: "none", cursor: "pointer", color: "var(--text-3)" }}><Download size={14} /></button>
                            <button onClick={() => deleteSavedDoc(d.id)} title="Delete" style={{ display: "inline-flex", padding: 5, background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)" }}><Trash2 size={13} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* The persisted conversation — scrolls within a fixed height once
                  it grows past a few turns, so the composer stays in view. */}
              {thread.length > 0 && (
                <div ref={threadRef} style={{ maxHeight: "min(58vh, 620px)", overflowY: "auto", marginRight: -6, paddingRight: 6 }}>
                  {thread.map((m, i) => (
                    m.role === "user" ? (
                      <div key={m.id ?? i} style={{ fontSize: 12.5, color: "var(--text-2)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 9, padding: "8px 11px", marginTop: 12 }}>
                        <span style={{ fontWeight: 700, color: "var(--text-3)" }}>You: </span>{m.content}
                      </div>
                    ) : (
                      <div key={m.id ?? i} style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-2)", marginTop: 12 }}>
                        {m.content
                          ? renderMarkdown(m.content)
                          : <div style={{ fontSize: 12.5, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 8 }}><Loader2 size={13} className="animate-spin" style={{ color: "var(--accent)" }} /> {insightStatus ?? "Reading…"}</div>}
                        {m.tools && m.tools.length > 0 && (
                          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {m.tools.some(t => t.ok) && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--accent)", background: "var(--accent-dim)", border: "1px solid color-mix(in srgb, var(--accent) 25%, var(--border))", borderRadius: 7, padding: "3px 9px" }} title="Live sources this read actually pulled data from">
                                <CheckCircle2 size={12} /> Pulled live: {m.tools.filter(t => t.ok).map(t => TOOL_LABELS[t.name] ?? t.name).join(", ")}
                              </span>
                            )}
                            {m.tools.some(t => !t.ok) && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-muted)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 7, padding: "3px 9px" }} title="Checked, but the source returned no data (e.g. not connected)">
                                <MinusCircle size={12} /> No data: {m.tools.filter(t => !t.ok).map(t => TOOL_LABELS[t.name] ?? t.name).join(", ")}
                              </span>
                            )}
                            {/* Connect it right here — turn a missing source into a one-click fix in the chat */}
                            {connectActions(m.tools).map(a => (
                              <button key={a.key} onClick={a.onClick} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: "var(--accent)", background: "var(--accent-dim)", border: "1px solid color-mix(in srgb, var(--accent) 25%, var(--border))", borderRadius: 7, padding: "3px 9px", cursor: "pointer" }}>
                                <Plug size={12} /> {a.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  ))}
                </div>
              )}

              {thread.length === 0 && !insightErr && !insightLoading && (
                <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 8 }}>I&rsquo;ll open with what I noticed on this account and my best hypothesis, then we figure it out together — grounded in your PPC OS methodology.</div>
              )}

              {/* Composer — feed the agent context (typed or as files), ask,
                  steer. It reads screenshots/PDFs/CSVs and remembers. */}
              {thread.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  {/* Quick answer to the agent's closing question — Yes/No/Not sure,
                      and Yes opens a "what changed?" box. Shown when its last
                      message ends on a question. */}
                  {!insightLoading && !followSending && thread[thread.length - 1]?.role === "assistant" && /\?\s*$/.test(thread[thread.length - 1].content.trim()) && (
                    <div style={{ marginBottom: 10 }}>
                      {whatChanged === null ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 600 }}>Quick answer:</span>
                          <button onClick={() => setWhatChanged("")} style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", background: "var(--accent-dim)", border: "1px solid color-mix(in srgb, var(--accent) 35%, var(--border))", borderRadius: 999, padding: "5px 14px", cursor: "pointer" }}>Yes</button>
                          <button onClick={() => sendPreset("No — nothing changed that we're aware of.")} style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 999, padding: "5px 14px", cursor: "pointer" }}>No</button>
                          <button onClick={() => sendPreset("I'm not sure — I'd have to check.")} style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 999, padding: "5px 14px", cursor: "pointer" }}>I&rsquo;m not sure</button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <input
                            autoFocus
                            value={whatChanged}
                            onChange={e => setWhatChanged(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); sendPreset(`Yes — ${(whatChanged || "").trim() || "something changed"}.`); } if (e.key === "Escape") setWhatChanged(null); }}
                            placeholder="What changed? (e.g. payment provider was down 3–10 July, checkout broke, stock-out…)"
                            style={{ flex: 1, fontSize: 12.5, color: "var(--text)", background: "var(--surface-2)", border: "1px solid color-mix(in srgb, var(--accent) 30%, var(--border-2))", borderRadius: 9, padding: "8px 11px" }}
                          />
                          <button onClick={() => sendPreset(`Yes — ${(whatChanged || "").trim() || "something changed"}.`)} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, color: "#fff", background: "var(--btn-primary, var(--accent))", border: "none", borderRadius: 8, padding: "8px 13px", cursor: "pointer", whiteSpace: "nowrap" }}>
                            <Sparkles size={13} /> Send
                          </button>
                          <button onClick={() => setWhatChanged(null)} title="Cancel" style={{ display: "inline-flex", padding: 6, background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)" }}><X size={15} /></button>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Follow-up chips — dynamic to this conversation when available,
                      otherwise a sensible default set. Steer with one click. */}
                  {!insightLoading && !followSending && thread[thread.length - 1]?.role === "assistant" && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 9 }}>
                      {(suggestions.length ? suggestions : PRESET_QUESTIONS).map(q => (
                        <button key={q} onClick={() => sendPreset(q)} style={{ fontSize: 11.5, fontWeight: 500, color: "var(--text-2)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 999, padding: "5px 12px", cursor: "pointer", whiteSpace: "nowrap" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 40%, var(--border))"; e.currentTarget.style.color = "var(--text)"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.color = "var(--text-2)"; }}>
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                  {pending.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 8 }}>
                      {pending.map((a, i) => (
                        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--text-2)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 7, padding: "4px 8px" }}>
                          {a.kind === "image" ? <FileText size={12} style={{ color: "var(--accent)" }} /> : <FileText size={12} style={{ color: "var(--text-3)" }} />}
                          <span style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                          <button onClick={() => setPending(prev => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-dim)", display: "inline-flex", padding: 0 }}><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                    <label title="Attach a screenshot, PDF, or CSV" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, flexShrink: 0, borderRadius: 9, border: "1px solid var(--border-2)", background: "var(--surface-2)", cursor: followSending || insightLoading ? "default" : "pointer", color: "var(--text-3)" }}>
                      <Paperclip size={15} />
                      <input type="file" multiple accept="image/*,application/pdf,.csv,.tsv,.txt,.md,.json" disabled={followSending || insightLoading}
                        onChange={e => { onPickFiles(e.target.files); e.target.value = ""; }} style={{ display: "none" }} />
                    </label>
                    <textarea
                      value={followInput}
                      onChange={e => setFollowInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askFollowup(); } }}
                      placeholder="Tell it what it can't see, attach a screenshot/report, or ask a question…"
                      rows={1}
                      disabled={followSending || insightLoading}
                      style={{ flex: 1, resize: "none", fontSize: 12.5, lineHeight: 1.5, color: "var(--text)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 9, padding: "8px 11px", fontFamily: "inherit", minHeight: 36 }}
                    />
                    <button onClick={askFollowup} disabled={followSending || insightLoading || (!followInput.trim() && pending.length === 0)} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 600, color: "#fff", background: "var(--btn-primary, var(--accent))", border: "none", borderRadius: 8, padding: "8px 13px", cursor: followSending || insightLoading || (!followInput.trim() && pending.length === 0) ? "default" : "pointer", opacity: followSending || insightLoading || (!followInput.trim() && pending.length === 0) ? 0.6 : 1, whiteSpace: "nowrap" }}>
                      {followSending ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />} Send
                    </button>
                  </div>
                </div>
              )}

              {/* Resolve-and-re-reason: confirm the read's #1 assumption (tracking)
                  so it reasons from certainty instead of hedging every ROAS figure. */}
              <div style={{ marginTop: 14, paddingTop: 13, borderTop: "1px solid var(--border-2)" }}>
                {tracking?.status === "verified" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "var(--accent)" }}>
                      <ShieldCheck size={15} /> Conversion tracking verified working
                    </span>
                    <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                      {tracking.setBy ? `by ${tracking.setBy}` : ""}{tracking.setAt ? ` · ${new Date(tracking.setAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : ""} — ROAS figures treated as real
                    </span>
                    <button onClick={() => setTrackingStatus(null)} disabled={!!trackingSaving} style={{ marginLeft: "auto", fontSize: 11.5, fontWeight: 600, color: "var(--text-3)", background: "none", border: "none", cursor: trackingSaving ? "default" : "pointer", textDecoration: "underline" }}>
                      {trackingSaving === "clear" ? "…" : "Change"}
                    </button>
                  </div>
                ) : tracking?.status === "broken" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "var(--danger)" }}>
                      <AlertTriangle size={15} /> Conversion tracking confirmed broken
                    </span>
                    <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                      {tracking.setBy ? `by ${tracking.setBy}` : ""}{tracking.setAt ? ` · ${new Date(tracking.setAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : ""} — fix tracking before trusting any ROAS
                    </span>
                    <button onClick={() => setTrackingStatus(null)} disabled={!!trackingSaving} style={{ marginLeft: "auto", fontSize: 11.5, fontWeight: 600, color: "var(--text-3)", background: "none", border: "none", cursor: trackingSaving ? "default" : "pointer", textDecoration: "underline" }}>
                      {trackingSaving === "clear" ? "…" : "Change"}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Checked conversion tracking? Confirm it and the read re-reasons:</span>
                    <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                      <button onClick={() => setTrackingStatus("verified")} disabled={!!trackingSaving} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "var(--accent)", background: "var(--accent-dim)", border: "1px solid color-mix(in srgb, var(--accent) 35%, var(--border))", borderRadius: 7, padding: "5px 11px", cursor: trackingSaving ? "default" : "pointer" }}>
                        {trackingSaving === "verified" ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={13} />} Verified working
                      </button>
                      <button onClick={() => setTrackingStatus("broken")} disabled={!!trackingSaving} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "var(--danger)", background: "color-mix(in srgb, var(--danger) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--danger) 30%, var(--border))", borderRadius: 7, padding: "5px 11px", cursor: trackingSaving ? "default" : "pointer" }}>
                        {trackingSaving === "broken" ? <Loader2 size={12} className="animate-spin" /> : <AlertTriangle size={13} />} Confirmed broken
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Evidence toggle — the analytical sections are demoted below the
                conversation: they're what the agent noticed, not the main surface. */}
            <button onClick={() => setDetailsOpen(o => !o)} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 7, width: "100%", justifyContent: "center", fontSize: 12.5, fontWeight: 600, color: "var(--text-3)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 9, padding: "9px 14px", cursor: "pointer" }}>
              <ChevronRight size={14} style={{ transform: detailsOpen ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
              {detailsOpen ? "Hide the numbers & evidence" : "Show the numbers & evidence"}
            </button>

            {detailsOpen && (
              <>
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

            {/* Issues — what's wrong, instantly (right under the numbers) */}
            {diag.observations.length > 0 && (
              <>
                <SectionTitle>Issues</SectionTitle>
                <div style={{ ...card, padding: "6px 4px" }}>
                  {diag.observations.map((o, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, padding: "11px 16px", borderBottom: i < diag.observations.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <AlertTriangle size={15} style={{ color: diag.status === "red" ? "var(--danger)" : "var(--accent-2)", flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--text-2)" }}>{o.text}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* What's working — earned praise (§5A), balances the warnings */}
            {wins.length > 0 && (
              <>
                <SectionTitle>What&rsquo;s working</SectionTitle>
                <div style={{ ...card, padding: "6px 4px", border: "1px solid color-mix(in srgb, var(--accent) 25%, var(--border))" }}>
                  {wins.map((w, i) => (
                    <div key={i} style={{ display: "flex", gap: 11, padding: "11px 16px", borderBottom: i < wins.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <CheckCircle2 size={15} style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 14, lineHeight: 1.5, color: "var(--text-2)" }}>{w}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Underperforming products — ranked by wasted spend */}
            {products && products.underperformers.length > 0 && (
              <>
                <SectionTitle>Underperforming products — most wasted spend first</SectionTitle>
                <div style={{ ...card, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 560 }}>
                    <thead>
                      <tr style={{ color: "var(--text-muted)", textAlign: "right" }}>
                        <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600 }}>Product</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Spend</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Wasted</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>ROAS</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>POAS</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Conv.</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Units</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.underperformers.slice(0, 10).map(p => (
                        <tr key={p.productKey} style={{ borderTop: "1px solid var(--border)", textAlign: "right", color: "var(--text-2)" }}>
                          <td style={{ textAlign: "left", padding: "9px 14px", fontWeight: 600, color: "var(--text)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            <span style={{ color: "var(--danger)", marginRight: 6 }}>●</span>{p.title}
                          </td>
                          <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{fmtMoney(p.spend)}</td>
                          <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums", color: "var(--danger)", fontWeight: 600 }}>{fmtMoney(p.wastedSpend)}</td>
                          <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{p.roas != null ? p.roas.toFixed(2) : "—"}</td>
                          <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums", color: p.poas != null && p.poas < 1 ? "var(--danger)" : "var(--text-2)" }}>{p.poas != null ? p.poas.toFixed(2) : "—"}</td>
                          <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{Math.round(p.adConversions)}</td>
                          <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{p.units || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", margin: "8px 4px 0" }}>
                  &ldquo;Wasted&rdquo; = spend not returning (all of it when nothing converts, or the share above break-even POAS). Full product breakdown below.
                </div>
              </>
            )}

            {/* Product performance — winners & losers, by spend (Google Ads) */}
            {productPages.length > 0 && (
              <>
                <SectionTitle>Product performance — where the spend goes (last 30 days)</SectionTitle>
                <div style={{ ...card, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 520 }}>
                    <thead>
                      <tr style={{ color: "var(--text-muted)", textAlign: "right" }}>
                        <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600 }}>Product</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Spend</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Clicks</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Conv.</th>
                        <th style={{ padding: "10px 14px", fontWeight: 600 }}>ROAS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productPages.slice(0, 12).map(p => {
                        const bad = p.roas == null || p.roas < 1;
                        const good = p.roas != null && p.roas >= 2;
                        return (
                          <tr key={p.url} style={{ borderTop: "1px solid var(--border)", textAlign: "right", color: "var(--text-2)" }}>
                            <td style={{ textAlign: "left", padding: "9px 14px", fontWeight: 600, color: "var(--text)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              <span title={p.roas == null || p.roas < 1 ? "spend, no return" : "converting"} style={{ color: bad ? "var(--danger)" : good ? "var(--accent)" : "var(--text-dim)", marginRight: 7 }}>●</span>
                              {p.name}
                            </td>
                            <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{fmtMoney(p.spend)}</td>
                            <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{p.clicks || "—"}</td>
                            <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums", color: p.conversions < 1 ? "var(--danger)" : "var(--text-2)" }}>{Math.round(p.conversions)}</td>
                            <td style={{ padding: "9px 14px", fontVariantNumeric: "tabular-nums", fontWeight: 600, color: bad ? "var(--danger)" : good ? "var(--accent)" : "var(--text-2)" }}>{p.roas != null ? p.roas.toFixed(2) : "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", margin: "8px 4px 0" }}>
                  Green = converting (ROAS ≥ 2), red = spend with little/no return. From Google Ads landing pages; connect Shopify to add real units &amp; revenue.
                </div>
              </>
            )}

            {/* Multi-window trend (§4) */}
            {windows.some(w => w.spend > 0) && (
              <>
                <div id="trends" style={{ scrollMarginTop: 116 }} />
                <SectionTitle>Across windows — spotting drift vs the baseline</SectionTitle>
                {trend?.note && (
                  <div style={{
                    marginBottom: 10, padding: "10px 14px", borderRadius: 10, fontSize: 12.5, fontWeight: 500,
                    color: "var(--accent-2)", background: "color-mix(in srgb, var(--accent-2) 12%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--accent-2) 30%, transparent)",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <AlertTriangle size={14} style={{ flexShrink: 0 }} /> {trend.note}
                  </div>
                )}
                <div style={{ ...card, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 520 }}>
                    <thead>
                      <tr style={{ color: "var(--text-muted)", textAlign: "right" }}>
                        <th style={{ textAlign: "left", padding: "11px 14px", fontWeight: 600 }}>Window</th>
                        <th style={{ padding: "11px 10px", fontWeight: 600 }}>Spend</th>
                        <th style={{ padding: "11px 10px", fontWeight: 600 }}>ROAS</th>
                        <th style={{ padding: "11px 10px", fontWeight: 600 }}>POAS</th>
                        <th style={{ padding: "11px 10px", fontWeight: 600 }}>Orders</th>
                        <th style={{ padding: "11px 14px", fontWeight: 600 }}>Conv.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {windows.map((w, i) => (
                        <tr key={w.days} style={{ borderTop: "1px solid var(--border)", textAlign: "right", color: w.partial ? "var(--text-dim)" : "var(--text-2)" }}>
                          <td style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: w.partial ? "var(--text-dim)" : "var(--text)" }}>
                            {w.days}d{w.partial ? <span title={`only ${w.coverageDays} days of history`} style={{ fontSize: 10, color: "var(--text-dim)", marginLeft: 6 }}>partial</span> : null}
                          </td>
                          <td style={{ padding: "10px 10px", fontVariantNumeric: "tabular-nums" }}>{fmtMoney(w.spend)}</td>
                          <td style={{ padding: "10px 10px", fontVariantNumeric: "tabular-nums", color: cmpColor(w.roas, windows, i, "roas") }}>{w.roas != null ? w.roas.toFixed(2) : "—"}</td>
                          <td style={{ padding: "10px 10px", fontVariantNumeric: "tabular-nums", color: cmpColor(w.poas, windows, i, "poas") }}>{w.poas != null ? w.poas.toFixed(2) : "—"}</td>
                          <td style={{ padding: "10px 10px", fontVariantNumeric: "tabular-nums" }}>{w.orders != null ? w.orders : "—"}</td>
                          <td style={{ padding: "10px 14px", fontVariantNumeric: "tabular-nums" }}>{Math.round(w.conversions)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", margin: "8px 4px 0" }}>
                  Each window ends yesterday. POAS and Orders need Shopify connected. &ldquo;partial&rdquo; = history doesn&rsquo;t yet cover the full window — back-fill 90 days to fill it in.
                </div>
              </>
            )}

            {/* Product breakdown — ad spend vs real sales, variant→product (§4/§8) */}
            {products && products.groups.length > 0 && (
              <>
                <div id="products" style={{ scrollMarginTop: 116 }} />
                {products.excludeCandidates.length > 0 && (
                  <>
                    <SectionTitle>Feed candidates — spend, no conversions (judged at product level)</SectionTitle>
                    <div style={{ ...card, border: "1px solid color-mix(in srgb, var(--danger) 30%, transparent)", padding: "6px 4px", marginBottom: 4 }}>
                      {products.excludeCandidates.map(p => (
                        <div key={p.productKey} style={{ display: "flex", gap: 11, padding: "11px 16px", borderBottom: "1px solid var(--border)" }}>
                          <AlertTriangle size={16} style={{ color: "var(--danger)", flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 700 }}>{p.title}</div>
                            <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 2 }}>{p.excludeReason} — a candidate to exclude from the feed.</div>
                          </div>
                        </div>
                      ))}
                      <div style={{ fontSize: 11.5, color: "var(--text-muted)", padding: "8px 16px" }}>
                        Individual variants are often too thin to judge — this call is made on the rolled-up product. The system flags the candidate; the specialist makes the exclusion.
                      </div>
                    </div>
                  </>
                )}

                <SectionTitle>By product — what the ads did vs what actually sold</SectionTitle>
                <div style={{ ...card, overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 580 }}>
                    <thead>
                      <tr style={{ color: "var(--text-muted)", textAlign: "right" }}>
                        <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600 }}>Product</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Spend</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Clicks</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Conv.</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Units</th>
                        <th style={{ padding: "10px 8px", fontWeight: 600 }}>Revenue</th>
                        <th style={{ padding: "10px 14px", fontWeight: 600 }}>POAS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.groups.slice(0, 15).map(p => {
                        const open = expanded.has(p.productKey);
                        const canExpand = p.variants.length > 1;
                        return (
                          <Fragment key={p.productKey}>
                            <tr
                              onClick={() => canExpand && toggle(p.productKey)}
                              style={{ borderTop: "1px solid var(--border)", textAlign: "right", color: "var(--text-2)", cursor: canExpand ? "pointer" : "default" }}>
                              <td style={{ textAlign: "left", padding: "9px 14px", fontWeight: 600, color: "var(--text)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {canExpand
                                  ? <ChevronRight size={13} style={{ verticalAlign: -2, marginRight: 5, color: "var(--text-dim)", transform: open ? "rotate(90deg)" : "none", transition: "transform .12s" }} />
                                  : <span style={{ display: "inline-block", width: 18 }} />}
                                {p.excludeCandidate && <span title="spend, no conversions" style={{ color: "var(--danger)", marginRight: 6 }}>●</span>}
                                {p.title}
                                {p.variantCount > 1 && <span style={{ fontSize: 11, color: "var(--text-dim)", marginLeft: 7 }}>{p.variantCount} variants{p.thinVariantCount ? `, ${p.thinVariantCount} thin` : ""}</span>}
                              </td>
                              <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{p.spend > 0 ? fmtMoney(p.spend) : "—"}</td>
                              <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{p.clicks || "—"}</td>
                              <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums", color: p.excludeCandidate ? "var(--danger)" : "var(--text-2)" }}>{Math.round(p.adConversions)}</td>
                              <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{p.units || "—"}</td>
                              <td style={{ padding: "9px 8px", fontVariantNumeric: "tabular-nums" }}>{p.revenue > 0 ? fmtMoney(p.revenue) : "—"}</td>
                              <td style={{ padding: "9px 14px", fontVariantNumeric: "tabular-nums", color: p.poas != null ? (p.poas < 1 ? "var(--danger)" : "var(--accent)") : "var(--text-dim)" }}>{p.poas != null ? p.poas.toFixed(2) : "—"}</td>
                            </tr>
                            {open && p.variants.map(v => (
                              <tr key={v.variantKey} style={{ textAlign: "right", color: "var(--text-3)", background: "var(--surface-2)", fontSize: 12 }}>
                                <td style={{ textAlign: "left", padding: "7px 14px 7px 37px", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {v.spendNoSales && <span style={{ color: "var(--danger)", marginRight: 5 }}>●</span>}
                                  {v.label}
                                  {v.thin && <span title="too little data to judge alone" style={{ fontSize: 10, color: "var(--text-dim)", marginLeft: 6 }}>thin</span>}
                                </td>
                                <td style={{ padding: "7px 8px", fontVariantNumeric: "tabular-nums" }}>{v.spend > 0 ? fmtMoney(v.spend) : "—"}</td>
                                <td style={{ padding: "7px 8px", fontVariantNumeric: "tabular-nums" }}>{v.clicks || "—"}</td>
                                <td style={{ padding: "7px 8px", fontVariantNumeric: "tabular-nums" }}>{Math.round(v.adConversions)}</td>
                                <td style={{ padding: "7px 8px", fontVariantNumeric: "tabular-nums" }}>{v.units || "—"}</td>
                                <td style={{ padding: "7px 8px", fontVariantNumeric: "tabular-nums" }}>{v.revenue > 0 ? fmtMoney(v.revenue) : "—"}</td>
                                <td style={{ padding: "7px 14px", fontVariantNumeric: "tabular-nums" }}>{v.poas != null ? v.poas.toFixed(2) : "—"}</td>
                              </tr>
                            ))}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", margin: "8px 4px 0" }}>
                  {products.concentration.breadth !== "unknown" && (
                    <>Revenue is <b>{products.concentration.breadth}</b> — top product is {Math.round(products.concentration.topShare * 100)}% of sales, top 3 are {Math.round(products.concentration.top3Share * 100)}%. </>
                  )}
                  Click a product to see its variants. Ads roll up from item/variant level; units &amp; revenue need Shopify connected. Last 30 days.
                </div>
              </>
            )}

            {/* Diagnosis (checks → questions) — issues are surfaced up top now */}
            <div id="diagnosis" style={{ scrollMarginTop: 116 }} />

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

            {/* Data & connections */}
            {shopify && (
              <>
                <div id="data" style={{ scrollMarginTop: 116 }} />
                <SectionTitle>Data &amp; connections</SectionTitle>
                <div style={{ ...card, padding: "15px 17px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: shopify.connected ? 4 : 10 }}>
                    <ShoppingBag size={16} style={{ color: shopify.connected ? "var(--accent)" : "var(--text-dim)" }} />
                    <span style={{ fontSize: 13.5, fontWeight: 700 }}>Order feed (Shopify)</span>
                    {shopify.connected && (
                      <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
                        {shopify.shopDomain} · synced {shopify.lastSyncAt ? new Date(shopify.lastSyncAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "never"}
                        <button onClick={syncNow} disabled={syncing} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "var(--text-2)", background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 7, padding: "5px 10px", cursor: syncing ? "default" : "pointer" }}>
                          {syncing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Sync orders
                        </button>
                      </span>
                    )}
                  </div>
                  {!shopify.connected && (
                    shopify.appConfigured ? (
                      <>
                        <div style={{ fontSize: 12.5, color: "var(--text-3)", marginBottom: 10 }}>
                          Connect this client&rsquo;s store to reconcile real orders against Google Ads and unlock POAS. Enter their <code>.myshopify.com</code> domain.
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input
                            value={shopDomain} onChange={e => setShopDomain(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && connectShopify()}
                            placeholder="acme.myshopify.com"
                            style={{ flex: 1, fontSize: 13, padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border-2)", background: "var(--surface-2)", color: "var(--text)" }}
                          />
                          <button onClick={connectShopify} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#fff", background: "var(--btn-primary, var(--accent))", border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer" }}>
                            Connect <ArrowUpRight size={14} />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
                        The Shopify app isn&rsquo;t set up yet. Add <code>SHOPIFY_API_KEY</code> and <code>SHOPIFY_API_SECRET</code> on Railway, then the connect button appears here.
                      </div>
                    )
                  )}
                </div>
              </>
            )}
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

function fmtMoney(n: number): string {
  return `€${Math.round(n).toLocaleString("en-GB")}`;
}

/** Tint a window's ROAS/POAS relative to the longest (baseline) window. */
function cmpColor(v: number | null, rows: WindowRow[], i: number, key: "roas" | "poas"): string {
  if (v == null) return "var(--text-dim)";
  const base = rows[rows.length - 1]?.[key];
  if (base == null || i === rows.length - 1) return "var(--text-2)";
  if (v >= base * 1.1) return "var(--accent)";
  if (v <= base * 0.75) return "var(--danger)";
  return "var(--text-2)";
}

function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  return (
    <div style={{
      position: "sticky", top: 58, zIndex: 8, marginTop: 14,
      background: "var(--bg)", padding: "8px 0", borderBottom: "1px solid var(--border)",
      display: "flex", gap: 6, flexWrap: "wrap",
    }}>
      {items.map(it => (
        <button key={it.id} onClick={() => go(it.id)} style={{
          fontSize: 12.5, fontWeight: 600, color: "var(--text-3)", background: "var(--surface)",
          border: "1px solid var(--border-2)", borderRadius: 999, padding: "6px 14px", cursor: "pointer",
        }}>{it.label}</button>
      ))}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)", margin: "26px 4px 11px", letterSpacing: "-0.2px" }}>{children}</h2>;
}

function ConnPill({ label, status, note, onClick }: { label: string; status: string; note: string; onClick?: () => void }) {
  const color = status === "green" ? "var(--accent)" : status === "yellow" ? "var(--accent-2)" : "var(--danger)";
  return (
    <div onClick={onClick} role={onClick ? "button" : undefined} title={note}
      style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 999, padding: "5px 12px", cursor: onClick ? "pointer" : "default" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontWeight: 600, color: "var(--text-2)" }}>{label}</span>
      <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{note}</span>
      {onClick && <ChevronRight size={12} style={{ color: "var(--text-dim)" }} />}
    </div>
  );
}
