import parseData from "$lib/helper";

// const controllerAddress: string = "http://192.168.0.1/awp/1/index.html";
const controllerAddress: string = "http://localhost:5173/";
let eventStreamController: ReadableStreamDefaultController<any> | null = null;

let previousData: string = "";

async function fetchControllerData(): Promise<void> {
    if (__NO_CONTROLLER) return;

    let response;
    let result;
    try {
        response = await fetch(controllerAddress);
        result = await response.text();
    }
    catch(e) {
        eventStreamController?.enqueue(`event:connectionError\ndata:${btoa(JSON.stringify("Failed to connect to controller"))}\n\n`);
        return;
    }

    if(result == previousData) return;
    previousData = result;

    const data = parseData(result);
    eventStreamController?.enqueue(`event:update\ndata:${btoa(JSON.stringify(data))}\n\n`);
}

function createReadableStream() {
    let interval = setInterval(fetchControllerData, 100);
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