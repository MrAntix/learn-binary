import { getArrayOfNumbers } from './getArrayOfNumbers';

describe('getArrayOfNumbers', () => {
    test('should return an empty array when count is zero', () => {
        expect(getArrayOfNumbers(0)).toEqual([]);
    });

    test('should return an array of contiguous numbers starting from zero when count is positive', () => {
        expect(getArrayOfNumbers(3)).toEqual([0, 1, 2]);
        expect(getArrayOfNumbers(5)).toEqual([0, 1, 2, 3, 4]);
    });

    test('should throw an error when count is negative', () => {
        expect(() => getArrayOfNumbers(-1)).toThrow();
        expect(() => getArrayOfNumbers(-3)).toThrow();
    });
});
