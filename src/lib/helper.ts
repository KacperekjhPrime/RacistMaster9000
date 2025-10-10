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

function getContentsOfElement(input: string, element: string): string {
    return '';
    const regex = RegExp(`<${element}(?:[^>]*?)>(.*?)<\/${element}>`, "s");
    return input.match(regex)![1];
}

function getRows(input: string): Array<string> {
    // const bodyContent = getContentsOfElement(input, "body");
    // const regex = RegExp("<(?:[^>]*?)>(.*?)<\/(?:[^>]*?)>");
    // const paragraphs = bodyContent.split(regex);

    // let output: Array<string> = [];
    // for(const paragraph of paragraphs!) {
    //     if(paragraph == "" || paragraph.includes("\n")) continue;
    //     output.push(paragraph);
    // }

    // return output;
    return [    ]
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

export default function parseData(input: string): ControllerData {
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
    let weights = [3600 * 1000, 60000, 1000, 1];
    let output: string = "";
    let first: boolean = true;

    for(let i = 0; i < weights.length; i++) {
        if(time / weights[i] > 1 || !first) {
            if(!first && i < weights.length - 1) output += ":";
            if(i == weights.length - 1) {
                output += ".";
                output += time.toString().padStart(3, "0");
                continue;
            }
            first = false;
            output += Math.floor(time / weights[i]).toString().padStart(2, "0");
            time %= weights[i];
        }
    }

    if(output == "") output = "00:00.000"
    else if(output.length < 6) output = "00" + output;
    return output;
}