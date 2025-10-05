<script lang="ts">
    type Ride = any;

    interface Props {
        selectedRideId: number;
        ridesRequest: Promise<Ride[]>;
    }

    let { selectedRideId, ridesRequest } = $props();
</script>

{#await ridesRequest then data}
    {#if selectedRideId == null}
        <p>Brak przejazdów do wykonania</p>
    {:else}
        {#each data.filter(t => t.RideId == selectedRideId)[0].Entries as ride}
            <p>{ride.Name} {ride.Surname} {ride.SchoolAcronym} - {ride.GokartName}</p>
        {/each}
    {/if}
{/await}