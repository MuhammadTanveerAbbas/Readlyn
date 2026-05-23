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
      <body className="bg-[#080808]">
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
            <p className="font-mono text-[11px] text-red-400 tracking-[2px] uppercase">
              Critical Error
            </p>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Application Crashed
            </h1>
            <p className="text-sm text-white/50">
              A critical error occurred. Please try refreshing the page.
            </p>
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="px-4 py-2 rounded-lg bg-[#F5C518] hover:bg-[#FFDC40] text-black text-sm font-semibold transition-all"
              >
                Try again
              </button>
              <a
                href="/"
                className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white text-sm transition-all"
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
