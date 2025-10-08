<script lang="ts">
    import { RideEntryState, type Ride } from "$lib/ts/models/databaseModels";

    interface Props {
        selectedRideId: number | null;
        ridesList: Ride[];
    }

    let { selectedRideId, ridesList }: Props = $props();

    let rides = $derived(ridesList.filter(r => r.rideId == selectedRideId)[0]?.entries.filter(e => e.rideEntryStateId == RideEntryState.NotStarted));
</script>

<style>
    table, tr, td, th {
        border: 2px solid white;
        border-collapse: collapse;
    }
    
    table {
        border-radius: 1rem;
    }

    th {
        padding: 1rem;
        padding-left: 3rem;
        padding-right: 3rem;
        background-color: gray;
    }

    td {
        padding: 1rem;
    }

    .table-title {
        text-align: center;
    }

    .table-empty-information {
        text-align: center;
    }

    .current-rider {
        text-decoration: underline;
        font-weight: bold;
        color: lightgreen;
    }
</style>

<table>
    <thead>
        <tr><th colspan="4" class="table-title">Kolejka</th></tr>
        <tr><th>Imię</th><th>Nazwisko</th><th>Szkoła</th><th>Gokart</th></tr>
    </thead>
    <tbody>
    {#if selectedRideId == null || rides.length == 0}
        <tr><td colspan="4" class="table-empty-information">Brak danych do wyświetlenia</td></tr>
    {:else}
        {#each rides as ride, index}
            {#if index == 0}
                <tr class="current-rider"><td>{ride.riderName}</td><td>{ride.riderSurname}</td><td>{ride.schoolNameAcronym}</td><td>{ride.gokartName}</td></tr>
            {:else}
                <tr><td>{ride.riderName}</td><td>{ride.riderSurname}</td><td>{ride.schoolNameAcronym}</td><td>{ride.gokartName}</td></tr>
            {/if}
        {/each}
    {/if}
    </tbody>
</table>