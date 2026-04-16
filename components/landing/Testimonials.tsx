"use client";

import { useReveal } from "@/hooks/use-reveal";

export default function Testimonials() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-[#080808] py-20 px-6 md:py-[120px] md:px-[120px] gap-14 md:gap-[72px]"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="inline-flex items-center gap-2 w-fit">
          <span className="w-4 h-px bg-[#F5C518]" />
          <span className="font-ibm-mono text-[11px] font-semibold text-[#F5C518] tracking-[0.2em] uppercase">
            Early access
          </span>
        </div>
        <h2
          className="font-grotesk font-bold text-white leading-[1.05] whitespace-pre-line"
          style={{
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            letterSpacing: "-0.03em",
          }}
        >
          {"Be among the first\nto build with Readlyn."}
        </h2>
        <p className="font-ibm-mono text-[13px] text-[#666666] tracking-[0.3px] leading-[1.8] max-w-[520px]">
          We&apos;re in early access. No fake testimonials, no inflated numbers
          just an honest tool we&apos;re building in public. Try it, break it,
          and tell us what to fix.
        </p>
      </div>

      {/* Honest value cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            icon: (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z"
                  stroke="#F5C518"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            color: "#F5C518",
            title: "Built in public",
            body: "Every feature, every decision  shared openly. Follow the build on GitHub and our changelog.",
            cta: "View changelog →",
          },
          {
            icon: (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="#FF6B35"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 10l2 2 4-4"
                  stroke="#FF6B35"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            color: "#FF6B35",
            title: "Your feedback shapes it",
            body: "We read every issue and feature request. Early users directly influence what gets built next.",
            cta: "Open an issue →",
          },
          {
            icon: (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 10h12M10 4l6 6-6 6"
                  stroke="#A78BFA"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            color: "#A78BFA",
            title: "No lock-in, ever",
            body: "Export clean code you own. No proprietary formats, no vendor dependency. Your work stays yours.",
            cta: "See export formats →",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="group relative flex flex-col gap-5 p-8 rounded-2xl overflow-hidden
                       border border-white/7 bg-[#0c0c0c]
                       hover:border-white/14 transition-all duration-500 hover:-translate-y-1"
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle, ${card.color}08 0%, transparent 70%)`,
              }}
            />

            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${card.color}12`,
                border: `1px solid ${card.color}25`,
              }}
            >
              {card.icon}
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-grotesk text-[15px] font-bold text-white tracking-[-0.01em]">
                {card.title}
              </h3>
              <p className="font-ibm-mono text-[12px] text-[#666666] tracking-[0.3px] leading-[1.8]">
                {card.body}
              </p>
            </div>

            <a
              href="#"
              className="mt-auto font-ibm-mono text-[11px] tracking-[0.1em] uppercase hover:underline"
              style={{ color: card.color }}
            >
              {card.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
