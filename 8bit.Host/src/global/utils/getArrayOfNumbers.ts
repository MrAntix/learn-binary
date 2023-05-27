/**
 * get an array of contiguous number
 *
 * @param count number of elements
 * @returns an array of contiguous number
 */
export const getArrayOfNumbers: (count: number) => number[]
    = count => [...Array(count)].map((_, i) => i);
