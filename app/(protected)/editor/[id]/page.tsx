"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import * as fabric from "fabric";
import PromptPanel from "@/components/app/PromptPanel";
import LayersPanel from "@/components/app/LayersPanel";
import PropertiesPanel from "@/components/app/PropertiesPanel";
import Toolbar from "@/components/app/Toolbar";
import ZoomSlider from "@/components/app/ZoomSlider";
import GenerationHistoryPanel from "@/components/app/GenerationHistoryPanel";
import ContentAwarenessPanel from "@/components/app/ContentAwarenessPanel";
import MultiFormatExportModal from "@/components/app/MultiFormatExportModal";
import DesignTokensModal from "@/components/app/DesignTokensModal";
import DevModeInspectModal from "@/components/app/DevModeInspectModal";
import BrandKitModal from "@/components/app/BrandKitModal";
import KeyboardShortcutsModal from "@/components/app/KeyboardShortcutsModal";
import OnboardingModal from "@/components/app/OnboardingModal";
import { useOfflineBuffer } from "@/hooks/use-offline-buffer";
import { useCanvasHistory } from "@/hooks/use-canvas-history";
import { useCanvasSelection } from "@/hooks/use-canvas-selection";
import {
  addCircleElement,
  addDividerLineElement,
  addHeadingElement,
  addRectElement,
  addStatBlockElement,
  addTextElement,
} from "@/lib/renderElements";
import {
  CANVAS_SIZES,
  type CanvasSize,
  type InfographicData,
  type StylePreset,
  type ThemePalette,
} from "@/types/infographic";
import type { CanvasRef } from "@/components/app/InfographicCanvas";
import { createClient } from "@/lib/supabase/client";
import {
  getCanvasTextAudit,
  type ReadabilityItem,
  type OverflowItem,
} from "@/lib/contentAwareness";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { parseRouteId } from "@/lib/params";

const InfographicCanvas = dynamic(
  () => import("@/components/app/InfographicCanvas"),
  { ssr: false },
);

