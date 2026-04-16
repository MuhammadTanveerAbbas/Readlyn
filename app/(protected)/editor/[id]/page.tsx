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
import AIContextMenu from "@/components/app/AIContextMenu";
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

const InfographicCanvas = dynamic(
  () => import("@/components/app/InfographicCanvas"),
  { ssr: false },
);

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = id ?? "";
  const searchParams = useSearchParams();
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>("a4");
  const [zoom, setZoom] = useState(0.6);
  const [refresh, setRefresh] = useState(0);
  const [historyOpen, setHistoryOpen] = useState(false);
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
  const [lastGeneration, setLastGeneration] = useState({
    prompt: "",
    theme: "violet" as ThemePalette,
    style: "auto" as StylePreset,
  });
  const [historyLoading, setHistoryLoading] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const canvasRef = useRef<CanvasRef>(null);

  const { pushState, undo, redo, canUndo, canRedo } = useCanvasHistory(canvas);
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
  }, [loadHistory]);

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
        model: "llama-3.3-70b-versatile",
        thumbnail_url,
      });
      loadHistory();
    },
    [loadHistory, projectId],
  );

  const handleGenerate = async (
    prompt: string,
    theme: ThemePalette,
    size: CanvasSize,
    style: StylePreset,
  ) => {
    setIsGenerating(true);
    setCanvasSize(size);
    setLastGeneration({ prompt, theme, style });

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, theme, size, style }),
    });

    if (!response.ok) {
      setIsGenerating(false);
      return;
    }

    if (!response.body) {
      setIsGenerating(false);
      return;
    }
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
        try {
          const partial = JSON.parse(line);
          if (partial.elements && Array.isArray(partial.elements)) {
            for (const element of partial.elements) {
              if (!rendered.has(element.id)) {
                rendered.add(element.id);
                canvasRef.current?.renderElement(element);
              }
            }
          }
        } catch {
          // Silently skip malformed stream chunks — partial data is expected
        }
      }
    }
    canvasRef.current?.finishStream();
    pushState();
    setRefresh((v) => v + 1);

    // Wait for canvas to fully render before saving snapshot
    await new Promise((resolve) => setTimeout(resolve, 150));
    await saveHistorySnapshot(prompt, style, theme);
    setIsGenerating(false);
  };

  const handleSuggestLayout = async (): Promise<string> => {
    if (!canvas) return "Use timeline layout";
    const objectCount = canvas.getObjects().length || 0;
    const res = await fetch("/api/ai-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "layout",
        context: { objectCount, prompt: lastGeneration.prompt },
      }),
    });
    const data = await res.json();
    const suggestion = String(data?.output || "Use timeline layout");

    // Return the suggestion to be filled in the prompt panel
    return suggestion;
  };

  const handleAutoTheme = async () => {
    const res = await fetch("/api/ai-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "theme",
        context: { topic: lastGeneration.prompt },
      }),
    });
    const data = await res.json();
    const guess = String(data?.output || "").toLowerCase();
    const nextTheme = (["violet", "ocean", "ember", "forest", "slate"].find(
      (item) => guess.includes(item),
    ) || "violet") as ThemePalette;
    setLastGeneration((prev) => ({ ...prev, theme: nextTheme }));
  };

  const handleMissingSection = async () => {
    if (!canvas) return;
    const context =
      canvas.getObjects().map((obj) => ({ type: obj.type })) || [];
    const res = await fetch("/api/ai-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "missing-section", context }),
    });
    const data = await res.json();
    if (
      window.confirm(
        `Suggestion: ${String(data?.output || "Add key takeaway section")}\nGenerate now?`,
      )
    ) {
      await handleGenerate(
        `${lastGeneration.prompt}\nAdd a key takeaway section only`,
        lastGeneration.theme,
        canvasSize,
        lastGeneration.style,
      );
    }
  };

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
      const res = await fetch("/api/ai-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "tone",
          context: { textBlocks: analysis.textBlocks },
        }),
      });
      const data = await res.json();
      toneSummary = data?.output
        ? `Tone summary: ${String(data.output).slice(0, 140)}`
        : toneSummary;
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
      const theme = (searchParams.get("theme") as ThemePalette) || "violet";
      const size = (searchParams.get("size") as CanvasSize) || "a4";
      const style = (searchParams.get("style") as StylePreset) || "auto";
      if (prompt) handleGenerate(prompt, theme, size, style);
    }
  }, [searchParams]);

  useEffect(() => {
    const onContext = (event: MouseEvent) => {
      if (!canvasRef.current?.canvas) return;
      if (!selectedObject) return;
      event.preventDefault();
      setContextMenu({ visible: true, x: event.clientX, y: event.clientY });
    };
    window.addEventListener("contextmenu", onContext);
    return () => window.removeEventListener("contextmenu", onContext);
  }, [selectedObject]);

  // Close context menu when clicking outside
  useEffect(() => {
    if (!contextMenu.visible) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("[data-context-menu]")) return;
      setContextMenu({ visible: false, x: 0, y: 0 });
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [contextMenu.visible]);

  const applyAIRewrite = async (mode: string) => {
    if (!selectedObject || !("text" in selectedObject)) return;

    if (!window.confirm(`Rewrite text with "${mode}" mode?`)) return;

    const currentText = String((selectedObject as fabric.IText).text || "");

    try {
      const res = await fetch("/api/ai-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rewrite",
          context: { text: currentText, instruction: mode },
        }),
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json();
      const newText = String(data?.output || "").trim();

      if (!newText) {
        return;
      }

      (selectedObject as fabric.IText).set("text", newText);
      canvasRef.current?.canvas?.requestRenderAll();
      pushState();
    } catch {
      // Rewrite failed silently — canvas state unchanged
    }

    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  const applyAISuggestColor = async () => {
    if (!selectedObject) return;

    if (!window.confirm("Apply AI-suggested color?")) return;

    const res = await fetch("/api/ai-action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "color",
        context: {
          type: selectedObject.type,
          fill: (selectedObject as any).fill,
        },
      }),
    });
    const data = await res.json();
    const hex =
      String(data?.output || "#F5C518").match(/#[0-9a-fA-F]{6}/)?.[0] ||
      "#F5C518";
    if ("fill" in selectedObject) {
      (selectedObject as any).set("fill", hex);
    }
    canvasRef.current?.canvas?.requestRenderAll();
    pushState();
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  const applyAIVariation = async () => {
    if (!selectedObject || !canvasRef.current?.canvas) return;
    await duplicateObject();
    const active = canvasRef.current.canvas.getActiveObject();
    if (!active) return;
    if ("angle" in active) active.set("angle", (active.angle || 0) + 6);
    if ("left" in active) active.set("left", (active.left || 0) + 16);
    if ("top" in active) active.set("top", (active.top || 0) + 10);
    canvasRef.current.canvas.requestRenderAll();
    pushState();
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#080808]">
      <Toolbar
        canUndo={canUndo}
        canRedo={canRedo}
        zoom={zoom}
        toolMode="select"
        onToolModeChange={() => undefined}
        onUndo={undo}
        onRedo={redo}
        onOpenHistory={() => setHistoryOpen((v) => !v)}
        onOpenMultiExport={() => setExportOpen(true)}
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
        <div className="w-[260px] border-r border-white/[0.07] bg-[#0f0f0f]">
          <PromptPanel
            onGenerate={handleGenerate}
            onAddElement={handleAddElement}
            isGenerating={isGenerating}
            onSuggestLayout={handleSuggestLayout}
          />
          <LayersPanel
            canvas={canvas}
            onSelectObject={() => setRefresh((v) => v + 1)}
            refreshTrigger={refresh}
            onAddMissingSection={handleMissingSection}
          />
        </div>
        <div className="flex flex-1 items-center justify-center bg-[#0e0e0e]">
          <InfographicCanvas
            ref={canvasRef}
            width={width}
            height={height}
            zoom={zoom}
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
          className="w-[280px] border-l border-white/[0.07] bg-[#0f0f0f] flex flex-col overflow-hidden"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.1) transparent",
          }}
        >
          <div
            className="flex-1 overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.15) transparent",
            }}
          >
            <PropertiesPanel
              properties={properties}
              objectType={selectedObject?.type || null}
              onUpdateProperty={updateObject}
              onBringToFront={bringToFront}
              onSendToBack={sendToBack}
              onDuplicate={duplicateObject}
              onDelete={deleteObject}
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
      />
      <AIContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        visible={contextMenu.visible}
        isText={Boolean(selectedObject && "text" in selectedObject)}
        onRewrite={applyAIRewrite}
        onSuggestColor={applyAISuggestColor}
        onDuplicateVary={applyAIVariation}
        onClose={() => setContextMenu({ visible: false, x: 0, y: 0 })}
      />
    </div>
  );
}
