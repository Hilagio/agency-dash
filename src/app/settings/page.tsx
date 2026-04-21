"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Loader2, Building2, Users, Mail, Shield,
  Trash2, RefreshCw, Check, Copy, Zap, LogOut, BookOpen, ChevronDown, ChevronUp, MessageSquare,
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

interface SlackStatus {
  connected:  boolean;
  teamName?:  string;
  teamId?:    string;
}

interface NotionPage {
  id:    string;
  title: string;
  url:   string;
}

interface NotionStatus {
  connected:       boolean;
  workspaceName?:  string;
  selectedPageIds?: string[];
  lastSyncedAt?:   string;
  cachedPages?:    { pageId: string; title: string; fetchedAt: string }[];
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
      background: "linear-gradient(135deg, #c49a0a, #9a7808)",
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

  // Slack
  const [slackStatus, setSlackStatus]         = useState<SlackStatus | null>(null);
  const [slackToken, setSlackToken]           = useState("");
  const [slackConnecting, setSlackConnecting] = useState(false);
  const [slackError, setSlackError]           = useState<string | null>(null);

  // Notion
  const [notionStatus, setNotionStatus]       = useState<NotionStatus | null>(null);
  const [notionToken, setNotionToken]         = useState("");
  const [notionConnecting, setNotionConnecting] = useState(false);
  const [notionError, setNotionError]         = useState<string | null>(null);
  const [notionPages, setNotionPages]         = useState<NotionPage[] | null>(null);
  const [notionLoadingPages, setNotionLoadingPages] = useState(false);
  const [notionSelectedIds, setNotionSelectedIds]   = useState<string[]>([]);
  const [notionSyncing, setNotionSyncing]     = useState(false);
  const [notionShowPages, setNotionShowPages] = useState(false);

  // Session info (from /api/org which returns current user implicitly)
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [myRole, setMyRole]     = useState<string | null>(null);

