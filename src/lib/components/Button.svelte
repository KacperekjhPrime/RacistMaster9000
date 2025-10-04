<!-- 
  @component
  ### Button made mostly for consistent style
  @param onclick - self explanatory
  @param children - self explanatory
-->

<script lang="ts">
  let types = {
    primary: {},
    secondary: {},
    small: {},
  };

  let {
    onclick,
    children,
    type,
  }: {
    onclick: () => void;
    children: () => any;
    type: keyof typeof types;
  } = $props();
</script>

<button {onclick}>
  {@render children()}
</button>

<style>
  button {
    border: none;
    outline: transparent;
    background-color: transparent;
    cursor: pointer;
    padding: 0.5rem;
  }
</style>
