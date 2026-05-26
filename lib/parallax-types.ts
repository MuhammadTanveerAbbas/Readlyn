"use client"

export interface ParallaxLayer {
  id: string
  label: string
  imageUrl: string
  depth: number
  offsetX: number
  offsetY: number
  scale: number
  opacity: number
  blendMode: BlendMode
  visible: boolean
}

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"

export type ViewportMode = "desktop" | "tablet" | "mobile"

export type EffectType = "parallax" | "zoom" | "fade" | "tilt"

export interface ParallaxConfig {
  layers: ParallaxLayer[]
  perspective: number
  scrollDuration: number
  effect: EffectType
  backgroundColor: string
}

export function createLayer(overrides?: Partial<ParallaxLayer>): ParallaxLayer {
  return {
    id: crypto.randomUUID(),
    label: "Layer",
    imageUrl: "",
    depth: 0.5,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    opacity: 1,
    blendMode: "normal",
    visible: true,
    ...overrides,
  }
}

export const DEFAULT_CONFIG: ParallaxConfig = {
  perspective: 1000,
  scrollDuration: 1.2,
  effect: "parallax",
  backgroundColor: "#080808",
  layers: [
    {
      id: "sky",
      label: "Sky Background",
      imageUrl: "/img/parallax/sky.svg",
      depth: 0.1,
      offsetX: 0,
      offsetY: 0,
      scale: 1.1,
      opacity: 1,
      blendMode: "normal",
      visible: true,
    },
    {
      id: "mountains-far",
      label: "Mountains Far",
      imageUrl: "/img/parallax/mountains-far.svg",
      depth: 0.3,
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      opacity: 1,
      blendMode: "normal",
      visible: true,
    },
    {
      id: "mountains-near",
      label: "Mountains Near",
      imageUrl: "/img/parallax/mountains-near.svg",
      depth: 0.6,
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      opacity: 1,
      blendMode: "normal",
      visible: true,
    },
    {
      id: "ground",
      label: "Foreground Ground",
      imageUrl: "/img/parallax/ground.svg",
      depth: 0.9,
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      opacity: 1,
      blendMode: "normal",
      visible: true,
    },
  ],
}

export const VIEWPORT_SIZES: Record<ViewportMode, string> = {
  desktop: "w-full h-full",
  tablet: "w-[768px] h-[600px] max-w-full max-h-full",
  mobile: "w-[390px] h-[700px] max-w-full max-h-full",
}

export const BLEND_MODES: { value: BlendMode; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "multiply", label: "Multiply" },
  { value: "screen", label: "Screen" },
  { value: "overlay", label: "Overlay" },
  { value: "darken", label: "Darken" },
  { value: "lighten", label: "Lighten" },
  { value: "color-dodge", label: "Color Dodge" },
  { value: "color-burn", label: "Color Burn" },
]

export const EFFECT_OPTIONS: { value: EffectType; label: string }[] = [
  { value: "parallax", label: "Parallax Scroll" },
  { value: "zoom", label: "Zoom on Scroll" },
  { value: "fade", label: "Fade on Scroll" },
  { value: "tilt", label: "Tilt on Hover" },
]
