<script lang="ts">
  import Sidebar from "$lib/components/navigation/Sidebar.svelte";
  import { siteData } from "$lib/ts/siteData/siteData";
  import favicon from "$lib/assets/favicon.svg";
  import "$lib/styles/global.css";

  let { data, children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>{siteData.title}</title>
</svelte:head>

<main>
  {@render children?.()}
</main>
<Sidebar routes={siteData.routes}></Sidebar>

<style>
  main {
    margin-left: 6rem;
    width: calc(100% - 12rem);
    display: flex;
    align-items: center;
    flex-direction: column;
  }
</style>
