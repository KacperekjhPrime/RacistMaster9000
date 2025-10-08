<script lang="ts">
    import { type Ride } from "$lib/ts/models/databaseModels";

    interface Props {
        selectedRideId: number | null;
        ridesList: Ride[];
    }

    let { selectedRideId = $bindable(), ridesList }: Props = $props();
</script>

<select bind:value={selectedRideId}>
    {#if ridesList.length == 0}
        <option disabled>Brak przejazdów</option>
    {/if}
    {#each ridesList as ride, index}
        <option value="{ride.rideId}">Przejazd {index + 1}</option>
    {/each}
</select>