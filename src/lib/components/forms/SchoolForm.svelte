<!--
    @component SchoolForm
    For adding and editing schools
    @param 'name','city','acronym' - optional set when form is for edit
    @param 'modeInsert' - not used yet
    @param 'addSchool' - function for submitting the form

-->

<script lang="ts">
  import type { School } from "$lib/ts/models/databaseModels";
  import Button from "../buttons/Button.svelte";

  let {
    name = $bindable(""),
    city = $bindable(""),
    acronym = $bindable(""),
    modeInsert = true,
    addSchool = (school) => {},
    deleteSchool = (school) => {},
  }: {
    name?: string;
    city?: string;
    acronym?: string;
    modeInsert?: boolean;
    addSchool?: (school: School) => void;
    deleteSchool?: (school: School) => void;
  } = $props();

  function AddSchool() {
    addSchool({ Name: name, City: city, Acronym: acronym });
  }
  function DeleteSchool() {}
</script>

{#if modeInsert}
  <h2>Dodaj Szkołę</h2>
{:else}
  <h2>Edytuj lub usuń szkołę</h2>
{/if}

<form onsubmit={(event) => event.preventDefault()} autocomplete="off">
  <label for="name">Nazwa:</label>
  <input
    id="name"
    type="text"
    bind:value={name}
    placeholder="Pełna nazwa szkoły"
  />
  <label for="city">Miasto:</label>
  <input id="city" type="text" bind:value={city} placeholder="Miasto" />
  <label for="acronym">Akronim:</label>
  <input id="acronym" type="text" bind:value={acronym} placeholder="Skrót" />
  <div>
    {#if modeInsert}
      <Button onclick={AddSchool} color="primary">Dodaj</Button>
    {:else}
      <Button onclick={DeleteSchool} color="error">Usuń</Button>
      <Button onclick={AddSchool} color="success">Zatwierdź</Button>
    {/if}
  </div>
</form>

<style>
  form {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  label,
  input,
  div {
    width: 100%;
    outline: transparent;
    border: none;
    padding: 1rem;
  }
  label {
    padding-bottom: 0.25rem;
  }
  input {
    background-color: var(--secondary);
    color: inherit;
  }
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
  }
  h2 {
    color: var(--header);
    letter-spacing: var(--letterSpacing);
    font-size: 1.4rem;
    font-weight: 700;
  }
</style>
