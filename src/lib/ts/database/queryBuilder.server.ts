import BSQL3 from 'better-sqlite3';
import { db } from "./database.server";
import type { Database } from "./databaseSchema.server";
import type { Tail, ToString, TryIndex } from "$lib/ts/helper";
import type { DatabaseFunctions } from "./builtinDatabaseFunction.server";

export type Tables = keyof Database;

// Key manipulation types

type Opt<T> = T | '';
type As = 'as' | 'AS' | 'As' | 'aS';
type AsFull = ` ${As} ${string}`;
type RawKeyToComplex<T> = `${Opt<string>}${ToString<T> | `"${ToString<T>}"` | `${keyof DatabaseFunctions}(${string})`}${Opt<AsFull>}`
type RawKeyToBasic<T> = ToString<T> | `"${ToString<T>}"`;
type ComplexKeyToRaw<T> = T extends `${Opt<'"'>}${infer Key}${Opt<'"'>}${AsFull}` ? Key : T;
type ComplexKeyToAlias<T> = T extends `${string} ${As} ${infer Alias | `"${infer Alias}"`}` ? Alias : T;
type BasicKeyToRaw<T> = T extends `${Opt<'"'>}${infer Key}${Opt<'"'>}` ? Key : T;

type RawKeyOf<Table extends Tables> = keyof Database[Table];
export type BasicKeyOf<Table extends Tables> = keyof { [K in RawKeyOf<Table> as RawKeyToBasic<K>]: unknown };
export type ComplexKeyOf<Table extends Tables> = keyof { [K in RawKeyOf<Table> as RawKeyToComplex<K>]: unknown };

type ComplexKeyToType<Table extends Tables, Key extends ComplexKeyOf<Table>> = Key extends `${infer Fn}(${string})${Opt<AsFull>}`
    ? TryIndex<DatabaseFunctions, Fn, unknown>
    : TryIndex<Database[Table], ComplexKeyToRaw<Key>>;

type FieldsOf<Table extends Tables, Keys extends readonly ComplexKeyOf<Table>[]> = 
    Keys['length'] extends 0 ? {} : { [K in Keys[0] as ComplexKeyToAlias<K>]: ComplexKeyToType<Table, Keys[0]> } & FieldsOf<Table, Tail<Keys>>;

    
class SelectQueryBuilder<T, Fields> {
    #from: string;
    #keys = new Array<string>();
    #joins: { table: string, using: string }[] = []
    #where = '';
    #groupBy = '';
    #orderBy = '';

    #addKeys(table: string, keys: string[]) {
        this.#keys.push(...keys.map(k => k.includes('(') ? k : `${table}.${k}`));
    }

    constructor(from: string, keys: string[]) {
        this.#from = from;
        this.#addKeys(from, keys);
    }

    /**
     * Adds a JOIN clause to the query.
     * @param table Table to join
     * @param keys Columns to select from the joined table
     * @param using Column that will be used as join constraint
     * @returns this
     */
    join<Table extends Tables, Keys extends ComplexKeyOf<Table>[], Using extends keyof Database[Table] & keyof T>(table: Table, keys: Keys, using: Using) {
        this.#addKeys(table, keys);
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
     * Adds a GROUP BY clause to the query.
     * @param key Column to group by
     */
    groupBy(key: RawKeyToBasic<keyof T>) {
        this.#groupBy = ` GROUP BY ${key}`;
        return this;
    }

    /**
     * Adds an ORDER BY clause to the query.
     * @param column Column to order by
     * @param ascending If true, the results will be sorted in ascending order, otherwise in descending
     */
    orderBy(column: RawKeyToComplex<keyof T | keyof Fields>, ascending: boolean) {
        this.#orderBy = ` ORDER BY ${column} ${ascending ? 'ASC' : 'DESC'}`;
        return this;
    }

    /**
     * Creates an SQL statement string
     * @returns Statement string
     */
    toString() {
        if (this.#keys.length === 0) throw new Error(`Cannot create a SELECT statement with no columns.`);
        let statement = `SELECT ${this.#keys.join(', ')} FROM ${this.#from}`;
        for (const { table, using } of this.#joins) {
            statement += ` JOIN ${table} USING (${using})`;
        }
        statement += this.#where;
        statement += this.#groupBy;
        statement += this.#orderBy;
        return statement;
    }

    /**
     * Prints the contents of the statement to the console.
     */
    debug() {
        console.log(this.toString());
        return this;
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
    * Prints the contents of the statement to the console.
    */
    debug() {
        console.log(this.toString());
        return this;
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

class UpdateQueryBuilder<Table extends Tables, Values extends any[], ToBind extends any[] = []> {
    #table: string;
    #keys: BasicKeyOf<Table>[];
    #values = new Array<any>();
    #where = '';

    constructor(table: Table, keys: BasicKeyOf<Table>[]) {
        this.#table = table;
        this.#keys = keys;
    }

    /**
     * Adds a constant value to update a given column to. Using this function will make it a requirement to pass all values to all previous columns
     * during prepare()
     * @param key Column to update
     * @param value Value to set
     * @returns this
     */
    addConstant<Key extends BasicKeyOf<Table>>(key: Key, value: TryIndex<Database[Table], BasicKeyToRaw<Key>>) {
        this.#keys.push(key);
        this.#values.push(value);
        return this as unknown as UpdateQueryBuilder<Table, Values, Values>;
    }

    /**
     * Amount of columns that will be modified by this statement
     */
    get affectedColumns(): number {
        return this.#keys.length;
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
    * Prints the contents of the statement to the console.
    */
    debug() {
        console.log(this.toString());
        return this;
    }

    /**
     * Prepares an SQL statement. Use `prepareConstant()` if `addConstant()` has been used prior to this function.
     * @returns Prepared statement
     */
    prepare<T extends any[]>() {
        if (this.#values.length > 0) throw new Error('prepare() cannot be used with constant values. Use prepareConstant() instead.');
        const statement = db.prepare<[...Values, ...T]>(this.toString());
        return statement;
    }

    /**
     * Prepares an SQL statement with constant values.
     * @param values Values to bind to the statement
     * @returns Prepared statement
     */
    prepareConstant<T extends any[]>(...values: [...Values, ...T]) {
        if (this.#values.length === 0) throw new Error('prepare() cannot be used with constant values. Use prepareConstant() instead.');
        const statement = db.prepare(this.toString());
        statement.bind(...this.#values, ...values);
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