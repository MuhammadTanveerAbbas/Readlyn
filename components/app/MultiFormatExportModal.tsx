"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { exportMultiFormatZip, EXPORT_TARGETS } from "@/lib/exportMultiFormat";

interface MultiFormatExportModalProps {
  open: boolean;
  onClose: () => void;
  canvasJson: unknown;
  projectName: string;
}

export default function MultiFormatExportModal({
  open,
  onClose,
  canvasJson,
  projectName,
}: MultiFormatExportModalProps) {
  const [selected, setSelected] = useState<string[]>(["a4", "square", "wide", "story"]);
  if (!open) return null;

  const toggle = (key: string) => {
    setSelected((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[var(--bg-panel)] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <h3 className="font-grotesk text-lg font-bold text-white">Auto-Resize Export</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:bg-white/10 hover:text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {EXPORT_TARGETS.map((target) => (
            <label key={target.key} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white cursor-pointer hover:bg-white/10 transition-colors">
              <span className="font-ibm-mono text-xs">{target.label} ({target.width}x{target.height})</span>
              <input type="checkbox" checked={selected.includes(target.key)} onChange={() => toggle(target.key)} className="accent-[var(--accent)]" />
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-2 pt-4 border-t border-white/10">
          <button onClick={onClose} className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button
            disabled={selected.length === 0}
            onClick={async () => {
              await exportMultiFormatZip(canvasJson, projectName, selected);
              onClose();
            }}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-bold text-black disabled:opacity-50 hover:bg-[var(--accent-hover)] transition-all"
          >
            Export All Selected
          </button>
        </div>
      </div>
    </div>
  );
}
