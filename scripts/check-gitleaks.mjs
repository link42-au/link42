import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const GITLEAKS_VERSION = "8.30.1";

export const GITLEAKS_RELEASES = Object.freeze({
  "darwin-arm64": {
    archive: `gitleaks_${GITLEAKS_VERSION}_darwin_arm64.tar.gz`,
    sha256: "b40ab0ae55c505963e365f271a8d3846efbc170aa17f2607f13df610a9aeb6a5",
  },
  "darwin-x64": {
    archive: `gitleaks_${GITLEAKS_VERSION}_darwin_x64.tar.gz`,
    sha256: "dfe101a4db2255fc85120ac7f3d25e4342c3c20cf749f2c20a18081af1952709",
  },
  "linux-x64": {
    archive: `gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz`,
    sha256: "551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb",
  },
});

const releaseKey = (platform = process.platform, architecture = process.arch) =>
  `${platform}-${architecture}`;

export const getPinnedRelease = (platform = process.platform, architecture = process.arch) => {
  const key = releaseKey(platform, architecture);
  const release = GITLEAKS_RELEASES[key];
  if (!release) {
    throw new Error(`Gitleaks ${GITLEAKS_VERSION} has no approved archive for ${key}`);
  }
  return {
    ...release,
    url: `https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/${release.archive}`,
  };
};

const cachedBinaryPath = (platform = process.platform, architecture = process.arch) =>
  path.join(
    os.homedir(),
    ".cache",
    "link42",
    "gitleaks",
    GITLEAKS_VERSION,
    releaseKey(platform, architecture),
    "gitleaks",
  );

const readVersion = (binaryPath) => {
  const result = spawnSync(binaryPath, ["version"], {
    encoding: "utf8",
    timeout: 10_000,
  });
  if (result.error || result.status !== 0) {
    throw new Error("Gitleaks is unavailable or could not report its version");
  }
  return `${result.stdout}${result.stderr}`.trim();
};

export const verifyGitleaksVersion = (binaryPath) => {
  const reported = readVersion(binaryPath);
  if (
    !new RegExp(`^(?:gitleaks version )?v?${GITLEAKS_VERSION.replaceAll(".", "\\.")}$`, "i").test(reported)
  ) {
    throw new Error(`Gitleaks version mismatch; required ${GITLEAKS_VERSION}`);
  }
  return binaryPath;
};

const checksum = (content) => crypto.createHash("sha256").update(content).digest("hex");

const downloadPinnedBinary = async () => {
  const release = getPinnedRelease();
  const response = await fetch(release.url, { redirect: "follow", signal: AbortSignal.timeout(60_000) });
  if (!response.ok) {
    throw new Error(`Gitleaks download failed with HTTP ${response.status}`);
  }
  const finalUrl = new URL(response.url);
  if (
    !new Set(["github.com", "objects.githubusercontent.com", "release-assets.githubusercontent.com"]).has(
      finalUrl.hostname,
    )
  ) {
    throw new Error("Gitleaks download redirected to an unapproved host");
  }
  const archive = Buffer.from(await response.arrayBuffer());
  if (checksum(archive) !== release.sha256) {
    throw new Error("Gitleaks archive checksum mismatch");
  }

  const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "link42-gitleaks-"));
  try {
    const archivePath = path.join(temporaryDirectory, release.archive);
    await fs.writeFile(archivePath, archive, { mode: 0o600 });
    const extraction = spawnSync("tar", ["-xzf", archivePath, "-C", temporaryDirectory, "gitleaks"], {
      encoding: "utf8",
      timeout: 30_000,
    });
    if (extraction.error || extraction.status !== 0) {
      throw new Error("could not extract the checksum-verified Gitleaks archive");
    }
    const destination = cachedBinaryPath();
    await fs.mkdir(path.dirname(destination), { recursive: true, mode: 0o700 });
    await fs.copyFile(path.join(temporaryDirectory, "gitleaks"), destination);
    await fs.chmod(destination, 0o700);
    return verifyGitleaksVersion(destination);
  } finally {
    await fs.rm(temporaryDirectory, { recursive: true, force: true });
  }
};

export const resolveGitleaksBinary = async ({ install = false } = {}) => {
  if (process.env.GITLEAKS_BIN) {
    return verifyGitleaksVersion(path.resolve(process.env.GITLEAKS_BIN));
  }
  const cached = cachedBinaryPath();
  try {
    return verifyGitleaksVersion(cached);
  } catch {
    if (install) {
      return downloadPinnedBinary();
    }
  }
  try {
    return verifyGitleaksVersion("gitleaks");
  } catch {
    throw new Error(
      `Gitleaks ${GITLEAKS_VERSION} is required; install that exact version or run this check once with --install`,
    );
  }
};

export const scanWithGitleaks = (binaryPath, root, { history = true, tree = true } = {}) => {
  const commands = [];
  if (history) {
    commands.push(["git", "--redact", "--no-banner", "."]);
  }
  if (tree) {
    commands.push(["dir", "--redact", "--no-banner", "."]);
  }
  for (const arguments_ of commands) {
    const result = spawnSync(binaryPath, arguments_, {
      cwd: root,
      stdio: "inherit",
      timeout: 5 * 60_000,
    });
    if (result.error || result.status !== 0) {
      throw new Error(`Gitleaks ${arguments_[0]} scan failed`);
    }
  }
  return commands.length;
};

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  const arguments_ = new Set(process.argv.slice(2));
  const supported = new Set(["--install", "--check-only", "--history-only", "--tree-only"]);
  const unknown = [...arguments_].filter((argument) => !supported.has(argument));
  if (unknown.length > 0 || (arguments_.has("--history-only") && arguments_.has("--tree-only"))) {
    throw new Error("unsupported Gitleaks check arguments");
  }
  const binaryPath = await resolveGitleaksBinary({ install: arguments_.has("--install") });
  if (arguments_.has("--check-only")) {
    console.log(`Verified checksum-pinned Gitleaks ${GITLEAKS_VERSION}.`);
  } else {
    const scans = scanWithGitleaks(binaryPath, process.cwd(), {
      history: !arguments_.has("--tree-only"),
      tree: !arguments_.has("--history-only"),
    });
    console.log(`Gitleaks ${GITLEAKS_VERSION} completed ${scans} redacted scan(s).`);
  }
}
