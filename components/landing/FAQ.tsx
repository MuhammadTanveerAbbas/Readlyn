"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";

const faqs = [
  {
    question: "Is Readlyn really free to start?",
    answer:
      "Yes. The free plan requires no credit card. You can generate infographics, use the canvas editor, and export PNG right away. Paid plans add more projects and storage.",
  },
  {
    question: "What AI model powers the generation?",
    answer:
      "Readlyn uses Groq's Llama 3.3 70B model. It generates structured infographic content with real element positions streamed live to your canvas  not just placeholder text.",
  },
  {
    question: "What can I export?",
    answer:
      "You can export your infographic as a high-resolution PNG, or save the raw JSON schema to reload and continue editing later. Code export (React, Vue, etc.) is not currently supported.",
  },
  {
    question: "What layout types are available?",
    answer:
      "There are 9 layout archetypes: Steps, Stats, Timeline, Compare, List, Pyramid, Funnel, Cycle, and Auto. Each has pre-computed element positions so the AI output is always structured.",
  },
  {
    question: "Can I edit the generated infographic?",
    answer:
      "Yes. Every element is editable on the Fabric.js canvas  drag, resize, rotate, recolor, change typography, adjust opacity, and more. The Layers and Properties panels give you full control.",
  },
  {
    question: "Is there team collaboration?",
    answer:
      "Not yet. Readlyn is currently a single-user tool. Real-time collaboration is on the roadmap but not available today.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const ref = useReveal() as React.RefObject<HTMLElement>;

  return (
    <section
      id="faq"
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex flex-col w-full bg-[#080808] py-20 px-6 md:py-[120px] md:px-[120px]"
    >
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        {/* Left */}
        <div className="flex flex-col gap-6 w-full max-w-[520px]">
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 w-fit">
              <span className="w-4 h-px bg-[#F5C518]" />
              <span className="font-ibm-mono text-[11px] font-semibold text-[#F5C518] tracking-[0.2em] uppercase">
                FAQ
              </span>
            </div>
            <h2
              className="font-grotesk font-bold text-white leading-[1.05] whitespace-pre-line"
              style={{
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                letterSpacing: "-0.03em",
              }}
            >
              {"Got\nquestions?"}
            </h2>
            <p className="font-ibm-mono text-[13px] text-[#666666] tracking-[0.3px] leading-[1.8]">
              Honest answers about what Readlyn does and doesn't do today.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#0c0c0c] p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F5C518]/10 border border-[#F5C518]/20 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M7 1a6 6 0 1 0 0 12A6 6 0 0 0 7 1zm0 9.5v-1m0-5.5v4"
                    stroke="#F5C518"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="font-grotesk text-[13px] font-semibold text-white">
                Something missing?
              </span>
            </div>
            <p className="font-ibm-mono text-[12px] text-[#555555] leading-[1.7] tracking-[0.3px]">
              Open a GitHub issue or reach out directly. Early users shape what
              gets built next.
            </p>
            <a
              href="https://github.com/MuhammadTanveerAbbas/Readlyn/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-ibm-mono text-[11px] tracking-[0.15em] text-[#F5C518] uppercase hover:underline"
            >
              Open an issue
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Right: accordion */}
        <div className="flex flex-col w-full rounded-2xl border border-white/[0.07] bg-[#0c0c0c] overflow-hidden">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border-b border-white/[0.06] last:border-none"
              >
                <button
                  className="flex items-center justify-between w-full px-6 py-5 text-left gap-4 group hover:bg-white/[0.02] transition-colors"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                >
                  <span
                    className="font-grotesk text-[14px] font-medium transition-colors duration-200 leading-[1.4]"
                    style={{ color: isOpen ? "#FFFFFF" : "#C0C0C0" }}
                  >
                    {faq.question}
                  </span>
                  <div
                    className="flex items-center justify-center w-7 h-7 rounded-full shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: isOpen
                        ? "rgba(245,197,24,0.12)"
                        : "rgba(255,255,255,0.04)",
                      border: isOpen
                        ? "1px solid rgba(245,197,24,0.3)"
                        : "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <path
                        d="M5 1v8M1 5h8"
                        stroke={isOpen ? "#F5C518" : "#888888"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? "200px" : "0px" }}
                >
                  <div className="px-6 pb-5">
                    <p className="font-ibm-mono text-[12px] text-[#666666] tracking-[0.3px] leading-[1.8]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
