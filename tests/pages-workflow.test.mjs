import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const workflow = await fs.readFile(new URL("../.github/workflows/pages.yml", import.meta.url), "utf8");
const ciWorkflow = await fs.readFile(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");

const buildStart = workflow.indexOf("  build:");
const deployStart = workflow.indexOf("  deploy:");
const header = workflow.slice(0, buildStart);
const build = workflow.slice(buildStart, deployStart);
const deploy = workflow.slice(deployStart);

const actionPins = new Map([
  ["actions/checkout", "d23441a48e516b6c34aea4fa41551a30e30af803"],
  ["pnpm/action-setup", "f40ffcd9367d9f12939873eb1018b921a783ffaa"],
  ["actions/setup-node", "249970729cb0ef3589644e2896645e5dc5ba9c38"],
  ["actions/configure-pages", "983d7736d9b0ae728b81ab479565c72886d7745b"],
  ["actions/upload-pages-artifact", "fc324d3547104276b827a68afc52ff2a11cc49c9"],
  ["actions/deploy-pages", "cd2ce8fcbc39b97be8ca5fce6e763baed58fa128"],
]);

test("Pages runs only for main pushes or explicit dispatches", () => {
  assert.ok(buildStart > 0 && deployStart > buildStart, "build and deploy jobs must exist");
  assert.match(
    header,
    /on:\n {2}push:\n {4}branches: \[main\]\n {2}workflow_dispatch:\n\npermissions:\n {2}contents: read\n\nconcurrency:/,
  );
  assert.doesNotMatch(header, /pull_request(?:_target)?:/);
});

test("Pages leaves the protected CI check context intact", () => {
  assert.match(ciWorkflow, /pull_request:/);
  assert.match(ciWorkflow, /name: CI \/ Verify/);
});

test("Pages does not claim the custom domain in source", async () => {
  await assert.rejects(() => fs.access(new URL("../static/CNAME", import.meta.url)), { code: "ENOENT" });
});

test("Pages uses only the approved immutable action revisions", () => {
  const uses = [...workflow.matchAll(/^\s+-?\s*uses:\s*([^\s#]+)\s*$/gm)].map((match) => match[1]);
  const expected = [...actionPins].map(([action, revision]) => `${action}@${revision}`);

  assert.deepEqual(uses, expected);
  for (const usage of uses) {
    assert.match(usage, /^[\w.-]+\/[\w.-]+@[0-9a-f]{40}$/);
  }
});

test("Pages build is read-only and uploads only the frozen static build", () => {
  assert.match(build, /permissions:\n {6}contents: read\n {4}steps:/);
  assert.doesNotMatch(build, /pages:\s*write|id-token:\s*write|contents:\s*write/);
  assert.match(build, /persist-credentials: false/);
  assert.match(build, /run: pnpm install --frozen-lockfile/);
  assert.match(build, /run: pnpm build/);
  assert.match(build, /run: pnpm check:routes/);
  assert.match(build, /actions\/upload-pages-artifact@/);
  assert.match(build, /with:\n {10}path: build/);
  assert.ok(
    build.indexOf("run: pnpm build") < build.indexOf("run: pnpm check:routes") &&
      build.indexOf("run: pnpm check:routes") < build.indexOf("actions/upload-pages-artifact@"),
    "the static build and artifact verification must complete before artifact upload",
  );
});

test("Pages deploy receives only Pages and OIDC write permissions", () => {
  assert.match(deploy, /needs: build/);
  assert.match(deploy, /if: github\.ref == 'refs\/heads\/main'/);
  assert.match(deploy, /permissions:\n {6}pages: write\n {6}id-token: write\n {4}environment:/);
  assert.doesNotMatch(deploy, /contents:\s*write|actions:\s*write/);
  assert.match(
    deploy,
    /environment:\n {6}name: github-pages\n {6}url: \$\{\{ steps\.deployment\.outputs\.page_url \}\}/,
  );
  assert.match(deploy, /id: deployment/);
  assert.match(deploy, /actions\/deploy-pages@/);
});
