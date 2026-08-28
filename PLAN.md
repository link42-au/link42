# Link42 Website Plan

Status: Proposed - awaiting sign-off
Source baseline: `wan0net/link42@aaa140cdd753d6576f0a2bf3292b31518b88fbcc`
Destination: `link42-au/website`
Production domain: <https://link42.app>

## Project Info

- **Purpose:** Publish and maintain the public Link42 company website independently of the private platform monorepo.
- **Audience:** Security practitioners, learners, customers, contributors, and the public.
- **Stack:** TypeScript, Svelte 5, SvelteKit, pnpm, Node 22, Vite, Vitest, and Biome.
- **Initial runtime:** SvelteKit `adapter-node` on DigitalOcean App Platform to minimise cutover risk.
- **Content:** Git-backed Markdown for Learn and Blog.
- **Software licence:** AGPL-3.0-only.
- **Original editorial content licence:** CC BY-NC 4.0.
- **Brand:** The Link42 name, logos, and brand assets remain reserved; no trademark licence is granted.
- **Third-party material:** Retains its original terms.
- **Repository history:** New, independent, scan-clean history. Never copy the private repository's `.git` directory or filtered history.
- **Private monorepo:** Remains `wan0net/link42`; it is not transferred in this project.

## Public Scope

### Included

- `/`
- `/about`
- `/changelog`
- `/licence`
- `/learn` and all current `/learn/**` routes
- `/blog`
- `/blog/[slug]`
- `/blog/rss.xml`
- Public design tokens, site shell, logos, content generation, tests, and public-safe CI

### Deferred

- `/reports/**`, pending a separately designed public API and data boundary

### Excluded

- `/investigations/**`
- `/api`
- Authentication, sessions, login2 client code, admin gates, and user data
- Gateway and API clients and private service bindings
- DigitalOcean app specifications, deployment scripts, DNS scripts, credentials, app IDs, and private environment configuration
- login2, peer6, threat10, patch8, private Rule1 code, shared auth and push packages, backups, build output, and private repository documentation

## Source Allow-list

The migration must read from the pinned source commit, not the current working tree.

### Direct source inputs

- `content/blog/*.md`
- `content/learn/**/*.md`
- `scripts/generate-content.ts`
- `src/app.html`
- `src/brand.css`
- `src/lib/server/blog.ts`
- `src/routes/+error.svelte`
- `src/routes/+page.server.ts`
- `src/routes/+page.svelte`
- `src/routes/about/+page.svelte`
- `src/routes/blog/**`
- `src/routes/changelog/+page.svelte`
- `src/routes/learn/+layout.svelte`
- `src/routes/learn/+page.svelte`
- `src/routes/licence/+page.svelte`
- `static/favicon.svg`
- `static/logo-dark.svg`
- `static/logo-light.svg`
- `tests/content/blog.test.ts`
- `tests/content/generate-content.test.ts`
- `tokens/src/index.css`
- `tokens/src/reset.css`
- `tokens/src/tokens.css`
- `packages/ui/src/Footer.svelte`
- `packages/ui/src/components.css`
- `packages/ui/src/patterns.css`
- `packages/ui/src/theme.svelte.ts`

### Generated, not copied

- The 14 generated `src/routes/learn/**/+page.svelte` pages

### Adaptation-only references; do not copy

- `src/hooks.server.ts`
- `src/app.d.ts`
- `src/routes/+layout.server.ts`
- `src/routes/+layout.svelte`
- `packages/ui/src/PlatformBar.svelte`

These contain authentication or session coupling. Implement a clean public-only layout, theme handling, platform navigation, and footer instead.

All package manifests, lockfiles, configuration, documentation, licences, CI, and tests not listed above must be created cleanly in the new repository. Any unlisted source path fails the export gate.

## Self-contained Dependencies

- Move tokens into website-owned styles; remove `@link42/tokens`.
- Move the required footer, theme, and public navigation into website-owned source; remove `@link42/ui`.
- Remove `@link42/auth-client`, `src/lib/api.ts`, auth locals, session resolution, sign-out logic, and auth environment variables.
- Remove Cytoscape and every dependency used only by investigations.
- Retain only Svelte, SvelteKit, `adapter-node`, and Marked as runtime dependencies.
- Retain Vite, TypeScript, Vitest, Biome, and the Svelte Vite plugin for development.
- Add Playwright and Axe coverage only after plan and dependency approval.
- Replace the Google Fonts runtime import with either locally vendored, provenance-recorded Geist assets under their original licence or an approved system-font fallback.
- Regenerate a minimal `pnpm-lock.yaml`; never copy the monorepo lockfile.

## Features

