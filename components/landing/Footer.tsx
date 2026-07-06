import Link from "next/link";

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "Compare", href: "#comparison" },
  { label: "Showcase", href: "#showcase" },
  { label: "FAQ", href: "#faq" },
  { label: "Pricing", href: "#pricing" },
];

const externalLinks = [
  {
    label: "GitHub",
    href: "https://github.com/MuhammadTanveerAbbas/Readlyn",
  },
  {
    label: "Report an issue",
    href: "https://github.com/MuhammadTanveerAbbas/Readlyn/issues",
  },
];

const socials = [
  {
    label: "X / Twitter",
    href: "https://x.com/themvpguy",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
        <path d="M11.6 1.5h2.2L9 6.8 14.3 13.5h-4L7 9.4 3 13.5H.8l5.3-6L.5 1.5h4.1l2.9 4.8 3.1-4.8zm-.7 10.8h1.2L4 2.7H2.7l8.2 9.6z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/MuhammadTanveerAbbas/Readlyn",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
        <path d="M7.5 1A6.5 6.5 0 0 0 1 7.5c0 2.87 1.86 5.3 4.44 6.16.32.06.44-.14.44-.3v-1.05c-1.8.39-2.18-.87-2.18-.87-.3-.75-.72-1-.72-1-.59-.4.04-.4.04-.4.65.05 1 .67 1 .67.58 1 1.52.71 1.9.54.06-.42.23-.71.41-.87-1.44-.16-2.95-.72-2.95-3.2 0-.71.25-1.29.67-1.74-.07-.16-.29-.82.06-1.71 0 0 .55-.18 1.8.67A6.27 6.27 0 0 1 7.5 4.8c.56 0 1.12.07 1.64.22 1.25-.85 1.8-.67 1.8-.67.35.89.13 1.55.06 1.71.42.45.67 1.03.67 1.74 0 2.49-1.52 3.04-2.96 3.2.23.2.44.6.44 1.2v1.78c0 .17.12.37.44.3A6.5 6.5 0 0 0 14 7.5 6.5 6.5 0 0 0 7.5 1z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative flex flex-col w-full bg-[var(--bg-base)] overflow-hidden">
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(245,197,24,0.25) 30%, rgba(245,197,24,0.5) 50%, rgba(245,197,24,0.25) 70%, transparent 100%)",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row gap-14 md:gap-0 px-6 md:px-[80px] lg:px-[120px] pt-16 pb-14">
        <div className="flex flex-col gap-7 md:w-[300px] md:shrink-0 md:pr-16">
          <div className="flex items-center gap-[10px]">
            <img
              src="/favicon.svg"
              alt="Readlyn"
              width={20}
              height={20}
              style={{ imageRendering: "pixelated" }}
            />
            <span className="font-grotesk text-[13px] font-bold text-white tracking-[2.5px]">
              READLYN
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_rgba(245,197,24,0.8)]" />
          </div>

          <span className="font-ibm-mono text-[12px] text-[var(--text-dim)] tracking-[0.3px] leading-[1.9] max-w-[230px]">
            AI infographic generator — describe a topic, get a structured visual
            in seconds.
          </span>

          <div className="flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex items-center justify-center w-11 h-11 rounded-lg border border-white/[0.07] bg-white/[0.03] text-[var(--text-dim)] hover:border-[var(--accent)]/40 hover:text-[var(--accent)] hover:bg-[var(--accent)]/[0.06] transition-all duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit"
            style={{
              background: "rgba(245,197,24,0.05)",
              border: "1px solid rgba(245,197,24,0.12)",
            }}
          >
            <span className="font-ibm-mono text-[10px] text-[var(--accent)] tracking-[1.5px] opacity-70">
              EARLY ACCESS OPEN
            </span>
          </div>
        </div>

        <div
          className="hidden md:block w-px self-stretch mx-8 shrink-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent)",
          }}
        />

        <div className="flex-1 grid grid-cols-2 gap-10 md:pl-8">
          <div className="flex flex-col gap-4">
            <span className="font-ibm-mono text-[9px] font-semibold text-[var(--accent)] tracking-[0.25em] uppercase opacity-60">
              Product
            </span>
            <div className="flex flex-col gap-3">
              {productLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="group flex items-center gap-1.5 font-ibm-mono text-[12px] text-[var(--text-dim)] tracking-[0.3px] hover:text-[var(--text-body)] transition-colors duration-200 w-fit"
                >
                  <span
                    className="w-0 h-px bg-[var(--accent)] transition-all duration-200 group-hover:w-3"
                    style={{ opacity: 0.6 }}
                  />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-ibm-mono text-[9px] font-semibold text-[var(--accent)] tracking-[0.25em] uppercase opacity-60">
              Open source
            </span>
            <div className="flex flex-col gap-3">
              {externalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 font-ibm-mono text-[12px] text-[var(--text-dim)] tracking-[0.3px] hover:text-[var(--text-body)] transition-colors duration-200 w-fit"
                >
                  <span
                    className="w-0 h-px bg-[var(--accent)] transition-all duration-200 group-hover:w-3"
                    style={{ opacity: 0.6 }}
                  />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full px-6 md:px-[80px] lg:px-[120px] py-5 gap-4 sm:gap-0"
        style={{ borderTop: "1px solid var(--border-subtle-val)" }}
      >
        <div className="flex items-center gap-5">
          <span className="font-ibm-mono text-[10px] text-[#333] tracking-[0.5px]">
            © 2026 Readlyn
          </span>
          <span
            className="hidden sm:block w-px h-3 self-center"
            style={{ background: "var(--border-default)" }}
          />
          <span className="hidden sm:block font-ibm-mono text-[10px] text-[var(--bg-active)] tracking-[0.5px]">
            Built in public
          </span>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/privacy"
            className="font-ibm-mono text-[10px] text-[#333] tracking-[0.5px] hover:text-[var(--text-muted-val)] transition-colors duration-200"
          >
            Privacy
          </Link>
          <span className="w-px h-3" style={{ background: "rgba(255,255,255,0.07)" }} />
          <Link
            href="/terms"
            className="font-ibm-mono text-[10px] text-[#333] tracking-[0.5px] hover:text-[var(--text-muted-val)] transition-colors duration-200"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
