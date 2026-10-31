"use client";

import { useReveal } from "@/hooks/use-reveal";

// no purple, no gradients, no glow, no shading solid borders + flat bg only
const stats = [
  {
    value: "9",
    label: "Layouts",
    tags: ["Steps", "Stats", "Timeline", "Compare", "List", "Pyramid", "Funnel", "Cycle", "Auto"],
    color: "var(--orange)",
    colorHex: "#ff6b35",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
    tags: ["Ocean", "Ember", "Forest", "Slate", "Midnight"],
    color: "var(--info)",
    colorHex: "#60a5fa",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="9"  cy="10" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="15" cy="10" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="7.5"  cy="14" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="16.5" cy="14" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    value: "3",
    label: "Canvas sizes",
    tags: ["A4 Portrait", "Square", "Wide"],
    color: "var(--success)",
    colorHex: "#4ade80",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3"  width="10" height="13" rx="1.5" />
        <rect x="9" y="9"  width="9"  height="9"  rx="1.5" />
        <rect x="3" y="15" width="14" height="6"  rx="1.5" />
      </svg>
    ),
  },
  {
    value: "Free",
    label: "To start",
    tags: ["No credit card", "No time limit", "Free during early access"],
    color: "var(--accent)",
    colorHex: "#f5c518",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
      className="relative w-full py-16 md:py-20 bg-(--surface-sunken)"
      style={{
        borderTop:    "1px solid rgba(16,17,19,0.06)",
        borderBottom: "1px solid rgba(16,17,19,0.06)",
      }}
    >
      <div className="px-6 md:px-30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-4 p-5 rounded-xl bg-(--surface-base)"
              style={{ border: "1px solid rgba(16,17,19,0.07)" }}
            >
              {/* top row: icon + big number */}
              <div className="flex items-center justify-between">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${stat.colorHex}12`,
                    border: `1px solid ${stat.colorHex}28`,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>

                {/* value badge */}
                <span
                  className="font-mono font-black leading-none"
                  style={{
                    fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                    letterSpacing: "-0.04em",
                    color: stat.color,
                  }}
                >
                  {stat.value}
                </span>
              </div>

              {/* label */}
              <span
                className="font-display font-bold text-(--text-primary) leading-none"
                style={{ fontSize: "0.95rem", letterSpacing: "-0.02em" }}
              >
                {stat.label}
              </span>

              {/* pill tags */}
              <div className="flex flex-wrap gap-1.5">
                {stat.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.75 rounded-md font-sans text-[9px] font-semibold tracking-wide"
                    style={{
                      backgroundColor: `${stat.colorHex}10`,
                      border: `1px solid ${stat.colorHex}28`,
                      color: stat.color,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
