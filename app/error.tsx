"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global] render error:", error.message);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--surface-sunken)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
        <p className="font-sans text-[11px] text-[var(--danger)] tracking-[2px] uppercase">
          500
        </p>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
          Something went wrong
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          An unexpected server error occurred. Please try again.
        </p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-primary)] text-sm font-semibold transition-all"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-[var(--line-default)] text-[var(--text-body)] hover:text-[var(--text-primary)] text-sm transition-all"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
