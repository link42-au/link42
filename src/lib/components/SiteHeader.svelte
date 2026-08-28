<script lang="ts">
import { afterNavigate } from "$app/navigation";
import { page } from "$app/state";
import { onMount } from "svelte";
import { applyTheme, oppositeTheme, readTheme, type Theme } from "$lib/theme";

const navigation = [
  { label: "Learn", href: "/learn" },
  { label: "Blog", href: "/blog" },
  { label: "Changelog", href: "/changelog" },
  { label: "About", href: "/about" },
  { label: "Licence", href: "/licence" },
];

let menuOpen = $state(false);
let theme = $state<Theme>("light");

onMount(() => {
  theme = readTheme();
});

afterNavigate(() => {
  menuOpen = false;
});

const toggleTheme = () => {
  theme = applyTheme(oppositeTheme(theme));
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    menuOpen = false;
  }
};
</script>

<svelte:window onkeydown={handleKeydown} />

<header class="site-header">
  <div class="site-header__inner">
    <a class="brand" href="/" aria-label="Link42 home">
      <span class="brand__mark" aria-hidden="true">
        <img class="brand__mark-light" src="/logo-light.svg" alt="" width="34" height="34" />
        <img class="brand__mark-dark" src="/logo-dark.svg" alt="" width="34" height="34" />
      </span>
      <span>link42</span>
    </a>

    <button
      class="menu-toggle"
      type="button"
      aria-label={menuOpen ? "Close navigation" : "Open navigation"}
      aria-controls="site-navigation"
      aria-expanded={menuOpen}
      onclick={() => {
        menuOpen = !menuOpen;
      }}
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>

    <nav id="site-navigation" class:open={menuOpen} aria-label="Primary navigation">
      {#each navigation as item}
        <a href={item.href} aria-current={page.url.pathname.startsWith(item.href) ? "page" : undefined}>
          {item.label}
        </a>
      {/each}
      <a class="rule1-link" href="https://rule1.link42.app">Rule1 <span aria-hidden="true">↗</span></a>
    </nav>

    <button
      class="theme-toggle"
      type="button"
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      onclick={toggleTheme}
    >
      {#if theme === "light"}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      {/if}
    </button>
  </div>
</header>
