import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const pageDefinitions = [
  {
    file: "src/routes/+page.svelte",
    title: "link42 — Cyber without the theatre",
    description:
      "link42 builds tools for people who actually do security. No dashboards of dashboards. No compliance theatre. Just things that work.",
    canonical: "https://link42.app",
    heading: "Security tooling that starts useful",
  },
  {
    file: "src/routes/about/+page.svelte",
    title: "About — link42",
    description:
      "About link42 — Australian-built security tools for practitioners, built with AI assistance and human accountability.",
    canonical: "https://link42.app/about",
    heading: "About",
  },
  {
    file: "src/routes/changelog/+page.svelte",
    title: "Changelog — link42",
    description: "Changes to the public link42 website, most recent first.",
    canonical: "https://link42.app/changelog",
    heading: "Changelog",
  },
  {
    file: "src/routes/licence/+page.svelte",
    title: "Licence — link42",
    description:
      "Licensing for the link42 website software, original editorial content, brand assets, and third-party material.",
    canonical: "https://link42.app/licence",
    heading: "Licence",
  },
];

const read = (relativePath) => fs.readFile(path.join(root, relativePath), "utf8");

test("company pages carry exact metadata and one primary heading", async () => {
  for (const page of pageDefinitions) {
    const source = await read(page.file);
    assert.ok(source.includes(`<title>${page.title}</title>`), page.file);
    assert.ok(source.includes(`content="${page.description}"`), page.file);
    assert.ok(source.includes(`rel="canonical" href="${page.canonical}"`), page.file);
    assert.equal((source.match(/<h1(?:\s|>)/g) ?? []).length, 1, page.file);
    assert.ok(source.includes(page.heading), page.file);
  }
});

test("company pages expose only durable product and repository links", async () => {
  const sources = await Promise.all(pageDefinitions.map(({ file }) => read(file)));
  const shell = await Promise.all([
    read("src/lib/components/SiteHeader.svelte"),
    read("src/lib/components/SiteFooter.svelte"),
  ]);
  const combined = [...sources, ...shell].join("\n");

  for (const href of [
    "https://rule1.link42.app",
    "https://github.com/link42-au/rule1",
    "https://github.com/link42-au/link42",
  ]) {
    assert.ok(combined.includes(`href="${href}"`), href);
  }

  assert.doesNotMatch(combined, /href=["']\/(?:api|reports|investigations)(?:[/"'])/);
  assert.doesNotMatch(combined, /href=["'][^"']*(?:login2|patch8|threat10)/i);
  assert.doesNotMatch(combined, /github\.com\/wan0net\/link42/);
});

test("company pages do not expose excluded executable private surfaces", async () => {
  const combined = (await Promise.all(pageDefinitions.map(({ file }) => read(file)))).join("\n");

  for (const denied of [
    /href=["']\/(?:api|reports|investigations)(?:["'])/i,
    /from\s+["'][^"']*(?:auth|api|session|login2)[^"']*["']/i,
  ]) {
    assert.doesNotMatch(combined, denied);
  }
});

test("homepage keeps the migrated public information architecture", async () => {
  const source = await read("src/routes/+page.svelte");

  for (const required of [
    'class="hero"',
    "Australian-built security tooling",
    'href="#products"',
    'class="latest-article"',
    'class="manifesto"',
    'id="products"',
    'class="principles"',
    'class="cta"',
    'class="ai-notice"',
    "What we're building",
    "One integrated platform",
    "AI-generated content",
    "rule1.link42.app",
    "threat10",
    "patch8",
  ]) {
    assert.ok(source.includes(required), required);
  }

  assert.equal((source.match(/class="product-card(?:\s|")/g) ?? []).length, 3);
  assert.equal((source.match(/class="product-card product-card--disabled"/g) ?? []).length, 2);
});

test("licence page states each approved boundary without widening it", async () => {
  const source = await read("src/routes/licence/+page.svelte");
  for (const required of [
    "Copyright © Iain Dickson",
    "AGPL-3.0-only",
    "CC BY-NC 4.0",
    "name, logos, and other brand identifiers are reserved",
    "Third-party material retains its original copyright and licence",
    "Rule1 is a separate project",
  ]) {
    assert.ok(source.includes(required), required);
  }

  assert.doesNotMatch(source, /all link42 platform applications/i);
  assert.doesNotMatch(source, /commercial licensing|bulk data access|API integration/i);
});

test("changelog is website-specific and deliberately starts unreleased", async () => {
  const source = await read("src/routes/changelog/+page.svelte");
  assert.ok(source.includes("Unreleased"));
  assert.ok(source.includes("Independent website"));
  assert.match(source, /Product-specific updates stay with each\s+product/);
  assert.equal((source.match(/class="release"/g) ?? []).length, 1);
  assert.doesNotMatch(source, /\b(?:FREE|PAID)\b|admin|credential|session cookie|feed count/i);
});
