"use client";

import { X } from "lucide-react";

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: "Ctrl + Z / Cmd + Z", desc: "Undo last edit" },
  { key: "Ctrl + Shift + Z", desc: "Redo action" },
  { key: "Ctrl + K / Cmd + K", desc: "Open command palette" },
  { key: "Ctrl + C / Cmd + C", desc: "Copy selected element" },
  { key: "Ctrl + V / Cmd + V", desc: "Paste element" },
  { key: "Ctrl + A / Cmd + A", desc: "Select all elements" },
  { key: "Ctrl + Shift + G", desc: "Group selected elements" },
  { key: "Ctrl + Alt + G", desc: "Ungroup selected group" },
  { key: "V", desc: "Select Tool" },
  { key: "H", desc: "Hand / Pan Canvas Tool" },
  { key: "Space + Drag", desc: "Pan canvas dynamically" },
  { key: "Mouse Wheel", desc: "Zoom in or out toward the cursor" },
  { key: "Delete / Backspace", desc: "Delete selected element" },
  { key: "Ctrl + D", desc: "Duplicate selected element" },
  { key: "Arrow Keys", desc: "Nudge element 1px (Shift + Arrow for 10px)" },
  { key: "?", desc: "Open this keyboard shortcuts panel" },
];

export default function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim)] p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--line-default)] bg-[var(--surface-base)] p-6 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between border-b border-[var(--line-default)] pb-4">
          <div>
            <h3 className="font-sans text-lg font-bold text-[var(--text-primary)]">
              Keyboard Shortcuts
            </h3>
            <p className="font-sans text-xs text-[var(--text-muted)]">
              Speed up your infographic editing workflow
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line-default)] text-[var(--text-body)] hover:bg-[var(--fill-strong)] hover:text-[var(--text-primary)] shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {shortcuts.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--line-subtle)] bg-[var(--fill-subtle)]"
            >
              <span className="font-sans text-xs text-[var(--text-secondary)]">{item.desc}</span>
              <kbd className="px-2.5 py-1 rounded-md border border-[var(--line-default)] bg-[var(--fill-strong)] font-mono text-xs font-semibold text-[var(--accent-text)] shadow-sm">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--line-default)] pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[var(--accent)] font-sans text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--accent-hover)] transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
