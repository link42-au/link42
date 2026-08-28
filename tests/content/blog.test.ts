import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  getBlogArticle,
  loadBlogArticles,
  loadLatestBlogArticle,
  parseBlogMarkdown,
  renderBlogMarkdown,
  renderBlogRss,
} from "../../src/lib/server/blog.ts";
import { load as loadArticlePage } from "../../src/routes/blog/[slug]/+page.server.ts";
import { GET as getRss } from "../../src/routes/blog/rss.xml/+server.ts";

const temporaryDirectories: string[] = [];

const temporaryDirectory = async (): Promise<string> => {
  const directory = await mkdtemp(resolve(tmpdir(), "link42-blog-test-"));
  temporaryDirectories.push(directory);
  return directory;
};

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

const articleSource = ({
  title = "An & Article",
  slug = "an-article",
  publishedAt = "2026-08-04",
  tags = ["IRAP", "Assurance"],
  extraFrontmatter = "",
  body = "# Evidence\n\nRead the [official guidance](https://example.com/guidance).",
} = {}): string => `---
title: ${JSON.stringify(title)}
slug: ${JSON.stringify(slug)}
summary: "A concise <assessment> summary & guide."
seoDescription: "A precise description for search."
author: "AI Superintelligence"
publishedAt: ${JSON.stringify(publishedAt)}
tags: ${JSON.stringify(tags)}
${extraFrontmatter}---
${body}
`;

describe("blog frontmatter and Markdown", () => {
  it("parses the strict schema and renders safe Markdown", () => {
    const article = parseBlogMarkdown(articleSource(), "an-article.md");
    expect(article).toMatchObject({
      slug: "an-article",
      author: "AI Superintelligence",
      publishedAt: "2026-08-04",
      tags: ["IRAP", "Assurance"],
      canonicalUrl: "https://link42.app/blog/an-article",
    });
    expect(article.html).toContain("<h1>Evidence</h1>");
    expect(article.html).toContain('<a href="https://example.com/guidance">official guidance</a>');
  });

  it.each([
    ["unsafe slug", articleSource({ slug: "../escape" }), "safe lowercase kebab-case"],
    ["invalid date", articleSource({ publishedAt: "2026-02-30" }), "valid calendar date"],
    [
      "non-array tags",
      articleSource().replace('tags: ["IRAP","Assurance"]', 'tags: "IRAP"'),
      "JSON string array",
    ],
    ["duplicate tags", articleSource({ tags: ["IRAP", "IRAP"] }), "must not contain duplicates"],
    ["unknown field", articleSource({ extraFrontmatter: 'legacyId: "123"\n' }), "unknown frontmatter field"],
  ])("rejects %s", (_name, source, message) => {
    expect(() => parseBlogMarkdown(source, "invalid.md")).toThrow(message);
  });

  it("rejects empty bodies, raw HTML, and unsafe URL protocols", () => {
    expect(() => parseBlogMarkdown(articleSource({ body: "" }), "empty.md")).toThrow(
      "body must not be empty",
    );
    expect(() => renderBlogMarkdown("<iframe></iframe>", "unsafe.md")).toThrow("raw HTML");
    expect(() => renderBlogMarkdown("[click](javascript:alert(1))", "unsafe.md")).toThrow(
      "unsafe link protocol",
    );
  });

  it.each([
    ["scheme-relative URLs", "[click](//evil.example/path)", "scheme-relative"],
    ["plain route traversal", "[click](/learn/../api)", "route traversal"],
    ["encoded route traversal", "[click](/learn/%2e%2e/api)", "route traversal"],
    ["nested encoded route traversal", "[click](/%252e%252e/api)", "route traversal"],
  ])("rejects %s", (_name, markdown, message) => {
    expect(() => renderBlogMarkdown(markdown, "unsafe.md")).toThrow(message);
  });

  it("rejects duplicate, missing, malformed, and untrimmed metadata", () => {
    expect(() =>
      parseBlogMarkdown(articleSource({ extraFrontmatter: 'title: "Duplicate"\n' }), "duplicate.md"),
    ).toThrow("duplicate frontmatter field title");
    expect(() => parseBlogMarkdown(articleSource().replace(/^summary:.*\n/m, ""), "missing.md")).toThrow(
      "summary must be",
    );
    expect(() =>
      parseBlogMarkdown(
        articleSource().replace('author: "AI Superintelligence"', "author: nope"),
        "malformed.md",
      ),
    ).toThrow("author must be a valid JSON value");
    expect(() => parseBlogMarkdown(articleSource({ tags: [" IRAP", "Assurance"] }), "untrimmed.md")).toThrow(
      "trimmed strings",
    );
  });
});

