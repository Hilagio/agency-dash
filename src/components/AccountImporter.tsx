"use client";
/**
 * Import accounts straight from the Google Ads MCC — the MCC is the source of
 * truth for which accounts exist; ticking here is the source of truth for
 * which are relevant. Renders in the cockpit's house style.
 *
 * onImported receives the googleAdsIds that were just imported so the caller
 * can kick their first data pull and make them visible immediately.
 */
import { useEffect, useState } from "react";
import { Search, CheckCircle2, Loader2, RefreshCw, Download, X } from "lucide-react";

interface GoogleAdsAccount {
  googleAdsId: string;
  name: string;
  currency: string;
  resourceName: string;
  imported: boolean;
}

interface Props {
  onImported: (importedIds: string[]) => void;
  onClose: () => void;
  onAuthFailed?: () => void;
}

const fmtId = (id: string) => id.length === 10 ? `${id.slice(0, 3)}-${id.slice(3, 6)}-${id.slice(6)}` : id;

export function AccountImporter({ onImported, onClose, onAuthFailed }: Props) {
  const [accounts, setAccounts] = useState<GoogleAdsAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [doneMsg, setDoneMsg] = useState<string | null>(null);

  async function fetchAccounts() {
    setLoading(true); setError(null); setAuthRequired(false);
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 25_000); // stay under Railway's 30s limit
    try {
      const res = await fetch("/api/google-ads/accounts", { signal: ac.signal, credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        const isRealAuthError = (res.status === 401 || res.status === 403) && !!data.authUrl;
        if (isRealAuthError) {
          setAuthRequired(true);
          setError("Google Ads authentication expired — reconnect below, then load the list again.");
          await fetch("/api/auth/google-ads/disconnect", { method: "POST", credentials: "include" }).catch(() => {});
          onAuthFailed?.();
        } else {
          setError(data.error ?? "Couldn't load the MCC account list.");
        }
        return;
      }
      setAccounts(data);
    } catch (e) {
      setError(e instanceof Error && e.name === "AbortError"
        ? "Timed out loading the MCC — try again, or set GOOGLE_ADS_LOGIN_CUSTOMER_ID to speed up discovery."
        : "Network error — check your connection and try again.");
    } finally {
      clearTimeout(t);
      setLoading(false);
    }
  }
  useEffect(() => { fetchAccounts(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (id: string) => setSelected(prev => {
    const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n;
  });

  const digits = search.replace(/[^0-9]/g, "");
  const filtered = accounts.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) || (digits.length > 0 && a.googleAdsId.includes(digits)));
  const newOnes = filtered.filter(a => !a.imported);
  const allNewSelected = newOnes.length > 0 && newOnes.every(a => selected.has(a.googleAdsId));

  async function importSelected(ids: string[]) {
    if (!ids.length || importing) return;
    setImporting(true); setDoneMsg(null); setError(null);
    const ok: string[] = [];
    const failures: string[] = [];
    try {
      // Small pool — kind to the API, still fast for a whole MCC.
      const queue = [...ids];
      const worker = async () => {
        for (;;) {
          const id = queue.shift();
          if (!id) return;
          const acc = accounts.find(a => a.googleAdsId === id);
          if (!acc) continue;
          const res = await fetch("/api/google-ads/accounts", {
            method: "POST", credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ googleAdsId: acc.googleAdsId, name: acc.name, currency: acc.currency }),
          }).catch(() => null);
          if (res?.ok) { ok.push(id); continue; }
          // Surface the REAL reason — "nothing was imported, try again" hides
          // actionable causes like org mismatches.
          const j = res ? await res.json().catch(() => ({})) : {};
          failures.push(`${acc.name}: ${j.error ?? (res ? `HTTP ${res.status}` : "network error")}`);
        }
      };
      await Promise.all(Array.from({ length: 4 }, worker));
      setAccounts(prev => prev.map(a => ok.includes(a.googleAdsId) ? { ...a, imported: true } : a));
      setSelected(prev => { const n = new Set(prev); ok.forEach(id => n.delete(id)); return n; });
      if (ok.length) {
        setDoneMsg(`${ok.length} account${ok.length === 1 ? "" : "s"} added — pulling their first data now; they'll show in the list with a status shortly.`);
        onImported(ok);
      }
      if (failures.length) setError(failures.slice(0, 3).join(" · ") + (failures.length > 3 ? ` · +${failures.length - 3} more` : ""));
    } finally {
      setImporting(false);
    }
  }

  return (
    <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>Add accounts from Google Ads</div>
          <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 2 }}>Every account under the MCC — tick the ones this team manages.</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={fetchAccounts} disabled={loading} title="Reload the MCC list" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 8, background: "var(--surface)", border: "1px solid var(--border-2)", color: "var(--text-3)", cursor: loading ? "default" : "pointer" }}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          </button>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}><X size={18} /></button>
        </div>
      </div>

      <div style={{ padding: "14px 20px 18px" }}>
        {/* Search + bulk actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1 1 220px" }}>
            <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", pointerEvents: "none" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or customer id…"
              style={{ width: "100%", fontSize: 13, padding: "8px 12px 8px 32px", borderRadius: 9, border: "1px solid var(--border-2)", background: "var(--surface)", color: "var(--text)", fontFamily: "inherit" }} />
          </div>
          {newOnes.length > 0 && (
            <button onClick={() => setSelected(allNewSelected ? new Set() : new Set(newOnes.map(a => a.googleAdsId)))}
              style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "7px 12px", cursor: "pointer" }}>
              {allNewSelected ? "Deselect all" : `Select all new (${newOnes.length})`}
            </button>
          )}
          <button onClick={() => importSelected([...selected])} disabled={!selected.size || importing}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#fff", background: "var(--btn-primary, var(--accent))", border: "none", borderRadius: 9, padding: "8px 15px", cursor: selected.size && !importing ? "pointer" : "default", opacity: selected.size && !importing ? 1 : 0.55 }}>
            {importing ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />} Import {selected.size || ""} selected
          </button>
        </div>

        {error && (
          <div style={{ fontSize: 12.5, color: authRequired ? "var(--accent-2)" : "var(--danger)", marginBottom: 10, lineHeight: 1.5 }}>
            {error}
            {authRequired && (
              <a href="/api/auth/google-ads" style={{ display: "inline-flex", alignItems: "center", gap: 5, marginLeft: 8, fontSize: 12, fontWeight: 700, color: "#fff", background: "var(--btn-primary, var(--accent))", borderRadius: 7, padding: "4px 11px", textDecoration: "none" }}>
                Connect Google Ads →
              </a>
            )}
          </div>
        )}
        {doneMsg && <div style={{ fontSize: 12.5, color: "var(--accent)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><CheckCircle2 size={14} /> {doneMsg}</div>}

        {/* Account list */}
        {loading && !accounts.length ? (
          <div style={{ fontSize: 13, color: "var(--text-3)", display: "flex", alignItems: "center", gap: 8, padding: "18px 4px" }}>
            <Loader2 size={14} className="animate-spin" style={{ color: "var(--accent)" }} /> Loading every account under the MCC…
          </div>
        ) : (
          <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", maxHeight: "52vh", overflowY: "auto" }}>
            {filtered.map((a, i) => {
              const checked = selected.has(a.googleAdsId);
              return (
                <div key={a.googleAdsId}
                  onClick={() => !a.imported && toggle(a.googleAdsId)}
                  style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 14px", borderTop: i ? "1px solid var(--border)" : "none", cursor: a.imported ? "default" : "pointer", background: checked ? "var(--accent-dim)" : "transparent", opacity: a.imported ? 0.55 : 1 }}>
                  {a.imported
                    ? <CheckCircle2 size={17} style={{ color: "var(--accent)", flexShrink: 0 }} />
                    : <span style={{ width: 17, height: 17, borderRadius: 5, flexShrink: 0, border: checked ? "none" : "1.5px solid var(--border-3, var(--border-2))", background: checked ? "var(--accent)" : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{checked && <CheckCircle2 size={13} />}</span>}
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                  <span style={{ fontSize: 11.5, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{fmtId(a.googleAdsId)}</span>
                  <span style={{ marginLeft: "auto" }} />
                  <span style={{ fontSize: 10.5, color: "var(--text-dim)", flexShrink: 0 }}>{a.currency}</span>
                  {a.imported && <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 35%, var(--border-2))", borderRadius: 6, padding: "1px 7px", flexShrink: 0 }}>in the system</span>}
                </div>
              );
            })}
            {!filtered.length && (
              <div style={{ padding: "20px 14px", fontSize: 12.5, color: "var(--text-muted)", textAlign: "center" }}>
                {accounts.length ? "No account matches that search." : "No accounts returned from the MCC."}
              </div>
            )}
          </div>
        )}
        <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 10, lineHeight: 1.5 }}>
          Importing marks an account as relevant and starts its first data pull. If Notion is connected, its store info (client, Slack channel, budget) is layered on automatically by the nightly sync — without duplicating accounts.
        </div>
      </div>
    </div>
  );
}
