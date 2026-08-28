import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { expectConfiguredTheme, expectNoHorizontalOverflow } from "./support";

const companyPages = [
  {
    route: "/",
    heading: /Security tooling that starts useful/,
    title: "link42 — Cyber without the theatre",
    description:
      "link42 builds tools for people who actually do security. No dashboards of dashboards. No compliance theatre. Just things that work.",
  },
  {
    route: "/about",
    heading: "About",
    title: "About — link42",
    description:
      "About link42 — Australian-built security tools for practitioners, built with AI assistance and human accountability.",
  },
  {
    route: "/changelog",
    heading: "Changelog",
    title: "Changelog — link42",
    description: "Changes to the public link42 website, most recent first.",
  },
  {
    route: "/licence",
    heading: "Licence",
    title: "Licence — link42",
    description:
      "Licensing for the link42 website software, original editorial content, brand assets, and third-party material.",
  },
] as const;

for (const companyPage of companyPages) {
  test(`${companyPage.route} is accessible in its configured theme`, async ({ page }, testInfo) => {
    const response = await page.goto(companyPage.route);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(companyPage.title);
    await expect(page.getByRole("heading", { level: 1, name: companyPage.heading })).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      companyPage.description,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://link42.app${companyPage.route === "/" ? "" : companyPage.route}`,
    );

    await expectConfiguredTheme(page, testInfo);
    await expectNoHorizontalOverflow(page);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

    const firstMainLink = page.locator("main a").first();
    await firstMainLink.focus();
    await expect(firstMainLink).toBeFocused();
    expect(
      await firstMainLink.evaluate((element) => {
        const style = getComputedStyle(element);
        return style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) > 0;
      }),
    ).toBe(true);
  });
}

test("company pages use durable links and never link excluded routes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-light", "link inventory runs once on desktop");

  const seen = new Set<string>();
  for (const companyPage of companyPages) {
    await page.goto(companyPage.route);
    const hrefs = await page
      .locator("main a")
      .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).getAttribute("href") ?? ""));
    for (const href of hrefs) {
      expect(href).not.toMatch(/^\/(?:api|reports|investigations)(?:\/|$)/);
      seen.add(href);
    }
  }

  expect(seen).toContain("https://rule1.link42.app");
  expect(seen).toContain("https://github.com/link42-au/rule1");
  expect(seen).toContain("https://github.com/link42-au/link42");
  expect(seen).toContain("https://creativecommons.org/licenses/by-nc/4.0/");
  expect(seen).toContain("https://www.gnu.org/licenses/agpl-3.0.html");
});

test("excluded route families return 404", async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-light", "HTTP route checks run once on desktop");

  for (const route of [
    "/api",
    "/api/example",
    "/reports",
    "/reports/example",
    "/investigations",
    "/investigations/example",
  ]) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(404);
  }
});
