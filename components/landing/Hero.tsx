"use client";

import { useEffect, useRef, useState } from "react";
import CollabCursors from "@/components/landing/CollabCursors";

/* ── Typewriter ── */
function Typewriter({ lines }: { lines: string[] }) {
  const [li, setLi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setBlink((b) => !b), 530);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const cur = lines[li];
    if (!cur) return;
    let ms = del ? 22 : 42;
    if (!del && ci === cur.length) ms = 1800;
    if (del && ci === 0) ms = 350;
    const t = setTimeout(() => {
      if (!del && ci < cur.length) setCi((c) => c + 1);
      else if (!del) setDel(true);
      else if (del && ci > 0) setCi((c) => c - 1);
      else {
        setDel(false);
        setLi((i) => (i + 1) % lines.length);
      }
    }, ms);
    return () => clearTimeout(t);
  }, [ci, del, li, lines]);

  return (
    <span className="font-ibm-mono text-[var(--accent)] text-[13px] tracking-[1px]">
      {lines[li]?.slice(0, ci) ?? ""}
      <span
        className="inline-block w-[2px] h-[13px] bg-[var(--accent)] align-middle ml-px"
        style={{ opacity: blink ? 1 : 0 }}
      />
    </span>
  );
}

/* ── Floating particles ── */
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 38;
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      o: Math.random() * 0.35 + 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,197,24,${p.o})`;
        ctx.fill();
      });

      // draw faint connecting lines between close particles
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(245,197,24,${0.06 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

/* ── Canvas mock preview ── */
function CanvasMock({ mounted }: { mounted: boolean }) {
  const layers = [
    { label: "FRAME / HERO", color: "var(--accent)", indent: 0, active: true },
    { label: "NAVBAR", color: "var(--text-dim)", indent: 8 },
    { label: "HEADLINE", color: "var(--success-soft)", indent: 8 },
    { label: "SUBTEXT", color: "var(--text-dim)", indent: 8 },
    { label: "CTA GROUP", color: "var(--orange)", indent: 8 },
    { label: "BTN / PRIMARY", color: "var(--orange)", indent: 16 },
    { label: "BTN / GHOST", color: "var(--text-dim)", indent: 16 },
    { label: "MEDIA BLOCK", color: "var(--blue)", indent: 8 },
  ];

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        border: "1px solid var(--border-default)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.03), 0 40px 100px rgba(0,0,0,0.9), 0 0 80px rgba(245,197,24,0.07)",
        background: "var(--bg-subtle)",
      }}
    >
      {/* Animated top border glow */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(245,197,24,0.6) 30%, rgba(245,197,24,0.9) 50%, rgba(245,197,24,0.6) 70%, transparent 100%)",
          animation: "border-slide 3s ease-in-out infinite",
        }}
      />

      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 h-10 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "#111" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-md font-ibm-mono text-[10px] text-[var(--text-dim)] tracking-[1px]"
          style={{ background: "var(--bg-subtle)", border: "1px solid #1E1E1E" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-[var(--success-soft)]"
            style={{ boxShadow: "0 0 6px var(--success-soft)" }}
          />
          readlyn.app / canvas
        </div>
        <div className="flex items-center gap-2">
          {["V", "F", "T", "P"].map((t, i) => (
            <span
              key={t}
              className="font-ibm-mono text-[10px] px-2 py-0.5 rounded"
              style={{
                background: i === 0 ? "var(--accent)" : "var(--bg-overlay)",
                color: i === 0 ? "#000" : "var(--text-dim)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex" style={{ height: "320px" }}>
        {/* Layers */}
        <div
          className="w-[155px] shrink-0 flex flex-col border-r"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "var(--bg-panel)",
          }}
        >
          <div
            className="px-3 py-2 font-ibm-mono text-[8px] text-[var(--accent)] tracking-[2px] border-b"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            LAYERS
          </div>
          {layers.map((l, i) => (
            <div
              key={i}
              className="flex items-center gap-2 py-[7px] font-ibm-mono text-[8px] tracking-[0.5px]"
              style={{
                paddingLeft: `${12 + l.indent}px`,
                background: l.active ? "var(--bg-overlay)" : "transparent",
                color: l.active ? "var(--text-secondary)" : "var(--bg-active)",
                borderLeft: l.active
                  ? "2px solid var(--accent)"
                  : "2px solid transparent",
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateX(0)" : "translateX(-10px)",
                transition: `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: l.color }}
              />
              {l.label}
            </div>
          ))}
        </div>

        {/* Canvas center */}
        <div
          className="flex-1 relative overflow-hidden"
          style={{ background: "var(--bg-subtle)" }}
        >
          {/* Scan line */}
          <div
            className="absolute inset-x-0 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(245,197,24,0.2), transparent)",
              animation: "scan 3s linear infinite",
              top: 0,
            }}
          />

          {/* Frame */}
          <div
            className="absolute"
            style={{
              top: 24,
              left: 24,
              right: 24,
              bottom: 24,
              border: "1.5px dashed rgba(245,197,24,0.3)",
              borderRadius: "4px",
            }}
          >
            <span className="absolute -top-5 left-0 font-ibm-mono text-[8px] text-[var(--accent)] tracking-[1px]">
              INFOGRAPHIC / HERO
            </span>
            {[
              { top: -3, left: -3 },
              { top: -3, right: -3 },
              { bottom: -3, left: -3 },
              { bottom: -3, right: -3 },
            ].map((pos, i) => (
              <span
                key={i}
                className="absolute w-[6px] h-[6px] bg-[var(--accent)]"
                style={{ ...pos }}
              />
            ))}

            {/* Mock infographic content */}
            <div className="p-4 flex flex-col gap-2.5">
              {/* Title bar */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-sm bg-[var(--accent)]" />
                <div
                  className="h-2.5 rounded bg-[var(--text-secondary)] opacity-70"
                  style={{ width: "55%" }}
                />
              </div>
              {/* Stat cards row */}
              <div className="grid grid-cols-3 gap-1.5 mt-1">
                {[
                  ["var(--accent)", "42%"],
                  ["var(--success-soft)", "8.4k"],
                  ["var(--blue)", "$12k"],
                ].map(([c, v], i) => (
                  <div
                    key={i}
                    className="rounded p-1.5 flex flex-col gap-1"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      className="font-ibm-mono text-[9px] font-bold"
                      style={{ color: c }}
                    >
                      {v}
                    </span>
                    <div
                      className="h-1 rounded-full"
                      style={{ background: `${c}30`, width: "80%" }}
                    />
                  </div>
                ))}
              </div>
              {/* Bar chart */}
              <div className="flex items-end gap-1 h-12 mt-1 px-1">
                {[55, 80, 45, 90, 60, 75, 50, 85, 65, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${h}%`,
                      background: i === 7 ? "var(--accent)" : "rgba(245,197,24,0.2)",
                      opacity: mounted ? 1 : 0,
                      transition: `opacity 0.4s ease ${0.4 + i * 0.04}s`,
                    }}
                  />
                ))}
              </div>
              {/* Text lines */}
              <div className="flex flex-col gap-1.5 mt-1">
                {[90, 70, 55].map((w, i) => (
                  <div
                    key={i}
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${w}%`,
                      background:
                        i === 0
                          ? "rgba(255,255,255,0.12)"
                          : "var(--border-subtle-val)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Blinking cursor */}
          <div
            className="absolute bottom-8 right-10 w-[5px] h-[10px] bg-[var(--accent)]"
            style={{ animation: "blink 1.1s step-end infinite" }}
          />
        </div>

        {/* Inspect panel */}
        <div
          className="w-[145px] shrink-0 flex flex-col border-l"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "var(--bg-panel)",
          }}
        >
          <div
            className="px-3 py-2 font-ibm-mono text-[8px] text-[var(--accent)] tracking-[2px] border-b"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            INSPECT
          </div>
          <div className="flex flex-col px-3 py-2">
            {[
              { k: "W", v: "800px" },
              { k: "H", v: "1100px" },
              { k: "THEME", v: "Violet" },
              { k: "LAYOUT", v: "Stats" },
              { k: "FILL", v: "var(--bg-panel)", sw: "var(--bg-panel)" },
              { k: "ACCENT", v: "var(--accent)", sw: "var(--accent)" },
              { k: "OPACITY", v: "100%" },
            ].map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-[5px] border-b"
                style={{
                  borderColor: "rgba(255,255,255,0.04)",
                  opacity: mounted ? 1 : 0,
                  transition: `opacity 0.4s ease ${0.15 + i * 0.05}s`,
                }}
              >
                <span className="font-ibm-mono text-[8px] text-[var(--text-dim)] tracking-[1px]">
                  {p.k}
                </span>
                <div className="flex items-center gap-1">
                  {"sw" in p && (
                    <span
                      className="w-2 h-2 rounded-sm"
                      style={{ background: p.sw }}
                    />
                  )}
                  <span className="font-ibm-mono text-[8px] text-[var(--text-muted-val)]">
                    {p.v}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* AI badge */}
          <div
            className="mx-3 mt-2 px-2 py-1.5 rounded-lg flex items-center gap-1.5"
            style={{
              background: "rgba(245,197,24,0.07)",
              border: "1px solid rgba(245,197,24,0.15)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
              style={{ animation: "pulse 2s ease-in-out infinite" }}
            />
            <span className="font-ibm-mono text-[7px] text-[var(--accent)] tracking-[1px]">
              AI GENERATING
            </span>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div
        className="flex items-center justify-between px-4 h-8 border-t font-ibm-mono text-[8px] text-[#333] tracking-[1px]"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "var(--bg-subtle)" }}
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[var(--success-soft)]"
              style={{ animation: "pulse 2s ease-in-out infinite" }}
            />
            READY
          </span>
          <span>8 LAYERS</span>
          <span>STATS LAYOUT</span>
        </div>
        <div className="flex items-center gap-4">
          <span>POWERED BY AI</span>
          <span className="text-[var(--accent)] opacity-60">v2.0.1</span>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to top, var(--bg-base) 30%, transparent)",
        }}
      />
    </div>
  );
}

