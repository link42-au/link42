<script lang="ts">
import { page } from "$app/state";
import "$lib/styles/app.css";
import SiteFooter from "$lib/components/SiteFooter.svelte";
import SiteHeader from "$lib/components/SiteHeader.svelte";

let { children } = $props();
</script>

<a class="skip-link" href="#main-content">Skip to content</a>
<div class="page">
  <SiteHeader />
  {#if page.url.pathname !== "/"}
    <nav class="site-nav" aria-label="Site navigation">
      <div class="site-nav-inner">
        <a href="/learn" class:active={page.url.pathname.startsWith("/learn")}>Learn</a>
        <a href="/blog" class:active={page.url.pathname.startsWith("/blog")}>Blog</a>
        <a href="/changelog" class:active={page.url.pathname.startsWith("/changelog")}>Changelog</a>
        <a href="/about" class:active={page.url.pathname.startsWith("/about")}>About</a>
      </div>
    </nav>
  {/if}
  <main id="main-content" tabindex="-1">
    {@render children()}
  </main>
  <SiteFooter />
</div>

<style>
  .page { display: flex; flex-direction: column; min-height: 100vh; }
  .site-nav { background: var(--bg); border-bottom: 1px solid var(--border); }
  .site-nav-inner { display: flex; gap: 24px; max-width: 1200px; padding: 0 24px; margin: 0 auto; }
  .site-nav a { padding: 10px 0; color: var(--text-mid); font-size: 13px; text-decoration: none; border-bottom: 2px solid transparent; }
  .site-nav a:hover { color: var(--text); }
  .site-nav a.active { color: var(--text); font-weight: 600; border-bottom-color: var(--text); }
  @media (max-width: 640px) { .site-nav-inner { gap: 16px; padding: 0 16px; overflow-x: auto; } .site-nav a { flex: 0 0 auto; } }
</style>
