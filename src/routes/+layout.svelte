<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import DummyThickData from "$lib/ts/dummyThickData/dummyThickData";
  import "$lib/styles/global.css";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>{DummyThickData.title}</title>
</svelte:head>

<main>
  {@render children?.()}
</main>

<style>
  main {
    margin-left: 5.5rem;
    width: calc(100% - 11rem);
  }
</style>
