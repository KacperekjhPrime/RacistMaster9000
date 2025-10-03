<script lang="ts">
  import type { SvelteComponent } from "svelte";

  let { href, children }: { href: string; children: () => any } = $props();
</script>

<a {href}>{@render children()}</a>

<style>
  a {
    display: flex;
    width: calc(100%-2rem);
    height: 5rem;
    padding: 0.5rem;
    justify-content: space-around;
    align-items: center;
    border-bottom: solid var(--accent) 0.125rem;
    text-decoration: none;
    color: inherit;
    font-size: 1.5rem;
  }
</style>
