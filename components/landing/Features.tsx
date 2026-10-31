"use client";

import { useReveal } from "@/hooks/use-reveal";

// ─── accent palette (no purple, no gradients, no glow) ───────────────────────
const ACCENT   = "var(--accent)";        // yellow
const ORANGE   = "var(--orange)";
const BLUE     = "var(--info)";
const GREEN    = "var(--success)";
const SLATE    = "#64748b";              // slate-400 – replaces purple

const features = [
  // ── 01  AI generation (featured wide) ────────────────────────────────────
  {
    index: "01",
    title: "AI generation with Groq",
    description:
      "Describe a topic, pick a layout and theme. Groq returns a validated infographic document with real element positions, streamed onto the canvas.",
    tag: "Groq AI",
    color: ACCENT,
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z"
          stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
        />
      </svg>
    ),
    visual: (
      <div className="flex flex-col gap-3 w-full">
        {/* mock prompt bar */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ backgroundColor: "rgba(16,17,19,0.04)", border: "1px solid rgba(16,17,19,0.08)" }}
        >
          <span className="font-sans text-[10px] text-(--text-muted)">Prompt</span>
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(16,17,19,0.06)" }} />
          <span className="font-sans text-[9px] font-semibold" style={{ color: ACCENT }}>Run</span>
        </div>
        {/* mock progress bars */}
        <div className="flex flex-col gap-1.5">
          {[78, 55, 38].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="h-1.25 rounded-full"
                style={{
                  width: `${w}%`,
                  backgroundColor: i === 0 ? "rgba(245,197,24,0.45)" : "rgba(16,17,19,0.07)",
                }}
              />
            </div>
          ))}
        </div>
        {/* layout chips */}
        <div className="flex gap-1.5 flex-wrap">
          {["Steps", "Stats", "Auto"].map((l) => (
            <Badge key={l} label={l} color={ACCENT} />
          ))}
        </div>
      </div>
    ),
  },

  // ── 02  Layouts & themes ──────────────────────────────────────────────────
  {
    index: "02",
    title: "9 layouts, 5 themes",
    description:
      "Steps, Stats, Timeline, Compare, List, Pyramid, Funnel, Cycle, or Auto. Every layout has pre-computed pixel positions, and every theme applies one consistent palette.",
    tag: "Layouts",
    color: ORANGE,
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    visual: (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-wrap gap-1.5">
          {["Steps", "Stats", "Timeline", "Compare", "List", "Pyramid", "Funnel", "Cycle", "Auto"].map(
            (l, i) => <Badge key={l} label={l} color={ORANGE} dim={i !== 0} />
          )}
        </div>
      </div>
    ),
  },

  // ── 03  Canvas editor ─────────────────────────────────────────────────────
  {
    index: "03",
    title: "Interactive canvas editor",
    description:
      "Drag, resize, rotate, group, and edit text on a Fabric.js canvas. Layers, contextual inspector, command palette, right-click menu, and snap-to-grid included.",
    tag: "Editor",
    color: BLUE,
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 8l-3 3 3 3M13 8l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    visual: (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-1.5">
          {["V", "H", "⌘Z"].map((k) => (
            <KeyBadge key={k} label={k} color={BLUE} />
          ))}
        </div>
        <div
          className="rounded-lg p-2 flex flex-col gap-1.5"
          style={{ backgroundColor: "rgba(16,17,19,0.02)", border: "1px solid rgba(16,17,19,0.07)" }}
        >
          {[{ w: "60%", h: 12 }, { w: "80%", h: 7 }, { w: "45%", h: 7 }].map((r, i) => (
            <div
              key={i}
              className="rounded"
              style={{
                width: r.w,
                height: r.h,
                backgroundColor: i === 0 ? "rgba(96,165,250,0.18)" : "rgba(16,17,19,0.05)",
                border: i === 0 ? "1px solid rgba(96,165,250,0.35)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    ),
  },

  // ── 04  Export ────────────────────────────────────────────────────────────
  {
    index: "04",
    title: "Export PNG, SVG, JSON",
    description:
      "Download a high-res PNG, a clean SVG, or the JSON document. Developer Mode also produces CSS, React, and JSON for any selected element.",
    tag: "Export",
    color: GREEN,
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <path d="M10 2v10m0 0l-3.5-3.5M10 12l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 13v2.5A1.5 1.5 0 0 0 4.5 17h11a1.5 1.5 0 0 0 1.5-1.5V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    visual: (
      <div className="flex flex-col gap-1.5 w-full">
        {[
          { label: "infographic.png", size: "2.4 MB", color: GREEN },
          { label: "infographic.svg", size: "94 KB",  color: BLUE },
          { label: "infographic.json", size: "18 KB",  color: SLATE },
        ].map((f) => (
          <div
            key={f.label}
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg"
            style={{ backgroundColor: "rgba(16,17,19,0.03)", border: "1px solid rgba(16,17,19,0.07)" }}
          >
            <span className="font-mono text-[9px]" style={{ color: f.color }}>{f.label}</span>
            <span className="font-sans text-[8px] text-(--text-faint)">{f.size}</span>
          </div>
        ))}
      </div>
    ),
  },

  // ── 05  Generation history ────────────────────────────────────────────────
  {
    index: "05",
    title: "Generation history",
    description:
      "Every AI run is saved. Jump back to any version, duplicate it to a new project, or compare outputs side-by-side without losing your latest edits.",
    tag: "History",
    color: SLATE,
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    visual: (
      <div className="flex flex-col gap-1.5 w-full">
        {[
          { label: "v3 : Solar system overview", time: "2 min ago",  active: true  },
          { label: "v2 : Solar system overview", time: "14 min ago", active: false },
          { label: "v1 : Draft",                 time: "1 hr ago",   active: false },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg"
            style={{
              backgroundColor: item.active ? "rgba(148,163,184,0.08)" : "rgba(16,17,19,0.02)",
              border: item.active ? "1px solid rgba(148,163,184,0.25)" : "1px solid rgba(16,17,19,0.05)",
            }}
          >
            <span className="font-sans text-[9px] truncate" style={{ color: item.active ? SLATE : "var(--text-faint)" }}>
              {item.label}
            </span>
            <span className="font-sans text-[8px] text-(--text-faint) shrink-0 ml-2">{item.time}</span>
          </div>
        ))}
      </div>
    ),
  },
];

// ─── shared micro-components ─────────────────────────────────────────────────

function Badge({ label, color, dim = false }: { label: string; color: string; dim?: boolean }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.75 rounded-md font-sans text-[9px] font-semibold tracking-wide"
      style={{
        backgroundColor: dim ? "rgba(16,17,19,0.04)" : `${color}14`,
        border: dim ? "1px solid rgba(16,17,19,0.07)" : `1px solid ${color}30`,
        color: dim ? "var(--text-faint)" : color,
      }}
    >
      {label}
    </span>
  );
}

function KeyBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-md font-mono text-[9px] font-bold"
      style={{
        backgroundColor: `${color}10`,
        border: `1px solid ${color}28`,
        color,
      }}
    >
      {label}
    </span>
  );
}

