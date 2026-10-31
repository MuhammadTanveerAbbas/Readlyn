import Link from "next/link";

const productLinks = [
  {
    label: "Features",
    href: "#features",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    label: "Compare",
    href: "#comparison",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    label: "Showcase",
    href: "#showcase",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    label: "FAQ",
    href: "#faq",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    label: "Pricing",
    href: "#pricing",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

const openSourceLinks = [
  {
    label: "GitHub",
    href: "https://github.com/MuhammadTanveerAbbas/Readlyn",
    external: true,
    icon: (
      <svg width="12" height="12" viewBox="0 0 15 15" fill="currentColor">
        <path d="M7.5 1A6.5 6.5 0 0 0 1 7.5c0 2.87 1.86 5.3 4.44 6.16.32.06.44-.14.44-.3v-1.05c-1.8.39-2.18-.87-2.18-.87-.3-.75-.72-1-.72-1-.59-.4.04-.4.04-.4.65.05 1 .67 1 .67.58 1 1.52.71 1.9.54.06-.42.23-.71.41-.87-1.44-.16-2.95-.72-2.95-3.2 0-.71.25-1.29.67-1.74-.07-.16-.29-.82.06-1.71 0 0 .55-.18 1.8.67A6.27 6.27 0 0 1 7.5 4.8c.56 0 1.12.07 1.64.22 1.25-.85 1.8-.67 1.8-.67.35.89.13 1.55.06 1.71.42.45.67 1.03.67 1.74 0 2.49-1.52 3.04-2.96 3.2.23.2.44.6.44 1.2v1.78c0 .17.12.37.44.3A6.5 6.5 0 0 0 14 7.5 6.5 6.5 0 0 0 7.5 1z" />
      </svg>
    ),
  },
  {
    label: "Report an issue",
    href: "https://github.com/MuhammadTanveerAbbas/Readlyn/issues",
    external: true,
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

const legalLinks = [
  {
    label: "Privacy",
    href: "/privacy",
    external: false,
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: "Terms",
    href: "/terms",
    external: false,
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

const socials = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/muhammadtanveerabbas",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/MuhammadTanveerAbbas",
    icon: (
      <svg width="14" height="14" viewBox="0 0 15 15" fill="currentColor">
        <path d="M7.5 1A6.5 6.5 0 0 0 1 7.5c0 2.87 1.86 5.3 4.44 6.16.32.06.44-.14.44-.3v-1.05c-1.8.39-2.18-.87-2.18-.87-.3-.75-.72-1-.72-1-.59-.4.04-.4.04-.4.65.05 1 .67 1 .67.58 1 1.52.71 1.9.54.06-.42.23-.71.41-.87-1.44-.16-2.95-.72-2.95-3.2 0-.71.25-1.29.67-1.74-.07-.16-.29-.82.06-1.71 0 0 .55-.18 1.8.67A6.27 6.27 0 0 1 7.5 4.8c.56 0 1.12.07 1.64.22 1.25-.85 1.8-.67 1.8-.67.35.89.13 1.55.06 1.71.42.45.67 1.03.67 1.74 0 2.49-1.52 3.04-2.96 3.2.23.2.44.6.44 1.2v1.78c0 .17.12.37.44.3A6.5 6.5 0 0 0 14 7.5 6.5 6.5 0 0 0 7.5 1z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/m_tanveerabbas",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

const divider = (
  <div
    className="relative z-10 w-full h-px"
    style={{ backgroundColor: "var(--line-default)" }}
  />
);

export default function Footer() {
  return (
    <footer className="relative flex flex-col w-full bg-[var(--surface-sunken)] overflow-hidden">
      {/* top separator */}
      <div
        className="absolute top-0 inset-x-0 h-px"
        style={{ backgroundColor: "var(--line-default)" }}
      />

      {/* grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,17,19,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(16,17,19,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── ROW 1 : Brand + Nav columns ── */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 gap-y-12 px-6 md:px-10 lg:px-[120px] pt-24 pb-12">
        {/* Brand */}
        <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-1 lg:pr-8">
          <div className="flex items-center gap-[10px]">
            <img
              src="/favicon.svg"
              alt="Readlyn"
              width={20}
              height={20}
              style={{ imageRendering: "pixelated" }}
            />
            <span className="font-sans text-[13px] font-bold text-[var(--text-primary)] tracking-[2.5px]">
              READLYN
            </span>
          </div>

          <p className="font-sans text-[12px] text-[var(--text-muted)] tracking-[0.3px] leading-[1.9] max-w-[220px]">
            AI infographic generator. Describe a topic, get a structured
            visual in seconds.
          </p>

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit"
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.18)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--info)] animate-pulse" />
            <span className="font-sans text-[10px] text-[var(--info)] tracking-[1.5px] opacity-70">
              EARLY ACCESS OPEN
            </span>
          </div>
        </div>

        {/* Product */}
        <div className="flex flex-col gap-4">
          <span className="font-sans text-[9px] font-semibold text-[var(--text-muted)] tracking-[0.25em] uppercase">
            Product
          </span>
          <div className="flex flex-col gap-3">
            {productLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group flex items-center gap-2 font-sans text-[12px] text-[var(--text-muted)] tracking-[0.3px] hover:text-[var(--text-body)] transition-colors duration-200 w-fit"
              >
                <span className="text-[var(--text-faint)] group-hover:text-[var(--text-body)] transition-opacity duration-200">
                  {link.icon}
                </span>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Open Source */}
        <div className="flex flex-col gap-4">
          <span className="font-sans text-[9px] font-semibold text-[var(--text-muted)] tracking-[0.25em] uppercase">
            Open Source
          </span>
          <div className="flex flex-col gap-3">
            {openSourceLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 font-sans text-[12px] text-[var(--text-muted)] tracking-[0.3px] hover:text-[var(--text-body)] transition-colors duration-200 w-fit"
              >
                <span className="text-[var(--text-faint)] group-hover:text-[var(--text-body)] transition-opacity duration-200">
                  {link.icon}
                </span>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-4">
          <span className="font-sans text-[9px] font-semibold text-[var(--text-muted)] tracking-[0.25em] uppercase">
            Legal
          </span>
          <div className="flex flex-col gap-3">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex items-center gap-2 font-sans text-[12px] text-[var(--text-muted)] tracking-[0.3px] hover:text-[var(--text-body)] transition-colors duration-200 w-fit"
              >
                <span className="text-[var(--text-faint)] group-hover:text-[var(--text-body)] transition-opacity duration-200">
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {divider}

      {/* ── ROW 2 : Social icons + tagline ── */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 px-6 md:px-10 lg:px-[120px] py-6">
        <span className="font-sans text-[11px] text-[var(--text-muted)] tracking-[0.4px]">
          Follow the build journey
        </span>

        <div className="flex items-center gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line-subtle)] bg-[var(--fill-subtle)] text-[var(--text-muted)] hover:border-[var(--line-strong)] hover:text-[var(--text-primary)] hover:bg-[var(--fill-default)] transition-all duration-200"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {divider}

      {/* ── ROW 3 : Copyright bar ── */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 md:px-10 lg:px-[120px] py-6">
        <div className="flex items-center gap-4">
          <span className="font-sans text-[10px] text-[var(--text-muted)] tracking-[0.5px]">
            © 2026 Readlyn
          </span>
          <span className="w-px h-3" style={{ background: "var(--line-default)" }} />
          <span className="font-sans text-[10px] text-[var(--text-body)] tracking-[0.5px]">
            Built in public  MIT License
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://muhammadtanveerabbas.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[10px] text-[var(--text-muted)] tracking-[0.5px] hover:text-[var(--text-body)] transition-colors duration-200"
          >
            Built by Tanveer
          </a>
        </div>
      </div>
    </footer>
  );
}
