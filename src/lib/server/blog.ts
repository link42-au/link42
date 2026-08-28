import { readdir, readFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { marked, type Token } from "marked";

export const BLOG_CONTENT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../content/blog");
export const BLOG_ORIGIN = "https://link42.app";

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const BUNDLED_BLOG_SOURCES = import.meta.glob("../../../content/blog/*", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

export type BlogFrontmatter = {
  title: string;
  slug: string;
  summary: string;
  seoDescription: string;
  author: string;
  publishedAt: string;
  tags: string[];
};

export type BlogArticle = BlogFrontmatter & {
  markdown: string;
  html: string;
  canonicalUrl: string;
  sourcePath: string;
};

export type BlogArticleSummary = BlogFrontmatter & {
  canonicalUrl: string;
};

const STRING_FIELDS = ["title", "slug", "summary", "seoDescription", "author", "publishedAt"] as const;

const parseFrontmatter = (
  source: string,
  sourcePath: string,
): { metadata: Record<string, unknown>; markdown: string } => {
  const match = source.replaceAll("\r\n", "\n").match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`${sourcePath}: expected JSON-valued frontmatter between --- delimiters`);
  }

  const metadata: Record<string, unknown> = Object.create(null);
  for (const [index, line] of match[1].split("\n").entries()) {
    const field = line.match(/^([A-Za-z][A-Za-z0-9]*):\s+(.+)$/);
    if (!field) {
      throw new Error(`${sourcePath}:${index + 2}: invalid frontmatter line`);
    }
    if (Object.hasOwn(metadata, field[1])) {
      throw new Error(`${sourcePath}: duplicate frontmatter field ${field[1]}`);
    }
    try {
      metadata[field[1]] = JSON.parse(field[2]);
    } catch {
      throw new Error(`${sourcePath}:${index + 2}: ${field[1]} must be a valid JSON value`);
    }
  }

  return { metadata, markdown: match[2].trim() };
};

const parsePublishedAt = (value: string, sourcePath: string): Date => {
  if (!ISO_DATE.test(value)) {
    throw new Error(`${sourcePath}: publishedAt must use YYYY-MM-DD`);
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error(`${sourcePath}: publishedAt must be a valid calendar date`);
  }
  return date;
};

const validateFrontmatter = (metadata: Record<string, unknown>, sourcePath: string): BlogFrontmatter => {
  const expected = new Set<string>([...STRING_FIELDS, "tags"]);
  for (const key of Object.keys(metadata)) {
    if (!expected.has(key)) {
      throw new Error(`${sourcePath}: unknown frontmatter field ${key}`);
    }
  }
  for (const key of STRING_FIELDS) {
    const value = metadata[key];
    if (typeof value !== "string" || value === "" || value !== value.trim()) {
      throw new Error(`${sourcePath}: ${key} must be a non-empty trimmed string`);
    }
  }
  if (!SAFE_SLUG.test(metadata.slug as string)) {
    throw new Error(`${sourcePath}: slug must be safe lowercase kebab-case`);
  }
  parsePublishedAt(metadata.publishedAt as string, sourcePath);

  if (
    !Array.isArray(metadata.tags) ||
    metadata.tags.length === 0 ||
    metadata.tags.some((tag) => typeof tag !== "string" || tag === "" || tag !== tag.trim())
  ) {
    throw new Error(`${sourcePath}: tags must be a non-empty JSON string array of trimmed strings`);
  }
  if (new Set(metadata.tags).size !== metadata.tags.length) {
    throw new Error(`${sourcePath}: tags must not contain duplicates`);
  }

  return metadata as BlogFrontmatter;
};

const decodePath = (value: string, sourcePath: string): string => {
  let decoded = value;
  for (let pass = 0; pass < 8; pass += 1) {
    let next: string;
    try {
      next = decodeURIComponent(decoded);
    } catch {
      throw new Error(`${sourcePath}: malformed URL encoding in ${value}`);
    }
    if (next === decoded) return decoded;
    decoded = next;
  }
  throw new Error(`${sourcePath}: excessively encoded URL path in ${value}`);
};

