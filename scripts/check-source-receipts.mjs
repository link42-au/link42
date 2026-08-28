import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { matchesAny, validatePortableRelativePath, validateSourceManifest } from "./lib/policy.mjs";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

const digest = async (filePath) => {
  const content = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
};

export const validateReceipts = async (repositoryRoot, manifest, sourceReceipts, thirdPartyAssets) => {
  validateSourceManifest(manifest);
  if (sourceReceipts.schemaVersion !== 1 || !Array.isArray(sourceReceipts.receipts)) {
    throw new Error("invalid source receipts");
  }
  if (
    sourceReceipts.sourceRepository !== manifest.sourceRepository ||
    sourceReceipts.sourceCommit !== manifest.sourceCommit
  ) {
    throw new Error("source receipt identity drift");
  }

  for (const receipt of sourceReceipts.receipts) {
    validatePortableRelativePath(receipt.sourcePath);
    if (!/^[0-9a-f]{64}$/.test(receipt.sourceSha256)) {
      throw new Error(`invalid source SHA-256: ${receipt.sourcePath}`);
    }
    const allowed =
      receipt.mode === "adaptation-reference"
        ? matchesAny(receipt.sourcePath, manifest.adaptationOnlyReferences)
        : matchesAny(receipt.sourcePath, manifest.directSourceInputs);
    if (!allowed || !["verbatim", "adapted-input", "adaptation-reference"].includes(receipt.mode)) {
      throw new Error(`receipt is outside the approved source boundary: ${receipt.sourcePath}`);
    }
    if (!Array.isArray(receipt.destinationPaths) || receipt.destinationPaths.length === 0) {
      throw new Error(`receipt has no destination: ${receipt.sourcePath}`);
    }
    for (const destinationPath of receipt.destinationPaths) {
      validatePortableRelativePath(destinationPath);
      const destinationDigest = await digest(path.join(repositoryRoot, destinationPath));
      if (receipt.mode === "verbatim" && destinationDigest !== receipt.sourceSha256) {
        throw new Error(`verbatim source drift: ${destinationPath}`);
      }
    }
  }

  if (thirdPartyAssets.schemaVersion !== 1 || !Array.isArray(thirdPartyAssets.assets)) {
    throw new Error("invalid third-party asset provenance");
  }
  for (const asset of thirdPartyAssets.assets) {
    validatePortableRelativePath(asset.path);
    if (!asset.sourceUrl.startsWith("https://github.com/vercel/geist-font/")) {
      throw new Error(`unapproved third-party source: ${asset.path}`);
    }
    if ((await digest(path.join(repositoryRoot, asset.path))) !== asset.sha256) {
      throw new Error(`third-party asset checksum drift: ${asset.path}`);
    }
  }

  return {
    receipts: sourceReceipts.receipts.length,
    thirdPartyAssets: thirdPartyAssets.assets.length,
  };
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const manifest = JSON.parse(await fs.readFile(path.join(root, "provenance/source-manifest.json"), "utf8"));
  const sourceReceipts = JSON.parse(
    await fs.readFile(path.join(root, "provenance/source-receipts.json"), "utf8"),
  );
  const thirdPartyAssets = JSON.parse(
    await fs.readFile(path.join(root, "provenance/third-party-assets.json"), "utf8"),
  );
  const result = await validateReceipts(root, manifest, sourceReceipts, thirdPartyAssets);
  console.log(
    `Validated ${result.receipts} pinned source receipt(s) and ${result.thirdPartyAssets} third-party asset(s).`,
  );
}
