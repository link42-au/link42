import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { marked, type Token } from "marked";

const REPOSITORY_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const LEARN_CONTENT_ROOT = resolve(REPOSITORY_ROOT, "content/learn");
export const LEARN_ROUTES_ROOT = resolve(REPOSITORY_ROOT, "src/routes/learn");
const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;

export type ReviewStatus = "verified" | "unverified";

export type LearnFrontmatter = {
  title: string;
  slug: string;
  subtitle: string;
  seoDescription: string;
  navigationOrder: number;
  category: string;
  reviewStatus: ReviewStatus;
};

export type LearnSection = {
  tag: string;
  title: string;
  factualMarkdown: string;
  satiricalMarkdown: string;
  factualHtml: string;
  satiricalHtml: string;
};

export type LearnPage = LearnFrontmatter & {
  sections: LearnSection[];
  sourcePath: string;
};

const REQUIRED_STRING_FIELDS = ["title", "slug", "subtitle", "seoDescription", "category"] as const;

const parseFrontmatter = (
  source: string,
  sourcePath: string,
): { metadata: Record<string, unknown>; body: string } => {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${sourcePath}: expected JSON-valued frontmatter between --- delimiters`);

  const metadata: Record<string, unknown> = {};
  for (const [index, line] of match[1].split("\n").entries()) {
    const field = line.match(/^([A-Za-z][A-Za-z0-9]*):\s+(.+)$/);
    if (!field) throw new Error(`${sourcePath}:${index + 2}: invalid frontmatter line`);
    if (field[1] in metadata) throw new Error(`${sourcePath}: duplicate frontmatter field ${field[1]}`);
    try {
      metadata[field[1]] = JSON.parse(field[2]);
    } catch {
      throw new Error(`${sourcePath}:${index + 2}: ${field[1]} must be a valid JSON value`);
    }
  }
  return { metadata, body: match[2] };
};

const validateFrontmatter = (metadata: Record<string, unknown>, sourcePath: string): LearnFrontmatter => {
  const expected = new Set([...REQUIRED_STRING_FIELDS, "navigationOrder", "reviewStatus"]);
  for (const key of Object.keys(metadata)) {
    if (!expected.has(key as never)) throw new Error(`${sourcePath}: unknown frontmatter field ${key}`);
  }
  for (const key of REQUIRED_STRING_FIELDS) {
    if (typeof metadata[key] !== "string" || metadata[key].trim() === "") {
      throw new Error(`${sourcePath}: ${key} must be a non-empty string`);
    }
  }
  if (
    typeof metadata.navigationOrder !== "number" ||
    !Number.isInteger(metadata.navigationOrder) ||
    metadata.navigationOrder < 0
  ) {
    throw new Error(`${sourcePath}: navigationOrder must be a non-negative integer`);
  }
  if (metadata.reviewStatus !== "verified" && metadata.reviewStatus !== "unverified") {
    throw new Error(`${sourcePath}: reviewStatus must be verified or unverified`);
  }
  if (!SAFE_SLUG.test(metadata.slug as string)) {
    throw new Error(`${sourcePath}: slug must contain only safe lowercase route segments`);
  }
  return metadata as LearnFrontmatter;
};

const validateUrl = (url: string, sourcePath: string): void => {
  if (url.startsWith("//")) throw new Error(`${sourcePath}: scheme-relative links are not allowed: ${url}`);
  if (url.startsWith("/") || url.startsWith("#")) return;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`${sourcePath}: links must be root-relative, anchors, or absolute HTTPS URLs: ${url}`);
  }
  if (parsed.protocol !== "https:") throw new Error(`${sourcePath}: unsafe link protocol in ${url}`);
};

export const renderMarkdown = (markdown: string, sourcePath = "content"): string => {
  const tokens = marked.lexer(markdown, { gfm: true });
  marked.walkTokens(tokens, (token: Token) => {
    if (token.type === "html") throw new Error(`${sourcePath}: raw HTML is not allowed in Markdown content`);
    if (token.type === "link" || token.type === "image") validateUrl(token.href, sourcePath);
  });
  return marked.parser(tokens, { gfm: true });
};

export const parseLearnMarkdown = (source: string, sourcePath = "content.md"): LearnPage => {
  const { metadata, body } = parseFrontmatter(source.replaceAll("\r\n", "\n"), sourcePath);
  const frontmatter = validateFrontmatter(metadata, sourcePath);
  const sectionPattern =
    /^:::section (\{.+\})\n:::factual\n([\s\S]*?)^:::satirical\n([\s\S]*?)^:::endsection\s*$/gm;
  const sections: LearnSection[] = [];
  let consumedBody = body;

  for (const match of body.matchAll(sectionPattern)) {
    let heading: unknown;
    try {
      heading = JSON.parse(match[1]);
    } catch {
      throw new Error(`${sourcePath}: section metadata must be valid JSON`);
    }
    if (
      typeof heading !== "object" ||
      heading === null ||
      Object.keys(heading).sort().join(",") !== "tag,title" ||
      typeof (heading as { tag?: unknown }).tag !== "string" ||
      !(heading as { tag: string }).tag.trim() ||
      typeof (heading as { title?: unknown }).title !== "string" ||
      !(heading as { title: string }).title.trim()
    ) {
      throw new Error(`${sourcePath}: each section needs exactly non-empty tag and title strings`);
    }
    const factualMarkdown = match[2].trim();
    const satiricalMarkdown = match[3].trim();
    if (!factualMarkdown || !satiricalMarkdown)
      throw new Error(`${sourcePath}: each section needs both content flavours`);
    sections.push({
      tag: (heading as { tag: string }).tag,
      title: (heading as { title: string }).title,
      factualMarkdown,
      satiricalMarkdown,
      factualHtml: renderMarkdown(factualMarkdown, sourcePath),
      satiricalHtml: renderMarkdown(satiricalMarkdown, sourcePath),
    });
    consumedBody = consumedBody.replace(match[0], "");
  }
  if (sections.length === 0) throw new Error(`${sourcePath}: at least one section is required`);
  if (consumedBody.trim()) throw new Error(`${sourcePath}: content exists outside a valid section block`);
  return { ...frontmatter, sections, sourcePath };
};

const serializeForScript = (value: unknown): string => JSON.stringify(value).replaceAll("<", "\\u003c");

export const renderLearnPage = (page: LearnPage): string => {
  const pageData = serializeForScript({
    title: page.title,
    subtitle: page.subtitle,
    seoDescription: page.seoDescription,
    slug: page.slug,
    reviewStatus: page.reviewStatus,
  });
  const sections = serializeForScript(
    page.sections.map(({ tag, title, factualHtml, satiricalHtml }) => ({
      tag,
      title,
      factualHtml,
      satiricalHtml,
    })),
  );
  return `<!-- GENERATED FROM MARKDOWN — DO NOT EDIT DIRECTLY -->
<!-- Source: content/learn/${page.slug}.md; run: pnpm generate:content -->
<!-- biome-ignore format: generated data must remain byte-for-byte deterministic -->
<script>
import { getContext } from "svelte";

// biome-ignore lint/correctness/noUnusedVariables: used in Svelte template conditionals
const getFlavour = getContext("flavour");
// biome-ignore format: generated data must remain byte-for-byte deterministic
const page = ${pageData};
// biome-ignore format: generated data must remain byte-for-byte deterministic
const sections = ${sections};
</script>

<svelte:head>
	<title>{page.title} — Learn — link42</title>
	<meta name="description" content={page.seoDescription} />
	<meta property="og:title" content={\`\${page.title} — Learn — link42\`} />
	<meta property="og:description" content={page.seoDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={\`https://link42.app/learn/${page.slug}\`} />
	<meta property="og:site_name" content="Link42" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={\`\${page.title} — Learn — link42\`} />
	<meta name="twitter:description" content={page.seoDescription} />
	<link rel="canonical" href={\`https://link42.app/learn/${page.slug}\`} />
</svelte:head>

<div class="cl-main" data-verified={page.reviewStatus === "verified" ? "true" : "false"}>
	<span class="visually-hidden">
		Content review status: {page.reviewStatus === "verified" ? "Organic Reviewed" : "AI-generated"}
	</span>
	<h1 class="cl-title">{page.title}</h1>
	<p class="cl-sub">{page.subtitle}</p>

	{#each sections as section, index}
		<div class="lic-section" class:lic-section-last={index === sections.length - 1}>
			<div class="lic-tag">{section.tag}</div>
			<h2>{section.title}</h2>
			{#if getFlavour() === "factual"}
				{@html section.factualHtml}
			{:else}
				{@html section.satiricalHtml}
			{/if}
		</div>
	{/each}
</div>
`;
};

const listMarkdownFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map((entry) => {
      if (entry.isDirectory()) return listMarkdownFiles(resolve(directory, entry.name));
      if (entry.isFile()) return [resolve(directory, entry.name)];
      throw new Error(`unsupported Learn content entry: ${resolve(directory, entry.name)}`);
    }),
  );
  return paths
    .flat()
    .filter((path) => path.endsWith(".md") && !path.endsWith("/README.md"))
    .sort();
};

const listRouteFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map((entry) => {
      if (entry.isDirectory()) return listRouteFiles(resolve(directory, entry.name));
      if (entry.isSymbolicLink())
        throw new Error(`symbolic links are not allowed in Learn routes: ${entry.name}`);
      return entry.isFile() && entry.name === "+page.svelte" ? [resolve(directory, entry.name)] : [];
    }),
  );
  return paths.flat().sort();
};

export const loadLearnPages = async (contentRoot = LEARN_CONTENT_ROOT): Promise<LearnPage[]> => {
  const pages = await Promise.all(
    (await listMarkdownFiles(contentRoot)).map(async (sourcePath) => {
      const page = parseLearnMarkdown(
        await readFile(sourcePath, "utf8"),
        relative(REPOSITORY_ROOT, sourcePath),
      );
      const routeFromFilename = relative(contentRoot, sourcePath).replaceAll("\\", "/").replace(/\.md$/, "");
      if (page.slug !== routeFromFilename) {
        throw new Error(
          `${page.sourcePath}: slug ${page.slug} does not match source route ${routeFromFilename}`,
        );
      }
      return page;
    }),
  );
  const seen = new Set<string>();
  for (const page of pages) {
    if (seen.has(page.slug)) throw new Error(`duplicate Learn slug: ${page.slug}`);
    seen.add(page.slug);
  }
  return pages.sort((a, b) => a.navigationOrder - b.navigationOrder || a.slug.localeCompare(b.slug));
};

