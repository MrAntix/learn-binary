/**
 * Schema parser interface.
 * 
 * to parse a value to another value.
 */
export type ISchemaParser<T>
    = (value: unknown) => T;
