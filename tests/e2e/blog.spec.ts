import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const articleSlug = "irap-assessed-not-certified-or-accredited";
const articleTitle =
  "Congratulations, Your Platform Is IRAP-Assessed. Your Product Is Still Wearing a Fake Moustache.";

test("Blog index and article are responsive and accessible", async ({ page }) => {
  for (const [route, heading] of [
    ["/blog", "Blog"],
    [`/blog/${articleSlug}`, articleTitle],
  ] as const) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://link42.app${route}`);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
      route,
    ).toBeLessThanOrEqual(0);
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations, route).toEqual([]);
  }
});

test("homepage presents the latest article card", async ({ page }) => {
  await page.goto("/");
  const latest = page.locator(".latest-article__card");
  await expect(latest).toHaveAttribute("href", `/blog/${articleSlug}`);
  await expect(latest.getByRole("heading", { name: articleTitle })).toBeVisible();
  await expect(latest.getByText("4 August 2026")).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
  ).toBeLessThanOrEqual(0);
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("RSS is validly served and unknown article slugs are 404", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "HTTP route checks run once on desktop");

  const feed = await request.get("/blog/rss.xml");
  expect(feed.status()).toBe(200);
  expect(feed.headers()["content-type"]).toBe("application/rss+xml; charset=utf-8");
  const xml = await feed.text();
  expect(xml).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  expect(xml).toContain(`https://link42.app/blog/${articleSlug}`);

  expect((await request.get("/blog/does-not-exist")).status()).toBe(404);
  expect((await request.get("/blog/%2e%2e%2fapi")).status()).toBe(404);
});
