<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import Sidebar from "$lib/components/molecules/navigation/sidebar.svelte";
  import DummyThickData from "$lib/ts/dummyThickData/dummyThickData";
  import "$lib/styles/global.css";
  import NotificationCenter from "$lib/components/molecules/notifications/NotificationCenter.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<NotificationCenter></NotificationCenter>

<Sidebar props={DummyThickData.routes}></Sidebar>
<main>
  {@render children?.()}
</main>

<style>
  main {
    margin-left: 5.5rem;
  }
</style>