export const generateLearnContent = async ({
  check = false,
  contentRoot = LEARN_CONTENT_ROOT,
  routesRoot = LEARN_ROUTES_ROOT,
}: {
  check?: boolean;
  contentRoot?: string;
  routesRoot?: string;
} = {}): Promise<LearnPage[]> => {
  const pages = await loadLearnPages(contentRoot);
  const drift: string[] = [];
  const expectedOutputs = new Set(pages.map((page) => resolve(routesRoot, page.slug, "+page.svelte")));
  const overviewPath = resolve(routesRoot, "+page.svelte");
  const routeFiles = await listRouteFiles(routesRoot).catch(() => []);
  for (const routeFile of routeFiles) {
    if (routeFile !== overviewPath && !expectedOutputs.has(routeFile)) {
      drift.push(relative(routesRoot, routeFile));
    }
  }
  if (drift.length && !check)
    throw new Error(
      `orphan Learn routes must be removed before generation:\n${drift.map((path) => `- ${path}`).join("\n")}`,
    );
  for (const page of pages) {
    const outputPath = resolve(routesRoot, page.slug, "+page.svelte");
    const expected = renderLearnPage(page);
    if (check) {
      const actual = await readFile(outputPath, "utf8").catch(() => "");
      if (actual !== expected) drift.push(relative(REPOSITORY_ROOT, outputPath));
    } else {
      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, expected, "utf8");
    }
  }
  if (drift.length)
    throw new Error(`generated Learn routes are stale:\n${drift.map((path) => `- ${path}`).join("\n")}`);
  return pages;
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await generateLearnContent({ check: process.argv.includes("--check") });
}
