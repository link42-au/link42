import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => fs.readFile(path.join(root, relativePath), "utf8");

test("public shell exposes only approved navigation", async () => {
  const header = await read("src/lib/components/SiteHeader.svelte");
  for (const route of ["/learn", "/blog", "/changelog", "/about", "/open-source", "/licence"]) {
    assert.match(header, new RegExp(`href: \\"${route}\\"`));
  }
  assert.match(header, /https:\/\/rule1\.link42\.app/);
  assert.match(header, /class="platform-bar"/);
  assert.match(header, /class="pb-app pb-app--active"/);
  assert.doesNotMatch(
    header,
    /login2|investigations|reports|\/api\b|gravatar|session|sign.?in|account|sign.?out/i,
  );
});

test("footer preserves the original public platform attribution", async () => {
  const footer = await read("src/lib/components/SiteFooter.svelte");
  assert.match(footer, /Canberra, Australia/);
  assert.match(footer, /<strong>link42<\/strong>/);
  assert.match(footer, /https:\/\/rule1\.link42\.app/);
  assert.match(footer, /href="\/open-source"/);
  assert.doesNotMatch(footer, /login2|threat10|patch8|peer6/i);
});

test("fonts are self-hosted with no remote font origin", async () => {
  const [appHtml, styles] = await Promise.all([read("src/app.html"), read("src/lib/styles/app.css")]);
  const combined = `${appHtml}\n${styles}`;
  assert.match(styles, /url\("\/fonts\/Geist-Variable\.woff2"\)/);
  assert.match(styles, /url\("\/fonts\/GeistMono-Variable\.woff2"\)/);
  assert.doesNotMatch(combined, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
});

test("no private shell coupling exists anywhere in application source", async () => {
  const paths = [
    "src/app.html",
    "src/lib/theme.ts",
    "src/lib/components/SiteHeader.svelte",
    "src/lib/components/SiteFooter.svelte",
    "src/routes/+layout.svelte",
    "src/routes/+error.svelte",
  ];
  const source = (await Promise.all(paths.map(read))).join("\n");
  assert.doesNotMatch(
    source,
    /@link42\/(?:auth-client|ui|tokens)|login2|gravatar|locals\.user|VITE_AUTH|investigations|reports|\/api\b/i,
  );
});

test("homepage marketing copy has no executable private coupling", async () => {
  const homepage = await read("src/routes/+page.svelte");
  assert.doesNotMatch(
    homepage,
    /from\s+["'][^"']*(?:auth|session|login2)[^"']*["']|href=["'][^"']*(?:login2|\/(?:api|reports|investigations)\b)[^"']*["']|locals\.user|VITE_AUTH|gravatar|(?:sign.?in|sign.?out|account|session)\s*[=:]/i,
  );
});
