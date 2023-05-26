import { ISchema } from './ISchema';

/**
 * Parses a JSON string with the given schema.
 * 
 * @param json      the JSON string to parse
 * @param schema    the schema to use
 * @returns         the parsed object T
 */
export const parse
    = <T>(json: string, schema: ISchema<T>) => {
        if (json == null) return null;

        const process: (o: unknown, schema: ISchema<unknown>) => unknown
            = (o, s) => Object.getOwnPropertyNames(o).reduce((c, n) => {

                const pn = o[n];
                const sn = s[n];

                if (typeof sn === 'function') c[n] = sn(pn);
                else if (typeof sn === 'object') c[n] = process(pn, sn);
                else c[n] = pn;

                return c;
            }, {});

        return process(JSON.parse(json), schema) as T;
    };
