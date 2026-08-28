import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  GITLEAKS_VERSION,
  getPinnedRelease,
  scanWithGitleaks,
  verifyGitleaksVersion,
} from "../scripts/check-gitleaks.mjs";

const withFakeBinary = async (version, callback) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "link42-gitleaks-test-"));
  const binaryPath = path.join(root, "gitleaks");
  const logPath = path.join(root, "commands.log");
  const previousLog = process.env.FAKE_GITLEAKS_LOG;
  try {
    await fs.writeFile(
      binaryPath,
      `#!/bin/sh\nprintf '%s\\n' "$*" >> "$FAKE_GITLEAKS_LOG"\nif [ "$1" = version ]; then printf '%s\\n' '${version}'; fi\n`,
      { mode: 0o700 },
    );
    process.env.FAKE_GITLEAKS_LOG = logPath;
    await callback({ binaryPath, logPath, root });
  } finally {
    if (previousLog === undefined) {
      delete process.env.FAKE_GITLEAKS_LOG;
    } else {
      process.env.FAKE_GITLEAKS_LOG = previousLog;
    }
    await fs.rm(root, { recursive: true, force: true });
  }
};

test("Gitleaks release metadata is pinned to exact checksums", () => {
  const linux = getPinnedRelease("linux", "x64");
  assert.equal(GITLEAKS_VERSION, "8.30.1");
  assert.equal(linux.sha256, "551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb");
  assert.equal(
    linux.url,
    "https://github.com/gitleaks/gitleaks/releases/download/v8.30.1/gitleaks_8.30.1_linux_x64.tar.gz",
  );
  assert.throws(() => getPinnedRelease("win32", "x64"), /no approved archive/);
});

test("Gitleaks prerequisite fails closed on version drift", async () => {
  await withFakeBinary("8.30.1", async ({ binaryPath }) => {
    assert.equal(verifyGitleaksVersion(binaryPath), binaryPath);
  });
  await withFakeBinary("8.31.0", async ({ binaryPath }) => {
    assert.throws(() => verifyGitleaksVersion(binaryPath), /version mismatch/);
  });
});

test("Gitleaks uses redacted history and working-tree scans", async () => {
  await withFakeBinary("8.30.1", async ({ binaryPath, logPath, root }) => {
    assert.equal(scanWithGitleaks(binaryPath, root), 2);
    const invocations = (await fs.readFile(logPath, "utf8")).trim().split("\n");
    assert.deepEqual(invocations, ["git --redact --no-banner .", "dir --redact --no-banner ."]);
  });
});
