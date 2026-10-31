"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Bot, User, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AssistantPanelProps {
  open: boolean;
  onClose: () => void;
}

const TOOL_DOCS = `You are Readlyn's built-in design assistant. You help users understand and use the infographic editor effectively.

Available tools in the editor:

1. **Elements (Left Panel)**: Add headings, body text, rectangles, circles, stat blocks, and divider lines to the canvas.
2. **Layers Panel**: View, reorder (drag), show/hide, lock/unlock, or delete every object on the canvas.
3. **Properties Panel (Right)**: Edit position, size, rotation, opacity, fill, stroke, font, and alignment for the selected object.
4. **Content Check (Right)**: Audits text readability, detects overflow, and surfaces numbers that may need fact-checking.
5. **Multi Export**: Export the canvas as PNG, SVG, or PDF at custom DPI settings.
6. **Dev Mode**: View the selected element as CSS, HTML, SVG, and React code snippets.
7. **Brand Kit**: Save brand colours and apply them globally across the canvas.
8. **Design Tokens**: Export a W3C-compatible design tokens JSON from the active palette.
9. **Command Palette (Ctrl+K)**: Run any editor action by name without using the mouse.
10. **Keyboard Shortcuts (?)**: Full reference of shortcuts: V (select), H (hand/pan), Ctrl+Z (undo), arrows (nudge), Delete (remove).

Canvas tips:
- Hold Space and drag to pan the canvas from anywhere.
- Scroll wheel zooms in/out centred on the cursor.
- Ctrl+D duplicates the selected object.
- Ctrl+A selects all objects.
- Ctrl+Shift+G groups a selection; Ctrl+Alt+G ungroups.
- Drag layer rows to reorder the canvas stack.

Be concise, practical, and specific. When recommending steps, number them.`;

const SUGGESTIONS = [
  "How do I add a stat block?",
  "How do I export as PDF?",
  "How do I reorder layers?",
  "What keyboard shortcuts are available?",
  "How do I apply a brand colour?",
  "How do I group elements?",
];

export default function AssistantPanel({ open, onClose }: AssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi! I'm the Readlyn assistant. Ask me anything about the editor tools, shortcuts, design tips, or step-by-step guidance.",
        },
      ]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      const userText = text.trim();
      if (!userText || loading) return;
      setInput("");
      setShowSuggestions(false);
      const updated: Message[] = [...messages, { role: "user", content: userText }];
      setMessages(updated);
      setLoading(true);
      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ system: TOOL_DOCS, messages: updated }),
        });
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content ?? "Sorry, I couldn't respond." },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'm having trouble connecting right now. Please check your internet connection and try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!open) return null;

  return (
    <aside className="fixed right-0 top-11 z-40 h-[calc(100vh-44px)] w-[320px] border-l border-(--line-subtle) bg-(--surface-base) flex flex-col shadow-(--elevation-floating)">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-(--line-subtle) shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-(--fill-default) border border-(--line-default) flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-(--text-body)" />
          </div>
          <span className="text-[13px] font-semibold text-(--text-primary)">Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded border border-(--line-default) text-(--text-body) hover:bg-(--fill-default) hover:text-(--text-primary) transition-colors"
          aria-label="Close assistant"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-hide">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                msg.role === "assistant"
                  ? "bg-(--fill-default) border border-(--line-default)"
                  : "bg-(--accent) border border-(--accent-hover)"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot className="w-3 h-3 text-(--text-body)" />
              ) : (
                <User className="w-3 h-3 text-(--accent-ink)" />
              )}
            </div>
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-[12px] leading-relaxed whitespace-pre-wrap ${
                msg.role === "assistant"
                  ? "bg-(--surface-raised) border border-(--line-subtle) text-(--text-body)"
                  : "bg-(--fill-default) border border-(--line-default) text-(--text-primary)"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 bg-(--fill-default) border border-(--line-default) mt-0.5">
              <Bot className="w-3 h-3 text-(--text-body)" />
            </div>
            <div className="bg-(--surface-raised) border border-(--line-subtle) rounded-lg px-3 py-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-(--text-faint)" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {showSuggestions && messages.length <= 1 && (
        <div className="px-3 pb-2 shrink-0">
          <button
            onClick={() => setShowSuggestions((v) => !v)}
            className="flex items-center gap-1 text-[10px] text-(--text-faint) mb-2 hover:text-(--text-muted) transition-colors"
          >
            {showSuggestions ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            Suggestions
          </button>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="px-2 py-1 text-[10px] rounded-md border border-(--line-default) bg-(--surface-raised) text-(--text-body) hover:border-(--line-strong) hover:text-(--text-primary) transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-3 pb-3 pt-2 border-t border-(--line-subtle) shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about the editor…"
            rows={1}
            disabled={loading}
            className="flex-1 px-3 py-2 text-[12px] bg-(--surface-raised) border border-(--line-default) rounded-lg text-(--text-primary) placeholder:text-(--text-faint) resize-none focus:outline-none focus:border-(--line-strong) transition-all leading-relaxed disabled:opacity-50"
            style={{ minHeight: "36px" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="h-9 w-9 flex items-center justify-center rounded-lg bg-(--accent) hover:bg-(--accent-hover) disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            aria-label="Send"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-(--accent-ink)" />
            ) : (
              <Send className="w-3.5 h-3.5 text-(--accent-ink)" />
            )}
          </button>
        </div>
        <p className="text-[9px] text-(--text-faint) mt-1.5">⌘+↵ to send</p>
      </div>
    </aside>
  );
}
