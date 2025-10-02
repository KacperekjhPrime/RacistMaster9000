import { db } from "./database.server";
import type { Database } from "./databaseSchema.server";

type Tail<T extends any[]> = T extends [infer _, ...infer R] ? R : never;
type Tables = keyof Database;


// Key manipulation types
type Stringable = string | number | boolean | bigint | null;
type Opt<T> = T | '';
type ToString<T> = T extends Stringable ? T : '';
type As = 'as' | 'AS' | 'As' | 'aS';
type AsFull = ` ${As} ${string}`;
type SimpleKeyToComplex<T> = `${ToString<T>}${Opt<AsFull>}`;
type ComplexKeyToSimple<T extends string> = T extends `${infer Key}${AsFull}` ? Key : T;
type ComplexKeyToAlias<T extends string> = T extends `${string} ${As} ${infer Alias}` ? Alias : T;

type KeysOf<Table extends Tables> = keyof { [K in keyof Database[Table] as SimpleKeyToComplex<K>]: unknown };

type TryIndex<T, K> = K extends keyof T ? T[K] : never;

type FieldsOf<Table extends Tables, Keys extends KeysOf<Table>[]> = 
    Keys['length'] extends 0 ? {} : { [K in Keys[0] as ComplexKeyToAlias<K>]: TryIndex<Database[Table], ComplexKeyToSimple<Keys[0]>> } & FieldsOf<Table, Tail<Keys>>;

    
class QueryBuilder<T, Fields> {
    #from: string;
    #keys: string[];
    #joins: { table: string, using: string }[] = []
    #where = '';

    constructor(from: string, keys: string[]) {
        this.#from = from;
        this.#keys = keys.map(k => `${from}.${k}`);
    }

    /**
     * Adds a JOIN clause to the query.
     * @param table Table to join
     * @param keys Columns to select from the joined table
     * @param using Column that will be used as join constraint
     * @returns this
     */
    join<Table extends Tables, Keys extends KeysOf<Table>[], Using extends keyof Database[Table] & keyof T>(table: Table, keys: Keys, using: Using) {
        this.#keys.push(...keys.map(k => `${table}.${k as string}`));
        this.#joins.push({ table, using: using as string });
        return this as QueryBuilder<T & Database[Table], Fields & FieldsOf<Table, Keys>>;
    }

    /**
     * Adds a WHERE clause to the query. Adding multiple conditions using this function will automatically concat them using AND operator.
     * @param condition Condition to use in the query
     * @returns this
     */
    where(condition: string) {
        if (this.#where.length > 0) {
            this.#where += ' AND';
        }
        this.#where += ' ' + condition;
        return this;
    }

    /**
     * Creates an SQL statement string
     * @returns Statement string
     */
    toString() {
        let statement = `SELECT ${this.#keys.join(', ')} FROM ${this.#from}`;
        for (const { table, using } of this.#joins) {
            statement += ` JOIN ${table} USING (${using})`;
        }
        statement += this.#where;
        return statement;
    }

    /**
     * Prepares an SQL statement
     * @returns Prepared statement
     */
    prepare<Params extends any[] = []>() {
        const statement = db.prepare<Params, Fields>(this.toString());
        return statement;
    }
}

/**
 * Creates a QueryBuilder object
 * @param from Table that the query will select from
 * @param keys Columns that the query will select
 * @returns An instance of QueryBuilder
 */
export function select<Table extends Tables, Keys extends KeysOf<Table>[]>(from: Table, keys: Keys):
    QueryBuilder<Database[Table], FieldsOf<Table, Keys>> {
    
    return new QueryBuilder<Database[Table], FieldsOf<Table, Keys>>(from, keys);
}