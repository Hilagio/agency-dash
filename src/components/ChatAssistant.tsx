"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  accountId: string;
  constraintBucket: string;
  constraintReason: string;
}

export function ChatAssistant({ accountId, constraintBucket, constraintReason }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `I'm analyzing **${accountId ? "this account" : "the account"}** through the lens of its governing constraint.

The primary focus is: **${constraintBucket.replace("_", " ")}**

_${constraintReason}_

What would you like to understand or work through?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || streaming) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setStreaming(true);

    // Add empty assistant placeholder
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch(`/api/accounts/${accountId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, sessionId }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

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
          }

          if (data.error) {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: `Error: ${data.error}`,
              };
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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Simple markdown-ish rendering
  const renderContent = (content: string) => {
    return content
      .split(/(\*\*[^*]+\*\*|_[^_]+_)/)
      .map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("_") && part.endsWith("_")) {
          return <em key={i} className="text-gray-600">{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
              msg.role === "assistant" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}>
              {msg.role === "assistant" ? (
                <Bot className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>
            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-white border border-gray-100 text-gray-800"
                  : "bg-blue-600 text-white"
              }`}
            >
              {msg.content ? renderContent(msg.content) : (
                <span className="animate-pulse text-gray-400">Thinking…</span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length === 1 && (
        <div className="border-t border-gray-100 p-3">
          <p className="mb-2 text-xs text-gray-400 font-medium">SUGGESTED QUESTIONS</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Why is this the governing constraint?",
              "What's the most impactful first action?",
              "What should I NOT do right now?",
              "What metrics tell me if we're improving?",
            ].map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q); }}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this constraint…"
            rows={2}
            className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none"
          />
          <button
            onClick={send}
            disabled={!input.trim() || streaming}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
