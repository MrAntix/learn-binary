export const TRUE_VALUES = ['true', 'yes', 'on'];
export const FALSE_VALUES = ['false', 'no', 'off'];

/**
 * parse a value to a boolean
 *
 * @param value input
 * @returns true or false
 */
export const parseBoolean: (value: string | number | boolean | null | undefined) => boolean
    = value => {

        const s = String(value).toLowerCase();
        return Number(s) > 0 || TRUE_VALUES.includes(s);
    };
