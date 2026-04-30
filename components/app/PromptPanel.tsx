"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
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
  { id: "auto", label: "Auto", desc: "Automatic layout" },
  { id: "steps", label: "Steps", desc: "Process flow" },
  { id: "stats", label: "Stats", desc: "Data showcase" },
  { id: "timeline", label: "Timeline", desc: "Chronological" },
  { id: "compare", label: "Compare", desc: "Side-by-side" },
  { id: "list", label: "List", desc: "Bullet points" },
  { id: "pyramid", label: "Pyramid", desc: "Hierarchy" },
  { id: "funnel", label: "Funnel", desc: "Conversion" },
  { id: "cycle", label: "Cycle", desc: "Circular flow" },
] as const;

type LayoutStyle = (typeof LAYOUT_STYLES)[number]["id"];

const ELEMENTS = [
  { id: "heading", icon: "𝗛", label: "Heading", desc: "Title text" },
  { id: "text", icon: "𝗧", label: "Text", desc: "Body text" },
  { id: "rect", icon: "▭", label: "Box", desc: "Rectangle" },
  { id: "circle", icon: "●", label: "Circle", desc: "Circle shape" },
  { id: "stat", icon: "⬛", label: "Stat", desc: "Data block" },
  { id: "line", icon: "─", label: "Line", desc: "Divider" },
] as const;

export default function PromptPanel({
  onGenerate,
  onAddElement,
  isGenerating,
}: PromptPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [theme, setTheme] = useState<ThemePalette>("violet");
  const [size, setSize] = useState<CanvasSize>("a4");
  const [style, setStyle] = useState<LayoutStyle>("auto");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    await onGenerate(prompt, theme, size, style);
  };

  const themeNames: Record<ThemePalette, string> = {
    violet: "Violet",
    ocean: "Ocean",
    ember: "Ember",
    forest: "Forest",
    slate: "Slate",
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]">
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* HEADER */}
        <div className="space-y-1">
          <h2 className="text-[13px] font-semibold text-white tracking-[-0.01em]">
            Create Infographic
          </h2>
          <p className="text-[11px] text-[#666666]">
            Describe your content and customize the design
          </p>
        </div>

        {/* PROMPT SECTION */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-medium text-[#A3A3A3] uppercase tracking-[0.5px]">
            Topic
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Q4 2025 Sales Report, Product Roadmap, Market Analysis..."
            className="w-full h-[80px] px-3 py-2.5 text-[11px] bg-[#161616] border border-white/8 rounded-lg text-white placeholder-[#555555] resize-none focus:outline-none focus:border-[#F5C518] focus:ring-1 focus:ring-[rgba(245,197,24,0.2)] transition-all"
            style={{
              fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
              lineHeight: "1.5",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full h-9 flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-[#FFDC40] disabled:bg-[#F5C518]/50 disabled:cursor-not-allowed text-black text-[12px] font-semibold rounded-lg transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(245,197,24,0.3)] hover:shadow-[0_0_30px_rgba(245,197,24,0.5)] disabled:shadow-none"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Infographic</span>
              </>
            )}
          </button>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        {/* CUSTOMIZATION SECTION */}
        <div className="space-y-4">
          {/* Theme */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-[#A3A3A3] uppercase tracking-[0.5px]">
              Color Theme
            </label>
            <div className="flex gap-2">
              {(Object.keys(THEME_COLORS) as ThemePalette[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`w-7 h-7 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                    theme === t
                      ? "ring-2 ring-offset-2 ring-offset-[#0f0f0f] border-white scale-110"
                      : "border-transparent hover:border-white/30"
                  }`}
                  style={{ backgroundColor: THEME_COLORS[t].primary }}
                  title={themeNames[t]}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-[#A3A3A3] uppercase tracking-[0.5px]">
              Canvas Size
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as CanvasSize)}
              className="w-full h-8 px-2.5 text-[11px] rounded-lg outline-none cursor-pointer transition-all bg-[#161616] border border-white/8 text-[#E2E2E2] hover:border-white/15 focus:border-[#F5C518] focus:ring-1 focus:ring-[rgba(245,197,24,0.2)]"
            >
              {(
                Object.entries(CANVAS_SIZES) as [
                  CanvasSize,
                  { label: string },
                ][]
              ).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Layout */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-medium text-[#A3A3A3] uppercase tracking-[0.5px]">
              Layout Style
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {LAYOUT_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id as LayoutStyle)}
                  className={`px-2 py-2 text-[10px] font-medium rounded-lg border transition-all duration-150 text-center ${
                    style === s.id
                      ? "bg-[#F5C518]/15 border-[#F5C518]/50 text-[#F5C518] shadow-[0_0_12px_rgba(245,197,24,0.2)]"
                      : "border-white/8 text-[#A3A3A3] hover:text-white hover:border-white/15 hover:bg-white/3"
                  }`}
                  title={s.desc}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        {/* ELEMENTS SECTION */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-medium text-[#A3A3A3] uppercase tracking-[0.5px]">
            Quick Add Elements
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {ELEMENTS.map((el) => (
              <button
                key={el.id}
                onClick={() =>
                  onAddElement(
                    el.id as "heading" | "text" | "rect" | "circle" | "stat" | "line",
                  )
                }
                className="h-8 flex items-center justify-center gap-2 rounded-lg text-[10px] font-medium transition-all duration-150 active:scale-95 bg-[#161616] border border-white/8 text-[#A3A3A3] hover:text-white hover:border-white/15 hover:bg-[#1c1c1c]"
                title={el.desc}
              >
                <span className="text-[11px]">{el.icon}</span>
                <span>{el.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
