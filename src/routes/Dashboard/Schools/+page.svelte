<script lang="ts">
  import SchoolsTable from "$lib/components/tables/SchoolsTable.svelte";
  import type { School } from "$lib/ts/models/databaseModels";
  import OmniAPI from "$lib/ts/OmniAPI/OmniAPI";
  import { onMount } from "svelte";

  let schools: Array<School> = $state([]);

  onMount(async () => {
    schools = await OmniAPI.getSchools();
  });
</script>

<SchoolsTable bind:schools></SchoolsTable>
