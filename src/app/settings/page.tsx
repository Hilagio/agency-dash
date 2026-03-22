"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Loader2, Building2, Users, Mail, Shield,
  Trash2, RefreshCw, Check, Copy, Link2, Zap, LogOut,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Member {
  id:   string;
  role: string;
  createdAt: string;
  user: { id: string; email: string; name: string | null; image: string | null };
}

interface Invite {
  id:        string;
  email:     string;
  role:      string;
  token:     string;
  expiresAt: string;
  createdAt: string;
}

interface Org {
  id:      string;
  name:    string;
  slug:    string;
  members: Member[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function roleColor(role: string) {
  if (role === "OWNER")     return "#a855f7";
  if (role === "ADMIN")     return "#3b82f6";
  return "var(--text-dim)";
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function Avatar({ name, image, size = 28 }: { name: string | null; image?: string | null; size?: number }) {
  if (image) {
    return <img src={image} alt={name ?? ""} width={size} height={size} style={{ borderRadius: "50%", objectFit: "cover" }} />;
  }
  const initials = (name ?? "?").split(" ").map(p => p[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 700, color: "#fff", flexShrink: 0,
    }}>{initials}</div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 14, marginBottom: 20,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "16px 20px", borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ color: "var(--text-dim)" }}>{icon}</div>
        <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{title}</span>
      </div>
      <div style={{ padding: "16px 20px" }}>{children}</div>
    </div>
  );
}

