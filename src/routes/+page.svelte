<script lang="ts">
let { data } = $props();

const formatArticleDate = (value: string) =>
  new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
</script>

<svelte:head>
  <title>link42 — Cyber without the theatre</title>
  <meta
    name="description"
    content="link42 builds small, focused tools for people who actually do security. No dashboards of dashboards. No compliance theatre. Just things that work."
  />
  <meta property="og:title" content="link42 — Cyber without the theatre" />
  <meta
    property="og:description"
    content="link42 builds small, focused tools for people who actually do security. No dashboards of dashboards. No compliance theatre. Just things that work."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://link42.app" />
  <meta property="og:site_name" content="Link42" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="link42 — Cyber without the theatre" />
  <meta
    name="twitter:description"
    content="link42 builds small, focused tools for people who actually do security. No dashboards of dashboards. No compliance theatre. Just things that work."
  />
  <link rel="canonical" href="https://link42.app" />
  <link
    rel="alternate"
    type="application/rss+xml"
    title="link42 blog"
    href="https://link42.app/blog/rss.xml"
  />
</svelte:head>

<div class="home-page">
  <section class="home" aria-labelledby="home-title">
    <div class="home__mark" aria-hidden="true">
      <img src="/logo-light.svg" alt="" width="120" height="120" />
    </div>
    <p class="eyebrow">Australian-built security tooling</p>
    <h1 id="home-title">Security tooling that starts useful <span>and stays honest.</span></h1>
    <p class="home__intro">
      link42 builds small, focused tools for people who actually do security. Rule1 is available now.
      Everything else will be published when it is ready. No pretend coverage. Just the working parts first.
    </p>
    <div class="home__actions">
      <a class="primary-action" href="https://rule1.link42.app"
        >Open Rule1 <span aria-hidden="true">↗</span></a
      >
      <a class="text-action" href="/learn">Explore Learn <span aria-hidden="true">→</span></a>
    </div>
    <p class="build-note"><span aria-hidden="true"></span>One available tool. Future work stays quiet until it is ready.</p>
  </section>

  {#if data.latestArticle}
    <section class="latest-article" aria-labelledby="latest-article-title">
      <a class="latest-article__card" href={`/blog/${data.latestArticle.slug}`}>
        <p class="latest-article__label">Latest from the blog</p>
        <div class="latest-article__content">
          <div>
            <p class="latest-article__meta">
              <time datetime={data.latestArticle.publishedAt}
                >{formatArticleDate(data.latestArticle.publishedAt)}</time
              >
              <span aria-hidden="true">·</span>
              <span>{data.latestArticle.author}</span>
            </p>
            <h2 id="latest-article-title">{data.latestArticle.title}</h2>
            <p class="latest-article__summary">{data.latestArticle.summary}</p>
          </div>
          <span class="latest-article__action">Read article <span aria-hidden="true">→</span></span>
        </div>
      </a>
    </section>
  {/if}

  <section class="story" aria-labelledby="story-title">
    <div class="story__inner">
      <div>
        <p class="section-kicker">How it started</p>
        <h2 id="story-title">Build the tool you wished existed.</h2>
      </div>
      <div class="story__copy">
        <p>
          Link42 grew out of years spent writing policies, working through controls, and trying to turn
          security frameworks into practical decisions. Rule1 started with a simple need: make the
          Australian Information Security Manual easier to browse, search, compare, and track across
          releases.
        </p>
        <p>
          The philosophy is still the same: find a problem we have lived through, build the focused tool,
          ship it carefully, and keep it sharp. Rule1 is available now; future projects stay quiet until
          they are ready.
        </p>
      </div>
    </div>
  </section>

  <section class="product" aria-labelledby="product-title">
    <div class="section-heading">
      <p class="section-kicker">Available now</p>
      <h2 id="product-title">Security controls, made workable.</h2>
    </div>
    <article class="product-card">
      <div class="product-card__mark" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <polyline points="38,72 54,56 66,64 82,42" />
          <circle cx="38" cy="72" r="6" />
          <circle cx="54" cy="56" r="6" />
          <circle cx="66" cy="64" r="6" />
          <circle cx="82" cy="42" r="6" />
        </svg>
      </div>
      <div class="product-card__body">
        <p class="product-card__name">rule1</p>
        <h3>Browse the frameworks. Find the control. See what changed.</h3>
        <p>
          A searchable controls explorer for the ISM, NZISM, Cyber Essentials, NIST CSF 2.0, and NIST
          SP 800-53.
        </p>
        <p class="product-card__status">Available · Open source</p>
      </div>
      <div class="product-card__links">
        <a class="primary-action" href="https://rule1.link42.app">Open Rule1 <span aria-hidden="true">↗</span></a>
        <a class="text-action" href="https://github.com/link42-au/rule1">Rule1 repository <span aria-hidden="true">↗</span></a>
      </div>
    </article>
  </section>

  <section class="principles" aria-labelledby="principles-title">
    <div class="section-heading">
      <p class="section-kicker">How we build</p>
      <h2 id="principles-title">Useful, inspectable, accountable.</h2>
    </div>
    <div class="principles__grid">
      <article>
        <span>01</span>
        <h3>Small and sharp</h3>
        <p>Every tool should solve one real problem well. A focused release beats a platform-shaped promise.</p>
      </article>
      <article>
        <span>02</span>
        <h3>Inspectable by default</h3>
        <p>Public software should have visible provenance, clear licensing, and boundaries people can verify.</p>
      </article>
      <article>
        <span>03</span>
        <h3>AI-assisted, human-owned</h3>
        <p>Automation can accelerate the work. Ownership, review, and accountability remain human.</p>
      </article>
    </div>
  </section>

  <aside class="ai-note" aria-label="AI assistance notice">
    <p class="section-kicker">AI-assisted</p>
    <p>This page was drafted with AI assistance and reviewed by Iain Dickson.</p>
  </aside>
</div>

<style>
  .home-page {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
  }

  .home {
    min-height: min(760px, calc(100vh - 68px));
  }

  .home h1 {
    max-width: 900px;
    font-size: clamp(46px, 7vw, 86px);
    line-height: 0.98;
  }

  .home h1 span {
    display: block;
  }

  .latest-article,
  .product,
  .principles {
    width: min(100%, var(--content));
    margin: 0 auto;
    padding-inline: 24px;
  }

  .latest-article {
    margin-top: -42px;
    margin-bottom: 92px;
  }

  .latest-article__card {
    display: block;
    padding: 24px 26px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--bg-subtle);
    transition:
      border-color 0.15s,
      box-shadow 0.15s;
  }

  .latest-article__card:hover {
    border-color: var(--border-strong);
    box-shadow: var(--shadow);
  }

  .latest-article__label,
  .latest-article__meta,
  .latest-article__action,
  .section-kicker,
  .product-card__name,
  .product-card__status,
  .principles article > span {
    font-family: var(--font-mono);
  }

  .latest-article__label,
  .section-kicker {
    margin: 0 0 14px;
    color: var(--text-dim);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .latest-article__content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    gap: 32px;
  }

  .latest-article__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin: 0 0 9px;
    color: var(--text-dim);
    font-size: 11px;
  }

  .latest-article h2 {
    max-width: 720px;
    margin: 0;
    font-size: clamp(20px, 3vw, 25px);
    letter-spacing: -0.025em;
    line-height: 1.25;
  }

  .latest-article__summary {
    max-width: 680px;
    margin: 10px 0 0;
    color: var(--text-mid);
    font-size: 14px;
    line-height: 1.65;
  }

  .latest-article__action {
    color: var(--text-dim);
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }

  .story {
    padding: 92px 24px;
    border-block: 1px solid var(--border);
    background: var(--bg-subtle);
  }

  .story__inner {
    display: grid;
    grid-template-columns: minmax(240px, 0.75fr) minmax(0, 1.25fr);
    gap: clamp(48px, 8vw, 110px);
    width: min(100%, 980px);
    margin: 0 auto;
  }

  .story h2,
  .section-heading h2 {
    margin: 0;
    font-size: clamp(29px, 4.5vw, 46px);
    letter-spacing: -0.045em;
    line-height: 1.08;
  }

  .story__copy p {
    margin: 0;
    color: var(--text-mid);
    font-size: 15px;
    line-height: 1.8;
  }

  .story__copy p + p {
    margin-top: 20px;
  }

  .product,
  .principles {
    padding-block: 96px;
  }

  .section-heading {
    max-width: 620px;
    margin-bottom: 42px;
  }

  .product-card {
    display: grid;
    grid-template-columns: 86px minmax(0, 1fr) auto;
    align-items: center;
    gap: 28px;
    padding: clamp(24px, 4vw, 42px);
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--bg-card);
    box-shadow: var(--shadow);
  }

  .product-card__mark {
    display: grid;
    width: 86px;
    height: 86px;
    place-items: center;
    color: var(--text-mid);
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    border-radius: 18px;
  }

  .product-card__mark svg {
    width: 58px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 5;
  }

  .product-card__mark circle:nth-of-type(odd) {
    fill: var(--accent);
    stroke: none;
  }

  .product-card__mark circle:nth-of-type(even) {
    fill: var(--text-mid);
    stroke: none;
  }

  .product-card__name {
    margin: 0 0 6px;
    color: var(--accent);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .product-card h3 {
    margin: 0;
    font-size: clamp(20px, 3vw, 28px);
    letter-spacing: -0.03em;
  }

  .product-card__body > p:not(.product-card__name, .product-card__status) {
    max-width: 650px;
    margin: 10px 0 0;
    color: var(--text-mid);
  }

  .product-card__status {
    margin: 15px 0 0;
    color: var(--text-mid);
    font-size: 11px;
    font-weight: 650;
  }

  .product-card__links {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .principles {
    border-top: 1px solid var(--border);
  }

  .principles__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border-block: 1px solid var(--border);
  }

  .principles article {
    min-width: 0;
    padding: 32px;
  }

  .principles article + article {
    border-left: 1px solid var(--border);
  }

  .principles article > span {
    color: var(--accent);
    font-size: 10px;
  }

  .principles h3 {
    margin: 26px 0 10px;
    font-size: 18px;
    letter-spacing: -0.02em;
  }

  .principles article p {
    margin: 0;
    color: var(--text-mid);
    font-size: 13px;
    line-height: 1.7;
  }

  .ai-note {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 28px;
    width: min(calc(100% - 48px), 760px);
    margin: 0 auto 96px;
    padding: 20px 24px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--bg-subtle);
  }

  .ai-note .section-kicker,
  .ai-note > p:last-child {
    margin: 0;
  }

  .ai-note > p:last-child {
    color: var(--text-mid);
    font-size: 13px;
  }

  @media (max-width: 760px) {
    .home {
      min-height: 670px;
    }

    .latest-article {
      margin-top: -28px;
      padding-inline: 20px;
    }

    .latest-article__card {
      padding: 22px;
    }

    .latest-article__content,
    .story__inner,
    .product-card {
      grid-template-columns: 1fr;
    }

    .latest-article__content {
      gap: 18px;
    }

    .story {
      padding-block: 72px;
    }

    .product,
    .principles {
      padding-block: 72px;
      padding-inline: 20px;
    }

    .product-card__links {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 20px;
    }

    .principles__grid {
      grid-template-columns: 1fr;
    }

    .principles article + article {
      border-top: 1px solid var(--border);
      border-left: 0;
    }
  }

  @media (max-width: 420px) {
    .home h1 {
      font-size: clamp(40px, 13vw, 54px);
    }

    .product-card__mark {
      width: 70px;
      height: 70px;
    }

    .ai-note {
      grid-template-columns: 1fr;
      gap: 8px;
      width: calc(100% - 40px);
    }
  }
</style>
