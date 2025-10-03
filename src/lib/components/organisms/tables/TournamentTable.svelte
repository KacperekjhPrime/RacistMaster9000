<script lang="ts">
  import type { Tournament } from "$lib/ts/models/models";

  let { tournaments }: { tournaments: Array<Tournament> } = $props();
</script>

<div class="table"></div>

<style>
  .table {
    width: 100%;
    height: fit-content;
  }
  .row {
    width: calc(100% - 1rem);
    height: 4rem;
    padding: 0.5rem;
  }
</style>
