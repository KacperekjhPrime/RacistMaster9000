
import type { ControllerData } from "$lib/helper";

export async function load({ fetch }) {
    const controllerData = await fetch("../api/controller/state").then(d => d.json()) as ControllerData;
    return controllerData;
}