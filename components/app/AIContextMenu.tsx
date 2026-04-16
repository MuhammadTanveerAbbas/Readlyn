"use client";

interface AIContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  isText: boolean;
  onRewrite: (mode: string) => void;
  onSuggestColor: () => void;
  onDuplicateVary: () => void;
  onClose: () => void;
}

export default function AIContextMenu({
  x,
  y,
  visible,
  isText,
  onRewrite,
  onSuggestColor,
  onDuplicateVary,
  onClose,
}: AIContextMenuProps) {
  if (!visible) return null;
  return (
    <div
      data-context-menu
      className="fixed z-[60] min-w-[220px] rounded-md border border-white/[0.1] bg-[#0f0f0f] p-1 text-xs text-white shadow-2xl"
      style={{ left: x, top: y }}
      onMouseLeave={onClose}
    >
      {isText ? (
        <>
          {["shorter", "punchier", "simplify", "formal", "rewrite"].map(
            (mode) => (
              <button
                key={mode}
                onClick={() => onRewrite(mode)}
                className="block w-full rounded px-2 py-1 text-left hover:bg-white/[0.06]"
              >
                ✦ Rewrite ({mode})
              </button>
            ),
          )}
          <div className="my-1 h-px bg-white/[0.08]" />
        </>
      ) : null}
      <button
        onClick={onSuggestColor}
        className="block w-full rounded px-2 py-1 text-left hover:bg-white/[0.06]"
      >
        ✦ Suggest better color
      </button>
      <button
        onClick={onDuplicateVary}
        className="block w-full rounded px-2 py-1 text-left hover:bg-white/[0.06]"
      >
        ✦ Duplicate & vary with AI
      </button>
    </div>
  );
}
