<script lang="ts">
    import { resolve } from "$app/paths";
    import { formatTime, type ControllerData } from "$lib/helper";
    import { onMount } from "svelte";
    import TournamentSelector from "$lib/components/TournamentSelector.svelte";
    import RideSelector from "$lib/components/RideSelector.svelte";
    import QueueViewer from "$lib/components/QueueViewer.svelte";
    import type { GETResponse as Tournament } from "../api/tournaments/+server";
    import type { GETResponse as Ride } from "../api/tournaments/[id]/rides/+server";
    import "./style.css";
    import { RideEntryState, RideEntryStatesReadable } from "$lib/ts/database/databaseStates";
    import { time } from "console";

    const controllerApi = resolve("/api/controllerEvents");
    let eventSource: EventSource | null = null;
    
    let { data } = $props();

    let controllerData: ControllerData | null = $state(data);
    let runTime: number = $state(0);
    let runState: RideEntryState = $state(RideEntryState.NotStarted);
    let timer: any;
    let errorStatus: string = $state("");
    let totalLaps: number = $derived(controllerData.numberOfLaps);
    let lapsLeft: number = $state(0);
    let lockStatus: boolean = false;
    let selectedTournamentId: number | null = $state(null);
    let selectedRideId: number | null = $state(null);
    let canSave = $state(false);
    let timePenalty = $state(0);

    function restartRun() {
        runTime = 0;
        runState = RideEntryState.NotStarted;
        lapsLeft = totalLaps;
    }

    function disqualify() {
        if(currentRideEntryId == null) return;
        runState = RideEntryState.Disqualified;
        canSave = true;
    }

    function update(data: ControllerData) {
        controllerData = data;
        if(lockStatus) return;

        if(data?.hasStarted && data.startTripped) {
            runState = RideEntryState.InProgress;
            timer = setInterval(() => runTime += 100, 100);
            canSave = false;
        }
        else if(data?.finishTripped && runState == RideEntryState.InProgress) {
            runState = RideEntryState.Finished;
            clearInterval(timer);
            runTime = data.timeMs;
            lockStatus = true;
            canSave = true;
            return;
        }
        else if(data?.lapTripped && RideEntryState.InProgress) {
            lapsLeft -= 1;
        }

        if(runState == RideEntryState.InProgress) return;

        if(!controllerData?.hasStarted) {
            runState = RideEntryState.NotStarted;
            canSave = false;
            return;
        }
    }

    let tournamentsRequest: Promise<Tournament> = $state(new Promise<Tournament>(() => {}));
    let ridesRequest: Promise<Ride> = $derived(getRides(selectedTournamentId));

    let currentRideEntryId = $state();
    
    $effect(() => { getCurrentRideEntryId(selectedRideId) });

    async function getCurrentRideEntryId(selectedRideId: number | null) {
        if(selectedRideId == null) return;
        currentRideEntryId = (await ridesRequest).filter(r => r.rideId == selectedRideId)[0].entries.filter(e => e.rideEntryStateId == RideEntryState.NotStarted)[0].rideEntryId;
    }

    async function getRides(id: number | null): Promise<Ride> {
        if(id == null) return [];
        const request = await fetch(resolve("/api/tournaments/[id]/rides", { id: id.toString() }))
        const data = await request.json() as Ride;
        
        return data;
    }

    async function finishRideEntry() {
        if(runState != RideEntryState.Disqualified) {
            const request = await fetch(resolve("/api/tournaments/[id]/rides/[rideId]/entries/[entryId]/finish", { id: selectedTournamentId!.toString(), rideId: selectedRideId!.toString(), entryId: currentRideEntryId!.toString() }), {
                method: "POST",
                body: JSON.stringify({ time: runTime })
            });

            if(timePenalty != 0) {
                const request = await fetch(resolve("/api/tournaments/[id]/rides/[rideId]/entries/[entryId]", { id: selectedTournamentId!.toString(), rideId: selectedRideId!.toString(), entryId: currentRideEntryId!.toString() }), {
                    method: "PATCH",
                    body: JSON.stringify({ penaltyMilliseconds: timePenalty * 1000 })
                });
            }
        }
        else {
            const request = await fetch(resolve("/api/tournaments/[id]/rides/[rideId]/entries/[entryId]/disqualify", { id: selectedTournamentId!.toString(), rideId: selectedRideId!.toString(), entryId: currentRideEntryId!.toString() }), {
                method: "POST",
            });
        }

        restartRun();
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
    <h2>Status: {RideEntryStatesReadable[runState]}</h2>
    <h3>Timer: {formatTime(runTime)}</h3>
    {#if canSave}
        <p>Nadaj karę czasową (s): <input type="number" bind:value={timePenalty}></p>
    {/if}
    <h3>Okrążenia: {totalLaps - lapsLeft}/{totalLaps}</h3>
    <p>Kolejka:</p>
    <QueueViewer {selectedRideId} {ridesRequest}/>
    <div class="button-container">
        <button onclick={finishRideEntry} disabled={!canSave} class="save-button">Zapisz</button>
        <button onclick={disqualify} class="disqualify-button">Dyskwalifikacja</button>
    </div>
{/if}