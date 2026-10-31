/**
 * Generate a simple React component from a Fabric.js canvas JSON document.
 * This is a best-effort, dependency-free export for the multi-format ZIP.
 */
export function generateInfographicReactComponent(canvasJson: Record<string, unknown>): string {
  const width = Number(canvasJson?.width ?? 800);
  const height = Number(canvasJson?.height ?? 1100);
  const objects = Array.isArray(canvasJson?.objects) ? canvasJson.objects : [];

  const jsx = objects
    .map((raw: any, index: number) => {
      const type = String(raw?.type ?? "rect");
      const left = Number(raw?.left ?? 0);
      const top = Number(raw?.top ?? 0);
      const scaleX = Number(raw?.scaleX ?? 1);
      const scaleY = Number(raw?.scaleY ?? 1);
      const w = Number(raw?.width ?? 0) * scaleX;
      const h = Number(raw?.height ?? 0) * scaleY;
      const fill = typeof raw?.fill === "string" ? raw.fill : "#111113";
      const opacity = Number(raw?.opacity ?? 1);
      const radius = Number(raw?.rx ?? raw?.ry ?? 0);

      if (type === "text" || type === "i-text" || type === "textbox") {
        const text = String(raw?.text ?? "").replace(/</g, "&lt;");
        const fontSize = Number(raw?.fontSize ?? 16);
        return `<div key="${index}" style={{ position: "absolute", left: ${left}, top: ${top}, fontSize: ${fontSize}, color: "${fill}", opacity: ${opacity} }}>${text}</div>`;
      }

      if (type === "circle") {
        const r = Number(raw?.radius ?? 0) * scaleX;
        return `<div key="${index}" style={{ position: "absolute", left: ${left - r}, top: ${top - r}, width: ${r * 2}, height: ${r * 2}, borderRadius: "50%", backgroundColor: "${fill}", opacity: ${opacity} }} />`;
      }

      if (type === "line") {
        return `<div key="${index}" style={{ position: "absolute", left: ${left}, top: ${top}, width: ${w || 1}, height: 1, backgroundColor: "${fill}", opacity: ${opacity} }} />`;
      }

      return `<div key="${index}" style={{ position: "absolute", left: ${left}, top: ${top}, width: ${w}, height: ${h}, backgroundColor: "${fill}", borderRadius: ${radius}, opacity: ${opacity} }} />`;
    })
    .join("\n      ");

  return `import React from "react";

export default function InfographicExport() {
  return (
    <div style={{ position: "relative", width: ${width}, height: ${height}, overflow: "hidden" }}>
      ${jsx}
    </div>
  );
}
`;
}