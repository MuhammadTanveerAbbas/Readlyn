"use client";

import type { ReadabilityItem, OverflowItem } from "@/lib/contentAwareness";

interface ContentAwarenessPanelProps {
  readability: ReadabilityItem[];
  overflow: OverflowItem[];
  toneSummary: string;
  factChecks: string[];
  onRun: () => void;
}

export default function ContentAwarenessPanel({
  readability,
  overflow,
  toneSummary,
  factChecks,
  onRun,
}: ContentAwarenessPanelProps) {
  return (
    <div className="border-t border-white/[0.07] p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-white">Content Check</p>
        <button onClick={onRun} className="rounded border border-white/[0.12] px-2 py-1 text-[10px] text-white">Run Check</button>
      </div>
      <div className="space-y-2 text-[10px] text-white/75">
        <p className="text-white/60">Readability</p>
        {readability.slice(0, 4).map((item) => <p key={item.id}>{item.label}: {item.grade}</p>)}
        {overflow.slice(0, 2).map((item) => <p key={item.id}>⚠ {item.warning}</p>)}
        {factChecks.slice(0, 2).map((item, idx) => <p key={`${item}-${idx}`}>• {item}</p>)}
        <p>{toneSummary}</p>
      </div>
    </div>
  );
}

