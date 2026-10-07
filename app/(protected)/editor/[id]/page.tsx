"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
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
import { applyAutoTheme } from "@/lib/autoTheme";
import { ensureCanvasFontsLoaded } from "@/lib/canvas-fonts";
import type { SelectionProperties } from "@/hooks/use-canvas-selection";

const InfographicCanvas = dynamic(
  () => import("@/components/app/InfographicCanvas"),
  { ssr: false },
);

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

function findCanvasSizeKey(
  width?: number | null,
  height?: number | null,
): CanvasSize | null {
  if (!width || !height) return null;
  const entries = Object.entries(CANVAS_SIZES) as Array<
    [CanvasSize, { width: number; height: number; label: string }]
  >;
  const match = entries.find(
    ([, size]) => size.width === width && size.height === height,
  );
  return match ? match[0] : null;
}

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
  const [theme, setTheme] = useState<ThemePalette>("ocean");
  const [zoom, setZoom] = useState(0.6);
  const [toolMode, setToolMode] = useState<"select" | "hand">("select");
  const [refresh, setRefresh] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
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
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const isStreamingRef = useRef(false);
  const historyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSpacePressedRef = useRef(false);
  const panStateRef = useRef({ active: false, x: 0, y: 0 });
  const hasLoadedProjectRef = useRef(false);
  const autogenHandledRef = useRef(false);
  const zoomRef = useRef(0.6);

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
      .select("canvas_json, canvas_width, canvas_height, theme")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();
    if (!data) return;

    const restoredSize = findCanvasSizeKey(
      data.canvas_width,
      data.canvas_height,
    );
    if (restoredSize) setCanvasSize(restoredSize);
    if (data.theme) setTheme(data.theme as ThemePalette);

    const activeCanvas = canvasRef.current?.canvas;
    if (data.canvas_json && activeCanvas) {
      await activeCanvas.loadFromJSON(data.canvas_json);
      activeCanvas.requestRenderAll();
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

  const saveHistorySnapshot = useCallback(
    async (
      prompt: string,
      archetype: string,
      palette: string,
      model: string,
    ) => {
      if (!canvasRef.current?.canvas) return;
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      // Thumbnails are canvas renders too they need the webfonts resident or
      // they get painted in the fallback face.
      await ensureCanvasFontsLoaded();
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
        theme: palette,
        model,
        thumbnail_url,
      });
      loadHistory();
    },
    [loadHistory, projectId],
  );

  // Keep the dashboard card in sync with the generated result. Without this the
  // card showed a placeholder forever plus the stored canvas size stayed empty.
  const saveProjectSnapshot = useCallback(
    async (
      palette: ThemePalette,
      archetype: StylePreset,
      size: CanvasSize,
    ) => {
      const activeCanvas = canvasRef.current?.canvas;
      if (!activeCanvas || !projectId) return;
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      await ensureCanvasFontsLoaded();
      const thumbnail_url = activeCanvas.toDataURL({
        format: "jpeg",
        quality: 0.6,
        multiplier: 0.3,
      });
      await supabase
        .from("projects")
        .update({
          canvas_json: activeCanvas.toJSON(),
          canvas_width: CANVAS_SIZES[size].width,
          canvas_height: CANVAS_SIZES[size].height,
          thumbnail_url,
          theme: palette,
          archetype,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId)
        .eq("user_id", user.id);
    },
    [projectId],
  );

  const handleGenerate = useCallback(async (
    prompt: string,
    palette: ThemePalette,
    size: CanvasSize,
    style: StylePreset,
  ) => {
    try {
      setIsGenerating(true);
      isStreamingRef.current = true;
      setTheme(palette);
      setCanvasSize(size);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, theme: palette, size, style }),
      });
      if (!response.ok || !response.body) {
        throw new Error("Generation request failed.");
      }
      const usedModel = response.headers.get("x-readlyn-model") || "unknown";
      canvasRef.current?.prepareForStream({
        canvasWidth: CANVAS_SIZES[size].width,
        canvasHeight: CANVAS_SIZES[size].height,
        background: "#ffffff",
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
      await saveHistorySnapshot(prompt, style, palette, usedModel);
      await saveProjectSnapshot(palette, style, size);
    } catch {
      canvasRef.current?.finishStream();
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "The AI response failed to stream. Please try again.",
        action: (
          <ToastAction altText="Try again" onClick={() => handleGenerate(prompt, palette, size, style)}>
            Try Again
          </ToastAction>
        ),
      });
    } finally {
      setIsGenerating(false);
      isStreamingRef.current = false;
    }
  }, [pushState, saveHistorySnapshot, saveProjectSnapshot]);

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
    setRefresh((v) => v + 1);
  };

  const runAwarenessCheck = useCallback(async () => {
    if (!canvas) return;
    const analysis = getCanvasTextAudit(canvas);
    let toneSummary = "No text blocks on the canvas yet.";
    let factChecks: string[] = [];
    if (analysis.textBlocks.length > 0) {
      const wordCount = analysis.textBlocks.reduce(
        (total, item) => total + item.text.trim().split(/\s+/).length,
        0,
      );
      toneSummary = `${analysis.textBlocks.length} text blocks checked, ${wordCount} words in total.`;
      factChecks = analysis.textBlocks
        .filter((item) => /\d/.test(item.text))
        .slice(0, 3)
        .map((item) => `Number found, please verify the claim in ${item.label}`);
    }
    setAudit({
      readability: analysis.readability,
      overflow: analysis.overflow,
      toneSummary,
      factChecks,
    });
  }, [canvas]);

  const fitToScreen = useCallback(() => {
    const area = canvasAreaRef.current;
    if (!area) return;
    const padding = 64;
    const availableWidth = area.clientWidth - padding;
    const availableHeight = area.clientHeight - padding;
    if (availableWidth <= 0 || availableHeight <= 0) return;
    const nextZoom = Math.min(availableWidth / width, availableHeight / height);
    setZoom(Math.max(0.1, Math.min(2, Math.round(nextZoom * 100) / 100)));
  }, [width, height]);

  const scheduleHistorySnapshot = useCallback(() => {
    if (isStreamingRef.current) return;
    if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
    historyTimerRef.current = setTimeout(() => {
      historyTimerRef.current = null;
      pushState();
    }, 350);
  }, [pushState]);

  const commitHistory = useCallback(() => {
    if (historyTimerRef.current) {
      clearTimeout(historyTimerRef.current);
      historyTimerRef.current = null;
    }
    pushState();
  }, [pushState]);

  const handleCanvasChanged = useCallback(() => {
    setRefresh((v) => v + 1);
    scheduleHistorySnapshot();
  }, [scheduleHistorySnapshot]);

  const handleUpdateProperty = useCallback(
    (key: keyof SelectionProperties, value: number | string) => {
      updateObject(key, value);
      scheduleHistorySnapshot();
    },
    [updateObject, scheduleHistorySnapshot],
  );

  const handleDuplicate = useCallback(() => {
    duplicateObject();
    scheduleHistorySnapshot();
  }, [duplicateObject, scheduleHistorySnapshot]);

  useEffect(() => {
    const t = setTimeout(() => {
      runAwarenessCheck();
    }, 2000);
    return () => clearTimeout(t);
  }, [refresh, runAwarenessCheck]);

  const handleDelete = useCallback(() => {
    deleteObject();
    commitHistory();
  }, [deleteObject, commitHistory]);

  const handleBringToFront = useCallback(() => {
    bringToFront();
    commitHistory();
  }, [bringToFront, commitHistory]);

  const handleSendToBack = useCallback(() => {
    sendToBack();
    commitHistory();
  }, [sendToBack, commitHistory]);

  const handleAutoTheme = useCallback(() => {
    if (!canvas) return;
    const changed = applyAutoTheme(canvas, theme);
    commitHistory();
    setRefresh((v) => v + 1);
    toast({
      title: changed > 0 ? "Theme applied" : "Nothing to recolor",
      description:
        changed > 0
          ? `${changed} element(s) now match the ${theme} palette.`
          : "No element used a palette color yet, so nothing changed.",
    });
  }, [canvas, theme, commitHistory]);

  const nudgeSelected = useCallback(
    (dx: number, dy: number) => {
      if (!selectedObject || !canvas) return;
      selectedObject.set({
        left: (selectedObject.left || 0) + dx,
        top: (selectedObject.top || 0) + dy,
      });
      selectedObject.setCoords();
      canvas.requestRenderAll();
      setRefresh((v) => v + 1);
      scheduleHistorySnapshot();
    },
    [selectedObject, canvas, scheduleHistorySnapshot],
  );

  useEffect(() => {
    if (!canvas || autogenHandledRef.current) return;
    if (searchParams.get("autogen") !== "1") return;
    const prompt = searchParams.get("prompt") || "";
    if (!prompt) return;
    autogenHandledRef.current = true;
    const palette = (searchParams.get("theme") as ThemePalette) || "slate";
    const size = (searchParams.get("size") as CanvasSize) || "a4";
    const style = (searchParams.get("style") as StylePreset) || "auto";
    handleGenerate(prompt, palette, size, style);
  }, [canvas, searchParams, handleGenerate]);

  // Space plus the hand tool pan the viewport. The listener ignores typing so
  // spaces still work inside the prompt box plus inside canvas text editing.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;
      if (event.code === "Space") isSpacePressedRef.current = true;
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") isSpacePressedRef.current = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Wheel zoom keeps the point under the cursor stable by adjusting scroll.
  useEffect(() => {
    const area = canvasAreaRef.current;
    if (!area) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = area.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;
      const current = zoomRef.current;
      const factor = event.deltaY > 0 ? 0.92 : 1.08;
      const next = Math.min(
        2,
        Math.max(0.1, Math.round(current * factor * 100) / 100),
      );
      if (next === current) return;
      const contentX = (area.scrollLeft + pointerX) / current;
      const contentY = (area.scrollTop + pointerY) / current;
      setZoom(next);
      requestAnimationFrame(() => {
        area.scrollLeft = contentX * next - pointerX;
        area.scrollTop = contentY * next - pointerY;
      });
    };
    area.addEventListener("wheel", onWheel, { passive: false });
    return () => area.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const shouldPan = toolMode === "hand" || isSpacePressedRef.current;
    if (!shouldPan) return;
    const area = canvasAreaRef.current;
    if (!area) return;
    panStateRef.current = { active: true, x: event.clientX, y: event.clientY };
    area.setPointerCapture(event.pointerId);
    area.style.cursor = "grabbing";
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!panStateRef.current.active) return;
    const area = canvasAreaRef.current;
    if (!area) return;
    area.scrollLeft -= event.clientX - panStateRef.current.x;
    area.scrollTop -= event.clientY - panStateRef.current.y;
    panStateRef.current.x = event.clientX;
    panStateRef.current.y = event.clientY;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!panStateRef.current.active) return;
    panStateRef.current.active = false;
    const area = canvasAreaRef.current;
    area?.releasePointerCapture(event.pointerId);
    if (area) area.style.cursor = toolMode === "hand" ? "grab" : "default";
  };

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // The canvas is loaded dynamically, so project data is fetched only after the
  // canvas instance exists. Without this the saved design never appeared.
  useEffect(() => {
    if (!canvas || hasLoadedProjectRef.current) return;
    hasLoadedProjectRef.current = true;
    loadProject();
  }, [canvas, loadProject]);

  useEffect(() => {
    if (!canvas) return;
    const timer = setTimeout(() => fitToScreen(), 120);
    return () => clearTimeout(timer);
  }, [canvas, canvasSize, fitToScreen]);

  useEffect(() => {
    return () => {
      if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;
      const key = event.key.toLowerCase();
      const withModifier = event.metaKey || event.ctrlKey;

      if (withModifier && key === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }
      if (withModifier && key === "d") {
        event.preventDefault();
        handleDuplicate();
        return;
      }
      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedObject) {
          event.preventDefault();
          handleDelete();
        }
        return;
      }
      if (event.key === "?") {
        setShortcutsOpen(true);
        return;
      }
      if (event.key.startsWith("Arrow")) {
        if (!selectedObject) return;
        event.preventDefault();
        const step = event.shiftKey ? 10 : 1;
        if (event.key === "ArrowLeft") nudgeSelected(-step, 0);
        if (event.key === "ArrowRight") nudgeSelected(step, 0);
        if (event.key === "ArrowUp") nudgeSelected(0, -step);
        if (event.key === "ArrowDown") nudgeSelected(0, step);
        return;
      }
      if (withModifier) return;
      if (key === "v") setToolMode("select");
      if (key === "h") setToolMode("hand");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    redo,
    undo,
    handleDuplicate,
    handleDelete,
    nudgeSelected,
    selectedObject,
  ]);

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
        <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-1 text-center font-sans text-xs text-amber-300 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Offline mode active, changes are buffered locally, plus will sync when connected.
        </div>
      )}
      {isSyncing && (
        <div className="bg-blue-500/20 border-b border-blue-500/30 px-4 py-1 text-center font-sans text-xs text-blue-300">
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
        onToggleLeftPanel={() => setLeftPanelOpen((v) => !v)}
        onToggleRightPanel={() => setRightPanelOpen((v) => !v)}
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
        onFitToScreen={fitToScreen}
        onSetZoom={setZoom}
      />
      <GenerationHistoryPanel
        open={historyOpen}
        items={historyItems}
        isLoading={historyLoading}
        onClose={() => setHistoryOpen(false)}
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
        {(leftPanelOpen || rightPanelOpen) && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => {
              setLeftPanelOpen(false);
              setRightPanelOpen(false);
            }}
          />
        )}
        <div
          className={`${leftPanelOpen ? "flex" : "hidden"} lg:flex fixed lg:static inset-y-11 lg:inset-auto left-0 z-30 w-[260px] lg:w-[240px] border-r border-white/[0.07] bg-[var(--bg-panel)] flex-col shadow-2xl lg:shadow-none`}
        >
          <PromptPanel
            onGenerate={handleGenerate}
            onAddElement={handleAddElement}
            isGenerating={isGenerating}
          />
          <LayersPanel
            canvas={canvas}
            onSelectObject={() => setRefresh((v) => v + 1)}
            refreshTrigger={refresh}
            onCanvasChanged={handleCanvasChanged}
          />
        </div>
        <div
          ref={canvasAreaRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative flex flex-1 overflow-auto overscroll-contain bg-[color-mix(in_srgb,var(--bg-base)_85%,white_0.5%)]"
          style={{ cursor: toolMode === "hand" ? "grab" : "default" }}
        >
          <div className="m-auto p-8">
            <InfographicCanvas
              ref={canvasRef}
              width={width}
              height={height}
              zoom={zoom}
              toolMode={toolMode}
              onReady={setCanvas}
              onObjectModified={handleCanvasChanged}
            />
          </div>
        </div>
        <ZoomSlider
          zoom={zoom}
          onZoomChange={setZoom}
          onFitToScreen={fitToScreen}
        />
        <div
          className={`${rightPanelOpen ? "flex" : "hidden"} lg:flex fixed lg:static inset-y-11 lg:inset-auto right-0 z-30 w-[260px] border-l border-white/[0.07] bg-[var(--bg-panel)] flex-col overflow-hidden shadow-2xl lg:shadow-none`}
        >
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <PropertiesPanel
              properties={properties}
              objectType={selectedObject?.type || null}
              onUpdateProperty={handleUpdateProperty}
              onBringToFront={handleBringToFront}
              onSendToBack={handleSendToBack}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onAutoTheme={handleAutoTheme}
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
        sourceWidth={width}
        sourceHeight={height}
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
        onStartPrompt={() => {
          const el = document.getElementById("prompt-input");
          if (el instanceof HTMLTextAreaElement) el.focus();
        }}
      />
    </div>
  );
}
