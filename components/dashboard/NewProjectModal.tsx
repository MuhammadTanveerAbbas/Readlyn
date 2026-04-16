"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { CanvasSize, ThemePalette, StylePreset } from "@/types/infographic";

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => Promise<void> | void;
}

export default function NewProjectModal({ open, onClose, onCreated }: NewProjectModalProps) {
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
    const title = withAI && prompt.trim() ? prompt.slice(0, 70) : "Untitled Project";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-[720px] rounded-xl border border-white/10 bg-[#0f0f0f] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
        <div className="mb-4 flex gap-2">
          <button onClick={() => setTab("ai")} className={`rounded px-3 py-1.5 text-sm ${tab === "ai" ? "bg-[#F5C518] text-black" : "bg-[#161616] text-white"}`}>Start with AI</button>
          <button onClick={() => setTab("blank")} className={`rounded px-3 py-1.5 text-sm ${tab === "blank" ? "bg-[#F5C518] text-black" : "bg-[#161616] text-white"}`}>Blank Canvas</button>
        </div>
        {tab === "ai" ? (
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="mb-3 h-28 w-full rounded border border-white/10 bg-[#161616] p-3 text-white focus:border-[#F5C518] focus:outline-none" placeholder="Describe your infographic topic..." />
        ) : null}
        <div className="grid grid-cols-3 gap-3">
          <select value={size} onChange={(e) => setSize(e.target.value as CanvasSize)} className="h-10 rounded border border-white/10 bg-[#161616] px-3 text-white"><option value="a4">A4</option><option value="square">Square</option><option value="wide">Wide</option></select>
          <select value={theme} onChange={(e) => setTheme(e.target.value as ThemePalette)} className="h-10 rounded border border-white/10 bg-[#161616] px-3 text-white"><option value="violet">Violet</option><option value="ocean">Ocean</option><option value="ember">Ember</option><option value="forest">Forest</option><option value="slate">Slate</option></select>
          <select value={style} onChange={(e) => setStyle(e.target.value as StylePreset)} className="h-10 rounded border border-white/10 bg-[#161616] px-3 text-white"><option value="auto">Auto</option><option value="steps">Steps</option><option value="stats">Stats</option><option value="timeline">Timeline</option><option value="compare">Compare</option><option value="list">List</option><option value="pyramid">Pyramid</option><option value="funnel">Funnel</option><option value="cycle">Cycle</option></select>
        </div>
        {errorMsg ? <p className="mt-3 text-xs text-red-400">{errorMsg}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded border border-white/10 px-3 py-2 text-sm text-white">Cancel</button>
          <button disabled={pending} onClick={() => createProject(tab === "ai")} className="rounded bg-[#F5C518] px-3 py-2 text-sm font-semibold text-black disabled:opacity-60">{tab === "ai" ? "Generate & Open" : "Create Project"}</button>
        </div>
      </div>
    </div>
  );
}

