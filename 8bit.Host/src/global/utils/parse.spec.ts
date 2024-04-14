import { ISchema } from './ISchema';
import { parse } from './parse';

describe('parse', () => {

    it('should parse a string to a number', () => {
        interface T { a: number }

        const json = '{"a": "1"}';
        const schema: ISchema<T> = { a: v => Number.parseInt(String(v)) };

        const parsed = parse<T>(json, schema);

        expect(parsed?.a).toEqual(1);
    });

    it('should parse a string to a boolean', () => {
        interface T { a: boolean }

        const json = '{"a": "true"}';
        const schema: ISchema<T> = { a: v => v === 'true' };

        const parsed = parse<T>(json, schema);

        expect(parsed?.a).toEqual(true);
    });

    it('should parse a string to a Date', () => {
        interface T { a: Date }

        const json = '{"a": "2020-12-31T23:59:59.999Z"}';
        const schema: ISchema<T> = { a: v => new Date(String(v)) };

        const parsed = parse<T>(json, schema);

        expect(parsed?.a).toEqual(new Date('2020-12-31T23:59:59.999Z'));
    });

    it('should parse a string to an array of numbers', () => {
        interface T { a: number[] }

        const json = '{"a": ["1", "2", "3"]}';
        const schema: ISchema<T> = { a: v => (v as string[])?.map(n => parseInt(n)) };

        const parsed = parse<T>(json, schema);

        expect(parsed?.a).toEqual([1, 2, 3]);
    });

    it('should add other properties', () => {
        interface T { a: number, b: string }

        const json = '{"a": "1", "b": "2"}';
        const schema: ISchema<T> = { a: v => parseInt(v as string) };

        const parsed = parse<T>(json, schema);

        expect(parsed).toEqual({ a: 1, b: '2' });
    });

    it('should parse a nested schema', () => {
        interface T { a: { b: number }, c: number[] }

        const json = '{"a": {"b": "1"} }';
        const schema: ISchema<T> = {
            a: {
                b: v => parseInt(v as string)
            },
            c: v => (v as string[])?.map(n => parseInt(n))
        };

        const parsed = parse<T>(json, schema);

        expect(parsed?.a).toEqual({ b: 1 });
    });
});