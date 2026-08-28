import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  generateLearnContent,
  loadLearnPages,
  parseLearnMarkdown,
  renderLearnPage,
  renderMarkdown,
} from "../../scripts/generate-content.ts";

const validSource = `---
title: "Example"
slug: "examples/safe-page"
subtitle: "A subtitle"
seoDescription: "A useful description."
navigationOrder: 1
category: "Examples"
reviewStatus: "unverified"
---
:::section {"tag":"Start","title":"First section"}
:::factual
Factual text with a [safe link](https://example.com/path).
:::satirical
Satirical text with a [local link](/learn).
:::endsection
`;

describe("Learn Markdown validation", () => {
  it("parses strict metadata and both section flavours", () => {
    const page = parseLearnMarkdown(validSource, "example.md");
    expect(page.slug).toBe("examples/safe-page");
    expect(page.reviewStatus).toBe("unverified");
    expect(page.sections).toHaveLength(1);
    expect(page.sections[0].factualHtml).toContain('<a href="https://example.com/path">safe link</a>');
    expect(page.sections[0].satiricalHtml).toContain('<a href="/learn">local link</a>');
  });

  it.each([
    [
      "route traversal",
      validSource.replace('"examples/safe-page"', '"../unsafe"'),
      "safe lowercase route segments",
    ],
    [
      "missing flavour",
      validSource.replace(":::satirical\nSatirical text with a [local link](/learn).\n", ""),
      "at least one section",
    ],
    [
      "unknown field",
      validSource.replace('category: "Examples"', 'category: "Examples"\nlegacyId: "123"'),
      "unknown frontmatter field",
    ],
  ])("rejects %s", (_name, source, error) => {
    expect(() => parseLearnMarkdown(source, "invalid.md")).toThrow(error);
  });

  it("rejects raw HTML and active-content links", () => {
    expect(() => renderMarkdown("<script>alert(1)</script>", "unsafe.md")).toThrow("raw HTML");
    expect(() => renderMarkdown("[click](javascript:alert(1))", "unsafe.md")).toThrow("unsafe link protocol");
    expect(() => renderMarkdown("[external](//unsafe.example/path)", "unsafe.md")).toThrow(
      "scheme-relative links are not allowed",
    );
  });

  it("escapes metadata before embedding it in a generated script", () => {
    const page = parseLearnMarkdown(
      validSource.replace('title: "Example"', 'title: "</script><script>alert(1)</script>"'),
      "metadata.md",
    );
    const rendered = renderLearnPage(page);
    expect(rendered).not.toContain("</script><script>alert(1)</script>");
    expect(rendered).toContain("\\u003c/script>\\u003cscript>alert(1)\\u003c/script>");
  });
});

