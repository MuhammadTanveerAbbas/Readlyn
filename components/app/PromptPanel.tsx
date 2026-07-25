"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Loader2, Plus, Type, Square, Circle, BarChart2, Minus, X } from "lucide-react";
import {
  CANVAS_SIZES,
  THEME_COLORS,
  type ThemePalette,
  type CanvasSize,
  type StylePreset,
} from "@/types/infographic";

interface PromptPanelProps {
  onGenerate: (
    prompt: string,
    theme: ThemePalette,
    size: CanvasSize,
    style: StylePreset,
  ) => Promise<void>;
  onAddElement: (
    type: "heading" | "text" | "rect" | "circle" | "stat" | "line",
  ) => void;
  isGenerating: boolean;
}

const LAYOUT_STYLES = [
  { id: "auto", label: "Auto" },
  { id: "steps", label: "Steps" },
  { id: "stats", label: "Stats" },
  { id: "timeline", label: "Timeline" },
  { id: "compare", label: "Compare" },
  { id: "list", label: "List" },
  { id: "pyramid", label: "Pyramid" },
  { id: "funnel", label: "Funnel" },
  { id: "cycle", label: "Cycle" },
] as const;

type LayoutStyle = (typeof LAYOUT_STYLES)[number]["id"];

const ELEMENTS = [
  { id: "heading", Icon: Type, label: "Heading" },
  { id: "text", Icon: Type, label: "Text" },
  { id: "rect", Icon: Square, label: "Box" },
  { id: "circle", Icon: Circle, label: "Circle" },
  { id: "stat", Icon: BarChart2, label: "Stat" },
  { id: "line", Icon: Minus, label: "Line" },
] as const;

const THEME_LABELS: Record<ThemePalette, string> = {
  ocean: "Ocean",
  ember: "Ember",
  forest: "Forest",
  slate: "Slate",
  midnight: "Midnight",
};

export default function PromptPanel({
  onGenerate,
  onAddElement,
  isGenerating,
}: PromptPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [theme, setTheme] = useState<ThemePalette>("ocean");
  const [size, setSize] = useState<CanvasSize>("a4");
  const [style, setStyle] = useState<LayoutStyle>("auto");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    await onGenerate(prompt, theme, size, style);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleClear = () => {
    setPrompt("");
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-3 pt-3 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-5 h-5 rounded-md bg-[var(--accent)]/15 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-[var(--accent)]" />
          </div>
          <span className="text-[11px] font-semibold text-white uppercase tracking-wider">AI Generate</span>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your infographic topic..."
            rows={3}
            className="w-full px-3 py-2.5 pr-8 text-[12px] bg-[var(--bg-elevated)] border border-white/[0.08] rounded-lg text-white placeholder:text-white/25 resize-none focus:outline-none focus:border-[var(--accent)]/60 focus:ring-1 focus:ring-[var(--accent)]/20 transition-all font-ibm-mono leading-relaxed"
          />
          {prompt.length > 0 && (
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <div className="flex items-center justify-between mt-1.5 px-0.5">
            <span className="text-[9px] text-white/20 font-ibm-mono">
              {prompt.length > 0 ? `${prompt.length} chars` : ""}
            </span>
            <span className="text-[9px] text-white/20 font-ibm-mono">⌘+↵ generate</span>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full h-8 flex items-center justify-center gap-1.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-black text-[12px] font-bold rounded-lg transition-all duration-150 active:scale-[0.98] shadow-[0_0_16px_rgba(245,197,24,0.25)] mt-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating&hellip;</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate</span>
            </>
          )}
        </button>
      </div>

      <div className="px-3 py-3 space-y-3 border-b border-white/[0.06] overflow-y-auto">
        <div className="space-y-1.5">
          <div className="text-[10px] font-medium uppercase tracking-[0.6px] text-white/40">Theme</div>
          <div className="flex gap-2">
            {(Object.keys(THEME_COLORS) as ThemePalette[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                title={THEME_LABELS[t]}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                  theme === t
                    ? "border-white scale-110 ring-1 ring-offset-1 ring-offset-[var(--bg-panel)] ring-white/30"
                    : "border-white/10 hover:border-white/30"
                }`}
                style={{ backgroundColor: THEME_COLORS[t].primary }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-[10px] font-medium uppercase tracking-[0.6px] text-white/40">Canvas Size</div>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as CanvasSize)}
            className="w-full h-7 px-2 text-[11px] rounded-md outline-none cursor-pointer bg-[var(--bg-elevated)] border border-white/[0.08] text-white/80 hover:border-white/20 focus:border-[var(--accent)]/60 transition-all"
          >
            {(Object.entries(CANVAS_SIZES) as [CanvasSize, { label: string }][]).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="text-[10px] font-medium uppercase tracking-[0.6px] text-white/40">Layout</div>
          <div className="grid grid-cols-3 gap-1">
            {LAYOUT_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id as LayoutStyle)}
                className={`px-1 py-1.5 text-[10px] font-medium rounded-md border transition-all duration-100 text-center ${
                  style === s.id
                    ? "bg-[var(--accent)]/15 border-[var(--accent)]/50 text-[var(--accent)]"
                    : "border-white/[0.06] text-white/50 hover:text-white/80 hover:border-white/15 hover:bg-white/[0.03]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-3 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Plus className="w-3 h-3 text-white/40" />
          <div className="text-[10px] font-medium uppercase tracking-[0.6px] text-white/40">Add Element</div>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {ELEMENTS.map((el) => (
            <button
              key={el.id}
              onClick={() =>
                onAddElement(el.id as "heading" | "text" | "rect" | "circle" | "stat" | "line")
              }
              className="h-8 flex flex-col items-center justify-center gap-0.5 rounded-md text-[9px] font-medium transition-all duration-100 active:scale-95 bg-white/[0.03] border border-white/[0.06] text-white/50 hover:text-white/90 hover:border-white/20 hover:bg-white/[0.06]"
            >
              <el.Icon className="w-3 h-3" />
              <span>{el.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
