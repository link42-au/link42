<svelte:head>
  <title>Licence — link42</title>
  <meta
    name="description"
    content="Licensing for the link42 website software, original editorial content, brand assets, and third-party material."
  />
  <meta property="og:title" content="Licence — link42" />
  <meta
    property="og:description"
    content="Licensing for the link42 website software, original editorial content, brand assets, and third-party material."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://link42.app/licence" />
  <meta property="og:site_name" content="Link42" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Licence — link42" />
  <meta
    name="twitter:description"
    content="Licensing for the link42 website software, original editorial content, brand assets, and third-party material."
  />
  <link rel="canonical" href="https://link42.app/licence" />
</svelte:head>

<article class="company-page">
  <header class="company-hero">
    <p class="company-eyebrow">Four clear boundaries</p>
    <h1>Licence</h1>
    <p class="company-lead">
      Software, original editorial content, branding, and third-party material are different things. Their
      terms are different too.
    </p>
  </header>

  <section class="company-section" aria-labelledby="software-title">
    <p class="company-label">Website software</p>
    <div class="company-section__body">
      <h2 id="software-title">AGPL-3.0-only</h2>
      <p>
        The source code for this website is Copyright © Iain Dickson and licensed under the GNU Affero
        General Public License version 3 only (<code>AGPL-3.0-only</code>).
      </p>
      <p>
        You may use, study, modify, and redistribute the software under that licence. See the repository's
        <code>LICENSE</code> file and the
        <a href="https://github.com/link42-au/link42">link42-au/link42 repository</a> for the complete terms.
      </p>
      <a class="text-action" href="https://www.gnu.org/licenses/agpl-3.0.html"
        >Read the AGPL 3.0 <span aria-hidden="true">↗</span></a
      >
    </div>
  </section>

  <section class="company-section" aria-labelledby="editorial-title">
    <p class="company-label">Original editorial</p>
    <div class="company-section__body">
      <h2 id="editorial-title">CC BY-NC 4.0</h2>
      <p>
        Unless otherwise stated, original Link42 editorial content published in Learn and Blog is Copyright
        © Iain Dickson and licensed under the Creative Commons Attribution-NonCommercial 4.0 International
        licence (<code>CC BY-NC 4.0</code>).
      </p>
      <p>
        It permits sharing and adaptation with attribution for non-commercial purposes. It does not apply
        to software, brand assets, or third-party material.
      </p>
      <a class="text-action" href="https://creativecommons.org/licenses/by-nc/4.0/"
        >Read CC BY-NC 4.0 <span aria-hidden="true">↗</span></a
      >
    </div>
  </section>

  <section class="company-section" aria-labelledby="brand-title">
    <p class="company-label">Name and brand</p>
    <div class="company-section__body">
      <h2 id="brand-title">Reserved.</h2>
      <p>
        The Link42 name, logos, and other brand identifiers are reserved. Neither the software licence nor
        the editorial-content licence grants permission to use them as trademarks or to imply endorsement.
      </p>
    </div>
  </section>

  <section class="company-section" aria-labelledby="third-party-title">
    <p class="company-label">Third-party material</p>
    <div class="company-section__body">
      <h2 id="third-party-title">Original terms remain.</h2>
      <p>
        Third-party material retains its original copyright and licence. Applicable attribution and terms
        are recorded in <code>THIRD_PARTY_NOTICES.md</code> and alongside the material they apply to.
      </p>
      <p>
        Rule1 is a separate project with its own
        <a href="https://github.com/link42-au/rule1">repository, licence, provenance, and notices</a>.
      </p>
    </div>
  </section>

  <section class="company-section" aria-labelledby="warranty-title">
    <p class="company-label">No warranty</p>
    <div class="company-section__body">
      <h2 id="warranty-title">Check the authoritative source.</h2>
      <p>
        The website and its content are provided without warranty. Security and compliance material is for
        reference; verify it against the relevant authoritative source before relying on it.
      </p>
    </div>
  </section>

  <aside class="licence-summary" aria-labelledby="summary-title">
    <p class="company-label">In short</p>
    <h2 id="summary-title">Know which layer you are using.</h2>
    <dl>
      <div><dt>Website software</dt><dd>AGPL-3.0-only</dd></div>
      <div><dt>Original editorial</dt><dd>CC BY-NC 4.0</dd></div>
      <div><dt>Link42 branding</dt><dd>Reserved</dd></div>
      <div><dt>Third-party material</dt><dd>Its original terms</dd></div>
    </dl>
  </aside>
</article>

<style>
  code {
    padding: 0.12em 0.38em;
    font-family: var(--font-mono);
    font-size: 0.9em;
    background: var(--bg-subtle);
    border: 1px solid var(--border);
    border-radius: 4px;
  }

  .licence-summary {
    margin-top: 50px;
    padding: clamp(24px, 5vw, 42px);
    background: var(--text);
    border-radius: 14px;
  }

  .licence-summary .company-label,
  .licence-summary h2,
  .licence-summary dt,
  .licence-summary dd {
    color: var(--text-inv);
  }

  .licence-summary .company-label {
    opacity: 0.65;
  }

  .licence-summary h2 {
    margin: 12px 0 26px;
    font-size: clamp(23px, 4vw, 34px);
    letter-spacing: -0.035em;
  }

  .licence-summary dl {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin: 0;
    border-block: 1px solid color-mix(in srgb, var(--text-inv) 24%, transparent);
  }

  .licence-summary dl div {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    padding: 15px 0;
  }

  .licence-summary dl div:nth-child(odd) {
    padding-right: 24px;
    border-right: 1px solid color-mix(in srgb, var(--text-inv) 24%, transparent);
  }

  .licence-summary dl div:nth-child(even) {
    padding-left: 24px;
  }

  .licence-summary dl div:nth-child(n + 3) {
    border-top: 1px solid color-mix(in srgb, var(--text-inv) 24%, transparent);
  }

  .licence-summary dt,
  .licence-summary dd {
    margin: 0;
    font-size: 12px;
  }

  .licence-summary dt {
    opacity: 0.65;
  }

  .licence-summary dd {
    font-family: var(--font-mono);
    font-weight: 650;
    text-align: right;
  }

  @media (max-width: 640px) {
    .licence-summary dl {
      grid-template-columns: 1fr;
    }

    .licence-summary dl div:nth-child(n) {
      padding-inline: 0;
      border-right: 0;
    }

    .licence-summary dl div + div {
      border-top: 1px solid color-mix(in srgb, var(--text-inv) 24%, transparent);
    }
  }
</style>