describe("Learn content corpus", () => {
  it("contains the complete, uniquely routed Learn inventory", async () => {
    const pages = await loadLearnPages();
    const slugs = pages.map((page) => page.slug);
    expect(pages).toHaveLength(14);
    expect(new Set(slugs).size).toBe(14);
    expect(pages.reduce((total, page) => total + page.sections.length, 0)).toBe(112);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "frameworks",
        "frameworks/ism",
        "frameworks/ism/e8",
        "frameworks/ism/irap",
        "frameworks/nzism",
        "frameworks/picerl",
        "risk",
        "risk/methodology",
        "threat",
        "threat/mitre-attack",
        "threat/stix-taxii",
        "vulnerability",
        "vulnerability/cvss",
        "vulnerability/epss",
      ]),
    );
    for (const page of pages) {
      expect(page.sections.every((section) => section.factualMarkdown && section.satiricalMarkdown)).toBe(
        true,
      );
    }
  });

  it("preserves every route order, section count, and review state", async () => {
    const pages = await loadLearnPages();
    expect(
      pages.map(({ slug, navigationOrder, sections, reviewStatus }) => [
        slug,
        navigationOrder,
        sections.length,
        reviewStatus,
      ]),
    ).toEqual([
      ["frameworks", 10, 6, "verified"],
      ["frameworks/ism", 20, 7, "unverified"],
      ["frameworks/ism/e8", 30, 7, "unverified"],
      ["frameworks/ism/irap", 40, 8, "unverified"],
      ["frameworks/nzism", 50, 7, "unverified"],
      ["frameworks/picerl", 60, 11, "unverified"],
      ["threat", 70, 8, "unverified"],
      ["threat/mitre-attack", 80, 7, "unverified"],
      ["threat/stix-taxii", 90, 8, "unverified"],
      ["vulnerability", 100, 9, "unverified"],
      ["vulnerability/cvss", 110, 8, "unverified"],
      ["vulnerability/epss", 120, 9, "unverified"],
      ["risk", 130, 8, "unverified"],
      ["risk/methodology", 140, 9, "unverified"],
    ]);
    for (const page of pages) {
      expect(page.title).not.toBe("");
      expect(page.subtitle).not.toBe("");
      expect(page.seoDescription).not.toBe("");
      expect(page.category).not.toBe("");
    }
  });

  it("preserves the verified Frameworks exemplar and both voices", async () => {
    const pages = await loadLearnPages();
    const page = pages.find(({ slug }) => slug === "frameworks");
    expect(page).toBeDefined();
    expect(page).toMatchObject({
      title: "Security Frameworks",
      subtitle: "Standards and guidelines that define how organisations protect their systems",
      seoDescription:
        "Security framework fundamentals across Australia, New Zealand, and international standards.",
      reviewStatus: "verified",
    });
    expect(page?.sections).toHaveLength(6);
    expect(page?.sections[0].factualMarkdown).toContain("structured set of controls");
    expect(page?.sections[0].satiricalMarkdown).toContain("everyone do your best");
  });

  it("renders deterministically and detects committed route drift", async () => {
    const page = parseLearnMarkdown(validSource, "example.md");
    expect(renderLearnPage(page)).toBe(renderLearnPage(page));
    await expect(generateLearnContent({ check: true })).resolves.toHaveLength(14);
    const generated = await readFile(resolve("src/routes/learn/frameworks/+page.svelte"), "utf8");
    expect(generated).toContain("GENERATED FROM MARKDOWN");
    expect(generated).toContain("data-verified={page.reviewStatus");
  });

  it("rejects a filename and slug mismatch", async () => {
    const root = await mkdtemp(join(tmpdir(), "link42-learn-mismatch-"));
    try {
      await mkdir(join(root, "examples"), { recursive: true });
      await writeFile(join(root, "examples", "wrong-name.md"), validSource, "utf8");
      await expect(loadLearnPages(root)).rejects.toThrow("does not match source route");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("rejects stale or orphan Learn routes", async () => {
    const root = await mkdtemp(join(tmpdir(), "link42-learn-orphan-"));
    const contentRoot = join(root, "content");
    const routesRoot = join(root, "routes");
    try {
      await mkdir(join(contentRoot, "examples"), { recursive: true });
      await writeFile(join(contentRoot, "examples", "safe-page.md"), validSource, "utf8");
      await generateLearnContent({ contentRoot, routesRoot });
      await mkdir(join(routesRoot, "orphan"), { recursive: true });
      await writeFile(join(routesRoot, "orphan", "+page.svelte"), "stale route\n", "utf8");
      await expect(generateLearnContent({ check: true, contentRoot, routesRoot })).rejects.toThrow(
        "generated Learn routes are stale",
      );
      await expect(generateLearnContent({ contentRoot, routesRoot })).rejects.toThrow(
        "orphan Learn routes must be removed",
      );
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("keeps the Learn tree inside the approved public boundary", async () => {
    const pages = await loadLearnPages();
    const corpus = pages
      .flatMap((page) =>
        page.sections.flatMap((section) => [section.factualMarkdown, section.satiricalMarkdown]),
      )
      .join("\n");
    expect(corpus).not.toMatch(/wan0net|digitalocean|login2|\]\(\/(?:api|reports|investigations)(?:\/|\b)/i);
  });
});
