/**
 * Convert a binary array onto decimal
 * 
 * @param value an array binary, 1's and 0's
 * @returns a decimal
 */
export const toDecimal: (value: (0 | 1)[]) => number
    = value => {

        return value.reduce(
            (t, b, i) => t + (b === 1 ? Math.pow(2, value.length - 1 - i) : 0),
            0
        );
    };
