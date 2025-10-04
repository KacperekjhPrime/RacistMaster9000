<script lang="ts">
  import NavigationSidebarLinkCard from "../cards/NavigationSidebarLinkCard.svelte";
  import type { Route } from "$lib/ts/models/route";

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
    width: 20rem;
    height: 100vh;
    position: relative;
    top: 0;
    left: 0;
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
  }
  nav:hover {
    translate: 0%;
  }
</style>
