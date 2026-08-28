<script lang="ts">
import "$lib/styles/app.css";
import SiteFooter from "$lib/components/SiteFooter.svelte";
import SiteHeader from "$lib/components/SiteHeader.svelte";

let { children } = $props();
</script>

<a class="skip-link" href="#main-content">Skip to content</a>
<div class="site-frame">
  <SiteHeader />
  <main id="main-content" tabindex="-1">
    {@render children()}
  </main>
  <SiteFooter />
</div>
