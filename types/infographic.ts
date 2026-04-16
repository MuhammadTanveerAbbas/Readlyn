import { z } from 'zod'

export const RectSchema = z.object({
  type: z.literal('rect'),
  id: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  fill: z.string(),
  rx: z.number().default(0),
  opacity: z.number().default(1),
  stroke: z.string().nullable(),
  strokeWidth: z.number().nullable(),
  zIndex: z.number(),
})

export const CircleSchema = z.object({
  type: z.literal('circle'),
  id: z.string(),
  x: z.number(),
  y: z.number(),
  radius: z.number(),
  fill: z.string(),
  opacity: z.number().default(1),
  stroke: z.string().nullable(),
  strokeWidth: z.number().nullable(),
  zIndex: z.number(),
})

export const TextSchema = z.object({
  type: z.literal('text'),
  id: z.string(),
  x: z.number(),
  y: z.number(),
  text: z.string(),
  fontSize: z.number(),
  fontWeight: z.enum(['normal', 'bold', '900']),
  fontFamily: z.enum(['Arial', 'Georgia', 'Impact', 'Trebuchet MS', 'Courier New', 'Verdana']),
  fill: z.string(),
  textAlign: z.enum(['left', 'center', 'right']).default('left'),
  width: z.number(),
  opacity: z.number().default(1),
  zIndex: z.number(),
})

export const StatSchema = z.object({
  type: z.literal('stat'),
  id: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  value: z.string(),
  label: z.string(),
  valueFill: z.string(),
  labelFill: z.string(),
  bgFill: z.string(),
  rx: z.number().default(12),
  zIndex: z.number(),
})

export const IconSchema = z.object({
  type: z.literal('icon'),
  id: z.string(),
  x: z.number(),
  y: z.number(),
  emoji: z.string(),
  emojiSize: z.number(),
  bgFill: z.string(),
  bgRadius: z.number(),
  zIndex: z.number(),
})

export const LineSchema = z.object({
  type: z.literal('line'),
  id: z.string(),
  x1: z.number(),
  y1: z.number(),
  x2: z.number(),
  y2: z.number(),
  stroke: z.string(),
  strokeWidth: z.number(),
  dashed: z.boolean().default(false),
  zIndex: z.number(),
})

export const ElementSchema = z.discriminatedUnion('type', [
  RectSchema,
  CircleSchema,
  TextSchema,
  StatSchema,
  IconSchema,
  LineSchema,
])

export const InfographicSchema = z.object({
  canvasWidth: z.number(),
  canvasHeight: z.number(),
  background: z.string(),
  elements: z.array(ElementSchema),
})

export type InfographicElement = z.infer<typeof ElementSchema>
export type InfographicData = z.infer<typeof InfographicSchema>
export type RectElement = z.infer<typeof RectSchema>
export type CircleElement = z.infer<typeof CircleSchema>
export type TextElement = z.infer<typeof TextSchema>
export type StatElement = z.infer<typeof StatSchema>
export type IconElement = z.infer<typeof IconSchema>
export type LineElement = z.infer<typeof LineSchema>

export type ThemePalette = 'violet' | 'ocean' | 'ember' | 'forest' | 'slate'
export type CanvasSize = 'a4' | 'square' | 'wide'
export type StylePreset = 'auto' | 'steps' | 'stats' | 'timeline' | 'compare' | 'list' | 'pyramid' | 'funnel' | 'cycle'

export const CANVAS_SIZES: Record<CanvasSize, { width: number; height: number; label: string }> = {
  a4: { width: 800, height: 1100, label: 'A4 Portrait (800x1100)' },
  square: { width: 1080, height: 1080, label: 'Square (1080x1080)' },
  wide: { width: 1920, height: 600, label: 'Wide (1920x600)' },
}

export const THEME_COLORS: Record<ThemePalette, { primary: string; secondary: string; accent: string }> = {
  violet: { primary: '#7c3aed', secondary: '#4f46e5', accent: '#a855f7' },
  ocean: { primary: '#0284c7', secondary: '#0ea5e9', accent: '#38bdf8' },
  ember: { primary: '#ea580c', secondary: '#f97316', accent: '#fb923c' },
  forest: { primary: '#15803d', secondary: '#16a34a', accent: '#4ade80' },
  slate: { primary: '#475569', secondary: '#64748b', accent: '#94a3b8' },
}

export const FONT_FAMILIES = ['Arial', 'Georgia', 'Impact', 'Trebuchet MS', 'Courier New', 'Verdana'] as const
export type FontFamily = (typeof FONT_FAMILIES)[number]
