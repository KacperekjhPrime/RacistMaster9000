<!-- 
  @component
  ### Button made mostly for consistent style
  @param onclick - self explanatory
  @param children - self explanatory
  @param css - css class
-->

<script lang="ts">
  let {
    onclick,
    children,
    css,
  }: { onclick: () => void; children: () => any; css: string } = $props();
</script>

<button {onclick} class={css}>
  {@render children()}
</button>
