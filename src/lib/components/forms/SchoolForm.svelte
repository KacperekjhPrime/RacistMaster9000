<!--
    @component SchoolForm
    For adding and editing schools
    @param 'name','city','acronym' - optional set when form is for edit
    @param 'modeInsert' - not used yet
    @param 'addSchool' - function for submitting the form

-->

<script lang="ts" generics="InsertMode extends boolean">
  import type { InsertResponse, ModifyData, School } from "$lib/ts/models/databaseModels";
  import Button from "../buttons/Button.svelte";

  type SaveFunctionArgs = InsertMode extends true ? [school: Omit<School, 'schoolId'>] : [id: number, school: ModifyData<School, 'schoolId'>];
  type SaveFunction = (...args: SaveFunctionArgs) => Promise<InsertMode extends true ? InsertResponse : void>;
  
  type DeleteFunction = InsertMode extends true ? {
    id?: undefined,
    deleteSchool?: undefined
  } : {
    id: number,
    deleteSchool: (id: number) => Promise<void>
  };

  type Props = {
    name?: string,
    city?: string,
    acronym?: string,
    insertMode: InsertMode,
    saveSchool: SaveFunction;
  } & DeleteFunction;

  let {
    id,
    name = $bindable(""),
    city = $bindable(""),
    acronym = $bindable(""),
    insertMode,
    saveSchool,
    deleteSchool
  }: Props = $props();

  async function SaveSchool() {
    const args: any[] = [];
    if (id) args.push(id);
    args.push({ name, city, acronym });
    await saveSchool(...args as SaveFunctionArgs);
  }

  async function DeleteSchool() {
    if (insertMode) throw new Error(`DeleteSchool() cannot be used in insert mode.`);
    await deleteSchool!(id!);
  }
</script>

{#if insertMode}
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
    {#if insertMode}
      <Button onclick={SaveSchool} color="primary">Dodaj</Button>
    {:else}
      <Button onclick={DeleteSchool} color="error">Usuń</Button>
      <Button onclick={SaveSchool} color="success">Zatwierdź</Button>
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
