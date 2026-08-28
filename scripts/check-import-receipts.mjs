import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { matchesAny, validatePortableRelativePath, validateSourceManifest } from "./lib/policy.mjs";

const SHA1_PATTERN = /^[0-9a-f]{40}$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const MODES = new Set(["copied", "adapted", "generated"]);

const digestFile = async (filePath) => {
  const content = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
};

const legacyMode = (mode) => (mode === "verbatim" ? "copied" : "adapted");
const receiptKey = ({ sourcePath, destinationPath, mode }) => `${mode}\0${sourcePath}\0${destinationPath}`;

export const validateImportReceipts = async (
  repositoryRoot,
  manifest,
  importReceipts,
  legacyReceipts,
  publicTreePolicy,
) => {
  validateSourceManifest(manifest);
  if (
    importReceipts.schemaVersion !== 1 ||
    importReceipts.sourceRepository !== manifest.sourceRepository ||
    importReceipts.sourceCommit !== manifest.sourceCommit ||
    !Array.isArray(importReceipts.receipts) ||
    importReceipts.receipts.length === 0
  ) {
    throw new Error("invalid import receipt identity or schema");
  }
  if (
    legacyReceipts.schemaVersion !== 1 ||
    legacyReceipts.sourceRepository !== manifest.sourceRepository ||
    legacyReceipts.sourceCommit !== manifest.sourceCommit ||
    !Array.isArray(legacyReceipts.receipts)
  ) {
    throw new Error("invalid legacy source receipt identity or schema");
  }
  const publicPaths = new Set(publicTreePolicy.allowedPaths);
  const seen = new Set();
  const generatedDestinations = new Set();

  for (const receipt of importReceipts.receipts) {
    validatePortableRelativePath(receipt.sourcePath);
    validatePortableRelativePath(receipt.destinationPath);
    if (receipt.sourceCommit !== manifest.sourceCommit) {
      throw new Error(`import receipt source commit drift: ${receipt.sourcePath}`);
    }
    if (!SHA1_PATTERN.test(receipt.sourceBlobSha1)) {
      throw new Error(`invalid source blob SHA-1: ${receipt.sourcePath}`);
    }
    if (!SHA256_PATTERN.test(receipt.sourceSha256)) {
      throw new Error(`invalid source SHA-256: ${receipt.sourcePath}`);
    }
    if (!SHA256_PATTERN.test(receipt.destinationSha256)) {
      throw new Error(`invalid destination SHA-256: ${receipt.destinationPath}`);
    }
    if (!MODES.has(receipt.mode)) {
      throw new Error(`invalid import mode: ${receipt.destinationPath}`);
    }
    const sourceAllowed =
      matchesAny(receipt.sourcePath, manifest.directSourceInputs) ||
      (receipt.mode === "adapted" && matchesAny(receipt.sourcePath, manifest.adaptationOnlyReferences));
    if (
      !sourceAllowed ||
      matchesAny(receipt.sourcePath, manifest.deniedSourcePaths) ||
      !publicPaths.has(receipt.destinationPath)
    ) {
      throw new Error(`import receipt is outside an approved boundary: ${receipt.destinationPath}`);
    }
    if (receipt.mode === "generated") {
      if (!manifest.generatedNotCopied.includes(receipt.destinationPath)) {
        throw new Error(`generated destination is not declared: ${receipt.destinationPath}`);
      }
      generatedDestinations.add(receipt.destinationPath);
    }
    const key = receiptKey(receipt);
    if (seen.has(key)) {
      throw new Error(`duplicate import receipt: ${receipt.destinationPath}`);
    }
    seen.add(key);
    const destinationDigest = await digestFile(path.join(repositoryRoot, receipt.destinationPath));
    if (destinationDigest !== receipt.destinationSha256) {
      throw new Error(`destination checksum drift: ${receipt.destinationPath}`);
    }
    if (receipt.mode === "copied" && receipt.sourceSha256 !== receipt.destinationSha256) {
      throw new Error(`copied source is not byte-identical: ${receipt.destinationPath}`);
    }
  }

  for (const legacy of legacyReceipts.receipts) {
    for (const destinationPath of legacy.destinationPaths) {
      const matching = importReceipts.receipts.find(
        (receipt) =>
          receipt.sourcePath === legacy.sourcePath &&
          receipt.destinationPath === destinationPath &&
          receipt.mode === legacyMode(legacy.mode),
      );
      if (!matching || matching.sourceSha256 !== legacy.sourceSha256) {
        throw new Error(`legacy source receipt is not covered exactly: ${destinationPath}`);
      }
    }
  }

  const expectedGenerated = new Set(manifest.generatedNotCopied);
  if (
    generatedDestinations.size !== expectedGenerated.size ||
    [...expectedGenerated].some((destinationPath) => !generatedDestinations.has(destinationPath))
  ) {
    throw new Error("generated destination receipt coverage is incomplete");
  }

  return {
    receipts: importReceipts.receipts.length,
    legacyPairs: legacyReceipts.receipts.reduce(
      (count, receipt) => count + receipt.destinationPaths.length,
      0,
    ),
    generated: generatedDestinations.size,
  };
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
  const readJson = async (relativePath) =>
    JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
  const result = await validateImportReceipts(
    root,
    await readJson("provenance/source-manifest.json"),
    await readJson("provenance/import-receipts.json"),
    await readJson("provenance/source-receipts.json"),
    await readJson("provenance/public-tree-policy.json"),
  );
  console.log(
    `Validated ${result.receipts} exact import receipt(s), including ${result.legacyPairs} legacy pair(s) and ${result.generated} generated route(s).`,
  );
}
