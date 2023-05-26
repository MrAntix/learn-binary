import { toBinaryArray } from './toBinaryArray';

describe('toBinaryArray', () => {
    it('should convert a decimal value to a binary array of given length', () => {
        expect(toBinaryArray(0, 4)).toEqual([0, 0, 0, 0]);
        expect(toBinaryArray(1, 4)).toEqual([0, 0, 0, 1]);
        expect(toBinaryArray(15, 4)).toEqual([1, 1, 1, 1]);
        expect(toBinaryArray(255, 8)).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
        expect(toBinaryArray(170, 8)).toEqual([1, 0, 1, 0, 1, 0, 1, 0]);
        expect(toBinaryArray(85, 8)).toEqual([0, 1, 0, 1, 0, 1, 0, 1]);
        expect(toBinaryArray(42)).toEqual([0, 0, 1, 0, 1, 0, 1, 0]);
        expect(toBinaryArray(21)).toEqual([0, 0, 0, 1, 0, 1, 0, 1]);
        expect(toBinaryArray(10)).toEqual([0, 0, 0, 0, 1, 0, 1, 0]);
        expect(toBinaryArray(5)).toEqual([0, 0, 0, 0, 0, 1, 0, 1]);
        expect(toBinaryArray(2)).toEqual([0, 0, 0, 0, 0, 0, 1, 0]);
    });

    it('should throw an error if the value is less than zero', () => {
        expect(() => toBinaryArray(-1)).toThrowError('value cannot be less than 0');
        expect(() => toBinaryArray(-10)).toThrowError('value cannot be less than 0');
        expect(() => toBinaryArray(-100)).toThrowError('value cannot be less than 0');
    });

    it('should throw an error if the value is too big for the array length', () => {
        expect(() => toBinaryArray(16, 3)).toThrowError('value is too big for the array length');
        expect(() => toBinaryArray(256, 7)).toThrowError('value is too big for the array length');
        expect(() => toBinaryArray(1024, 9)).toThrowError('value is too big for the array length');
    });
});
