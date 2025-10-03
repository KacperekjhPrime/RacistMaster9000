<script lang="ts">
  let { children } = $props();
</script>

<div>
  {@render children()}
</div>

<style>
  div {
    width: 100%;
    height: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
