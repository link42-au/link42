import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { createServer } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assertValidDocumentGraph } from "./check-links.mjs";

const REPOSITORY_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "127.0.0.1";
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

const reservePort = async () => {
  const server = createServer();
  await new Promise((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(0, HOST, resolveListen);
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("could not reserve a local test port");
  await new Promise((resolveClose, reject) =>
    server.close((error) => (error ? reject(error) : resolveClose())),
  );
  return address.port;
};

const waitForServer = async (origin, child, output) => {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`built website server exited with ${child.exitCode}\n${output.join("")}`);
    }
    try {
      const response = await fetch(origin, { redirect: "manual" });
      if (response.status === 200) return;
    } catch {
      // The server has not bound its local port yet.
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 100));
  }
  throw new Error(`timed out waiting for built website server\n${output.join("")}`);
};

const stopServer = async (child) => {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    new Promise((resolveExit) => child.once("exit", resolveExit)),
    new Promise((resolveTimeout) => setTimeout(resolveTimeout, 5_000)),
  ]);
  if (child.exitCode === null) child.kill("SIGKILL");
};

const fetchLocal = async (origin, target) => fetch(`${origin}${target}`, { redirect: "manual" });

export const checkBuiltRoutes = async () => {
  await access(resolve(REPOSITORY_ROOT, "build/index.js"));
  const port = await reservePort();
  const origin = `http://${HOST}:${port}`;
  const output = [];
  const child = spawn(process.execPath, ["build/index.js"], {
    cwd: REPOSITORY_ROOT,
    env: { ...process.env, HOST, ORIGIN: origin, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (chunk) => output.push(chunk.toString()));
  child.stderr.on("data", (chunk) => output.push(chunk.toString()));

  try {
    await waitForServer(origin, child, output);
    const documents = new Map();
    for (const route of HTML_ROUTES) {
      const response = await fetchLocal(origin, route);
      if (response.status !== 200) throw new Error(`${route}: expected 200, received ${response.status}`);
      if (!response.headers.get("content-type")?.startsWith("text/html")) {
        throw new Error(`${route}: expected an HTML response`);
      }
      documents.set(route, await response.text());
    }

    const rss = await fetchLocal(origin, "/blog/rss.xml");
    if (rss.status !== 200) throw new Error(`/blog/rss.xml: expected 200, received ${rss.status}`);
    if (rss.headers.get("content-type") !== "application/rss+xml; charset=utf-8") {
      throw new Error("/blog/rss.xml: unexpected content type");
    }
    const rssBody = await rss.text();
    if (!rssBody.startsWith('<?xml version="1.0" encoding="UTF-8"?>') || !rssBody.includes(ARTICLE_SLUG)) {
      throw new Error("/blog/rss.xml: missing expected XML declaration or current article");
    }

    const internalTargets = assertValidDocumentGraph(documents);
    for (const target of internalTargets) {
      const response = await fetchLocal(origin, target);
      if (response.status !== 200) {
        throw new Error(`${target}: linked internal target returned ${response.status}`);
      }
    }
    for (const route of ABSENT_ROUTES) {
      const response = await fetchLocal(origin, route);
      if (response.status !== 404) throw new Error(`${route}: expected 404, received ${response.status}`);
    }

    return {
      checkedHtmlRoutes: documents.size,
      checkedInternalTargets: internalTargets.size,
      checkedMissingRoutes: ABSENT_ROUTES.length,
    };
  } finally {
    await stopServer(child);
  }
};

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    const result = await checkBuiltRoutes();
    console.log(
      `Route verification passed: ${result.checkedHtmlRoutes} HTML routes, RSS, ${result.checkedInternalTargets} internal targets, and ${result.checkedMissingRoutes} expected 404 routes.`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