| # | Feature | Description | Depends On | Status |
|---|---|---|---|---|
| 1 | Clean repository and publication policy | Add README, SECURITY, CONTRIBUTING, licences, trademark notice, third-party notices, source provenance, clean package and configuration files, and the fail-closed source allow-list. | - | todo |
| 2 | Public-only site shell | Port tokens and required UI locally; implement theme handling, public navigation, footer, responsive shell, and a no-auth layout. | 1 | todo |
| 3 | Learn corpus | Import 14 canonical Learn Markdown pages and the deterministic generator; regenerate all 14 routes and preserve all 112 sections, URLs, voices, metadata, and review labels. | 2 | todo |
| 4 | Blog and RSS | Import strict Markdown parsing, article routes, homepage latest-article integration, and RSS with safe rendering and deterministic ordering. | 2 | todo |
| 5 | Public company pages | Port home, about, changelog, and licence after editorial and public-safety review; remove or neutralise links to excluded API, reports, and investigations routes and publish the selected licensing policy accurately. | 3, 4 | todo |
| 6 | Verification and CI | Add one-command verification, route and link tests, Playwright and Axe checks, secret and privacy scans, dependency audit, deterministic generation checks, and public-safe hosted CI. | 3, 4, 5 | todo |
| 7 | Public release | Scan the export, staged tree, full independent history, and a fresh clone; require hosted CI success and ruleset review before changing repository visibility to public. | 6 | todo |
| 8 | Staging deployment | Deploy the exact public commit to a non-production target without copying private deployment configuration; verify routes, assets, RSS, themes, mobile layout, accessibility, and exclusions. | 7 | todo |
| 9 | Explicit production cutover | After separate approval, change only the `link42.app` web component's source to `link42-au/website`; preserve private API and product components, verify active revision, TLS, and content, then disable the old website deployment trigger. | 8 | todo |

One completed feature equals one tested commit and push. Do not start the next feature with uncommitted work.

## Acceptance Gates

- The repository has an independent root commit and contains no private history.
- Every copied source path is present in the approved source manifest and records the source commit.
- No workspace dependency, auth client, user or session type, investigation code, API client, report route, private deployment file, environment file, credential, app ID, or DNS mutation is present.
- `/`, `/about`, `/changelog`, `/licence`, all 14 Learn routes, Blog routes, article 404 handling, and RSS pass.
- `/api`, `/reports/**`, and `/investigations/**` are absent and return 404.
- Learn generation is deterministic and preserves 14 pages and 112 sections.
- Markdown rejects raw HTML, unsafe protocols, invalid metadata, duplicate slugs, and route traversal.
- Internal-link validation finds no link to an excluded route.
- Playwright and Axe pass desktop and mobile in light and dark themes.
- `pnpm audit --prod --audit-level=high` has no high or critical finding.
- Secret scans pass on the export, staged tree, complete public history, and a fresh clone.
- Hosted CI must complete successfully; local results cannot substitute for an unavailable hosted run.
- Production is not complete until DigitalOcean reports the intended commit active and live route, RSS, and accessibility canaries pass.

## Commands

```bash
pnpm generate:content --check
pnpm check
pnpm test
pnpm build
pnpm test:e2e
pnpm audit --prod --audit-level=high
pnpm verify
```

## Cutover and Rollback

- The private monorepo remains in place and private.
- Only the public website component changes source repository.
- No public deployment specification, credential, private app identifier, or DNS mutation script is copied.
- Record the previous website source revision before cutover.
- On failure, restore the prior source revision and verify the previous production page.
- Mark `link42-au/website` canonical only after the live deployment is verified.
- Keep website links pointed at the durable `https://rule1.link42.app` product URL, not either GitHub Pages owner URL. Coordinate production launch with the separate Rule1 organisation Pages and custom-domain cutover.

## Known Risks

- The current root shell calls login2 on every request and carries development admin gating. It must be rewritten, not copied.
- The current licence page says all platform code is proprietary. Never commit that version before applying the approved licence split.
- The current changelog links to `/reports/**` and `/api`; those links would be broken or imply deferred functionality is present.
- The current About page publishes infrastructure, costs, private-repository references, and broad authorship claims. It requires an editorial accuracy review.
- Code, editorial text, brand assets, and third-party content require explicit file-level licensing boundaries; a root AGPL licence alone must not imply a trademark grant for logos.
- DigitalOcean currently couples several private components. Cutover must change only the `link42.app` web source and preserve the private services.
- A Rule1 owner transfer changes its GitHub Pages origin from `wan0net.github.io/rule1` to `link42-au.github.io/rule1`. The website should rely only on the intended `rule1.link42.app` custom domain once that separate cutover is verified.

## Discovered Dependencies

| ID | Dependency | Blocks | Status |
|---|---|---|---|
| D1 | Confirm the exact copyright holder named in notices; repository ownership does not determine legal ownership. | 1, 7 | open |
| D2 | Approve Playwright and Axe development dependencies. | 6 | open |
| D3 | Choose locally vendored Geist fonts or the system-font fallback. | 2 | open |
| D4 | Confirm DigitalOcean can source the public web component from `link42-au/website` while private components remain sourced from `wan0net/link42`. | 8, 9 | open |
| D5 | Complete and verify the separate Rule1 Pages and `rule1.link42.app` cutover. | 9 | open |
