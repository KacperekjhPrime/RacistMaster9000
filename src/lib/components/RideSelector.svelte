<script lang="ts">
    type Ride = any;

    interface Props {
        selectedTournamentId: number;
        ridesRequest: Promise<Ride[]>;
    }

    let { selectedRideId = $bindable(), ridesRequest } = $props();
</script>

<select bind:value={selectedRideId}>
    {#await ridesRequest then data}
        {#each data as ride, index}
            <option value="{ride.rideId}">Przejazd {index + 1}</option>
        {/each}
    {/await}
</select>