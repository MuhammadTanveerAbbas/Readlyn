import { generateText } from "ai";
import { getGroqClient, GROQ_MODEL } from "@/lib/groq";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const groq = getGroqClient();

const AIActionSchema = z.object({
  action: z.enum([
    "rewrite",
    "layout",
    "theme",
    "missing-section",
    "color",
    "vary",
    "tone",
  ]),
  context: z.record(z.unknown()),
});

export async function POST(req: Request) {
  try {
    // Auth check — only authenticated users may call AI actions
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return Response.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Validate request body
    const body = await req.json();
    const parsed = AIActionSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          ok: false,
          error: "Invalid request",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { action, context } = parsed.data;

    let prompt = "";

    if (action === "rewrite") {
      const text =
        typeof context.text === "string" ? context.text.slice(0, 2000) : "";
      const instruction =
        typeof context.instruction === "string"
          ? context.instruction.slice(0, 200)
          : "";
      prompt = `Rewrite the following text with instruction "${instruction}". Return only rewritten text.\n\n${text}`;
    } else if (action === "layout") {
      prompt = `Given this canvas context: ${JSON.stringify(context)} suggest one best layout archetype and one short reason. Return ONLY valid JSON (no markdown, no extra text): {"archetype":"","reason":"","description":""}`;
    } else if (action === "theme") {
      const topic =
        typeof context.topic === "string" ? context.topic.slice(0, 200) : "";
      prompt = `Given topic "${topic}", choose one theme name from Violet, Ocean, Ember, Forest, Slate. Reply only theme name.`;
    } else if (action === "missing-section") {
      prompt = `Analyze sections and suggest one missing section and one sentence why. Return ONLY valid JSON (no markdown, no extra text): {"section":"","reason":"","suggestion":""}. Context: ${JSON.stringify(context)}`;
    } else if (action === "color") {
      prompt = `Suggest one hex color for this object context. Return only hex color like #AABBCC. Context: ${JSON.stringify(context)}`;
    } else if (action === "vary") {
      prompt = `Create a varied version for this element data. Return JSON object only. Context: ${JSON.stringify(context)}`;
    } else if (action === "tone") {
      prompt = `Analyze the tone and style of these text blocks. Provide a brief summary (max 140 chars) of the overall tone. Context: ${JSON.stringify(context)}`;
    }

    const result = await generateText({
      model: groq(GROQ_MODEL),
      prompt,
    });

    return Response.json({ ok: true, output: result.text });
  } catch (error) {
    console.error(
      "[ai-action] error:",
      error instanceof Error ? error.message : "unknown",
    );
    return Response.json(
      { ok: false, error: "AI action failed" },
      { status: 500 },
    );
  }
}
