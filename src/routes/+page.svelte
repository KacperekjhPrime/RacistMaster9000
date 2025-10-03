<script lang="ts">
    import { resolve } from "$app/paths";
    import { formatTime, type ControllerData } from "$lib/helper";
    import { onMount } from "svelte";

    const address = resolve("/api/controllerEvents");
    let eventSource: EventSource | null = null;
    
    let { data } = $props();

    type RunState = "Not started" | "Started" | "In progress" | "Finished" | "Disqualified";
    let status: ControllerData | null = $state(data);
    let time: string = $derived(status != null ? formatTime(status.timeMs) : "");

    onMount(async () => {
        eventSource = new EventSource(address);
        eventSource.addEventListener("update", event => {
            status = JSON.parse(atob(event.data)) as ControllerData;
        });
    });
</script>

<h1>Strona główna</h1>
<h2>Status:</h2>
<h3>Started: {status?.hasStarted}</h3>
<h3>Timer: {time}</h3>