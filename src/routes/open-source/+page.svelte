<svelte:head>
  <title>Open source — link42</title>
  <meta
    name="description"
    content="Where Link42 code is hosted, how the public sites are built, and where to report bugs, suggest improvements, or disclose security vulnerabilities."
  />
  <meta property="og:title" content="Open source — link42" />
  <meta
    property="og:description"
    content="Where Link42 code is hosted, how the public sites are built, and where to report bugs, suggest improvements, or disclose security vulnerabilities."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://link42.app/open-source" />
  <meta property="og:site_name" content="Link42" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Open source — link42" />
  <meta
    name="twitter:description"
    content="Where Link42 code is hosted, how the public sites are built, and where to report bugs, suggest improvements, or disclose security vulnerabilities."
  />
  <link rel="canonical" href="https://link42.app/open-source" />
</svelte:head>

<article class="company-page">
  <header class="company-hero">
    <p class="company-eyebrow">Source and feedback</p>
    <h1>Open source</h1>
    <p class="company-lead">
      Link42's public code, issue tracking, and build history are open on GitHub. Here is where each
      project lives, what runs it, and the right place to raise something.
    </p>
  </header>

  <section class="company-section" aria-labelledby="hosting-title">
    <p class="company-label">Hosting</p>
    <div class="company-section__body">
      <h2 id="hosting-title">Public code with visible release evidence.</h2>
      <p>
        The repositories are hosted by the
        <a href="https://github.com/link42-au">link42-au organisation on GitHub</a>. Their source,
        issues, pull requests, and GitHub Actions build history are visible together.
      </p>
      <p>
        Both public sites are static builds deployed by GitHub Actions to GitHub Pages. The website is
        served at <a href="https://link42.app">link42.app</a>, and Rule1 is served at
        <a href="https://rule1.link42.app">rule1.link42.app</a>.
      </p>
    </div>
  </section>

  <section class="company-section" aria-labelledby="repositories-title">
    <p class="company-label">Repositories</p>
    <div class="company-section__body">
      <h2 id="repositories-title">Two public projects, two clear boundaries.</h2>
      <div class="repository-grid">
        <article class="repository-card">
          <div class="repository-card__heading">
            <h3>link42-au/link42</h3>
            <span class="repository-tag">Website</span>
          </div>
          <p>
            The source for this website: company pages, learning content, blog, design tokens, and
            release checks.
          </p>
          <ul class="technology-list">
            <li>TypeScript and SvelteKit with the static adapter</li>
            <li>pnpm for dependency and build management</li>
            <li>Playwright and Axe for browser and accessibility checks</li>
            <li>Locally vendored Geist fonts</li>
          </ul>
          <div class="company-links">
            <a class="primary-action" href="https://github.com/link42-au/link42">Browse source <span aria-hidden="true">↗</span></a>
            <a class="text-action" href="https://link42.app">Visit site <span aria-hidden="true">↗</span></a>
          </div>
        </article>

        <article class="repository-card">
          <div class="repository-card__heading">
            <h3>link42-au/rule1</h3>
            <span class="repository-tag">Application</span>
          </div>
          <p>
            The source, framework history, ingestion pipeline, and deterministic release process for
            the Rule1 security controls explorer.
          </p>
          <ul class="technology-list">
            <li>TypeScript and SvelteKit for the static interface</li>
            <li>SQLite WASM and OPFS for browser-local data</li>
            <li>Python for framework ingestion</li>
            <li>Deterministic GitHub Actions database builds</li>
          </ul>
          <div class="company-links">
            <a class="primary-action" href="https://github.com/link42-au/rule1">Browse source <span aria-hidden="true">↗</span></a>
            <a class="text-action" href="https://rule1.link42.app">Open Rule1 <span aria-hidden="true">↗</span></a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="company-section" aria-labelledby="feedback-title">
    <p class="company-label">Feedback</p>
    <div class="company-section__body">
      <h2 id="feedback-title">Put the report beside the affected code.</h2>
      <p>
        Website copy, navigation, display, or link problems belong in the Link42 website repository.
        Rule1 controls, data, imports, search, or application behaviour belong in the Rule1 repository.
      </p>
      <div class="feedback-grid">
        <article class="feedback-card">
          <h3>Link42 website</h3>
          <a href="https://github.com/link42-au/link42/issues/new?template=bug_report.yml">Report a bug</a>
          <a href="https://github.com/link42-au/link42/issues/new?template=feature_request.yml">Suggest an improvement</a>
          <a href="https://github.com/link42-au/link42/issues">Browse existing issues</a>
        </article>
        <article class="feedback-card">
          <h3>Rule1</h3>
          <a href="https://github.com/link42-au/rule1/issues/new?template=bug_report.yml">Report a bug</a>
          <a href="https://github.com/link42-au/rule1/issues/new?template=feature_request.yml">Suggest an improvement</a>
          <a href="https://github.com/link42-au/rule1/issues">Browse existing issues</a>
        </article>
      </div>
    </div>
  </section>

  <aside class="company-note" aria-labelledby="security-title">
    <p class="company-label">Security reports</p>
    <p id="security-title">
      Please do not disclose a vulnerability in a public issue. Send it privately through
      <a href="https://github.com/link42-au/link42/security/advisories/new">Link42's security advisory form</a>
      or <a href="https://github.com/link42-au/rule1/security/advisories/new">Rule1's security advisory form</a>,
      depending on the affected project.
    </p>
  </aside>
</article>

<style>
  .repository-grid,
  .feedback-grid {
    display: grid;
    gap: 16px;
    margin-top: 26px;
  }

  .repository-card,
  .feedback-card {
    padding: 22px;
    background: var(--bg-subtle);
    border: 1px solid var(--border);
    border-radius: 10px;
  }

  .repository-card__heading {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 12px;
  }

  .repository-card h3,
  .feedback-card h3 {
    margin: 0;
    font-size: 16px;
    letter-spacing: -0.015em;
  }

  .repository-tag {
    padding: 3px 8px;
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 650;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    border-radius: 999px;
  }

  .technology-list {
    padding-left: 18px;
    margin: 16px 0 0;
    color: var(--text-mid);
    font-size: 13px;
    line-height: 1.7;
  }

  .feedback-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .feedback-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 9px;
  }

  .feedback-card h3 {
    margin-bottom: 5px;
  }

  .feedback-card a {
    color: var(--accent);
    font-size: 13px;
    overflow-wrap: anywhere;
  }

  @media (max-width: 640px) {
    .feedback-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
