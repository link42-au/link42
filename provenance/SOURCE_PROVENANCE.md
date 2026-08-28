# Source provenance

The public website migration is pinned to `wan0net/link42@aaa140cdd753d6576f0a2bf3292b31518b88fbcc`.

The machine-readable [source manifest](source-manifest.json) is authoritative for copied paths. Direct source inputs may be read only from that immutable commit. Generated outputs must be regenerated locally from approved inputs. Adaptation-only references may inform a clean public implementation but must not be copied. Every other private-source path is denied by default.

Package manifests, lockfiles, configuration, documentation, licences, CI, and tests that are not direct source inputs must be authored cleanly in this independent repository. The private repository's `.git` directory and history must never be copied or filtered into this repository.

Before importing a batch, pass every proposed source-relative path to:

```sh
node scripts/check-source-manifest.mjs path/to/file another/approved/file
```

The command exits unsuccessfully if the manifest is malformed, its source identity drifts, or any supplied path is not directly allowed. `pnpm verify` also checks the current public tree against the fail-closed public-tree policy.
