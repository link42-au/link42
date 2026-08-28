# Link42

This repository is the independent, public source for the Link42 company website at [link42.app](https://link42.app). The website is being separated from Link42's private platform monorepo so that its public source, content provenance, licensing boundaries, and release history can be reviewed without exposing private services or operational configuration.

The repository contains the public-only website shell and the publication safeguards used to keep it independent of the private platform. Content is being added in small, tested features recorded in [PLAN.md](PLAN.md). Until the public release and production cutover gates are complete, this repository is source-in-progress rather than the canonical production deployment.

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

Route and internal-link verification starts the built website only on loopback.
It validates external HTTPS link syntax but deliberately does not fetch external
URLs. CI uses the same command with read-only repository access and no secrets.

The source manifest is pinned to a single private-source commit. A path not explicitly listed in that manifest is rejected by default. See [provenance/SOURCE_PROVENANCE.md](provenance/SOURCE_PROVENANCE.md) before importing any material.

## Publication boundary

The intended public website includes the company pages, Learn corpus, Blog and RSS feed described in [PLAN.md](PLAN.md). It excludes authentication, sessions, user data, APIs, investigations, reports, private services, infrastructure specifications, credentials, environment files, deployment identifiers, and private repository history.

The private `wan0net/link42` repository remains private and independent. This repository must never receive that repository's `.git` directory or a filtered copy of its history.

## Licensing

Software in this repository is licensed under the [GNU Affero General Public License v3.0 only](LICENSE), identified by the SPDX expression `AGPL-3.0-only`.

Original editorial content under `content/blog/**` and `content/learn/**` is licensed under [Creative Commons Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/), identified by `CC-BY-NC-4.0`. Third-party material remains under its original terms. The Link42 name, logos, and other brand assets are reserved and are not licensed under either licence. See [COPYRIGHT.md](COPYRIGHT.md), [TRADEMARKS.md](TRADEMARKS.md), and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Copyright © 2026 Iain Dickson.
