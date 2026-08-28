import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { matchesAny, validatePortableRelativePath } from "./lib/policy.mjs";

const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const SECRET_RULES = [
  {
    id: "credential-assignment",
    pattern:
      /\b(?:api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|password|private[_-]?key)\b\s*[:=]\s*["'][^"'\n]{8,}["']/i,
  },
  { id: "private-key", pattern: /-----BEGIN (?:[A-Z0-9]+ )?PRIVATE KEY-----/ },
  { id: "github-token", pattern: /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/ },
  { id: "aws-access-key", pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/ },
  {
    id: "credential-url",
    pattern: /\b[a-z][a-z0-9+.-]*:\/\/[^\s/@:]+:[^\s/@]+@[^\s/]+/i,
  },
  { id: "secret-manager-reference", pattern: /\bop:\/\/[A-Za-z0-9_./-]+/i },
  {
    id: "private-ip-address",
    pattern:
      /\b(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|169\.254(?:\.\d{1,3}){2})\b|\b(?:fc|fd|fe8|fe9|fea|feb)[0-9a-f:]*:[0-9a-f:]+\b/i,
  },
  {
    id: "uuid-or-app-id",
    pattern: /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/i,
  },
  {
    id: "email-address",
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    allowMatch: (value) => /@example\.(?:com|net|org)$/i.test(value),
  },
  {
    id: "private-environment-domain",
    pattern: /\b(?:[a-z0-9-]+\.)+(?:internal|local|lan|corp|home|intranet)\b/i,
  },
];

const normalizePath = (value) => value.split(path.sep).join("/");

const walkExportedTree = async (root, directory = root) => {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (directory === root && entry.name === ".git") {
      continue;
    }
    const absolutePath = path.join(directory, entry.name);
    const relativePath = normalizePath(path.relative(root, absolutePath));
    if (entry.isSymbolicLink()) {
      throw new Error(`public tree safety check failed:\nsymlink:${relativePath}`);
    }
    if (entry.isDirectory()) {
      files.push(...(await walkExportedTree(root, absolutePath)));
    } else if (entry.isFile()) {
      files.push(relativePath);
    } else {
      throw new Error(`public tree safety check failed:\nunsupported-entry:${relativePath}`);
    }
  }
  return files;
};