describe("blog discovery", () => {
  it("loads newest-first with deterministic slug ordering for date ties", async () => {
    const directory = await temporaryDirectory();
    await Promise.all([
      writeFile(
        resolve(directory, "older.md"),
        articleSource({
          title: "Older",
          slug: "older",
          publishedAt: "2026-01-01",
        }),
      ),
      writeFile(
        resolve(directory, "alpha.md"),
        articleSource({
          title: "Alpha",
          slug: "alpha",
          publishedAt: "2026-08-04",
        }),
      ),
      writeFile(
        resolve(directory, "zulu.md"),
        articleSource({
          title: "Zulu",
          slug: "zulu",
          publishedAt: "2026-08-04",
        }),
      ),
    ]);
    expect((await loadBlogArticles(directory)).map(({ slug }) => slug)).toEqual(["alpha", "zulu", "older"]);
    expect(await getBlogArticle("missing", directory)).toBeUndefined();
    expect(await getBlogArticle("../unsafe", directory)).toBeUndefined();
  });

  it("rejects duplicate slugs before accepting the corpus", async () => {
    const directory = await temporaryDirectory();
    await Promise.all([
      writeFile(resolve(directory, "first.md"), articleSource({ slug: "duplicate" })),
      writeFile(resolve(directory, "second.md"), articleSource({ slug: "duplicate" })),
    ]);
    await expect(loadBlogArticles(directory)).rejects.toThrow("duplicate blog slug: duplicate");
  });

  it("rejects a source filename that differs from its route slug", async () => {
    const directory = await temporaryDirectory();
    await writeFile(resolve(directory, "wrong.md"), articleSource({ slug: "right" }));
    await expect(loadBlogArticles(directory)).rejects.toThrow(
      "filename must match the frontmatter slug (right.md)",
    );
  });

  it("represents an empty corpus without inventing a latest article", async () => {
    const directory = await temporaryDirectory();
    expect(await loadBlogArticles(directory)).toEqual([]);
    expect(await loadLatestBlogArticle(directory)).toBeNull();
    expect(renderBlogRss([])).not.toContain("<item>");
  });

  it.each(["file", "directory", "symlink"])("fails closed on an unsupported %s entry", async (kind) => {
    const directory = await temporaryDirectory();
    if (kind === "file") {
      await writeFile(resolve(directory, "notes.txt"), "not an article");
    } else if (kind === "directory") {
      await mkdir(resolve(directory, "nested"));
    } else {
      await writeFile(resolve(directory, "target.md"), articleSource({ slug: "target" }));
      await symlink(resolve(directory, "target.md"), resolve(directory, "linked.md"));
    }
    await expect(loadBlogArticles(directory)).rejects.toThrow("unsupported blog content entry");
  });
});

describe("blog RSS", () => {
  it("escapes XML fields and emits newest-first article metadata", () => {
    const newer = parseBlogMarkdown(articleSource(), "an-article.md");
    const older = parseBlogMarkdown(
      articleSource({
        title: "Older",
        slug: "older",
        publishedAt: "2026-01-01",
      }),
      "older.md",
    );
    const xml = renderBlogRss([older, newer]);
    expect(xml).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(xml).toContain("xmlns:dc=");
    expect(xml).toContain("<title>An &amp; Article</title>");
    expect(xml).toContain("A concise &lt;assessment&gt; summary &amp; guide.");
    expect(xml).toContain("<dc:creator>AI Superintelligence</dc:creator>");
    expect(xml).toContain("<pubDate>Tue, 04 Aug 2026 00:00:00 GMT</pubDate>");
    expect(xml.indexOf("an-article")).toBeLessThan(xml.indexOf("older"));
  });

  it("serves the repository feed with the RSS content type", async () => {
    const response = await getRss({} as never);
    expect(response.headers.get("content-type")).toBe("application/rss+xml; charset=utf-8");
    expect(await response.text()).toContain('<rss version="2.0"');
  });

  it("returns a real 404 for an unknown article route", async () => {
    await expect(loadArticlePage({ params: { slug: "does-not-exist" } } as never)).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe("published blog corpus", () => {
  it("contains the first IRAP article with the approved attribution", async () => {
    const articles = await loadBlogArticles();
    expect(articles[0]).toMatchObject({
      slug: "irap-assessed-not-certified-or-accredited",
      publishedAt: "2026-08-04",
      author: "AI Superintelligence",
    });
    expect(articles[0].markdown).toMatch(/IRAP assessed/i);
    expect(articles[0].markdown).toMatch(/not \**IRAP certified/i);
    expect(articles[0].markdown).toMatch(/\*\*IRAP accredited\*\*/i);
    expect(articles[0].markdown).toMatch(/can still (?:reject|say no)/i);
  });

  it("uses the cloud assessment phases and keeps authorisation with the customer", async () => {
    const [article] = await loadBlogArticles();

    expect(article.markdown).toMatch(/cloud phase 1/i);
    expect(article.markdown).toMatch(/cloud phase 2/i);
    expect(article.markdown).toMatch(/(?:customer|agency).{0,120}authoris(?:e|ation|ing)/is);
    expect(article.markdown).toMatch(/(?:say no|reject the risk)/i);
    expect(article.markdown).not.toMatch(/four(?:-|\s+)(?:current\s+)?(?:IRAP\s+)?stages?/i);
    expect(article.markdown).not.toMatch(/^#{2,3}\s+.*stage\s+[12]\b/im);
  });

  it("places locally installed software inside the agency assessment boundary", async () => {
    const [article] = await loadBlogArticles();

    expect(article.markdown).toMatch(/(?:on[- ]premises|locally installed)/i);
    expect(article.markdown).toMatch(/(?:overall\s+)?(?:agency|system).{0,120}assessment boundary/is);
    expect(article.markdown).toMatch(/(?:SaaS|vendor-operated service)/i);
    expect(article.markdown).toMatch(/not, and has never been, SaaS/i);
    expect(article.markdown).toMatch(/category error/i);
    expect(article.markdown).toMatch(
      /SaaS.{0,240}(?:does not|doesn't|cannot).{0,120}(?:authorise|prove).{0,160}(?:on[- ]premises|deployment)/is,
    );
  });

  it("cites authoritative sources with simple numbered markers", async () => {
    const [article] = await loadBlogArticles();

    expect(article.markdown).toMatch(/\[1\]/);
    expect(article.markdown).toMatch(/^## Sources$/m);
    expect(article.markdown).toMatch(/\[.+\]\(https:\/\/www\.cyber\.gov\.au\/.+\)/);
  });
});
