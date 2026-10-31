"use client";

export default function GlobalError({
  _error,
  reset,
}: {
  _error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[var(--surface-sunken)]">
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
            <p className="font-sans text-[11px] text-[var(--danger)] tracking-[2px] uppercase">
              Critical Error
            </p>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
              Application Crashed
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              A critical error occurred. Please try refreshing the page.
            </p>
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-primary)] text-sm font-semibold transition-all"
              >
                Try again
              </button>
              <a
                href="/"
                className="px-4 py-2 rounded-lg border border-[var(--line-default)] text-[var(--text-body)] hover:text-[var(--text-primary)] text-sm transition-all"
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
