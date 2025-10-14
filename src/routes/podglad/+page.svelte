<script lang="ts">
    import { resolve } from "$app/paths";
    import RideStatusViewer from "$lib/components/RideStatusViewer.svelte";
    import type { RunState } from "$lib/ts/helper";
    import { RideEntryState } from "$lib/ts/database/databaseStates";
    import type { Ride } from "$lib/ts/models/databaseModels";
    import OmniAPI from "$lib/ts/OmniAPI/OmniAPI";
    import { onMount } from "svelte";
    import Table from "$lib/components/tables/Table.svelte";

    const defaultState: RunState = {
        runStatus: RideEntryState.NotStarted,
        runTime: 0,
        totalLaps: 0,
        lapsLeft: 0,
        tournamentId: null,
        rideId: null
    }

    let eventSource: EventSource | null = null;
    let ride: Ride | null = $state(null);
    let runState: RunState = $state(defaultState);
    let currentRiderInfo: string = $state("Brak");
    let nextRiderInfo: string = $state("Brak");
    let timer: any;
    let leaderboard = $state();

    $effect(() => {
        if(ride == null) return;
        const notStartedRides = ride.entries.filter(r => r.rideEntryStateId == RideEntryState.NotStarted);
        if(notStartedRides.length > 0) {
            const currentRide = notStartedRides[0];
            currentRiderInfo = `${currentRide.riderName} ${currentRide.riderSurname} ${currentRide.schoolNameAcronym} - ${currentRide.gokartName}`;
        }
        else {
            currentRiderInfo = "Brak";
        }

        if(notStartedRides.length > 1) {
            const nextRide = notStartedRides[1];
            nextRiderInfo = `${nextRide.riderName} ${nextRide.riderSurname} ${nextRide.schoolNameAcronym} - ${nextRide.gokartName}`;
        }
        else {
            nextRiderInfo = "Brak";
        }
    });

    async function getPodium(tournamentId: number) {
        leaderboard = (await OmniAPI.getTournament(tournamentId)).leaderboard;
    }

    async function update(data: RunState) {
        if(data.runStatus != runState.runStatus) {
            if(data.runStatus == RideEntryState.InProgress) {
                timer = setInterval(() => runState.runTime += 100, 100)
            }
            else if(data.runStatus == RideEntryState.Finished) {
                clearInterval(timer);
            }
        }

        if(data.tournamentId != runState.tournamentId || data.rideId != runState.rideId || (data.runStatus == RideEntryState.NotStarted && (runState.runStatus == RideEntryState.Finished || runState.runStatus == RideEntryState.Disqualified))) {
            const rides = await OmniAPI.getRides(data.tournamentId!);
            ride = rides.find(r => r.rideId == data.rideId!) ?? null;
            if(data.tournamentId != null) {
                getPodium(data.tournamentId);
            }
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