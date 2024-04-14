/**
 * An object is parsable
 */
export type IParsable = {
    [key: string]: unknown | IParsable;
};
