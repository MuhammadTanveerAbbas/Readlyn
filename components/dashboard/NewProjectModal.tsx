"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type {
  CanvasSize,
  ThemePalette,
  StylePreset,
} from "@/types/infographic";
import {
  Sparkles,
  FileText,
  X,
  Loader2,
  Wand2,
  ListOrdered,
  BarChart3,
  Clock,
  Scale,
  List,
  Triangle,
  TrendingDown,
  RefreshCw,
} from "lucide-react";

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => Promise<void> | void;
}

const THEME_COLORS: Record<ThemePalette, { primary: string; name: string }> = {
  violet: { primary: "#7c3aed", name: "Violet" },
  ocean: { primary: "#0284c7", name: "Ocean" },
  ember: { primary: "#ea580c", name: "Ember" },
  forest: { primary: "#15803d", name: "Forest" },
  slate: { primary: "#475569", name: "Slate" },
};

const STYLE_ICONS: Record<
  StylePreset,
  React.ComponentType<{ className?: string }>
> = {
  auto: Wand2,
  steps: ListOrdered,
  stats: BarChart3,
  timeline: Clock,
  compare: Scale,
  list: List,
  pyramid: Triangle,
  funnel: TrendingDown,
  cycle: RefreshCw,
};

export default function NewProjectModal({
  open,
  onClose,
  onCreated,
}: NewProjectModalProps) {
  const [tab, setTab] = useState<"ai" | "blank">("ai");
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState<CanvasSize>("a4");
  const [theme, setTheme] = useState<ThemePalette>("violet");
  const [style, setStyle] = useState<StylePreset>("auto");
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  if (!open) return null;

  const createProject = async (withAI: boolean) => {
    setErrorMsg("");
    setPending(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setPending(false);
      setErrorMsg("You need to be logged in to create projects.");
      return;
    }
    const title =
      withAI && prompt.trim() ? prompt.slice(0, 70) : "Untitled Project";

    const { data, error } = await supabase
      .from("projects")
      .insert({ title, user_id: user.id })
      .select("id")
      .single();

    if (error || !data?.id) {
      setPending(false);
      setErrorMsg(error?.message || "Failed to create project.");
      return;
    }

    await supabase
      .from("projects")
      .update({
        theme,
        archetype: style,
      })
      .eq("id", data.id);

    setPending(false);
    await onCreated?.();
    onClose();
    router.push(
      `/editor/${data.id}${withAI ? `?autogen=1&prompt=${encodeURIComponent(prompt)}&theme=${theme}&size=${size}&style=${style}` : ""}`,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Header gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-32 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(245,197,24,0.2), transparent 70%)",
          }}
        />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5C518]/10 border border-[#F5C518]/20">
              <Sparkles className="h-5 w-5 text-[#F5C518]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Create New Project
              </h2>
              <p className="text-xs text-white/50">
                Choose how you want to start
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-all"
          >
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>

        {/* Body */}
        <div className="relative z-10 p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTab("ai")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                tab === "ai"
                  ? "bg-[#F5C518] text-black shadow-[0_10px_30px_rgba(245,197,24,0.3)]"
                  : "bg-[#161616] text-white/70 hover:bg-[#1a1a1a] border border-white/10"
              }`}
            >
              <Wand2 className="h-4 w-4" />
              Start with AI
            </button>
            <button
              onClick={() => setTab("blank")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                tab === "blank"
                  ? "bg-[#F5C518] text-black shadow-[0_10px_30px_rgba(245,197,24,0.3)]"
                  : "bg-[#161616] text-white/70 hover:bg-[#1a1a1a] border border-white/10"
              }`}
            >
              <FileText className="h-4 w-4" />
              Blank Canvas
            </button>
          </div>

          {/* AI Prompt */}
          {tab === "ai" && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Describe your infographic
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 rounded-xl border border-white/10 bg-[#0f0f0f] p-4 text-white placeholder:text-white/40 focus:border-[#F5C518] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/20 transition-all resize-none"
                placeholder="E.g., 'Create a sales report showing Q4 2024 revenue growth across 5 regions with bar charts and key metrics'"
              />
              <p className="text-xs text-white/40 mt-2">
                Be specific about data, layout, and visual elements you want
              </p>
            </div>
          )}

          {/* Options Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Canvas Size */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">
                Canvas Size
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as CanvasSize)}
                className="w-full h-11 rounded-lg border border-white/10 bg-[#0f0f0f] px-3 text-sm text-white focus:border-[#F5C518] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/20 transition-all cursor-pointer"
              >
                <option value="a4">A4 Portrait</option>
                <option value="square">Square</option>
                <option value="wide">Wide</option>
              </select>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">
                Color Theme
              </label>
              <div className="relative">
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as ThemePalette)}
                  className="w-full h-11 rounded-lg border border-white/10 bg-[#0f0f0f] pl-10 pr-3 text-sm text-white focus:border-[#F5C518] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/20 transition-all cursor-pointer appearance-none"
                >
                  {Object.entries(THEME_COLORS).map(([key, { name }]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </select>
                <div
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full pointer-events-none"
                  style={{ background: THEME_COLORS[theme].primary }}
                />
              </div>
            </div>

            {/* Style */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">
                Layout Style
              </label>
              <div className="relative">
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as StylePreset)}
                  className="w-full h-11 rounded-lg border border-white/10 bg-[#0f0f0f] pl-10 pr-3 text-sm text-white focus:border-[#F5C518] focus:outline-none focus:ring-2 focus:ring-[#F5C518]/20 transition-all cursor-pointer appearance-none"
                >
                  <option value="auto">Auto</option>
                  <option value="steps">Steps</option>
                  <option value="stats">Stats</option>
                  <option value="timeline">Timeline</option>
                  <option value="compare">Compare</option>
                  <option value="list">List</option>
                  <option value="pyramid">Pyramid</option>
                  <option value="funnel">Funnel</option>
                  <option value="cycle">Cycle</option>
                </select>
                {(() => {
                  const StyleIcon = STYLE_ICONS[style];
                  return (
                    <StyleIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
              {errorMsg}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={pending}
              className="px-5 py-2.5 rounded-lg border border-white/10 text-sm font-semibold text-white hover:bg-white/[0.05] transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              disabled={pending || (tab === "ai" && !prompt.trim())}
              onClick={() => createProject(tab === "ai")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#F5C518] text-black text-sm font-bold hover:bg-[#FFDC40] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(245,197,24,0.3)]"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : tab === "ai" ? (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate & Open
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Create Project
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
