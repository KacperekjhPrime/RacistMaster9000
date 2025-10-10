<script lang="ts">
    import Table, { type Column } from '$lib/components/tables/Table.svelte';
    import type { Rider } from '$lib/ts/models/databaseModels.js';

    const { data } = $props();

    const columns: Column<Rider>[] = [
        { key: 'name', title: 'Imie' },
        { key: 'surname', title: 'Nazwisko' },
        { key: 'schoolNameAcronym', title: 'Szkoła' },
        { key: 'city', title: 'Miejscowość' }
    ]
</script>

<Table noun="Zawodnika" addEntryRoute="/zawodnicy/dodaj" modifyEntryRoute="/zawodnicy/[id]" {columns} idKey="riderId" data={data.riders}/>