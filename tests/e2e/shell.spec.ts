import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("shell is responsive, local-only and accessible", async ({ page }, testInfo) => {
  const remoteRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin !== "http://127.0.0.1:4173") {
      remoteRequests.push(request.url());
    }
  });

  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: /Practical security/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Link42 home" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Explore Rule1/ })).toHaveAttribute(
    "href",
    "https://rule1.link42.app",
  );
  await expect(page.getByRole("link", { name: "Source", exact: true })).toHaveAttribute(
    "href",
    "https://github.com/link42-au/link42",
  );

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);

  if (testInfo.project.name.startsWith("mobile")) {
    const menu = page.locator('button[aria-controls="site-navigation"]');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAccessibleName("Open navigation");
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeHidden();
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toHaveAccessibleName("Close navigation");
    await expect(
      page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Licence" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("aria-expanded", "false");
  } else {
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  }

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
  expect(remoteRequests).toEqual([]);
});

test("theme switch is labelled and persists", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Switch to dark theme" });
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Switch to light theme" })).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("skip link reaches main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("excluded routes remain absent", async ({ request }) => {
  for (const route of ["/api", "/api/example", "/reports/example", "/investigations/example"]) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(404);
  }
});
