# Third-party notices

This repository's own software is licensed under `AGPL-3.0-only`, but third-party material retains its original terms and is not relicensed by this repository.

## Geist fonts

Copyright 2024 The Geist Project Authors.

Geist and Geist Mono are vendored from Vercel's authoritative `vercel/geist-font` repository at release `v1.7.2`, commit [`a73329da8fc62afc917f796555202e4997f79b7c`](https://github.com/vercel/geist-font/commit/a73329da8fc62afc917f796555202e4997f79b7c). The upstream release is [`v1.7.2`](https://github.com/vercel/geist-font/releases/tag/v1.7.2). They are licensed under the SIL Open Font License 1.1; the complete upstream licence is retained at [`static/fonts/OFL.txt`](static/fonts/OFL.txt).

| Local file | Exact upstream source | SHA-256 |
|---|---|---|
| `static/fonts/Geist-Variable.woff2` | [`packages/next/dist/fonts/geist-sans/Geist-Variable.woff2`](https://github.com/vercel/geist-font/blob/a73329da8fc62afc917f796555202e4997f79b7c/packages/next/dist/fonts/geist-sans/Geist-Variable.woff2) | `2ffebe993e969069a9789d15164b7715d42491b5835516c5e3b935d5f81b05f1` |
| `static/fonts/GeistMono-Variable.woff2` | [`packages/next/dist/fonts/geist-mono/GeistMono-Variable.woff2`](https://github.com/vercel/geist-font/blob/a73329da8fc62afc917f796555202e4997f79b7c/packages/next/dist/fonts/geist-mono/GeistMono-Variable.woff2) | `afaacc4c5fbba89d2ebf7a02dc4070208540874592a5504d57175782fe893101` |
| `static/fonts/OFL.txt` | [`OFL.txt`](https://github.com/vercel/geist-font/blob/a73329da8fc62afc917f796555202e4997f79b7c/OFL.txt) | `c683bfbcc7e087f5d37a54ef628f10387c451a83ddc459b151403a164ac46c90` |

The website loads these files from its own `/fonts/` path. It makes no runtime request to Google Fonts or another font host.

## Package dependencies

Runtime and development packages are installed from the npm registry at the exact versions in `package.json` and locked transitively in `pnpm-lock.yaml`. Their package metadata and licence files are authoritative for their individual terms. The direct packages are Svelte, SvelteKit, adapter-node, Vite, TypeScript, Vitest, Biome, Svelte Check, Playwright, Axe for Playwright, and Node.js type declarations. They are not relicensed under this repository's AGPL licence.

This notice must be updated in the same change that adds, removes, or materially changes a distributed third-party component.
