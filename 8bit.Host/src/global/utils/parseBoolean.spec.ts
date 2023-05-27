import { parseBoolean } from './parseBoolean';

test('parseBoolean returns true for truthy values', () => {
    expect(parseBoolean(true)).toBe(true);
    expect(parseBoolean('true')).toBe(true);
    expect(parseBoolean('yes')).toBe(true);
    expect(parseBoolean('on')).toBe(true);
    expect(parseBoolean(1)).toBe(true);
    expect(parseBoolean('1')).toBe(true);
    expect(parseBoolean(2)).toBe(true);
});

test('parseBoolean returns false for other values', () => {
    expect(parseBoolean(false)).toBe(false);
    expect(parseBoolean('false')).toBe(false);
    expect(parseBoolean('no')).toBe(false);
    expect(parseBoolean('off')).toBe(false);
    expect(parseBoolean(0)).toBe(false);
    expect(parseBoolean('0')).toBe(false);
    expect(parseBoolean(-2)).toBe(false);
    expect(parseBoolean(null)).toBe(false);
    expect(parseBoolean(undefined)).toBe(false);
    expect(parseBoolean(NaN)).toBe(false);
    expect(parseBoolean('')).toBe(false);
    expect(parseBoolean('hello')).toBe(false);
    expect(parseBoolean({} as unknown as string)).toBe(false);
});
