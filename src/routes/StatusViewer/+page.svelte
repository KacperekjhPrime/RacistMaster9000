<script lang="ts">
    import { resolve } from "$app/paths";
    import RideStatusViewer from "$lib/components/RideStatusViewer.svelte";
    import type { RunState } from "$lib/helper";
    import { RideEntryState } from "$lib/ts/database/databaseStates";
    import type { Ride } from "$lib/ts/models/databaseModels";
    import OmniAPI from "$lib/ts/OmniAPI/OmniAPI";
    import { time } from "console";
    import { onMount } from "svelte";

    const defaultState: RunState = {
        runStatus: RideEntryState.NotStarted,
        runTime: 0,
        totalLaps: 0,
        lapsLeft: 0,
        tournamentId: null,
        rideId: null
    }

    let eventSource;
    let ride: Ride | null = $state(null);
    let runState: RunState = $state(defaultState);
    let currentRiderInfo: string = $state("Brak");
    let nextRiderInfo: string = $state("Brak");
    let timer: any;

    $effect(() => {
        if(ride == null) return;
        if(ride.entries.length > 0) {
            const currentRide = ride.entries[0];
            currentRiderInfo = `${currentRide.riderName} ${currentRide.riderSurname} ${currentRide.schoolNameAcronym} - ${currentRide.gokartName}`;
        }
        else {
            currentRiderInfo = "Brak";
        }

        if(ride.entries.length > 1) {
            const nextRide = ride.entries[1];
            nextRiderInfo = `${nextRide.riderName} ${nextRide.riderSurname} ${nextRide.schoolNameAcronym} - ${nextRide.gokartName}`;
        }
        else {
            nextRiderInfo = "Brak";
        }
    });

    async function update(data: RunState) {
        if(data.runStatus != runState.runStatus) {
            if(data.runStatus == RideEntryState.InProgress) {
                timer = setInterval(() => { runState.runTime += 100 }, 100)
            }
            else if(data.runStatus == RideEntryState.Finished) {
                clearInterval(timer);
            }
        }
        

        if(data.tournamentId != runState.tournamentId || data.rideId != runState.rideId) {
            ride = await OmniAPI.getRide(data.tournamentId!, data.rideId!);
        }
        runState = data;
    }

    onMount(() => {
        eventSource = new EventSource(resolve("/api/statusViewerController"));
        eventSource.addEventListener("update", event => {
            update(JSON.parse(atob(event.data)) as RunState);
        });
    });
</script>

<h1>{currentRiderInfo}</h1>
<RideStatusViewer runState={runState.runStatus} runTime={runState.runTime} totalLaps={runState.totalLaps} lapsLeft={runState.lapsLeft} />
<h3>Następny: {nextRiderInfo}</h3>