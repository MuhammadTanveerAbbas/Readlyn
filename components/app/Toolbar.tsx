"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Undo2,
  Redo2,
  Download,
  FileJson,
  History,
  Files,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize,
  MousePointer2,
  Hand,
  ArrowLeft,
  Code2,
  Palette,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface ToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  toolMode: "select" | "hand";
  onToolModeChange: (mode: "select" | "hand") => void;
  onUndo: () => void;
  onRedo: () => void;
  onOpenHistory: () => void;
  onOpenMultiExport: () => void;
  onOpenDesignTokens?: () => void;
  onOpenDevInspect?: () => void;
  onOpenBrandKit?: () => void;
  onOpenShortcuts?: () => void;
  onExportPNG: () => void;
  onExportJSON: () => void;
  onClearAll: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onSetZoom?: (zoom: number) => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function Toolbar({
  canUndo,
  canRedo,
  zoom,
  toolMode,
  onToolModeChange,
  onUndo,
  onRedo,
  onOpenHistory,
  onOpenMultiExport,
  onOpenDesignTokens,
  onOpenDevInspect,
  onOpenBrandKit,
  onOpenShortcuts,
  onExportPNG,
  onExportJSON,
  onClearAll,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onSetZoom,
  showBackButton = true,
  onBack,
}: ToolbarProps) {
  const router = useRouter();
  const [zoomInput, setZoomInput] = useState(Math.round(zoom * 100));

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    setZoomInput(Math.round(zoom * 100));
  }, [zoom]);

  const handleZoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) setZoomInput(val);
  };

  const handleZoomInputBlur = () => {
    const parsed = parseInt(String(zoomInput));
    if (!isNaN(parsed)) {
      const clamped = Math.min(200, Math.max(10, parsed));
      setZoomInput(clamped);
      if (onSetZoom) {
        onSetZoom(clamped / 100);
      }
    }
  };

  const buttonClasses = (disabled = false) => `
    h-7 px-2.5 flex items-center gap-1 rounded
    border border-transparent hover:border-white/[0.08] hover:bg-white/[0.05]
    text-[11px] text-[var(--text-body)] hover:text-white
    transition-all duration-150 cursor-pointer
    ${disabled ? "opacity-40 cursor-not-allowed" : ""}
  `;

  return (
    <div className="h-11 bg-[var(--bg-panel)] border-b border-white/[0.07] px-4 flex items-center justify-between gap-2">
      {/* Left: Back + Logo + Tools */}
      <div className="flex items-center gap-2">
        {showBackButton && (
          <>
            <button
              onClick={handleBack}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/[0.08] hover:border-white/15 bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-[var(--text-body)] hover:text-white transition-all duration-200 group"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="h-5 w-px bg-white/[0.05]" />
          </>
        )}

        <div className="flex items-center gap-2">
          <img
            src="/favicon.svg"
            alt="Readlyn"
            width={18}
            height={18}
            style={{ imageRendering: "pixelated" }}
          />
          <h1 className="text-[13px] font-semibold text-white tracking-[-0.01em] hidden sm:block">
            Readlyn
          </h1>
          <div className="text-[9px] font-bold border border-[var(--accent)]/30 bg-[var(--accent)]/10 rounded px-1.5 py-0.5 text-[var(--accent)] font-ibm-mono hidden sm:block">
            2026 PRO
          </div>
        </div>

        <div className="flex items-center gap-0.5 bg-[var(--bg-elevated)] border border-white/[0.08] rounded-lg p-0.5 ml-1">
          <button
            onClick={() => onToolModeChange("select")}
            title="Select tool (V)"
            className={`h-6 w-7 flex items-center justify-center rounded transition-all duration-150 ${
              toolMode === "select"
                ? "bg-[var(--accent)] text-black"
                : "text-[var(--text-body)] hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            <MousePointer2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToolModeChange("hand")}
            title="Hand tool (H)"
            className={`h-6 w-7 flex items-center justify-center rounded transition-all duration-150 ${
              toolMode === "hand"
                ? "bg-[var(--accent)] text-black"
                : "text-[var(--text-body)] hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center: Actions */}
      <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={buttonClasses(!canUndo)}
          title="Undo (Cmd+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Undo</span>
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={buttonClasses(!canRedo)}
          title="Redo (Cmd+Shift+Z)"
        >
          <Redo2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Redo</span>
        </button>
        <div className="h-5 w-px bg-white/[0.07] mx-1 hidden md:block" />

        {onOpenDevInspect && (
          <button
            onClick={onOpenDevInspect}
            className={buttonClasses()}
            title="Inspect CSS, HTML, SVG & React Component code"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Dev Mode</span>
          </button>
        )}

        {onOpenBrandKit && (
          <button
            onClick={onOpenBrandKit}
            className={buttonClasses()}
            title="Brand Memory & Palette Kit"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Brand Memory</span>
          </button>
        )}

        {onOpenDesignTokens && (
          <button
            onClick={onOpenDesignTokens}
            className={buttonClasses()}
            title="W3C Design Tokens JSON"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Tokens</span>
          </button>
        )}

        <button
          onClick={onOpenHistory}
          className={buttonClasses()}
          title="Open generation history"
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">History</span>
        </button>
        <button
          onClick={onOpenMultiExport}
          className={buttonClasses()}
          title="Export in multiple formats"
        >
          <Files className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Multi Export</span>
        </button>

        <div className="h-5 w-px bg-white/[0.07] mx-1 hidden md:block" />

        <button
          onClick={onExportPNG}
          className={buttonClasses()}
          title="Export as PNG"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">PNG</span>
        </button>
        <button
          onClick={onExportJSON}
          className={buttonClasses()}
          title="Export as JSON"
        >
          <FileJson className="w-3.5 h-3.5" />
          <span className="hidden md:inline">JSON</span>
        </button>

        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            className={buttonClasses()}
            title="Keyboard Shortcuts Reference (?)"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
          </button>
        )}

        <button
          onClick={onClearAll}
          className="h-7 px-2.5 flex items-center gap-1 rounded border border-transparent hover:border-[var(--destructive)]/50 hover:bg-[var(--destructive)]/[0.07] text-[11px] text-[var(--text-body)] hover:text-[var(--destructive)] transition-all duration-150 cursor-pointer"
          title="Clear canvas"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Zoom controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-[var(--bg-elevated)] rounded-full px-2 py-1 border border-white/[0.08] flex-shrink-0">
          <button
            onClick={onZoomOut}
            className="p-1 hover:bg-white/[0.06] rounded transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5 text-[var(--text-body)]" />
          </button>
          <input
            type="text"
            value={`${zoomInput}%`}
            onChange={handleZoomInputChange}
            onBlur={handleZoomInputBlur}
            className="w-10 h-5 text-center text-[10px] font-mono text-white bg-transparent border-none outline-none hidden sm:block"
          />
          <button
            onClick={onZoomIn}
            className="p-1 hover:bg-white/[0.06] rounded transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5 text-[var(--text-body)]" />
          </button>
          <div className="h-4 w-px bg-white/[0.07] mx-0.5 hidden sm:block" />
          <button
            onClick={onFitToScreen}
            className="px-2 py-1 text-[11px] text-[var(--text-body)] hover:text-white hover:bg-white/[0.06] rounded transition-colors hidden sm:flex items-center"
            title="Fit to screen"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
