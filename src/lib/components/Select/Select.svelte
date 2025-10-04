<!--
@component Select
### Made for purpose of styling default HTML select
@param defaultText - text displayed when no value has been selected
@param selectedOption - bindable variable mostly for reading output of 'Select'
@param children - can take anything but unless children are 'Option' components doesn't work properly
#### Example usage:
```svelte
  <script>
    // Should be set to '-1' to avoid unholy behaviour
    let SelectedOption = $state(-1);
  <script>

  <Select bind:selectedOption={SelectedOption}>
      <Option name="option1"></Option>
      <Option name="option2"></Option>
      <Option name="option3"></Option>
      <Option name="option4"></Option>
    </Select>
```
-->

<script lang="ts">
  import { setContext } from "svelte";
  import SelectController, { type SelectOption } from "./SelectController";
  import type { Writable } from "svelte/store";

  let controller = new SelectController();
  let options: Writable<SelectOption[]> = controller.options;
  let currentOption: Writable<number> = controller.currentOption;
  let opened = controller.opened;

  setContext("Select", controller);

  function toggle() {
    $opened = !$opened;
  }

  let {
    defaultText = "Pick option",
    selectedOption = $bindable(-1),
    children,
  }: {
    defaultText?: string;
    selectedOption?: number;
    children: () => any;
  } = $props();

  $effect(() => {
    selectedOption = $currentOption;
  });
</script>

<div class="select">
  <button class="selectHeader" onclick={toggle}>
    {#if $currentOption === -1}
      {defaultText}
    {:else}
      {$options[$currentOption].name}
    {/if}
  </button>

  <div class="selectBody {$opened ? 'visible' : 'invisible'}">
    {@render children()}
  </div>
</div>

<style>
  .select {
    width: fit-content;
    min-width: 100%;
    position: relative;
  }
  .selectHeader {
    width: 100%;
    height: 100%;
  }
  .selectBody {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    background-color: var(--accent);
    transition:
      visibility 0.15s ease,
      opacity 0.15s ease;
  }
  .visible {
    visibility: visible;
    opacity: 1;
  }
  .invisible {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }
</style>
