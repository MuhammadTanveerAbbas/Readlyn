"use client";

import { useState } from "react";
import * as fabric from "fabric";
import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DevModeInspectModalProps {
  open: boolean;
  onClose: () => void;
  selectedObject: fabric.FabricObject | null;
}

export default function DevModeInspectModal({
  open,
  onClose,
  selectedObject,
}: DevModeInspectModalProps) {
  const [activeTab, setActiveTab] = useState<"css" | "react" | "svg" | "json">("css");

  if (!open) return null;

  const left = Math.round(selectedObject?.left || 0);
  const top = Math.round(selectedObject?.top || 0);
  const width = Math.round((selectedObject?.width || 0) * (selectedObject?.scaleX || 1));
  const height = Math.round((selectedObject?.height || 0) * (selectedObject?.scaleY || 1));
  const fill = (selectedObject?.fill as string) || "#ffffff";
  const opacity = selectedObject?.opacity ?? 1;

  const cssCode = `/* Selected Element CSS */
.element {
  position: absolute;
  left: ${left}px;
  top: ${top}px;
  width: ${width}px;
  height: ${height}px;
  background-color: ${fill};
  opacity: ${opacity};
  transform: rotate(${Math.round(selectedObject?.angle || 0)}deg);
}`;

  const reactCode = `// React / Tailwind Component Export
export function InfographicElement() {
  return (
    <div
      className="absolute transition-all"
      style={{
        left: "${left}px",
        top: "${top}px",
        width: "${width}px",
        height: "${height}px",
        backgroundColor: "${fill}",
        opacity: ${opacity},
        transform: "rotate(${Math.round(selectedObject?.angle || 0)}deg)",
      }}
    >
      ${selectedObject?.type === "i-text" || selectedObject?.type === "text" ? (selectedObject as fabric.IText).text : ""}
    </div>
  );
}`;

  const svgCode = selectedObject
    ? `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${fill}" opacity="${opacity}" />
</svg>`
    : `<svg width="100" height="100"><rect width="100" height="100" fill="#f5c518"/></svg>`;

  const jsonCode = selectedObject
    ? JSON.stringify(selectedObject.toObject(), null, 2)
    : "{}";

  const activeCode =
    activeTab === "css"
      ? cssCode
      : activeTab === "react"
        ? reactCode
        : activeTab === "svg"
          ? svgCode
          : jsonCode;

  const copyCode = () => {
    navigator.clipboard.writeText(activeCode);
    toast({
      title: "Copied to clipboard",
      description: `${activeTab.toUpperCase()} snippet copied to clipboard.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim)] p-4 animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-[var(--line-default)] bg-[var(--surface-base)] p-6 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between border-b border-[var(--line-default)] pb-4">
          <div>
            <h3 className="font-sans text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              Dev Mode, CSS and Code Inspect
            </h3>
            <p className="font-sans text-xs text-[var(--text-muted)]">
              {selectedObject ? `Inspecting ${selectedObject.type} element` : "No element selected (showing canvas item)"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line-default)] text-[var(--text-body)] hover:bg-[var(--fill-strong)] hover:text-[var(--text-primary)] shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Measurements box */}
        <div className="grid grid-cols-4 gap-3 my-4">
          <div className="p-2.5 rounded-xl border border-[var(--line-default)] bg-[var(--fill-default)] text-center">
            <span className="block font-sans text-[10px] text-[var(--text-muted)]">X Position</span>
            <span className="font-mono font-bold text-xs text-[var(--text-primary)]">{left}px</span>
          </div>
          <div className="p-2.5 rounded-xl border border-[var(--line-default)] bg-[var(--fill-default)] text-center">
            <span className="block font-sans text-[10px] text-[var(--text-muted)]">Y Position</span>
            <span className="font-mono font-bold text-xs text-[var(--text-primary)]">{top}px</span>
          </div>
          <div className="p-2.5 rounded-xl border border-[var(--line-default)] bg-[var(--fill-default)] text-center">
            <span className="block font-sans text-[10px] text-[var(--text-muted)]">Width</span>
            <span className="font-mono font-bold text-xs text-[var(--text-primary)]">{width}px</span>
          </div>
          <div className="p-2.5 rounded-xl border border-[var(--line-default)] bg-[var(--fill-default)] text-center">
            <span className="block font-sans text-[10px] text-[var(--text-muted)]">Height</span>
            <span className="font-mono font-bold text-xs text-[var(--text-primary)]">{height}px</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-[var(--line-default)] pb-3">
          <button
            onClick={() => setActiveTab("css")}
            className={`px-3 py-1 rounded-lg text-xs font-sans transition-all ${
              activeTab === "css"
                ? "bg-[var(--accent)] text-[var(--text-primary)] font-bold"
                : "text-[var(--text-body)] hover:bg-[var(--fill-default)]"
            }`}
          >
            CSS
          </button>
          <button
            onClick={() => setActiveTab("react")}
            className={`px-3 py-1 rounded-lg text-xs font-sans transition-all ${
              activeTab === "react"
                ? "bg-[var(--accent)] text-[var(--text-primary)] font-bold"
                : "text-[var(--text-body)] hover:bg-[var(--fill-default)]"
            }`}
          >
            React
          </button>
          <button
            onClick={() => setActiveTab("svg")}
            className={`px-3 py-1 rounded-lg text-xs font-sans transition-all ${
              activeTab === "svg"
                ? "bg-[var(--accent)] text-[var(--text-primary)] font-bold"
                : "text-[var(--text-body)] hover:bg-[var(--fill-default)]"
            }`}
          >
            SVG
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`px-3 py-1 rounded-lg text-xs font-sans transition-all ${
              activeTab === "json"
                ? "bg-[var(--accent)] text-[var(--text-primary)] font-bold"
                : "text-[var(--text-body)] hover:bg-[var(--fill-default)]"
            }`}
          >
            JSON
          </button>
        </div>

        <pre className="p-4 my-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--line-default)] font-mono text-xs text-[var(--text-secondary)] overflow-x-auto max-h-56">
          {activeCode}
        </pre>

        <div className="border-t border-[var(--line-default)] pt-4 flex justify-between items-center">
          <span className="font-sans text-[10px] text-[var(--text-muted)]">
            Developers can directly copy production ready code
          </span>
          <button
            onClick={copyCode}
            className="px-4 py-2 rounded-lg bg-[var(--accent)] font-sans text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--accent-hover)] transition-all"
          >
            Copy Snippet
          </button>
        </div>
      </div>
    </div>
  );
}
