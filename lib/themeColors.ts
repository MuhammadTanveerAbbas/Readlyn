import { THEME_COLORS, type ThemePalette } from "@/types/infographic";

const SLOTS = ["primary", "secondary", "accent"] as const;

/** Map every palette color to the matching slot color of the target palette. */
export function buildColorMap(palette: ThemePalette): Map<string, string> {
  const map = new Map<string, string>();
  const target = THEME_COLORS[palette];
  for (const source of Object.values(THEME_COLORS)) {
    for (const slot of SLOTS) {
      const value = source[slot];
      if (value) map.set(value.toLowerCase(), target[slot]);
    }
  }
  return map;
}

/** Look up a remapped color. Returns null when the color is custom. */
export function remapColor(
  value: unknown,
  map: Map<string, string>,
): string | null {
  if (typeof value !== "string") return null;
  return map.get(value.toLowerCase()) ?? null;
}
