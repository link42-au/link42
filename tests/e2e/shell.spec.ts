import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { configuredTheme, expectConfiguredTheme, expectNoHorizontalOverflow } from "./support";

test("shell is responsive, local-only and accessible", async ({ page }, testInfo) => {
  const remoteRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin !== "http://127.0.0.1:4174") {
      remoteRequests.push(request.url());
    }
  });

  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expectConfiguredTheme(page, testInfo);
  await expect(page.getByRole("heading", { name: /Security tooling that starts useful/ })).toBeVisible();
  const platformNavigation = page.getByRole("navigation", { name: "Platform navigation" });
  await expect(platformNavigation.getByRole("link", { name: "Link42 home" })).toBeVisible();
  await expect(platformNavigation.getByRole("link", { name: "Open rule1" })).toHaveAttribute(
    "href",
    "https://rule1.link42.app",
  );
  await expect(page.getByRole("contentinfo")).toContainText("Canberra, Australia");

  await expectNoHorizontalOverflow(page);

  const more = page.getByRole("button", { name: "more" });
  await more.click();
  await expect(more).toHaveAttribute("aria-expanded", "true");
  for (const label of ["Learn", "About", "Blog", "Changelog", "Open source", "Licence"]) {
    await expect(page.locator("#platform-more").getByRole("link", { name: label })).toBeVisible();
  }
  await page.keyboard.press("Escape");
  await expect(more).toHaveAttribute("aria-expanded", "false");

  await page.goto("/about");
  await expect(page.getByRole("navigation", { name: "Site navigation" })).toBeVisible();
  await expect(page.getByRole("link", { name: "About", exact: true }).last()).toHaveClass(/active/);

  await page.goto("/open-source");
  await expect(page.getByRole("link", { name: "Open source", exact: true }).last()).toHaveClass(/active/);
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "open source" })).toHaveAttribute(
    "href",
    "/open-source",
  );

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
  expect(remoteRequests).toEqual([]);
});

test("theme switch is labelled and persists", async ({ page }, testInfo) => {
  await page.goto("/");
  const initialTheme = configuredTheme(testInfo);
  const selectedTheme = initialTheme === "light" ? "dark" : "light";
  await expectConfiguredTheme(page, testInfo);
  const toggle = page.getByRole("button", { name: `Switch to ${selectedTheme} theme` });
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", selectedTheme);
  await expect(page.getByRole("button", { name: `Switch to ${initialTheme} theme` })).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", selectedTheme);
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

test("excluded routes remain absent", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-light", "HTTP route checks run once on desktop");
  for (const route of ["/api", "/api/example", "/reports/example", "/investigations/example"]) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(404);
  }
});
