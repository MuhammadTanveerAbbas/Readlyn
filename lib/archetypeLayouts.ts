// lib/archetypeLayouts.ts
// Pre-computes EXACT pixel positions for every element slot in every archetype.
// AI only fills in: text content, colors, emoji. Never positions.

export interface SlotPosition {
  id: string;
  type: "rect" | "circle" | "line" | "text_slot" | "icon_slot" | "stat_slot";
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  rx?: number;
  role: string;
  zIndexHint: number;
}

export function computeLayout(
  style: string,
  canvasW: number,
  canvasH: number,
): SlotPosition[] {
  switch (style) {
    case "steps":
      return computeSteps(canvasW, canvasH);
    case "stats":
      return computeStats(canvasW, canvasH);
    case "timeline":
      return computeTimeline(canvasW, canvasH);
    case "compare":
      return computeCompare(canvasW, canvasH);
    case "list":
      return computeList(canvasW, canvasH);
    case "pyramid":
      return computePyramid(canvasW, canvasH);
    case "funnel":
      return computeFunnel(canvasW, canvasH);
    case "cycle":
      return computeCycle(canvasW, canvasH);
    default:
      return []; // auto  AI decides
  }
}

// ─────────────────────────────────────────────────────────
// STEPS  Zigzag spine with alternating left/right content
// ─────────────────────────────────────────────────────────
function computeSteps(W: number, H: number): SlotPosition[] {
  const slots: SlotPosition[] = [];
  const STEPS = 5;
  const SPINE_X = 80;
  const START_Y = 190;
  const STEP_H = 145;
  const CARD_W = 440;
  const ICON_R = 36;

  // Full background
  slots.push({
    id: "bg",
    type: "rect",
    x: 0,
    y: 0,
    width: W,
    height: H,
    role: "canvas-background",
    zIndexHint: 0,
  });
  // Header band
  slots.push({
    id: "header-band",
    type: "rect",
    x: 0,
    y: 0,
    width: W,
    height: 175,
    role: "header-background",
    zIndexHint: 6,
    rx: 0,
  });
  // Header title slots
  slots.push({
    id: "header-label",
    type: "text_slot",
    x: 40,
    y: 48,
    width: W - 80,
    role: "header-topic-label",
    zIndexHint: 72,
  });
  slots.push({
    id: "header-title-1",
    type: "text_slot",
    x: 40,
    y: 70,
    width: 340,
    role: "title-word-1",
    zIndexHint: 86,
  });
  slots.push({
    id: "header-title-2-bg",
    type: "rect",
    x: 385,
    y: 65,
    width: 260,
    height: 72,
    rx: 6,
    role: "title-word-2-highlight-rect",
    zIndexHint: 85,
  });
  slots.push({
    id: "header-title-2",
    type: "text_slot",
    x: 390,
    y: 70,
    width: 250,
    role: "title-word-2",
    zIndexHint: 86,
  });
  slots.push({
    id: "header-subtitle",
    type: "text_slot",
    x: 40,
    y: 148,
    width: W - 80,
    role: "header-subtitle",
    zIndexHint: 72,
  });

  // Spine line
  slots.push({
    id: "spine-line",
    type: "line",
    x1: SPINE_X,
    y1: 185,
    x2: SPINE_X,
    y2: H - 110,
    role: "vertical-spine-connector",
    zIndexHint: 16,
  });

  for (let i = 0; i < STEPS; i++) {
    const baseY = START_Y + i * STEP_H;
    const finalCardX = SPINE_X + 32;
    const finalIconX = SPINE_X + CARD_W + 56;

    // Spine junction dot
    slots.push({
      id: `step-${i + 1}-spine-dot`,
      type: "circle",
      x: SPINE_X,
      y: baseY + 55,
      radius: 10,
      role: "spine-junction-dot",
      zIndexHint: 18,
    });
    // Step number badge
    slots.push({
      id: `step-${i + 1}-badge`,
      type: "circle",
      x: SPINE_X,
      y: baseY + 14,
      radius: 24,
      role: "step-number-badge-circle",
      zIndexHint: 28,
    });
    slots.push({
      id: `step-${i + 1}-badge-text`,
      type: "text_slot",
      x: SPINE_X - 14,
      y: baseY + 4,
      width: 28,
      role: "step-number-text",
      zIndexHint: 52,
    });
    // Horizontal connector
    slots.push({
      id: `step-${i + 1}-connector`,
      type: "line",
      x1: SPINE_X + 10,
      y1: baseY + 38,
      x2: finalCardX,
      y2: baseY + 38,
      role: "step-connector-line",
      zIndexHint: 17,
    });
    // Content card bg
    slots.push({
      id: `step-${i + 1}-card`,
      type: "rect",
      x: finalCardX,
      y: baseY,
      width: CARD_W,
      height: 118,
      rx: 10,
      role: "step-content-card",
      zIndexHint: 20,
    });
    // Step heading
    slots.push({
      id: `step-${i + 1}-heading`,
      type: "text_slot",
      x: finalCardX + 16,
      y: baseY + 14,
      width: CARD_W - 32,
      role: "step-heading",
      zIndexHint: 62,
    });
    // Step body
    slots.push({
      id: `step-${i + 1}-body`,
      type: "text_slot",
      x: finalCardX + 16,
      y: baseY + 48,
      width: CARD_W - 32,
      role: "step-body-text",
      zIndexHint: 55,
    });
    // Icon
    slots.push({
      id: `step-${i + 1}-icon-bg`,
      type: "circle",
      x: finalIconX,
      y: baseY + 22,
      radius: ICON_R,
      role: "step-icon-background",
      zIndexHint: 30,
    });
    slots.push({
      id: `step-${i + 1}-icon-emoji`,
      type: "text_slot",
      x: finalIconX - ICON_R + 8,
      y: baseY + 10,
      width: ICON_R * 2 - 16,
      role: "step-icon-emoji",
      zIndexHint: 42,
    });
  }

  // Footer
  slots.push({
    id: "footer-band",
    type: "rect",
    x: 0,
    y: H - 105,
    width: W,
    height: 105,
    role: "footer-background",
    zIndexHint: 7,
  });
  slots.push({
    id: "footer-text",
    type: "text_slot",
    x: 40,
    y: H - 72,
    width: W - 80,
    role: "footer-cta-text",
    zIndexHint: 72,
  });

  return slots;
}

