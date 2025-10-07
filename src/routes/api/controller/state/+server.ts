import { fetchControllerData, controllerAddress } from "$lib/helper";

const defaultControllerData = {
    numberOfLaps: 0,
    lapsLeft: 0,
    timeMs: 0,
    hasStarted: false,
    startTripped: false,
    lapTripped: false,
    finishTripped: false
}

export function GET(): Response {
    let controllerData;
    try {
        controllerData = fetchControllerData(controllerAddress);
    }
    catch(e) {
        controllerData = defaultControllerData;
    }
    return new Response(JSON.stringify(controllerData));
}