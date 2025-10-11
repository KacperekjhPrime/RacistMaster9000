<script lang="ts">
    import { formatTime } from "$lib/ts/helper";
    import { RideEntryState, RideEntryStatesReadable } from "$lib/ts/models/databaseModels";

    interface Props {
        runState: RideEntryState;
        runTime: number;
        totalLaps: number;
        lapsLeft: number;
    }

    let { runState, runTime, totalLaps, lapsLeft }: Props = $props();
</script>

<h2>Status: {RideEntryStatesReadable[runState]}</h2>
<h3>Timer: {formatTime(runTime)}</h3>
<h3>Okrążenia: {totalLaps - lapsLeft}/{totalLaps}</h3>