function TagPill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.75 rounded-md font-sans text-[9px] font-semibold tracking-widest uppercase"
      style={{
        backgroundColor: `${color}12`,
        border: `1px solid ${color}28`,
        color,
      }}
    >
      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

// ─── section ─────────────────────────────────────────────────────────────────

export default function Features() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      id="features"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-(--surface-sunken) py-20 px-6 md:py-30 md:px-30 gap-14 md:gap-18"
    >
      {/* heading */}
      <div className="flex flex-col gap-4 max-w-150">
        <span className="font-sans text-[11px] font-semibold text-(--accent-text) tracking-[0.2em] uppercase">
          Features
        </span>
        <h2
          className="font-display font-bold text-(--text-primary) leading-[1.05] whitespace-pre-line"
          style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.03em" }}
        >
          {"Everything you need.\nNothing you don't."}
        </h2>
        <p className="font-sans text-[13px] text-(--text-body) tracking-[0.3px] leading-[1.8]">
          From prompt to exported file AI generation, a full canvas editor, and multiple export formats in one tool.
        </p>
      </div>

      {/* bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 auto-rows-auto">

        {/* 01 featured, spans 7 cols */}
        <div
          className="md:col-span-7 flex flex-col justify-between gap-5 p-6 rounded-xl border border-[rgba(245,197,24,0.22)] bg-(--surface-base)"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.22)", color: ACCENT }}
                >
                  {features[0].icon}
                </div>
                <span className="font-mono text-[10px] text-(--text-faint) tracking-[2px]">01</span>
              </div>
              <h3 className="font-display font-bold text-(--text-primary) leading-[1.2]" style={{ fontSize: "1.2rem", letterSpacing: "-0.025em" }}>
                {features[0].title}
              </h3>
              <p className="font-sans text-[11px] text-(--text-body) leading-[1.75] tracking-[0.2px] max-w-90">
                {features[0].description}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {features[0].visual}
            <TagPill label={features[0].tag} color={features[0].color} />
          </div>
        </div>

        {/* 02 spans 5 cols */}
        <SmallCard feature={features[1]} className="md:col-span-5" />

        {/* 03 spans 4 cols */}
        <SmallCard feature={features[2]} className="md:col-span-4" />

        {/* 04 spans 4 cols */}
        <SmallCard feature={features[3]} className="md:col-span-4" />

        {/* 05 spans 4 cols */}
        <SmallCard feature={features[4]} className="md:col-span-4" />

      </div>
    </section>
  );
}

function SmallCard({ feature, className = "" }: { feature: typeof features[0]; className?: string }) {
  return (
    <div
      className={`${className} flex flex-col justify-between gap-4 p-6 rounded-xl border border-(--line-subtle) bg-(--surface-base)`}
    >
      {/* header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${feature.color}10`,
                border: `1px solid ${feature.color}22`,
                color: feature.color,
              }}
            >
              {feature.icon}
            </div>
            <span className="font-mono text-[10px] text-(--text-faint) tracking-[2px]">{feature.index}</span>
          </div>
          <h3
            className="font-display font-bold text-(--text-primary) leading-[1.2]"
            style={{ fontSize: "0.95rem", letterSpacing: "-0.02em" }}
          >
            {feature.title}
          </h3>
          <p className="font-sans text-[11px] text-(--text-muted) tracking-[0.2px] leading-[1.75]">
            {feature.description}
          </p>
        </div>
      </div>

      {/* visual + tag */}
      <div className="flex flex-col gap-3">
        {feature.visual}
        <TagPill label={feature.tag} color={feature.color} />
      </div>
    </div>
  );
}
