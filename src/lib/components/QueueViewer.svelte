<script lang="ts">
    import { RideEntryState, type Ride } from "$lib/ts/models/databaseModels";

    interface Props {
        selectedRideId: number | null;
        ridesList: Ride[];
    }

    let { selectedRideId, ridesList }: Props = $props();
</script>

{#if selectedRideId == null}
    <p>Brak przejazdów do wykonania</p>
{:else}
    {#each ridesList.filter(r => r.rideId == selectedRideId)[0].entries.filter(e => e.rideEntryStateId == RideEntryState.NotStarted) as ride}
        <p>{ride.riderName} {ride.riderSurname} {ride.schoolNameAcronym} - {ride.gokartName}</p>
    {/each}
{/if}