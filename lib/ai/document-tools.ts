import { z } from "zod";
import type { InfographicData, InfographicElement } from "@/types/infographic";

export const CreateElementSchema = z.object({
  type: z.enum(["rect", "circle", "text", "stat", "icon", "line"]),
  element: z.record(z.string(), z.unknown()),
});

export const UpdateElementSchema = z.object({
  id: z.string(),
  patch: z.record(z.string(), z.unknown()),
});

export function createElement(document: InfographicData, element: InfographicElement): InfographicData {
  return {
    ...document,
    elements: [...document.elements, element].sort((a, b) => a.zIndex - b.zIndex),
  };
}

export function updateElement(document: InfographicData, id: string, patch: Partial<InfographicElement>): InfographicData {
  return {
    ...document,
    elements: document.elements.map((element) =>
      element.id === id ? ({ ...element, ...patch } as InfographicElement) : element,
    ),
  };
}

export function deleteElement(document: InfographicData, id: string): InfographicData {
  return {
    ...document,
    elements: document.elements.filter((element) => element.id !== id),
  };
}

export function moveElement(document: InfographicData, id: string, x: number, y: number): InfographicData {
  return updateElement(document, id, { x, y } as unknown as Partial<InfographicElement>);
}

export function duplicateElement(document: InfographicData, id: string): InfographicData {
  const source = document.elements.find((element) => element.id === id);
  if (!source) return document;
  const copy: InfographicElement = {
    ...source,
    id: `${source.id}-copy-${Date.now()}`,
    x: ((source as unknown as { x?: number }).x ?? 0) + 20,
    y: ((source as unknown as { y?: number }).y ?? 0) + 20,
  } as InfographicElement;
  return createElement(document, copy);
}

export function modifyStyles(document: InfographicData, id: string, styles: Record<string, unknown>): InfographicData {
  return updateElement(document, id, styles as Partial<InfographicElement>);
}

export function inspectDocument(document: InfographicData) {
  return {
    canvasWidth: document.canvasWidth,
    canvasHeight: document.canvasHeight,
    background: document.background,
    elementCount: document.elements.length,
    elements: document.elements.map((element) => ({
      id: element.id,
      type: element.type,
      zIndex: element.zIndex,
    })),
  };
}

export function exportDocument(document: InfographicData): string {
  return JSON.stringify(document, null, 2);
}