// ─────────────────────────────────────────────────────────
// STATS  Bento grid with hero stat and varied cell sizes
// ─────────────────────────────────────────────────────────
function computeStats(W: number, H: number): SlotPosition[] {
  const slots: SlotPosition[] = [];
  const GRID_GAP = 12;

  // Background
  slots.push({
    id: "bg",
    type: "rect",
    x: 0,
    y: 0,
    width: W,
    height: H,
    role: "canvas-background",
    zIndexHint: 0,
  });

  // Header
  slots.push({
    id: "header-band",
    type: "rect",
    x: 0,
    y: 0,
    width: W,
    height: 160,
    role: "header-background",
    zIndexHint: 6,
  });
  slots.push({
    id: "header-label",
    type: "text_slot",
    x: 40,
    y: 35,
    width: W - 80,
    role: "header-topic-label",
    zIndexHint: 72,
  });
  slots.push({
    id: "header-title-1",
    type: "text_slot",
    x: 40,
    y: 62,
    width: 340,
    role: "title-word-1",
    zIndexHint: 86,
  });
  slots.push({
    id: "header-title-2-bg",
    type: "rect",
    x: 385,
    y: 57,
    width: 260,
    height: 66,
    rx: 6,
    role: "title-word-2-highlight-rect",
    zIndexHint: 85,
  });
  slots.push({
    id: "header-title-2",
    type: "text_slot",
    x: 390,
    y: 62,
    width: 250,
    role: "title-word-2",
    zIndexHint: 86,
  });
  slots.push({
    id: "header-subtitle",
    type: "text_slot",
    x: 40,
    y: 130,
    width: W - 80,
    role: "header-subtitle",
    zIndexHint: 72,
  });

  // Grid layout: hero stat (full width) + 3x smaller stats below
  const gridX = 40;
  const gridY = 180;
  const cellW = (W - 80 - 2 * GRID_GAP) / 3;
  const smallH = 110;
  const heroH = 130;

  // Hero stat (full width)
  slots.push({
    id: "stat-hero-bg",
    type: "rect",
    x: gridX,
    y: gridY,
    width: W - 80,
    height: heroH,
    rx: 12,
    role: "stat-hero-background",
    zIndexHint: 20,
  });
  slots.push({
    id: "stat-hero",
    type: "stat_slot",
    x: gridX,
    y: gridY,
    width: W - 80,
    height: heroH,
    role: "stat-hero-block",
    zIndexHint: 32,
  });

  // 3 stats below
  for (let i = 0; i < 3; i++) {
    const sx = gridX + i * (cellW + GRID_GAP);
    const sy = gridY + heroH + GRID_GAP;
    slots.push({
      id: `stat-${i + 1}-bg`,
      type: "rect",
      x: sx,
      y: sy,
      width: cellW,
      height: smallH,
      rx: 10,
      role: `stat-block-${i + 1}-background`,
      zIndexHint: 20,
    });
    slots.push({
      id: `stat-${i + 1}`,
      type: "stat_slot",
      x: sx,
      y: sy,
      width: cellW,
      height: smallH,
      role: `stat-block-${i + 1}`,
      zIndexHint: 32,
    });
  }

  // Footer
  slots.push({
    id: "footer-band",
    type: "rect",
    x: 0,
    y: H - 100,
    width: W,
    height: 100,
    role: "footer-background",
    zIndexHint: 7,
  });
  slots.push({
    id: "footer-text",
    type: "text_slot",
    x: 40,
    y: H - 66,
    width: W - 80,
    role: "footer-cta-text",
    zIndexHint: 72,
  });

  return slots;
}

