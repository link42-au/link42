# Link42

This repository is the independent, public source for the live Link42 company website at [link42.app](https://link42.app). Its public source, content provenance, licensing boundaries, and release history can be reviewed without exposing private services or operational configuration.

The repository contains the public-only website and the publication safeguards used to keep it independent of the private platform. Work is recorded in small, tested features in [PLAN.md](PLAN.md).

## Hosting and technology

The source, issue tracker, and release history are hosted on GitHub under the
[`link42-au`](https://github.com/link42-au) organisation. The site is written in
TypeScript and Svelte, statically generated with SvelteKit and
`@sveltejs/adapter-static`, and managed with pnpm. Geist fonts are vendored in
the repository so the deployed site does not depend on a font CDN.

GitHub Actions runs the same verification described below and publishes the
static artifact to GitHub Pages. Pages serves the production custom domain at
[`link42.app`](https://link42.app). Browser checks use Playwright and axe-core;
the source, build, routes, links, accessibility, licences, dependencies, and
public-release boundary are checked before deployment.

## Bugs, suggestions, and security

- [Report a website bug](https://github.com/link42-au/link42/issues/new?template=bug_report.yml) with the affected page, steps to reproduce it, and browser or device details.
- [Suggest an improvement](https://github.com/link42-au/link42/issues/new?template=feature_request.yml) with the problem to solve and the outcome you would find useful.
- For a security vulnerability, use GitHub's private [Report a vulnerability](https://github.com/link42-au/link42/security/advisories/new) form. Do not disclose vulnerability details in a public issue.

See [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a code or content
change. General discussion and existing reports are in the
[issue tracker](https://github.com/link42-au/link42/issues).

## Development

Requirements:

- Node.js 22
- pnpm 10.15.1
- Gitleaks 8.30.1

Install the locked JavaScript dependencies. The Gitleaks prerequisite can be
installed into a user-local cache from the checksum-pinned upstream archive:

```sh
pnpm install --frozen-lockfile
pnpm check:gitleaks --install --check-only
pnpm verify
```

`pnpm verify` is the complete local and hosted gate. It checks deterministic
content generation, source manifests and import receipts, the exact public-tree
allow-list, privacy identifiers, the working tree and complete independent Git
history for secrets, formatting, types, unit tests, the production build, every
included and excluded route, internal links, desktop/mobile accessibility in
light and dark themes, and high-severity production dependency advisories.

Route and internal-link verification inspects the static `build/` artifact
directly. Browser and accessibility checks serve that artifact only on loopback.
They validate external HTTPS link syntax but deliberately do not fetch external
URLs. CI uses the same command with read-only repository access and no secrets.

## GitHub Pages artifact

`pnpm build` writes the complete domain-root site to `build/`. The pinned Pages
workflow builds and verifies that directory on protected `main` pushes or an
explicit manual run, then grants only its deploy job Pages and OIDC write access.
The source intentionally contains no `CNAME`; Pages enablement, the `link42.app`
custom-domain setting, `www.link42.app` redirect DNS, and production verification
are separate operational steps.

The source manifest is pinned to a single private-source commit. A path not explicitly listed in that manifest is rejected by default. See [provenance/SOURCE_PROVENANCE.md](provenance/SOURCE_PROVENANCE.md) before importing any material.

## Publication boundary

The intended public website includes the company pages, Learn corpus, Blog and RSS feed described in [PLAN.md](PLAN.md). It excludes authentication, sessions, user data, APIs, investigations, reports, private services, infrastructure specifications, credentials, environment files, deployment identifiers, and private repository history.

The private `wan0net/link42` repository remains private and independent. This repository must never receive that repository's `.git` directory or a filtered copy of its history.

## Licensing

Software in this repository is licensed under the [GNU Affero General Public License v3.0 only](LICENSE), identified by the SPDX expression `AGPL-3.0-only`.

Original editorial content under `content/blog/**` and `content/learn/**` is licensed under [Creative Commons Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/), identified by `CC-BY-NC-4.0`. Third-party material remains under its original terms. The Link42 name, logos, and other brand assets are reserved and are not licensed under either licence. See [COPYRIGHT.md](COPYRIGHT.md), [TRADEMARKS.md](TRADEMARKS.md), and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Copyright © 2026 Iain Dickson.
