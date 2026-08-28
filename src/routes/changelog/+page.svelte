<svelte:head>
  <title>Changelog — link42</title>
  <meta name="description" content="Changes to the public link42 website, most recent first." />
  <meta property="og:title" content="Changelog — link42" />
  <meta property="og:description" content="Changes to the public link42 website, most recent first." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://link42.app/changelog" />
  <meta property="og:site_name" content="Link42" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Changelog — link42" />
  <meta name="twitter:description" content="Changes to the public link42 website, most recent first." />
  <link rel="canonical" href="https://link42.app/changelog" />
</svelte:head>

<article class="company-page">
  <header class="company-hero">
    <p class="company-eyebrow">Release notes</p>
    <h1>Changelog</h1>
    <p class="company-lead">
      Changes to the Link42 company website, most recent first. Product-specific updates stay with each
      product.
    </p>
  </header>

  <div class="release" aria-labelledby="unreleased-title">
    <div class="release__meta">
      <span class="release__status">Unreleased</span>
      <span>Independent website</span>
    </div>
    <div class="release__body">
      <h2 id="unreleased-title">A clean home for the public company site.</h2>
      <ul class="release__list">
        <li>Created an independent repository for the Link42 company website.</li>
        <li>Brought the Learn library, Blog, and RSS into one self-contained site.</li>
        <li>Rebuilt the public shell without accounts, user data, or product-service integrations.</li>
        <li>Documented separate terms for software, original editorial content, branding, and third-party material.</li>
        <li>Added verification across light and dark themes, desktop, and mobile.</li>
      </ul>
      <div class="company-links">
        <a class="text-action" href="https://github.com/link42-au/link42">Website repository <span aria-hidden="true">↗</span></a>
        <a class="text-action" href="https://rule1.link42.app/changelog">Rule1 changelog <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </div>

  <aside class="company-note">
    <p class="company-label">Why only one entry?</p>
    <p>
      This changelog starts with the independent website. Historical implementation notes for other
      products do not describe this repository and are better kept with the products they belong to.
    </p>
  </aside>
</article>

<style>
  .release {
    display: grid;
    grid-template-columns: 180px minmax(0, 1fr);
    gap: 40px;
    padding: 42px 0 50px;
    border-block: 1px solid var(--border);
  }

  .release__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    color: var(--text-dim);
    font-family: var(--font-mono);
    font-size: 11px;
  }

  .release__status {
    padding: 4px 9px;
    color: var(--text);
    background: color-mix(in srgb, var(--status) 10%, var(--bg));
    border: 1px solid color-mix(in srgb, var(--status) 35%, var(--border));
    border-radius: 999px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .release__body h2 {
    margin: 0 0 20px;
    font-size: clamp(22px, 4vw, 32px);
    letter-spacing: -0.035em;
    line-height: 1.15;
  }

  .release__list {
    display: grid;
    gap: 12px;
    margin: 0;
    padding: 0;
    color: var(--text-mid);
    list-style: none;
  }

  .release__list li {
    position: relative;
    padding-left: 20px;
    line-height: 1.7;
  }

  .release__list li::before {
    position: absolute;
    top: 0.72em;
    left: 0;
    width: 6px;
    height: 6px;
    background: var(--accent);
    border-radius: 50%;
    content: "";
  }

  @media (max-width: 640px) {
    .release {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .release__meta {
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
    }
  }
</style>
