import { access, lstat, readdir, readFile } from "node:fs/promises";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assertValidDocumentGraph } from "./check-links.mjs";

const REPOSITORY_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BUILD_ROOT = resolve(REPOSITORY_ROOT, "build");
const ARTICLE_SLUG = "irap-assessed-not-certified-or-accredited";

export const HTML_ROUTES = [
  "/",
  "/about",
  "/changelog",
  "/licence",
  "/learn",
  "/learn/frameworks",
  "/learn/frameworks/ism",
  "/learn/frameworks/ism/e8",
  "/learn/frameworks/ism/irap",
  "/learn/frameworks/nzism",
  "/learn/frameworks/picerl",
  "/learn/risk",
  "/learn/risk/methodology",
  "/learn/threat",
  "/learn/threat/mitre-attack",
  "/learn/threat/stix-taxii",
  "/learn/vulnerability",
  "/learn/vulnerability/cvss",
  "/learn/vulnerability/epss",
  "/blog",
  `/blog/${ARTICLE_SLUG}`,
];

export const ABSENT_ROUTES = [
  "/api",
  "/api/example",
  "/reports",
  "/reports/example",
  "/investigations",
  "/investigations/example",
  "/blog/does-not-exist",
];

const REQUIRED_STATIC_ASSETS = [
  "/.nojekyll",
  "/404.html",
  "/favicon.svg",
  "/logo-dark.svg",
  "/logo-light.svg",
  "/fonts/Geist-Variable.woff2",
  "/fonts/GeistMono-Variable.woff2",
  "/fonts/OFL.txt",
];

const toBuildPath = (pathname) => {
  if (pathname === "/") return resolve(BUILD_ROOT, "index.html");
  const relativePath = pathname.replace(/^\/+|\/+$/gu, "");
  const basename = relativePath.split("/").at(-1) ?? "";
  return extname(relativePath) || basename.startsWith(".")
    ? resolve(BUILD_ROOT, relativePath)
    : resolve(BUILD_ROOT, relativePath, "index.html");
};

const assertInsideBuild = (path) => {
  const relativePath = relative(BUILD_ROOT, path);
  if (relativePath === "" || relativePath.startsWith("..") || relativePath.startsWith("/")) {
    throw new Error(`${path}: artifact path escapes build root`);
  }
};

const readArtifact = async (pathname, label = pathname) => {
  const path = toBuildPath(pathname);
  assertInsideBuild(path);
  const stats = await lstat(path).catch(() => null);
  if (!stats?.isFile() || stats.isSymbolicLink()) {
    throw new Error(`${label}: missing regular static artifact ${relative(BUILD_ROOT, path)}`);
  }
  return readFile(path);
};

const assertRouteAbsent = async (route) => {
  const relativePath = route.replace(/^\/+|\/+$/gu, "");
  const candidates = [
    resolve(BUILD_ROOT, relativePath),
    resolve(BUILD_ROOT, `${relativePath}.html`),
    resolve(BUILD_ROOT, relativePath, "index.html"),
  ];
  for (const candidate of candidates) {
    assertInsideBuild(candidate);
    try {
      await access(candidate);
      throw new Error(`${route}: excluded route produced ${relative(BUILD_ROOT, candidate)}`);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") continue;
      throw error;
    }
  }
};

const listArtifactFiles = async (directory = BUILD_ROOT) => {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`${relative(BUILD_ROOT, path)}: symbolic links are not allowed in the artifact`);
    }
    if (entry.isDirectory()) files.push(...(await listArtifactFiles(path)));
    else if (entry.isFile()) files.push(path);
  }
  return files;
};

export const checkBuiltRoutes = async () => {
  const documents = new Map();
  for (const route of HTML_ROUTES) {
    const html = (await readArtifact(route)).toString("utf8");
    if (!html.startsWith("<!doctype html>")) {
      throw new Error(`${route}: expected a prerendered HTML document`);
    }
    documents.set(route, html);
  }

  const rssBody = (await readArtifact("/blog/rss.xml")).toString("utf8");
  if (!rssBody.startsWith('<?xml version="1.0" encoding="UTF-8"?>') || !rssBody.includes(ARTICLE_SLUG)) {
    throw new Error("/blog/rss.xml: missing expected XML declaration or current article");
  }

  for (const asset of REQUIRED_STATIC_ASSETS) await readArtifact(asset, asset);
  await access(resolve(BUILD_ROOT, "CNAME")).then(
    () => {
      throw new Error("CNAME: must not be generated before custom-domain configuration is approved");
    },
    (error) => {
      if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error;
    },
  );
  await access(resolve(BUILD_ROOT, "index.js")).then(
    () => {
      throw new Error("index.js: adapter-node server output must not be present");
    },
    (error) => {
      if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error;
    },
  );

  const internalTargets = assertValidDocumentGraph(documents);
  for (const target of internalTargets) {
    const pathname = new URL(target, "https://link42.app").pathname;
    await readArtifact(pathname, target);
  }
  for (const route of ABSENT_ROUTES) await assertRouteAbsent(route);

  const artifactFiles = await listArtifactFiles();
  if (!artifactFiles.some((path) => path.endsWith(".js"))) {
    throw new Error("static artifact has no generated JavaScript assets");
  }
  if (!artifactFiles.some((path) => path.endsWith(".css"))) {
    throw new Error("static artifact has no generated CSS assets");
  }

  return {
    checkedArtifactFiles: artifactFiles.length,
    checkedHtmlRoutes: documents.size,
    checkedInternalTargets: internalTargets.size,
    checkedMissingRoutes: ABSENT_ROUTES.length,
  };
};

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    const result = await checkBuiltRoutes();
    console.log(
      `Static artifact verification passed: ${result.checkedHtmlRoutes} HTML routes, RSS, ${result.checkedInternalTargets} internal targets, ${result.checkedMissingRoutes} absent routes, and ${result.checkedArtifactFiles} files.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
