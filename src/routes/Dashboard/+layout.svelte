<script lang="ts">
  import Sidebar from "$lib/components/navigation/Sidebar.svelte";
  import DummyThickData from "$lib/ts/dummyThickData/dummyThickData";
  import type { LayoutProps } from "./$types";

  let { data, children }: LayoutProps = $props();
</script>

<main>
  {@render children?.()}
</main>
<Sidebar routes={DummyThickData.routes}></Sidebar>

<style>
  main {
    margin-left: 6rem;
    width: calc(100% - 12rem);
    display: flex;
    align-items: center;
    flex-direction: column;
  }
</style>
