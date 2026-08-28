<script lang="ts">
let { data } = $props();

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));

const canonicalUrl = $derived(`https://link42.app/blog/${data.article.slug}`);
</script>

<svelte:head>
	<title>{data.article.title} — link42</title>
	<meta name="description" content={data.article.seoDescription} />
	<meta name="author" content={data.article.author} />
	<meta property="og:title" content={`${data.article.title} — link42`} />
	<meta property="og:description" content={data.article.seoDescription} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:site_name" content="Link42" />
	<meta property="article:published_time" content={data.article.publishedAt} />
	<meta property="article:author" content={data.article.author} />
	{#each data.article.tags as tag}
		<meta property="article:tag" content={tag} />
	{/each}
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={`${data.article.title} — link42`} />
	<meta name="twitter:description" content={data.article.seoDescription} />
	<link rel="canonical" href={canonicalUrl} />
	<link rel="alternate" type="application/rss+xml" title="link42 blog" href="https://link42.app/blog/rss.xml" />
</svelte:head>

<article class="article-shell">
	<nav class="breadcrumb" aria-label="Breadcrumb">
		<a href="/blog"><span aria-hidden="true">←</span> All articles</a>
	</nav>

	<header class="article-header">
		<div class="article-meta">
			<time datetime={data.article.publishedAt}>{formatDate(data.article.publishedAt)}</time>
			<span aria-hidden="true">·</span>
			<span>{data.article.author}</span>
		</div>
		<h1>{data.article.title}</h1>
		<p class="article-summary">{data.article.summary}</p>
		{#if data.article.tags.length}
			<ul class="tag-list" aria-label="Article topics">
				{#each data.article.tags as tag}
					<li>{tag}</li>
				{/each}
			</ul>
		{/if}
	</header>

	<div class="article-body">
		{@html data.article.html}
	</div>

	<footer class="article-footer">
		<p>Published by {data.article.author} for link42.</p>
		<a href="/blog"><span aria-hidden="true">←</span> Back to the blog</a>
	</footer>
</article>

<style>
	.article-shell {
		width: min(100%, 760px);
		margin: 0 auto;
		padding: 48px 24px 88px;
	}

	.breadcrumb {
		margin-bottom: 48px;
	}

	.breadcrumb a,
	.article-footer a {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 600;
		color: var(--text-dim);
	}

	.breadcrumb a:hover,
	.breadcrumb a:focus-visible,
	.article-footer a:hover,
	.article-footer a:focus-visible {
		color: var(--text);
	}

	.article-header {
		padding-bottom: 40px;
		border-bottom: 1px solid var(--border);
	}

	.article-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 7px;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--text-dim);
		margin-bottom: 16px;
	}

	.article-header h1 {
		font-size: clamp(32px, 6vw, 48px);
		line-height: 1.08;
		letter-spacing: -0.045em;
		max-width: 720px;
	}

	.article-summary {
		font-size: 17px;
		line-height: 1.65;
		color: var(--text-mid);
		margin-top: 22px;
		max-width: 660px;
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		list-style: none;
		padding: 0;
		margin: 24px 0 0;
	}

	.tag-list li {
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--text-dim);
		background: var(--bg-subtle);
		border: 1px solid var(--border);
		border-radius: 4px;
		padding: 3px 7px;
	}

	.article-body {
		padding: 28px 0 24px;
	}

	.article-body :global(h2) {
		font-size: 24px;
		line-height: 1.25;
		letter-spacing: -0.03em;
		margin: 48px 0 16px;
	}

	.article-body :global(h3) {
		font-size: 18px;
		line-height: 1.35;
		letter-spacing: -0.02em;
		margin: 34px 0 12px;
	}

	.article-body :global(p),
	.article-body :global(li) {
		font-size: 15px;
		line-height: 1.8;
		color: var(--text-mid);
	}

	.article-body :global(p) {
		margin: 0 0 18px;
	}

	.article-body :global(strong) {
		color: var(--text);
		font-weight: 650;
	}

	.article-body :global(a) {
		color: var(--accent);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}

	.article-body :global(a:hover),
	.article-body :global(a:focus-visible) {
		text-decoration-thickness: 2px;
	}

	.article-body :global(ul),
	.article-body :global(ol) {
		padding-left: 24px;
		margin: 0 0 22px;
	}

	.article-body :global(li) {
		padding-left: 4px;
		margin-bottom: 8px;
	}

	.article-body :global(blockquote) {
		margin: 28px 0;
		padding: 4px 0 4px 20px;
		border-left: 3px solid var(--border-strong);
	}

	.article-body :global(blockquote p) {
		font-size: 16px;
		font-style: italic;
		color: var(--text);
	}

	.article-body :global(code) {
		font-family: var(--font-mono);
		font-size: 0.88em;
		background: var(--bg-subtle);
		border: 1px solid var(--border);
		border-radius: 4px;
		padding: 1px 5px;
	}

	.article-body :global(pre) {
		overflow-x: auto;
		background: var(--bg-subtle);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 18px;
		margin: 24px 0;
	}

	.article-body :global(pre code) {
		border: 0;
		padding: 0;
		background: transparent;
	}

	.article-body :global(.table-wrap) {
		overflow-x: auto;
		margin: 28px 0;
	}

	.article-body :global(table) {
		display: block;
		width: 100%;
		overflow-x: auto;
		border-collapse: collapse;
		font-size: 13px;
	}

	.article-body :global(th),
	.article-body :global(td) {
		padding: 11px 12px;
		border: 1px solid var(--border);
		text-align: left;
		vertical-align: top;
		line-height: 1.55;
	}

	.article-body :global(th) {
		background: var(--bg-subtle);
		font-weight: 650;
		color: var(--text);
	}

	.article-body :global(td) {
		color: var(--text-mid);
	}

	.article-body :global(hr) {
		border: 0;
		border-top: 1px solid var(--border);
		margin: 40px 0;
	}

	.article-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		border-top: 1px solid var(--border);
		padding-top: 28px;
		margin-top: 28px;
	}

	.article-footer p {
		font-size: 12px;
		color: var(--text-dim);
	}

	@media (max-width: 640px) {
		.article-shell {
			padding: 36px 20px 64px;
		}

		.breadcrumb {
			margin-bottom: 36px;
		}

		.article-header {
			padding-bottom: 32px;
		}

		.article-summary {
			font-size: 15px;
		}

		.article-body :global(h2) {
			font-size: 21px;
			margin-top: 40px;
		}

		.article-body :global(p),
		.article-body :global(li) {
			font-size: 14px;
		}

		.article-footer {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
