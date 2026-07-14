"use client";

/**
 * Pilot-config screen for the Account Ownership System.
 * Set owners (name + Slack member ID), assign an owner + KPI/target per account,
 * and flip the ownership pilot flag — no console/SQL needed.
 * Also triggers the Notion Stores sync and a shadow-digest run on demand.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Loader2, ShieldCheck, Plus, Check, RefreshCw, Send, Star,
  Search, Archive, RotateCcw, Trash2,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Owner {
  id: string;
  name: string;
  slackUserId: string | null;
  isTeamLead: boolean;
  _count?: { accounts: number };
}

interface Account {
  id: string;
  name: string;
  clientName: string | null;
  active: boolean;
  archived: boolean;
  ownershipEnabled: boolean;
  ownerId: string | null;
  primaryKpi: "ROAS" | "CPA" | null;
  targetValue: number | null;
  reviewFrequencyDays: number;
  monthlyBudget: number | null;
}

const card: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden",
};
const label: React.CSSProperties = { fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 };
const inputStyle: React.CSSProperties = {
  background: "var(--input-bg)", border: "1px solid var(--border-2)", borderRadius: 7,
  color: "var(--text)", fontSize: 13, padding: "6px 9px", outline: "none",
};
const btnGhost: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6, background: "var(--surface-2)", border: "1px solid var(--border-2)",
  borderRadius: 8, color: "var(--text-2)", fontSize: 12, padding: "7px 13px", cursor: "pointer",
};

export default function OwnershipConfigPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null); // action id currently running
  const [query, setQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const load = async () => {
    const [o, a] = await Promise.all([
      fetch("/api/owners", { credentials: "include" }).then(r => r.ok ? r.json() : []),
      fetch("/api/accounts", { credentials: "include" }).then(r => r.ok ? r.json() : []),
    ]);
    setOwners(o);
    setAccounts(a);
    setLoading(false);
  };

  useEffect(() => {
    // Mount-time data load; setState runs after the fetch resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  // ── Owner actions ──────────────────────────────────────────────────────────
  const [newOwner, setNewOwner] = useState({ name: "", slackUserId: "", isTeamLead: false });
  async function addOwner() {
    if (!newOwner.name.trim()) return;
    setBusy("add-owner");
    const res = await fetch("/api/owners", {
      method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOwner),
    });
    setBusy(null);
    if (res.ok) { setNewOwner({ name: "", slackUserId: "", isTeamLead: false }); flash("Owner added"); load(); }
    else flash((await res.json().catch(() => ({})))?.error ?? "Failed to add owner");
  }
  async function saveOwner(o: Owner) {
    setBusy("owner-" + o.id);
    await fetch(`/api/owners?id=${o.id}`, {
      method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slackUserId: o.slackUserId, isTeamLead: o.isTeamLead }),
    });
    setBusy(null); flash("Owner saved");
  }
  const patchOwnerLocal = (id: string, patch: Partial<Owner>) =>
    setOwners(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o));

  // ── Account actions ────────────────────────────────────────────────────────
  const patchAccountLocal = (id: string, patch: Partial<Account>) =>
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));

  async function saveAccount(a: Account) {
    setBusy("acct-" + a.id);
    const res = await fetch(`/api/accounts/${a.id}`, {
      method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownershipEnabled: a.ownershipEnabled,
        ownerId: a.ownerId,
        primaryKpi: a.primaryKpi,
        targetValue: a.targetValue,
        reviewFrequencyDays: a.reviewFrequencyDays,
      }),
    });
    setBusy(null);
    if (res.ok) flash(`Saved ${a.name}`);
    else flash((await res.json().catch(() => ({})))?.error ?? "Save failed");
  }

  async function setArchived(a: Account, archived: boolean) {
    setBusy("acct-" + a.id);
    const res = await fetch(`/api/accounts/${a.id}`, {
      method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" },
      // Archiving also drops it out of the pilot so it can never be scored.
      body: JSON.stringify(archived ? { archived: true, ownershipEnabled: false } : { archived: false }),
    });
    setBusy(null);
    if (res.ok) { patchAccountLocal(a.id, { archived, ...(archived ? { ownershipEnabled: false } : {}) }); flash(archived ? `Archived ${a.name}` : `Restored ${a.name}`); }
    else flash("Failed");
  }

  async function deleteAccount(a: Account) {
    if (!confirm(`Permanently delete "${a.name}" and all its history? This cannot be undone.\n\nTip: "Archive" just hides it and is reversible.`)) return;
    setBusy("acct-" + a.id);
    const res = await fetch(`/api/accounts/${a.id}`, { method: "DELETE", credentials: "include" });
    setBusy(null);
    if (res.ok) { setAccounts(prev => prev.filter(x => x.id !== a.id)); flash(`Deleted ${a.name}`); }
    else flash("Delete failed");
  }

  // The Pilot toggle saves immediately — no separate Save click needed for it.
  async function toggleEnabled(a: Account, enabled: boolean) {
    patchAccountLocal(a.id, { ownershipEnabled: enabled }); // optimistic
    const res = await fetch(`/api/accounts/${a.id}`, {
      method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownershipEnabled: enabled }),
    });
    if (!res.ok) { patchAccountLocal(a.id, { ownershipEnabled: !enabled }); flash("Couldn't update pilot flag"); }
  }

  async function enableAllShown(enabled: boolean) {
    const targets = liveShown.filter(a => a.ownershipEnabled !== enabled);
    if (targets.length === 0) return;
    setBusy("bulk-enable");
    for (const a of targets) {
      patchAccountLocal(a.id, { ownershipEnabled: enabled });
      await fetch(`/api/accounts/${a.id}`, {
        method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownershipEnabled: enabled }),
      }).catch(() => {});
    }
    setBusy(null);
    flash(`${enabled ? "Enabled" : "Disabled"} ${targets.length} store${targets.length === 1 ? "" : "s"} for the pilot`);
  }

  // ── Global run actions ─────────────────────────────────────────────────────
  async function runSync() {
    setBusy("sync");
    const res = await fetch("/api/integrations/notion/sync-stores", { method: "POST", credentials: "include" });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    flash(res.ok ? `Notion sync: ${data.created ?? 0} new, ${data.updated ?? 0} updated, ${data.deactivated ?? 0} deactivated` : (data.error ?? "Sync failed"));
    if (res.ok) load();
  }
  async function runDigest() {
    setBusy("digest");
    const res = await fetch("/api/ownership/shadow-digest", { method: "POST", credentials: "include" });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    flash(res.ok ? `Shadow run: ${data.evaluated ?? 0} evaluated, digest ${data.posted ? "posted" : "not posted (Slack not connected)"}` : (data.error ?? "Run failed"));
  }

  const live = accounts.filter(a => !a.archived);
  const archived = accounts.filter(a => a.archived);
  const enabledCount = live.filter(a => a.ownershipEnabled).length;
  const configuredCount = live.filter(a => a.ownershipEnabled && a.ownerId && a.primaryKpi && a.targetValue).length;

  const q = query.trim().toLowerCase();
  const matches = (a: Account) => !q || a.name.toLowerCase().includes(q) || (a.clientName ?? "").toLowerCase().includes(q);
  const liveShown = live.filter(matches);
  const archivedShown = archived.filter(matches);

  const iconBtn = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4,
    background: "var(--surface-2)", border: "1px solid var(--border-2)", borderRadius: 7,
    color: "var(--text-3)", fontSize: 12, padding: "6px 9px", cursor: "pointer", ...extra,
  });

  const renderRow = (a: Account, isArchived: boolean) => (
    <tr key={a.id} style={{ borderBottom: "1px solid var(--border)", opacity: isArchived ? 0.6 : 1 }}>
      <td style={{ padding: "8px 12px" }}>
        <input type="checkbox" checked={a.ownershipEnabled} disabled={isArchived}
          onChange={e => toggleEnabled(a, e.target.checked)} title="Saves instantly" />
      </td>
      <td style={{ padding: "8px 12px" }}>
        <div style={{ fontWeight: 600, color: "var(--text)" }}>{a.name}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
          {a.clientName ? a.clientName + " · " : ""}{a.monthlyBudget ? `€${Math.round(a.monthlyBudget).toLocaleString()}/mo` : "no budget"}{!a.active && " · not active in Notion"}
        </div>
      </td>
      <td style={{ padding: "8px 12px" }}>
        <select value={a.ownerId ?? ""} disabled={isArchived} onChange={e => patchAccountLocal(a.id, { ownerId: e.target.value || null })} style={{ ...inputStyle, minWidth: 120 }}>
          <option value="">— none —</option>
          {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
      </td>
      <td style={{ padding: "8px 12px" }}>
        <select value={a.primaryKpi ?? ""} disabled={isArchived} onChange={e => patchAccountLocal(a.id, { primaryKpi: (e.target.value || null) as Account["primaryKpi"] })} style={{ ...inputStyle, width: 90 }}>
          <option value="">—</option>
          <option value="ROAS">ROAS</option>
          <option value="CPA">CPA</option>
        </select>
      </td>
      <td style={{ padding: "8px 12px" }}>
        <input type="number" step="0.1" value={a.targetValue ?? ""} disabled={isArchived}
          placeholder={a.primaryKpi === "CPA" ? "€" : "×"}
          onChange={e => patchAccountLocal(a.id, { targetValue: e.target.value === "" ? null : Number(e.target.value) })}
          style={{ ...inputStyle, width: 80 }} />
      </td>
      <td style={{ padding: "8px 12px" }}>
        <input type="number" value={a.reviewFrequencyDays} disabled={isArchived}
          onChange={e => patchAccountLocal(a.id, { reviewFrequencyDays: Number(e.target.value) })}
          style={{ ...inputStyle, width: 60 }} />
      </td>
      <td style={{ padding: "8px 12px" }}>
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
          {busy === "acct-" + a.id && <Loader2 size={13} className="animate-spin" style={{ color: "var(--text-dim)", alignSelf: "center" }} />}
          {isArchived ? (
            <button onClick={() => setArchived(a, false)} disabled={!!busy} style={iconBtn()} title="Restore"><RotateCcw size={13} /> Restore</button>
          ) : (
            <>
              <button onClick={() => saveAccount(a)} disabled={!!busy} style={iconBtn({ background: "var(--btn-primary)", color: "#fff", border: "none" })} title="Save"><Check size={13} /> Save</button>
              <button onClick={() => setArchived(a, true)} disabled={!!busy} style={iconBtn()} title="Archive (hide — reversible)"><Archive size={13} /></button>
            </>
          )}
          <button onClick={() => deleteAccount(a)} disabled={!!busy} style={iconBtn({ color: "#e5484d" })} title="Delete permanently"><Trash2 size={13} /></button>
        </div>
      </td>
    </tr>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)",
        padding: "0 24px", height: 52, position: "sticky", top: 0, background: "var(--header-bg)", backdropFilter: "blur(8px)", zIndex: 10,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-dim)", fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={14} /> Back
        </Link>
        <span style={{ color: "var(--border-2)" }}>·</span>
        <ShieldCheck size={15} style={{ color: "var(--accent)" }} />
        <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>Ownership pilot</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={runSync} disabled={!!busy} style={btnGhost}>
            {busy === "sync" ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Sync Notion stores
          </button>
          <button onClick={runDigest} disabled={!!busy} style={{ ...btnGhost, background: "var(--btn-primary)", color: "#fff", border: "none" }}>
            {busy === "digest" ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} Run shadow digest
          </button>
          <ThemeToggle />
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 24px 80px" }}>
        {/* Summary */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            { k: "Active stores", v: live.length },
            { k: "Pilot enabled", v: enabledCount },
            { k: "Fully configured", v: configuredCount },
            { k: "Archived", v: archived.length },
            { k: "Owners", v: owners.length },
          ].map(s => (
            <div key={s.k} style={{ ...card, padding: "12px 18px", minWidth: 130 }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: "var(--text)" }}>{s.v}</div>
              <div style={label}>{s.k}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
            <Loader2 size={20} className="animate-spin" style={{ color: "var(--text-dim)" }} />
          </div>
        ) : (
          <>
            {/* Owners */}
            <section style={{ ...card, marginBottom: 24 }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14 }}>
                Owners
                <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: 12, marginLeft: 8 }}>
                  the AMs the bot DMs / @mentions — set each Slack member ID (U0123…)
                </span>
              </div>
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                {owners.map(o => (
                  <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ width: 120, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                      {o.isTeamLead && <Star size={12} style={{ color: "var(--accent)" }} />} {o.name}
                    </div>
                    <input
                      value={o.slackUserId ?? ""} placeholder="Slack member ID (U…)"
                      onChange={e => patchOwnerLocal(o.id, { slackUserId: e.target.value })}
                      style={{ ...inputStyle, width: 200 }}
                    />
                    <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-3)" }}>
                      <input type="checkbox" checked={o.isTeamLead} onChange={e => patchOwnerLocal(o.id, { isTeamLead: e.target.checked })} />
                      Team lead
                    </label>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{o._count?.accounts ?? 0} accounts</span>
                    <button onClick={() => saveOwner(o)} disabled={busy === "owner-" + o.id} style={{ ...btnGhost, marginLeft: "auto" }}>
                      {busy === "owner-" + o.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
                    </button>
                  </div>
                ))}
                {/* Add owner */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid var(--border)", paddingTop: 12, flexWrap: "wrap" }}>
                  <input value={newOwner.name} placeholder="Name" onChange={e => setNewOwner({ ...newOwner, name: e.target.value })} style={{ ...inputStyle, width: 120 }} />
                  <input value={newOwner.slackUserId} placeholder="Slack member ID (U…)" onChange={e => setNewOwner({ ...newOwner, slackUserId: e.target.value })} style={{ ...inputStyle, width: 200 }} />
                  <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-3)" }}>
                    <input type="checkbox" checked={newOwner.isTeamLead} onChange={e => setNewOwner({ ...newOwner, isTeamLead: e.target.checked })} /> Team lead
                  </label>
                  <button onClick={addOwner} disabled={busy === "add-owner" || !newOwner.name.trim()} style={{ ...btnGhost, marginLeft: "auto" }}>
                    {busy === "add-owner" ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />} Add owner
                  </button>
                </div>
              </div>
            </section>

            {/* Stores */}
            <section style={card}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Stores</div>
                <span style={{ fontWeight: 400, color: "var(--text-muted)", fontSize: 12 }}>
                  tick Pilot to enable (saves instantly); each needs an owner + KPI + target
                </span>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <Search size={13} style={{ position: "absolute", left: 8, color: "var(--text-dim)", pointerEvents: "none" }} />
                    <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search stores…" style={{ ...inputStyle, paddingLeft: 26, width: 180 }} />
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-3)", whiteSpace: "nowrap" }}>
                    <input type="checkbox" checked={showArchived} onChange={e => setShowArchived(e.target.checked)} />
                    Show archived ({archived.length})
                  </label>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: "left", color: "var(--text-muted)", fontSize: 11 }}>
                      <th style={{ padding: "8px 12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                        <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer" }} title="Select all shown for the pilot">
                          <input
                            type="checkbox"
                            disabled={busy === "bulk-enable" || liveShown.length === 0}
                            ref={el => { if (el) el.indeterminate = liveShown.some(a => a.ownershipEnabled) && !liveShown.every(a => a.ownershipEnabled); }}
                            checked={liveShown.length > 0 && liveShown.every(a => a.ownershipEnabled)}
                            onChange={e => enableAllShown(e.target.checked)}
                          />
                          Pilot
                        </label>
                      </th>
                      {["Store", "Owner", "KPI", "Target", "Review (days)", ""].map(h => (
                        <th key={h} style={{ padding: "8px 12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, borderBottom: "1px solid var(--border)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {liveShown.map(a => renderRow(a, false))}
                    {liveShown.length === 0 && (
                      <tr><td colSpan={7} style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>
                        {live.length === 0 ? "No stores yet — run “Sync Notion stores” above." : "No stores match your search."}
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {showArchived && (
                <div style={{ borderTop: "1px solid var(--border)" }}>
                  <div style={{ padding: "10px 18px", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Archived ({archivedShown.length})
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <tbody>
                        {archivedShown.map(a => renderRow(a, true))}
                        {archivedShown.length === 0 && (
                          <tr><td colSpan={7} style={{ padding: 16, textAlign: "center", color: "var(--text-muted)" }}>Nothing archived.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {toast && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "var(--surface-3)", border: "1px solid var(--border-3)", color: "var(--text)",
          padding: "10px 18px", borderRadius: 10, fontSize: 13, boxShadow: "0 6px 24px rgba(0,0,0,0.3)", zIndex: 50,
        }}>{toast}</div>
      )}
    </div>
  );
}
