<script lang="ts">
  import SchoolsTable from "$lib/components/tables/SchoolsTable.svelte";

  const { data } = $props();
</script>

<SchoolsTable schools={data.schools}></SchoolsTable>
