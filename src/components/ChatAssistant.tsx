"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, ThumbsUp, ThumbsDown, Check } from "lucide-react";

interface Message {
  role:      "user" | "assistant";
  content:   string;
  messageId?: string; // set on assistant messages once streaming completes
  streaming?: boolean;
}

interface Props {
  accountId: string;
  constraintBucket: string;
  constraintReason: string;
}

// ─── Markdown renderer ────────────────────────────────────────────────────────

function renderMarkdown(content: string): React.ReactNode {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Heading
    if (line.startsWith("### ")) {
      nodes.push(<p key={i} style={{ fontWeight: 700, color: "var(--text-3)", fontSize: 13, marginTop: 12, marginBottom: 4 }}>{line.slice(4)}</p>);
      i++; continue;
    }
    if (line.startsWith("## ")) {
      nodes.push(<p key={i} style={{ fontWeight: 700, color: "var(--text-2)", fontSize: 14, marginTop: 14, marginBottom: 4 }}>{line.slice(3)}</p>);
      i++; continue;
    }

    // Code block
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      nodes.push(
        <pre key={i} style={{
          background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 8,
          padding: "10px 12px", margin: "8px 0",
          fontSize: 11, color: "#a0c4ff", overflowX: "auto", lineHeight: 1.6,
          fontFamily: '"SF Mono", "Fira Code", monospace',
        }}>
          {codeLines.join("\n")}
        </pre>
      );
      i++; continue;
    }

    // Bullet list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul key={i} style={{ paddingLeft: 18, margin: "6px 0", display: "flex", flexDirection: "column", gap: 3 }}>
          {items.map((item, j) => (
            <li key={j} style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, listStyleType: "disc" }}>
              {inlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      nodes.push(
        <ol key={i} style={{ paddingLeft: 20, margin: "6px 0", display: "flex", flexDirection: "column", gap: 3 }}>
          {items.map((item, j) => (
            <li key={j} style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, listStyleType: "decimal" }}>
              {inlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Horizontal rule
    if (line === "---" || line === "***") {
      nodes.push(<hr key={i} style={{ border: "none", borderTop: "1px solid var(--surface-3)", margin: "10px 0" }} />);
      i++; continue;
    }

    // Empty line = spacing
    if (line.trim() === "") {
      nodes.push(<div key={i} style={{ height: 6 }} />);
      i++; continue;
    }

    // Regular paragraph
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
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|_[^_]+_)/);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: "var(--text-3)", fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    if ((part.startsWith("*") && part.endsWith("*")) || (part.startsWith("_") && part.endsWith("_"))) {
      return <em key={i} style={{ color: "var(--text-muted)" }}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} style={{
          fontFamily: '"SF Mono", "Fira Code", monospace',
          fontSize: 11, background: "var(--surface-2)", border: "1px solid var(--border-3)",
          borderRadius: 4, padding: "1px 5px", color: "#a0c4ff",
        }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

const QUICK_PROMPTS = [
  "Why is this the governing constraint?",
  "What's the most impactful first action?",
  "What should I NOT do right now?",
  "What metrics show we're improving?",
];

export function ChatAssistant({ accountId, constraintBucket, constraintReason }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role:    "assistant",
      content: `Analyzing this account through its governing constraint: **${constraintBucket}**\n\n_${constraintReason}_\n\nWhat would you like to work through?`,
    },
  ]);
  const [input, setInput]       = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);

  // Feedback state: keyed by messageId
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, "up" | "down">>({});
  const [correctionOpen, setCorrectionOpen] = useState<string | null>(null); // messageId
  const [correctionText, setCorrectionText] = useState("");
  const [correctionSent, setCorrectionSent] = useState<Record<string, boolean>>({});

  // Track the last user message for attaching to feedback
  const lastUserMessageRef = useRef<string>("");

  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submitFeedback = async (messageId: string, rating: "up" | "down", correction?: string) => {
    const questionText = lastUserMessageRef.current;
    setFeedbackGiven(prev => ({ ...prev, [messageId]: rating }));
    if (rating === "up") setCorrectionOpen(null);
    await fetch(`/api/accounts/${accountId}/chat/feedback`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ messageId, rating, correction, questionText }),
    });
    if (correction) {
      setCorrectionSent(prev => ({ ...prev, [messageId]: true }));
      setCorrectionOpen(null);
      setCorrectionText("");
    }
  };

  const send = async (text?: string) => {
    const userMessage = (text ?? input).trim();
    if (!userMessage || streaming) return;

    lastUserMessageRef.current = userMessage;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "", streaming: true }]);

    try {
      const res = await fetch(`/api/accounts/${accountId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, sessionId }),
      });

      if (!res.ok) throw new Error(await res.text());

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
          const data = JSON.parse(line.slice(6));
          if (data.text) {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: updated[updated.length - 1].content + data.text,
              };
              return updated;
            });
          }
          if (data.done && data.sessionId) {
            setSessionId(data.sessionId);
            // Mark message as done (streaming: false) and attach messageId
            if (data.messageId) {
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  messageId: data.messageId,
                  streaming: false,
                };
                return updated;
              });
            }
          }
          if (data.error) {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content: `Error: ${data.error}` };
              return updated;
            });
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: `Failed to get response: ${err instanceof Error ? err.message : "Unknown error"}`,
        };
        return updated;
      });
    } finally {
      setStreaming(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg-deep)" }}>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start", gap: 10 }}>
              {/* Avatar */}
              <div style={{
                width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700,
                background: msg.role === "assistant" ? "#1d4ed8" : "var(--surface-3)",
                color: msg.role === "assistant" ? "#fff" : "var(--text-muted)",
                marginTop: 2,
              }}>
                {msg.role === "assistant" ? "AI" : "U"}
              </div>

              {/* Bubble + feedback */}
              <div style={{ maxWidth: "82%", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{
                  background: msg.role === "user" ? "#1d4ed8" : "var(--surface)",
                  border: msg.role === "user" ? "none" : "1px solid var(--surface-3)",
                  borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  padding: "10px 14px",
                }}>
                  {msg.content
                    ? (msg.role === "assistant"
                        ? renderMarkdown(msg.content)
                        : <p style={{ fontSize: 13, color: "#fff", lineHeight: 1.6, margin: 0 }}>{msg.content}</p>)
                    : <span style={{ fontSize: 13, color: "var(--text-dim)" }}>
                        <Loader2 size={12} className="animate-spin" style={{ display: "inline", marginRight: 6 }} />
                        Thinking…
                      </span>}
                </div>

                {/* Feedback row — only on completed assistant messages */}
                {msg.role === "assistant" && msg.messageId && !msg.streaming && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {feedbackGiven[msg.messageId] ? (
                        <span style={{ fontSize: 11, color: feedbackGiven[msg.messageId] === "up" ? "#22c55e" : "var(--text-faint)" }}>
                          {feedbackGiven[msg.messageId] === "up" ? "Helpful" : "Noted — thanks for the correction"}
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => submitFeedback(msg.messageId!, "up")}
                            title="Helpful"
                            style={{ padding: "3px 7px", borderRadius: 6, background: "none", border: "1px solid var(--border-2)", color: "var(--text-faint)", cursor: "pointer", display: "flex", alignItems: "center", gap: 3, fontSize: 11 }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#22c55e")}
                            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-faint)")}
                          >
                            <ThumbsUp size={11} /> Helpful
                          </button>
                          <button
                            onClick={() => setCorrectionOpen(correctionOpen === msg.messageId ? null : msg.messageId!)}
                            title="Needs correction"
                            style={{ padding: "3px 7px", borderRadius: 6, background: "none", border: "1px solid var(--border-2)", color: "var(--text-faint)", cursor: "pointer", display: "flex", alignItems: "center", gap: 3, fontSize: 11 }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#f97316")}
                            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-faint)")}
                          >
                            <ThumbsDown size={11} /> Correct this
                          </button>
                        </>
                      )}
                    </div>

                    {/* Correction input */}
                    {correctionOpen === msg.messageId && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "8px 10px", background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 10 }}>
                        <p style={{ fontSize: 11, color: "var(--text-faint)", margin: 0 }}>What should the correct answer be? This improves future responses.</p>
                        <textarea
                          value={correctionText}
                          onChange={e => setCorrectionText(e.target.value)}
                          placeholder="The correct approach is…"
                          rows={2}
                          style={{ resize: "none", background: "var(--bg)", border: "1px solid var(--border-2)", borderRadius: 7, color: "var(--text-2)", fontSize: 12, padding: "7px 10px", outline: "none", fontFamily: "inherit", lineHeight: 1.5 }}
                        />
                        <div style={{ display: "flex", gap: 6 }}>
                          <button
                            onClick={() => submitFeedback(msg.messageId!, "down", correctionText)}
                            disabled={!correctionText.trim()}
                            style={{ padding: "5px 12px", borderRadius: 7, background: correctionText.trim() ? "#1d4ed8" : "var(--surface-2)", border: "none", color: correctionText.trim() ? "#fff" : "var(--text-faint)", fontSize: 12, cursor: correctionText.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 5 }}
                          >
                            {correctionSent[msg.messageId!] ? <><Check size={11} /> Saved</> : "Submit correction"}
                          </button>
                          <button
                            onClick={() => { submitFeedback(msg.messageId!, "down"); setCorrectionOpen(null); }}
                            style={{ padding: "5px 10px", borderRadius: 7, background: "none", border: "1px solid var(--border-2)", color: "var(--text-faint)", fontSize: 12, cursor: "pointer" }}
                          >
                            Skip
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} style={{ height: 12 }} />
        </div>
      </div>

      {/* Quick prompts — only on first message */}
      {messages.length === 1 && (
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: 8 }}>
            Suggested
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                style={{
                  background: "var(--surface-2)", border: "1px solid var(--border-2)",
                  borderRadius: 20, color: "var(--text-muted)", fontSize: 11,
                  padding: "5px 12px", cursor: "pointer",
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-3)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-3)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-2)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this constraint… (Enter to send)"
            rows={2}
            style={{
              flex: 1, resize: "none", background: "var(--surface-2)",
              border: "1px solid var(--border-2)", borderRadius: 10,
              color: "var(--text-2)", fontSize: 13, padding: "10px 14px",
              outline: "none", lineHeight: 1.5,
              fontFamily: "inherit",
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "var(--border-3)")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--border-2)")}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || streaming}
            style={{
              width: 38, height: 38, borderRadius: 10, border: "none",
              background: input.trim() && !streaming ? "#1d4ed8" : "var(--surface-2)",
              color: input.trim() && !streaming ? "#fff" : "var(--text-faint)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: input.trim() && !streaming ? "pointer" : "not-allowed",
              flexShrink: 0, transition: "background 0.15s, color 0.15s",
            }}
          >
            {streaming ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
