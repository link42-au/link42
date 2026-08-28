import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { matchesAny, validatePortableRelativePath } from "./lib/policy.mjs";

const IGNORED_DIRECTORY_NAMES = new Set([".git", "node_modules"]);
const SECRET_ASSIGNMENT = /\b(?:api[_-]?key|client[_-]?secret|password|private[_-]?key)\b\s*[:=]\s*["'][^"'\n]{8,}["']/i;

const walk = async (root, directory = root) => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (IGNORED_DIRECTORY_NAMES.has(entry.name)) {
      continue;
    }
    const absolutePath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`symbolic links are not allowed in the public tree: ${path.relative(root, absolutePath)}`);
    }
    if (entry.isDirectory()) {
      files.push(...(await walk(root, absolutePath)));
    } else if (entry.isFile()) {
      files.push(path.relative(root, absolutePath).split(path.sep).join("/"));
    } else {
      throw new Error(`unsupported filesystem entry: ${path.relative(root, absolutePath)}`);
    }
  }
  return files.sort();
};

export const validatePublicTreePolicy = (policy) => {
  if (policy.schemaVersion !== 1) {
    throw new Error("unsupported public tree policy schemaVersion");
  }
  for (const key of ["allowedPaths", "deniedPaths"]) {
    if (!Array.isArray(policy[key]) || policy[key].length === 0) {
      throw new Error(`${key} must be a non-empty array`);
    }
    for (const pattern of policy[key]) {
      validatePortableRelativePath(pattern, { allowGlob: true });
    }
  }
  return policy;
};

export const scanPublicTree = async (root, policy) => {
  validatePublicTreePolicy(policy);
  const files = await walk(root);
  const violations = [];
  for (const relativePath of files) {
    if (matchesAny(relativePath, policy.deniedPaths)) {
      violations.push(`${relativePath}: explicitly denied path`);
      continue;
    }
    if (!matchesAny(relativePath, policy.allowedPaths)) {
      violations.push(`${relativePath}: path is not allow-listed`);
      continue;
    }
    const content = await fs.readFile(path.join(root, relativePath), "utf8").catch(() => "");
    if (SECRET_ASSIGNMENT.test(content)) {
      violations.push(`${relativePath}: resembles a committed secret assignment`);
    }
  }
  if (violations.length > 0) {
    throw new Error(`public tree safety check failed:\n${violations.join("\n")}`);
  }
  return files;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = process.cwd();
  const policy = JSON.parse(await fs.readFile(new URL("../provenance/public-tree-policy.json", import.meta.url), "utf8"));
  const files = await scanPublicTree(root, policy);
  console.log(`Validated ${files.length} public-tree file(s).`);
}
