"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";

const slides = [
  {
    tag: "Dashboard",
    idx: "01",
    total: "04",
    title: "Analytics Dashboard",
    description:
      "Data-dense dashboards with charts, tables, plus real-time indicators, built entirely with Readlyn components.",
    accent: "var(--accent)",
    accentHex: "#F5C518",
    bg: "var(--surface-base)",
    border: "rgba(245,197,24,0.12)",
    glow: "rgba(245,197,24,0.07)",
    menuIcon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    tag: "Design System",
    idx: "02",
    total: "04",
    title: "Component Library",
    description:
      "Full design systems with tokens, variants, plus documentation, exported as clean React or Vue code.",
    accent: "var(--accent)",
    accentHex: "#F5C518",
    bg: "var(--surface-base)",
    border: "rgba(245,197,24,0.12)",
    glow: "rgba(245,197,24,0.07)",
    menuIcon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    tag: "Mobile UI",
    idx: "03",
    total: "04",
    title: "Mobile Interface",
    description:
      "Responsive mobile-first layouts with touch-optimized components, exported to Flutter or React Native.",
    accent: "var(--orange)",
    accentHex: "#FF6B35",
    bg: "var(--surface-base)",
    border: "rgba(255,107,53,0.12)",
    glow: "rgba(255,107,53,0.07)",
    menuIcon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    tag: "Marketing",
    idx: "04",
    total: "04",
    title: "Landing Page",
    description:
      "High-converting marketing pages with sections, CTAs, plus animations, ready to ship in hours.",
    accent: "var(--success-soft)",
    accentHex: "#4ADE80",
    bg: "var(--surface-base)",
    border: "rgba(74,222,128,0.12)",
    glow: "rgba(74,222,128,0.07)",
    menuIcon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
];

/* ── Preview components ── */
function DashboardPreview({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="h-2 w-16 rounded-full bg-white/10" />
          <div className="h-2 w-10 rounded-full bg-white/5" />
        </div>
        <div className="h-5 w-5 rounded-full" style={{ backgroundColor: `${accent}30`, border: `1px solid ${accent}40` }} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["+24%", "8.4k", "$12k"].map((val, i) => (
          <div key={i} className="rounded-lg p-2.5 flex flex-col gap-1" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="h-1.5 w-8 rounded-full bg-white/10" />
            <span className="font-sans text-[11px] font-bold" style={{ color: i === 0 ? accent : "var(--text-body)" }}>{val}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 rounded-lg p-3 flex flex-col justify-end gap-1" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--line-subtle)" }}>
        <div className="flex items-end gap-1.5 h-16">
          {[40, 65, 45, 80, 55, 90, 60, 75, 50, 85].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, backgroundColor: i === 6 ? accent : `${accent}25` }} />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i} className="font-sans text-[8px] text-[#333]">{d}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {[85, 60, 40].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-1.5 rounded-full" style={{ width: `${w}%`, backgroundColor: i === 0 ? `${accent}40` : "rgba(255,255,255,0.06)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function DesignSystemPreview({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full p-4 flex flex-col gap-3">
      <div className="flex gap-1.5">
        {[accent, `${accent}80`, `${accent}40`, "#333", "#222", "#111"].map((c, i) => (
          <div key={i} className="h-6 flex-1 rounded-md" style={{ backgroundColor: c }} />
        ))}
      </div>
      <div className="flex gap-2">
        <div className="h-7 px-3 rounded-md flex items-center font-sans text-[9px] font-bold" style={{ backgroundColor: accent, color: "var(--surface-base)" }}>Button</div>
        <div className="h-7 px-3 rounded-md flex items-center font-sans text-[9px] text-[var(--text-body)]" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>Ghost</div>
        <div className="h-5 px-2 rounded-full flex items-center font-sans text-[8px]" style={{ backgroundColor: `${accent}15`, color: accent }}>Badge</div>
      </div>
      <div className="h-8 rounded-lg px-3 flex items-center gap-2" style={{ border: `1px solid ${accent}30`, backgroundColor: "rgba(255,255,255,0.02)" }}>
        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
        <div className="h-1.5 w-24 rounded-full bg-white/10" />
      </div>
      <div className="flex-1 rounded-lg p-3 flex flex-col justify-center gap-2" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid var(--line-subtle)" }}>
        <div className="h-3 w-3/4 rounded-full bg-white/20" />
        <div className="h-2 w-1/2 rounded-full bg-white/10" />
        <div className="h-1.5 w-2/3 rounded-full bg-white/6" />
        <div className="h-1.5 w-1/3 rounded-full bg-white/4" />
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 rounded" style={{ backgroundColor: i < 2 ? `${accent}20` : "rgba(255,255,255,0.04)", border: "1px solid var(--line-subtle)" }} />
        ))}
      </div>
    </div>
  );
}

