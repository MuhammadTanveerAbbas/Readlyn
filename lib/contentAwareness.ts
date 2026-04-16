import type { Canvas } from "fabric";

export interface ReadabilityItem {
  id: string;
  label: string;
  grade: "A" | "B" | "C" | "D";
}

export interface OverflowItem {
  id: string;
  label: string;
  warning: string;
}

export function calcReadabilityGrade(text: string): "A" | "B" | "C" | "D" {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const avgWordLength =
    words.length === 0
      ? 0
      : words.reduce((sum, word) => sum + word.length, 0) / words.length;
  if (avgWordLength < 4.8) return "A";
  if (avgWordLength < 5.8) return "B";
  if (avgWordLength < 6.8) return "C";
  return "D";
}

export function getCanvasTextAudit(canvas: Canvas | null): {
  readability: ReadabilityItem[];
  overflow: OverflowItem[];
  textBlocks: { id: string; text: string; label: string }[];
} {
  if (!canvas) return { readability: [], overflow: [], textBlocks: [] };

  const readability: ReadabilityItem[] = [];
  const overflow: OverflowItem[] = [];
  const textBlocks: { id: string; text: string; label: string }[] = [];

  canvas.getObjects().forEach((obj, idx) => {
    if (obj.type !== "text" && obj.type !== "i-text") return;
    const textObj = obj as unknown as {
      text?: string;
      width?: number;
      textLines?: string[];
      height?: number;
      _elementId?: string;
      _elementType?: string;
    };
    const id = textObj._elementId || `text-${idx}`;
    const text = textObj.text || "";
    const label = `${textObj._elementType || "text"} ${idx + 1}`;
    const grade = calcReadabilityGrade(text);
    readability.push({ id, label, grade });
    textBlocks.push({ id, text, label });

    const lines = textObj.textLines?.length ?? 0;
    const height = textObj.height ?? 0;
    const width = textObj.width ?? 0;
    if ((lines > 4 && height < 90) || (text.length > 180 && width < 220)) {
      overflow.push({ id, label, warning: "Text may overflow box" });
    }
  });

  return { readability, overflow, textBlocks };
}

