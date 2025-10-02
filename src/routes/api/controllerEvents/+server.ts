import type { ControllerData } from "$lib/helper.server";
import parseData from "$lib/helper.server";

const ControllerAddress: string = "192.168.0.1/awp/1/index.html";

const htmlString = "<html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=windows-1252\"><meta charset=\"utf-1\"><title>Pomiar czasu przejazdu ZSTiO Limanowa</title><style>:is([id*='google_ads_iframe'],[id*='taboola-'],.taboolaHeight,.taboola-placeholder,#top-ad,#credential_picker_container,#credentials-picker-container,#credential_picker_iframe,[id*='google-one-tap-iframe'],#google-one-tap-popup-container,.google-one-tap__module,.google-one-tap-modal-div,#amp_floatingAdDiv,#ez-content-blocker-container) {display:none!important;min-height:0!important;height:0!important;}</style></head><body><p class=\"main_lap_counter\">2</p><p class=\"lap_counter\">0</p><p class=\"lap_counter\">0</p><p class=\"lap_counter\">2</p><p class=\"lap_counter\">0</p><p class=\"lap_counter\">0</p><p class=\"lap_counter\">0</p><p class=\"lap_counter\">0</p><p class=\"lap_counter\">0</p><p class=\"lap_counter\">0</p><p class=\"lap_counter\">0</p><p class=\"lap_time\">T#1s_1ms</p><p class=\"lap_start\">0</p><p class=\"foto_0\">0</p><p class=\"foto_1\">0</p><p class=\"foto_2\">0</p><p class=\"time_0\">T#0ms</p><p class=\"time_1\">T#0ms</p><p class=\"time_3\">T#0ms</p><p class=\"race_configuration\">0</p></body></html>";

async function fetchControllerData(): Promise<ControllerData> {
    // const response = await fetch(ControllerAddress);
    // const result = await response.text();
    const data = parseData(htmlString);
    console.log(data);
    return data;
}

export function GET(): Response {
    return new Response(JSON.stringify(fetchControllerData()));
}