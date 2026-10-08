import Link from "next/link";

interface LegalPageProps {
  title: string;
  updated: string;
  children: React.ReactNode;
}

export default function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-[var(--surface-sunken)] px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.15em] uppercase text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
        >
          ← Back to Readlyn
        </Link>

        <h1 className="font-sans text-3xl md:text-4xl font-bold text-white tracking-[-0.03em] mb-2">
          {title}
        </h1>
        <p className="font-sans text-[11px] text-[var(--text-muted)] tracking-[0.1em] mb-10">
          Last updated: {updated}
        </p>

        <div className="prose-legal flex flex-col gap-6 font-sans text-[13px] text-[var(--text-body)] leading-[1.8] tracking-[0.2px]">
          {children}
        </div>
      </div>
    </main>
  );
}
