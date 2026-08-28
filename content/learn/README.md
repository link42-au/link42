# Learn content schema

Learn pages are authored here and compiled into Svelte routes by `pnpm generate:content`. Generated routes are build artifacts and must not be edited directly.

Each page has strict JSON-valued frontmatter followed by one or more ordered section blocks:

```markdown
---
title: "Page title"
slug: "category/page-slug"
subtitle: "Visible page subtitle"
seoDescription: "Search and social description."
navigationOrder: 10
category: "Category name"
reviewStatus: "verified"
---
:::section {"tag":"Eyebrow","title":"Section heading"}
:::factual
Factual Markdown, including [safe links](https://example.com).
:::satirical
Satirical Markdown covering the same subject.
:::endsection
```

All seven frontmatter fields are required; unknown fields fail generation. Slugs use lowercase letters, numbers, hyphens, and `/` separators only. Review status is `verified` or `unverified`. Both content flavours are required for every section. Raw HTML and links other than root-relative, anchors, or absolute HTTPS URLs are rejected.

Run `pnpm generate:content --check` to detect source/output drift without changing files.
