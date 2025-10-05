<script lang="ts">
  import SchoolForm from "$lib/components/forms/SchoolForm.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  let school = $state(data.school);
</script>

<SchoolForm
  bind:name={school.Name}
  bind:city={school.City}
  bind:acronym={school.Acronym}
  modeInsert={false}
></SchoolForm>
