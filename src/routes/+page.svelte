<script lang="ts">
    import { resolve } from "$app/paths";
    import type { ControllerData } from "$lib/helper.server";
    import { onMount } from "svelte";

    const address = resolve("/api/controllerEvents");
    let eventSource: EventSource | null = null;

    type RunStatus = "Waiting" | "Started" | "In progress" | "Finished";
    let runStatus = $state("Waiting");

    function update(data: ControllerData) {
        
    }

    onMount(async () => {
        eventSource = new EventSource(address);
        eventSource.addEventListener("update", event => update(event.data() as ControllerData));
    });
</script>

<h1>Strona główna</h1>
<h2>Status:</h2>