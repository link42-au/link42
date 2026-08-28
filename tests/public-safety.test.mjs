import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { scanPublicTree, validatePublicTreePolicy } from "../scripts/check-public-safety.mjs";

const sha256 = (content) => crypto.createHash("sha256").update(content).digest("hex");
const makePolicy = (overrides = {}) => ({
  schemaVersion: 2,
  allowedPaths: ["README.md", "src/page.ts"],
  deniedPaths: ["**/.env*", "src/routes/api/**"],
  textExtensions: [".md", ".ts"],
  textPaths: [],
  maxTextBytes: 10_000,
  binaryFiles: {},
  privacyAllowances: {},
  ...overrides,
});

const withTemporaryTree = async (files, callback) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "link42-public-safety-"));
  try {
    for (const [relativePath, content] of Object.entries(files)) {
      const absolutePath = path.join(root, relativePath);
      await fs.mkdir(path.dirname(absolutePath), { recursive: true });
      await fs.writeFile(absolutePath, content);
    }
    await callback(root);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
};

test("public tree accepts only exactly allow-listed ordinary files", async () => {
  await withTemporaryTree(
    { "README.md": "public", "src/page.ts": "export const title = 'Link42';" },
    async (root) => {
      const files = await scanPublicTree(root, makePolicy());
      assert.deepEqual(files, ["README.md", "src/page.ts"]);
    },
  );
});

test("public tree policy rejects wildcard allow-list entries", () => {
  assert.throws(
    () => validatePublicTreePolicy(makePolicy({ allowedPaths: ["README.md", "src/**"] })),
    /glob syntax/,
  );
});

test("public tree rejects unlisted and explicitly denied paths", async () => {
  await withTemporaryTree({ "private.txt": "not approved" }, async (root) => {
    await assert.rejects(() => scanPublicTree(root, makePolicy()), /unlisted-path:private\.txt/);
  });
  await withTemporaryTree({ "src/routes/api/secret.ts": "export const value = 1;" }, async (root) => {
    await assert.rejects(
      () => scanPublicTree(root, makePolicy({ allowedPaths: ["README.md", "src/routes/api/secret.ts"] })),
      /denied-path:src\/routes\/api\/secret\.ts/,
    );
  });
});

test("public tree scans untracked non-ignored files but excludes ignored output", async () => {
  await withTemporaryTree({ ".gitignore": "build/\n", "README.md": "public" }, async (root) => {
    const init = spawnSync("git", ["init", "--quiet", root]);
    assert.equal(init.status, 0);
    spawnSync("git", ["-C", root, "add", ".gitignore", "README.md"]);
    await fs.mkdir(path.join(root, "src"));
    await fs.writeFile(path.join(root, "src/config.ts"), "export const token = 'public-value';");
    await fs.mkdir(path.join(root, "build"));
    await fs.writeFile(path.join(root, "build/private.js"), "ignored");

    const files = await scanPublicTree(
      root,
      makePolicy({
        allowedPaths: [".gitignore", "README.md", "src/config.ts"],
        textPaths: [".gitignore"],
      }),
    );
    assert.deepEqual(files, [".gitignore", "README.md", "src/config.ts"]);
  });
});

test("public tree rejects secrets without echoing their values", async () => {
  const secretValue = ["super", "-secret-value"].join("");
  const unsafeAssignment = ["const api", "Key = '", secretValue, "';"].join("");
  await withTemporaryTree({ "src/page.ts": unsafeAssignment }, async (root) => {
    await assert.rejects(
      () => scanPublicTree(root, makePolicy()),
      (error) => {
        assert.match(error.message, /credential-assignment:src\/page\.ts:1/);
        assert.equal(error.message.includes(secretValue), false);
        return true;
      },
    );
  });
});

test("public tree rejects private identifiers without echoing them", async () => {
  const cases = [
    ["private-ip-address", ["192", "168", "20", "40"].join(".")],
    ["credential-url", ["https://operator", ":private-pass", "@example.com"].join("")],
    ["secret-manager-reference", ["op:/", "/vault/item/field"].join("")],
    ["uuid-or-app-id", ["01234567-89ab-4cde", "-8fab-0123456789ab"].join("")],
    ["email-address", ["person", "@company.com"].join("")],
    ["private-environment-domain", ["service.prod", ".internal"].join("")],
  ];
  for (const [ruleId, privateValue] of cases) {
    await withTemporaryTree({ "src/page.ts": `export const value = '${privateValue}';` }, async (root) => {
      await assert.rejects(
        () => scanPublicTree(root, makePolicy()),
        (error) => {
          assert.match(error.message, new RegExp(`${ruleId}:src/page\\.ts:1`));
          assert.equal(error.message.includes(privateValue), false);
          return true;
        },
      );
    });
  }
});

test("public tree permits reserved example email domains", async () => {
  await withTemporaryTree({ "src/page.ts": "export const contact = 'person@example.com';" }, async (root) => {
    assert.deepEqual(await scanPublicTree(root, makePolicy()), ["src/page.ts"]);
  });
});

test("public tree rejects symbolic links", async (t) => {
  await withTemporaryTree({ "README.md": "public" }, async (root) => {
    try {
      await fs.mkdir(path.join(root, "src"));
      await fs.symlink("README.md", path.join(root, "src/page.ts"));
    } catch (error) {
      if (error.code === "EPERM") {
        t.skip("symbolic links are unavailable on this platform");
        return;
      }
      throw error;
    }
    await assert.rejects(() => scanPublicTree(root, makePolicy()), /symlink:src\/page\.ts/);
  });
});

test("public tree verifies declared binary hashes without text scanning", async () => {
  const bytes = Buffer.from([0, 1, 2, 3, 255]);
  const policy = makePolicy({
    allowedPaths: ["font.woff2"],
    binaryFiles: { "font.woff2": sha256(bytes) },
  });
  await withTemporaryTree({ "font.woff2": bytes }, async (root) => {
    assert.deepEqual(await scanPublicTree(root, policy), ["font.woff2"]);
    await fs.writeFile(path.join(root, "font.woff2"), Buffer.from([1, 2, 3]));
    await assert.rejects(() => scanPublicTree(root, policy), /binary-checksum:font\.woff2/);
  });
});
