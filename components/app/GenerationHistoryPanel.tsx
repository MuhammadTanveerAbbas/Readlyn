"use client";

import { X, History } from "lucide-react";

interface HistoryItem {
  id: string;
  prompt: string | null;
  archetype: string | null;
  theme: string | null;
  created_at: string;
  thumbnail_url: string | null;
}

interface GenerationHistoryPanelProps {
  open: boolean;
  items: HistoryItem[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onClose?: () => void;
  isLoading?: boolean;
}

export default function GenerationHistoryPanel({
  open,
  items,
  onRestore,
  onDelete,
  onClose,
  isLoading = false,
}: GenerationHistoryPanelProps) {
  if (!open) return null;
  return (
    <aside className="absolute left-0 top-11 z-20 h-[calc(100vh-44px)] w-[300px] border-r border-[var(--line-subtle)] bg-[var(--surface-base)] p-3 overflow-hidden flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Generation History
        </h3>
        <button
          onClick={onClose}
          aria-label="Close generation history"
          className="flex h-6 w-6 items-center justify-center rounded border border-[var(--line-default)] text-[var(--text-body)] hover:bg-[var(--fill-strong)] hover:text-[var(--text-primary)]"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--line-strong)] border-t-white"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <History className="h-6 w-6 text-[var(--text-faint)]" />
          <p className="text-[11px] text-[var(--text-muted)]">
            No generations yet for this project.
          </p>
          <p className="text-[10px] text-[var(--text-faint)]">
            Generate once and the snapshot shows up here.
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded border border-[var(--line-subtle)] bg-[var(--surface-raised)] p-2"
            >
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt="Generation preview"
                  className="mb-2 h-[90px] w-full rounded object-cover"
                />
              ) : null}
              <p className="line-clamp-2 text-xs text-[var(--text-primary)]">
                {item.prompt || "Untitled generation"}
              </p>
              <p className="text-[10px] text-[var(--text-muted)]">
                {item.archetype || "auto"} · {item.theme || "ocean"}
              </p>
              <p className="text-[10px] text-[var(--text-faint)]">
                {new Date(item.created_at).toLocaleString()}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => onRestore(item.id)}
                  className="rounded bg-[var(--accent)] px-2 py-1 text-[10px] font-semibold text-[var(--text-primary)]"
                >
                  Restore
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="rounded border border-[var(--line-default)] px-2 py-1 text-[10px] text-[var(--text-primary)]"
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
