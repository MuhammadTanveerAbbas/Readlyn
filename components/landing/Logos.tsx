export default function Logos() {
  return (
    <section className="flex flex-col items-center w-full bg-[#080808] py-14 px-6 md:px-[120px] gap-8 border-y border-white/5">
      <span className="font-ibm-mono text-[11px] text-[#444444] tracking-[0.25em] uppercase">
        What you get out of the box
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-[900px]">
        {[
          {
            icon: (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1v14M1 8h14"
                  stroke="#F5C518"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ),
            label: "Free to start",
            detail: "No credit card. No time limit.",
          },
          {
            icon: (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1L10 6.5H16L11 9.5L13 15L8 12L3 15L5 9.5L0 6.5H6L8 1Z"
                  stroke="#F5C518"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            label: "Powered by Groq AI",
            detail: "Llama 3.3 70B  fast generation.",
          },
          {
            icon: (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8l3.5 3.5L13 4"
                  stroke="#F5C518"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            label: "PNG export",
            detail: "Download your infographic instantly.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-xl border border-white/6 bg-white/2 px-5 py-4"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#F5C518]/20 bg-[#F5C518]/8">
              {item.icon}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-grotesk text-[13px] font-semibold text-[#C0C0C0]">
                {item.label}
              </span>
              <span className="font-ibm-mono text-[11px] text-[#555555] tracking-[0.05em]">
                {item.detail}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="font-ibm-mono text-center text-[11px] tracking-[0.08em] text-[#444444]">
        Currently in early access your feedback shapes the roadmap
      </p>
    </section>
  );
}
