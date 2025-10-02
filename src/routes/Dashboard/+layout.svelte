<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import Sidebar from "$lib/components/navigation/sidebar.svelte";
  import DummyThickData from "$lib/dummyThickData";
  import "$lib/styles/global.css";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Sidebar props={DummyThickData.routes}></Sidebar>
<main>
  {@render children?.()}
</main>

<style>
  main {
    margin-left: 5.5rem;
  }
</style>
