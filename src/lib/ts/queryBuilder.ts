import { db } from "./database.server";
import type { Database } from "./databaseSchema.server";
import type { Tail, TryIndex } from "./helper";

export type Tables = keyof Database;

// Key manipulation types
type Stringable = string | number | boolean | bigint | null;
type Opt<T> = T | '';
type ToString<T> = T extends Stringable ? T : '';
type As = 'as' | 'AS' | 'As' | 'aS';
type AsFull = ` ${As} ${string}`;
type RawKeyToComplex<T> = `${ToString<T>}${Opt<AsFull>}` | `"${ToString<T>}"${Opt<AsFull>}`;
type RawKeyToBasic<T> = ToString<T> | `"${ToString<T>}"`;
type ComplexKeyToSimple<T> = T extends `${Opt<'"'>}${infer Key}${Opt<'"'>}${AsFull}` ? Key : T;
type ComplexKeyToAlias<T> = T extends `${string} ${As} ${infer Alias}` ? Alias : T;
type BasicKeyToRaw<T> = T extends `${Opt<'"'>}${infer Key}${Opt<'"'>}` ? Key : T;

type RawKeyOf<Table extends Tables> = keyof Database[Table];
export type BasicKeyOf<Table extends Tables> = keyof { [K in RawKeyOf<Table> as RawKeyToBasic<K>]: unknown };
export type ComplexKeyOf<Table extends Tables> = keyof { [K in RawKeyOf<Table> as RawKeyToComplex<K>]: unknown };

type FieldsOf<Table extends Tables, Keys extends readonly ComplexKeyOf<Table>[]> = 
    Keys['length'] extends 0 ? {} : { [K in Keys[0] as ComplexKeyToAlias<K>]: TryIndex<Database[Table], ComplexKeyToSimple<Keys[0]>> } & FieldsOf<Table, Tail<Keys>>;

    
class SelectQueryBuilder<T, Fields> {
    #from: string;
    #keys: string[];
    #joins: { table: string, using: string }[] = []
    #where = '';
    #orderBy = '';

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
    join<Table extends Tables, Keys extends ComplexKeyOf<Table>[], Using extends keyof Database[Table] & keyof T>(table: Table, keys: Keys, using: Using) {
        this.#keys.push(...keys.map(k => `${table}.${k as string}`));
        this.#joins.push({ table, using: using as string });
        return this as SelectQueryBuilder<T & Database[Table], Fields & FieldsOf<Table, Keys>>;
    }

    /**
     * Adds a WHERE clause to the query. Adding multiple conditions using this function will automatically concat them using AND operator.
     * @param condition Condition to use in the query
     * @returns this
     */
    where(condition: string) {
        if (this.#where.length > 0) {
            this.#where += ' AND';
        } else {
            this.#where = ' WHERE'
        }
        this.#where += ' ' + condition;
        return this;
    }

    /**
     * Adds an ORDER BY clause to the query.
     * @param column Column to order by
     * @param ascending If true, the results will be sorted in ascending order, otherwise in descending
     */
    orderBy(column: string, ascending: boolean) {
        this.#orderBy = ` ORDER BY ${column} ${ascending ? 'ASC' : 'DESC'}`;
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
        statement += this.#orderBy;
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
 * Creates a SelectQueryBuilder object
 * @param from Table that the query will select from
 * @param keys Columns that the query will select
 * @returns An instance of SelectQueryBuilder
 */
export function select<Table extends Tables, Keys extends ComplexKeyOf<Table>[]>(from: Table, keys: Keys) {
    return new SelectQueryBuilder<Database[Table], FieldsOf<Table, Keys>>(from, keys);
}

class InsertQueryBuilder<Table extends Tables, Values extends any[]> {
    #table: string;
    #keys: BasicKeyOf<Table>[];

    constructor(table: Table, keys: BasicKeyOf<Table>[]) {
        this.#table = table;
        this.#keys = keys;
    }

    /**
     * Creates an SQL statement string
     * @returns Statement string
     */
    toString() {
        return `INSERT INTO ${this.#table} (${this.#keys.join(',')}) VALUES (${this.#keys.map(v => '?').join(',')})`
    }

    /**
     * Prepares an SQL statement
     * @returns Prepared statement
     */
    prepare() {
        const statement = db.prepare<Values>(this.toString());
        return statement;
    }
}

type BasicKeysToColumnTypeTuple<Table extends Tables, Keys extends readonly BasicKeyOf<Table>[]> =
    Keys['length'] extends 0 ? [] : [TryIndex<Database[Table], BasicKeyToRaw<Keys[0]>>, ...BasicKeysToColumnTypeTuple<Table, Tail<Keys>>];

/**
 * Creates an InsertQueryBuilder object
 * @param table Table that the query will insert into
 * @param keys Columns that the query will set the values of
 * @returns An instance of InsertQueryBuilder
 */ 
export function insert<Table extends Tables, Keys extends BasicKeyOf<Table>[]>(table: Table, keys: Keys) {
    return new InsertQueryBuilder<Table, BasicKeysToColumnTypeTuple<Table, Keys>>(table, keys);
}

class UpdateQueryBuilder<Table extends Tables, Values extends any[]> {
    #table: string;
    #keys: BasicKeyOf<Table>[];
    #where = '';

    constructor(table: Table, keys: BasicKeyOf<Table>[]) {
        this.#table = table;
        this.#keys = keys;
    }

    /**
     * Adds a WHERE clause to the query. Adding multiple conditions using this function will automatically concat them using AND operator.
     * @param condition Condition to use in the query
     * @returns this
     */
    where(condition: string) {
        if (this.#where.length > 0) {
            this.#where += ' AND';
        } else {
            this.#where = ' WHERE'
        }
        this.#where += ' ' + condition;
        return this;
    }

    /**
     * Creates an SQL statement string
     * @returns Statement string
     */
    toString() {
        return `UPDATE ${this.#table} SET ${this.#keys.map(v => `${v as string} = ?`).join(', ')}` + this.#where;
    }

    /**
     * Prepares an SQL statement
     * @returns Prepared statement
     */
    prepare<T extends any[]>() {
        const statement = db.prepare<[...Values, ...T]>(this.toString());
        return statement;
    }
}

/**
 * Creates an UpdateQueryBuilder object
 * @param table Table that the query will update
 * @param keys Columns that the query will set the values of
 * @returns An instance of UpdateQueryBuilder
 */ 
export function update<Table extends Tables, Keys extends BasicKeyOf<Table>[]>(table: Table, keys: Keys) {
    return new UpdateQueryBuilder<Table, BasicKeysToColumnTypeTuple<Table, Keys>>(table, keys);
}