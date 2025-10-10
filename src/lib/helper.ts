import { RideEntryState } from "./ts/models/databaseModels";

// Indexes of elements returned from the controller box
const numberOfLapsIndex = 0;
const lapCountersStartIndex = 1; // Starting index of remaining lap counters
const lapCountersCount = 10; // The number of above mentioned counters
const timerIndex = 11; // Total time of a run
const runStartIndex = 12; // Button for start pressed
const startPhoto = 13; // Starting photocell
const lapPhoto = 14; // Lap photocell
const finishPhoto = 15; // Finish photocell

export type ControllerData = {
    numberOfLaps: number;
    lapsLeft: number;
    timeMs: number;
    hasStarted: boolean; // Is the run started
    startTripped: boolean; // The start photocell tripped
    lapTripped: boolean; // The lap photocell tripped
    finishTripped: boolean; // The finish photocell tripped
}

export type RunState = {
    runTime: number;
    runStatus: RideEntryState;
    totalLaps: number;
    lapsLeft: number;
    tournamentId: number | null;
    rideId: number | null;
}

// export const controllerAddress: string = "http://192.168.0.1/awp/1/index.html";
export const controllerAddress: string = "http://localhost:5173/";

function getContentsOfElement(input: string, element: string): string {
    const regex = RegExp(`<${element}(?:[^>]*?)>(.*?)<\/${element}>`, "s");
    return input.match(regex)![1];
}

function getRows(input: string): Array<string> {
    const bodyContent = getContentsOfElement(input, "body");
    const regex = RegExp("<(?:[^>]*?)>(.*?)<\/(?:[^>]*?)>");
    const paragraphs = bodyContent.split(regex);

    let output: Array<string> = [];
    for(const paragraph of paragraphs!) {
        if(paragraph == "" || paragraph.includes("\n")) continue;
        output.push(paragraph);
    }

    return output;
}

/**
 * Parses time from T#XXh_XXm_XXs_XXms format into milliseconds
 * @param input The time string
 * @returns Time in milliseconds
 */
function parseTime(input: string): number {
    const time = input.substring(2, input.length);
    const parts = time.split("_").reverse();

    let weights = [1, 1000, 60000, 3600 * 1000];
    let sum: number = 0;
    for(let i = 0; i < parts.length; i++) {
        sum += parseInt(parts[i].match(/[\d]+/)![0]) * weights[i];
    }

    return sum;
}

function getRemainingLaps(lapCounters: Array<string>): number {
    const counters = lapCounters.map(value => parseInt(value));
    return Math.max(...counters);
}

function getBoolean(input: string): boolean {
    return input !== "0";
}

export function parseData(input: string): ControllerData {
    const rows = getRows(input);
    const time = parseTime(rows[timerIndex]);
    const remainingLaps = getRemainingLaps([...rows.slice(lapCountersStartIndex, lapCountersCount + lapCountersStartIndex)])

    return {
        numberOfLaps: parseInt(rows[numberOfLapsIndex]),
        lapsLeft: remainingLaps,
        timeMs: time,
        hasStarted: getBoolean(rows[runStartIndex]),
        startTripped: getBoolean(rows[startPhoto]),
        lapTripped: getBoolean(rows[lapPhoto]),
        finishTripped: getBoolean(rows[finishPhoto])
    }
}

/**
 * Formats time from milliseconds into HH:MM:SS.MS
 * @param time Time in milliseconds
 * @returns The formatted time
 */
export function formatTime(time: number): string {
    let output = "";

    let hours = Math.floor(time / 3600000);
    time %= 3600000;
    let minutes = Math.floor(time / 60000);
    time %= 60000;
    let seconds = Math.floor(time / 1000);
    let milliseconds = time % 1000;

    if (hours > 0) {
        output += hours.toString().padStart(2, "0") + ":";
    }

    output += minutes.toString().padStart(2, "0") + ":";
    output += seconds.toString().padStart(2, "0") + ".";
    output += milliseconds.toString().padStart(3, "0");

    return output;
}

export async function fetchControllerData(controllerAddress: string): Promise<ControllerData> {
    const response = await fetch(controllerAddress);
    const result = await response.text();

    return parseData(result);
}

export function getRideState(data: ControllerData, currentState: RideEntryState): RideEntryState {
    if(data?.hasStarted && data.startTripped) return RideEntryState.InProgress;
    else if(data?.finishTripped && currentState == RideEntryState.InProgress) return RideEntryState.Finished;
    else if(!data?.hasStarted) return RideEntryState.NotStarted;
    
    if(currentState == RideEntryState.InProgress) return RideEntryState.InProgress;
    return RideEntryState.NotStarted;
}