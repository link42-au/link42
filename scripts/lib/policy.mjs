import path from "node:path";

export const EXPECTED_SOURCE_REPOSITORY = "https://github.com/wan0net/link42";
export const EXPECTED_SOURCE_COMMIT = "aaa140cdd753d6576f0a2bf3292b31518b88fbcc";
export const EXPECTED_DESTINATION_REPOSITORY = "https://github.com/link42-au/link42";

const escapeRegExp = (character) => character.replace(/[\\^$+?.()|{}[\]]/g, "\\$&");

export const validatePortableRelativePath = (value, { allowGlob = false } = {}) => {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error("path must be a non-empty string");
  }
  if (value.includes("\\") || path.posix.isAbsolute(value)) {
    throw new Error(`path must be portable and relative: ${value}`);
  }
  if (!allowGlob && /[*?]/.test(value)) {
    throw new Error(`concrete path must not contain glob syntax: ${value}`);
  }
  const segments = value.split("/");
  if (segments.some((segment) => segment === "" || segment === "." || segment === "..")) {
    throw new Error(`path must not contain empty or traversal segments: ${value}`);
  }
  return value;
};

export const globToRegExp = (pattern) => {
  validatePortableRelativePath(pattern, { allowGlob: true });
  let expression = "^";
  for (let index = 0; index < pattern.length; index += 1) {
    if (pattern.slice(index, index + 3) === "**/") {
      expression += "(?:.*/)?";
      index += 2;
    } else if (pattern.slice(index, index + 2) === "**") {
      expression += ".*";
      index += 1;
    } else if (pattern[index] === "*") {
      expression += "[^/]*";
    } else if (pattern[index] === "?") {
      expression += "[^/]";
    } else {
      expression += escapeRegExp(pattern[index]);
    }
  }
  return new RegExp(`${expression}$`);
};

export const matchesAny = (relativePath, patterns) => {
  validatePortableRelativePath(relativePath);
  return patterns.some((pattern) => globToRegExp(pattern).test(relativePath));
};

const assertStringArray = (manifest, key) => {
  const values = manifest[key];
  if (!Array.isArray(values) || values.length === 0 || values.some((value) => typeof value !== "string")) {
    throw new Error(`${key} must be a non-empty string array`);
  }
  const unique = new Set(values);
  if (unique.size !== values.length) {
    throw new Error(`${key} must not contain duplicates`);
  }
  for (const value of values) {
    validatePortableRelativePath(value, { allowGlob: key !== "excludedCategories" });
  }
};

export const validateSourceManifest = (manifest) => {
  if (manifest.schemaVersion !== 1) {
    throw new Error("unsupported source manifest schemaVersion");
  }
  if (manifest.sourceRepository !== EXPECTED_SOURCE_REPOSITORY) {
    throw new Error("source repository does not match the approved source");
  }
  if (manifest.sourceCommit !== EXPECTED_SOURCE_COMMIT) {
    throw new Error("source commit does not match the approved immutable baseline");
  }
  if (!/^[0-9a-f]{40}$/.test(manifest.sourceCommit)) {
    throw new Error("source commit must be a full 40-character SHA-1");
  }
  if (manifest.destinationRepository !== EXPECTED_DESTINATION_REPOSITORY) {
    throw new Error("destination repository does not match the approved destination");
  }
  for (const key of [
    "directSourceInputs",
    "generatedNotCopied",
    "adaptationOnlyReferences",
    "deniedSourcePaths",
  ]) {
    assertStringArray(manifest, key);
  }
  if (!Array.isArray(manifest.excludedCategories) || manifest.excludedCategories.length === 0) {
    throw new Error("excludedCategories must be a non-empty array");
  }
  return manifest;
};

export const assertDirectSourceInputs = (manifest, relativePaths) => {
  validateSourceManifest(manifest);
  if (!Array.isArray(relativePaths) || relativePaths.length === 0) {
    throw new Error("at least one concrete source path is required");
  }
  const denied = relativePaths.filter(
    (relativePath) =>
      matchesAny(relativePath, manifest.deniedSourcePaths) ||
      !matchesAny(relativePath, manifest.directSourceInputs),
  );
  if (denied.length > 0) {
    throw new Error(`source path is not directly allow-listed: ${denied.join(", ")}`);
  }
  return relativePaths;
};