// ─────────────────────────────────────────────────────────
// TIMELINE  Horizontal timeline with left/right alternating nodes
// ─────────────────────────────────────────────────────────
function computeTimeline(W: number, H: number): SlotPosition[] {
  const slots: SlotPosition[] = [];
  const EVENTS = 5;
  const SPINE_Y = 380;
  const EVENT_SPACING = (W - 80) / EVENTS;
  const CARD_H = 120;
  const NODE_R = 20;

  // Background
  slots.push({
    id: "bg",
    type: "rect",
    x: 0,
    y: 0,
    width: W,
    height: H,
    role: "canvas-background",
    zIndexHint: 0,
  });

  // Header
  slots.push({
    id: "header-band",
    type: "rect",
    x: 0,
    y: 0,
    width: W,
    height: 160,
    role: "header-background",
    zIndexHint: 6,
  });
  slots.push({
    id: "header-label",
    type: "text_slot",
    x: 40,
    y: 32,
    width: W - 80,
    role: "header-topic-label",
    zIndexHint: 72,
  });
  slots.push({
    id: "header-title-1",
    type: "text_slot",
    x: 40,
    y: 58,
    width: 280,
    role: "title-word-1",
    zIndexHint: 86,
  });
  slots.push({
    id: "header-title-2-bg",
    type: "rect",
    x: 324,
    y: 54,
    width: 240,
    height: 66,
    rx: 6,
    role: "title-word-2-highlight-rect",
    zIndexHint: 85,
  });
  slots.push({
    id: "header-title-2",
    type: "text_slot",
    x: 328,
    y: 58,
    width: 232,
    role: "title-word-2",
    zIndexHint: 86,
  });
  slots.push({
    id: "header-subtitle",
    type: "text_slot",
    x: 40,
    y: 126,
    width: W - 80,
    role: "header-subtitle",
    zIndexHint: 72,
  });

  // Horizontal spine line
  slots.push({
    id: "spine-line",
    type: "line",
    x1: 40,
    y1: SPINE_Y,
    x2: W - 40,
    y2: SPINE_Y,
    role: "horizontal-spine",
    zIndexHint: 16,
  });

  for (let i = 0; i < EVENTS; i++) {
    const isTop = i % 2 === 0;
    const cx = 40 + (i + 0.5) * EVENT_SPACING;
    const cy = SPINE_Y;

    // Connector dot on spine
    slots.push({
      id: `event-${i + 1}-dot`,
      type: "circle",
      x: cx,
      y: cy,
      radius: NODE_R,
      role: "timeline-node-dot",
      zIndexHint: 28,
    });
    slots.push({
      id: `event-${i + 1}-date`,
      type: "text_slot",
      x: cx - 30,
      y: cy - NODE_R - 26,
      width: 60,
      role: "timeline-date-label",
      zIndexHint: 62,
    });

    // Card above or below spine
    const cardY = isTop ? cy - CARD_H - 32 : cy + 32;
    slots.push({
      id: `event-${i + 1}-card`,
      type: "rect",
      x: cx - EVENT_SPACING / 2 + 12,
      y: cardY,
      width: EVENT_SPACING - 24,
      height: CARD_H,
      rx: 8,
      role: `timeline-card-${i + 1}`,
      zIndexHint: 20,
    });
    slots.push({
      id: `event-${i + 1}-heading`,
      type: "text_slot",
      x: cx - EVENT_SPACING / 2 + 20,
      y: cardY + 12,
      width: EVENT_SPACING - 40,
      role: `timeline-heading-${i + 1}`,
      zIndexHint: 62,
    });
    slots.push({
      id: `event-${i + 1}-body`,
      type: "text_slot",
      x: cx - EVENT_SPACING / 2 + 20,
      y: cardY + 42,
      width: EVENT_SPACING - 40,
      role: `timeline-body-${i + 1}`,
      zIndexHint: 55,
    });
  }

  // Footer
  slots.push({
    id: "footer-band",
    type: "rect",
    x: 0,
    y: H - 100,
    width: W,
    height: 100,
    role: "footer-background",
    zIndexHint: 7,
  });
  slots.push({
    id: "footer-text",
    type: "text_slot",
    x: 40,
    y: H - 66,
    width: W - 80,
    role: "footer-cta-text",
    zIndexHint: 72,
  });

  return slots;
}

