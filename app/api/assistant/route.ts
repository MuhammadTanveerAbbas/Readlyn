import { generateText } from "ai";
import { getGroqClient } from "@/lib/groq";
import { createClient } from "@/lib/supabase/server";
import { checkCsrfOrigin } from "@/lib/csrf";
import { z } from "zod";

export const maxDuration = 30;

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const RequestSchema = z.object({
  system: z.string().max(8000).optional(),
  messages: z.array(MessageSchema).min(1).max(20),
});

export async function POST(req: Request) {
  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // CSRF check
  const csrfError = checkCsrfOrigin(req);
  if (csrfError) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { system, messages } = parsed.data;

  try {
    const groq = getGroqClient();
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      system:
        system ??
        "You are a helpful assistant for Readlyn, an infographic design editor. Answer concisely and practically.",
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      maxOutputTokens: 600,
      temperature: 0.5,
    });
    return Response.json({ content: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI service error";
    return Response.json({ error: message }, { status: 500 });
  }
}
