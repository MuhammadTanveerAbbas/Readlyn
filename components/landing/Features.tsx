"use client";

import { useReveal } from "@/hooks/use-reveal";

const features = [
  {
    index: "01",
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    iconColor: "var(--accent)",
    title: "AI generation with Groq",
    description: "Describe any topic. Groq generates a complete, structured infographic with real layout positions not just placeholder text.",
    tag: "Groq AI",
    tagColor: "var(--accent)",
    featured: true,
    visual: (
      <div className="flex flex-col gap-2 w-full">
        <div className="h-2 w-3/4 rounded-full bg-white/10" />
        <div className="h-2 w-1/2 rounded-full" style={{ backgroundColor: "rgba(245,197,24,0.4)" }} />
        <div className="mt-1 flex flex-col gap-1.5">
          {[90, 70, 55, 40].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-1.5 rounded-full" style={{ width: `${w}%`, backgroundColor: i === 0 ? "rgba(245,197,24,0.5)" : "rgba(255,255,255,0.06)" }} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-1.5">
          {["Steps", "Stats", "Auto"].map((l) => (
            <span key={l} className="px-2 py-0.5 rounded-full font-sans text-[9px] tracking-wide" style={{ backgroundColor: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.2)", color: "var(--accent)" }}>{l}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    index: "02",
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    iconColor: "var(--orange)",
    title: "9 layout archetypes",
    description: "Steps, Stats, Timeline, Compare, List, Pyramid, Funnel, Cycle, or Auto each with pre-computed element positions so the layout is always structured.",
    tag: "Layouts",
    tagColor: "var(--orange)",
    featured: false,
    visual: (
      <div className="grid grid-cols-3 gap-1.5 w-full">
        {["Steps", "Stats", "Timeline", "Compare", "List", "Pyramid", "Funnel", "Cycle", "Auto"].map((l, i) => (
          <div key={l} className="flex items-center justify-center h-7 rounded-lg font-sans text-[8px] tracking-wide" style={{ backgroundColor: i === 0 ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.04)", border: i === 0 ? "1px solid rgba(255,107,53,0.3)" : "1px solid rgba(255,255,255,0.06)", color: i === 0 ? "var(--orange)" : "#555" }}>{l}</div>
        ))}
      </div>
    ),
  },
  {
    index: "03",
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 8l-3 3 3 3M13 8l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    iconColor: "var(--info)",
    title: "Interactive canvas editor",
    description: "Drag, resize, rotate, and edit any element on the Fabric.js canvas. Layers panel, properties panel, undo/redo, zoom, and pan all included.",
    tag: "Editor",
    tagColor: "var(--info)",
    featured: false,
    visual: (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-1.5">
          {["V", "H", "⌘Z"].map((k) => (
            <div key={k} className="h-6 px-2 rounded-md flex items-center font-sans text-[9px] font-bold" style={{ backgroundColor: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", color: "var(--info)" }}>{k}</div>
          ))}
        </div>
        <div className="flex-1 rounded-lg p-2 flex flex-col gap-1.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {[{ w: "60%", h: 14 }, { w: "80%", h: 8 }, { w: "45%", h: 8 }].map((r, i) => (
            <div key={i} className="rounded" style={{ width: r.w, height: r.h, backgroundColor: i === 0 ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.05)", border: i === 0 ? "1px solid rgba(96,165,250,0.4)" : "none" }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    index: "04",
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <path d="M10 2v10m0 0l-3.5-3.5M10 12l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 13v2.5A1.5 1.5 0 0 0 4.5 17h11a1.5 1.5 0 0 0 1.5-1.5V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    iconColor: "var(--success-soft)",
    title: "Export PNG or JSON",
    description: "Download your infographic as a high-res PNG or save the raw JSON schema to reload and continue editing later.",
    tag: "Export",
    tagColor: "var(--success-soft)",
    featured: false,
    visual: (
      <div className="flex flex-col gap-2 w-full">
        {[{ label: "infographic.png", size: "2.4 MB", color: "var(--success-soft)" }, { label: "infographic.json", size: "18 KB", color: "#60a5fa" }].map((f) => (
          <div key={f.label} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="font-sans text-[10px]" style={{ color: f.color }}>{f.label}</span>
            <span className="font-sans text-[9px] text-[#444]">{f.size}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    index: "05",
    icon: (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 8h8M6 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    iconColor: "#a78bfa",
    title: "Parallax Studio",
    description: "Create scroll-driven parallax scenes with layered images, tilt effects, and zoom transitions. Export clean HTML/CSS/JS code.",
    tag: "New tool",
    tagColor: "#a78bfa",
    featured: false,
    visual: (
      <div className="relative w-full h-16 rounded-lg overflow-hidden" style={{ backgroundColor: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.15)" }}>
        {[{ top: "10%", left: "5%", w: 40, h: 6, op: 0.15 }, { top: "35%", left: "10%", w: 70, h: 8, op: 0.25 }, { top: "62%", left: "5%", w: 55, h: 6, op: 0.18 }].map((l, i) => (
          <div key={i} className="absolute rounded-full" style={{ top: l.top, left: l.left, width: l.w, height: l.h, backgroundColor: `rgba(167,139,250,${l.op})` }} />
        ))}
        <div className="absolute bottom-2 right-2 font-sans text-[8px] tracking-widest uppercase" style={{ color: "rgba(167,139,250,0.5)" }}>parallax</div>
      </div>
    ),
  },
];

export default function Features() {
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      id="features"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-[var(--surface-sunken)] py-20 px-6 md:py-[120px] md:px-[120px] gap-14 md:gap-[72px]"
    >
      <div className="flex flex-col gap-4 max-w-[640px]">
        <span className="font-sans text-[11px] font-semibold text-[var(--accent)] tracking-[0.2em] uppercase">
          Features
        </span>
        <h2
          className="font-sans font-bold text-white leading-[1.05] whitespace-pre-line"
          style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.03em" }}
        >
          {"Everything you need.\nNothing you don't."}
        </h2>
        <p className="font-sans text-[13px] text-[var(--text-body)] tracking-[0.3px] leading-[1.8]">
          From prompt to polished infographic: AI generation, a full canvas editor, plus PNG export in one tool.
        </p>
      </div>

      {/* Featured card + 4 smaller cards */}
      <div className="flex flex-col gap-3">
        {/* Row 1: featured wide + first small */}
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-3">
          {/* Featured */}
          <div
            className="group relative flex flex-col justify-between gap-6 p-8 rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-1"
            style={{
              backgroundColor: "var(--surface-base)",
              borderColor: "rgba(245,197,24,0.2)",
              boxShadow: "0 0 0 1px rgba(245,197,24,0.06), 0 20px 60px rgba(11,11,12,0.4)",
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,197,24,0.07) 0%, transparent 70%)" }} />
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(245,197,24,0.5), transparent)" }} />

            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: "rgba(245,197,24,0.12)", border: "1px solid rgba(245,197,24,0.25)", color: "var(--accent)" }}>
                    {features[0].icon}
                  </div>
                  <span className="font-sans text-[10px] font-bold text-[#444] tracking-[2px]">01</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-sans font-bold text-white leading-[1.15]" style={{ fontSize: "1.35rem", letterSpacing: "-0.025em" }}>
                    {features[0].title}
                  </h3>
                  <p className="font-sans text-[12px] text-[var(--text-body)] leading-[1.8] tracking-[0.2px] max-w-[340px]">
                    {features[0].description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {features[0].visual}
              <div className="inline-flex items-center gap-1.5 h-[26px] px-3 rounded-full w-fit"
                style={{ backgroundColor: "rgba(245,197,24,0.1)", border: "1px solid rgba(245,197,24,0.25)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                <span className="font-sans text-[10px] tracking-[0.12em] uppercase font-semibold text-[var(--accent)]">Groq AI</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <FeatureCard feature={features[1]} />
        </div>

        {/* Row 2: 3 equal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {features.slice(2).map((f) => (
            <FeatureCard key={f.index} feature={f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  return (
    <div
      className="group relative flex flex-col gap-5 p-7 rounded-2xl overflow-hidden border border-white/[0.07] bg-[var(--surface-base)] hover:border-white/[0.14] transition-all duration-500 hover:-translate-y-1 cursor-default"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${feature.tagColor}08 0%, transparent 70%)` }} />
      <div className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(to right, transparent, ${feature.tagColor}60, transparent)` }} />

      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${feature.iconColor}12`, border: `1px solid ${feature.iconColor}25`, color: feature.iconColor }}>
          {feature.icon}
        </div>
        <span className="font-sans text-[10px] font-bold text-[#333] tracking-[2px]">{feature.index}</span>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-sans font-bold text-white leading-[1.2]" style={{ fontSize: "1rem", letterSpacing: "-0.02em" }}>
          {feature.title}
        </h3>
        <p className="font-sans text-[11px] text-[#666] tracking-[0.2px] leading-[1.8]">
          {feature.description}
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-3">
        {feature.visual}
        <div className="inline-flex items-center gap-1.5 h-[24px] px-2.5 rounded-full w-fit"
          style={{ backgroundColor: `${feature.tagColor}10`, border: `1px solid ${feature.tagColor}25` }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: feature.tagColor }} />
          <span className="font-sans text-[9px] tracking-[0.12em] uppercase font-semibold" style={{ color: feature.tagColor }}>
            {feature.tag}
          </span>
        </div>
      </div>
    </div>
  );
}
