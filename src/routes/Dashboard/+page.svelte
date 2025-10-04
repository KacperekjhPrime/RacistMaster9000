<script lang="ts">
    import { resolve } from "$app/paths";
    import { formatTime, type ControllerData } from "$lib/helper";
    import { onMount } from "svelte";

    const controllerApi = resolve("/api/controllerEvents");
    let eventSource: EventSource | null = null;
    
    let { data } = $props();

    type Tournament = any;
    type Ride = any;
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

    let tournamentsRequest: Promise<Tournament[]> = $state(new Promise<Tournament[]>(() => {}));
    let ridesRequest: Promise<Ride[]> = $derived(getRides(selectedTournamentId ?? 1));

    async function getRides(id: number): Promise<Ride[]> {
        const request = await fetch(resolve("/api/tournaments/[id]/rides", { id: id.toString() }))
        const data = await request.json() as Ride[];
        data.filter(r => r.RideEntryStateId == 1);
        
        return data;
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
    <select bind:value={selectedTournamentId}>
        {#await tournamentsRequest then data} 
            {#each data.filter(t => t.TournamentStateId == 2) as tournament}
                <option value={tournament.TournamentId}>{tournament.Name}</option>
            {/each}
        {/await}
    </select>
    <p>Kolejka:</p>
    {#await ridesRequest then data}
        {#if data.length == 0}
            <p>Brak przejazdów do wykonania</p>
        {:else}
            {#each data as ride}
                <p>{ride.Entries[0].Name}</p>
            {/each}
        {/if}
    {/await}
    <br><br>
    <h2>Status: {runState}</h2>
    <h3>Timer: {formatTime(runTime)}</h3>
    <h3>Okrążenia: {totalLaps - lapsLeft}/{totalLaps}</h3>
{/if}