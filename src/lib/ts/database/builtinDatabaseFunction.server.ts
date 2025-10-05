import type { ToString } from "$lib/ts/helper"

type DatabaseFunctionsLowercase = {
    avg: number,
    count: number,
    group_concat: string,
    max: number,
    min: number,
    string_agg: string,
    sum: number,
    total: number
}

/**
 * List of SQLite functions and their return types.
 * If something, that you want to use, is missing, please add it to `DatabaseFunctionsLowercase`.
 */
export type DatabaseFunctions = DatabaseFunctionsLowercase & {
    [K in keyof DatabaseFunctionsLowercase as Uppercase<ToString<K>>]: DatabaseFunctionsLowercase[K]
}