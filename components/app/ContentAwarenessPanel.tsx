"use client";

import { RefreshCw, AlertTriangle, CheckCircle2, BookOpen } from "lucide-react";
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
  const hasIssues = overflow.length > 0 || factChecks.length > 0;

  return (
    <div className="border-t border-[var(--line-subtle)] p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-[var(--text-faint)]" />
          <span className="text-[12px] font-semibold text-[var(--text-primary)]">Content Check</span>
        </div>
        <button
          onClick={onRun}
          title="Re-run content check"
          className="flex items-center gap-1 rounded-md border border-[var(--line-default)] px-2 py-1 text-[10px] text-[var(--text-muted)] hover:border-[var(--line-strong)] hover:text-[var(--text-primary)] transition-colors"
        >
          <RefreshCw className="w-2.5 h-2.5" />
          Run
        </button>
      </div>

      <div className="space-y-2.5">
        {/* Readability */}
        {readability.length > 0 ? (
          <div>
            <p className="text-[10px] font-medium text-[var(--text-faint)] uppercase tracking-wide mb-1">
              Readability
            </p>
            <div className="space-y-1">
              {readability.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded px-2 py-1.5 bg-[var(--fill-subtle)] border border-[var(--line-subtle)]"
                >
                  <span className="text-[11px] text-[var(--text-body)] truncate pr-2">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0">
                    {item.grade}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-2 py-2 rounded bg-[var(--fill-subtle)] border border-[var(--line-subtle)]">
            <CheckCircle2 className="w-3 h-3 text-[var(--success)] shrink-0" />
            <span className="text-[11px] text-[var(--text-body)]">No text to analyse yet.</span>
          </div>
        )}

        {/* Overflow warnings */}
        {overflow.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-[var(--text-faint)] uppercase tracking-wide mb-1">
              Overflow
            </p>
            <div className="space-y-1">
              {overflow.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2 rounded px-2 py-1.5 bg-[var(--danger-soft)] border border-[var(--danger)]/20"
                >
                  <AlertTriangle className="w-3 h-3 text-[var(--danger)] shrink-0 mt-0.5" />
                  <span className="text-[11px] text-[var(--danger)]">{item.warning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fact checks */}
        {factChecks.length > 0 && (
          <div>
            <p className="text-[10px] font-medium text-[var(--text-faint)] uppercase tracking-wide mb-1">
              Verify
            </p>
            <div className="space-y-1">
              {factChecks.slice(0, 3).map((item, i) => (
                <div
                  key={`${item}-${i}`}
                  className="flex items-start gap-2 rounded px-2 py-1.5 bg-[var(--fill-subtle)] border border-[var(--line-subtle)]"
                >
                  <span className="text-[var(--warning)] text-[10px] shrink-0 mt-0.5">•</span>
                  <span className="text-[11px] text-[var(--text-body)]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tone summary */}
        <p className="text-[10px] text-[var(--text-faint)] pt-1 border-t border-[var(--line-subtle)]">
          {toneSummary}
        </p>
      </div>
    </div>
  );
}
