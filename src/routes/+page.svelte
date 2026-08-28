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
  <title>Link42 — practical security, made clear</title>
  <meta
    name="description"
    content="Link42 builds practical, open security resources for people who need clear answers."
  />
  <link
    rel="alternate"
    type="application/rss+xml"
    title="Link42 blog"
    href="https://link42.app/blog/rss.xml"
  />
</svelte:head>

<div class="home-page">
<section class="home" aria-labelledby="home-title">
  <div class="home__mark" aria-hidden="true">
    <img src="/logo-light.svg" alt="" width="120" height="120" />
  </div>
  <p class="eyebrow">Canberra, Australia</p>
  <h1 id="home-title">Practical security,<br /><span>made clear.</span></h1>
  <p class="home__intro">
    Link42 is building open tools and learning resources that make security controls easier to understand and use.
  </p>
  <div class="home__actions">
    <a class="primary-action" href="https://rule1.link42.app">Explore Rule1 <span aria-hidden="true">→</span></a>
    <a class="text-action" href="https://github.com/link42-au/link42">View the source <span aria-hidden="true">↗</span></a>
  </div>
  <p class="build-note"><span aria-hidden="true"></span>The public website is being prepared in the open.</p>
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
</div>

<style>
  .home-page {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
  }

  .latest-article {
    width: min(100%, var(--content));
    margin: -48px auto 88px;
    padding: 0 24px;
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

  .latest-article__card:focus-visible {
    outline: 2px solid var(--text);
    outline-offset: 4px;
  }

  .latest-article__label,
  .latest-article__meta,
  .latest-article__action {
    font-family: var(--font-mono);
  }

  .latest-article__label {
    margin: 0 0 14px;
    color: var(--text-dim);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.07em;
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

  .latest-article__card:hover .latest-article__action,
  .latest-article__card:focus-visible .latest-article__action {
    color: var(--text);
  }

  @media (max-width: 640px) {
    .latest-article {
      margin-top: -28px;
      padding: 0 20px;
    }

    .latest-article__card {
      padding: 22px;
    }

    .latest-article__content {
      grid-template-columns: 1fr;
      gap: 18px;
    }
  }
</style>
