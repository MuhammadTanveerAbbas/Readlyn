import { generateText, Output } from "ai";
import { getGroqClient, getBestGroqModel, executeGroqWithSelfHealing } from "@/lib/groq";
import {
  InfographicSchema,
  CANVAS_SIZES,
  THEME_COLORS,
  type InfographicElement,
  type InfographicData,
} from "@/types/infographic";
import { BODY_FONT, DISPLAY_FONT } from "@/types/infographic";
import { computeLayout, type SlotPosition } from "@/lib/archetypeLayouts";
import { createClient } from "@/lib/supabase/server";
import { checkCsrfOrigin } from "@/lib/csrf";
import { sanitizePrompt, sanitizeOutput } from "@/lib/sanitize";
import { z } from "zod";

export const maxDuration = 60;

const GenerateRequestSchema = z.object({
  prompt: z.string().min(1).max(500),
  theme: z.enum(["ocean", "ember", "forest", "slate", "midnight"]),
  size: z.enum(["a4", "square", "wide"]),
  style: z.enum([
    "auto",
    "steps",
    "stats",
    "timeline",
    "compare",
    "list",
    "pyramid",
    "funnel",
    "cycle",
  ]),
});


function buildFallbackInfographic(args: {
  prompt: string;
  width: number;
  height: number;
  colors: { primary: string; secondary: string; accent: string };
  slots: SlotPosition[];
}): InfographicData {
  const { prompt, width, height, colors, slots } = args;
  const elements: InfographicElement[] = [
    {
      type: "rect",
      id: "bg-0",
      x: 0,
      y: 0,
      width,
      height,
      fill: "#ffffff",
      rx: 0,
      opacity: 1,
      stroke: null,
      strokeWidth: null,
      zIndex: 0,
    },
    {
      type: "text",
      id: "title-1",
      x: 48,
      y: 36,
      text: prompt.slice(0, 90),
      fontSize: 44,
      fontWeight: "900",
      fontFamily: DISPLAY_FONT,
      fill: colors.primary,
      textAlign: "left",
      width: Math.max(280, width - 96),
      opacity: 1,
      zIndex: 10,
    },
  ];

  for (const slot of slots) {
    if (!slot?.id || !slot?.type) continue;
    if (slot.type === "text_slot") {
      elements.push({
        type: "text",
        id: slot.id,
        x: slot.x ?? 48,
        y: slot.y ?? 120,
        text: "Insight",
        fontSize: 24,
        fontWeight: "bold",
        fontFamily: BODY_FONT,
        fill: colors.primary,
        textAlign: "left",
        width: slot.width ?? 300,
        opacity: 1,
        zIndex: slot.zIndexHint ?? 20,
      });
    } else if (slot.type === "stat_slot") {
      elements.push({
        type: "stat",
        id: slot.id,
        x: slot.x ?? 48,
        y: slot.y ?? 180,
        width: slot.width ?? 240,
        height: slot.height ?? 120,
        value: "72%",
        label: "Readers improve focus",
        valueFill: colors.primary,
        labelFill: "#52525b",
        bgFill: "#f6f6f3",
        rx: slot.rx ?? 12,
        zIndex: slot.zIndexHint ?? 20,
      });
    } else if (slot.type === "icon_slot") {
      elements.push({
        type: "icon",
        id: slot.id,
        x: slot.x ?? 120,
        y: slot.y ?? 220,
        emoji: "📚",
        emojiSize: 28,
        bgFill: colors.accent,
        bgRadius: slot.radius ?? 34,
        zIndex: slot.zIndexHint ?? 20,
      });
    } else if (slot.type === "line") {
      elements.push({
        type: "line",
        id: slot.id,
        x1: slot.x1 ?? 40,
        y1: slot.y1 ?? 300,
        x2: slot.x2 ?? width - 40,
        y2: slot.y2 ?? 300,
        stroke: colors.primary,
        strokeWidth: 2,
        dashed: true,
        zIndex: slot.zIndexHint ?? 8,
      });
    } else if (slot.type === "circle") {
      elements.push({
        type: "circle",
        id: slot.id,
        x: slot.x ?? width * 0.8,
        y: slot.y ?? 140,
        radius: slot.radius ?? 28,
        fill: colors.accent,
        opacity: 0.2,
        stroke: null,
        strokeWidth: null,
        zIndex: slot.zIndexHint ?? 5,
      });
    } else if (slot.type === "rect") {
      elements.push({
        type: "rect",
        id: slot.id,
        x: slot.x ?? 48,
        y: slot.y ?? 160,
        width: slot.width ?? 220,
        height: slot.height ?? 120,
        fill: "#f6f6f3",
        rx: slot.rx ?? 12,
        opacity: 1,
        stroke: colors.accent,
        strokeWidth: 1,
        zIndex: slot.zIndexHint ?? 8,
      });
    }
  }

  elements.sort((a, b) => a.zIndex - b.zIndex);

  return {
    canvasWidth: width,
    canvasHeight: height,
    background: "#ffffff",
    elements,
  };
}

