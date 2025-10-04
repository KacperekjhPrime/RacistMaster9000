<!--
  @component Option
  ### Made to be used with 'Select' component
  @param name - text to be displayed in 'Select'
  @param value(optional) - value to be set, for accessibility reasons
-->

<script lang="ts">
  import { getContext, onMount } from "svelte";
  import SelectController from "./SelectController";

  let { name, value = name }: { name: string; value?: string } = $props();

  let selfId: number;
  let controller: SelectController;

  onMount(() => {
    controller = getContext("Select") as SelectController;
    selfId = controller.getId();
    controller.RegisterOption({ name: name, value: value });
  });

  function setCurrentOption() {
    controller.setCurrentOption(selfId);
    controller.closeSelect();
  }
</script>

<button onclick={setCurrentOption}> {name}</button>
