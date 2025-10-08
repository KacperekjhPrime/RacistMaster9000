import { controllerAddress, fetchControllerData } from "$lib/helper";

let eventStreamController: ReadableStreamDefaultController<any> | null = null;

let previousData: string = "";
async function sendControllerData() {
    try {
        const controllerData = await fetchControllerData(controllerAddress);

        const stringifiedData = JSON.stringify(controllerData);
        if(stringifiedData == previousData) return;
        previousData = stringifiedData;

        eventStreamController?.enqueue(`event:update\ndata:${btoa(stringifiedData)}\n\n`);
    }
    catch(e) {
        eventStreamController?.enqueue(`event:connectionError\ndata:${btoa(JSON.stringify("Failed to connect to controller"))}\n\n`);
        return;
    }
}

function createReadableStream() {
    let interval = setInterval(sendControllerData, 100);
    return new ReadableStream({
        start(controller) {
            eventStreamController = controller;
        },
        cancel() {
            eventStreamController = null;
            clearInterval(interval);
        }
    });
}

export function GET(): Response {
    return new Response(createReadableStream(), {
        headers: {
            "content-type": "text/event-stream"
        }
    });
}