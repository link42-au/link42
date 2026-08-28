import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import config, { PRERENDER_ENTRIES } from "../svelte.config.js";

const EXPECTED_PRERENDER_ENTRIES = [
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
  "/blog/irap-assessed-not-certified-or-accredited",
  "/blog/rss.xml",
];

test("static configuration names every public endpoint and fails closed", async () => {
  const source = await fs.readFile(new URL("../svelte.config.js", import.meta.url), "utf8");

  assert.deepEqual(PRERENDER_ENTRIES, EXPECTED_PRERENDER_ENTRIES);
  assert.deepEqual(config.kit.prerender.entries, EXPECTED_PRERENDER_ENTRIES);
  assert.equal(config.kit.prerender.handleHttpError, "fail");
  assert.equal(config.kit.prerender.handleMissingId, "fail");
  assert.match(source, /adapter-static/);
  assert.match(source, /fallback: "404\.html"/);
  assert.match(source, /strict: true/);
  assert.doesNotMatch(source, /adapter-node/);
});

test("route metadata emits domain-root directories and a real RSS file", async () => {
  const layout = await fs.readFile(new URL("../src/routes/+layout.ts", import.meta.url), "utf8");
  const rss = await fs.readFile(new URL("../src/routes/blog/rss.xml/+server.ts", import.meta.url), "utf8");

  assert.match(layout, /export const prerender = true/);
  assert.match(layout, /export const trailingSlash = "always"/);
  assert.match(rss, /export const prerender = true/);
  assert.match(rss, /export const trailingSlash = "never"/);
});

test("Pages metadata suppresses Jekyll without claiming a custom domain", async () => {
  assert.equal(await fs.readFile(new URL("../static/.nojekyll", import.meta.url), "utf8"), "");
  await assert.rejects(() => fs.access(new URL("../static/CNAME", import.meta.url)), { code: "ENOENT" });
});
