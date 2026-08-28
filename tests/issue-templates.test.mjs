import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => fs.readFile(path.join(root, relativePath), "utf8");

const BUG_URL = "https://github.com/link42-au/link42/issues/new?template=bug_report.yml";
const SUGGESTION_URL = "https://github.com/link42-au/link42/issues/new?template=feature_request.yml";
const SECURITY_URL = "https://github.com/link42-au/link42/security/advisories/new";

test("README describes the live host and actual static technology", async () => {
  const source = await read("README.md");
  for (const required of [
    "https://link42.app",
    "https://github.com/link42-au",
    "TypeScript and Svelte",
    "SvelteKit",
    "@sveltejs/adapter-static",
    "GitHub Actions",
    "GitHub Pages",
    "Playwright and axe-core",
  ]) {
    assert.ok(source.includes(required), required);
  }
});

test("repository guidance exposes durable public and private report routes", async () => {
  for (const file of ["README.md", "CONTRIBUTING.md"]) {
    const source = await read(file);
    assert.ok(source.includes(BUG_URL), `${file} bug report URL`);
    assert.ok(source.includes(SUGGESTION_URL), `${file} suggestion URL`);
    assert.ok(source.includes(SECURITY_URL), `${file} private security URL`);
    assert.match(source, /Do not|Never/i, `${file} warns against public security details`);
  }
});

test("issue forms collect actionable details and apply existing labels", async () => {
  const bug = await read(".github/ISSUE_TEMPLATE/bug_report.yml");
  const suggestion = await read(".github/ISSUE_TEMPLATE/feature_request.yml");

  for (const required of [
    "labels:\n  - bug",
    "id: page",
    "id: problem",
    "id: reproduce",
    "id: expected",
    "id: environment",
    "I have searched existing issues",
  ]) {
    assert.ok(bug.includes(required), `bug form: ${required}`);
  }

  for (const required of [
    "labels:\n  - enhancement",
    "id: problem",
    "id: outcome",
    "id: proposal",
    "id: alternatives",
    "I have searched existing issues",
  ]) {
    assert.ok(suggestion.includes(required), `suggestion form: ${required}`);
  }
});

test("issue chooser disables blank reports and directs security reports privately", async () => {
  const config = await read(".github/ISSUE_TEMPLATE/config.yml");
  assert.ok(config.includes("blank_issues_enabled: false"));
  assert.ok(config.includes(SECURITY_URL));
  assert.ok(config.includes("https://link42.app/"));
  assert.match(config, /Do not disclose vulnerability details in a public issue\./);
});