const listPublicationCandidates = async (root) => {
  const result = spawnSync(
    "git",
    ["-C", root, "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    { encoding: "buffer", maxBuffer: 16 * 1024 * 1024 },
  );
  if (result.status === 0) {
    return result.stdout.toString("utf8").split("\0").filter(Boolean).map(normalizePath).sort();
  }
  return (await walkExportedTree(root)).sort();
};

const digest = (content) => crypto.createHash("sha256").update(content).digest("hex");

export const validatePublicTreePolicy = (policy) => {
  if (policy.schemaVersion !== 2) {
    throw new Error("unsupported public tree policy schemaVersion");
  }
  if (!Array.isArray(policy.allowedPaths) || policy.allowedPaths.length === 0) {
    throw new Error("allowedPaths must be a non-empty array");
  }
  if (new Set(policy.allowedPaths).size !== policy.allowedPaths.length) {
    throw new Error("allowedPaths must not contain duplicates");
  }
  for (const relativePath of policy.allowedPaths) {
    validatePortableRelativePath(relativePath);
  }
  if (!Array.isArray(policy.deniedPaths) || policy.deniedPaths.length === 0) {
    throw new Error("deniedPaths must be a non-empty array");
  }
  for (const pattern of policy.deniedPaths) {
    validatePortableRelativePath(pattern, { allowGlob: true });
  }
  if (
    !Array.isArray(policy.textExtensions) ||
    policy.textExtensions.length === 0 ||
    policy.textExtensions.some((extension) => !/^\.[a-z0-9]+$/.test(extension))
  ) {
    throw new Error("textExtensions must declare lowercase file extensions");
  }
  if (!Array.isArray(policy.textPaths)) {
    throw new Error("textPaths must be an array");
  }
  for (const relativePath of policy.textPaths) {
    validatePortableRelativePath(relativePath);
  }
  if (
    !Number.isSafeInteger(policy.maxTextBytes) ||
    policy.maxTextBytes < 1 ||
    policy.maxTextBytes > 5_000_000
  ) {
    throw new Error("maxTextBytes must be a positive, bounded integer");
  }
  if (typeof policy.binaryFiles !== "object" || policy.binaryFiles === null) {
    throw new Error("binaryFiles must be an object");
  }
  if (typeof policy.privacyAllowances !== "object" || policy.privacyAllowances === null) {
    throw new Error("privacyAllowances must be an object");
  }
  const knownRuleIds = new Set(SECRET_RULES.map((rule) => rule.id));
  for (const [ruleId, relativePaths] of Object.entries(policy.privacyAllowances)) {
    if (!knownRuleIds.has(ruleId) || !Array.isArray(relativePaths)) {
      throw new Error(`invalid privacy allowance rule: ${ruleId}`);
    }
    for (const relativePath of relativePaths) {
      validatePortableRelativePath(relativePath);
      if (!policy.allowedPaths.includes(relativePath)) {
        throw new Error(`privacy allowance path is not allow-listed: ${relativePath}`);
      }
    }
  }
  for (const [relativePath, sha256] of Object.entries(policy.binaryFiles)) {
    validatePortableRelativePath(relativePath);
    if (!SHA256_PATTERN.test(sha256)) {
      throw new Error(`binary checksum must be SHA-256: ${relativePath}`);
    }
  }

  const classified = new Set([
    ...policy.textPaths,
    ...policy.allowedPaths.filter((relativePath) =>
      policy.textExtensions.includes(path.posix.extname(relativePath).toLowerCase()),
    ),
    ...Object.keys(policy.binaryFiles),
  ]);
  const unclassified = policy.allowedPaths.filter((relativePath) => !classified.has(relativePath));
  if (unclassified.length > 0) {
    throw new Error(`allowed path has no declared content type: ${unclassified.join(", ")}`);
  }
  for (const relativePath of Object.keys(policy.binaryFiles)) {
    if (!policy.allowedPaths.includes(relativePath)) {
      throw new Error(`binary path is not allow-listed: ${relativePath}`);
    }
  }
  return policy;
};

export const scanPublicTree = async (root, policy) => {
  validatePublicTreePolicy(policy);
  const files = await listPublicationCandidates(root);
  const allowed = new Set(policy.allowedPaths);
  const textPaths = new Set(policy.textPaths);
  const violations = [];

  for (const relativePath of files) {
    let stat;
    try {
      stat = await fs.lstat(path.join(root, relativePath));
    } catch {
      violations.push(`missing-file:${relativePath}`);
      continue;
    }
    if (stat.isSymbolicLink()) {
      violations.push(`symlink:${relativePath}`);
      continue;
    }
    if (!stat.isFile()) {
      violations.push(`unsupported-entry:${relativePath}`);
      continue;
    }
    if (matchesAny(relativePath, policy.deniedPaths)) {
      violations.push(`denied-path:${relativePath}`);
      continue;
    }
    if (!allowed.has(relativePath)) {
      violations.push(`unlisted-path:${relativePath}`);
      continue;
    }

    const content = await fs.readFile(path.join(root, relativePath));
    const expectedBinaryDigest = policy.binaryFiles[relativePath];
    if (expectedBinaryDigest) {
      if (digest(content) !== expectedBinaryDigest) {
        violations.push(`binary-checksum:${relativePath}`);
      }
      continue;
    }
    const extension = path.posix.extname(relativePath).toLowerCase();
    if (!textPaths.has(relativePath) && !policy.textExtensions.includes(extension)) {
      violations.push(`undeclared-content-type:${relativePath}`);
      continue;
    }
    if (content.length > policy.maxTextBytes) {
      violations.push(`text-size:${relativePath}`);
      continue;
    }
    if (content.includes(0)) {
      violations.push(`invalid-text:${relativePath}`);
      continue;
    }
    const lines = content.toString("utf8").split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      for (const rule of SECRET_RULES) {
        const allowances = policy.privacyAllowances[rule.id] ?? [];
        const match = lines[index].match(rule.pattern);
        if (!allowances.includes(relativePath) && match && !(rule.allowMatch?.(match[0]) ?? false)) {
          violations.push(`${rule.id}:${relativePath}:${index + 1}`);
        }
      }
    }
  }
  if (violations.length > 0) {
    throw new Error(`public tree safety check failed:\n${violations.join("\n")}`);
  }
  return files;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = process.cwd();
  const policy = JSON.parse(
    await fs.readFile(new URL("../provenance/public-tree-policy.json", import.meta.url), "utf8"),
  );
  const files = await scanPublicTree(root, policy);
  console.log(`Validated ${files.length} tracked and untracked public-tree file(s).`);
}