// ─────────────────────────────────────────────────────────
// COMPARE  Left/right split with VS badge in center
// ─────────────────────────────────────────────────────────
function computeCompare(W: number, H: number): SlotPosition[] {
  const slots: SlotPosition[] = [];
  const DIVIDER_X = W / 2;

  // Background
  slots.push({
    id: "bg",
    type: "rect",
    x: 0,
    y: 0,
    width: W,
    height: H,
    role: "canvas-background",
    zIndexHint: 0,
  });

  // Header
  slots.push({
    id: "header-band",
    type: "rect",
    x: 0,
    y: 0,
    width: W,
    height: 160,
    role: "header-background",
    zIndexHint: 6,
  });
  slots.push({
    id: "header-label",
    type: "text_slot",
    x: 40,
    y: 32,
    width: W - 80,
    role: "header-topic-label",
    zIndexHint: 72,
  });
  slots.push({
    id: "header-title-1",
    type: "text_slot",
    x: 40,
    y: 58,
    width: 280,
    role: "title-word-1",
    zIndexHint: 86,
  });
  slots.push({
    id: "header-title-2-bg",
    type: "rect",
    x: 324,
    y: 54,
    width: 240,
    height: 66,
    rx: 6,
    role: "title-word-2-highlight-rect",
    zIndexHint: 85,
  });
  slots.push({
    id: "header-title-2",
    type: "text_slot",
    x: 328,
    y: 58,
    width: 232,
    role: "title-word-2",
    zIndexHint: 86,
  });
  slots.push({
    id: "header-subtitle",
    type: "text_slot",
    x: 40,
    y: 126,
    width: W - 80,
    role: "header-subtitle",
    zIndexHint: 72,
  });

  // Center divider line
  slots.push({
    id: "divider-line",
    type: "line",
    x1: DIVIDER_X,
    y1: 160,
    x2: DIVIDER_X,
    y2: H - 100,
    role: "center-divider",
    zIndexHint: 16,
  });

  // VS badge
  slots.push({
    id: "vs-badge",
    type: "circle",
    x: DIVIDER_X,
    y: 300,
    radius: 28,
    role: "vs-badge-circle",
    zIndexHint: 30,
  });
  slots.push({
    id: "vs-text",
    type: "text_slot",
    x: DIVIDER_X - 18,
    y: 287,
    width: 36,
    role: "vs-badge-text",
    zIndexHint: 52,
  });

  // Left side (3 comparison points)
  for (let i = 0; i < 3; i++) {
    const cy = 200 + i * 130;
    slots.push({
      id: `left-${i + 1}-label`,
      type: "text_slot",
      x: 40,
      y: cy,
      width: W / 2 - 60,
      role: `comparison-left-${i + 1}-label`,
      zIndexHint: 62,
    });
    slots.push({
      id: `left-${i + 1}-body`,
      type: "text_slot",
      x: 40,
      y: cy + 28,
      width: W / 2 - 60,
      role: `comparison-left-${i + 1}-body`,
      zIndexHint: 55,
    });
  }

  // Right side (3 comparison points)
  for (let i = 0; i < 3; i++) {
    const cy = 200 + i * 130;
    slots.push({
      id: `right-${i + 1}-label`,
      type: "text_slot",
      x: DIVIDER_X + 20,
      y: cy,
      width: W / 2 - 60,
      role: `comparison-right-${i + 1}-label`,
      zIndexHint: 62,
    });
    slots.push({
      id: `right-${i + 1}-body`,
      type: "text_slot",
      x: DIVIDER_X + 20,
      y: cy + 28,
      width: W / 2 - 60,
      role: `comparison-right-${i + 1}-body`,
      zIndexHint: 55,
    });
  }

  // Footer
  slots.push({
    id: "footer-band",
    type: "rect",
    x: 0,
    y: H - 100,
    width: W,
    height: 100,
    role: "footer-background",
    zIndexHint: 7,
  });
  slots.push({
    id: "footer-text",
    type: "text_slot",
    x: 40,
    y: H - 66,
    width: W - 80,
    role: "footer-cta-text",
    zIndexHint: 72,
  });

  return slots;
}

