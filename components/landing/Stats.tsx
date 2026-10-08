"use client";

import { useReveal } from "@/hooks/use-reveal";

const stats = [
  {
    value: "9",
    label: "Layouts",
    description: "Steps  Stats  Timeline  Compare  List  Pyramid  Funnel  Cycle  Auto",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    value: "5",
    label: "Themes",
    description: "Ocean  Ember  Forest  Slate  Midnight",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="15" cy="10" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="7.5" cy="14" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="16.5" cy="14" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    value: "3",
    label: "Canvas sizes",
    description: "A4 Portrait  Square  Wide",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="10" height="13" rx="1.5" />
        <rect x="9" y="9" width="9" height="9" rx="1.5" />
        <rect x="3" y="15" width="14" height="6" rx="1.5" />
      </svg>
    ),
  },
  {
    value: "Free",
    label: "To start",
    description: "No credit card  No time limit  100 generations/day",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
      </svg>
    ),
  },
];

export default function Stats() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="relative w-full py-20 md:py-28 bg-[var(--surface-sunken)]"
    >
      {/* top + bottom borders */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(245,197,24,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative px-6 md:px-[120px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative flex flex-col gap-3 items-center justify-center py-10 px-6 bg-[var(--surface-sunken)] transition-colors duration-300 hover:bg-[var(--surface-base)]"
            >
              {/* accent glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-none"
                style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(245,197,24,0.06) 0%, transparent 70%)" }}
              />

              {/* icon */}
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] mb-1 transition-transform duration-300 group-hover:scale-110">
                {stat.icon}
              </div>

              {/* value */}
              <span
                className="font-sans font-black text-white leading-none"
                style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.5rem)", letterSpacing: "-0.04em" }}
              >
                {stat.value}
              </span>

              {/* label */}
              <span className="font-sans text-[13px] font-semibold text-[var(--text-secondary)] tracking-[-0.01em]">
                {stat.label}
              </span>

              {/* description */}
              <span className="font-sans text-[10px] text-[var(--text-muted)] tracking-[0.06em] text-center leading-relaxed max-w-[140px]">
                {stat.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
