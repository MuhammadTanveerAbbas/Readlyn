"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";

const slides = [
  {
    tag: "Stats",
    idx: "01",
    total: "03",
    title: "Stats infographic",
    description:
      "A headline, supporting copy, and a row of key figures with matched spacing. Pick the Stats layout and the composition arrives ready to edit.",
    accent: "var(--accent)",
    accentHex: "#F5C518",
    bg: "var(--surface-base)",
    border: "rgba(245,197,24,0.15)",
    glow: "rgba(245,197,24,0.08)",
    menuIcon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="20" x2="6" y2="12" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="18" y1="20" x2="18" y2="9" />
      </svg>
    ),
  },
  {
    tag: "Timeline",
    idx: "02",
    total: "03",
    title: "Timeline infographic",
    description:
      "Milestones on a single path with dates, labels, and connectors. Change the copy or drag any marker and the rest stays aligned.",
    accent: "var(--orange)",
    accentHex: "#FF6B35",
    bg: "var(--surface-base)",
    border: "rgba(255,107,53,0.15)",
    glow: "rgba(255,107,53,0.08)",
    menuIcon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /><line x1="12" y1="7" x2="12" y2="10" /><line x1="12" y1="14" x2="12" y2="17" />
      </svg>
    ),
  },
  {
    tag: "Compare",
    idx: "03",
    total: "03",
    title: "Comparison infographic",
    description:
      "Two options side by side with mirrored headings and accent colors. Swap labels, colors, or order without rebuilding the layout.",
    accent: "#16a34a",
    accentHex: "#16A34A",
    bg: "var(--surface-base)",
    border: "rgba(74,222,128,0.15)",
    glow: "rgba(74,222,128,0.08)",
    menuIcon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="7" height="16" rx="1.5" /><rect x="14" y="4" width="7" height="16" rx="1.5" />
      </svg>
    ),
  },
];

/* ── Preview components ── */
function StatsPreview({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full p-5 flex flex-col gap-3">
      <div className="h-2.5 w-2/3 rounded-full" style={{ backgroundColor: `${accent}55` }} />
      <div className="h-1.5 w-1/2 rounded-full bg-[var(--fill-strong)]" />
      <div className="grid grid-cols-3 gap-2 mt-1">
        {["72%", "3.4x", "18k"].map((value, i) => (
          <div key={value} className="rounded-lg p-2.5 flex flex-col gap-1.5" style={{ backgroundColor: "rgba(16,17,19,0.03)", border: "1px solid rgba(16,17,19,0.07)" }}>
            <span className="font-display text-[18px] font-bold leading-none" style={{ color: i === 0 ? accent : "var(--text-primary)" }}>{value}</span>
            <div className="h-1 w-10 rounded-full bg-[var(--fill-strong)]" />
          </div>
        ))}
      </div>
      <div className="flex-1 rounded-lg p-3 flex flex-col justify-end gap-2" style={{ backgroundColor: "rgba(16,17,19,0.02)", border: "1px solid var(--line-subtle)" }}>
        <div className="flex items-end gap-1.5 h-24">
          {[45, 70, 55, 85, 62, 95, 74].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, backgroundColor: i === 5 ? accent : `${accent}25` }} />
          ))}
        </div>
        <div className="flex justify-between">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <span key={i} className="font-sans text-[8px] text-[var(--text-faint)]">{d}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {[92, 68].map((w, i) => (
          <div key={i} className="h-1.5 rounded-full" style={{ width: `${w}%`, backgroundColor: i === 0 ? "rgba(16,17,19,0.12)" : "rgba(16,17,19,0.06)" }} />
        ))}
      </div>
    </div>
  );
}