  const load = async () => {
    const [orgRes, inviteRes, adsRes, meRes, notionRes, slackRes] = await Promise.all([
      fetch("/api/org"),
      fetch("/api/org/invites").catch(() => null),
      fetch("/api/auth/google-ads/status"),
      fetch("/api/auth/me"),
      fetch("/api/integrations/notion"),
      fetch("/api/integrations/slack"),
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
    if (notionRes.ok) {
      const n: NotionStatus = await notionRes.json();
      setNotionStatus(n);
      if (n.selectedPageIds) setNotionSelectedIds(n.selectedPageIds);
    }
    if (slackRes.ok) {
      const s: SlackStatus = await slackRes.json();
      setSlackStatus(s);
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

  const connectNotion = async () => {
    if (!notionToken.trim()) return;
    setNotionConnecting(true);
    setNotionError(null);
    const res = await fetch("/api/integrations/notion", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ token: notionToken.trim() }),
    });
    if (!res.ok) {
      const j = await res.json();
      setNotionError(j.error ?? "Failed to connect");
    } else {
      const n = await res.json();
      setNotionStatus({ connected: true, workspaceName: n.workspaceName, selectedPageIds: [] });
      setNotionToken("");
      loadNotionPages();
    }
    setNotionConnecting(false);
  };

  const loadNotionPages = async () => {
    setNotionLoadingPages(true);
    setNotionShowPages(true);
    const res = await fetch("/api/integrations/notion/pages");
    if (res.ok) {
      const { pages } = await res.json();
      setNotionPages(pages);
    }
    setNotionLoadingPages(false);
  };

  const saveNotionPages = async (ids: string[]) => {
    setNotionSelectedIds(ids);
    await fetch("/api/integrations/notion", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ selectedPageIds: ids }),
    });
  };

  const syncNotion = async () => {
    setNotionSyncing(true);
    const res = await fetch("/api/integrations/notion/sync", { method: "POST" });
    if (res.ok) {
      const { synced } = await res.json();
      const updated: NotionStatus = await fetch("/api/integrations/notion").then(r => r.json());
      setNotionStatus(updated);
      if (updated.selectedPageIds) setNotionSelectedIds(updated.selectedPageIds);
      alert(`Synced ${synced} page${synced !== 1 ? "s" : ""} successfully.`);
    }
    setNotionSyncing(false);
  };

  const disconnectNotion = async () => {
    await fetch("/api/integrations/notion", { method: "DELETE" });
    setNotionStatus({ connected: false });
    setNotionPages(null);
    setNotionSelectedIds([]);
    setNotionShowPages(false);
  };

  const connectSlack = async () => {
    if (!slackToken.trim()) return;
    setSlackConnecting(true);
    setSlackError(null);
    const res = await fetch("/api/integrations/slack", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ token: slackToken.trim() }),
    });
    if (!res.ok) {
      const j = await res.json();
      setSlackError(j.error ?? "Failed to connect");
    } else {
      const s = await res.json();
      setSlackStatus({ connected: true, teamName: s.teamName, teamId: s.teamId });
      setSlackToken("");
    }
    setSlackConnecting(false);
  };

  const disconnectSlack = async () => {
    await fetch("/api/integrations/slack", { method: "DELETE" });
    setSlackStatus({ connected: false });
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
              <button onClick={saveName} disabled={nameSaving} style={{ padding: "8px 14px", borderRadius: 8, background: "var(--btn-primary)", border: "none", color: "#fff", fontSize: 13, cursor: "pointer" }}>
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
              <a href="/api/auth/google-ads" style={{ fontSize: 12, color: "#fff", background: "var(--btn-primary)", border: "none", borderRadius: 7, padding: "6px 14px", textDecoration: "none", fontWeight: 600 }}>
                Connect MCC
              </a>
            </div>
          )}
        </Card>

        {/* ── Notion Knowledge Base ────────────────────────────────────── */}
        <Card title="Notion Knowledge Base" icon={<BookOpen size={15} />}>
          {notionStatus?.connected ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Connected header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
                  <span style={{ fontSize: 13, color: "var(--text-2)" }}>
                    {notionStatus.workspaceName ? `Connected · ${notionStatus.workspaceName}` : "Connected"}
                  </span>
                  {notionStatus.lastSyncedAt && (
                    <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                      · synced {fmtDate(notionStatus.lastSyncedAt)}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={syncNotion}
                    disabled={notionSyncing || notionSelectedIds.length === 0}
                    style={{ fontSize: 12, color: "var(--text-dim)", background: "none", border: "1px solid var(--border-2)", borderRadius: 7, padding: "5px 10px", cursor: notionSyncing || notionSelectedIds.length === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 5 }}
                  >
                    {notionSyncing ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
                    {notionSyncing ? "Syncing…" : "Sync now"}
                  </button>
                  <button
                    onClick={disconnectNotion}
                    style={{ fontSize: 12, color: "#ef4444", background: "none", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 7, padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <Trash2 size={11} /> Disconnect
                  </button>
                </div>
              </div>

              {/* Selected pages summary */}
              {notionStatus.cachedPages && notionStatus.cachedPages.length > 0 && (
                <div style={{ fontSize: 12, color: "var(--text-faint)" }}>
                  {notionStatus.cachedPages.length} page{notionStatus.cachedPages.length !== 1 ? "s" : ""} in AI context:{" "}
                  <span style={{ color: "var(--text-2)" }}>
                    {notionStatus.cachedPages.map(p => p.title).join(", ")}
                  </span>
                </div>
              )}

              {/* Page picker toggle */}
              <button
                onClick={() => { setNotionShowPages(!notionShowPages); if (!notionPages) loadNotionPages(); }}
                style={{ fontSize: 12, color: "var(--text-dim)", background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8, padding: "7px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, width: "fit-content" }}
              >
                {notionShowPages ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {notionShowPages ? "Hide page selector" : "Select pages to include"}
              </button>

              {/* Page list */}
              {notionShowPages && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {notionLoadingPages ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-faint)" }}>
                      <Loader2 size={12} className="animate-spin" /> Loading pages…
                    </div>
                  ) : notionPages && notionPages.length > 0 ? (
                    <>
                      <p style={{ fontSize: 11, color: "var(--text-faint)", marginBottom: 4 }}>
                        Select pages to pull into the AI knowledge base. Sync after changes.
                      </p>
                      {notionPages.map(page => (
                        <label key={page.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 7, cursor: "pointer", background: notionSelectedIds.includes(page.id) ? "rgba(29,78,216,0.08)" : "transparent", border: `1px solid ${notionSelectedIds.includes(page.id) ? "rgba(29,78,216,0.25)" : "transparent"}` }}>
                          <input
                            type="checkbox"
                            checked={notionSelectedIds.includes(page.id)}
                            onChange={e => {
                              const next = e.target.checked
                                ? [...notionSelectedIds, page.id]
                                : notionSelectedIds.filter(id => id !== page.id);
                              saveNotionPages(next);
                            }}
                            style={{ accentColor: "var(--btn-primary)", width: 13, height: 13, flexShrink: 0 }}
                          />
                          <span style={{ fontSize: 13, color: "var(--text-2)" }}>{page.title}</span>
                        </label>
                      ))}
                    </>
                  ) : (
                    <p style={{ fontSize: 12, color: "var(--text-faint)" }}>
                      No pages found. Make sure your integration has been shared with the pages in Notion.
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 13, color: "var(--text-dim)", margin: 0 }}>
                Connect your Notion workspace to pull FAQs, strategy docs, and SOPs into the AI context.
                Create an{" "}
                <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6" }}>
                  internal integration
                </a>{" "}
                in Notion, copy the token, and paste it below.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="password"
                  value={notionToken}
                  onChange={e => setNotionToken(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && connectNotion()}
                  placeholder="ntn_xxxx… or secret_xxxx…"
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border-2)", background: "var(--bg)", color: "var(--text)", fontSize: 13, outline: "none", fontFamily: "monospace" }}
                />
                <button
                  onClick={connectNotion}
                  disabled={notionConnecting || !notionToken.trim()}
                  style={{ padding: "8px 14px", borderRadius: 8, background: notionConnecting || !notionToken.trim() ? "var(--surface-2)" : "var(--btn-primary)", border: "none", color: notionConnecting || !notionToken.trim() ? "var(--text-faint)" : "#fff", fontSize: 13, fontWeight: 600, cursor: notionConnecting || !notionToken.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
                >
                  {notionConnecting ? <Loader2 size={13} className="animate-spin" /> : null}
                  {notionConnecting ? "Connecting…" : "Connect"}
                </button>
              </div>
              {notionError && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{notionError}</p>}
            </div>
          )}
        </Card>

        {/* ── Slack ────────────────────────────────────────────────────── */}
        <Card title="Slack" icon={<MessageSquare size={15} />}>
          {slackStatus?.connected ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
                  <span style={{ fontSize: 13, color: "var(--text-2)" }}>
                    {slackStatus.teamName ? `Connected · ${slackStatus.teamName}` : "Connected"}
                  </span>
                </div>
                <button
                  onClick={disconnectSlack}
                  style={{ fontSize: 12, color: "#ef4444", background: "none", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 7, padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
                >
                  <Trash2 size={11} /> Disconnect
                </button>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-faint)", margin: 0 }}>
                Link individual accounts to Slack channels in each account&apos;s settings to provide AI with change-log context.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <p style={{ fontSize: 13, color: "var(--text-dim)", margin: 0 }}>
                Connect your Slack workspace to give the AI access to per-account channel history.
                Create a Slack app at{" "}
                <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6" }}>
                  api.slack.com/apps
                </a>
                , add scopes <code style={{ fontSize: 11, background: "var(--surface-2)", padding: "1px 4px", borderRadius: 3 }}>channels:read channels:history groups:read groups:history</code>,
                install to your workspace, and paste the Bot User OAuth Token below.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="password"
                  value={slackToken}
                  onChange={e => setSlackToken(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && connectSlack()}
                  placeholder="xoxb-…"
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border-2)", background: "var(--bg)", color: "var(--text)", fontSize: 13, outline: "none", fontFamily: "monospace" }}
                />
                <button
                  onClick={connectSlack}
                  disabled={slackConnecting || !slackToken.trim()}
                  style={{ padding: "8px 14px", borderRadius: 8, background: slackConnecting || !slackToken.trim() ? "var(--surface-2)" : "var(--btn-primary)", border: "none", color: slackConnecting || !slackToken.trim() ? "var(--text-faint)" : "#fff", fontSize: 13, fontWeight: 600, cursor: slackConnecting || !slackToken.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
                >
                  {slackConnecting ? <Loader2 size={13} className="animate-spin" /> : null}
                  {slackConnecting ? "Connecting…" : "Connect"}
                </button>
              </div>
              {slackError && <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{slackError}</p>}
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
                  background: inviting || !inviteEmail.trim() ? "var(--surface-2)" : "var(--btn-primary)",
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
