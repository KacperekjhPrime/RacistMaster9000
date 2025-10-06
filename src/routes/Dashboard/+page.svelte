<script lang="ts">
    import { resolve } from "$app/paths";
    import { formatTime, type ControllerData } from "$lib/helper";
    import { onMount } from "svelte";
    import TournamentSelector from "$lib/components/TournamentSelector.svelte";
    import RideSelector from "$lib/components/RideSelector.svelte";
    import QueueViewer from "$lib/components/QueueViewer.svelte";
    import type { Ride, TournamentBasic } from "$lib/ts/models/databaseModels.js";
    import OmniAPI from "$lib/ts/OmniAPI/OmniAPI.js";
    import { createForeverPromise } from "$lib/ts/helper.js";
    import TournamentTable from "$lib/components/tables/TournamentTable.svelte";
    import { create } from "domain";

    const controllerApi = resolve("/api/controllerEvents");
    let eventSource: EventSource | null = null;
    
    let { data } = $props();

    type RunState = "Not started" | "Started" | "In progress" | "Finished" | "Disqualified";
    let controllerData: ControllerData | null = $state(data);
    let runTime: number = $state(0);
    let runState: RunState = $state("Not started");
    let timer: any = 0;
    let errorStatus: string = $state("");
    let totalLaps: number = $derived(controllerData.numberOfLaps);
    let lapsLeft: number = $state(0);
    let lockStatus: boolean = false;
    let selectedTournamentId: number | null = $state(null);
    let selectedRideId: number | null = $state(null);

    function restartRun() {
        runTime = 0;
        runState = "Not started";
        lapsLeft = totalLaps;
    }

    function update(data: ControllerData) {
        controllerData = data;
        if(lockStatus) return;

        if(data?.hasStarted && data.startTripped && runState == "Started") {
            runState = "In progress";
            timer = setInterval(() => runTime += 100);
        }
        else if(data?.finishTripped && runState == "In progress") {
            runState = "Finished";
            clearInterval(timer);
            runTime = data.timeMs;
            lockStatus = true;
            return;
        }
        else if(data?.lapTripped && runState == "In progress") {
            lapsLeft -= 1;
        }

        if(runState == "In progress") return;

        if(controllerData?.hasStarted) {
            runState = "Started";
            return;
        }
        else {
            runState = "Not started";
            return;
        }
    }

    let tournamentsRequest = $state(createForeverPromise<TournamentBasic[]>());
    let ridesRequest = $derived(selectedTournamentId === null ? createForeverPromise<Ride[]>() : OmniAPI.getRides(selectedTournamentId));

    let currentRideEntryId = $state();
    
    $effect(() => { getCurrentRideEntryId(selectedRideId) });

    async function getCurrentRideEntryId(selectedRideId: number | null) {
        if(selectedRideId == null) return;
        currentRideEntryId = (await ridesRequest).filter(r => r.rideId == selectedRideId)[0].entries[0].rideEntryId;
    }

    async function finishRideEntry() {
        const request = await fetch(resolve("/api/tournaments/[id]/rides/[rideId]/entries/[entryId]/finish", { id: selectedTournamentId!.toString(), rideId: selectedRideId!.toString(), entryId: currentRideEntryId!.toString() }), {
            method: "POST",
            body: JSON.stringify({ time: timer })
        });
    }

    onMount(async () => {
        eventSource = new EventSource(controllerApi);
        eventSource.addEventListener("update", event => {
            update(JSON.parse(atob(event.data)) as ControllerData);
        });
        eventSource.addEventListener("connectionError", event => {
            errorStatus = atob(event.data);
        });

        tournamentsRequest = fetch(resolve("/api/tournaments")).then(r => r.json());
    });
</script>

{#if errorStatus != ""}
    <h1>Błąd połączenia z kontrolerem</h1>
{:else}
    <h3>{JSON.stringify(controllerData)}</h3>
    <h1>Strona główna</h1>
    <p>Wybierz wyścig:</p>
    <TournamentSelector {tournamentsRequest} bind:selectedTournamentId={selectedTournamentId}/>
    <RideSelector {ridesRequest} bind:selectedRideId={selectedRideId}/>
    <h2>Status: {runState}</h2>
    <h3>Timer: {formatTime(runTime)}</h3>
    <h3>Okrążenia: {totalLaps - lapsLeft}/{totalLaps}</h3>
    <p>Kolejka:</p>
    <QueueViewer {selectedRideId} {ridesRequest}/>
    <button onclick={finishRideEntry} disabled={(runState != "Finished")}>Zapisz</button>
{/if}