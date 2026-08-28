# Contributing to Link42

Focused fixes, accessibility improvements, tests, and corrections to public content are welcome once the repository is public.

## Before opening a pull request

1. Discuss large behavioural, dependency, licensing, content-model, or deployment changes in an issue first.
2. Use the pinned Node.js and pnpm versions documented in the [README](README.md).
3. Keep changes inside the public boundary in [PLAN.md](PLAN.md). Never commit credentials, environment files, user data, private service code, private operational configuration, or material from an unapproved source path.
4. For migrated material, update the source manifest and provenance record in the same pull request. The source commit must remain immutable and every copied path must be explicitly allowed.
5. Add a regression test for changed behaviour and run `pnpm verify` before requesting review.

Keep pull requests small enough to review and state anything that was not verified locally. New dependencies require a concrete justification, compatible licensing, and an update to third-party notices where applicable.

By submitting project-authored software, you agree that it may be distributed under `AGPL-3.0-only`. By submitting original editorial content expressly placed in the editorial-content boundary, you agree that it may be distributed under `CC-BY-NC-4.0`. You must have the right to submit every contribution. Brand assets and third-party material require separate, explicit permission and are not accepted under those default contribution terms.

See [SECURITY.md](SECURITY.md) for vulnerability reporting.
