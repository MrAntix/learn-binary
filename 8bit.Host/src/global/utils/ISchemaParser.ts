/**
 * Schema parser interface.
 * 
 * to parse a value to another value.
 */
export interface ISchemaParser {
    (value: unknown): unknown;
}
