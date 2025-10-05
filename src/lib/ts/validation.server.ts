import { error } from "@sveltejs/kit";
import type { IsUnion, Last, Tail } from "$lib/ts/helper";

export type BasicValidator = 'number' | 'string' | 'boolean';
export type ObjectValidator = { [Key: string]: Validator };
export type CustomValidator<T = any> = { 
    validate: (value: unknown, context: string) => T,
    typeName: string };

export type Validator = BasicValidator | ObjectValidator | CustomValidator<any>;

type BasicToType<T extends BasicValidator> = 
    T extends 'number' ? number :
    T extends 'string' ? string :
    T extends 'boolean' ? boolean :
    never;

type ObjectToType<T extends ObjectValidator> = { -readonly [K in keyof T]: ToType<T[K]> };

type CustomToType<T extends CustomValidator<any>> = T extends CustomValidator<infer U> ? U : never;

export type ToType<T extends Validator> = 
    T extends BasicValidator ? BasicToType<T> :
    T extends ObjectValidator ? ObjectToType<T> :
    T extends CustomValidator ? CustomToType<T> :
    never;

export function throwTypeError(context: string, expected: string): never {
    error(400, `Value ${context} has invalid type. Expected: ${expected}.`);
}

type BasicTypes = number | string | boolean;

type BasicToValidator<T extends BasicTypes> = 
    T extends number ? 'number' :
    T extends string ? 'string' : 'boolean';

type ObjectToValidator<T extends object> = { [K in keyof T]-?: ToValidator<T[K]> };

/**
 * Converts any type into a corresponding validator type.
 */
export type ToValidator<T> =
    [boolean, T] extends [T, boolean] ? 'boolean' | CustomValidator<boolean> :
    IsUnion<T, CustomValidator<T>, 
        T extends any[] ? CustomValidator<T> : 
        T extends object ? ObjectToValidator<T> | CustomValidator<T> :
        T extends BasicTypes ? BasicToValidator<T> | CustomValidator<T> :
        CustomValidator<T>>;

function getObjectValidatorTypeName(validator: ObjectValidator): string {
    let fields = '';
    let first = true;
    for (const key in validator) {
        if (!first) {
            fields += ', ';
        }
        first = false;
        fields += `${key}: ${getValidatorTypeName(validator[key])}`;
    }
    return `{${fields}}`;
}

function getValidatorTypeName(validator: Validator): string {
    if (typeof validator === 'object') {
        if (typeof validator['validate'] === 'function') {
            return (validator as CustomValidator).typeName;
        } else {
            return getObjectValidatorTypeName(validator as ObjectValidator);
        }
    } else {
        return validator;
    }
}

/**
 * Validates a basic type.
 * @param value Value to validate
 * @param validator Validator
 * @param context Context, ie. name of the validated value
 * @returns Validated value
 */
export function validateBasic<T extends BasicValidator>(value: unknown, validator: T, context: string): BasicToType<T> {
    if (typeof(value) === validator) return value as BasicToType<T>;
    throwTypeError(context, validator);
}

/**
 * Validates an object type.
 * @param value Value to validate
 * @param validator Validator
 * @param context Context, ie. name of the validated value
 * @returns Validated value
 */
export function validateObject<T extends ObjectValidator>(value: unknown, validator: T, context: string): ObjectToType<T> {
    if (typeof value !== 'object') {
        throwTypeError(context, getObjectValidatorTypeName(validator));
    }
    let result = {} as ObjectToType<T>;
    for (const key in validator) {
        result[key] = validate((value as Record<string, any>)[key], validator[key], `${context}.${key}`);
    }
    return result;
}

/**
 * Validates any value using a custom validator.
 * @param value Value to validate
 * @param validator Validator
 * @param context Context, ie. name of the validated value
 * @returns Validated value
 */
export function validateCustom<T extends CustomValidator>(value: unknown, validator: T, context: string): CustomToType<T> {
    return validator.validate(value, context);
}

/**
 * Validates JSON data from request's body
 * @param request Request to validate
 * @param validator Validator
 * @returns Validated value
 */
export async function validateRequestJSON<T extends Validator>(request: Request, validator: T): Promise<ToType<T>> {
    let json: unknown;
    try {
        json = await request.json();
    } catch (err: unknown) {
        if (err instanceof SyntaxError) {
            error(400, 'Invalid JSON data.');
        } else {
            throw err;
        }
    }
    return validate(json, validator, 'body JSON');
}

/**
 * Validates any value.
 * @param value Value to validate
 * @param validator Validator
 * @param context Context, ie. name of the validated value
 * @returns Validated value
 */
export function validate<T extends Validator>(value: unknown, validator: T, context: string): ToType<T> {
    if (typeof validator === 'object') {
        if (typeof validator['validate'] === 'function') {
            return validateCustom(value, validator as CustomValidator, context);
        } else {
            return validateObject(value, validator as ObjectValidator, context) as ToType<T>;
        }
    } else {
        return validateBasic(value, validator, context) as ToType<T>;
    }
}

/**
 * Validates values from `URLSearchParams`.
 * @param params Params to validate
 * @param validator Validator
 * @returns Validated value
 */
export function validateURLParams<T extends ObjectValidator>(params: URLSearchParams, validator: T): ToType<T> {
    const object: Record<string, string> = {};
    for (const key in validator) {
        const value = params.getAll(key);
        if (value.length > 0) object[key] = value.join(',');
    }
    return validate(object, validator, 'URLSearchParams');
}

