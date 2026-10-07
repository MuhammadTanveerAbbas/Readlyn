"use client";

import { useReveal } from "@/hooks/use-reveal";

const capabilities = [
  {
    feature: "AI generates full layout from a prompt",
    detail: "Groq Llama 3.3 70B produces structured canvas elements",
    accent: "var(--accent)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    feature: "Streams elements live to the canvas",
    detail: "Watch your infographic build element by element",
    accent: "var(--blue)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 10h3l2.5-6 4 12 2.5-6h3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    feature: "9 layout archetypes",
    detail: "Steps, stats, timeline, compare, list, pyramid, funnel, cycle, auto",
    accent: "var(--orange)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    feature: "Fabric.js canvas editor",
    detail: "Move, resize, plus edit every element after generation",
    accent: "var(--blue)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    feature: "Export PNG, JSON, plus multi-size ZIP",
    detail: "Download assets you can use anywhere",
    accent: "var(--success-soft)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2v10m0 0l-3.5-3.5M10 12l3.5-3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 13v2.5A1.5 1.5 0 0 0 4.5 17h11a1.5 1.5 0 0 0 1.5-1.5V13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    feature: "Free during early access",
    detail: "No credit card required to start",
    accent: "var(--accent)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2l1.6 3.9 4.2.4-3.2 2.8.9 4.1L10 11.1l-3.5 2.1.9-4.1-3.2-2.8 4.2-.4L10 2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function Comparison() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      id="comparison"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-[var(--bg-base)] py-16 px-4 sm:py-20 sm:px-6 md:py-[120px] md:px-[120px] gap-10 sm:gap-14 md:gap-[72px]"
    >
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="inline-flex items-center gap-2 w-fit">
          <span className="w-4 h-px bg-[var(--accent)]" />
          <span className="font-sans text-[11px] font-semibold text-[var(--accent)] tracking-[0.2em] uppercase">
            Capabilities
          </span>
        </div>
        <h2
          className="font-sans font-bold text-white leading-[1.05] whitespace-pre-line"
          style={{
            fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
            letterSpacing: "-0.03em",
          }}
        >
          {"What Readlyn\ndoes today."}
        </h2>
        <p className="font-sans text-[13px] text-[var(--text-muted-val)] tracking-[0.3px] leading-[1.8]">
          A straight list of features that ship in the product right now, no
          competitor comparisons, no roadmap promises.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {capabilities.map((row) => (
          <div
            key={row.feature}
            className="group relative flex flex-col gap-4 p-6 sm:p-7 rounded-2xl overflow-hidden
                       border border-white/[0.07] bg-[var(--bg-subtle)]
                       hover:border-white/[0.14] transition-all duration-500
                       hover:-translate-y-1"
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${row.accent}08 0%, transparent 70%)`,
              }}
            />

            <div
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shrink-0"
              style={{
                backgroundColor: `${row.accent}12`,
                border: `1px solid ${row.accent}25`,
                boxShadow: `0 0 20px ${row.accent}10`,
              }}
            >
              <div style={{ color: row.accent }}>{row.icon}</div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="font-sans text-[13px] font-semibold text-[var(--text-secondary)] tracking-[0.2px] leading-[1.4]">
                {row.feature}
              </span>
              <span className="font-sans text-[11px] text-[var(--text-dim)] tracking-[0.2px] leading-[1.6]">
                {row.detail}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
