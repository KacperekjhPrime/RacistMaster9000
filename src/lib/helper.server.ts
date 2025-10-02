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
    reaceStart: boolean; // Is the race started
    hasStarted: boolean; // The start photocell tripped
    hasFinished: boolean; // The finish photocell tripped
}

function getContentsOfElement(input: string, element: string): string {
    const firstElement = `<${element}>`;
    const startIndex = input.indexOf(firstElement);
    const endIndex = input.lastIndexOf(`</${element}>`);
    return input.substring(startIndex + firstElement.length - 1, endIndex);
}

function getRows(input: string): Array<string> {
    const bodyContent = getContentsOfElement(input, "body");
    const paragraphs = bodyContent.split("\n");

    let output: Array<string> = [];
    for(const paragraph of paragraphs) {
        output.push(getContentsOfElement(paragraph, "p"));
    }

    return output;
}

// Parses into miliseconds
function parseTime(input: string): number {
    const time = input.substring(2, input.length);
    const parts = time.split("_").reverse();

    let weights = [1, 1000, 60000, 3600 * 1000];
    let sum: number = 0;
    for(let i = 0; i < parts.length; i++) {
        sum += parseInt(parts[0].match("/[\d]+/")![0]) * weights[i];
    }

    return sum;
}

function parseData(input: string): ControllerData {
    const rows = getRows(input);
    const time = parseTime(rows[TimerIndex]);
    const remainingLaps = 
}