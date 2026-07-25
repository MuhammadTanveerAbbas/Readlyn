"use client";

import { useState, useEffect } from "react";
import * as fabric from "fabric";
import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BrandKitModalProps {
  open: boolean;
  onClose: () => void;
  canvas: fabric.Canvas | null;
}

export default function BrandKitModal({ open, onClose, canvas }: BrandKitModalProps) {
  const [brandName, setBrandName] = useState("My Brand");
  const [primaryColor, setPrimaryColor] = useState("#f5c518");
  const [secondaryColor, setSecondaryColor] = useState("#0f172a");
  const [accentColor, setAccentColor] = useState("#38bdf8");
  const [fontFamily, setFontFamily] = useState("Space Grotesk");

  useEffect(() => {
    const saved = localStorage.getItem("readlyn_brand_kit");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.brandName) setBrandName(parsed.brandName);
        if (parsed.primaryColor) setPrimaryColor(parsed.primaryColor);
        if (parsed.secondaryColor) setSecondaryColor(parsed.secondaryColor);
        if (parsed.accentColor) setAccentColor(parsed.accentColor);
        if (parsed.fontFamily) setFontFamily(parsed.fontFamily);
      } catch {
        // ignore
      }
    }
  }, []);

  if (!open) return null;

  const saveBrandKit = () => {
    const kit = { brandName, primaryColor, secondaryColor, accentColor, fontFamily };
    localStorage.setItem("readlyn_brand_kit", JSON.stringify(kit));
    toast({
      title: "Brand Memory Saved",
      description: "Brand kit colors and typography stored locally for future generations.",
    });
  };

  const applyBrandToCanvas = () => {
    if (!canvas) {
      toast({
        variant: "destructive",
        title: "No canvas ready",
        description: "Open a canvas project to apply the brand memory.",
      });
      return;
    }

    const objects = canvas.getObjects();
    let updated = 0;
    objects.forEach((obj) => {
      if (obj.type === "i-text" || obj.type === "text") {
        const textObj = obj as fabric.IText;
        textObj.set("fontFamily", fontFamily);
        if (textObj.fill !== secondaryColor) {
          textObj.set("fill", primaryColor);
        }
        updated++;
      } else if (obj.type === "rect" || obj.type === "circle") {
        if (obj.fill === "#080808" || obj.fill === "var(--bg-base)") {
          obj.set("fill", secondaryColor);
        } else {
          obj.set("fill", primaryColor);
        }
        updated++;
      }
    });

    canvas.requestRenderAll();
    saveBrandKit();
    toast({
      title: "Brand Applied",
      description: `Updated ${updated} element(s) with ${brandName} design memory.`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[var(--bg-panel)] p-6 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="font-grotesk text-lg font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              Persistent Brand Memory
            </h3>
            <p className="font-ibm-mono text-xs text-[var(--text-dim)]">
              Store logo, palette, and fonts auto-applied across projects
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:bg-white/10 hover:text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div>
            <label className="block font-ibm-mono text-xs text-white/70 mb-1">
              Brand Name
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-ibm-mono text-xs text-white focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-ibm-mono text-[10px] text-white/60 mb-1">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                />
                <span className="font-ibm-mono text-[10px] text-white/80">{primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block font-ibm-mono text-[10px] text-white/60 mb-1">
                Secondary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                />
                <span className="font-ibm-mono text-[10px] text-white/80">{secondaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block font-ibm-mono text-[10px] text-white/60 mb-1">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-8 h-8 rounded border border-white/10 cursor-pointer bg-transparent"
                />
                <span className="font-ibm-mono text-[10px] text-white/80">{accentColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-ibm-mono text-xs text-white/70 mb-1">
              Primary Font Family
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 font-ibm-mono text-xs text-white focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="Space Grotesk" className="bg-[var(--bg-panel)] text-white">Space Grotesk</option>
              <option value="Inter" className="bg-[var(--bg-panel)] text-white">Inter</option>
              <option value="IBM Plex Mono" className="bg-[var(--bg-panel)] text-white">IBM Plex Mono</option>
              <option value="Arial" className="bg-[var(--bg-panel)] text-white">Arial</option>
              <option value="Georgia" className="bg-[var(--bg-panel)] text-white">Georgia</option>
            </select>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 flex justify-end gap-2">
          <button
            onClick={saveBrandKit}
            className="px-4 py-2 rounded-lg border border-white/10 font-grotesk text-xs font-semibold text-white hover:bg-white/10 transition-all"
          >
            Save Memory
          </button>
          <button
            onClick={applyBrandToCanvas}
            className="px-4 py-2 rounded-lg bg-[var(--accent)] font-grotesk text-xs font-bold text-black hover:bg-[var(--accent-hover)] transition-all"
          >
            Apply to Canvas
          </button>
        </div>
      </div>
    </div>
  );
}
