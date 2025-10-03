/**
 * Removes the first element of a tuple type.
 */
export type Tail<T extends readonly any[]> = T extends readonly [infer _, ...infer Tail] ? Tail : never;

/**
 * Returns the last element of a tuple type.
 */
import BSQL3 from "better-sqlite3"
import { intParser, makeOptional, validateURLParams } from "./validation.server";
import { error } from "@sveltejs/kit";

export type Last<T extends readonly any[]> = T extends readonly [...infer _, infer Last] ? Last : never;

/**
 * Tries to index T using Key if possible, returns never if it's not possible.
 */
export type TryIndex<T, Key> = Key extends keyof T ? T[Key] : never;

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
 * Checks if URL parameters contain `id` and if so returns the result of `oneStatement`, otherwise returns results of `allStatement`.
 * @param params URL parameters
 * @param allStatement SQL prepared statement to use if `id` parameter is not present 
 * @param oneStatement SQL prepared statement to use if `id` parameter is present 
 * @returns Object or array of objects
 */
export function selectAllOrOne<T>(params: URLSearchParams, allStatement: BSQL3.Statement<[], T>, oneStatement: BSQL3.Statement<[number], T>): T | T[] {
    if (params.has('id')) {
        const { id } = validateURLParams(params, { id: intParser });
        const result = oneStatement.get(id);
        if (result === undefined) error(404);
        return result;
    } else {
        return allStatement.all();
    }
}