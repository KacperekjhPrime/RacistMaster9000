<script lang="ts">
    import { resolve } from "$app/paths";
    import { formatTime, type ControllerData } from "$lib/helper";
    import { onMount } from "svelte";

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
    let tournaments: Array<any> = $state([]);
    let selectedTournamentId: number | null = $state(null);

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

    onMount(async () => {
        eventSource = new EventSource(controllerApi);
        eventSource.addEventListener("update", event => {
            update(JSON.parse(atob(event.data)) as ControllerData);
        });
        eventSource.addEventListener("connectionError", event => {
            errorStatus = atob(event.data);
        });

        const request = await fetch(resolve("/api/tournaments"));
        const response = await request.json() as Array<any>;
        tournaments = response.filter(tournament => tournament.TournamentStateId == 2);
    });
</script>

{#if errorStatus != ""}
    <h1>Błąd połączenia z kontrolerem</h1>
{:else}
    <h3>{JSON.stringify(controllerData)}</h3>
    <h1>Strona główna</h1>
    <p>Wybierz wyścig:</p>
    <select bind:value={selectedTournamentId}>
        {#each tournaments as tournament}
        <option value={tournament.TournamentId}>{tournament.Name}</option>
        {/each}
    </select>
    <p>Kolejka:</p>
    <br><br>
    <h2>Status: {runState}</h2>
    <h3>Timer: {formatTime(runTime)}</h3>
    <h3>Okrążenia: {totalLaps - lapsLeft}/{totalLaps}</h3>
{/if}