function TimelinePreview({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full p-5 flex flex-col gap-5">
      <div className="h-2.5 w-1/2 rounded-full" style={{ backgroundColor: `${accent}55` }} />
      <div className="relative flex-1 flex flex-col justify-between pl-7">
        <div className="absolute left-[7px] top-1 bottom-1 w-px" style={{ backgroundColor: `${accent}30` }} />
        {[
          ["2023", "Research and first prototype"],
          ["2024", "Public release with 9 layouts"],
          ["2025", "Multi-format export and history"],
          ["2026", "Open API for document edits"],
        ].map(([year, label], i) => (
          <div key={year} className="relative flex items-center gap-3">
            <span
              className="absolute -left-7 flex h-[15px] w-[15px] items-center justify-center rounded-full"
              style={{ backgroundColor: i === 0 ? accent : "var(--surface-base)", border: `1px solid ${accent}60` }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: i === 0 ? (accent === "var(--accent)" ? "var(--accent-ink)" : "#ffffff") : accent }} />
            </span>
            <span className="font-sans text-[9px] tracking-[0.12em]" style={{ color: accent }}>{year}</span>
            <div className="flex-1 rounded-md px-2.5 py-1.5 font-sans text-[9px] text-[var(--text-body)]" style={{ backgroundColor: "rgba(16,17,19,0.03)", border: "1px solid rgba(16,17,19,0.07)" }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparePreview({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full p-5 flex flex-col gap-4">
      <div className="h-2.5 w-2/3 rounded-full" style={{ backgroundColor: `${accent}55` }} />
      <div className="flex items-center gap-3">
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-7 rounded-md flex items-center px-2.5" style={{ backgroundColor: `${accent}15`, border: `1px solid ${accent}35` }}>
            <span className="font-sans text-[9px] font-bold tracking-[0.1em]" style={{ color: accent }}>BEFORE</span>
          </div>
          {[80, 65, 72].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[var(--fill-subtle)]5" />
              <div className="h-1.5 rounded-full" style={{ width: `${w}%`, backgroundColor: "rgba(16,17,19,0.08)" }} />
            </div>
          ))}
        </div>
        <span className="font-sans text-[8px] text-[var(--text-faint)]">VS</span>
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-7 rounded-md flex items-center px-2.5" style={{ backgroundColor: accent }}>
            <span className="font-sans text-[9px] font-bold tracking-[0.1em]" style={{ color: accent === "var(--accent)" ? "var(--accent-ink)" : "#ffffff" }}>AFTER</span>
          </div>
          {[88, 74, 60].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full" style={{ backgroundColor: accent }} />
              <div className="h-1.5 rounded-full" style={{ width: `${w}%`, backgroundColor: `${accent}35` }} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto rounded-lg p-3" style={{ backgroundColor: "rgba(16,17,19,0.02)", border: "1px solid var(--line-subtle)" }}>
        <div className="h-1.5 w-1/3 rounded-full mb-2" style={{ backgroundColor: `${accent}40` }} />
        <div className="h-1.5 w-full rounded-full bg-[var(--fill-default)] mb-1.5" />
        <div className="h-1.5 w-4/5 rounded-full bg-[var(--fill-default)]" />
      </div>
    </div>
  );
}

const previews = [StatsPreview, TimelinePreview, ComparePreview];

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
      {/* Header */}
      <div className="flex flex-col gap-10 px-6 md:px-[120px] mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors duration-300" style={{ color: slide.accent }}>
                What you can build
              </span>
            <h2
              className="font-display font-bold text-[var(--text-primary)] leading-[1.05]"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", letterSpacing: "-0.03em" }}
            >
              From prompt to layout.
            </h2>
            <p className="font-sans text-[13px] text-[var(--text-body)] tracking-[0.3px] leading-[1.8] max-w-[420px]">
              Three layouts from the same generator. Every element stays editable.
            </p>
          </div>

          {/* Counter */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 mb-1">
            <span className="font-sans text-[13px] font-bold transition-colors duration-300" style={{ color: slide.accent }}>{slide.idx}</span>
            <span className="font-sans text-[13px] text-[var(--text-faint)]">/ {slide.total}</span>
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
                  backgroundColor: isActive ? `${s.accentHex}12` : "rgba(16,17,19,0.03)",
                  borderColor: isActive ? `${s.accentHex}40` : "rgba(16,17,19,0.08)",
                  color: isActive ? s.accentHex : "var(--text-muted)",
                  boxShadow: "none",
                }}
              >
                {/* icon pill */}
                <span
                  className="flex items-center justify-center h-6 w-6 rounded-full shrink-0 transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? `${s.accentHex}20` : "rgba(16,17,19,0.05)",
                    color: isActive ? s.accentHex : "rgba(16,17,19,0.3)",
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
          className="relative w-full rounded-3xl overflow-hidden transition-all duration-500"
          style={{ border: `1px solid ${slide.border}`, backgroundColor: slide.bg }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 inset-x-0 h-px transition-colors duration-500" style={{ backgroundColor: slide.accent, opacity: 0.6 }} />

          <div className="grid md:grid-cols-[1fr_1.1fr] min-h-[380px] md:min-h-[420px]">
            {/* Left info */}
            <div className="flex flex-col justify-between p-8 md:p-10 border-b md:border-b-0 md:border-r border-[var(--line-subtle)]">
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
                <span className="font-sans text-[11px] text-[var(--text-faint)] tracking-[1px]">
                  <span style={{ color: slide.accent }}>{slide.idx}</span> / {slide.total}
                </span>
              </div>

              {/* Title + desc */}
              <div className="flex flex-col gap-4 my-8">
                <h3
                  className="font-display font-bold text-[var(--text-primary)] leading-[1.1]"
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
                className="absolute inset-0 pointer-events-none opacity-[0.05]"
                style={{
                  backgroundImage: "linear-gradient(rgba(16,17,19,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,17,19,1) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              {/* Live badge */}
              <div
                className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "var(--surface-base)", border: "1px solid var(--line-default)" }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: slide.accent }} />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: slide.accent }} />
                </span>
                <span className="font-sans text-[9px] tracking-[0.15em] text-[var(--text-body)]">CANVAS PREVIEW</span>
              </div>
              <PreviewComponent accent={slide.accent} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
