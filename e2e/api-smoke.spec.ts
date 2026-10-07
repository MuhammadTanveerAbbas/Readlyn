import { test, expect } from "@playwright/test";

/**
 * API plus page smoke checks. These run against the dev server without auth.
 */
test.describe("Public API plus pages", () => {
  test("health endpoint reports a live auto selected model", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBeDefined();
    expect(body.checks).toBeDefined();
    expect(body.checks.ai).toBeDefined();

    // The auto model selector reports the model it would use right now.
    if (String(body.checks.ai).startsWith("ok")) {
      expect(body.checks.aiSelectedModel).toBeTruthy();
      expect(typeof body.checks.aiSelectedModel).toBe("string");
      expect(body.checks.aiCandidates).toContain("openai/gpt-oss-120b");
    }
  });

  test("generate endpoint rejects anonymous callers", async ({ request }) => {
    const response = await request.post("/api/generate", {
      data: { prompt: "hello", theme: "ocean", size: "a4", style: "auto" },
    });

    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.error).toBe("Forbidden");
  });

  test("privacy plus terms pages render", async ({ page }) => {
    const privacy = await page.goto("/privacy");
    expect(privacy?.status()).toBe(200);
    await expect(page.locator("body")).toContainText(/privacy/i);

    const terms = await page.goto("/terms");
    expect(terms?.status()).toBe(200);
    await expect(page.locator("body")).toContainText(/terms/i);
  });

  test("unknown routes return the not found page", async ({ page }) => {
    const response = await page.goto("/definitely-not-a-real-page-xyz");
    expect(response?.status()).toBe(404);
  });

  test("sitemap plus robots are served", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();

    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
  });
});
