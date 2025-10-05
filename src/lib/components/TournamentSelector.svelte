<script lang="ts">
    type Tournament = any;

    interface Props {
        selectedTournamentId: number;
        tournamentsRequest: Promise<Tournament[]>;
    }

    let { selectedTournamentId = $bindable(), tournamentsRequest } = $props();
</script>

<select bind:value={selectedTournamentId}>
    {#await tournamentsRequest then data} 
        {#each data.filter(t => t.TournamentStateId == 2) as tournament}
            <option value={tournament.TournamentId}>{tournament.Name}</option>
        {/each}
    {/await}
</select>