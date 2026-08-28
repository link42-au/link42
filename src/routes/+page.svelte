<script lang="ts">
import { browser } from "$app/environment";

let { data } = $props();
let theme = $state("light");

const formatArticleDate = (value: string) =>
  new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));

$effect(() => {
  if (browser) {
    theme = document.documentElement.getAttribute("data-theme") || "light";
  }
});
</script>

<svelte:head>
	<title>link42 — Cyber without the theatre</title>
	<meta
		name="description"
		content="link42 builds tools for people who actually do security. No dashboards of dashboards. No compliance theatre. Just things that work."
	/>
	<meta property="og:title" content="link42 — Cyber without the theatre" />
	<meta property="og:description" content="link42 builds tools for people who actually do security. No dashboards of dashboards. No compliance theatre. Just things that work." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://link42.app" />
	<meta property="og:site_name" content="Link42" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="link42 — Cyber without the theatre" />
	<meta name="twitter:description" content="link42 builds tools for people who actually do security. No dashboards of dashboards. No compliance theatre. Just things that work." />
	<link rel="canonical" href="https://link42.app" />
	<link rel="alternate" type="application/rss+xml" title="link42 blog" href="https://link42.app/blog/rss.xml" />
</svelte:head>

<!-- Hero -->
<section class="hero">
	<div class="landing-logo">
		<img src={theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"} alt="link42" />
	</div>
	<div class="hero-badge">Australian-built security tooling</div>
	<h1>Security tooling that starts useful and stays honest.</h1>
	<p>
		link42 builds small, focused tools for people who actually do security.
		Rule1 is live now. Patch8 and threat10 are coming back once their data
		pipelines are ready. No reporting dashboards for launch day, no pretend
		coverage, just the working parts first.
	</p>
	<div class="hero-links">
		<a href="https://rule1.link42.app" class="btn-primary">Open rule1</a>
		<a href="#products" class="btn-ghost">See what is next</a>
	</div>
</section>

{#if data.latestArticle}
	<section class="latest-article" aria-labelledby="latest-article-title">
		<a class="latest-article-card" href={`/blog/${data.latestArticle.slug}`}>
			<div class="latest-article-label">Latest from the blog</div>
			<div class="latest-article-content">
				<div>
					<div class="latest-article-meta">
						<time datetime={data.latestArticle.publishedAt}>{formatArticleDate(data.latestArticle.publishedAt)}</time>
						<span aria-hidden="true">·</span>
						<span>{data.latestArticle.author}</span>
					</div>
					<h2 id="latest-article-title">{data.latestArticle.title}</h2>
					<p>{data.latestArticle.summary}</p>
				</div>
				<span class="latest-article-action">Read article <span aria-hidden="true">→</span></span>
			</div>
		</a>
	</section>
{/if}

<!-- Manifesto -->
<section class="manifesto">
	<div class="manifesto-inner">
		<h2>How it started</h2>
		<p>
			We spent years working in cyber &mdash; writing policies, triaging
			controls, sitting through vendor pitches for tools that cost six
			figures and solved problems nobody had. The ISM had 800+ controls
			buried in a PDF. We needed to actually work with them. So we built
			<strong>rule1</strong> &mdash; a searchable, filterable,
			version-diffable ISM explorer.
		</p>
		<p>
			<strong>It worked.</strong> People started using it. Not because we
			marketed it, but because it solved a real problem that practitioners
			actually had. That was the proof we needed: small, focused tools
			built from direct experience are worth more than enterprise platforms
			built from pitch decks.
		</p>
		<p>
			So now we're building more. Same philosophy &mdash; find a problem
			we've lived through, build the tool we wished existed, ship it carefully,
			keep it sharp. No roadmap theatre. <strong>Rule1 is live for public
			use today</strong>; the other products stay quiet until their data is
			ready.
		</p>
		<p>
			And yes &mdash; <strong>we use AI to build this.</strong>
			Unapologetically. It lets a small team ship at the pace of a large one.
			But we're not hiding behind it. Every piece of AI-generated content in
			our tools is clearly labelled. Our opinions are ours. The code is ours
			to maintain. AI is the power tool, not the craftsman.
		</p>
	</div>
</section>

<!-- Products -->
<section class="products" id="products">
	<div class="products-header">
		<h2>What we're building</h2>
		<p>
			One live tool, two focused products returning once the pipelines are ready.
		</p>
	</div>
	<div class="product-grid">
		<a href="https://rule1.link42.app" class="product-card">
			<div class="product-name">
				<svg class="product-logo" viewBox="0 0 120 120" width="28" height="28">
					<polyline points="38,72 54,56 66,64 82,42" fill="none" stroke="var(--text-dim)" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" />
					<circle cx="38" cy="72" r="6" fill="var(--accent-blue)" />
					<circle cx="54" cy="56" r="6" fill="var(--text-dim)" />
					<circle cx="66" cy="64" r="6" fill="var(--accent-blue)" />
					<circle cx="82" cy="42" r="6" fill="var(--text-dim)" />
				</svg>
				rule1
			</div>
			<h3>Where it all started</h3>
			<p>
				The Australian Information Security Manual has 800+ controls
				across dozens of topics. The official format is a PDF. We turned
				it into a searchable, filterable, version-diffable explorer
				&mdash; because reading security controls shouldn't require a
				magnifying glass and a stiff drink.
			</p>
			<span class="product-tag tag-public">Live &middot; Free</span>
		</a>

		<div class="product-card product-card--disabled">
			<div class="product-name">
				<svg class="product-logo" viewBox="0 0 120 120" width="28" height="28">
					<circle cx="60" cy="60" r="20" fill="none" stroke="var(--text-dim)" stroke-width="5" />
					<line x1="74" y1="74" x2="86" y2="86" stroke="var(--accent-orange)" stroke-width="10" stroke-linecap="round" />
				</svg>
				threat10
			</div>
			<h3>Threat intel without the price tag</h3>
			<p>
				Open-source threat feeds exist, but they're scattered across
				a dozen formats and APIs. threat10 pulls them together
				&mdash; normalises IOCs from Abuse.ch, MITRE ATT&amp;CK,
				PhishTank, and more into one searchable source of truth.
			</p>
			<span class="product-tag tag-disabled">Pipeline rebuild</span>
		</div>

		<div class="product-card product-card--disabled">
			<div class="product-name">
				<svg class="product-logo" viewBox="0 0 120 120" width="28" height="28">
					<path d="M 60 20 L 25 28 L 25 65 C 25 85 45 95 60 102 Z" fill="var(--text-dim)" opacity="0.5" />
					<path d="M 60 20 L 95 28 L 95 65 C 95 85 75 95 60 102 Z" fill="var(--accent-rose)" />
				</svg>
				patch8
			</div>
			<h3>Vulnerability intel, unified</h3>
			<p>
				NVD, EPSS, CISA KEV &mdash; the data you need to prioritise
				patching lives in three different government feeds that don't
				talk to each other. patch8 pulls them into one searchable
				database with risk scoring and enrichment.
			</p>
			<span class="product-tag tag-disabled">Pipeline rebuild</span>
		</div>

	</div>
</section>

<!-- Platform -->
<section class="platform">
	<div class="platform-inner">
		<h2>One integrated platform</h2>
		<p class="platform-intro">
			Rule1 is the first public surface on the rebuilt platform. The rest comes online when each service is boring, observable, and genuinely useful.
		</p>
		<div class="platform-features">
			<div class="platform-feature">
				<div class="feature-icon feature-icon--teal">
					<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
				</div>
				<h3>Shared Identity</h3>
				<p>login2 is the account layer for the platform. Public tools remain usable without an account where that makes sense.</p>
			</div>
			<div class="platform-feature">
				<div class="feature-icon feature-icon--default">
					<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
				</div>
				<h3>Unified Experience</h3>
				<p>A consistent design language and a persistent PlatformBar means you can jump between apps without losing your context.</p>
			</div>
			<div class="platform-feature">
				<div class="feature-icon feature-icon--blue">
					<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
				</div>
				<h3>Container Deployed</h3>
				<p>The rebuild is moving to container-friendly Node services on DigitalOcean, with static public data served from snapshots where possible.</p>
			</div>
		</div>
	</div>
</section>

<!-- Principles -->
<section class="principles">
	<div class="principles-inner">
		<h2>How we build</h2>
		<div class="principles-grid">
			<div class="principle">
				<h3>Small and sharp</h3>
				<p>
					Every tool does one thing well. We'd rather ship three
					focused tools in order than one platform-shaped promise that
					pretends everything is ready at once.
				</p>
			</div>
			<div class="principle">
				<h3>Free where it counts</h3>
				<p>
					The basic tools will stay free for non-commercial use,
					permanently. Premium tiers will exist &mdash; running
					infrastructure costs money &mdash; but the core experience
					won't be paywalled.
				</p>
			</div>
			<div class="principle">
				<h3>Predictable by default</h3>
				<p>
					Public intelligence data is served from local SQLite snapshots,
					mutable user data lives in Postgres, and every service can run as
					a boring, inspectable container.
				</p>
			</div>
			<div class="principle">
				<h3>Born from experience</h3>
				<p>
					Years of doing the work &mdash; the audits, the policies,
					the board decks. We don't guess what practitioners need. We
					were practitioners. We build what we wished existed.
				</p>
			</div>
			<div class="principle">
				<h3>AI-assisted, human-owned</h3>
				<p>
					We use AI heavily to write code and generate content &mdash;
					and we label every bit of it. You'll always know what's a
					human opinion and what came from a model. Transparency isn't
					optional.
				</p>
			</div>
			<div class="principle">
				<h3>Practitioners first</h3>
				<p>
					Built for the people at the coalface &mdash; the analysts
					triaging alerts, the GRC leads wrestling frameworks, the
					mentors giving their time. If it doesn't help them, it
					doesn't ship.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="cta">
	<h2>Jump in</h2>
	<p>
		No sign-up required for the public tools. No "book a demo" button. Just
		go use what is live.
	</p>
	<div class="cta-links">
		<a href="https://rule1.link42.app" class="cta-link">
			<span class="dot dot--blue"></span>
			rule1.link42.app
		</a>
	</div>
</section>

<!-- AI Notice -->
<section class="ai-notice">
	<div class="ai-notice-inner">
		<div class="ai-notice-tag">AI-generated content</div>
		<p>
			We didn't write this page. An AI did, based on our direction. We
			were busy building the actual tools. That's the point.
		</p>
	</div>
</section>

<style>
	/* ── Hero ── */
	.hero {
		padding: 100px 24px 80px;
		text-align: center;
		max-width: 780px;
		margin: 0 auto;
	}
	.landing-logo {
		width: 200px;
		height: 200px;
		margin: 0 auto 0;
	}
	.landing-logo img {
		width: 100%;
		height: 100%;
	}
	.hero-badge {
		display: inline-block;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-dim);
		border: 1px solid var(--border);
		border-radius: 20px;
		padding: 4px 14px;
		margin-bottom: 28px;
	}
	.hero h1 {
		font-size: clamp(32px, 5vw, 48px);
		font-weight: 700;
		letter-spacing: -0.035em;
		line-height: 1.15;
		margin-bottom: 24px;
	}
	.hero p {
		font-size: 17px;
		line-height: 1.7;
		color: var(--text-mid);
		max-width: 600px;
		margin: 0 auto 40px;
	}
	.hero-links {
		display: flex;
		gap: 12px;
		justify-content: center;
		flex-wrap: wrap;
	}
	.hero-links a {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		font-weight: 600;
		padding: 10px 20px;
		border-radius: 8px;
		transition: all 0.15s;
		text-decoration: none;
	}
	.btn-primary {
		background: var(--text);
		color: var(--bg);
	}
	.btn-primary:hover {
		opacity: 0.85;
	}
	.btn-ghost {
		border: 1px solid var(--border);
		color: var(--text);
	}
	.btn-ghost:hover {
		background: var(--bg-hover);
		border-color: var(--border-strong);
	}

	/* ── Latest article ── */
	.latest-article {
		max-width: 900px;
		margin: 0 auto 80px;
		padding: 0 24px;
	}

	.latest-article-card {
		display: block;
		padding: 24px 26px;
		background: var(--bg-subtle);
		border: 1px solid var(--border);
		border-radius: 10px;
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.latest-article-card:hover {
		border-color: var(--border-strong);
		box-shadow: var(--shadow-md);
	}

	.latest-article-card:focus-visible {
		outline: 2px solid var(--text);
		outline-offset: 4px;
	}

	.latest-article-label {
		font-family: var(--font-mono);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--text-dim);
		margin-bottom: 14px;
	}

	.latest-article-content {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: end;
		gap: 32px;
	}

	.latest-article-meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 7px;
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--text-dim);
		margin-bottom: 8px;
	}

	.latest-article h2 {
		font-size: 20px;
		line-height: 1.3;
		letter-spacing: -0.025em;
		margin-bottom: 8px;
	}

	.latest-article p {
		font-size: 13px;
		line-height: 1.65;
		color: var(--text-mid);
		max-width: 650px;
	}

	.latest-article-action {
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 600;
		color: var(--text-dim);
		white-space: nowrap;
		padding-bottom: 2px;
	}

	.latest-article-card:hover .latest-article-action {
		color: var(--text);
	}

	/* ── Manifesto ── */
	.manifesto {
		padding: 60px 24px;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		background: var(--bg-subtle);
	}
	.manifesto-inner {
		max-width: 680px;
		margin: 0 auto;
	}
	.manifesto h2 {
		font-size: 22px;
		font-weight: 700;
		letter-spacing: -0.03em;
		margin-bottom: 20px;
	}
	.manifesto p {
		font-size: 15px;
		line-height: 1.75;
		color: var(--text-mid);
		margin-bottom: 16px;
	}
	.manifesto p:last-child {
		margin-bottom: 0;
	}
	.manifesto :global(strong) {
		color: var(--text);
		font-weight: 600;
	}

	/* ── Products ── */
	.products {
		padding: 80px 24px;
		max-width: 1100px;
		margin: 0 auto;
	}
	.products-header {
		text-align: center;
		margin-bottom: 48px;
	}
	.products-header h2 {
		font-size: 26px;
		font-weight: 700;
		letter-spacing: -0.03em;
		margin-bottom: 10px;
	}
	.products-header p {
		font-size: 15px;
		color: var(--text-mid);
	}
	.product-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 20px;
	}
	.product-card {
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 28px 24px;
		background: var(--bg-card);
		transition:
			box-shadow 0.2s,
			border-color 0.2s;
		display: flex;
		flex-direction: column;
		text-decoration: none;
		color: inherit;
	}
	.product-card:hover {
		box-shadow: var(--shadow-md);
		border-color: var(--border-strong);
	}
	.product-card--disabled {
		background: var(--bg-subtle);
		cursor: default;
	}
	.product-card--disabled:hover {
		box-shadow: none;
		border-color: var(--border);
	}
	.product-name {
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: -0.01em;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
	}
	.product-card h3 {
		font-size: 17px;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-bottom: 10px;
	}
	.product-card p {
		font-size: 14px;
		line-height: 1.65;
		color: var(--text-mid);
		flex: 1;
	}
	.product-tag {
		display: inline-block;
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 3px 8px;
		border-radius: 4px;
		margin-top: 16px;
		align-self: flex-start;
	}
	.tag-public {
		background: var(--blue-bg);
		color: var(--accent-blue);
		border: 1px solid var(--blue-border);
	}
	.tag-disabled {
		background: var(--bg-subtle);
		color: var(--text-mid);
		border: 1px solid var(--border);
	}
	.product-logo {
		flex-shrink: 0;
	}

	/* ── Platform ── */
	.platform {
		padding: 80px 24px;
		border-top: 1px solid var(--border);
		background: var(--bg);
	}
	.platform-inner {
		max-width: 900px;
		margin: 0 auto;
		text-align: center;
	}
	.platform h2 {
		font-size: 26px;
		font-weight: 700;
		letter-spacing: -0.03em;
		margin-bottom: 16px;
	}
	.platform-intro {
		font-size: 16px;
		line-height: 1.6;
		color: var(--text-mid);
		max-width: 600px;
		margin: 0 auto 48px;
	}
	.platform-features {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 32px;
		text-align: left;
	}
	.platform-feature {
		padding: 24px;
		border: 1px solid var(--border);
		border-radius: 10px;
		background: var(--bg-subtle);
	}
	.feature-icon {
		margin-bottom: 16px;
	}
	.feature-icon--teal { color: var(--accent-teal); }
	.feature-icon--default { color: var(--text); }
	.feature-icon--blue { color: var(--accent-blue); }
	.platform-feature h3 {
		font-size: 16px;
		font-weight: 600;
		margin-bottom: 8px;
	}
	.platform-feature p {
		font-size: 14px;
		line-height: 1.6;
		color: var(--text-mid);
	}

	/* ── Principles ── */
	.principles {
		padding: 80px 24px;
		border-top: 1px solid var(--border);
		background: var(--bg-subtle);
	}
	.principles-inner {
		max-width: 900px;
		margin: 0 auto;
	}
	.principles h2 {
		font-size: 22px;
		font-weight: 700;
		letter-spacing: -0.03em;
		margin-bottom: 36px;
		text-align: center;
	}
	.principles-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 32px;
	}
	.principle h3 {
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 6px;
	}
	.principle p {
		font-size: 13px;
		line-height: 1.65;
		color: var(--text-mid);
	}

	/* ── CTA ── */
	.cta {
		padding: 80px 24px;
		text-align: center;
		border-top: 1px solid var(--border);
	}
	.cta h2 {
		font-size: 22px;
		font-weight: 700;
		letter-spacing: -0.03em;
		margin-bottom: 12px;
	}
	.cta p {
		font-size: 15px;
		color: var(--text-mid);
		margin-bottom: 28px;
		max-width: 500px;
		margin-left: auto;
		margin-right: auto;
	}
	.cta-links {
		display: flex;
		gap: 16px;
		justify-content: center;
		flex-wrap: wrap;
	}
	.cta-link {
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: 500;
		padding: 10px 20px;
		border: 1px solid var(--border);
		border-radius: 8px;
		transition: all 0.15s;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		text-decoration: none;
		color: var(--text);
	}
	.cta-link:hover {
		background: var(--bg-hover);
		border-color: var(--border-strong);
	}
	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		display: inline-block;
	}
	.dot--blue { background: var(--accent-blue); }

	/* ── AI Notice ── */
	.ai-notice {
		padding: 32px 24px;
		border-top: 1px solid var(--border);
		background: var(--bg-subtle);
		text-align: center;
	}
	.ai-notice-inner {
		max-width: 540px;
		margin: 0 auto;
	}
	.ai-notice-tag {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		padding: 3px 8px;
		border-radius: 4px;
		border: 1px solid var(--border-strong);
		color: var(--text-dim);
		margin-bottom: 10px;
	}
	.ai-notice p {
		font-size: 13px;
		line-height: 1.6;
		color: var(--text-dim);
	}

	/* ── Responsive ── */
	@media (max-width: 640px) {
		.hero {
			padding: 64px 20px 56px;
		}
		.hero h1 {
			font-size: 28px;
		}
		.hero p {
			font-size: 15px;
		}
		.manifesto {
			padding: 40px 20px;
		}
		.latest-article {
			margin-bottom: 56px;
			padding: 0 20px;
		}
		.latest-article-card {
			padding: 22px 20px;
		}
		.latest-article-content {
			grid-template-columns: 1fr;
			gap: 18px;
		}
		.products {
			padding: 56px 20px;
		}
		.platform {
			padding: 56px 20px;
		}
		.principles {
			padding: 56px 20px;
		}
		.cta {
			padding: 56px 20px;
		}
		.product-grid {
			grid-template-columns: 1fr;
		}
		.platform-features {
			grid-template-columns: 1fr;
		}
		.principles-grid {
			grid-template-columns: 1fr;
			gap: 24px;
		}
	}
</style>
