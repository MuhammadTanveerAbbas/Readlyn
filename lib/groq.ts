import { createGroq } from "@ai-sdk/groq";

// General text generation
export const GROQ_MODEL = "llama-3.3-70b-versatile";

export function getGroqClient() {
  return createGroq({ apiKey: process.env.GROQ_API_KEY });
}

