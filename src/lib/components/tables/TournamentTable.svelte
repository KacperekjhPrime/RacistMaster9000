<script lang="ts">
  import type { TournamentBasic } from "$lib/ts/models/databaseModels";

  import Cell from "$lib/components/tables/Cell.svelte";

  // let { tournaments }: { tournaments: Array<Tournament> } = $props();
</script>

<div class="table">
  <div class="row headerRow">
    <Cell>Nazwa</Cell>
    <Cell>Data rozpoczęcia</Cell>
    <Cell>Data zakończenia</Cell>
    <Cell>Status</Cell>
  </div>
</div>

<style>
  .table {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }
  .row {
    width: calc(100% - 1rem);
    height: 4rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    align-items: center;
    border: solid var(--borderThickness) var(--text);
    border-top: none;
  }
  .row:last-child {
    border-bottom-left-radius: var(--borderRadius);
    border-bottom-right-radius: var(--borderRadius);
  }
  .headerRow {
    background: var(--text);
    color: var(--background);
    border-top-left-radius: var(--borderRadius);
    border-top-right-radius: var(--borderRadius);
    font-weight: 700;
    font-size: 1.3rem;
    letter-spacing: var(--letterSpacing);
  }
</style>
