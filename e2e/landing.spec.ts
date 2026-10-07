import { test, expect } from "@playwright/test";

/**
 * Landing page smoke checks. These run without auth or a database.
 */
test.describe("Landing page", () => {
  test("renders the hero, plus main sections", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/Readlyn/i);

    const hero = page.getByRole("heading", { level: 1 });
    await expect(hero.first()).toBeVisible();
    await expect(hero.first()).toContainText("Describe it");

    await expect(page.locator("#features")).toBeAttached();
    await expect(page.locator("#pricing")).toBeAttached();
    await expect(page.locator("#faq")).toBeAttached();
    await expect(page.locator("#showcase")).toBeAttached();
  });

  test("shows the navigation plus calls to action", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Log in" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Start free" }).first()).toBeVisible();

    const cta = page.getByRole("link", { name: "Start free" }).first();
    await expect(cta).toHaveAttribute("href", "/signup");
  });

  test("pricing is honest about early access plus coming soon features", async ({
    page,
  }) => {
    await page.goto("/");

    const pricing = page.locator("#pricing");
    await pricing.scrollIntoViewIfNeeded();

    await expect(pricing).toContainText("early access");
    await expect(pricing).toContainText("(coming soon)");
    await expect(pricing).not.toContainText("Unlimited generations", {
      ignoreCase: true,
    });
  });

  test("footer links point to real routes", async ({ page }) => {
    await page.goto("/");

    const privacy = page.getByRole("link", { name: /privacy/i }).first();
    const terms = page.getByRole("link", { name: /terms/i }).first();

    await expect(privacy).toHaveAttribute("href", "/privacy");
    await expect(terms).toHaveAttribute("href", "/terms");
  });

  test("free of banned characters in visible copy", async ({ page }) => {
    await page.goto("/");
    const text = (await page.locator("body").innerText()).replace(/\s+/g, " ");

    expect(text).not.toContain("\u2014");
    expect(text).not.toContain("\u2013");
    expect(/\band\b/i.test(text)).toBe(false);
  });
});
