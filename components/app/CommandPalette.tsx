"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Command } from "lucide-react";

export interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: CommandItem[];
}

export default function CommandPalette({ open, onClose, commands }: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((command) => command.label.toLowerCase().includes(q));
  }, [commands, query]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-[var(--scrim)] px-4 pt-[12vh]"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-[var(--line-default)] bg-[var(--surface-base)] shadow-2xl">
        <div className="flex items-center gap-2 border-b border-[var(--line-default)] px-3 py-2">
          <Search className="h-4 w-4 text-[var(--text-body)]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="h-8 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-body)]"
          />
          <kbd className="rounded border border-[var(--line-default)] px-1.5 py-0.5 text-[10px] text-[var(--text-body)]">
            Esc
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-[var(--text-body)]">
              No commands found
            </div>
          ) : (
            filtered.map((command) => (
              <button
                key={command.id}
                onClick={() => {
                  command.run();
                  onClose();
                }}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--fill-default)]"
              >
                <span>{command.label}</span>
                {command.shortcut ? (
                  <span className="text-[10px] text-[var(--text-body)]">{command.shortcut}</span>
                ) : (
                  <Command className="h-3.5 w-3.5 text-[var(--text-body)]" />
                )}
              </button>
            ))
          )}
        </div>
      </div>
      <button
        type="button"
        aria-label="Close command palette"
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
}
