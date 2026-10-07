import { describe, it, expect } from "vitest";
import { parseRouteId, parseEnumParam } from "@/lib/params";
import { checkCsrfOrigin } from "@/lib/csrf";
import { sanitizePrompt, sanitizeOutput } from "@/lib/sanitize";

const VALID_UUID = "123e4567-e89b-12d3-a456-426614174000";

function fakeRequest(origin: string | null, host = "readlyn.vercel.app") {
  const headers = new Headers();
  if (origin) headers.set("origin", origin);
  headers.set("host", host);
  return { headers } as unknown as Request;
}

describe("Route Param Validation", () => {
  it("accepts a valid uuid", () => {
    expect(parseRouteId(VALID_UUID)).toEqual({ id: VALID_UUID });
  });

  it("rejects missing params", () => {
    expect(parseRouteId(undefined).error).toBe("Missing route parameter");
  });

  it("rejects values that are not uuids", () => {
    expect(parseRouteId("../../etc/passwd").error).toBe(
      "Invalid route parameter format",
    );
    expect(parseRouteId("not-a-uuid").error).toBe(
      "Invalid route parameter format",
    );
  });

  it("falls back to the default for unknown enum values", () => {
    expect(parseEnumParam("bogus", ["a", "b"] as const, "a")).toBe("a");
    expect(parseEnumParam("b", ["a", "b"] as const, "a")).toBe("b");
    expect(parseEnumParam(undefined, ["a", "b"] as const, "a")).toBe("a");
  });
});

describe("CSRF Origin Checks", () => {
  it("rejects a missing origin", () => {
    const result = checkCsrfOrigin(fakeRequest(null));
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Missing Origin header");
  });

  it("accepts a same origin request", () => {
    expect(checkCsrfOrigin(fakeRequest("https://readlyn.vercel.app")).valid).toBe(
      true,
    );
  });

  it("rejects a cross origin request", () => {
    const result = checkCsrfOrigin(fakeRequest("https://evil.example.com"));
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Origin mismatch");
  });

  it("rejects a malformed origin", () => {
    const result = checkCsrfOrigin(fakeRequest("not a url"));
    expect(result.valid).toBe(false);
  });
});

describe("Input Sanitization", () => {
  it("strips html tags from prompts", () => {
    expect(sanitizePrompt("<b>Hello</b> world")).toBe("Hello world");
  });

  it("trims prompts to 500 characters", () => {
    expect(sanitizePrompt("a".repeat(600)).length).toBe(500);
  });

  it("removes control characters from prompts", () => {
    expect(sanitizePrompt("hi\u0000there")).toBe("hithere");
  });

  it("strips html from generated output", () => {
    expect(sanitizeOutput('<img src=x onerror="alert(1)">Safe')).toBe("Safe");
  });

  it("keeps plain text output untouched", () => {
    expect(sanitizeOutput("72% of readers finish faster")).toBe(
      "72% of readers finish faster",
    );
  });
});