export default function EditorPage() {
  const { id: rawId } = useParams<{ id: string }>();
  const { id: projectId, error: idError } = parseRouteId(rawId);
  if (idError) {
    throw new Error(idError);
  }
  const searchParams = useSearchParams();
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>("a4");
  const [zoom, setZoom] = useState(0.6);
  const [toolMode, setToolMode] = useState<"select" | "hand">("select");
  const [refresh, setRefresh] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [tokensOpen, setTokensOpen] = useState(false);
  const [devInspectOpen, setDevInspectOpen] = useState(false);
  const [brandKitOpen, setBrandKitOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const [historyItems, setHistoryItems] = useState<
    Array<{
      id: string;
      prompt: string | null;
      archetype: string | null;
      theme: string | null;
      created_at: string;
      thumbnail_url: string | null;
    }>
  >([]);
  const [exportOpen, setExportOpen] = useState(false);
  const [audit, setAudit] = useState<{
    readability: ReadabilityItem[];
    overflow: OverflowItem[];
    toneSummary: string;
    factChecks: string[];
  }>({
    readability: [],
    overflow: [],
    toneSummary: "Tone: pending",
    factChecks: [],
  });
  const [historyLoading, setHistoryLoading] = useState(false);
  const canvasRef = useRef<CanvasRef>(null);

  const { pushState, undo, redo, canUndo, canRedo } = useCanvasHistory(canvas);
  const { isOffline, isSyncing } = useOfflineBuffer(canvas, projectId);
  const {
    selectedObject,
    properties,
    updateObject,
    bringToFront,
    sendToBack,
    duplicateObject,
    deleteObject,
  } = useCanvasSelection(canvas);
  const { width, height } = CANVAS_SIZES[canvasSize];

  // Show onboarding modal on first load if not seen
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("readlyn_onboarding_seen");
    if (!hasSeenOnboarding) {
      setOnboardingOpen(true);
      localStorage.setItem("readlyn_onboarding_seen", "true");
    }
  }, []);

  const loadProject = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("projects")
      .select("canvas_json, canvas_width, canvas_height")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();
    if (data?.canvas_json && canvasRef.current?.canvas) {
      await canvasRef.current.canvas.loadFromJSON(data.canvas_json);
      canvasRef.current.canvas.requestRenderAll();
    }
  }, [projectId]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setHistoryItems([]);
        return;
      }
      const { data } = await supabase
        .from("generation_history")
        .select("id,prompt,archetype,theme,created_at,thumbnail_url")
        .eq("project_id", projectId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setHistoryItems(data || []);
    } finally {
      setHistoryLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadHistory();
    loadProject();
  }, [loadHistory, loadProject]);

  const saveHistorySnapshot = useCallback(
    async (prompt: string, archetype: string, theme: string) => {
      if (!canvasRef.current?.canvas) return;
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const thumbnail_url = canvasRef.current.canvas.toDataURL({
        format: "jpeg",
        quality: 0.5,
        multiplier: 0.25,
      });
      await supabase.from("generation_history").insert({
        project_id: projectId,
        user_id: user.id,
        canvas_json: canvasRef.current.canvas.toJSON(),
        prompt,
        archetype,
        theme,
        model: "openai/gpt-oss-120b",
        thumbnail_url,
      });
      loadHistory();
    },
    [loadHistory, projectId],
  );

  const handleGenerate = useCallback(async (
    prompt: string,
    theme: ThemePalette,
    size: CanvasSize,
    style: StylePreset,
  ) => {
    try {
      setIsGenerating(true);
      setCanvasSize(size);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, theme, size, style }),
      });
      if (!response.ok || !response.body) {
        throw new Error("Generation request failed.");
      }
      canvasRef.current?.prepareForStream({
        canvasWidth: CANVAS_SIZES[size].width,
        canvasHeight: CANVAS_SIZES[size].height,
        background: "var(--text-primary)",
      });
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      const rendered = new Set<string>();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const partial = JSON.parse(line) as {
            element?: InfographicData["elements"][number];
            progress?: { current: number; total: number };
          };
          if (partial.progress) {
            canvasRef.current?.setStreamProgress(partial.progress);
          }
          if (partial.element && !rendered.has(partial.element.id)) {
            rendered.add(partial.element.id);
            canvasRef.current?.renderElement(partial.element);
          }
        }
      }
      canvasRef.current?.finishStream();
      pushState();
      setRefresh((v) => v + 1);
      await new Promise((resolve) => setTimeout(resolve, 150));
      await saveHistorySnapshot(prompt, style, theme);
    } catch {
      canvasRef.current?.finishStream();
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "The AI response failed to stream. Please try again.",
        action: (
          <ToastAction altText="Try again" onClick={() => handleGenerate(prompt, theme, size, style)}>
            Try Again
          </ToastAction>
        ),
      });
    } finally {
      setIsGenerating(false);
    }
  }, [pushState, saveHistorySnapshot]);

  const handleAddElement = (
    type: "heading" | "text" | "rect" | "circle" | "stat" | "line",
  ) => {
    if (!canvas) return;
    if (type === "heading") addHeadingElement(canvas);
    if (type === "text") addTextElement(canvas);
    if (type === "rect") addRectElement(canvas);
    if (type === "circle") addCircleElement(canvas);
    if (type === "stat") addStatBlockElement(canvas);
    if (type === "line") addDividerLineElement(canvas);
    pushState();
    setRefresh((v) => v + 1);
  };

  const runAwarenessCheck = useCallback(async () => {
    if (!canvas) return;
    const analysis = getCanvasTextAudit(canvas);
    let toneSummary = "Overall tone: Professional";
    let factChecks: string[] = [];
    if (analysis.textBlocks.length > 0) {
      toneSummary = `Tone summary: ${analysis.textBlocks.length} text blocks checked`;
      factChecks = analysis.textBlocks
        .filter((item) => /\d/.test(item.text))
        .slice(0, 2)
        .map((item) => `Verify claim in ${item.label}`);
    }
    setAudit({
      readability: analysis.readability,
      overflow: analysis.overflow,
      toneSummary,
      factChecks,
    });
  }, [canvas]);

  useEffect(() => {
    const t = setTimeout(() => {
      runAwarenessCheck();
    }, 2000);
    return () => clearTimeout(t);
  }, [refresh, runAwarenessCheck]);

  useEffect(() => {
    if (searchParams.get("autogen") === "1") {
      const prompt = searchParams.get("prompt") || "";
      const theme = (searchParams.get("theme") as ThemePalette) || "slate";
      const size = (searchParams.get("size") as CanvasSize) || "a4";
      const style = (searchParams.get("style") as StylePreset) || "auto";
      if (prompt) handleGenerate(prompt, theme, size, style);
    }
  }, [searchParams]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      }
      if (event.key.toLowerCase() === "v") setToolMode("select");
      if (event.key.toLowerCase() === "h") setToolMode("hand");
      if (event.key === "?") setShortcutsOpen(true);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [redo, undo]);

  const lastSavedRef = useRef(Date.now());

  useEffect(() => {
    if (!canvas || !projectId) return;
    const interval = setInterval(async () => {
      const now = Date.now();
      if (now - lastSavedRef.current < 5000) return;
      try {
        const supabase = createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return;
        await supabase
          .from("projects")
          .update({
            canvas_json: canvas.toJSON(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", projectId)
          .eq("user_id", user.id);
        lastSavedRef.current = now;
      } catch {
        // Handled by offline buffer hook
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [canvas, projectId]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--bg-base)]">
      {/* Offline / Sync Banner */}
      {isOffline && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-1 text-center font-ibm-mono text-xs text-amber-300 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Offline mode active — changes are buffered locally and will sync when connected.
        </div>
      )}
      {isSyncing && (
        <div className="bg-blue-500/20 border-b border-blue-500/30 px-4 py-1 text-center font-ibm-mono text-xs text-blue-300">
          Syncing buffered local edits to cloud...
        </div>
      )}

      <Toolbar
        canUndo={canUndo}
        canRedo={canRedo}
        zoom={zoom}
        toolMode={toolMode}
        onToolModeChange={setToolMode}
        onUndo={undo}
        onRedo={redo}
        onOpenHistory={() => setHistoryOpen((v) => !v)}
        onOpenMultiExport={() => setExportOpen(true)}
        onOpenDesignTokens={() => setTokensOpen(true)}
        onOpenDevInspect={() => setDevInspectOpen(true)}
        onOpenBrandKit={() => setBrandKitOpen(true)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
        onExportPNG={() => canvasRef.current?.exportPNG()}
        onExportJSON={() => canvasRef.current?.exportJSON()}
        onClearAll={() => {
          if (
            window.confirm(
              "Clear all elements from canvas? This cannot be undone.",
            )
          ) {
            canvasRef.current?.clearAll();
            pushState();
          }
        }}
        onZoomIn={() => setZoom((z) => Math.min(z + 0.1, 2))}
        onZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.1))}
        onFitToScreen={() => setZoom(0.6)}
        onSetZoom={setZoom}
      />
      <GenerationHistoryPanel
        open={historyOpen}
        items={historyItems}
        isLoading={historyLoading}
        onRestore={async (id) => {
          setHistoryLoading(true);
          try {
            const supabase = createClient();
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase
              .from("generation_history")
              .select("canvas_json")
              .eq("id", id)
              .eq("user_id", user.id)
              .single();
            if (!data?.canvas_json || !canvasRef.current?.canvas) return;
            if (
              !window.confirm(
                "This will replace your current canvas. Are you sure?",
              )
            )
              return;
            await canvasRef.current.canvas.loadFromJSON(data.canvas_json);
            canvasRef.current.canvas.requestRenderAll();
            pushState();
          } finally {
            setHistoryLoading(false);
          }
        }}
        onDelete={async (id) => {
          setHistoryLoading(true);
          try {
            const supabase = createClient();
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;
            await supabase
              .from("generation_history")
              .delete()
              .eq("id", id)
              .eq("user_id", user.id);
            loadHistory();
          } finally {
            setHistoryLoading(false);
          }
        }}
      />
      <div className="flex h-[calc(100vh-44px)]">
        <div className="w-[240px] border-r border-white/[0.07] bg-[var(--bg-panel)] flex flex-col">
          <PromptPanel
            onGenerate={handleGenerate}
            onAddElement={handleAddElement}
            isGenerating={isGenerating}
          />
          <LayersPanel
            canvas={canvas}
            onSelectObject={() => setRefresh((v) => v + 1)}
            refreshTrigger={refresh}
          />
        </div>
        <div className="flex flex-1 items-center justify-center bg-[color-mix(in_srgb,var(--bg-base)_85%,white_0.5%)] relative">
          <InfographicCanvas
            ref={canvasRef}
            width={width}
            height={height}
            zoom={zoom}
            toolMode={toolMode}
            onReady={setCanvas}
            onObjectModified={() => setRefresh((v) => v + 1)}
          />
        </div>
        <ZoomSlider
          zoom={zoom}
          onZoomChange={setZoom}
          onFitToScreen={() => setZoom(0.6)}
        />
        <div
          className="w-[260px] border-l border-white/[0.07] bg-[var(--bg-panel)] flex flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <PropertiesPanel
              properties={properties}
              objectType={selectedObject?.type || null}
              onUpdateProperty={updateObject}
              onBringToFront={bringToFront}
              onSendToBack={sendToBack}
              onDuplicate={duplicateObject}
              onDelete={deleteObject}
            />
            <ContentAwarenessPanel
              readability={audit.readability}
              overflow={audit.overflow}
              toneSummary={audit.toneSummary}
              factChecks={audit.factChecks}
              onRun={runAwarenessCheck}
            />
          </div>
        </div>
      </div>

      <MultiFormatExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        canvasJson={canvasRef.current?.canvas?.toJSON() || {}}
        projectName={projectId}
      />
      <DesignTokensModal
        open={tokensOpen}
        onClose={() => setTokensOpen(false)}
      />
      <DevModeInspectModal
        open={devInspectOpen}
        onClose={() => setDevInspectOpen(false)}
        selectedObject={selectedObject}
      />
      <BrandKitModal
        open={brandKitOpen}
        onClose={() => setBrandKitOpen(false)}
        canvas={canvas}
      />
      <KeyboardShortcutsModal
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
      <OnboardingModal
        open={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
      />
    </div>
  );
}
