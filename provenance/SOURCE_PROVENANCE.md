# Source provenance

The public website migration is pinned to `wan0net/link42@aaa140cdd753d6576f0a2bf3292b31518b88fbcc`.

The machine-readable [source manifest](source-manifest.json) is authoritative for copied paths. Direct source inputs may be read only from that immutable commit. Generated outputs must be regenerated locally from approved inputs. Adaptation-only references may inform a clean public implementation but must not be copied. Every other private-source path is denied by default.

Package manifests, lockfiles, configuration, documentation, licences, CI, and tests that are not direct source inputs must be authored cleanly in this independent repository. The private repository's `.git` directory and history must never be copied or filtered into this repository.

Actual imports and adaptations are recorded in [source-receipts.json](source-receipts.json). Each receipt names its approved source path, SHA-256 at the pinned commit, use mode, and public destination. `verbatim` entries must remain byte-identical; adapted inputs and adaptation-only references are explicitly distinguished. Vendored third-party artifacts and their checksums are recorded separately in [third-party-assets.json](third-party-assets.json).

The Learn corpus receipt batch covers the schema README and all 14 canonical Markdown inputs as byte-identical `verbatim` files. The generator, Learn layout, overview, and source tests are recorded as `adapted-input` because the public repository adds fail-closed route and URL validation, public-only integration, accessibility, and destination formatting. The 14 route components are intentionally absent from receipts because they are regenerated outputs, not copied source.

The Blog receipt batch covers the sole pinned Markdown article as a byte-identical `verbatim` file. The parser, server loads, Blog index, article route, RSS handler, homepage integration, and source tests are recorded as `adapted-input` because the public repository strengthens metadata and URL validation, fails closed on unsupported corpus entries, preserves the clean public homepage, and adds destination accessibility coverage. Browser tests are clean destination-authored verification and therefore have no private-source receipt.

Before importing a batch, pass every proposed source-relative path to:

```sh
node scripts/check-source-manifest.mjs path/to/file another/approved/file
```

The command exits unsuccessfully if the manifest is malformed, its source identity drifts, or any supplied path is not directly allowed. `pnpm verify` also validates every receipt and third-party checksum, then checks the current public tree against the fail-closed public-tree policy.
