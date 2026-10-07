import * as fabric from "fabric";
import { type ThemePalette } from "@/types/infographic";
import { buildColorMap, remapColor } from "@/lib/themeColors";

/**
 * Recolor every element that already uses a palette color so the canvas matches
 * the chosen theme. Custom colors are left untouched, which keeps hand picked
 * artwork safe. Returns the number of recolored properties.
 */
export function applyAutoTheme(
  canvas: fabric.Canvas,
  palette: ThemePalette,
): number {
  const map = buildColorMap(palette);
  let changed = 0;

  const recolor = (obj: fabric.FabricObject): void => {
    const fill = remapColor((obj as { fill?: unknown }).fill, map);
    if (fill) {
      obj.set("fill", fill);
      changed += 1;
    }

    const stroke = remapColor((obj as { stroke?: unknown }).stroke, map);
    if (stroke) {
      obj.set("stroke", stroke);
      changed += 1;
    }

    if (obj.type === "group") {
      const group = obj as fabric.Group;
      for (const child of group.getObjects()) {
        recolor(child);
      }
      group.set("dirty", true);
    }
  };

  for (const obj of canvas.getObjects()) {
    recolor(obj);
  }

  canvas.requestRenderAll();
  return changed;
}
