import { test, expect } from "@playwright/test";

/**
 * Auth page checks. These verify the forms render plus validate locally.
 * They never create real accounts because no backend credentials are used.
 */
test.describe("Auth pages", () => {
  test("login page renders the form", async ({ page }) => {
    const response = await page.goto("/login");
    expect(response?.status()).toBe(200);

    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByPlaceholder(/\u2022/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Continue with Google/i }),
    ).toBeVisible();
  });

  test("login form rejects an invalid email format locally", async ({ page }) => {
    await page.goto("/login");

    const email = page.getByPlaceholder("you@example.com");
    await email.fill("not-an-email");
    await page.getByRole("button", { name: "Sign in" }).click();

    // The email input uses type=email, so the browser blocks submit plus shows native text.
    const validationMessage = await email.evaluate(
      (el: HTMLInputElement) => el.validationMessage,
    );
    expect(validationMessage.length).toBeGreaterThan(0);
  });

  test("signup page renders the create account form", async ({ page }) => {
    const response = await page.goto("/signup");
    expect(response?.status()).toBe(200);

    await expect(
      page.getByRole("heading", { name: "Create account" }),
    ).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Sign up with Google/i }),
    ).toBeVisible();
  });

  test("protected routes redirect guests to login", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  });
});
