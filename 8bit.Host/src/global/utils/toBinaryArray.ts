import { bits } from '../bits';

/**
 * convert decimal to a binary array
 * 
 * @param value value to convert
 * @returns binary array
 */
export const toBinaryArray: (value: number, length?: number) => bits
    = (value, length = 8) => {
        if (value < 0) throw new Error('value cannot be less than 0');
        if (value > Math.pow(2, length)) throw new Error('value is too big for the array length');

        return [...Array(length)].map((_, i) => (value & Math.pow(2, length - 1 - i)) ? 1 : 0);
    };
