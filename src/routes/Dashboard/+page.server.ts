import type { ControllerData } from '$lib/helper';

export function load() {
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
};