// ─────────────────────────────────────────────────────────
// LIST  Icon + text cards with left accent bar
// ─────────────────────────────────────────────────────────
function computeList(W: number, H: number): SlotPosition[] {
  const slots: SlotPosition[] = [];
  const ITEMS = 5;
  const ITEM_H = 100;
  const ITEM_GAP = 12;

  // Background
  slots.push({
    id: "bg",
    type: "rect",
    x: 0,
    y: 0,
    width: W,
    height: H,
    role: "canvas-background",
    zIndexHint: 0,
  });

  // Header
  slots.push({
    id: "header-band",
    type: "rect",
    x: 0,
    y: 0,
    width: W,
    height: 160,
    role: "header-background",
    zIndexHint: 6,
  });
  slots.push({
    id: "header-label",
    type: "text_slot",
    x: 40,
    y: 32,
    width: W - 80,
    role: "header-topic-label",
    zIndexHint: 72,
  });
  slots.push({
    id: "header-title-1",
    type: "text_slot",
    x: 40,
    y: 58,
    width: 300,
    role: "title-word-1",
    zIndexHint: 86,
  });
  slots.push({
    id: "header-title-2-bg",
    type: "rect",
    x: 344,
    y: 54,
    width: 240,
    height: 66,
    rx: 6,
    role: "title-word-2-highlight-rect",
    zIndexHint: 85,
  });
  slots.push({
    id: "header-title-2",
    type: "text_slot",
    x: 348,
    y: 58,
    width: 232,
    role: "title-word-2",
    zIndexHint: 86,
  });
  slots.push({
    id: "header-subtitle",
    type: "text_slot",
    x: 40,
    y: 126,
    width: W - 80,
    role: "header-subtitle",
    zIndexHint: 72,
  });

  for (let i = 0; i < ITEMS; i++) {
    const itemY = 180 + i * (ITEM_H + ITEM_GAP);

    // Left accent bar
    slots.push({
      id: `item-${i + 1}-accent`,
      type: "rect",
      x: 40,
      y: itemY,
      width: 6,
      height: ITEM_H,
      rx: 3,
      role: `list-item-accent-bar`,
      zIndexHint: 19,
    });

    // Icon
    slots.push({
      id: `item-${i + 1}-icon`,
      type: "circle",
      x: 60,
      y: itemY + 12,
      radius: 24,
      role: `list-item-${i + 1}-icon-bg`,
      zIndexHint: 28,
    });
    slots.push({
      id: `item-${i + 1}-emoji`,
      type: "text_slot",
      x: 48,
      y: itemY + 4,
      width: 48,
      role: `list-item-${i + 1}-emoji`,
      zIndexHint: 42,
    });

    // Text
    slots.push({
      id: `item-${i + 1}-heading`,
      type: "text_slot",
      x: 100,
      y: itemY + 8,
      width: W - 140,
      role: `list-item-${i + 1}-heading`,
      zIndexHint: 62,
    });
    slots.push({
      id: `item-${i + 1}-body`,
      type: "text_slot",
      x: 100,
      y: itemY + 38,
      width: W - 140,
      role: `list-item-${i + 1}-body`,
      zIndexHint: 55,
    });
  }

  // Footer
  slots.push({
    id: "footer-band",
    type: "rect",
    x: 0,
    y: H - 100,
    width: W,
    height: 100,
    role: "footer-background",
    zIndexHint: 7,
  });
  slots.push({
    id: "footer-text",
    type: "text_slot",
    x: 40,
    y: H - 66,
    width: W - 80,
    role: "footer-cta-text",
    zIndexHint: 72,
  });

  return slots;
}

// ─────────────────────────────────────────────────────────
// PYRAMID  Pre-computed trapezoid layers centered
// ─────────────────────────────────────────────────────────
function computePyramid(W: number, H: number): SlotPosition[] {
  const slots: SlotPosition[] = [];
  const LAYERS = 5;
  const PYRAMID_TOP_Y = 165;
  const LAYER_H = 78;
  const LAYER_GAP = 4;
  const MIN_W = 130;
  const MAX_W = W - 64;
  const ANNOT_Y_OFFSET = 24;

  slots.push({
    id: "bg",
    type: "rect",
    x: 0,
    y: 0,
    width: W,
    height: H,
    role: "canvas-background",
    zIndexHint: 0,
  });
  slots.push({
    id: "deco-tr",
    type: "circle",
    x: W + 60,
    y: -60,
    radius: 170,
    role: "decorative-depth-circle",
    zIndexHint: 2,
  });
  slots.push({
    id: "deco-bl",
    type: "circle",
    x: -50,
    y: H - 80,
    radius: 150,
    role: "decorative-depth-circle",
    zIndexHint: 2,
  });

  // Header
  slots.push({
    id: "header-band",
    type: "rect",
    x: 0,
    y: 0,
    width: W,
    height: 148,
    role: "header-background",
    zIndexHint: 6,
  });
  slots.push({
    id: "header-label",
    type: "text_slot",
    x: 40,
    y: 30,
    width: W - 80,
    role: "header-topic-label",
    zIndexHint: 72,
  });
  slots.push({
    id: "header-title-1",
    type: "text_slot",
    x: 40,
    y: 55,
    width: 280,
    role: "title-word-1",
    zIndexHint: 86,
  });
  slots.push({
    id: "header-title-2-bg",
    type: "rect",
    x: 322,
    y: 50,
    width: 230,
    height: 62,
    rx: 6,
    role: "title-word-2-highlight-rect",
    zIndexHint: 85,
  });
  slots.push({
    id: "header-title-2",
    type: "text_slot",
    x: 326,
    y: 55,
    width: 222,
    role: "title-word-2",
    zIndexHint: 86,
  });
  slots.push({
    id: "header-subtitle",
    type: "text_slot",
    x: 40,
    y: 120,
    width: W - 80,
    role: "header-subtitle",
    zIndexHint: 72,
  });

  // Pyramid tip icon
  slots.push({
    id: "pyramid-tip-icon",
    type: "circle",
    x: W / 2,
    y: PYRAMID_TOP_Y - 28,
    radius: 22,
    role: "pyramid-apex-icon-bg",
    zIndexHint: 30,
  });

  for (let i = 0; i < LAYERS; i++) {
    const t = i / (LAYERS - 1);
    const layerW = Math.round(MIN_W + t * (MAX_W - MIN_W));
    const layerX = Math.round((W - layerW) / 2);
    const layerY = PYRAMID_TOP_Y + i * (LAYER_H + LAYER_GAP);

    // Main layer rect
    slots.push({
      id: `layer-${i}-rect`,
      type: "rect",
      x: layerX,
      y: layerY,
      width: layerW,
      height: LAYER_H,
      rx: 4,
      role: `pyramid-layer-${i}`,
      zIndexHint: 20,
    });
    // Layer label
    slots.push({
      id: `layer-${i}-label`,
      type: "text_slot",
      x: layerX + 16,
      y: layerY + ANNOT_Y_OFFSET,
      width: layerW - 32,
      role: `pyramid-layer-${i}-label`,
      zIndexHint: 62,
    });

    // Annotation
    const isRight = i % 2 === 0;
    if (isRight) {
      const annotX = layerX + layerW + 8;
      slots.push({
        id: `layer-${i}-annot-line`,
        type: "line",
        x1: layerX + layerW,
        y1: layerY + LAYER_H / 2,
        x2: Math.min(annotX + 90, W - 20),
        y2: layerY + LAYER_H / 2,
        role: "pyramid-annotation-line",
        zIndexHint: 17,
      });
      slots.push({
        id: `layer-${i}-annot-text`,
        type: "text_slot",
        x: annotX,
        y: layerY + LAYER_H / 2 - 20,
        width: W - annotX - 16,
        role: "pyramid-annotation-text",
        zIndexHint: 58,
      });
    } else {
      const annotEndX = layerX - 8;
      const annotStartX = Math.max(16, annotEndX - 90);
      slots.push({
        id: `layer-${i}-annot-line`,
        type: "line",
        x1: annotEndX,
        y1: layerY + LAYER_H / 2,
        x2: layerX,
        y2: layerY + LAYER_H / 2,
        role: "pyramid-annotation-line",
        zIndexHint: 17,
      });
      slots.push({
        id: `layer-${i}-annot-text`,
        type: "text_slot",
        x: annotStartX,
        y: layerY + LAYER_H / 2 - 20,
        width: annotEndX - annotStartX,
        role: "pyramid-annotation-text",
        zIndexHint: 58,
      });
    }
  }

  // Footer
  slots.push({
    id: "footer-band",
    type: "rect",
    x: 0,
    y: H - 100,
    width: W,
    height: 100,
    role: "footer-background",
    zIndexHint: 7,
  });
  slots.push({
    id: "footer-text",
    type: "text_slot",
    x: 40,
    y: H - 66,
    width: W - 80,
    role: "footer-cta-text",
    zIndexHint: 72,
  });

  return slots;
}