const validateUrl = (url: string, sourcePath: string): void => {
  if ([...url].some((character) => character.charCodeAt(0) <= 31 || character.charCodeAt(0) === 127)) {
    throw new Error(`${sourcePath}: control characters are not allowed in URLs`);
  }
  if (url.startsWith("#")) return;

  if (url.startsWith("//")) {
    throw new Error(`${sourcePath}: scheme-relative URLs are not allowed: ${url}`);
  }
  if (url.startsWith("/")) {
    const rawPath = url.split(/[?#]/, 1)[0];
    const decodedPath = decodePath(rawPath, sourcePath);
    if (decodedPath.startsWith("//") || decodedPath.includes("\\")) {
      throw new Error(`${sourcePath}: scheme-relative URLs are not allowed: ${url}`);
    }
    if (decodedPath.split("/").some((segment) => segment === "." || segment === "..")) {
      throw new Error(`${sourcePath}: route traversal is not allowed: ${url}`);
    }
    const parsed = new URL(url, BLOG_ORIGIN);
    if (parsed.origin !== BLOG_ORIGIN) {
      throw new Error(`${sourcePath}: root-relative URL escaped the site origin: ${url}`);
    }
    return;
  }

  if (!url.startsWith("https://")) {
    throw new Error(`${sourcePath}: unsafe link protocol in ${url}`);
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`${sourcePath}: malformed absolute URL: ${url}`);
  }
  if (parsed.protocol !== "https:") {
    throw new Error(`${sourcePath}: unsafe link protocol in ${url}`);
  }
};

export const renderBlogMarkdown = (markdown: string, sourcePath = "blog article"): string => {
  if (!markdown) {
    throw new Error(`${sourcePath}: article body must not be empty`);
  }
  const tokens = marked.lexer(markdown, { gfm: true });
  marked.walkTokens(tokens, (token: Token) => {
    if (token.type === "html") {
      throw new Error(`${sourcePath}: raw HTML is not allowed in Markdown content`);
    }
    if (token.type === "link" || token.type === "image") {
      validateUrl(token.href, sourcePath);
    }
  });
  return marked.parser(tokens, { gfm: true });
};

export const parseBlogMarkdown = (source: string, sourcePath = "article.md"): BlogArticle => {
  const { metadata, markdown } = parseFrontmatter(source, sourcePath);
  const frontmatter = validateFrontmatter(metadata, sourcePath);
  return {
    ...frontmatter,
    markdown,
    html: renderBlogMarkdown(markdown, sourcePath),
    canonicalUrl: `${BLOG_ORIGIN}/blog/${frontmatter.slug}`,
    sourcePath,
  };
};

export const toBlogArticleSummary = (article: BlogArticle): BlogArticleSummary => ({
  title: article.title,
  slug: article.slug,
  summary: article.summary,
  seoDescription: article.seoDescription,
  author: article.author,
  publishedAt: article.publishedAt,
  tags: article.tags,
  canonicalUrl: article.canonicalUrl,
});

type BlogSource = {
  filename: string;
  source: string;
  sourcePath: string;
};

const bundledBlogSources = (): BlogSource[] =>
  Object.entries(BUNDLED_BLOG_SOURCES)
    .map(([modulePath, source]) => {
      const filename = basename(modulePath);
      if (!filename.endsWith(".md")) {
        throw new Error(`content/blog/${filename}: unsupported blog content entry`);
      }
      return {
        filename,
        source,
        sourcePath: `content/blog/${filename}`,
      };
    })
    .sort((a, b) => a.filename.localeCompare(b.filename));

const fileBlogSources = async (contentRoot: string): Promise<BlogSource[]> => {
  const entries = (await readdir(contentRoot, { withFileTypes: true })).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      throw new Error(`${resolve(contentRoot, entry.name)}: unsupported blog content entry`);
    }
  }
  return Promise.all(
    entries.map(async (entry) => {
      const sourcePath = resolve(contentRoot, entry.name);
      return {
        filename: entry.name,
        source: await readFile(sourcePath, "utf8"),
        sourcePath,
      };
    }),
  );
};

export const loadBlogArticles = async (contentRoot = BLOG_CONTENT_ROOT): Promise<BlogArticle[]> => {
  const sourceFiles =
    contentRoot === BLOG_CONTENT_ROOT ? bundledBlogSources() : await fileBlogSources(contentRoot);
  const articles = sourceFiles.map(({ filename, source, sourcePath }) => ({
    article: parseBlogMarkdown(source, sourcePath),
    filename,
  }));

  const slugs = new Set<string>();
  for (const { article } of articles) {
    if (slugs.has(article.slug)) {
      throw new Error(`duplicate blog slug: ${article.slug}`);
    }
    slugs.add(article.slug);
  }
  for (const { article, filename } of articles) {
    if (filename !== `${article.slug}.md`) {
      throw new Error(`${article.sourcePath}: filename must match the frontmatter slug (${article.slug}.md)`);
    }
  }

  return articles
    .map(({ article }) => article)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug));
};

export const loadLatestBlogArticle = async (
  contentRoot = BLOG_CONTENT_ROOT,
): Promise<BlogArticleSummary | null> => {
  const [article] = await loadBlogArticles(contentRoot);
  return article ? toBlogArticleSummary(article) : null;
};

export const getBlogArticle = async (
  slug: string,
  contentRoot = BLOG_CONTENT_ROOT,
): Promise<BlogArticle | undefined> => {
  if (!SAFE_SLUG.test(slug)) return undefined;
  return (await loadBlogArticles(contentRoot)).find((article) => article.slug === slug);
};

const escapeXml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const renderBlogRss = (articles: BlogArticle[]): string => {
  const items = [...articles]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug))
    .map(
      (article) => `\t\t<item>
\t\t\t<title>${escapeXml(article.title)}</title>
\t\t\t<link>${escapeXml(article.canonicalUrl)}</link>
\t\t\t<guid isPermaLink="true">${escapeXml(article.canonicalUrl)}</guid>
\t\t\t<description>${escapeXml(article.summary)}</description>
\t\t\t<dc:creator>${escapeXml(article.author)}</dc:creator>
\t\t\t<pubDate>${parsePublishedAt(article.publishedAt, article.sourcePath).toUTCString()}</pubDate>
${article.tags.map((tag) => `\t\t\t<category>${escapeXml(tag)}</category>`).join("\n")}
\t\t</item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
\t<channel>
\t\t<title>Link42 Blog</title>
\t\t<link>${BLOG_ORIGIN}/blog</link>
\t\t<description>Security commentary from Link42.</description>
\t\t<language>en-AU</language>
${items}
\t</channel>
</rss>
`;
};
