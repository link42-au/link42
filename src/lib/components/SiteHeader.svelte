<script lang="ts">
import { afterNavigate } from "$app/navigation";
import { onMount } from "svelte";
import { applyTheme, oppositeTheme, readTheme, type Theme } from "$lib/theme";

const morePages = [
  { label: "Learn", href: "/learn" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Changelog", href: "/changelog" },
  { label: "Licence", href: "/licence" },
];

let moreOpen = $state(false);
let theme = $state<Theme>("light");

onMount(() => {
  theme = readTheme();
});

afterNavigate(() => {
  moreOpen = false;
});

const toggleTheme = () => {
  theme = applyTheme(oppositeTheme(theme));
};

const closeMoreOnOutsideClick = (event: MouseEvent) => {
  if (!(event.target as HTMLElement).closest(".pb-more-wrap")) {
    moreOpen = false;
  }
};

const closeMoreOnEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    moreOpen = false;
  }
};
</script>

<svelte:window onclick={closeMoreOnOutsideClick} onkeydown={closeMoreOnEscape} />

<div class="platform-bar">
  <nav class="pb-nav" aria-label="Platform navigation">
    <a class="pb-app pb-app--active" href="/" aria-current="page" aria-label="Link42 home">
      <svg class="pb-icon" viewBox="0 0 120 120" width="28" height="28" aria-hidden="true">
        <path d="M 60 20 L 25 28 L 25 65 C 25 85 45 95 60 102 Z" fill="currentColor" opacity="0.2" />
        <path d="M 60 20 L 95 28 L 95 65 C 95 85 75 95 60 102 Z" fill="currentColor" opacity="0.4" />
        <circle cx="60" cy="60" r="20" fill="none" stroke="currentColor" stroke-width="5" />
        <line x1="74" y1="74" x2="86" y2="86" stroke="currentColor" stroke-width="8" stroke-linecap="round" />
        <polyline points="38,72 54,56 66,64 82,42" fill="none" stroke="#64748b" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" />
        <circle cx="38" cy="72" r="5" fill="#64748b" />
        <circle cx="82" cy="42" r="5" fill="#64748b" />
      </svg>
      <span class="pb-label">link42</span>
    </a>
    <a class="pb-app" href="https://rule1.link42.app" aria-label="Open rule1">
      <svg class="pb-icon" viewBox="0 0 120 120" width="28" height="28" aria-hidden="true">
        <polyline points="38,72 54,56 66,64 82,42" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" />
        <circle cx="38" cy="72" r="6" fill="#2563eb" />
        <circle cx="54" cy="56" r="6" fill="currentColor" />
        <circle cx="66" cy="64" r="6" fill="#2563eb" />
        <circle cx="82" cy="42" r="6" fill="currentColor" />
      </svg>
      <span class="pb-label">rule1</span>
    </a>
    <div class="pb-more-wrap">
      <button class="pb-more-trigger" type="button" aria-expanded={moreOpen} aria-controls="platform-more" onclick={() => { moreOpen = !moreOpen; }}>
        more
        <svg class="pb-more-caret" width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden="true">
          <path d="M1 1L4 4L7 1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      {#if moreOpen}
        <div id="platform-more" class="pb-more-dropdown">
          {#each morePages as item}
            <a href={item.href} class="pb-dropdown-item">{item.label}</a>
          {/each}
        </div>
      {/if}
    </div>
  </nav>

  <button class="pb-theme-toggle" type="button" aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"} onclick={toggleTheme}>
    {#if theme === "light"}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
    {:else}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
    {/if}
  </button>
</div>

<style>
  .platform-bar { position: relative; z-index: 200; display: flex; flex-shrink: 0; align-items: center; justify-content: space-between; height: 56px; padding: 0 20px; font-size: 12px; background: var(--bg-subtle); border-bottom: 1px solid var(--border); }
  .pb-nav { display: flex; align-items: center; gap: 16px; }
  .pb-app { display: inline-flex; flex-direction: column; align-items: center; gap: 2px; padding: 4px 8px; color: var(--text-dim); font-family: var(--font-mono); font-size: 10px; font-weight: 500; line-height: 1; text-decoration: none; border: 1px solid transparent; border-radius: 8px; transition: color 0.15s; }
  .pb-app:hover { color: var(--text-mid); }
  .pb-app--active { color: var(--text); font-weight: 600; background: var(--bg-card); border-color: var(--border); }
  .pb-icon { display: block; flex-shrink: 0; }
  .pb-label { white-space: nowrap; }
  .pb-more-wrap { position: relative; display: flex; align-items: center; margin-left: 4px; }
  .pb-more-trigger { display: inline-flex; align-items: center; gap: 3px; padding: 4px 8px; color: var(--text-dim); font-family: var(--font-mono); font-size: 10px; font-weight: 500; line-height: 1; background: none; border: none; border-radius: 6px; cursor: pointer; transition: color 0.15s, background 0.15s; }
  .pb-more-trigger:hover { color: var(--text-mid); background: var(--bg-hover); }
  .pb-more-caret { flex-shrink: 0; opacity: 0.5; }
  .pb-more-dropdown { position: absolute; top: 100%; left: 0; z-index: 50; min-width: 120px; padding: 4px; margin-top: 4px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; box-shadow: var(--shadow); }
  .pb-dropdown-item { display: block; padding: 7px 12px; color: var(--text); font-size: 12px; text-decoration: none; border-radius: 5px; transition: background 0.12s; }
  .pb-dropdown-item:hover { background: var(--bg-hover); }
  .pb-theme-toggle { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; padding: 0; color: var(--text-mid); background: none; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: background 0.15s, color 0.15s; }
  .pb-theme-toggle:hover { color: var(--text); background: var(--bg-hover); }
  @media (max-width: 640px) { .platform-bar { padding: 0 16px; } .pb-more-dropdown { right: 0; left: auto; } }
</style>
