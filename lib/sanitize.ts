import DOMPurify from "isomorphic-dompurify";

export function sanitizePrompt(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "")
    .trim()
    .slice(0, 500);
}

export function sanitizeOutput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}
