<script lang="ts">
  import type { Route } from "$lib/ts/siteData/siteData";
  import NavigationSidebarLinkCard from "../cards/NavigationSidebarLinkCard.svelte";

  let { routes }: { routes: Array<Route> } = $props();
</script>

<nav>
  {#each routes as route}
    <NavigationSidebarLinkCard
      color="info"
      contents={route.title}
      link={route.link}
      icon={route.icon}
    ></NavigationSidebarLinkCard>
  {/each}
</nav>

<style>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 20rem;
    height: 100vh;
    translate: -15rem;
    display: flex;
    flex-direction: column;
    transition: 0.25s ease-in;
    background-color: var(--secondary);
    z-index: var(--uiLayer);
    box-shadow: var(--secondary) 0px 0px 0.5rem 0.05rem;
    border-top-right-radius: var(--borderRadius);
    border-bottom-right-radius: var(--borderRadius);
    overflow: hidden;
    gap: var(--borderThickness);
  }
  nav:hover {
    translate: 0%;
  }
</style>
