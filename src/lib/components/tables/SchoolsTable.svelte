<script lang="ts">
  import type { School } from "$lib/ts/models/databaseModels";

  let { schools }: { schools: Array<School> } = $props();
</script>

<div class="table">
  <div class="row">
    <div class="cell">Nazwa szkoły</div>
    <div class="cell">Miasto</div>
    <div class="cell">Akronim</div>
  </div>
  {#each schools as school}
    <div class="row">
      <span class="cell">{school.Name}</span>
      <span class="cell">{school.City}</span>
      <span class="cell">{school.Acronym}</span>
    </div>
  {/each}
  <div class="row">
    <div class="cell"></div>
    <button class="cell">Dodaj szkołę</button>
    <div class="cell"></div>
  </div>
</div>

<style>
  .table {
    width: 90%;
    height: fit-content;
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }
  .row:first-child {
    background-color: color-mix(in srgb, var(--text) 75%, lightblue 25%);
  }
  .row:first-child .cell,
  .row:last-child .cell {
    color: var(--background);
    font-size: 1.2rem;
    font-weight: bold;
  }
  .row:first-child .cell {
    border-color: var(--background);
  }
  .row {
    width: 100%;
    height: 4rem;
    display: grid;
    grid-template-columns: 33% 33% 33%;
    align-items: center;
    justify-content: center;
    border-bottom: 0.125rem solid black;
  }
  .cell:first-child {
    border-left: none;
  }
  .cell {
    border-left: 0.125rem solid black;
    display: flex;
    width: 100%;
    height: 90%;
    align-items: center;
    justify-content: center;
  }
  .row:last-child .cell {
    border: transparent;
  }
  .row:last-child button {
    width: 100%;
    height: 100%;
    background-color: color-mix(in srgb, var(--text) 75%, lightblue 25%);
    border: 0.125rem solid black;
  }
  .row:last-child {
    border: none;
  }
</style>
