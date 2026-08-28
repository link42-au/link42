import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { scanPublicTree } from "../scripts/check-public-safety.mjs";

const policy = {
  schemaVersion: 1,
  allowedPaths: ["README.md", "src/**"],
  deniedPaths: ["**/.env*", "src/routes/api/**"],
};

const withTemporaryTree = async (files, callback) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "link42-public-safety-"));
  try {
    for (const [relativePath, content] of Object.entries(files)) {
      const absolutePath = path.join(root, relativePath);
      await fs.mkdir(path.dirname(absolutePath), { recursive: true });
      await fs.writeFile(absolutePath, content, "utf8");
    }
    await callback(root);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
};

test("public tree accepts only allow-listed ordinary files", async () => {
  await withTemporaryTree({ "README.md": "public", "src/page.ts": "export const title = 'Link42';" }, async (root) => {
    const files = await scanPublicTree(root, policy);
    assert.deepEqual(files, ["README.md", "src/page.ts"]);
  });
});

test("public tree rejects an unlisted path", async () => {
  await withTemporaryTree({ "private.txt": "not approved" }, async (root) => {
    await assert.rejects(() => scanPublicTree(root, policy), /path is not allow-listed/);
  });
});

test("public tree rejects explicitly denied paths even under an allowed root", async () => {
  await withTemporaryTree({ "src/routes/api/secret.ts": "export const value = 1;" }, async (root) => {
    await assert.rejects(() => scanPublicTree(root, policy), /explicitly denied path/);
  });
});

test("public tree rejects content that resembles a hard-coded secret", async () => {
  const unsafeAssignment = ["const api", "Key = 'super-secret-value';"].join("");
  await withTemporaryTree({ "src/config.ts": unsafeAssignment }, async (root) => {
    await assert.rejects(() => scanPublicTree(root, policy), /resembles a committed secret/);
  });
});
