"use client";

import JSZip from "jszip";
import designTokens from "@/lib/design-tokens.json";
import { generateInfographicReactComponent } from "@/lib/code-generator";
import { ensureCanvasFontsLoaded } from "@/lib/canvas-fonts";

interface ExportTarget {
  key: string;
  label: string;
  width: number;
  height: number;
}

export interface ExportSourceSize {
  width: number;
  height: number;
}

/**
 * Pure math for fitting one artboard into another frame. Kept separate so it
 * can be unit tested without a DOM canvas.
 */
export function computeExportTransform(
  source: ExportSourceSize,
  target: { width: number; height: number },
): { ratio: number; offsetX: number; offsetY: number } {
  const ratio = Math.min(
    target.width / source.width,
    target.height / source.height,
  );
  const offsetX = (target.width - source.width * ratio) / 2;
  const offsetY = (target.height - source.height * ratio) / 2;
  return { ratio, offsetX, offsetY };
}

export const EXPORT_TARGETS: ExportTarget[] = [
  { key: "a4", label: "A4 Portrait", width: 800, height: 1100 },
  { key: "square", label: "Square", width: 1080, height: 1080 },
  { key: "wide", label: "Wide", width: 1920, height: 600 },
  { key: "story", label: "Story", width: 1080, height: 1920 },
  { key: "linkedin", label: "LinkedIn Banner", width: 1584, height: 396 },
];

export async function exportMultiFormatZip(
  canvasJson: unknown,
  projectName: string,
  selectedKeys: string[],
  sourceSize: ExportSourceSize,
) {
  const zip = new JSZip();
  const targets = EXPORT_TARGETS.filter((target) => selectedKeys.includes(target.key));

  // Webfonts must be resident before any text is painted, otherwise the
  // offscreen canvases silently render in a fallback face.
  await ensureCanvasFontsLoaded();

  const fabricModule = await import("fabric");
  const { StaticCanvas } = fabricModule;

  const sourceWidth = sourceSize.width;
  const sourceHeight = sourceSize.height;

  for (const target of targets) {
    const el = document.createElement("canvas");
    const offscreen = new StaticCanvas(el, {
      width: target.width,
      height: target.height,
      backgroundColor: "#ffffff",
    });

    await offscreen.loadFromJSON(canvasJson as never);
    offscreen.backgroundColor = "#ffffff";

    // Scale the whole artboard so it fits inside the target frame, then center
    // it. Scaling each object keeps text, strokes plus layout proportional.
    const { ratio, offsetX, offsetY } = computeExportTransform(
      { width: sourceWidth, height: sourceHeight },
      target,
    );

    for (const obj of offscreen.getObjects()) {
      obj.set({
        left: (obj.left || 0) * ratio + offsetX,
        top: (obj.top || 0) * ratio + offsetY,
        scaleX: (obj.scaleX || 1) * ratio,
        scaleY: (obj.scaleY || 1) * ratio,
      });
      obj.setCoords();
    }

    offscreen.renderAll();
    const data = offscreen.toDataURL({ format: "png", multiplier: 1 });
    const base64 = data.split(",")[1];
    zip.file(`${target.key}-${target.width}x${target.height}.png`, base64, {
      base64: true,
    });
    offscreen.dispose();
  }

  // Include design-tokens.json & React component export in ZIP
  zip.file("design-tokens.json", JSON.stringify(designTokens, null, 2));
  zip.file(
    "InfographicExport.tsx",
    generateInfographicReactComponent((canvasJson as Record<string, unknown>) || {})
  );

  const blob = await zip.generateAsync({ type: "blob" });
  const fileName = `readlyn-export-${projectName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.zip`;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
