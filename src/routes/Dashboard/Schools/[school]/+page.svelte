<script lang="ts">
  import SchoolForm from "$lib/components/forms/SchoolForm.svelte";
  import OmniAPI from "$lib/ts/OmniAPI/OmniAPI";

  let { data } = $props();
  let school = $state(data.school);
</script>

<SchoolForm
  bind:name={school.name}
  bind:city={school.city}
  bind:acronym={school.acronym}
  insertMode={true}
  saveSchool={OmniAPI.addSchool}
></SchoolForm>
