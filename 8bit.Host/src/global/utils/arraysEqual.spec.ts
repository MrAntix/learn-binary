import { arraysEqual } from './arraysEqual';

describe('arraysEqual', () => {
    test('should return true for equivalent arrays', () => {
        expect(arraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
        expect(arraysEqual(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true);
        expect(arraysEqual([[1, 2], [3, 4]], [[1, 2], [3, 4]])).toBe(true);
        expect(arraysEqual([], [])).toBe(true);
        expect(arraysEqual([null], [null])).toBe(true);
        expect(arraysEqual([undefined], [undefined])).toBe(true);
    });

    test('should return false for non-equivalent arrays', () => {
        expect(arraysEqual([1, 2, 3], [1, 2, 4])).toBe(false);
        expect(arraysEqual(['a', 'b', 'c'], ['a', 'b', 'd'])).toBe(false);
        expect(arraysEqual([[1, 2], [3, 4]], [[1, 2], [4, 3]])).toBe(false);
        expect(arraysEqual([1, 2, 3], [1, 2])).toBe(false);
        expect(arraysEqual(['a', 'b', 'c'], ['a', 'b'])).toBe(false);
        expect(arraysEqual([null], [undefined])).toBe(false);
        expect(arraysEqual([undefined], [null])).toBe(false);
        expect(arraysEqual([1, 2, 3], ['1', '2', '3'])).toBe(false);
        expect(arraysEqual(['a', 'b', 'c'], [97, 98, 99])).toBe(false);
        expect(arraysEqual([[1, 2], [3, 4]], ['[1,2]', '[3,4]'])).toBe(false);
    });

    test('should return true for identical references', () => {
        const a = [1, 2, 3];
        const b = a;
        expect(arraysEqual(a, b)).toBe(true);
    });

    test('should return false for different types other than numbers and strings', () => {
        // do not allow for other types to be equivalent
        expect(arraysEqual([], null!)).toBe(false);
        expect(arraysEqual([], undefined!)).toBe(false);
        expect(arraysEqual(null!, undefined!)).toBe(false);
        expect(arraysEqual([true], [1])).toBe(false);
        expect(arraysEqual([false], [0])).toBe(false);
        expect(arraysEqual([{ a: 1 }], ['{"a":1}'])).toBe(false);
    });
});