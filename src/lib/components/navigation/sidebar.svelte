<script lang="ts">
  import SidebarLink from "./sidebarLink.svelte";

  let { props }: { props: Array<{ name: string; href: string }> } = $props();
</script>

<div class="sidebar">
  {#each props as prop}
    <SidebarLink href={prop.href}>{prop.name}</SidebarLink>
  {/each}
</div>

<style>
  .sidebar {
    height: 100vh;
    width: 20rem;
    border-right: 0.125rem solid var(--accent);
    position: fixed;
    top: 0;
    left: 0;
    translate: -75%;
    transition-duration: 400ms;
    background-color: var(--text);
    color: var(--accent);
    padding: 1rem;
    overflow: hidden;
  }
  .sidebar:hover {
    translate: 0rem;
  }
</style>
