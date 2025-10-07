import type { ControllerData } from "$lib/helper";
import { resolve } from "path";

export async function load() {
    const data: ControllerData = {
        numberOfLaps: 0,
        lapsLeft: 0,
        timeMs: 0,
        hasStarted: false,
        startTripped: false,
        lapTripped: false,
        finishTripped: false
    };
    return data;
}