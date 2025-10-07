<script lang="ts">
    import type { TournamentBasic } from "$lib/ts/models/databaseModels";

    interface Props {
        selectedTournamentId: number | null;
        tournamentsList: TournamentBasic[];
    }

    let { selectedTournamentId = $bindable(), tournamentsList }: Props = $props();
</script>

<select bind:value={selectedTournamentId}> 
    {#each tournamentsList.filter(t => t.tournamentStateId == 2) as tournament}
        <option value={tournament.tournamentId}>{tournament.name}</option>
    {/each}
</select>