// ─── Settings page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [org, setOrg]               = useState<Org | null>(null);
  const [invites, setInvites]       = useState<Invite[]>([]);
  const [loading, setLoading]       = useState(true);
  const [adsConnected, setAdsConnected] = useState<boolean | null>(null);

  // Org rename
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput]     = useState("");
  const [nameSaving, setNameSaving]   = useState(false);

  // Invite form
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole]   = useState("SPECIALIST");
  const [inviting, setInviting]       = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Role change / remove
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Session info (from /api/org which returns current user implicitly)
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [myRole, setMyRole]     = useState<string | null>(null);

  const load = async () => {
    const [orgRes, inviteRes, adsRes, meRes] = await Promise.all([
      fetch("/api/org"),
      fetch("/api/org/invites").catch(() => null),
      fetch("/api/auth/google-ads/status"),
      fetch("/api/auth/me"),
    ]);

    if (orgRes.ok) {
      const data: Org = await orgRes.json();
      setOrg(data);
      setNameInput(data.name);
    }
    if (inviteRes?.ok) {
      setInvites(await inviteRes.json());
    }
    if (adsRes.ok) {
      const d = await adsRes.json();
      setAdsConnected(d.connected);
    }
    if (meRes.ok) {
      const { user } = await meRes.json() as { user: { userId: string } | null };
      if (user) setMyUserId(user.userId);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveName = async () => {
    if (!nameInput.trim() || !org) return;
    setNameSaving(true);
    const res = await fetch("/api/org", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameInput.trim() }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrg(prev => prev ? { ...prev, name: updated.name } : prev);
    }
    setNameSaving(false);
    setEditingName(false);
  };

  const sendInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteError(null);
    const res = await fetch("/api/org/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
    });
    if (!res.ok) {
      const j = await res.json();
      setInviteError(j.error ?? "Failed to create invite");
    } else {
      const invite = await res.json();
      setInvites(prev => [invite, ...prev]);
      setInviteEmail("");
    }
    setInviting(false);
  };

  const copyLink = (token: string) => {
    const base = window.location.origin;
    navigator.clipboard.writeText(`${base}/api/invite/${token}`);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const removeMember = async (userId: string) => {
    setRemovingId(userId);
    await fetch(`/api/org/members?userId=${userId}`, { method: "DELETE" });
    setOrg(prev => prev ? { ...prev, members: prev.members.filter(m => m.user.id !== userId) } : prev);
    setRemovingId(null);
  };

  const changeRole = async (userId: string, role: string) => {
    await fetch(`/api/org/members?userId=${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setOrg(prev => prev ? {
      ...prev,
      members: prev.members.map(m => m.user.id === userId ? { ...m, role } : m),
    } : prev);
  };

  const disconnectAds = async () => {
    await fetch("/api/auth/google-ads/disconnect", { method: "POST" });
    setAdsConnected(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={18} className="animate-spin" style={{ color: "var(--text-dim)" }} />
      </div>
    );
  }

  // Derive my role from the org members list once we know myUserId
  const myMember = org?.members.find(m => m.user.id === myUserId);
  const effectiveRole = myMember?.role ?? myRole;
  const isAdmin = effectiveRole === "OWNER" || effectiveRole === "ADMIN";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)", padding: "0 24px", height: 52,
        display: "flex", alignItems: "center", gap: 16,
        position: "sticky", top: 0, background: "var(--header-bg)",
        backdropFilter: "blur(12px)", zIndex: 10,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-dim)", fontSize: 13, textDecoration: "none" }}>
          <ArrowLeft size={14} /> Back
        </Link>
        <span style={{ color: "var(--border-2)" }}>·</span>
        <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>Settings</span>
      </header>

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "32px 24px" }}>

        {/* ── Organization ─────────────────────────────────────────────── */}
        <Card title="Organization" icon={<Building2 size={15} />}>
          {editingName ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditingName(false); }}
                autoFocus
                style={{
                  flex: 1, padding: "8px 12px", borderRadius: 8,
                  border: "1px solid var(--border-2)", background: "var(--bg)",
                  color: "var(--text)", fontSize: 14, outline: "none",
                }}
              />
              <button onClick={saveName} disabled={nameSaving} style={{ padding: "8px 14px", borderRadius: 8, background: "#1d4ed8", border: "none", color: "#fff", fontSize: 13, cursor: "pointer" }}>
                {nameSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              </button>
              <button onClick={() => setEditingName(false)} style={{ padding: "8px 10px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border-2)", color: "var(--text-dim)", fontSize: 13, cursor: "pointer" }}>
                ✕
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>{org?.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>/{org?.slug}</div>
              </div>
              {isAdmin && (
                <button onClick={() => setEditingName(true)} style={{ fontSize: 12, color: "var(--text-dim)", background: "none", border: "1px solid var(--border-2)", borderRadius: 7, padding: "5px 10px", cursor: "pointer" }}>
                  Rename
                </button>
              )}
            </div>
          )}
        </Card>

        {/* ── Google Ads ───────────────────────────────────────────────── */}
        <Card title="Google Ads MCC" icon={<Zap size={15} />}>
          {adsConnected ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ fontSize: 13, color: "var(--text-2)" }}>Connected</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href="/api/auth/google-ads" style={{ fontSize: 12, color: "var(--text-dim)", background: "none", border: "1px solid var(--border-2)", borderRadius: 7, padding: "5px 10px", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                  <RefreshCw size={11} /> Reconnect
                </a>
                <button onClick={disconnectAds} style={{ fontSize: 12, color: "#ef4444", background: "none", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 7, padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                  <Trash2 size={11} /> Disconnect
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--text-dim)" }}>Not connected</span>
              <a href="/api/auth/google-ads" style={{ fontSize: 12, color: "#fff", background: "#1d4ed8", border: "none", borderRadius: 7, padding: "6px 14px", textDecoration: "none", fontWeight: 600 }}>
                Connect MCC
              </a>
            </div>
          )}
        </Card>

        {/* ── Members ──────────────────────────────────────────────────── */}
        <Card title="Team members" icon={<Users size={15} />}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(org?.members ?? []).map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={m.user.name} image={m.user.image} size={30} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {m.user.name ?? m.user.email}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {m.user.email}
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: roleColor(m.role), background: `${roleColor(m.role)}18`, padding: "2px 7px", borderRadius: 4, flexShrink: 0 }}>
                  {m.role}
                </span>
                {isAdmin && m.user.id !== myUserId && (
                  <div style={{ display: "flex", gap: 4 }}>
                    <select
                      value={m.role}
                      onChange={e => changeRole(m.user.id, e.target.value)}
                      style={{ fontSize: 11, padding: "3px 6px", borderRadius: 5, border: "1px solid var(--border-2)", background: "var(--surface)", color: "var(--text-2)", cursor: "pointer" }}
                    >
                      <option value="OWNER">Owner</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SPECIALIST">Specialist</option>
                    </select>
                    <button onClick={() => removeMember(m.user.id)} disabled={removingId === m.user.id} style={{ padding: "4px 7px", borderRadius: 5, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444", cursor: "pointer", fontSize: 11 }}>
                      {removingId === m.user.id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* ── Invite ───────────────────────────────────────────────────── */}
        {isAdmin && (
          <Card title="Invite team member" icon={<Mail size={15} />}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
              <input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendInvite()}
                placeholder="colleague@agency.com"
                style={{
                  flex: 1, minWidth: 180, padding: "8px 12px", borderRadius: 8,
                  border: "1px solid var(--border-2)", background: "var(--bg)",
                  color: "var(--text)", fontSize: 13, outline: "none",
                }}
              />
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value)}
                style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border-2)", background: "var(--surface)", color: "var(--text-2)", fontSize: 13, cursor: "pointer" }}
              >
                <option value="SPECIALIST">Specialist</option>
                <option value="ADMIN">Admin</option>
                <option value="OWNER">Owner</option>
              </select>
              <button
                onClick={sendInvite}
                disabled={inviting || !inviteEmail.trim()}
                style={{
                  padding: "8px 14px", borderRadius: 8,
                  background: inviting || !inviteEmail.trim() ? "var(--surface-2)" : "#1d4ed8",
                  border: "none", color: inviting || !inviteEmail.trim() ? "var(--text-faint)" : "#fff",
                  fontSize: 13, fontWeight: 600, cursor: inviting || !inviteEmail.trim() ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                {inviting ? <Loader2 size={13} className="animate-spin" /> : <Mail size={13} />} Invite
              </button>
            </div>
            {inviteError && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 8 }}>{inviteError}</p>}

            {/* Pending invites */}
            {invites.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                  Pending invites
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {invites.map(inv => (
                    <div key={inv.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8 }}>
                      <Shield size={12} style={{ color: roleColor(inv.role), flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 12, color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{inv.email}</span>
                        <span style={{ fontSize: 10, color: "var(--text-faint)" }}>{inv.role} · expires {fmtDate(inv.expiresAt)}</span>
                      </div>
                      <button
                        onClick={() => copyLink(inv.token)}
                        title="Copy invite link"
                        style={{ padding: "4px 8px", borderRadius: 6, background: "var(--surface)", border: "1px solid var(--border-2)", color: "var(--text-dim)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}
                      >
                        {copiedToken === inv.token ? <Check size={11} style={{ color: "#22c55e" }} /> : <Copy size={11} />}
                        {copiedToken === inv.token ? "Copied" : "Copy link"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* ── Sign out ─────────────────────────────────────────────────── */}
        <Card title="Account" icon={<LogOut size={15} />}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--text-2)" }}>
                {org?.members.find(m => m.user.id === myUserId)?.user.email ?? "Signed in"}
              </div>
            </div>
            <a
              href="/api/auth/signout"
              style={{ fontSize: 12, color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 7, padding: "6px 12px", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}
            >
              <LogOut size={11} /> Sign out
            </a>
          </div>
        </Card>

      </main>
    </div>
  );
}
