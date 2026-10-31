"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import * as fabric from "fabric";
import EditorLeftPanel from "@/components/app/EditorLeftPanel";
import PropertiesPanel from "@/components/app/PropertiesPanel";
import Toolbar from "@/components/app/Toolbar";
import ZoomSlider from "@/components/app/ZoomSlider";
import AssistantPanel from "@/components/app/AssistantPanel";
import ContentAwarenessPanel from "@/components/app/ContentAwarenessPanel";
import MultiFormatExportModal from "@/components/app/MultiFormatExportModal";
import DesignTokensModal from "@/components/app/DesignTokensModal";
import DevModeInspectModal from "@/components/app/DevModeInspectModal";
import BrandKitModal from "@/components/app/BrandKitModal";
import KeyboardShortcutsModal from "@/components/app/KeyboardShortcutsModal";
import CommandPalette, { type CommandItem } from "@/components/app/CommandPalette";
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
import { CANVAS_SIZES, type CanvasSize, type ThemePalette } from "@/types/infographic";
import type { CanvasRef } from "@/components/app/InfographicCanvas";
import { createClient } from "@/lib/supabase/client";
import {
  getCanvasTextAudit,
  type ReadabilityItem,
  type OverflowItem,
} from "@/lib/contentAwareness";
import { toast } from "@/hooks/use-toast";
import { parseRouteId } from "@/lib/params";
import { applyAutoTheme } from "@/lib/autoTheme";
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

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>("a4");
  const [theme, setTheme] = useState<ThemePalette>("ocean");
  const [zoom, setZoom] = useState(0.6);
  const [toolMode, setToolMode] = useState<"select" | "hand">("select");
  const [refresh, setRefresh] = useState(0);

  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [tokensOpen, setTokensOpen] = useState(false);
  const [devInspectOpen, setDevInspectOpen] = useState(false);
  const [brandKitOpen, setBrandKitOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(false);

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

  const canvasRef = useRef<CanvasRef>(null);
  const clipboardRef = useRef<fabric.FabricObject | null>(null);
  const importFileRef = useRef<HTMLInputElement | null>(null);
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const historyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSpacePressedRef = useRef(false);
  const panStateRef = useRef({ active: false, x: 0, y: 0 });
  const hasLoadedProjectRef = useRef(false);
  const zoomRef = useRef(0.6);
  const lastSavedRef = useRef(Date.now());

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

    const restoredSize = findCanvasSizeKey(data.canvas_width, data.canvas_height);
    if (restoredSize) setCanvasSize(restoredSize);
    if (data.theme) setTheme(data.theme as ThemePalette);

    const activeCanvas = canvasRef.current?.canvas;
    if (data.canvas_json && activeCanvas) {
      await activeCanvas.loadFromJSON(data.canvas_json);
      activeCanvas.requestRenderAll();
    }
  }, [projectId]);

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
      toneSummary = `${analysis.textBlocks.length} text blocks, ${wordCount} words total.`;
      factChecks = analysis.textBlocks
        .filter((item) => /\d/.test(item.text))
        .slice(0, 3)
        .map((item) => `Number found verify the claim in ${item.label}`);
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
          : "No element used a palette colour yet.",
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

  // Space-bar pan
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;
      if (e.code === "Space") isSpacePressedRef.current = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") isSpacePressedRef.current = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Wheel zoom
  useEffect(() => {
    const area = canvasAreaRef.current;
    if (!area) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = area.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;
      const current = zoomRef.current;
      const factor = e.deltaY > 0 ? 0.92 : 1.08;
      const next = Math.min(2, Math.max(0.1, Math.round(current * factor * 100) / 100));
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

  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [contextMenu]);

  // Pointer pan handlers
  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    setContextMenu(null);
    const shouldPan = toolMode === "hand" || isSpacePressedRef.current;
    if (!shouldPan) return;
    const area = canvasAreaRef.current;
    if (!area) return;
    panStateRef.current = { active: true, x: e.clientX, y: e.clientY };
    area.setPointerCapture(e.pointerId);
    area.style.cursor = "grabbing";
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!panStateRef.current.active) return;
    const area = canvasAreaRef.current;
    if (!area) return;
    area.scrollLeft -= e.clientX - panStateRef.current.x;
    area.scrollTop -= e.clientY - panStateRef.current.y;
    panStateRef.current.x = e.clientX;
    panStateRef.current.y = e.clientY;
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!panStateRef.current.active) return;
    panStateRef.current.active = false;
    const area = canvasAreaRef.current;
    area?.releasePointerCapture(e.pointerId);
    if (area) area.style.cursor = toolMode === "hand" ? "grab" : "default";
  };

  // Load project once canvas is ready
  useEffect(() => {
    if (!canvas || hasLoadedProjectRef.current) return;
    hasLoadedProjectRef.current = true;
    loadProject();
  }, [canvas, loadProject]);

  // Fit to screen after canvas/size change
  useEffect(() => {
    if (!canvas) return;
    const t = setTimeout(() => fitToScreen(), 120);
    return () => clearTimeout(t);
  }, [canvas, canvasSize, fitToScreen]);

  // Run content check after canvas changes
  useEffect(() => {
    const t = setTimeout(() => runAwarenessCheck(), 2000);
    return () => clearTimeout(t);
  }, [refresh, runAwarenessCheck]);

  // Cleanup history timer
  useEffect(() => {
    return () => {
      if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;
      const key = e.key.toLowerCase();
      const mod = e.metaKey || e.ctrlKey;

      if (mod && key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (mod && key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }
      if (mod && key === "d") {
        e.preventDefault();
        handleDuplicate();
        return;
      }
      if (mod && key === "c") {
        e.preventDefault();
        const active = canvas?.getActiveObject();
        if (active) {
          active.clone().then((cloned) => {
            clipboardRef.current = cloned;
          });
        }
        return;
      }
      if (mod && key === "v") {
        e.preventDefault();
        if (clipboardRef.current && canvas) {
          clipboardRef.current.clone().then((cloned) => {
            cloned.set({ left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20 });
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            canvas.renderAll();
            pushState();
          });
        }
        return;
      }
      if (mod && key === "a") {
        e.preventDefault();
        if (canvas) {
          const objects = canvas.getObjects();
          if (objects.length) {
            canvas.discardActiveObject();
            const sel = new fabric.ActiveSelection(objects, { canvas });
            canvas.setActiveObject(sel);
            canvas.renderAll();
          }
        }
        return;
      }
      if (mod && e.shiftKey && key === "g") {
        e.preventDefault();
        const active = canvas?.getActiveObject();
        if (!canvas || !active || active.type !== "activeSelection") return;
        const objs = (active as fabric.ActiveSelection).getObjects().slice();
        const group = new fabric.Group(objs, { left: active.left, top: active.top });
        canvas.remove(...objs);
        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.renderAll();
        pushState();
        return;
      }
      if (mod && e.altKey && key === "g") {
        e.preventDefault();
        const active = canvas?.getActiveObject();
        if (!canvas || !active || active.type !== "group") return;
        const group = active as fabric.Group;
        const objs = group.getObjects().slice();
        canvas.remove(group);
        canvas.add(...objs);
        const sel = new fabric.ActiveSelection(objs, { canvas });
        canvas.setActiveObject(sel);
        canvas.renderAll();
        pushState();
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedObject) {
          e.preventDefault();
          handleDelete();
        }
        return;
      }
      if (e.key === "?") {
        setShortcutsOpen(true);
        return;
      }
      if (e.key.startsWith("Arrow")) {
        if (!selectedObject) return;
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowLeft") nudgeSelected(-step, 0);
        if (e.key === "ArrowRight") nudgeSelected(step, 0);
        if (e.key === "ArrowUp") nudgeSelected(0, -step);
        if (e.key === "ArrowDown") nudgeSelected(0, step);
        return;
      }
      if (mod) return;
      if (key === "v") setToolMode("select");
      if (key === "h") setToolMode("hand");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canvas, redo, undo, handleDuplicate, handleDelete, nudgeSelected, pushState, selectedObject]);

  // Auto-save every 8 seconds
  useEffect(() => {
    if (!canvas || !projectId) return;
    const interval = setInterval(async () => {
      const now = Date.now();
      if (now - lastSavedRef.current < 5000) return;
      try {
        const supabase = createClient();
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
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

  const commands: CommandItem[] = useMemo(
    () => [
      { id: "undo", label: "Undo", shortcut: "Ctrl+Z", run: undo },
      { id: "redo", label: "Redo", shortcut: "Ctrl+Shift+Z", run: redo },
      { id: "duplicate", label: "Duplicate selected", shortcut: "Ctrl+D", run: handleDuplicate },
      { id: "delete", label: "Delete selected", shortcut: "Delete", run: handleDelete },
      { id: "fit", label: "Fit to screen", run: fitToScreen },
      {
        id: "snap",
        label: snapToGrid ? "Disable snap to grid" : "Enable snap to grid",
        run: () => setSnapToGrid((v) => !v),
      },
      { id: "select", label: "Select tool", shortcut: "V", run: () => setToolMode("select") },
      { id: "hand", label: "Hand tool", shortcut: "H", run: () => setToolMode("hand") },
      { id: "export", label: "Export", run: () => setExportOpen(true) },
      { id: "export-svg", label: "Export SVG", run: () => canvasRef.current?.exportSVG() },
      { id: "import-file", label: "Import image or JSON", run: () => importFileRef.current?.click() },
      { id: "devmode", label: "Dev Mode inspect", run: () => setDevInspectOpen(true) },
      { id: "shortcuts", label: "Keyboard shortcuts", shortcut: "?", run: () => setShortcutsOpen(true) },
      { id: "assistant", label: "Toggle AI Assistant", run: () => setAssistantOpen((v) => !v) },
    ],
    [undo, redo, handleDuplicate, handleDelete, fitToScreen, snapToGrid],
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--surface-sunken)]">
      {/* Status banners */}
      {isOffline && (
        <div className="bg-[var(--fill-default)] border-b border-[var(--line-default)] px-4 py-1 text-center text-xs text-[var(--warning)] flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--warning)] animate-pulse" />
          Offline changes are saved locally and will sync when reconnected.
        </div>
      )}
      {isSyncing && (
        <div className="bg-[var(--info-soft)] border-b border-[var(--info)]/30 px-4 py-1 text-center text-xs text-[var(--info)]">
          Syncing local changes to cloud…
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
        onToggleAssistant={() => setAssistantOpen((v) => !v)}
        onOpenMultiExport={() => setExportOpen(true)}
        onOpenDesignTokens={() => setTokensOpen(true)}
        onOpenDevInspect={() => setDevInspectOpen(true)}
        onOpenBrandKit={() => setBrandKitOpen(true)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
        onExportPNG={() => canvasRef.current?.exportPNG()}
        onExportJSON={() => canvasRef.current?.exportJSON()}
        onClearAll={() => {
          if (window.confirm("Clear all elements? This cannot be undone.")) {
            canvasRef.current?.clearAll();
            pushState();
          }
        }}
        onZoomIn={() => setZoom((z) => Math.min(z + 0.1, 2))}
        onZoomOut={() => setZoom((z) => Math.max(z - 0.1, 0.1))}
        onFitToScreen={fitToScreen}
        onSetZoom={setZoom}
      />

      <div className="flex h-[calc(100vh-44px)]">
        {/* Mobile overlay */}
        {(leftPanelOpen || rightPanelOpen) && (
          <div
            className="fixed inset-0 z-20 bg-[var(--scrim)] lg:hidden"
            onClick={() => {
              setLeftPanelOpen(false);
              setRightPanelOpen(false);
            }}
          />
        )}

        {/* Left panel */}
        <div
          className={`${leftPanelOpen ? "flex" : "hidden"} lg:flex fixed lg:static inset-y-11 lg:inset-auto left-0 z-30 w-[260px] lg:w-[240px] border-r border-[var(--line-subtle)] bg-[var(--surface-base)] flex-col`}
        >
          <EditorLeftPanel
            canvas={canvas}
            onAddElement={handleAddElement}
            onSelectObject={() => setRefresh((v) => v + 1)}
            onCanvasChanged={handleCanvasChanged}
            refreshTrigger={refresh}
            onImportImage={() => importFileRef.current?.click()}
          />
        </div>

        {/* Canvas area */}
        <div
          ref={canvasAreaRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onContextMenu={(e) => {
            e.preventDefault();
            if (selectedObject) setContextMenu({ x: e.clientX, y: e.clientY });
          }}
          className="relative flex flex-1 overflow-auto overscroll-contain bg-[color-mix(in_srgb,var(--surface-sunken)_85%,white_0.5%)]"
          style={{ cursor: toolMode === "hand" ? "grab" : "default" }}
        >
          <div className="m-auto p-8">
            <InfographicCanvas
              ref={canvasRef}
              width={width}
              height={height}
              zoom={zoom}
              toolMode={toolMode}
              snapToGrid={snapToGrid}
              onReady={setCanvas}
              onObjectModified={handleCanvasChanged}
            />
          </div>
        </div>

        <ZoomSlider zoom={zoom} onZoomChange={setZoom} onFitToScreen={fitToScreen} />

        {/* Right panel */}
        <div
          className={`${rightPanelOpen ? "flex" : "hidden"} lg:flex fixed lg:static inset-y-11 lg:inset-auto right-0 z-30 w-[260px] border-l border-[var(--line-subtle)] bg-[var(--surface-base)] flex-col overflow-hidden`}
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

      {/* Floating assistant panel */}
      <AssistantPanel open={assistantOpen} onClose={() => setAssistantOpen(false)} />

      {/* Context menu */}
      {contextMenu && selectedObject && (
        <div
          className="fixed z-[90] w-44 overflow-hidden rounded-lg border border-[var(--line-default)] bg-[var(--surface-base)] p-1 shadow-[var(--elevation-floating)]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {[
            { label: "Duplicate", shortcut: "Ctrl+D", run: handleDuplicate },
            { label: "Bring to front", shortcut: "", run: handleBringToFront },
            { label: "Send to back", shortcut: "", run: handleSendToBack },
            { label: "Delete", shortcut: "Del", run: handleDelete },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.run();
                setContextMenu(null);
              }}
              className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-[var(--fill-default)] ${
                item.label === "Delete" ? "text-[var(--danger)]" : "text-[var(--text-primary)]"
              }`}
            >
              <span>{item.label}</span>
              {item.shortcut && (
                <span className="text-[10px] text-[var(--text-muted)]">{item.shortcut}</span>
              )}
            </button>
          ))}
        </div>
      )}

      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={commands}
      />

      {/* Hidden file input for imports */}
      <input
        ref={importFileRef}
        type="file"
        accept="application/json,image/png,image/jpeg,image/webp,image/svg+xml,.svg"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            if (file.type === "application/json" || file.name.endsWith(".json")) {
              await canvasRef.current?.importJSON(file);
            } else if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
              await canvasRef.current?.importSVG(file);
            } else {
              await canvasRef.current?.importImage(file);
            }
            pushState();
          }
          e.target.value = "";
        }}
      />

      {/* Modals */}
      <MultiFormatExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        canvasJson={canvasRef.current?.canvas?.toJSON() || {}}
        projectName={projectId}
        sourceWidth={width}
        sourceHeight={height}
      />
      <DesignTokensModal open={tokensOpen} onClose={() => setTokensOpen(false)} />
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
      <KeyboardShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
