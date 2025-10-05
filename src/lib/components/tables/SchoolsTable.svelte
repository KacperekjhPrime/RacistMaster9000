<script lang="ts">
  import type { School } from "$lib/ts/models/databaseModels";
  import { flip } from "svelte/animate";
  import Icon from "../icons/Icon.svelte";
  import LinkCard from "../cards/LinkCard.svelte";
  import "./tables.css";
  import LinkButton from "../buttons/LinkButton.svelte";

  import { page } from "$app/stores";

  let { schools = $bindable([]) }: { schools: Array<School> } = $props();
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
      <span class="cell">
        <LinkButton
          color="primary"
          defaultColor="transparent"
          link={$page.url.pathname + "/" + school.Acronym}
        >
          <Icon fill="default" size="2rem" icon="more_horizontal"></Icon>
        </LinkButton></span
      >
    </div>
  {/each}
  <div class="row">
    <div class="cell"></div>
    <div class="cell">
      <!-- <Button onclick={addSchool} defaultColor="secondary" color="primary">
        Dodaj szkołe
      </Button> -->
      <LinkCard icon="arrow_drop_down" color="primary" link="/" contents="uwuw"
      ></LinkCard>
    </div>
    <div class="cell"></div>
  </div>
</div>

<style>
  .row {
    width: 100%;
    height: 4rem;
    display: grid;
    grid-template-columns: 30% 30% 30% 10%;
    align-items: center;
    justify-content: center;
    border-bottom: 0.125rem solid var(--secondary);
    transition: var(--transition);
  }
  .row:first-child {
    background-color: var(--secondary);
    box-shadow: var(--secondary) 0px 0px 0.5rem 0.05rem;
  }
  .row:hover {
    background-color: var(--secondary);
    border-top: var(--borderThickness) solid var(primary);
    border-bottom: var(--borderThickness) solid var(primary);
  }
  .row:first-child .cell {
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: var(--letterSpacing);
    text-transform: capitalize;
    color: var(--header);
  }
  .cell {
    border-left: 0.125rem solid var(--secondary);
    display: flex;
    width: calc(100% - 2rem);
    height: 90%;
    align-items: center;
    justify-content: center;
    word-break: normal;
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .cell:first-child {
    border-left: none;
  }
  .row:first-child .cell {
    border-color: var(--text);
  }
  .row:last-child .cell {
    border: transparent;
  }
  .row:last-child {
    border: none;
  }
  .row:last-child:hover {
    background-color: transparent;
  }

  .row:last-child .cell {
    height: 6rem;
    justify-content: center;
    align-items: center;
    display: flex;
  }
</style>
