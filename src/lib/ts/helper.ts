import type { RouteId } from "$app/types";

/**
 * Removes the first element of a tuple type.
 */
export type Tail<T extends readonly any[]> = T extends readonly [infer _, ...infer Tail] ? Tail : never;

/**
 * Returns the last element of a tuple type.
 */

export type Last<T extends readonly any[]> = T extends readonly [...infer _, infer Last] ? Last : never;

/**
 * Tries to index T using Key if possible, returns never if it's not possible.
 */
export type TryIndex<T, Key, Fallback = never> = Key extends keyof T ? T[Key] : Fallback;

/**
 * Converts an union type `(A | B)` into an intersection `(A & B)`
 */
export type UnionToIntersection<U> = 
    (U extends any ? (x: U)=>void : never) extends ((x: infer I)=>void) ? I : never

/**
 * Returns `IfTrue` if `T` is an intersection, otherwise returns `IfFalse`.
 * Keep in mind that TypeScript's `boolean` technically is an intersection of `true` and `false`
 */
export type IsUnion<T, IfTrue, IfFalse> = [T] extends [UnionToIntersection<T>] ? IfFalse : IfTrue;

/**
 * Asserts that type B extends from type A.
 * Does not do anything other than making the TypeScript compiler emit an error.
 */
export type Assert<A, B extends A> = B;

/**
 * Union of types that can be properly converted to string
 */
export type Stringable = string | number | boolean | bigint | null;

/**
 * Converts all stringable types to string, and all non-stringable into empty strings.
 */
export type ToString<T> = T extends `${Stringable}` ? T : '';

/**
 * Crates an union of T and Promise<T>
 */
export type MaybePromise<T> = Promise<T> | T;

/**
 * Creates a promise that never resolves
 */
export function createForeverPromise<T>(): Promise<T> {
    return new Promise<T>(() => {});
}

/**
 * Clones an object and removes given keys from it.
 * @param object Object to clone
 * @param keys Keys to remove
 * @returns Cloned object
 */
export function removeKeys<T extends object, Keys extends (keyof T)[]>(object: T, keys: Keys): Omit<T, Keys[number]> {
    const result = {...object};
    for (const key of keys) {
        delete result[key];
    }
    return result;
}

/**
 * Indices of elements returned from the controller box
 */
const numberOfLapsIndex = 0;

/**
 * Starting index of remaining lap counters
 */
const lapCountersStartIndex = 1;

/**
 * The number of above mentioned counters
 */
const lapCountersCount = 10;

/**
 * Total time of a run
 */
const timerIndex = 11;

/**
 * Button for start pressed
 */
const runStartIndex = 12;

/**
 * Starting photocell
 */
const startPhoto = 13;

/**
 * Lap photocell
 */
const lapPhoto = 14;

/**
 * Finish photocell
 */
const finishPhoto = 15;


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