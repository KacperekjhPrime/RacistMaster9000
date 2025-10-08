<script lang="ts">
    import { RideEntryState } from "$lib/ts/database/databaseStates";
    import type { Ride } from "$lib/ts/models/databaseModels";

    interface Props {
        selectedRideId: number | null;
        ridesRequest: Promise<Ride[]>;
    }

    let { selectedRideId, ridesRequest }: Props = $props();
</script>

{#await ridesRequest then data}
    {#if selectedRideId == null}
        <p>Brak przejazdów do wykonania</p>
    {:else}
        {#each data.filter(r => r.rideId == selectedRideId)[0].entries.filter(e => e.rideEntryStateId == RideEntryState.NotStarted) as ride}
            <p>{ride.riderName} {ride.riderSurname} {ride.schoolNameAcronym} - {ride.gokartName}</p>
        {/each}
    {/if}
{/await}