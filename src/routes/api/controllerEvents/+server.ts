import parseData from "$lib/helper";

// const controllerAddress: string = "http://192.168.0.1/awp/1/index.html";
const controllerAddress: string = "http://localhost/test";
let eventStreamController: ReadableStreamDefaultController<any> | null = null;

const htmlString = "<html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=windows-1252\"><meta charset=\"utf-1\"><title>Pomiar czasu przejazdu ZSTiO Limanowa</title><style>:is([id*='google_ads_iframe'],[id*='taboola-'],.taboolaHeight,.taboola-placeholder,#top-ad,#credential_picker_container,#credentials-picker-container,#credential_picker_iframe,[id*='google-one-tap-iframe'],#google-one-tap-popup-container,.google-one-tap__module,.google-one-tap-modal-div,#amp_floatingAdDiv,#ez-content-blocker-container) {display:none!important;min-height:0!important;height:0!important;}</style></head><body><p class=\"main_lap_counter\">2</p><p class=\"lap_counter\">0</p><p class=\"lap_counter\">0</p><p class=\"lap_counter\">2</p><p class=\"lap_counter\">0</p><p class=\"lap_counter\">0</p><p class=\"lap_counter\">0</p><p class=\"lap_counter\">0</p><p class=\"lap_counter\">0</p><p class=\"lap_counter\">0</p><p class=\"lap_counter\">0</p><p class=\"lap_time\">T#1s_1ms</p><p class=\"lap_start\">0</p><p class=\"foto_0\">0</p><p class=\"foto_1\">0</p><p class=\"foto_2\">0</p><p class=\"time_0\">T#0ms</p><p class=\"time_1\">T#0ms</p><p class=\"time_3\">T#0ms</p><p class=\"race_configuration\">0</p></body></html>";

let previousData: string = "";

async function fetchControllerData(): Promise<void> {
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