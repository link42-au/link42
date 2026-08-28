<script lang="ts">
let { data } = $props();

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
</script>

<svelte:head>
	<title>Blog — link42</title>
	<meta name="description" content="Straight-talking notes from link42 on cybersecurity, assurance, risk, and the gap between the claim and the evidence." />
	<meta property="og:title" content="Blog — link42" />
	<meta property="og:description" content="Straight-talking notes from link42 on cybersecurity, assurance, risk, and the gap between the claim and the evidence." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://link42.app/blog" />
	<meta property="og:site_name" content="Link42" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Blog — link42" />
	<meta name="twitter:description" content="Straight-talking notes from link42 on cybersecurity, assurance, risk, and the gap between the claim and the evidence." />
	<link rel="canonical" href="https://link42.app/blog" />
	<link rel="alternate" type="application/rss+xml" title="link42 blog" href="https://link42.app/blog/rss.xml" />
</svelte:head>

<div class="blog-shell">
	<header class="blog-header">
		<div class="blog-kicker">Field notes</div>
		<h1>Blog</h1>
		<p>Security, assurance, and the occasional necessary translation from procurement language into English.</p>
		<a class="rss-link" href="/blog/rss.xml">RSS feed <span aria-hidden="true">↗</span></a>
	</header>

	<section class="post-list" aria-label="Blog articles">
		{#if data.articles.length === 0}
			<p class="empty-state">No articles have been published yet.</p>
		{:else}
		{#each data.articles as post}
			<article class="post-card">
				<a class="post-link" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
					<div class="post-meta">
						<time datetime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
						<span aria-hidden="true">·</span>
						<span>{post.author}</span>
					</div>
					<h2>{post.title}</h2>
					<p>{post.summary}</p>
					{#if post.tags.length}
						<ul class="tag-list" aria-label="Article topics">
							{#each post.tags as tag}
								<li>{tag}</li>
							{/each}
						</ul>
					{/if}
					<span class="read-more">Read article <span aria-hidden="true">→</span></span>
				</a>
			</article>
		{/each}
		{/if}
	</section>
</div>

<style>
	.blog-shell {
		width: min(100%, 820px);
		margin: 0 auto;
		padding: 64px 24px 88px;
	}

	.blog-header {
		max-width: 660px;
		padding-bottom: 40px;
		border-bottom: 1px solid var(--border);
	}

	.blog-kicker {
		font-family: var(--font-mono);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-dim);
		margin-bottom: 12px;
	}

	.blog-header h1 {
		font-size: clamp(32px, 6vw, 48px);
		line-height: 1.05;
		letter-spacing: -0.04em;
		margin-bottom: 16px;
	}

	.blog-header p {
		font-size: 16px;
		line-height: 1.65;
		color: var(--text-mid);
		max-width: 580px;
	}

	.rss-link {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		margin-top: 20px;
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 600;
		color: var(--text-mid);
	}

	.rss-link:hover,
	.rss-link:focus-visible {
		color: var(--text);
	}

	.post-list {
		display: grid;
		gap: 0;
	}

	.empty-state {
		padding: 36px 0;
		color: var(--text-mid);
	}

	.post-card {
		border-bottom: 1px solid var(--border);
	}

	.post-link {
		display: block;
		position: relative;
		padding: 36px 44px 36px 0;
		border-radius: 8px;
	}

	.post-link:hover h2,
	.post-link:focus-visible h2 {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 4px;
	}

	.post-link:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 4px;
	}

	.post-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 7px;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--text-dim);
		margin-bottom: 11px;
	}

	.post-card h2 {
		font-size: clamp(20px, 3vw, 26px);
		line-height: 1.25;
		letter-spacing: -0.025em;
		margin-bottom: 12px;
	}

	.post-card p {
		font-size: 14px;
		line-height: 1.7;
		color: var(--text-mid);
		max-width: 680px;
	}

	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		list-style: none;
		padding: 0;
		margin: 18px 0 0;
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

	.read-more {
		position: absolute;
		right: 0;
		bottom: 38px;
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 600;
		color: var(--text-dim);
	}

	.post-link:hover .read-more,
	.post-link:focus-visible .read-more {
		color: var(--text);
	}

	@media (max-width: 640px) {
		.blog-shell {
			padding: 48px 20px 64px;
		}

		.blog-header {
			padding-bottom: 32px;
		}

		.blog-header p {
			font-size: 15px;
		}

		.post-link {
			padding: 30px 0;
		}

		.read-more {
			position: static;
			display: inline-block;
			margin-top: 18px;
		}
	}
</style>
