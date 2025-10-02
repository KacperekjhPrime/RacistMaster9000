// Indexes of elements returned from the controller box
const NumberOfLapsIndex = 0;
const LapCountersStartIndex = 1; // Starting index of remaining lap counters
const LapCountersCount = 10; // The number of above mentioned counters
const TimerIndex = 11; // Total time of a run
const RunStartIndex = 12; // Button for start pressed
const StartPhoto = 13; // Starting photocell
const LapPhoto = 14; // Lap photocell
const FinishPhoto = 15; // Finish photocell

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
    const regex = RegExp(`<${element}(?:[^>]*?)>(.*?)<\/${element}>`);
    return input.match(regex)![1];
}

function getRows(input: string): Array<string> {
    const bodyContent = getContentsOfElement(input, "body");
    const regex = RegExp("<(?:[^>]*?)>(.*?)<\/(?:[^>]*?)>");
    const paragraphs = bodyContent.split(regex);

    let output: Array<string> = [];
    for(const paragraph of paragraphs!) {
        if(paragraph == "") continue;
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

export default function parseData(input: string): ControllerData {
    const rows = getRows(input);
    const time = parseTime(rows[TimerIndex]);
    const remainingLaps = getRemainingLaps([...rows.slice(LapCountersStartIndex, LapCountersCount + LapCountersStartIndex)])

    return {
        numberOfLaps: parseInt(rows[NumberOfLapsIndex]),
        lapsLeft: remainingLaps,
        timeMs: time,
        hasStarted: getBoolean(rows[RunStartIndex]),
        startTripped: getBoolean(rows[StartPhoto]),
        lapTripped: getBoolean(rows[LapPhoto]),
        finishTripped: getBoolean(rows[FinishPhoto])
    }
}