/**
 * Creates a custom validator accept `undefined` values. 
 * @param validator Validator to modify
 * @returns Modified validator
 */
export function makeOptional<T extends Validator>(validator: T): CustomValidator<ToType<T> | undefined> {
    return {
        validate(this: CustomValidator<T>, value, context) {
            if (value === undefined) return undefined;
            try {
                return validate(value, validator, context);
            } catch {
                throwTypeError(context, this.typeName);
            }
        },
        typeName: getValidatorTypeName(validator) + ' | undefined'
    }
}

type MakeUnion<T extends readonly Validator[]> = T['length'] extends 0 ? never : ToType<T[0]> | MakeUnion<Tail<T>>;

/**
 * Combines multiple validator into one for validating union types.
 * @param validators Array of validators
 * @returns Validator for union types
 */
export function makeUnion<T extends Validator[]>(...validators: T): CustomValidator<MakeUnion<T>> {
    return {
        validate(value, context) {
            for (const validator of validators) {
                try {
                    return validate(value, validator, context);
                } catch {}
            }
            throwTypeError(context, this.typeName);
        },
        typeName: validators.map(v => getValidatorTypeName(v)).join(' | ')
    }
}

type ToTupleType<T extends readonly Validator[]> = T['length'] extends 0 ? [] : [ToType<T[0]>, ...ToTupleType<Tail<T>>];

/**
 * Creates a validator for tuple types.
 * @param validators Array of validator for each tuple lement
 * @returns Validator for tuple types
 */
export function makeTuple<T extends Validator[]>(...validators: T): CustomValidator<ToTupleType<T>> {
    return {
        validate(value, context) {
            if (!Array.isArray(value) || value.length !== validators.length) throwTypeError(context, this.typeName);

            let result = [];
            for (let i = 0; i < validators.length; i++) {
                result.push(validate(value[i], validators[i], context + `[${i}]`));
            }
            return result as ToTupleType<T>;
        },
        typeName: `[${validators.map(v => getValidatorTypeName(v)).join(', ')}]`
    }
}

/**
 * Creates a validator for enums
 * @param values List of valid values
 * @returns Validator
 */
export function makeValueTuple<T>(...values: T[]): CustomValidator<T> {
    return {
        validate(value, context) {
            for (const valid of values) {
                if (value === valid) return value as T;
            }

            throwTypeError(context, this.typeName)
        },
        typeName: `(one of: ${values.join(', ')})`
    }
}

/**
 * Creates a validator for an array of given type
 * @param validator Validator for a single array element
 * @returns Validator for array of `T`
 */
export function makeArray<T extends Validator>(validator: T): CustomValidator<ToType<T>[]> {
    return {
        validate(value, context) {
            if (!Array.isArray(value)) throw throwTypeError(context, this.typeName);

            const result = new Array<ToType<T>>();

            for (let i = 0; i < value.length; i++) {
                result.push(validate(value[i], validator, context + `[${i}]`));
            }
            return result;
        },
        typeName: `${getValidatorTypeName(validator)}[]`
    }
}

/**
 * Creates a complex validator for number.
 * @param min Minimum allowed value (inclusive)
 * @param max Maximum allowed value (inclusive)
 * @param requireInt Is the number required to be an integer
 * @returns Numeric validator
 */
export function makeNumericValidator(min: number, max: number, requireInt: boolean): CustomValidator<number> {
    return {
        validate(value, context) {
            if (typeof value !== 'number') throwTypeError(context, this.typeName);
            if (requireInt && Math.floor(value) !== value) throwTypeError(context, this.typeName);
            if (value < min || value > max) throwTypeError(context, this.typeName);
            return value;
        },
        typeName: `${requireInt ? 'Integer' : 'Number'} in range [${min}; ${max}].`
    }
}

/**
 * Constructs a validator from multiple other validators, requiring all of them to be satisfied.
 * @param validators List of required validators
 * @returns Chained validators
 */
export function chain<T extends readonly Validator[]>(...validators: T): CustomValidator<ToType<Last<T>>> {
    return {
        validate(value, context) {
            let result: any = value;
            for (const validator of validators) {
                result = validate(result, validator, context);
            }
            return result;
        },
        typeName: validators.map(v => getValidatorTypeName(v)).join(', ')
    }
}

/**
 * Validator that splits comma-separated strings into an array of strings.
 */
export const split: CustomValidator<any[]> = {
    validate(value, context) {
        if (typeof value !== 'string') throwTypeError(context, this.typeName);
        return value.split(',');
    },
    typeName: 'comma-separated string'
}

/**
 * Validator that parses strings into integers.
 */
export const intParser: CustomValidator<number> = {
    validate(value, context) {
        if (typeof value !== 'string') throwTypeError(context, this.typeName);
        const number = parseInt(value);
        if (isNaN(number)) throwTypeError(context, this.typeName);
        return number;
    },
    typeName: 'int string'
}

/**
 * Validator that only allows integers
 */
export const intValidator = makeNumericValidator(-Infinity, Infinity, true);

/**
 * Validator that parses strings into floating point numbers.
 */
export const floatParser: CustomValidator<number> = {
    validate(value, context) {
        if (typeof value !== 'string') throwTypeError(context, this.typeName);
        const number = parseFloat(value);
        if (isNaN(number)) throwTypeError(context, this.typeName);
        return number;
    },
    typeName: 'float string'
}

/**
 * Validator that only allows null values
 */
export const nullValidator: CustomValidator<null> = {
    validate(value, context) {
        if (value === null) return null;
        throwTypeError(context, this.typeName);
    },
    typeName: 'null'
}