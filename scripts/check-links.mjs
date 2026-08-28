const SITE_ORIGIN = "https://link42.app";

export const EXCLUDED_ROUTE_PATTERN = /^\/(?:api|reports|investigations)(?:\/|$)/;

const ATTRIBUTE_PATTERN =
  /<(?:a|area|img|link|script|source)\b[^>]*?\s(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)')/giu;
const ID_PATTERN = /\sid\s*=\s*(?:"([^"]*)"|'([^']*)')/giu;
const SAFE_FRAGMENT_PATTERN = /^[A-Za-z][A-Za-z0-9:._-]*$/;
const GENERATED_ASSET_PATTERN =
  /^(?:\.\.?\/)*_app\/immutable\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9][A-Za-z0-9_.-]*$/u;

const hasControlCharacter = (value) =>
  [...value].some((character) => {
    const codePoint = character.codePointAt(0);
    return codePoint !== undefined && (codePoint <= 31 || codePoint === 127);
  });

const decodeHtmlAttribute = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replace(/&#x([0-9a-f]+);/giu, (_, digits) => String.fromCodePoint(Number.parseInt(digits, 16)))
    .replace(/&#([0-9]+);/gu, (_, digits) => String.fromCodePoint(Number.parseInt(digits, 10)));

const decodeUrlComponent = (value, label) => {
  try {
    return decodeURIComponent(value);
  } catch {
    throw new Error(`${label} contains malformed percent encoding`);
  }
};

const validatePathSegments = (reference, path) => {
  if (GENERATED_ASSET_PATTERN.test(path)) return;
  if (/%(?:2f|5c)/iu.test(path)) {
    throw new Error(`${reference}: encoded path separators are not allowed`);
  }
  const decodedPath = decodeUrlComponent(path, reference).replaceAll("\\", "/");
  if (path.includes("\\") || decodedPath.split("/").some((segment) => segment === "." || segment === "..")) {
    throw new Error(`${reference}: route traversal is not allowed`);
  }
};

const validateFragment = (reference) => {
  const fragmentIndex = reference.indexOf("#");
  if (fragmentIndex === -1) return null;
  const rawFragment = reference.slice(fragmentIndex + 1);
  if (!rawFragment) throw new Error(`${reference}: malformed anchor`);
  const decoded = decodeUrlComponent(rawFragment, reference);
  if (!SAFE_FRAGMENT_PATTERN.test(decoded)) {
    throw new Error(`${reference}: malformed anchor`);
  }
  return decoded;
};

export const extractDocumentReferences = (html) =>
  [...html.matchAll(ATTRIBUTE_PATTERN)].map((match) => decodeHtmlAttribute(match[1] ?? match[2]));

export const extractDocumentIds = (html) =>
  new Set([...html.matchAll(ID_PATTERN)].map((match) => decodeHtmlAttribute(match[1] ?? match[2])));

export const classifyReference = (rawReference, sourceRoute) => {
  const reference = rawReference.trim();
  if (!reference || reference !== rawReference || hasControlCharacter(reference)) {
    throw new Error(
      `${JSON.stringify(rawReference)}: empty, padded, or control-character links are not allowed`,
    );
  }
  if (reference.startsWith("//")) {
    throw new Error(`${reference}: scheme-relative links are not allowed`);
  }

  const protocol = reference.match(/^([A-Za-z][A-Za-z0-9+.-]*):/)?.[1]?.toLowerCase();
  if (protocol && protocol !== "https") {
    throw new Error(`${reference}: unsafe link protocol ${protocol}`);
  }

  const hashIndex = reference.indexOf("#");
  const queryIndex = reference.indexOf("?");
  const pathEnd = [hashIndex, queryIndex]
    .filter((index) => index >= 0)
    .reduce((minimum, index) => Math.min(minimum, index), reference.length);
  validatePathSegments(reference, reference.slice(0, pathEnd));

  let parsed;
  try {
    parsed = new URL(reference, new URL(sourceRoute, `${SITE_ORIGIN}/`));
  } catch {
    throw new Error(`${reference}: malformed URL`);
  }
  if (parsed.protocol !== "https:") {
    throw new Error(`${reference}: unsafe link protocol ${parsed.protocol.replace(":", "")}`);
  }
  if (parsed.username || parsed.password) {
    throw new Error(`${reference}: URL credentials are not allowed`);
  }
  const anchor = validateFragment(reference);
  if (parsed.origin !== SITE_ORIGIN) {
    return { kind: "external", url: parsed.href };
  }
  if (EXCLUDED_ROUTE_PATTERN.test(parsed.pathname)) {
    throw new Error(`${reference}: excluded route family`);
  }

  return {
    anchor,
    kind: "internal",
    pathname: parsed.pathname,
    search: parsed.search,
  };
};

export const auditDocumentGraph = (documents) => {
  const errors = [];
  const targets = new Set();
  const idsByRoute = new Map(
    [...documents.entries()].map(([route, html]) => [route, extractDocumentIds(html)]),
  );

  for (const [sourceRoute, html] of documents) {
    for (const reference of extractDocumentReferences(html)) {
      let classified;
      try {
        classified = classifyReference(reference, sourceRoute);
      } catch (error) {
        errors.push(`${sourceRoute}: ${error instanceof Error ? error.message : String(error)}`);
        continue;
      }
      if (classified.kind === "external") continue;

      const target = `${classified.pathname}${classified.search}`;
      targets.add(target);
      if (!classified.anchor) continue;
      const targetIds = idsByRoute.get(classified.pathname);
      if (!targetIds) {
        errors.push(`${sourceRoute}: ${reference}: anchor target is not an HTML route`);
      } else if (!targetIds.has(classified.anchor)) {
        errors.push(`${sourceRoute}: ${reference}: missing anchor #${classified.anchor}`);
      }
    }
  }

  return { errors, targets };
};

export const assertValidDocumentGraph = (documents) => {
  const result = auditDocumentGraph(documents);
  if (result.errors.length > 0) {
    throw new Error(
      `internal link validation failed:\n${result.errors.map((error) => `- ${error}`).join("\n")}`,
    );
  }
  return result.targets;
};
