<script lang="ts">
    import { type LeaderboardEntry } from "$lib/ts/models/databaseModels";
    import { formatTime } from "$lib/ts/helper";

    interface Props {
        leaderboard: LeaderboardEntry[] | null;
    }

    let { leaderboard }: Props = $props();
</script>

<style>
    th {
        padding-left: 1rem;
        padding-right: 1rem;
    }
</style>

<div class="container">
    <table>
        <thead>
            <tr><th colspan="5" class="table-title">Wyniki</th></tr>
            <tr><th>#</th><th>Imię</th><th>Nazwisko</th><th>Szkoła</th><th>Czas</th></tr>
        </thead>
        <tbody>
        {#if leaderboard == null || leaderboard.length == 0}
            <tr><td colspan="5" class="table-empty-information">Brak danych do wyświetlenia</td></tr>
        {:else}
            {#each leaderboard as leaderboarEntry, index}
                <tr><td>{index + 1}</td><td>{leaderboarEntry.riderName}</td><td>{leaderboarEntry.riderSurname}</td><td>{leaderboarEntry.schoolNameAcronym}</td><td>{formatTime(leaderboarEntry.bestTime)}</td></tr>
            {/each}
        {/if}
        </tbody>
    </table>
</div>