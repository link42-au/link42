# Link42

This repository is the independent, public source for the Link42 company website at [link42.app](https://link42.app). The website is being separated from Link42's private platform monorepo so that its public source, content provenance, licensing boundaries, and release history can be reviewed without exposing private services or operational configuration.

The repository contains the public-only website shell and the publication safeguards used to keep it independent of the private platform. Content is being added in small, tested features recorded in [PLAN.md](PLAN.md). Until the public release and production cutover gates are complete, this repository is source-in-progress rather than the canonical production deployment.

## Development

Requirements:

- Node.js 22
- pnpm 10.15.1

Install the locked toolchain and run the repository-policy checks:

```sh
pnpm install --frozen-lockfile
pnpm verify
```

The source manifest is pinned to a single private-source commit. A path not explicitly listed in that manifest is rejected by default. See [provenance/SOURCE_PROVENANCE.md](provenance/SOURCE_PROVENANCE.md) before importing any material.

## Publication boundary

The intended public website includes the company pages, Learn corpus, Blog and RSS feed described in [PLAN.md](PLAN.md). It excludes authentication, sessions, user data, APIs, investigations, reports, private services, infrastructure specifications, credentials, environment files, deployment identifiers, and private repository history.

The private `wan0net/link42` repository remains private and independent. This repository must never receive that repository's `.git` directory or a filtered copy of its history.

## Licensing

Software in this repository is licensed under the [GNU Affero General Public License v3.0 only](LICENSE), identified by the SPDX expression `AGPL-3.0-only`.

Original editorial content expressly identified as such is licensed under [Creative Commons Attribution-NonCommercial 4.0 International](https://creativecommons.org/licenses/by-nc/4.0/), identified by `CC-BY-NC-4.0`. Third-party material remains under its original terms. The Link42 name, logos, and other brand assets are reserved and are not licensed under either licence. See [COPYRIGHT.md](COPYRIGHT.md), [TRADEMARKS.md](TRADEMARKS.md), and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

Copyright © 2026 Iain Dickson.
