<script lang="ts">
  import type { School } from "$lib/ts/models/databaseModels";
  import { flip } from "svelte/animate";
  import Button from "../buttons/Button.svelte";
  import "./tables.css";

  let {
    schools = $bindable([]),
    addSchool,
  }: { schools: Array<School>; addSchool: () => void } = $props();
</script>

<div class="table">
  <div class="row">
    <div class="cell">Nazwa szkoły</div>
    <div class="cell">Miasto</div>
    <div class="cell">Akronim</div>
  </div>
  {#each schools as school, index (school)}
    <div class="row" animate:flip>
      <span class="cell">{school.Name}</span>
      <span class="cell">{school.City}</span>
      <span class="cell">{school.Acronym}</span>
    </div>
  {/each}
  <div class="row">
    <div class="cell"></div>
    <div class="cell">
      <Button onclick={addSchool} defaultColor="secondary" color="primary">
        Dodaj szkołe
      </Button>
    </div>
    <div class="cell"></div>
  </div>
</div>
