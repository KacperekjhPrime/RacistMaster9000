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

    $effect(() => {
        if(controllerData?.hasStarted) {
            runState = "Started";
        }
        else if(controllerData?.hasStarted && controllerData.startTripped) {
            runState = "In progress";
            timer = setInterval(() => runTime += 100);
        }
        else if(runState == "In progress" && controllerData?.finishTripped) {
            runState = "Finished";
            clearInterval(timer);
            runTime = controllerData.timeMs;
        }
    });

    onMount(async () => {
        eventSource = new EventSource(address);
        eventSource.addEventListener("update", event => {
            controllerData = JSON.parse(atob(event.data)) as ControllerData;
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
<h3>Started: {controllerData?.hasStarted}</h3>
<h3>Timer: {formatTime(runTime)}</h3>
{/if}