// ─────────────────────────────────────────────────────────
// FUNNEL  Pre-computed narrowing trapezoid stages
// ─────────────────────────────────────────────────────────
function computeFunnel(W: number, H: number): SlotPosition[] {
  const slots: SlotPosition[] = [];
  const STAGES = 5;
  const START_Y = 165;
  const STAGE_H = 88;
  const STAGE_GAP = 6;
  const TOP_W = W - 64;
  const SHRINK = 110;
  const ANNOT_LINE_LEN = 72;

  slots.push({
    id: "bg",
    type: "rect",
    x: 0,
    y: 0,
    width: W,
    height: H,
    role: "canvas-background",
    zIndexHint: 0,
  });
  slots.push({
    id: "deco-tr",
    type: "circle",
    x: W + 70,
    y: -70,
    radius: 180,
    role: "decorative-depth-circle",
    zIndexHint: 2,
  });
  slots.push({
    id: "deco-bl",
    type: "circle",
    x: -50,
    y: H - 100,
    radius: 155,
    role: "decorative-depth-circle",
    zIndexHint: 2,
  });

  // Funnel outline lines
  const leftTopX = (W - TOP_W) / 2;
  slots.push({
    id: "funnel-left-edge",
    type: "line",
    x1: leftTopX,
    y1: START_Y,
    x2: leftTopX + 50,
    y2: START_Y + STAGES * (STAGE_H + STAGE_GAP),
    role: "funnel-silhouette-left",
    zIndexHint: 16,
  });
  slots.push({
    id: "funnel-right-edge",
    type: "line",
    x1: W - leftTopX,
    y1: START_Y,
    x2: W - leftTopX - 50,
    y2: START_Y + STAGES * (STAGE_H + STAGE_GAP),
    role: "funnel-silhouette-right",
    zIndexHint: 16,
  });

  // Header
  slots.push({
    id: "header-band",
    type: "rect",
    x: 0,
    y: 0,
    width: W,
    height: 148,
    role: "header-background",
    zIndexHint: 6,
  });
  slots.push({
    id: "header-label",
    type: "text_slot",
    x: 40,
    y: 30,
    width: W - 80,
    role: "header-topic-label",
    zIndexHint: 72,
  });
  slots.push({
    id: "header-title-1",
    type: "text_slot",
    x: 40,
    y: 55,
    width: 260,
    role: "title-word-1",
    zIndexHint: 86,
  });
  slots.push({
    id: "header-title-2-bg",
    type: "rect",
    x: 302,
    y: 50,
    width: 240,
    height: 62,
    rx: 6,
    role: "title-word-2-highlight-rect",
    zIndexHint: 85,
  });
  slots.push({
    id: "header-title-2",
    type: "text_slot",
    x: 306,
    y: 55,
    width: 232,
    role: "title-word-2",
    zIndexHint: 86,
  });
  slots.push({
    id: "header-subtitle",
    type: "text_slot",
    x: 40,
    y: 122,
    width: W - 80,
    role: "header-subtitle",
    zIndexHint: 72,
  });

  for (let i = 0; i < STAGES; i++) {
    const shrinkPerSide = Math.round((i * SHRINK) / (STAGES - 1));
    const stageW = TOP_W - shrinkPerSide * 2;
    const stageX = Math.round((W - stageW) / 2);
    const stageY = START_Y + i * (STAGE_H + STAGE_GAP);
    const isLast = i === STAGES - 1;

    // Stage rect
    slots.push({
      id: `stage-${i + 1}-rect`,
      type: "rect",
      x: stageX,
      y: stageY,
      width: stageW,
      height: STAGE_H,
      rx: isLast ? 12 : 6,
      role: `funnel-stage-${i + 1}`,
      zIndexHint: 20,
    });
    // Stage number badge
    slots.push({
      id: `stage-${i + 1}-badge`,
      type: "circle",
      x: stageX + 30,
      y: stageY + STAGE_H / 2,
      radius: 20,
      role: "stage-number-badge",
      zIndexHint: 30,
    });
    slots.push({
      id: `stage-${i + 1}-num`,
      type: "text_slot",
      x: stageX + 18,
      y: stageY + STAGE_H / 2 - 14,
      width: 24,
      role: "stage-number",
      zIndexHint: 52,
    });
    // Stage heading and body
    slots.push({
      id: `stage-${i + 1}-heading`,
      type: "text_slot",
      x: stageX + 64,
      y: stageY + 14,
      width: stageW - 160,
      role: "stage-heading",
      zIndexHint: 62,
    });
    slots.push({
      id: `stage-${i + 1}-body`,
      type: "text_slot",
      x: stageX + 64,
      y: stageY + 46,
      width: stageW - 160,
      role: "stage-body",
      zIndexHint: 55,
    });
    // Annotation
    const annotX = stageX + stageW + 8;
    if (annotX + ANNOT_LINE_LEN + 40 <= W - 8) {
      slots.push({
        id: `stage-${i + 1}-annot-line`,
        type: "line",
        x1: stageX + stageW,
        y1: stageY + STAGE_H / 2,
        x2: annotX + ANNOT_LINE_LEN,
        y2: stageY + STAGE_H / 2,
        role: "funnel-annotation-line",
        zIndexHint: 17,
      });
      slots.push({
        id: `stage-${i + 1}-pct`,
        type: "text_slot",
        x: annotX + ANNOT_LINE_LEN + 4,
        y: stageY + STAGE_H / 2 - 18,
        width: W - annotX - ANNOT_LINE_LEN - 12,
        role: "stage-percentage",
        zIndexHint: 58,
      });
    }
  }

  // Footer
  slots.push({
    id: "footer-band",
    type: "rect",
    x: 0,
    y: H - 100,
    width: W,
    height: 100,
    role: "footer-background",
    zIndexHint: 7,
  });
  slots.push({
    id: "footer-text",
    type: "text_slot",
    x: 40,
    y: H - 66,
    width: W - 80,
    role: "footer-cta-text",
    zIndexHint: 72,
  });

  return slots;
}

