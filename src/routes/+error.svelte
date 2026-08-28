<script lang="ts">
import { page } from "$app/state";
</script>

<svelte:head>
  <title>{page.status} — Link42</title>
</svelte:head>

<section class="error-page" aria-labelledby="error-title">
  <p class="eyebrow">Error {page.status}</p>
  <h1 id="error-title">{page.status === 404 ? "Page not found" : "Something went wrong"}</h1>
  <p>{page.status === 404 ? "That page is not part of this public website." : (page.error?.message ?? "Please try again.")}</p>
  <a class="primary-action" href="/">Return home</a>
</section>
