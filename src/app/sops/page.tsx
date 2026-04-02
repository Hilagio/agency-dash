"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, ToggleLeft, ToggleRight, Loader2, BookOpen } from "lucide-react";

interface Sop {
  id:        string;
  title:     string;
  content:   string;
  tags:      string;
  isActive:  boolean;
  createdAt: string;
}

export default function SopsPage() {
  const [sops, setSops]           = useState<Sop[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [title, setTitle]         = useState("");
  const [content, setContent]     = useState("");
  const [saving, setSaving]       = useState(false);
  const [expanded, setExpanded]   = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/sops");
    if (res.ok) setSops(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    const res = await fetch("/api/sops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), content: content.trim() }),
    });
    if (res.ok) {
      await load();
      setTitle("");
      setContent("");
      setShowForm(false);
    }
    setSaving(false);
  };

  const toggle = async (sop: Sop) => {
    await fetch(`/api/sops/${sop.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !sop.isActive }),
    });
    setSops(prev => prev.map(s => s.id === sop.id ? { ...s, isActive: !s.isActive } : s));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this SOP? The AI will no longer reference it.")) return;
    await fetch(`/api/sops/${id}`, { method: "DELETE" });
    setSops(prev => prev.filter(s => s.id !== id));
  };

  const activeSops = sops.filter(s => s.isActive).length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      <header style={{
        borderBottom: "1px solid var(--border)", padding: "0 28px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, background: "var(--header-bg)", backdropFilter: "blur(12px)", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-dim)", fontSize: 13, textDecoration: "none" }}>
            <ArrowLeft size={14} /> All accounts
          </Link>
          <span style={{ color: "var(--border-2)" }}>|</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BookOpen size={14} style={{ color: "var(--text-muted)" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Agency SOPs</span>
            {activeSops > 0 && (
              <span style={{ fontSize: 10, background: "rgba(59,130,246,0.15)", color: "#60a5fa", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>
                {activeSops} active
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "var(--btn-primary)", border: "none", borderRadius: 7,
            color: "#fff", fontSize: 12, fontWeight: 600, padding: "6px 14px", cursor: "pointer",
          }}
        >
          <Plus size={12} /> Add SOP
        </button>
      </header>

      <main style={{ maxWidth: 780, margin: "0 auto", padding: "28px 24px" }}>

        {/* Explanation */}
        <div style={{
          background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)",
          borderRadius: 10, padding: "14px 18px", marginBottom: 24, fontSize: 13,
        }}>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: "var(--text-2)" }}>Agency knowledge base.</strong>{" "}
            Active SOPs are injected into every AI advisor session and optimization playbook.
            Paste your standard procedures, account guidelines, or strategy notes directly from Notion.
            The AI will reason from your playbook, not generic advice.
          </p>
        </div>

        {/* Add form */}
        {showForm && (
          <div style={{
            border: "1px solid var(--border)", borderRadius: 12,
            padding: "20px 22px", marginBottom: 24, background: "var(--surface)",
          }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", marginBottom: 14 }}>New SOP</p>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title — e.g. 'Ecommerce Search Campaign SOP'"
              style={{
                width: "100%", padding: "10px 14px", marginBottom: 12,
                background: "var(--bg)", border: "1px solid var(--border-2)",
                borderRadius: 8, color: "var(--text-2)", fontSize: 13, outline: "none",
                boxSizing: "border-box",
              }}
            />
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste content from Notion, Google Docs, or type directly…

Include: account structure guidelines, bidding strategy rules, campaign naming conventions, client-specific notes, optimization checklists — anything you want the AI to reference."
              rows={12}
              style={{
                width: "100%", padding: "10px 14px",
                background: "var(--bg)", border: "1px solid var(--border-2)",
                borderRadius: 8, color: "var(--text-2)", fontSize: 13,
                resize: "vertical", outline: "none", lineHeight: 1.6,
                fontFamily: "inherit", boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
              <button onClick={() => { setShowForm(false); setTitle(""); setContent(""); }} style={{
                background: "transparent", border: "1px solid var(--border-2)",
                borderRadius: 7, color: "var(--text-dim)", fontSize: 12, padding: "6px 14px", cursor: "pointer",
              }}>
                Cancel
              </button>
              <button onClick={save} disabled={saving || !title.trim() || !content.trim()} style={{
                background: saving || !title.trim() || !content.trim() ? "var(--surface-2)" : "var(--btn-primary)",
                border: "none", borderRadius: 7,
                color: saving || !title.trim() || !content.trim() ? "var(--text-dim)" : "#fff",
                fontSize: 12, fontWeight: 600, padding: "6px 14px",
                cursor: saving || !title.trim() || !content.trim() ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {saving ? <><Loader2 size={11} className="animate-spin" /> Saving…</> : "Save SOP"}
              </button>
            </div>
          </div>
        )}

        {/* SOP list */}
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", padding: "60px 0", color: "var(--text-dim)", fontSize: 13 }}>
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : sops.length === 0 ? (
          <div style={{ border: "1px dashed var(--border-2)", borderRadius: 12, padding: "60px 32px", textAlign: "center" }}>
            <BookOpen size={28} style={{ color: "var(--text-faint)", marginBottom: 16 }} />
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 6 }}>No SOPs yet.</p>
            <p style={{ color: "var(--text-faint)", fontSize: 13 }}>Click <strong>Add SOP</strong> to paste your first procedure.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sops.map(sop => (
              <div key={sop.id} style={{
                border: `1px solid ${sop.isActive ? "var(--border)" : "var(--border-2)"}`,
                borderRadius: 10, overflow: "hidden",
                opacity: sop.isActive ? 1 : 0.55,
              }}>
                {/* Header */}
                <div
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px", background: "var(--surface)",
                    cursor: "pointer",
                  }}
                  onClick={() => setExpanded(expanded === sop.id ? null : sop.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{sop.title}</span>
                    <span style={{ fontSize: 10, color: "var(--text-faint)" }}>
                      {sop.content.length.toLocaleString()} chars
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => toggle(sop)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: sop.isActive ? "#22c55e" : "var(--text-faint)", display: "flex", alignItems: "center" }}
                      title={sop.isActive ? "Active — click to deactivate" : "Inactive — click to activate"}
                    >
                      {sop.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    <button
                      onClick={() => remove(sop.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", display: "flex", alignItems: "center" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded content preview */}
                {expanded === sop.id && (
                  <div style={{ padding: "14px 16px", borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
                    <pre style={{
                      fontSize: 12, color: "var(--text-dim)", lineHeight: 1.6,
                      whiteSpace: "pre-wrap", wordBreak: "break-word",
                      maxHeight: 300, overflowY: "auto", margin: 0,
                      fontFamily: "inherit",
                    }}>
                      {sop.content}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
