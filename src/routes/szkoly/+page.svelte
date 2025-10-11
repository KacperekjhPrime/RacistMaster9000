<script lang="ts">
    import Table, { type Column } from "$lib/components/tables/Table.svelte";
    import type { School } from "$lib/ts/models/databaseModels.js";

    const { data } = $props();

    const columns: Column<School>[] = [
        { key: 'name', title: 'Nazwa' },
        { key: 'acronym', title: 'Skrót' },
        { key: 'city', title: 'Miasto' }
    ]
</script>

<Table noun="Szkołę" addEntryRoute="/szkoly/dodaj" modifyEntryRoute="/szkoly/[id]" {columns} idKey='schoolId' data={data.schools} />