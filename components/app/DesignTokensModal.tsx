"use client";

import { useState } from "react";
import { X } from "lucide-react";
import designTokens from "@/lib/design-tokens.json";
import { toast } from "@/hooks/use-toast";

interface DesignTokensModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DesignTokensModal({ open, onClose }: DesignTokensModalProps) {
  const [activeTab, setActiveTab] = useState<"visual" | "json">("visual");

  if (!open) return null;

  const jsonString = JSON.stringify(designTokens, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
    toast({
      title: "Copied to clipboard",
      description: "W3C Design Tokens JSON copied to clipboard.",
    });
  };

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "readlyn-design-tokens.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Exported",
      description: "design-tokens.json downloaded.",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[var(--bg-panel)] p-6 shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-grotesk text-lg font-bold text-white">
              W3C Design Tokens System
            </h3>
            <p className="font-ibm-mono text-xs text-[var(--text-dim)]">
              Single source of truth for color, spacing, radius, typography & motion
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:bg-white/10 hover:text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-white/10 py-3">
          <button
            onClick={() => setActiveTab("visual")}
            className={`px-3 py-1.5 rounded-lg text-xs font-ibm-mono transition-all ${
              activeTab === "visual"
                ? "bg-[var(--accent)] text-black font-bold"
                : "text-white/70 hover:bg-white/5"
            }`}
          >
            Token Palette
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`px-3 py-1.5 rounded-lg text-xs font-ibm-mono transition-all ${
              activeTab === "json"
                ? "bg-[var(--accent)] text-black font-bold"
                : "text-white/70 hover:bg-white/5"
            }`}
          >
            W3C JSON
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {activeTab === "visual" ? (
            <div className="space-y-6">
              <div>
                <h4 className="font-ibm-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-3">
                  Color Scale (Primary & Semantic)
                </h4>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {Object.entries(designTokens.color.primary).map(([step, token]) => (
                    <div key={step} className="flex flex-col items-center gap-1">
                      <div
                        className="w-full h-10 rounded-md border border-white/10 shadow-inner"
                        style={{ backgroundColor: token.$value }}
                      />
                      <span className="font-ibm-mono text-[10px] text-white/60">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-ibm-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-3">
                  Spacing Scale
                </h4>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(designTokens.spacing).map(([key, token]) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-ibm-mono text-xs text-white"
                    >
                      <span className="text-[var(--accent)]">{key}:</span>
                      <span>{token.$value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-ibm-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-3">
                  Radius Tokens
                </h4>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(designTokens.radius).map(([key, token]) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-ibm-mono text-xs text-white"
                    >
                      <span className="text-[var(--accent)]">{key}:</span>
                      <span>{token.$value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <pre className="p-4 rounded-xl bg-black/50 border border-white/10 font-ibm-mono text-xs text-emerald-400 overflow-x-auto">
              {jsonString}
            </pre>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div className="font-ibm-mono text-[11px] text-[var(--text-dim)]">
            Format: W3C Design Tokens Community Group standard
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-lg border border-white/10 font-grotesk text-xs font-semibold text-white hover:bg-white/10 transition-all"
            >
              Copy JSON
            </button>
            <button
              onClick={downloadJson}
              className="px-4 py-2 rounded-lg bg-[var(--accent)] font-grotesk text-xs font-bold text-black hover:bg-[var(--accent-hover)] transition-all"
            >
              Download tokens.json
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
