import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { expectConfiguredTheme, expectNoHorizontalOverflow } from "./support";

const routes = [
  ["/learn", "Security Intelligence, Explained"],
  ["/learn/frameworks", "Security Frameworks"],
  ["/learn/frameworks/ism", "The Australian ISM"],
  ["/learn/frameworks/ism/e8", "The Essential Eight"],
  ["/learn/frameworks/ism/irap", "IRAP Assessments"],
  ["/learn/frameworks/nzism", "The New Zealand ISM"],
  ["/learn/frameworks/picerl", "PICERL Incident Response"],
  ["/learn/threat", "Threat Intelligence"],
  ["/learn/threat/mitre-attack", "MITRE ATT&CK"],
  ["/learn/threat/stix-taxii", "STIX & TAXII"],
  ["/learn/vulnerability", "Vulnerability Management"],
  ["/learn/vulnerability/cvss", "CVSS Scoring"],
  ["/learn/vulnerability/epss", "EPSS & KEV"],
  ["/learn/risk", "Risk Assessment"],
  ["/learn/risk/methodology", "Risk Assessment Methodology"],
] as const;

test("every Learn route is browser-accessible and has safe metadata", async ({ page }, testInfo) => {
  for (const [route, heading] of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://link42.app${route}`);
    await expectConfiguredTheme(page, testInfo);
    await expectNoHorizontalOverflow(page);
    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations, route).toEqual([]);
  }
});

test("Learn voice selection persists with the approved storage contract", async ({ page }, testInfo) => {
  await page.goto("/learn/frameworks");
  await expect(
    page.getByText("A security framework is a structured set of controls", { exact: false }),
  ).toBeVisible();

  const professional = testInfo.project.name.startsWith("mobile")
    ? page.locator(".learn-tone--mobile").getByRole("button", { name: "Professional" })
    : page.locator(".learn-sidebar").getByRole("button", { name: "Professional" });
  await professional.click();
  await expect(professional).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("everyone do your best", { exact: false })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("ai-flavour"))).toBe("snarky");

  await page.reload();
  await expect(page.getByText("everyone do your best", { exact: false })).toBeVisible();
});

test("Learn navigation and content remain accessible without horizontal overflow", async ({
  page,
}, testInfo) => {
  await page.goto("/learn/frameworks/ism/irap");
  await expectConfiguredTheme(page, testInfo);
  await expectNoHorizontalOverflow(page);

  const learnNavigation = page.getByRole("navigation", { name: "Learn topics" });
  if (testInfo.project.name.startsWith("mobile")) {
    const menu = page.locator('button[aria-controls="learn-sidebar-nav"]');
    await expect(menu).toBeVisible();
    await expect(menu).toHaveAccessibleName("Open Learn navigation");
    await expect(learnNavigation).toBeHidden();
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toHaveAccessibleName("Close Learn navigation");
    await expect(learnNavigation.getByRole("link", { name: "Overview" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toHaveAccessibleName("Open Learn navigation");
  } else {
    await expect(learnNavigation).toBeVisible();
  }

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});
