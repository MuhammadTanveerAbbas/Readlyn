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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--scrim)] p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[var(--line-default)] bg-[var(--surface-base)] p-6 shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between border-b border-[var(--line-default)] pb-4">
          <div>
            <h3 className="font-sans text-lg font-bold text-[var(--text-primary)]">
              W3C Design Tokens System
            </h3>
            <p className="font-sans text-xs text-[var(--text-muted)]">
              Single source of truth for color, spacing, radius, typography & motion
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line-default)] text-[var(--text-body)] hover:bg-[var(--fill-strong)] hover:text-[var(--text-primary)] shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-[var(--line-default)] py-3">
          <button
            onClick={() => setActiveTab("visual")}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all ${
              activeTab === "visual"
                ? "bg-[var(--accent)] text-[var(--text-primary)] font-bold"
                : "text-[var(--text-body)] hover:bg-[var(--fill-default)]"
            }`}
          >
            Token Palette
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all ${
              activeTab === "json"
                ? "bg-[var(--accent)] text-[var(--text-primary)] font-bold"
                : "text-[var(--text-body)] hover:bg-[var(--fill-default)]"
            }`}
          >
            W3C JSON
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {activeTab === "visual" ? (
            <div className="space-y-6">
              <div>
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[var(--accent-text)] mb-3">
                  Color Scale (Primary & Semantic)
                </h4>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {Object.entries(designTokens.color.primary).map(([step, token]) => (
                    <div key={step} className="flex flex-col items-center gap-1">
                      <div
                        className="w-full h-10 rounded-md border border-[var(--line-default)] shadow-inner"
                        style={{ backgroundColor: token.$value }}
                      />
                      <span className="font-sans text-[10px] text-[var(--text-body)]">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[var(--accent-text)] mb-3">
                  Spacing Scale
                </h4>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(designTokens.spacing).map(([key, token]) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 rounded-lg border border-[var(--line-default)] bg-[var(--fill-default)] px-3 py-1.5 font-sans text-xs text-[var(--text-primary)]"
                    >
                      <span className="text-[var(--accent-text)]">{key}:</span>
                      <span>{token.$value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[var(--accent-text)] mb-3">
                  Radius Tokens
                </h4>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(designTokens.radius).map(([key, token]) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 rounded-lg border border-[var(--line-default)] bg-[var(--fill-default)] px-3 py-1.5 font-sans text-xs text-[var(--text-primary)]"
                    >
                      <span className="text-[var(--accent-text)]">{key}:</span>
                      <span>{token.$value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <pre className="p-4 rounded-xl bg-[var(--surface-sunken)] border border-[var(--line-default)] font-mono text-xs text-[var(--text-secondary)] overflow-x-auto">
              {jsonString}
            </pre>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--line-default)] pt-4">
          <div className="font-sans text-[11px] text-[var(--text-muted)]">
            Format: W3C Design Tokens Community Group standard
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-lg border border-[var(--line-default)] font-sans text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--fill-strong)] transition-all"
            >
              Copy JSON
            </button>
            <button
              onClick={downloadJson}
              className="px-4 py-2 rounded-lg bg-[var(--accent)] font-sans text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--accent-hover)] transition-all"
            >
              Download tokens.json
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
