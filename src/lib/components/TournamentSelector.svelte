<script lang="ts">
    import type { TournamentBasic } from "$lib/ts/models/databaseModels";

    interface Props {
        selectedTournamentId: number | null;
        tournamentsRequest: Promise<TournamentBasic[]>;
    }

    let { selectedTournamentId = $bindable(), tournamentsRequest }: Props = $props();
</script>

<select bind:value={selectedTournamentId}>
    {#await tournamentsRequest then data} 
        {#each data.filter(t => t.tournamentStateId == 2) as tournament}
            <option value={tournament.tournamentId}>{tournament.name}</option>
        {/each}
    {/await}
</select>