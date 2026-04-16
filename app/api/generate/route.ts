import {
  InfographicSchema,
  CANVAS_SIZES,
  THEME_COLORS,
  type CanvasSize,
  type ThemePalette,
  type StylePreset,
} from "@/types/infographic";
import { computeLayout } from "@/lib/archetypeLayouts";
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
  slots: Array<Record<string, any>>;
}) {
  const { prompt, width, height, colors, slots } = args;
  const elements: Array<Record<string, any>> = [
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
    if (slot.type === "text") {
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
    } else if (slot.type === "stat") {
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
    } else if (slot.type === "icon") {
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
    elements: elements.sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)),
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

    const systemPrompt = `You are a world-class infographic designer at Venngage. Generate structured JSON for a Fabric.js canvas.

CANVAS: ${w}×${h}px, origin (0,0) at top-left
COLORS: Primary ${colors.primary}, Secondary ${colors.secondary}, Accent ${colors.accent}

${layoutManifest}

═══════════════════════════════════════════
GENERATION RULES
═══════════════════════════════════════════
1. elements array MUST be sorted by zIndex ascending (lowest first, highest last)
2. ALWAYS start with full-canvas background rect (zIndex 0)
3. ALWAYS use PRE-COMPUTED slot positions if a manifest is provided
4. Include real, specific facts and statistics (not placeholder text)
5. Make all text fit within container widths: never exceed slot width minus padding
6. Title should use multiple text elements with mixed colors for visual pop
7. Stat blocks use type 'stat' with value, label, bgFill, valueFill properties
8. Icon groups use type 'icon' with emoji inside circles (bgFill, emoji)
9. Lines use strokeDashArray: [6, 4] for dashed lines
10. Total 40-65 elements only  do not exceed
11. Use null for unused stroke/strokeWidth (never empty string)
12. Ensure no text overlaps  stagger y positions by at least 20px`;

    const userPrompt = `Create a professional, visually stunning ${style === "auto" ? "auto-layout" : `${style.toUpperCase()}-style`} infographic about: "${prompt}"

Canvas: ${w}×${h}px
Theme: ${theme}
Style: ${style}

Generate REAL facts, statistics, and data about this topic. The visual structure must match 
the ${style === "auto" ? "selected" : style} archetype  pyramid shapes for pyramid, cycle rings for cycle, etc. 
Make it look like it came from Venngage or Piktochart.

Return ONLY a valid JSON object. Do not include markdown fences or commentary.`;

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
          controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
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