/* ── Main Hero ── */
export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative w-full bg-[var(--bg-base)] overflow-hidden">
      <style>{`
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scan     { 0%{top:-2px} 100%{top:100%} }
        @keyframes pulse    { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes border-slide {
          0%   { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes float-up {
          0%   { opacity:0; transform:translateY(24px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes fade-in  { from{opacity:0} to{opacity:1} }
        .hero-enter-0 { animation: float-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .hero-enter-1 { animation: float-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .hero-enter-2 { animation: float-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
        .hero-enter-3 { animation: float-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
        .hero-enter-4 { animation: float-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.45s both; }
        .hero-enter-5 { animation: float-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.55s both; }
        .hero-canvas  { animation: float-up 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
      `}</style>

      {/* Yellow top glow */}
      <div
        className="absolute inset-x-0 top-0 h-[560px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 50% at 50% -5%, rgba(245,197,24,0.13) 0%, transparent 70%)",
        }}
      />

      {/* Particles */}
      <Particles />

      {/* Two-column layout */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-16 pb-10">
        {/* ── Left: text ── */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-[480px] shrink-0">
          {/* Badge */}
          <div className="hero-enter-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-70" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent)]" />
            </span>
            <span className="font-ibm-mono text-[10px] text-[var(--text-muted-val)] tracking-[0.18em] uppercase">
              Early access open
            </span>
          </div>

          {/* Headline */}
          <h1
            className="hero-enter-1 font-grotesk text-white"
            style={{
              fontSize: "clamp(2.8rem, 5.5vw, 4.2rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
            }}
          >
            Describe it.
            <br />
            <span
              style={{
                color: "var(--accent)",
                textShadow: "0 0 50px rgba(245,197,24,0.3)",
              }}
            >
              Get an infographic.
            </span>
          </h1>

          {/* Sub */}
          <p className="hero-enter-2 font-ibm-mono text-[var(--text-dim)] text-[13px] leading-[1.9] tracking-[0.3px] mt-5 max-w-[400px]">
            Type a topic, pick a layout and theme. Get a complete, editable
            infographic in seconds.
          </p>

          {/* Typewriter */}
          <div className="hero-enter-3 flex items-center gap-2 mt-4">
            <span className="font-ibm-mono text-[11px] text-[#333] tracking-[1px]">
              Generating:
            </span>
            <Typewriter
              lines={[
                "Sales Report Q4 2025",
                "Product Roadmap Overview",
                "Market Analysis Chart",
                "Team OKR Summary",
                "Parallax Scene Builder",
              ]}
            />
          </div>

          {/* CTAs */}
          <div className="hero-enter-4 flex flex-col sm:flex-row items-center lg:items-start gap-3 mt-8 w-full sm:w-auto">
            <a
              href="/signup"
              className="group flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-xl font-grotesk text-[13px] font-bold text-black bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-all duration-200 shadow-[0_0_28px_rgba(245,197,24,0.35)] hover:shadow-[0_0_44px_rgba(245,197,24,0.55)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Start free
              <svg
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                className="group-hover:translate-x-0.5 transition-transform"
              >
                <path
                  d="M1 7h12M8 3l5 4-5 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="/login"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-xl font-ibm-mono text-[12px] text-[var(--text-muted-val)] tracking-[0.5px] border border-white/10 hover:border-white/20 hover:text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Log in
            </a>
          </div>

          <p className="hero-enter-4 font-ibm-mono text-[10px] text-[var(--bg-active)] tracking-[2px] mt-3">
            No credit card · Free plan · Early access
          </p>

          {/* Stats row */}
          <div className="hero-enter-5 flex flex-wrap justify-center lg:justify-start gap-2.5 mt-8">
            {[
              { v: "9", l: "Layouts", c: "var(--accent)" },
              { v: "5", l: "Themes", c: "var(--success-soft)" },
              { v: "3", l: "Canvas sizes", c: "var(--blue)" },
              { v: "Free", l: "To start", c: "var(--orange)" },
            ].map(({ v, l, c }) => (
              <div
                key={l}
                className="flex flex-col gap-0.5 px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.02]"
              >
                <span
                  className="font-grotesk text-[20px] font-bold leading-none"
                  style={{ color: c }}
                >
                  {v}
                </span>
                <span className="font-ibm-mono text-[9px] text-[var(--text-dim)] tracking-[1.5px] uppercase">
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: canvas mock ── */}
        <div className="hero-canvas relative flex-1 w-full min-w-0">
          <CanvasMock mounted={mounted} />
          <CollabCursors />
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-28 pointer-events-none z-20"
        style={{
          background: "linear-gradient(to top, var(--bg-base) 0%, transparent 100%)",
        }}
      />
    </section>
  );
}
