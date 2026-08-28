<script lang="ts">
import { onMount, setContext } from "svelte";
import { page } from "$app/state";

// biome-ignore lint/correctness/noUnusedVariables: used by Svelte slot rendering
let { children } = $props();
let flavour = $state("factual");
// biome-ignore lint/correctness/noUnusedVariables: used in Svelte template
let sidebarOpen = $state(false);

// Tone toggle persistence (localStorage key: 'ai-flavour')
onMount(() => {
  if (localStorage.getItem("ai-flavour") === "snarky") flavour = "snarky";
});

// biome-ignore lint/correctness/noUnusedVariables: used in Svelte template
function setFlavour(f: string) {
  flavour = f;
  if (f === "snarky") localStorage.setItem("ai-flavour", "snarky");
  else localStorage.removeItem("ai-flavour");
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") sidebarOpen = false;
}

setContext("flavour", () => flavour);

// biome-ignore lint/correctness/noUnusedVariables: used in Svelte template
const nav = [
  { title: "Overview", href: "/learn" },
  {
    title: "Frameworks",
    href: "/learn/frameworks",
    children: [
      {
        title: "Australian ISM",
        href: "/learn/frameworks/ism",
        children: [
          { title: "Essential Eight", href: "/learn/frameworks/ism/e8" },
          { title: "IRAP Assessments", href: "/learn/frameworks/ism/irap" },
        ],
      },
      { title: "NZ ISM", href: "/learn/frameworks/nzism" },
      { title: "PICERL", href: "/learn/frameworks/picerl" },
    ],
  },
  {
    title: "Threat Intelligence",
    href: "/learn/threat",
    children: [
      { title: "MITRE ATT&CK", href: "/learn/threat/mitre-attack" },
      { title: "STIX & TAXII", href: "/learn/threat/stix-taxii" },
    ],
  },
  {
    title: "Vulnerabilities",
    href: "/learn/vulnerability",
    children: [
      { title: "CVSS Scoring", href: "/learn/vulnerability/cvss" },
      { title: "EPSS & KEV", href: "/learn/vulnerability/epss" },
    ],
  },
  {
    title: "Risk Assessment",
    href: "/learn/risk",
    children: [{ title: "Methodology", href: "/learn/risk/methodology" }],
  },
];

// biome-ignore lint/correctness/noUnusedVariables: used in Svelte template
function isActive(href: string) {
  return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
}

// biome-ignore lint/correctness/noUnusedVariables: used in Svelte template
let breadcrumbs = $derived.by(() => {
  const path = page.url.pathname;
  if (path === "/learn") return [{ title: "Learn", href: "/learn" }];

  const segments = path.split("/").filter(Boolean);
  const crumbs = [];
  let currentPath = "";

  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;
    // Try to find a matching title in the nav tree
    let title = segments[i].charAt(0).toUpperCase() + segments[i].slice(1);

    // Simple lookup for known paths
    if (segments[i] === "learn") title = "Learn";
    else if (segments[i] === "ism") title = "ISM";
    else if (segments[i] === "e8") title = "Essential Eight";
    else if (segments[i] === "irap") title = "IRAP";
    else if (segments[i] === "nzism") title = "NZ ISM";
    else if (segments[i] === "mitre-attack") title = "MITRE ATT&CK";
    else if (segments[i] === "stix-taxii") title = "STIX & TAXII";
    else if (segments[i] === "cvss") title = "CVSS";
    else if (segments[i] === "epss") title = "EPSS & KEV";
    else if (segments[i] === "picerl") title = "PICERL";

    crumbs.push({ title, href: currentPath });
  }
  return crumbs;
});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="learn-layout">
	<!-- Mobile toggle -->
	<button
		class="learn-mobile-toggle"
		type="button"
		onclick={() => (sidebarOpen = !sidebarOpen)}
		aria-expanded={sidebarOpen}
		aria-controls="learn-sidebar-nav"
		aria-label={sidebarOpen ? "Close Learn navigation" : "Open Learn navigation"}
	>
		{sidebarOpen ? 'Close Menu' : 'Menu'}
	</button>

	<!-- Sidebar -->
	<aside id="learn-sidebar-nav" class="learn-sidebar" class:open={sidebarOpen}>
		<nav class="learn-nav" aria-label="Learn topics">
			{#snippet navItem(item: any, level = 0)}
				{@const active = isActive(item.href)}
				{@const exact = page.url.pathname === item.href}
				<div class="learn-nav-item-wrapper">
					<a
						href={item.href}
						class="learn-nav-item"
						class:active={exact}
						style="padding-left: {16 + level * 12}px"
						onclick={() => (sidebarOpen = false)}
					>
						{item.title}
					</a>
					{#if item.children && (active || level === 0)}
						<div class="learn-nav-children">
							{#each item.children as child}
								{@render navItem(child, level + 1)}
							{/each}
						</div>
					{/if}
				</div>
			{/snippet}

			{#each nav as item}
				{@render navItem(item)}
			{/each}
		</nav>

		<div class="learn-tone">
			<span class="learn-tone-label">Voice</span>
			<span class="learn-tone-toggle" role="group" aria-label="Content voice">
				<button
					class="learn-tone-btn"
					type="button"
					class:active={flavour === 'factual'}
					aria-pressed={flavour === 'factual'}
					onclick={() => setFlavour('factual')}
				>
					Factual
				</button>
				<button
					class="learn-tone-btn"
					type="button"
					class:active={flavour === 'snarky'}
					aria-pressed={flavour === 'snarky'}
					onclick={() => setFlavour('snarky')}
				>
					Professional
				</button>
			</span>
		</div>
	</aside>

	<!-- Content Area -->
	<div class="learn-content">
		<div class="learn-header">
			<nav aria-label="Breadcrumb" class="learn-breadcrumbs">
				{#each breadcrumbs as crumb, i}
					{#if i > 0}
						<span class="learn-breadcrumb-sep">/</span>
					{/if}
					{#if i === breadcrumbs.length - 1}
						<span class="learn-breadcrumb-current" aria-current="page">{crumb.title}</span>
					{:else}
						<a href={crumb.href} class="learn-breadcrumb-link">{crumb.title}</a>
					{/if}
				{/each}
			</nav>
			
			<!-- Mobile tone toggle -->
			<div class="learn-tone learn-tone--mobile">
				<span class="learn-tone-toggle" role="group" aria-label="Content voice">
					<button
						class="learn-tone-btn"
						type="button"
						class:active={flavour === 'factual'}
						aria-pressed={flavour === 'factual'}
						onclick={() => setFlavour('factual')}
					>
						Factual
					</button>
					<button
						class="learn-tone-btn"
						type="button"
						class:active={flavour === 'snarky'}
						aria-pressed={flavour === 'snarky'}
						onclick={() => setFlavour('snarky')}
					>
						Professional
					</button>
				</span>
			</div>
		</div>

		{@render children()}
	</div>
</div>
