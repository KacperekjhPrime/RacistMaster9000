<script lang="ts">
    import { resolve } from "$app/paths";
    import { formatTime, type ControllerData } from "$lib/helper";
    import { onMount } from "svelte";

    const address = resolve("/api/controllerEvents");
    let eventSource: EventSource | null = null;
    
    let { data } = $props();

    type RunState = "Not started" | "Started" | "In progress" | "Finished" | "Disqualified";
    let controllerData: ControllerData | null = $state(data);
    let runTime: number = $state(0);
    let runState: RunState = $state("Not started");
    let timer: number = 0;
    let errorStatus: string = $state("");
    let totalLaps: number = $derived(controllerData.numberOfLaps);
    let lapsLeft: number = $state(0);
    let lockStatus: boolean = false;

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
        eventSource = new EventSource(address);
        eventSource.addEventListener("update", event => {
            update(JSON.parse(atob(event.data)) as ControllerData);
        });
        eventSource.addEventListener("connectionError", event => {
            errorStatus = atob(event.data);
        });
    });
</script>

{#if errorStatus != ""}
    <h1>Błąd połączenia z kontrolerem</h1>
{:else}
<h3>{JSON.stringify(controllerData)}</h3>
<h1>Strona główna</h1>
<h2>Status: {runState}</h2>
<h3>Timer: {formatTime(runTime)}</h3>
<h3>Okrążenia: {totalLaps - lapsLeft}/{totalLaps}</h3>
{/if}