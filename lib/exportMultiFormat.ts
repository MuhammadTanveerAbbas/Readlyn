"use client";

import JSZip from "jszip";

interface ExportTarget {
  key: string;
  label: string;
  width: number;
  height: number;
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
) {
  const zip = new JSZip();
  const targets = EXPORT_TARGETS.filter((target) => selectedKeys.includes(target.key));
  const fabricModule = await import("fabric");
  const { StaticCanvas } = fabricModule;

  for (const target of targets) {
    const el = document.createElement("canvas");
    const offscreen = new StaticCanvas(el, {
      width: target.width,
      height: target.height,
      backgroundColor: "#ffffff",
    });

    await offscreen.loadFromJSON(canvasJson as any);

    const sourceWidth = offscreen.width || target.width;
    const sourceHeight = offscreen.height || target.height;
    const scaleX = target.width / sourceWidth;
    const scaleY = target.height / sourceHeight;
    const ratio = Math.min(scaleX, scaleY);

    offscreen.getObjects().forEach((obj) => {
      obj.scaleX = (obj.scaleX || 1) * ratio;
      obj.scaleY = (obj.scaleY || 1) * ratio;
      obj.left = (obj.left || 0) * ratio;
      obj.top = (obj.top || 0) * ratio;
      obj.setCoords();
    });

    offscreen.setDimensions({ width: target.width, height: target.height });
    offscreen.renderAll();
    const data = offscreen.toDataURL({ format: "png", multiplier: 1 });
    const base64 = data.split(",")[1];
    zip.file(`${target.key}.png`, base64, { base64: true });
    offscreen.dispose();
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const fileName = `readlyn-export-${projectName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.zip`;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

