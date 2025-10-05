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