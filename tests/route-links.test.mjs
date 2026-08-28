import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertValidDocumentGraph,
  auditDocumentGraph,
  classifyReference,
  extractDocumentReferences,
} from "../scripts/check-links.mjs";

describe("offline internal link validation", () => {
  it("accepts complete local routes, anchors, assets, and external HTTPS links", () => {
    const documents = new Map([
      [
        "/",
        '<main id="main-content"><a href="/about#team">About</a><img src="/logo.svg"><a href="https://example.com/reference">Reference</a></main>',
      ],
      [
        "/about",
        '<main id="main-content"><h2 id="team">Team</h2><a href="https://link42.app/">Home</a></main>',
      ],
    ]);

    assert.deepEqual([...assertValidDocumentGraph(documents)].sort(), ["/", "/about", "/logo.svg"]);
    assert.deepEqual(extractDocumentReferences(documents.get("/")), [
      "/about#team",
      "/logo.svg",
      "https://example.com/reference",
    ]);
  });

  it("rejects excluded routes, unsafe protocols, traversal, and malformed URLs", () => {
    for (const reference of [
      "/api",
      "/reports/example",
      "/investigations/example",
      "javascript:alert(1)",
      "data:text/html,unsafe",
      "//example.com/path",
      "/learn/../api",
      "/learn/%2e%2e/api",
      "/learn/%2fapi",
      "/learn/%zz",
      "../../_app/immutable/../../api",
      " /about",
    ]) {
      assert.throws(() => classifyReference(reference, "/"), reference);
    }
  });

  it("rejects malformed and missing anchors", () => {
    for (const href of ["#", "#bad anchor", "#%zz"]) {
      const malformed = auditDocumentGraph(
        new Map([["/", `<main id="main-content"><a href="${href}">Bad</a></main>`]]),
      );
      assert.match(malformed.errors.join("\n"), /malformed anchor|malformed percent encoding/);
    }

    const missing = auditDocumentGraph(
      new Map([["/", '<main id="main-content"><a href="#missing">Missing</a></main>']]),
    );
    assert.match(missing.errors.join("\n"), /missing anchor #missing/);
  });

  it("reports links to missing HTML anchor targets", () => {
    const result = auditDocumentGraph(
      new Map([["/", '<main id="main-content"><a href="/missing#heading">Missing</a></main>']]),
    );
    assert.match(result.errors.join("\n"), /anchor target is not an HTML route/);
  });
});
