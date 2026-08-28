import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import {
  EXPECTED_DESTINATION_REPOSITORY,
  EXPECTED_SOURCE_COMMIT,
  EXPECTED_SOURCE_REPOSITORY,
  assertDirectSourceInputs,
  matchesAny,
  validateSourceManifest,
} from "../scripts/lib/policy.mjs";

const manifest = JSON.parse(
  await fs.readFile(new URL("../provenance/source-manifest.json", import.meta.url), "utf8"),
);

test("manifest is pinned to the approved source and destination", () => {
  validateSourceManifest(manifest);
  assert.equal(manifest.sourceRepository, EXPECTED_SOURCE_REPOSITORY);
  assert.equal(manifest.sourceCommit, EXPECTED_SOURCE_COMMIT);
  assert.equal(manifest.destinationRepository, EXPECTED_DESTINATION_REPOSITORY);
});

test("direct source allow-list accepts exact and wildcard-approved paths", () => {
  assertDirectSourceInputs(manifest, [
    "src/app.html",
    "content/blog/example.md",
    "content/learn/example.md",
    "content/learn/topic/example.md",
    "src/routes/blog/example/+page.svelte",
  ]);
});

test("direct source allow-list fails closed", () => {
  for (const relativePath of [
    "package.json",
    "src/hooks.server.ts",
    "src/routes/api/private/+server.ts",
    "src/routes/investigations/+page.svelte",
    "src/routes/blog/.env.production",
    "src/routes/blog/signing-key.pem",
    "../outside.txt",
  ]) {
    assert.throws(() => assertDirectSourceInputs(manifest, [relativePath]), /not directly allow-listed|traversal/);
  }
});

test("glob matching does not widen across path segments", () => {
  assert.equal(matchesAny("content/blog/post.md", ["content/blog/*.md"]), true);
  assert.equal(matchesAny("content/blog/nested/post.md", ["content/blog/*.md"]), false);
  assert.equal(matchesAny("content/learn/nested/post.md", ["content/learn/**/*.md"]), true);
});

test("manifest validation rejects source identity drift", () => {
  assert.throws(
    () => validateSourceManifest({ ...manifest, sourceCommit: "b".repeat(40) }),
    /approved immutable baseline/,
  );
  assert.throws(
    () => validateSourceManifest({ ...manifest, destinationRepository: "https://github.com/example/wrong" }),
    /approved destination/,
  );
});
