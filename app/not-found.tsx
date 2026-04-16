import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
        <p className="font-ibm-mono text-[11px] text-[#F5C518] tracking-[2px] uppercase">
          404
        </p>
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Page not found
        </h1>
        <p className="text-sm text-white/50">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg bg-[#F5C518] hover:bg-[#FFDC40] text-black text-sm font-semibold transition-all"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
