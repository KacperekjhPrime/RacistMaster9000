import { controllerAddress, fetchControllerData } from "$lib/helper";

let eventStreamController: ReadableStreamDefaultController<any> | null = null;
let previousData: string = "";
let isRunning = false;

async function sendControllerData() {
    isRunning = true;
    while(isRunning) {
        try {
            const controllerData = await fetchControllerData(controllerAddress);
    
            const stringifiedData = JSON.stringify(controllerData);
            if(stringifiedData == previousData) continue;
            previousData = stringifiedData;
    
            eventStreamController?.enqueue(`event:update\ndata:${btoa(stringifiedData)}\n\n`);
        }
        catch(e) {
            eventStreamController?.enqueue(`event:connectionError\ndata:${btoa(JSON.stringify("Failed to connect to controller"))}\n\n`);
        }
    }
}

function createReadableStream() {
    return new ReadableStream({
        start(controller) {
            eventStreamController = controller;
        },
        cancel() {
            eventStreamController = null;
            isRunning = false;
        }
    });
}

export function GET(): Response {
    sendControllerData();
    return new Response(createReadableStream(), {
        headers: {
            "content-type": "text/event-stream"
        }
    });
}