function MobilePreview({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center py-2">
      <div className="relative h-full max-h-[220px] aspect-[9/16] rounded-[20px] overflow-hidden flex flex-col" style={{ border: `1px solid ${accent}25`, backgroundColor: "var(--surface-base)" }}>
        <div className="flex justify-center pt-2 pb-1">
          <div className="h-1.5 w-10 rounded-full bg-white/10" />
        </div>
        <div className="flex-1 px-2.5 flex flex-col gap-2 overflow-hidden">
          <div className="h-1.5 w-16 rounded-full" style={{ backgroundColor: `${accent}60` }} />
          <div className="rounded-lg h-14 w-full" style={{ backgroundColor: `${accent}12`, border: `1px solid ${accent}20` }} />
          <div className="flex gap-1.5">
            {[1, 2].map((i) => (
              <div key={i} className="flex-1 h-10 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {[100, 80, 60].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full" style={{ width: `${w}%`, backgroundColor: i === 0 ? "rgba(255,255,255,0.12)" : "var(--line-subtle)" }} />
            ))}
          </div>
          <div className="h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: accent }}>
            <div className="h-1.5 w-12 rounded-full bg-[var(--scrim)]" />
          </div>
        </div>
        <div className="flex justify-around py-2 px-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {[accent, "#333", "#333", "#333"].map((c, i) => (
            <div key={i} className="h-3 w-3 rounded-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketingPreview({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="h-2 w-12 rounded-full" style={{ backgroundColor: `${accent}60` }} />
        <div className="flex gap-1.5">
          {[1, 2, 3].map((i) => <div key={i} className="h-1.5 w-8 rounded-full bg-white/8" />)}
        </div>
        <div className="h-5 w-12 rounded-md" style={{ backgroundColor: accent }} />
      </div>
      <div className="flex-1 rounded-xl p-4 flex flex-col justify-center gap-3" style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent}12 0%, transparent 70%)`, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="h-2 w-3/4 rounded-full bg-white/20" />
        <div className="h-2 w-1/2 rounded-full" style={{ backgroundColor: `${accent}50` }} />
        <div className="h-1.5 w-2/3 rounded-full bg-white/8" />
        <div className="h-1.5 w-1/2 rounded-full bg-white/5" />
        <div className="flex gap-2 mt-1">
          <div className="h-6 w-16 rounded-md" style={{ backgroundColor: accent }} />
          <div className="h-6 w-16 rounded-md" style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg p-2 flex flex-col gap-1.5" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid var(--line-subtle)" }}>
            <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: `${accent}30` }} />
            <div className="h-1.5 w-full rounded-full bg-white/8" />
            <div className="h-1.5 w-2/3 rounded-full bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

const previews = [DashboardPreview, DesignSystemPreview, MobilePreview, MarketingPreview];

export default function Showcase() {
  const ref = useReveal() as React.RefObject<HTMLElement>;
  const [active, setActive] = useState(0);

  const slide = slides[active];
  const PreviewComponent = previews[active];

  return (
    <section
      id="showcase"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="relative w-full bg-[var(--surface-sunken)] pt-20 md:pt-[100px] pb-16 md:pb-[100px] overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-20 right-0 h-[320px] w-[320px] rounded-full blur-3xl transition-colors duration-500" style={{ backgroundColor: slide.glow }} />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[240px] w-[240px] rounded-full blur-3xl transition-colors duration-500" style={{ backgroundColor: slide.glow }} />

      {/* Header */}
      <div className="flex flex-col gap-10 px-6 md:px-[120px] mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors duration-300" style={{ color: slide.accent }}>
                What you can build
              </span>
            <h2
              className="font-sans font-bold text-white leading-[1.05]"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", letterSpacing: "-0.03em" }}
            >
              From idea to shipped.
            </h2>
            <p className="font-sans text-[13px] text-[var(--text-body)] tracking-[0.3px] leading-[1.8] max-w-[420px]">
              Pick a use case and see what Readlyn generates in seconds.
            </p>
          </div>

          {/* Counter */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 mb-1">
            <span className="font-sans text-[13px] font-bold transition-colors duration-300" style={{ color: slide.accent }}>{slide.idx}</span>
            <span className="font-sans text-[13px] text-[#333]">/ {slide.total}</span>
          </div>
        </div>

        {/* ── Tab Menu ── */}
        <div className="flex flex-wrap gap-2">
          {slides.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="group relative flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full border font-sans text-[12px] font-medium tracking-[0.2px] transition-all duration-300 cursor-pointer"
                style={{
                  backgroundColor: isActive ? `${s.accentHex}12` : "rgba(255,255,255,0.03)",
                  borderColor: isActive ? `${s.accentHex}40` : "rgba(255,255,255,0.08)",
                  color: isActive ? s.accentHex : "var(--text-muted)",
                  boxShadow: isActive ? `0 0 16px ${s.accentHex}18, inset 0 1px 0 ${s.accentHex}10` : "none",
                }}
              >
                {/* icon pill */}
                <span
                  className="flex items-center justify-center h-6 w-6 rounded-full shrink-0 transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? `${s.accentHex}20` : "rgba(255,255,255,0.05)",
                    color: isActive ? s.accentHex : "rgba(255,255,255,0.3)",
                  }}
                >
                  {s.menuIcon}
                </span>
                {s.tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main card */}
      <div className="px-6 md:px-[120px]">
        <div
          className="relative w-full rounded-2xl overflow-hidden transition-all duration-500"
          style={{ border: `1px solid ${slide.border}`, backgroundColor: slide.bg }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 inset-x-0 h-px transition-colors duration-500" style={{ backgroundColor: slide.accent, opacity: 0.4 }} />

          <div className="grid md:grid-cols-[1fr_1.1fr] min-h-[380px] md:min-h-[420px]">
            {/* Left info */}
            <div className="flex flex-col justify-between p-8 md:p-10 border-b md:border-b-0 md:border-r border-white/5">
              {/* Top meta */}
              <div className="flex items-center justify-between">
                <div
                  className="inline-flex items-center gap-1.5 h-6 px-3 rounded-full"
                  style={{ backgroundColor: `${slide.accent}12`, border: `1px solid ${slide.accent}22` }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: slide.accent }} />
                  <span className="font-sans text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: slide.accent }}>
                    {slide.tag}
                  </span>
                </div>
                <span className="font-sans text-[11px] text-[#333] tracking-[1px]">
                  <span style={{ color: slide.accent }}>{slide.idx}</span> / {slide.total}
                </span>
              </div>

              {/* Title + desc */}
              <div className="flex flex-col gap-4 my-8">
                <h3
                  className="font-sans font-bold text-white leading-[1.1]"
                  style={{ fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", letterSpacing: "-0.025em" }}
                >
                  {slide.title}
                </h3>
                <p className="font-sans text-[12px] text-[var(--text-muted)] leading-[1.8] tracking-[0.2px] max-w-[340px]">
                  {slide.description}
                </p>
              </div>

              {/* Bottom progress dots */}
              <div className="flex items-center gap-1.5">
                {slides.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="h-[3px] rounded-full transition-all duration-300"
                    style={{
                      width: i === active ? 24 : 6,
                      backgroundColor: i === active ? slide.accent : "var(--surface-overlay)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right preview */}
            <div className="relative overflow-hidden" style={{ minHeight: "280px" }}>
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-500"
                style={{ background: `radial-gradient(ellipse at 60% 30%, ${slide.glow} 0%, transparent 65%)` }}
              />
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              {/* Live badge */}
              <div
                className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "rgba(11,11,12,0.6)", border: "1px solid var(--line-default)", backdropFilter: "blur(8px)" }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: slide.accent }} />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: slide.accent }} />
                </span>
                <span className="font-sans text-[9px] tracking-[0.15em] text-[var(--text-body)]">LIVE PREVIEW</span>
              </div>
              <PreviewComponent accent={slide.accent} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
