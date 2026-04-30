import {
  InfographicSchema,
  CANVAS_SIZES,
  THEME_COLORS,
  type CanvasSize,
  type ThemePalette,
  type StylePreset,
} from "@/types/infographic";
import { computeLayout, type SlotPosition } from "@/lib/archetypeLayouts";
import { GROQ_MODEL } from "@/lib/groq";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export const maxDuration = 60;

const GenerateRequestSchema = z.object({
  prompt: z.string().min(1).max(500),
  theme: z.enum(["violet", "ocean", "ember", "forest", "slate"]),
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

function extractFirstJsonObject(raw: string) {
  const fencedMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fencedMatch ? fencedMatch[1] : raw;
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("No JSON object found in model output");
  }
  return candidate.slice(firstBrace, lastBrace + 1);
}

function buildFallbackInfographic(args: {
  prompt: string;
  width: number;
  height: number;
  colors: { primary: string; secondary: string; accent: string };
  slots: SlotPosition[];
}) {
  const { prompt, width, height, colors, slots } = args;
  const elements: Array<Record<string, unknown>> = [
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
      fontFamily: "Arial",
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
        fontFamily: "Arial",
        fill: colors.secondary,
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
        valueFill: "#ffffff",
        labelFill: "#f1f5f9",
        bgFill: colors.primary,
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
        stroke: colors.secondary,
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
        fill: "#f8fafc",
        rx: slot.rx ?? 12,
        opacity: 1,
        stroke: colors.accent,
        strokeWidth: 1,
        zIndex: slot.zIndexHint ?? 8,
      });
    }
  }

  return {
    canvasWidth: width,
    canvasHeight: height,
    background: "#ffffff",
    elements: elements.sort((a, b) => {
      const az = typeof a.zIndex === "number" ? a.zIndex : 0;
      const bz = typeof b.zIndex === "number" ? b.zIndex : 0;
      return az - bz;
    }),
  };
}

export async function POST(req: Request) {
  try {
    // Auth check — only authenticated users may consume Groq quota
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate and parse request body
    const body = await req.json();
    const parsed = GenerateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { prompt, theme, size, style } = parsed.data as {
      prompt: string;
      theme: ThemePalette;
      size: CanvasSize;
      style: StylePreset;
    };

    const { width: w, height: h } = CANVAS_SIZES[size];
    const colors = THEME_COLORS[theme];

    // Pre-compute layout slots for the selected style
    const slots = style !== "auto" ? computeLayout(style, w, h) : [];

    // Build the layout manifest  AI uses these EXACT coordinates
    const layoutManifest =
      slots.length > 0
        ? `
═══════════════════════════════════════════
PRE-COMPUTED LAYOUT MANIFEST  USE EXACTLY
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

text_slot → generate a 'text' element with real content
stat_slot → generate a 'stat' element with a value and label
icon_slot → generate an 'icon' element with emoji
rect/circle/line → generate that exact type

You MAY add extra decorative depth elements (circles, texture dots) at zIndex 1-4,
but NEVER move or resize a pre-computed slot.`
        : `No layout manifest  use your best creative judgment for auto-layout based on the topic.`;

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
10) Sort elements by zIndex ascending and include a full-canvas background rect at zIndex 0.
11) Keep output valid for schema types only: rect, circle, text, stat, icon, line.
12) Keep total element count between 28 and 60 for balanced complexity.`;

    const userPrompt = `Create a professional, visually stunning ${style === "auto" ? "auto-layout" : `${style.toUpperCase()}-style`} infographic about: "${prompt}"

Canvas: ${w}×${h}px
Theme: ${theme}
Style: ${style}

Generate REAL facts, statistics, and data about this topic. The visual structure must match 
the ${style === "auto" ? "selected" : style} archetype  pyramid shapes for pyramid, cycle rings for cycle, etc. 
Make it look like it came from Venngage or Piktochart.

Return ONLY a valid JSON object. No markdown fences. No explanation.`;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Missing GROQ_API_KEY" }, { status: 500 });
    }

    const completion = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
        }),
      },
    );

    if (!completion.ok) {
      const errorText = await completion.text();
      return Response.json(
        { error: "Groq generation failed", details: errorText },
        { status: 500 },
      );
    }

    const completionJson = (await completion.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const rawText = completionJson.choices?.[0]?.message?.content ?? "";

    let payload: ReturnType<typeof buildFallbackInfographic>;
    try {
      const normalizedJson = extractFirstJsonObject(rawText).replace(
        /:\s*undefined(\s*[,}])/g,
        ": null$1",
      );
      const parsed = InfographicSchema.safeParse(JSON.parse(normalizedJson));
      payload = parsed.success
        ? parsed.data
        : buildFallbackInfographic({
            prompt,
            width: w,
            height: h,
            colors,
            slots,
          });
    } catch {
      payload = buildFallbackInfographic({
        prompt,
        width: w,
        height: h,
        colors,
        slots,
      });
    }

    // Keep response format compatible with editor stream reader.
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
      },
    });
  } catch (error) {
    // Log server-side only — never expose internals to client
    console.error(
      "[generate] route error:",
      error instanceof Error ? error.message : "unknown",
    );
    return Response.json(
      { error: "Failed to generate infographic" },
      { status: 500 },
    );
  }
}
