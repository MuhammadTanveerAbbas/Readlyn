"use client";

import { useState } from "react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-[520px] rounded-lg border border-white/[0.1] bg-[#0f0f0f] p-5">
        <h3 className="mb-4 text-lg font-semibold text-white">Auto-Resize Export</h3>
        <div className="space-y-2">
          {EXPORT_TARGETS.map((target) => (
            <label key={target.key} className="flex items-center justify-between rounded border border-white/[0.07] bg-[#161616] px-3 py-2 text-sm text-white">
              <span>{target.label} ({target.width}x{target.height})</span>
              <input type="checkbox" checked={selected.includes(target.key)} onChange={() => toggle(target.key)} />
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded border border-white/[0.1] px-3 py-2 text-sm text-white">Cancel</button>
          <button
            disabled={selected.length === 0}
            onClick={async () => {
              await exportMultiFormatZip(canvasJson, projectName, selected);
              onClose();
            }}
            className="rounded bg-[#F5C518] px-3 py-2 text-sm font-semibold text-black disabled:opacity-60"
          >
            Export All Selected
          </button>
        </div>
      </div>
    </div>
  );
}

