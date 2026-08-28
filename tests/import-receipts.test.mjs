import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { validateImportReceipts } from "../scripts/check-import-receipts.mjs";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const readJson = async (relativePath) => JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));

const [manifest, importReceipts, legacyReceipts, publicTreePolicy] = await Promise.all([
  readJson("provenance/source-manifest.json"),
  readJson("provenance/import-receipts.json"),
  readJson("provenance/source-receipts.json"),
  readJson("provenance/public-tree-policy.json"),
]);

const copy = (value) => structuredClone(value);

test("exact import receipts cover legacy imports and generated routes", async () => {
  const result = await validateImportReceipts(
    root,
    manifest,
    importReceipts,
    legacyReceipts,
    publicTreePolicy,
  );
  assert.equal(result.legacyPairs, legacyReceipts.receipts.length);
  assert.equal(result.generated, 14);
  assert.equal(result.receipts, result.legacyPairs + result.generated);
});

test("import receipts fail closed on destination drift", async () => {
  const changed = copy(importReceipts);
  changed.receipts[0].destinationSha256 = "0".repeat(64);
  await assert.rejects(
    () => validateImportReceipts(root, manifest, changed, legacyReceipts, publicTreePolicy),
    /destination checksum drift/,
  );
});

test("import receipts require exact legacy and generated coverage", async () => {
  const missingLegacy = copy(importReceipts);
  missingLegacy.receipts = missingLegacy.receipts.filter(
    (receipt) => receipt.destinationPath !== "static/favicon.svg",
  );
  await assert.rejects(
    () => validateImportReceipts(root, manifest, missingLegacy, legacyReceipts, publicTreePolicy),
    /legacy source receipt is not covered exactly/,
  );

  const missingGenerated = copy(importReceipts);
  missingGenerated.receipts = missingGenerated.receipts.filter(
    (receipt) => receipt.destinationPath !== "src/routes/learn/frameworks/+page.svelte",
  );
  await assert.rejects(
    () => validateImportReceipts(root, manifest, missingGenerated, legacyReceipts, publicTreePolicy),
    /generated destination receipt coverage is incomplete/,
  );
});

test("import receipts reject a private or undeclared source path", async () => {
  const changed = copy(importReceipts);
  changed.receipts[0].sourcePath = "src/hooks.server.ts";
  await assert.rejects(
    () => validateImportReceipts(root, manifest, changed, legacyReceipts, publicTreePolicy),
    /outside an approved boundary/,
  );
});
