<script lang="ts">
    import { resolve } from "$app/paths";
    import { formatTime, type ControllerData } from "$lib/helper";
    import { onMount } from "svelte";
    import TournamentSelector from "$lib/components/TournamentSelector.svelte";
    import RideSelector from "$lib/components/RideSelector.svelte";
    import QueueViewer from "$lib/components/QueueViewer.svelte";
    import { RideEntryState, RideEntryStatesReadable, type Ride, type TournamentBasic } from "$lib/ts/models/databaseModels";
    import OmniAPI from "$lib/ts/OmniAPI/OmniAPI";
    import "./style.css";

    let eventSource: EventSource | null = null;
    
    let { data } = $props();

    // let runStatus: {
    //     runTime: number,
    //     runState: RideEntryState,
    //     timePenalty: number
    // } = $state({
    //     runTime: 0,
    //     runState: RideEntryState.NotStarted,
    //     timePenalty: 0,
    // });

    let controllerData: ControllerData = $state(data);
    $effect(() => console.log(controllerData))
    let runTime: number = $state(0);
    let runState: RideEntryState = $state(RideEntryState.NotStarted);
    let timer: any;
    let errorStatus: string = $state("");
    let totalLaps: number = $derived(controllerData.numberOfLaps);
    let lapsLeft: number = $derived(controllerData.lapsLeft);
    let lockStatus: boolean = false;
    let selectedTournamentId: number | null = $state(null);
    let selectedRideId: number | null = $state(null);
    let canSave = $state(false);
    let timePenalty = $state(0);
    let currentRideEntryId: number | null = $state(null);
    let previousState: RideEntryState = $state(RideEntryState.NotStarted);

    function restartRun() {
        runTime = 0;
        runState = RideEntryState.NotStarted;
        lapsLeft = totalLaps;
        canSave = false;
        lockStatus = false;
        previousState = RideEntryState.NotStarted;
    }

    function disqualify() {
        if(currentRideEntryId == null) return;
        if(runState == RideEntryState.Disqualified) {
            canSave = previousState == RideEntryState.Finished ? true : false;
            runState = previousState;
        }
        else {
            previousState = runState == RideEntryState.InProgress ? RideEntryState.NotStarted : runState;
            runState = RideEntryState.Disqualified;
            canSave = true;
        }
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

    let tournamentsList: TournamentBasic[] = $state([]);
    let ridesList: Ride[] = $state([]);

    $effect(() => {
        if(selectedTournamentId === null) return;
        OmniAPI.getRides(selectedTournamentId).then(v => ridesList = v);
    });

    $effect(() => { getCurrentRideEntryId(selectedRideId) });

    async function getCurrentRideEntryId(selectedRideId: number | null) {
        if(selectedRideId == null && ridesList != null) return;
        currentRideEntryId = ridesList?.filter(r => r.rideId == selectedRideId)[0].entries.filter(e => e.rideEntryStateId == RideEntryState.NotStarted)[0].rideEntryId;
    }

    async function finishRideEntry() {
        if(selectedTournamentId == null || selectedRideId == null || currentRideEntryId == null || controllerData?.timeMs == null) return;

        if(runState != RideEntryState.Disqualified) {
            OmniAPI.finishRideEntry(selectedTournamentId, selectedRideId, currentRideEntryId, controllerData?.timeMs);

            if(timePenalty != 0) {
                OmniAPI.addTimePenalty(selectedTournamentId, selectedRideId, currentRideEntryId, timePenalty * 1000);
            }
        }
        else {
            OmniAPI.disqualifyRideEntry(selectedTournamentId, selectedRideId, currentRideEntryId);
        }

        ridesList = await OmniAPI.getRides(selectedTournamentId);
        restartRun();
    }

    onMount(async () => {
        eventSource = new EventSource(resolve("/api/controller/events"));
        eventSource.addEventListener("update", event => {
            update(JSON.parse(atob(event.data)) as ControllerData);
        });
        eventSource.addEventListener("connectionError", event => {
            errorStatus = atob(event.data);
        });

        tournamentsList = await OmniAPI.getTournaments();
    });
</script>

{#if errorStatus != ""}
    <h1>Błąd połączenia z kontrolerem</h1>
    <button onclick={() => location.reload()}>Odśwież</button>
{:else}
    <h1>Strona główna</h1>
    <div class="container">
        <div class="container-left">
            <p>Wybierz wyścig:</p>
            <TournamentSelector {tournamentsList} bind:selectedTournamentId={selectedTournamentId}/>
            <RideSelector {ridesList} bind:selectedRideId={selectedRideId}/>
            <h2>Status: {RideEntryStatesReadable[runState]}</h2>
            <h3>Timer: {formatTime(runTime)}</h3>
            {#if (canSave && runState != RideEntryState.Disqualified)}
                <p>Nadaj karę czasową (s): <input type="number" bind:value={timePenalty}></p>
            {/if}
            <h3>Okrążenia: {totalLaps - lapsLeft}/{totalLaps}</h3>
            <div class="button-container">
                <button onclick={finishRideEntry} disabled={!canSave} class="save-button">Zapisz</button>
                <button onclick={disqualify} disabled={currentRideEntryId == null} class="disqualify-button">
                    {#if runState == RideEntryState.Disqualified}
                    Cofnij dyskwalifikację
                    {:else}
                    Dyskwalifikacja
                    {/if}
                </button>
                <button onclick={restartRun} class="clear-button">Wyczyść</button>
            </div>
        </div>
        <div class="container-right">
            <QueueViewer {selectedRideId} {ridesList}/>
        </div>
    </div>
{/if}