export async function POST(req: Request) {
  try {
    const csrf = checkCsrfOrigin(req);
    if (!csrf.valid) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = GenerateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { prompt, theme, size, style } = parsed.data;

    const sanitizedPrompt = sanitizePrompt(prompt);
    const { width: w, height: h } = CANVAS_SIZES[size];
    const colors = THEME_COLORS[theme];

    const slots = style !== "auto" ? computeLayout(style, w, h) : [];

    const layoutManifest =
      slots.length > 0
        ? `
═══════════════════════════════════════════
PRE-COMPUTED LAYOUT MANIFEST, USE EXACTLY
═══════════════════════════════════════════
The following element slots have been mathematically pre-computed.
YOU MUST place elements at these EXACT x, y, width, height, radius values.
Do NOT invent new positions. Do NOT adjust coordinates.
Your job is ONLY to fill in: colors, text content, emoji, font sizes, fill/stroke colors.

SLOT MAP (${slots.length} slots):
${slots
  .map((s) => {
    const pos =
      s.type === "line"
        ? `x1=${s.x1},y1=${s.y1},x2=${s.x2},y2=${s.y2}`
        : s.type === "circle"
          ? `cx=${s.x},cy=${s.y},r=${s.radius}`
          : `x=${s.x},y=${s.y},w=${s.width},h=${s.height}${s.rx ? `,rx=${s.rx}` : ""}`;
    return `  [${s.id}] type=${s.type} ${pos} role="${s.role}" zIndex=${s.zIndexHint}`;
  })
  .join("\n")}

For each slot above, generate a matching element in the output JSON using:
- The EXACT id from the slot
- The EXACT x/y/width/height/radius/x1/y1/x2/y2 from the slot
- The EXACT zIndex from the slot
- YOUR CHOICE of: fill color, text content, fontSize, fontWeight, emoji, opacity

text_slot -> generate a 'text' element with real content
stat_slot -> generate a 'stat' element with a value and label
icon_slot -> generate an 'icon' element with emoji
rect/circle/line -> generate that exact type

You MAY add extra decorative depth elements (circles, texture dots) at zIndex 1-4,
but NEVER move or resize a pre-computed slot.`
        : `No layout manifest, use your best creative judgment for auto-layout based on the topic.`;

    const systemPrompt = `You are a senior infographic art director generating Fabric.js-ready JSON.

THINKING INSTRUCTION:
- Think about the topic, pick the best layout, then generate elements.
- Keep the reasoning private. Output only JSON.

CANVAS: ${w}x${h}px (0,0 top-left)
PALETTE: primary=${colors.primary}, secondary=${colors.secondary}, accent=${colors.accent}

${layoutManifest}

QUALITY RULES:
1) Output ONLY a valid JSON object with keys: canvasWidth, canvasHeight, background, elements.
2) NEVER output markdown fences, prose, preamble, or explanation.
3) If style=auto, choose the best archetype for the topic based on information density and narrative flow.
4) Build strong hierarchy: clear title, section headers, body text, and supporting visual accents.
5) Maintain high contrast between text and backgrounds.
6) Respect spacing rhythm: avoid overlaps, preserve gutters, and keep breathing room between groups.
7) Use statistically meaningful, concrete facts where possible (no placeholder copy).
8) Use realistic typography values and bounded widths so text remains readable.
9) Include decorative depth intentionally (subtle circles/lines) without harming readability.
10) Sort elements by zIndex ascending, and include a full-canvas background rect at zIndex 0.
11) Keep output valid for schema types only: rect, circle, text, stat, icon, line.
12) Keep total element count between 28 and 60 for balanced complexity.`;

    const userPrompt = `Create a professional, visually stunning ${style === "auto" ? "auto-layout" : `${style.toUpperCase()}-style`} infographic about: "${sanitizedPrompt}"

Canvas: ${w}×${h}px
Theme: ${theme}
Style: ${style}

Generate REAL facts, statistics, and data about this topic. The visual structure must match
the ${style === "auto" ? "selected" : style} archetype, pyramid shapes for pyramid, cycle rings for cycle, etc.
Make it look like it came from Venngage or Piktochart.

Return ONLY a valid JSON object. No markdown fences. No explanation.`;

    const groq = getGroqClient();

    let aiPayload: InfographicData | null = null;
    let usedModel = await getBestGroqModel("json");
    try {
      const response = await executeGroqWithSelfHealing(
        async (modelName) => {
          usedModel = modelName;
          return await generateText({
            model: groq(modelName),
            system: systemPrompt,
            prompt: userPrompt,
            temperature: 0.7,
            output: Output.object({ schema: InfographicSchema }),
          });
        },
        { task: "json" },
      );
      aiPayload = (response.output as InfographicData) || null;
    } catch (aiErr) {
      console.warn(
        "[generate] AI generation degraded to fallback template:",
        aiErr instanceof Error ? aiErr.message : "Unknown error",
      );
    }

    const payload: InfographicData =
      aiPayload ||
      buildFallbackInfographic({
        prompt,
        width: w,
        height: h,
        colors,
        slots,
      });

    payload.elements = payload.elements.map((el) => {
      if (el.type === "text") {
        return { ...el, text: sanitizeOutput(el.text) };
      }
      return el;
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const total = payload.elements.length;
          for (let i = 0; i < total; i++) {
            controller.enqueue(
              encoder.encode(
                `${JSON.stringify({
                  element: payload.elements[i],
                  progress: { current: i + 1, total },
                })}\n`,
              ),
            );
            await new Promise((resolve) => setTimeout(resolve, 8));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "x-readlyn-model": usedModel,
      },
    });
  } catch (error) {
    console.error("[generate] route error:", error instanceof Error ? error.message : "unknown");
    return Response.json(
      { error: "Failed to generate infographic" },
      { status: 500 },
    );
  }
}
