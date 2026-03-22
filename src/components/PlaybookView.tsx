"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, RefreshCw, BookOpen } from "lucide-react";

// Re-use the markdown renderer from ChatAssistant pattern
function renderMarkdown(content: string): React.ReactNode {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      nodes.push(
        <h1 key={i} style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.5px", margin: "0 0 20px" }}>
          {line.slice(2)}
        </h1>
      );
      i++; continue;
    }
    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={i} style={{ fontSize: 15, fontWeight: 700, color: "var(--text-2)", letterSpacing: "-0.3px", margin: "28px 0 10px", paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
          {line.slice(3)}
        </h2>
      );
      i++; continue;
    }
    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={i} style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)", margin: "16px 0 6px" }}>
          {line.slice(4)}
        </h3>
      );
      i++; continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul key={i} style={{ paddingLeft: 20, margin: "8px 0", display: "flex", flexDirection: "column", gap: 5 }}>
          {items.map((item, j) => (
            <li key={j} style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65, listStyleType: "disc" }}>
              {inlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      nodes.push(
        <ol key={i} style={{ paddingLeft: 22, margin: "8px 0", display: "flex", flexDirection: "column", gap: 5 }}>
          {items.map((item, j) => (
            <li key={j} style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.65, listStyleType: "decimal" }}>
              {inlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    if (line === "---") {
      nodes.push(<hr key={i} style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0" }} />);
      i++; continue;
    }

    if (line.trim() === "") {
      nodes.push(<div key={i} style={{ height: 8 }} />);
      i++; continue;
    }

    nodes.push(
      <p key={i} style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>
        {inlineMarkdown(line)}
      </p>
    );
    i++;
  }

  return <>{nodes}</>;
}

function inlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} style={{ color: "var(--text-2)", fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} style={{ fontFamily: "monospace", fontSize: 11, background: "var(--surface-2)", border: "1px solid var(--border-3)", borderRadius: 4, padding: "1px 5px", color: "#a0c4ff" }}>{part.slice(1, -1)}</code>;
    return <span key={i}>{part}</span>;
  });
}

interface Props {
  accountId: string;
  accountName: string;
  hasSnapshot: boolean;
}

export function PlaybookView({ accountId, accountName, hasSnapshot }: Props) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (content) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [content]);

  const generate = async () => {
    setContent("");
    setLoading(true);
    setGenerated(false);
    try {
      const res = await fetch(`/api/accounts/${accountId}/playbook`, { method: "POST" });
      if (!res.ok) {
        const j = await res.json();
        setContent(`**Error:** ${j.error}`);
        return;
      }

      const reader  = res.body!.getReader();
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
          const data = JSON.parse(line.slice(6));
          if (data.text) setContent(prev => prev + data.text);
          if (data.done) setGenerated(true);
          if (data.error) setContent(prev => prev + `\n\n**Error:** ${data.error}`);
        }
      }
      setGenerated(true);
    } finally {
      setLoading(false);
    }
  };

  if (!hasSnapshot) {
    return (
      <div style={{ border: "1px dashed var(--border-2)", borderRadius: 14, padding: "60px 32px", textAlign: "center" }}>
        <p style={{ color: "var(--text-dim)", fontSize: 14 }}>Run constraint scoring first to generate a playbook.</p>
      </div>
    );
  }

  if (!generated && !loading && !content) {
    return (
      <div style={{ border: "1px dashed var(--border-2)", borderRadius: 14, padding: "60px 32px", textAlign: "center" }}>
        <BookOpen size={28} style={{ color: "var(--text-faint)", marginBottom: 16 }} />
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 6, fontWeight: 600 }}>
          Generate optimization playbook
        </p>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
          A concrete, step-by-step guide based on this account's constraint data and your SOPs.
          Takes about 20 seconds.
        </p>
        <button onClick={generate} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#1d4ed8", border: "none", borderRadius: 8,
          color: "#fff", fontSize: 13, fontWeight: 600, padding: "10px 24px", cursor: "pointer",
        }}>
          <BookOpen size={14} /> Generate playbook for {accountName}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ fontSize: 11, color: "var(--text-faint)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px" }}>
          AI-generated playbook · {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
        </span>
        <button
          onClick={generate}
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "var(--surface)", border: "1px solid var(--border-2)",
            borderRadius: 7, color: "var(--text-dim)", fontSize: 11, padding: "6px 12px",
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
          {loading ? "Generating…" : "Regenerate"}
        </button>
      </div>

      {/* Content */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 12, padding: "28px 32px", lineHeight: 1.7,
      }}>
        {renderMarkdown(content)}
        {loading && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-faint)", fontSize: 12, marginTop: 8 }}>
            <Loader2 size={12} className="animate-spin" /> Writing…
          </span>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
