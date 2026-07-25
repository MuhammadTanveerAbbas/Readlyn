"use client";

import { X } from "lucide-react";

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: "Ctrl + Z / Cmd + Z", desc: "Undo last edit" },
  { key: "Ctrl + Shift + Z", desc: "Redo action" },
  { key: "V", desc: "Select Tool" },
  { key: "H", desc: "Hand / Pan Canvas Tool" },
  { key: "Space + Drag", desc: "Pan canvas dynamically" },
  { key: "Delete / Backspace", desc: "Delete selected element" },
  { key: "Ctrl + D", desc: "Duplicate selected element" },
  { key: "Arrow Keys", desc: "Nudge element 1px (Shift + Arrow for 10px)" },
  { key: "Ctrl + G", desc: "Group selected elements" },
  { key: "Ctrl + Shift + G", desc: "Ungroup selection" },
  { key: "?", desc: "Open this keyboard shortcuts panel" },
];

export default function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[var(--bg-panel)] p-6 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-grotesk text-lg font-bold text-white">
              Keyboard Shortcuts
            </h3>
            <p className="font-ibm-mono text-xs text-[var(--text-dim)]">
              Speed up your infographic editing workflow
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:bg-white/10 hover:text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {shortcuts.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.02]"
            >
              <span className="font-ibm-mono text-xs text-white/80">{item.desc}</span>
              <kbd className="px-2.5 py-1 rounded-md border border-white/15 bg-white/10 font-ibm-mono text-xs font-semibold text-[var(--accent)] shadow-sm">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[var(--accent)] font-grotesk text-xs font-bold text-black hover:bg-[var(--accent-hover)] transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
