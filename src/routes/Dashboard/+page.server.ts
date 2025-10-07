import { controllerAddress, fetchControllerData } from "$lib/helper";

const defaultControllerData = {
    numberOfLaps: 0,
    lapsLeft: 0,
    timeMs: 0,
    hasStarted: false,
    startTripped: false,
    lapTripped: false,
    finishTripped: false
}

export async function load() {
    let controllerData;
    try {
        controllerData = fetchControllerData(controllerAddress);
    }
    catch(e) {
        controllerData = defaultControllerData;
    }
    return controllerData;
}