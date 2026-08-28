import { expect, type Page, type TestInfo } from "@playwright/test";

export const configuredTheme = (testInfo: TestInfo): "light" | "dark" =>
  testInfo.project.name.endsWith("-dark") ? "dark" : "light";

export const expectConfiguredTheme = async (page: Page, testInfo: TestInfo) => {
  const theme = configuredTheme(testInfo);
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe(theme);
};

export const expectNoHorizontalOverflow = async (page: Page) => {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
  ).toBeLessThanOrEqual(0);
};