// ─────────────────────────────────────────────────────────
// CYCLE  Trigonometrically pre-computed radial positions
// ─────────────────────────────────────────────────────────
function computeCycle(W: number, H: number): SlotPosition[] {
  const slots: SlotPosition[] = [];
  const NODES = 5;
  const CENTER_X = W / 2;
  const CENTER_Y = 430;
  const ORBIT_R = 210;
  const NODE_R = 44;
  const LABEL_R = 295;
  const START_ANGLE = -Math.PI / 2;

  // Background
  slots.push({
    id: "bg",
    type: "rect",
    x: 0,
    y: 0,
    width: W,
    height: H,
    role: "canvas-background",
    zIndexHint: 0,
  });
  slots.push({
    id: "deco-circle-tr",
    type: "circle",
    x: W + 80,
    y: -80,
    radius: 190,
    role: "decorative-depth-circle",
    zIndexHint: 2,
  });
  slots.push({
    id: "deco-circle-bl",
    type: "circle",
    x: -60,
    y: H - 100,
    radius: 160,
    role: "decorative-depth-circle",
    zIndexHint: 2,
  });

  // Header band
  slots.push({
    id: "header-band",
    type: "rect",
    x: 0,
    y: 0,
    width: W,
    height: 150,
    role: "header-background",
    zIndexHint: 6,
    rx: 0,
  });
  slots.push({
    id: "header-label",
    type: "text_slot",
    x: 40,
    y: 32,
    width: W - 80,
    role: "header-topic-label",
    zIndexHint: 72,
  });
  slots.push({
    id: "header-title-1",
    type: "text_slot",
    x: 40,
    y: 58,
    width: 280,
    role: "title-word-1",
    zIndexHint: 86,
  });
  slots.push({
    id: "header-title-2-bg",
    type: "rect",
    x: 324,
    y: 54,
    width: 240,
    height: 66,
    rx: 6,
    role: "title-word-2-highlight-rect",
    zIndexHint: 85,
  });
  slots.push({
    id: "header-title-2",
    type: "text_slot",
    x: 328,
    y: 58,
    width: 232,
    role: "title-word-2",
    zIndexHint: 86,
  });
  slots.push({
    id: "header-subtitle",
    type: "text_slot",
    x: 40,
    y: 126,
    width: W - 80,
    role: "header-subtitle",
    zIndexHint: 72,
  });

  // Center circle
  slots.push({
    id: "center-ring-outer",
    type: "circle",
    x: CENTER_X,
    y: CENTER_Y,
    radius: 105,
    role: "center-ring-decorative",
    zIndexHint: 14,
  });
  slots.push({
    id: "center-circle",
    type: "circle",
    x: CENTER_X,
    y: CENTER_Y,
    radius: 82,
    role: "center-circle-main",
    zIndexHint: 26,
  });
  slots.push({
    id: "center-label",
    type: "text_slot",
    x: CENTER_X - 60,
    y: CENTER_Y - 22,
    width: 120,
    role: "center-circle-label",
    zIndexHint: 62,
  });

  for (let i = 0; i < NODES; i++) {
    const angle = START_ANGLE + (i / NODES) * 2 * Math.PI;
    const nx = Math.round(CENTER_X + ORBIT_R * Math.cos(angle));
    const ny = Math.round(CENTER_Y + ORBIT_R * Math.sin(angle));

    // Connector line
    const cEdgeX = Math.round(CENTER_X + 105 * Math.cos(angle));
    const cEdgeY = Math.round(CENTER_Y + 105 * Math.sin(angle));
    const nEdgeX = Math.round(nx - NODE_R * Math.cos(angle));
    const nEdgeY = Math.round(ny - NODE_R * Math.sin(angle));
    slots.push({
      id: `node-${i + 1}-connector`,
      type: "line",
      x1: cEdgeX,
      y1: cEdgeY,
      x2: nEdgeX,
      y2: nEdgeY,
      role: "radial-connector-line",
      zIndexHint: 16,
    });

    // Node circle
    slots.push({
      id: `node-${i + 1}-circle`,
      type: "circle",
      x: nx,
      y: ny,
      radius: NODE_R,
      role: "cycle-node-circle",
      zIndexHint: 28,
    });
    slots.push({
      id: `node-${i + 1}-emoji`,
      type: "text_slot",
      x: nx - NODE_R + 8,
      y: ny - NODE_R + 10,
      width: (NODE_R - 8) * 2,
      role: "cycle-node-emoji",
      zIndexHint: 44,
    });

    // Label position
    const lx = Math.round(CENTER_X + LABEL_R * Math.cos(angle));
    const ly = Math.round(CENTER_Y + LABEL_R * Math.sin(angle));
    const labelW = 140;
    const isLeftSide = Math.cos(angle) < -0.2;
    const isRightSide = Math.cos(angle) > 0.2;
    const labelX = isLeftSide
      ? lx - labelW
      : isRightSide
        ? lx
        : lx - labelW / 2;

    slots.push({
      id: `node-${i + 1}-heading`,
      type: "text_slot",
      x: labelX,
      y: ly - 22,
      width: labelW,
      role: "cycle-node-heading",
      zIndexHint: 64,
    });
    slots.push({
      id: `node-${i + 1}-body`,
      type: "text_slot",
      x: labelX,
      y: ly + 4,
      width: labelW,
      role: "cycle-node-body",
      zIndexHint: 55,
    });
  }

  // Stats row below
  const STAT_COUNT = 3;
  const STAT_W = 200;
  const STAT_H = 100;
  const STAT_Y = CENTER_Y + ORBIT_R + NODE_R + 32;
  const totalStatsW = STAT_COUNT * STAT_W + (STAT_COUNT - 1) * 16;
  const statsStartX = (W - totalStatsW) / 2;

  for (let i = 0; i < STAT_COUNT; i++) {
    const sx = statsStartX + i * (STAT_W + 16);
    slots.push({
      id: `stat-${i + 1}-bg`,
      type: "rect",
      x: sx,
      y: STAT_Y,
      width: STAT_W,
      height: STAT_H,
      rx: 10,
      role: "stat-block-background",
      zIndexHint: 20,
    });
    slots.push({
      id: `stat-${i + 1}`,
      type: "stat_slot",
      x: sx,
      y: STAT_Y,
      width: STAT_W,
      height: STAT_H,
      role: "stat-block",
      zIndexHint: 32,
    });
  }

  // Footer
  slots.push({
    id: "footer-band",
    type: "rect",
    x: 0,
    y: H - 100,
    width: W,
    height: 100,
    role: "footer-background",
    zIndexHint: 7,
  });
  slots.push({
    id: "footer-text",
    type: "text_slot",
    x: 40,
    y: H - 66,
    width: W - 80,
    role: "footer-cta-text",
    zIndexHint: 72,
  });

  return slots;
}
