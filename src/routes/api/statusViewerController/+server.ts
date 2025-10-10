import type { RunState } from '$lib/helper.js';
import type { RideEntryState } from '$lib/ts/models/databaseModels.js';

let eventStreamController: ReadableStreamDefaultController<any> | null = null;

function createReadableStream() {
    return new ReadableStream({
        start(controller) {
            eventStreamController = controller;
        },
        cancel() {
            eventStreamController = null;
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

export async function POST({ request }): Promise<Response> {
    if(eventStreamController == null) return new Response();
    const status = await request.json() as RunState;
    eventStreamController.enqueue(`event:update\ndata:${btoa(JSON.stringify(status))}`);
    return new Response();
}