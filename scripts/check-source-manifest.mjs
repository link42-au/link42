import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { assertDirectSourceInputs, validateSourceManifest } from "./lib/policy.mjs";

const manifestUrl = new URL("../provenance/source-manifest.json", import.meta.url);
const manifest = JSON.parse(await fs.readFile(manifestUrl, "utf8"));
validateSourceManifest(manifest);

const proposedPaths = process.argv.slice(2);
if (proposedPaths.length > 0) {
  assertDirectSourceInputs(manifest, proposedPaths);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const suffix = proposedPaths.length > 0 ? ` and ${proposedPaths.length} proposed path(s)` : "";
  console.log(`Validated pinned source manifest${suffix}.`);
}
