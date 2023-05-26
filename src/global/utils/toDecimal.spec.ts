import { toDecimal } from './toDecimal';

describe('toDecimal', () => {
    it('should convert a binary array to a decimal number', () => {
        expect(toDecimal([0, 0, 0, 0, 0, 0, 0, 0])).toBe(0);
        expect(toDecimal([1, 1, 1, 1, 1, 1, 1, 1])).toBe(255);
        expect(toDecimal([1, 0, 0, 0, 0, 0, 0, 0])).toBe(128);
        expect(toDecimal([1, 1, 0, 1, 0, 1, 1])).toBe(107);
        expect(toDecimal([1, 1, 0, 1, 1])).toBe(27);
        expect(toDecimal([0, 0, 0, 1])).toBe(1);
        expect(toDecimal([1])).toBe(1);
        expect(toDecimal([0])).toBe(0);
        expect(toDecimal([])).toBe(0);
    });
});
