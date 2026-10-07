import { test, expect } from "@playwright/test";

/**
 * Responsive checks. Runs only in the mobile project plus a narrow desktop window.
 */
test.describe("Responsive layout", () => {
  const viewports = [
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 900 },
  ];

  for (const viewport of viewports) {
    test(`landing page has no horizontal overflow at ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth - doc.clientWidth;
      });

      // A couple of pixels of slack avoids false failures from sub pixel rounding.
      expect(overflow).toBeLessThanOrEqual(2);
    });

    test(`login page fits the viewport at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/login");

      await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth - doc.clientWidth;
      });
      expect(overflow).toBeLessThanOrEqual(2);
    });
  }

  test("mobile navigation exposes a menu toggle", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Toggle menu" });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.getByRole("navigation").first()).toBeVisible();
  });
});
