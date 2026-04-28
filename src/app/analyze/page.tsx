"use client";

import { useState, useRef } from "react";
import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

type Status = "idle" | "fetching" | "analyzing" | "done" | "error";

type Section = { title: string; content: string };

const SECTION_META: Record<string, { color: string; icon: React.ReactElement }> = {
  "Quick Assessment": {
    color: "#6366f1",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  },
  "Quick Wins": {
    color: "#22c55e",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  },
  "What's Missing": {
    color: "#f59e0b",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  },
  "Google Ads Alignment": {
    color: "#3b82f6",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
  "Tracking & Tech Stack": {
    color: "#a855f7",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/></svg>,
  },
  "Priority Actions": {
    color: "#ec4899",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  },
};

function renderContent(text: string): React.ReactElement {
  const lines = text.trim().split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} style={{ height: 6 }} />;

        // Bold leading label like "**1. Heading**"
        const boldLine = trimmed.replace(/\*\*([^*]+)\*\*/g, (_, t) => `<strong>${t}</strong>`);

        // Bullet point
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          const content = trimmed.slice(2).replace(/\*\*([^*]+)\*\*/g, (_, t) => `<strong>${t}</strong>`);
          return (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <span style={{ color: "var(--text-dim)", marginTop: 2, flexShrink: 0 }}>•</span>
              <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          );
        }

        // Numbered item like **1. Something**
        if (/^\*\*\d+\./.test(trimmed)) {
          return (
            <div key={i} style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.6, marginBottom: 4 }}
              dangerouslySetInnerHTML={{ __html: boldLine }} />
          );
        }

        return (
          <div key={i} style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 3 }}
            dangerouslySetInnerHTML={{ __html: boldLine }} />
        );
      })}
    </>
  );
}

export default function AnalyzePage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState("");
  const bufferRef = useRef("");

  function processBuffer(extra: string) {
    bufferRef.current += extra;
    const text = bufferRef.current;
    const lines = text.split("\n");
    const newSections: Section[] = [];
    let cur: Section | null = null;

    for (const line of lines) {
      if (line.startsWith("## ")) {
        if (cur) newSections.push({ ...cur });
        cur = { title: line.slice(3).trim(), content: "" };
      } else if (cur) {
        cur.content += line + "\n";
      }
    }
    if (cur) newSections.push({ ...cur }); // last section (possibly still streaming)
    if (newSections.length > 0) setSections([...newSections]);
  }

  async function analyze() {
    const trimmed = url.trim();
    if (!trimmed) return;

    setStatus("fetching");
    setError(null);
    setSections([]);
    bufferRef.current = "";
    setAnalyzedUrl(trimmed);

    try {
      const res = await fetch("/api/analyze-page", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ url: trimmed }),
      });

      if (!res.ok) {
        const j = await res.json() as { error?: string };
        throw new Error(j.error ?? "Analysis failed");
      }

      setStatus("analyzing");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = JSON.parse(line.slice(6)) as { text?: string; done?: boolean; error?: string };
          if (data.text) processBuffer(data.text);
          if (data.error) throw new Error(data.error);
          if (data.done) setStatus("done");
        }
      }
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") analyze();
  }

  const isDone    = status === "done";
  const isLoading = status === "fetching" || status === "analyzing";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "0 28px",
        height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: 6,
            color: "var(--text-dim)", fontSize: 12, textDecoration: "none",
            transition: "color 0.12s",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)"}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-dim)"}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Dashboard
          </Link>
          <div style={{ width: 1, height: 14, background: "var(--border-2)" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Page Analyzer</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Hero / input */}
      <div style={{
        padding: "52px 28px 40px",
        maxWidth: 760, margin: "0 auto", width: "100%",
      }}>
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--text)", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
            Landing page analysis
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-dim)", margin: 0 }}>
            Paste a prospect&apos;s URL — get instant CRO feedback and Google Ads alignment before your call.
          </p>
        </div>

        {/* URL input row */}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={handleKey}
            placeholder="https://www.example.com/product"
            disabled={isLoading}
            style={{
              flex: 1,
              background: "var(--surface)",
              border: "1px solid var(--border-2)",
              borderRadius: 9,
              padding: "11px 14px",
              fontSize: 14,
              color: "var(--text)",
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.12s",
            }}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = "var(--accent)"}
            onBlur={e  => (e.target as HTMLInputElement).style.borderColor = "var(--border-2)"}
          />
          <button
            onClick={analyze}
            disabled={isLoading || !url.trim()}
            style={{
              background: isLoading ? "var(--surface-2)" : "var(--btn-primary)",
              border: "none",
              borderRadius: 9,
              color: isLoading ? "var(--text-dim)" : "#fff",
              fontSize: 13,
              fontWeight: 600,
              padding: "11px 20px",
              cursor: isLoading ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              transition: "background 0.12s",
              display: "flex", alignItems: "center", gap: 7,
            }}
          >
            {isLoading ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ animation: "spin 1s linear infinite" }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                {status === "fetching" ? "Fetching page…" : "Analyzing…"}
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Analyze
              </>
            )}
          </button>
        </div>

        {/* Status caption */}
        {isLoading && (
          <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 10, textAlign: "center" }}>
            {status === "fetching"
              ? `Fetching ${analyzedUrl}…`
              : "Analyzing content — this takes about 10 seconds…"}
          </p>
        )}

        {status === "error" && error && (
          <div style={{
            marginTop: 16, padding: "10px 14px",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 8, fontSize: 13, color: "#ef4444",
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {sections.length > 0 && (
        <div style={{ maxWidth: 760, margin: "0 auto", width: "100%", padding: "0 28px 60px" }}>

          {/* Analyzed URL badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontSize: 11, color: "var(--text-dim)",
                background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: 20, padding: "3px 10px", fontFamily: "monospace",
              }}>
                {analyzedUrl.replace(/^https?:\/\//, "").split("?")[0]}
              </span>
              {isDone && (
                <span style={{ fontSize: 11, color: "#22c55e" }}>Analysis complete</span>
              )}
            </div>
            {isDone && (
              <button
                onClick={() => {
                  const fullText = sections.map(s => `## ${s.title}\n${s.content}`).join("\n\n");
                  navigator.clipboard.writeText(fullText);
                }}
                style={{
                  fontSize: 11, color: "var(--text-dim)",
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy report
              </button>
            )}
          </div>

          {/* Section cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sections.map((section, i) => {
              const meta = SECTION_META[section.title] ?? { color: "var(--accent)", icon: null };
              const isLastAndStreaming = !isDone && i === sections.length - 1;

              return (
                <div key={section.title} style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderLeft: `3px solid ${meta.color}`,
                  borderRadius: 10,
                  padding: "16px 18px",
                  transition: "opacity 0.2s",
                }}>
                  {/* Card header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                    <span style={{ color: meta.color, display: "flex" }}>{meta.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", letterSpacing: "0.2px", textTransform: "uppercase" }}>
                      {section.title}
                    </span>
                    {isLastAndStreaming && (
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: meta.color,
                        display: "inline-block",
                        animation: "pulse 1s ease-in-out infinite",
                        marginLeft: 4,
                      }} />
                    )}
                  </div>

                  {/* Card content */}
                  <div>{renderContent(section.content)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  );
}
