"use client";

import { useEffect } from "react";

export default function EditorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[editor] render error:", error.message);
  }, [error]);

  return (
    <div className="h-screen w-screen bg-[#080808] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
        <div
          className="flex items-center justify-center w-16 h-16 rounded-2xl"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5" />
            <path
              d="M12 7v5M12 15v1"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">Editor crashed</h1>
          <p className="mt-2 text-sm text-white/50">
            The editor encountered an unexpected error. Your canvas state may be
            recoverable from generation history.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-[#F5C518] hover:bg-[#FFDC40] text-black text-sm font-semibold transition-all"
          >
            Reload editor
          </button>
          <a
            href="/dashboard"
            className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white text-sm transition-all"
          >
            Back to dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
