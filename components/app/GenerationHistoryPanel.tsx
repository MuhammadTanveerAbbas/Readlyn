"use client";

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
  isLoading?: boolean;
}

export default function GenerationHistoryPanel({
  open,
  items,
  onRestore,
  onDelete,
  isLoading = false,
}: GenerationHistoryPanelProps) {
  if (!open) return null;
  return (
    <aside className="absolute left-0 top-11 z-20 h-[calc(100vh-44px)] w-[320px] border-r border-white/[0.07] bg-[#0f0f0f] p-3">
      <h3 className="mb-3 text-sm font-semibold text-white">
        Generation History
      </h3>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded border border-white/[0.07] bg-[#161616] p-2"
            >
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt="thumbnail"
                  className="mb-2 h-[90px] w-full rounded object-cover"
                />
              ) : null}
              <p className="line-clamp-2 text-xs text-white">
                {item.prompt || "Untitled generation"}
              </p>
              <p className="text-[10px] text-white/50">
                {item.archetype || "auto"} · {item.theme || "violet"}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => onRestore(item.id)}
                  className="rounded bg-[#F5C518] px-2 py-1 text-[10px] font-semibold text-black"
                >
                  Restore
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="rounded border border-white/[0.12] px-2 py-1 text-[10px] text-white"
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
