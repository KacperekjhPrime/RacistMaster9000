<script lang="ts">
    import type { Column } from '$lib/components/tables/Table.svelte';
    import Table from '$lib/components/tables/Table.svelte';
    import type { Gokart } from '$lib/ts/models/databaseModels.js';

    const { data } = $props();

    const columns: Column<Gokart>[] = [
        { key: 'name', title: 'Nazwa' }
    ]
</script>

<Table noun="Gokart" addEntryRoute="/gokarty/dodaj" modifyEntryRoute="/gokarty/[id]" {columns} idKey="gokartId" data={data.gokarts} />