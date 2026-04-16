"use client";

import { useState, useEffect } from "react";

const links = [
  { label: "Features", section: "features" },
  { label: "Compare", section: "comparison" },
  { label: "Showcase", section: "showcase" },
  { label: "FAQ", section: "faq" },
  { label: "Pricing", section: "pricing" },
];

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.section).filter(Boolean);
    const obs: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-35% 0px -60% 0px" },
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(6,6,6,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
        boxShadow: scrolled
          ? "0 1px 0 0 rgba(245,197,24,0.05), 0 4px 24px rgba(0,0,0,0.4)"
          : "none",
      }}
    >
      <div className="flex items-center justify-between h-[64px] px-6 md:px-[48px] max-w-[1400px] mx-auto">
        {/* Logo */}
        <a href="#" className="flex items-center gap-[10px] shrink-0 group">
          <div className="relative">
            <img
              src="/favicon.svg"
              alt="Readlyn"
              width={22}
              height={22}
              className="group-hover:scale-110 transition-transform duration-200"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
          <span className="font-grotesk text-[13px] font-bold text-white tracking-[2.5px]">
            READLYN
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518] shadow-[0_0_6px_rgba(245,197,24,0.8)]" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-[28px]">
          {links.map(({ label, section }) => {
            const isActive = active === section;
            return (
              <button
                key={label}
                onClick={() => scrollTo(section)}
                className="relative font-ibm-mono text-[11px] tracking-[1.5px] transition-colors duration-200 bg-transparent border-none cursor-pointer py-1"
                style={{ color: isActive ? "#F5C518" : "#888888" }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = isActive
                    ? "#F5C518"
                    : "#888888";
                }}
              >
                {label}
                <span
                  className="absolute left-0 -bottom-[2px] h-[1px] bg-[#F5C518] transition-all duration-300"
                  style={{ width: isActive ? "100%" : "0%" }}
                />
              </button>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-[16px]">
          <a
            href="/login"
            className="font-ibm-mono text-[11px] text-[#888888] tracking-[1px] hover:text-white transition-colors duration-200"
          >
            Log in
          </a>
          <a
            href="/signup"
            className="relative px-5 py-2 rounded-lg text-[12px] font-bold text-black
                       bg-[#F5C518] hover:bg-[#FFDC40]
                       transition-all duration-200
                       shadow-[0_0_20px_rgba(245,197,24,0.3)]
                       hover:shadow-[0_0_30px_rgba(245,197,24,0.5)]
                       hover:scale-[1.02] active:scale-[0.98] font-grotesk tracking-wide"
          >
            Start free
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 -mr-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-[20px] h-[1.5px] bg-white transition-transform duration-200 origin-center"
            style={{
              transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block w-[20px] h-[1.5px] bg-white transition-opacity duration-200"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-[20px] h-[1.5px] bg-white transition-transform duration-200 origin-center"
            style={{
              transform: menuOpen
                ? "translateY(-6.5px) rotate(-45deg)"
                : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? "400px" : "0px",
          background: "rgba(6,6,6,0.97)",
          backdropFilter: "blur(24px)",
          borderBottom: menuOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <nav className="flex flex-col px-6 py-5 gap-0">
          {links.map(({ label, section }) => {
            const isActive = active === section;
            return (
              <button
                key={label}
                onClick={() => {
                  scrollTo(section);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full font-ibm-mono text-[12px] tracking-[1px] py-[14px] border-b border-white/[0.05] transition-colors bg-transparent border-x-0 border-t-0 cursor-pointer"
                style={{ color: isActive ? "#F5C518" : "#888888" }}
              >
                <span
                  className="w-[4px] h-[4px] rounded-full shrink-0 transition-colors"
                  style={{ background: isActive ? "#F5C518" : "#333" }}
                />
                {label}
              </button>
            );
          })}
          <div className="flex flex-col gap-[10px] pt-5">
            <a
              href="/login"
              className="font-ibm-mono text-[12px] text-[#888888] tracking-[1px]"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="font-grotesk text-[12px] font-bold text-black bg-[#F5C518] tracking-[1px] px-[18px] py-[11px] text-center rounded-lg hover:bg-[#FFDC40] transition-colors"
            >
              Start free
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
