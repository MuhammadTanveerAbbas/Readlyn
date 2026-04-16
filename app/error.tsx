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
    <html lang="en">
      <body className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
          <p className="font-mono text-[11px] text-red-400 tracking-[2px] uppercase">
            500
          </p>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm text-white/50">
            An unexpected server error occurred. Please try again.
          </p>
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg bg-[#F5C518] hover:bg-[#FFDC40] text-black text-sm font-semibold transition-all"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white text-sm transition-all"
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
