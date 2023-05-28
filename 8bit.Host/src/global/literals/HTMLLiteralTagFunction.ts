import { HTMLLiteralResult } from './HTMLLiteralResult';

/**
 * HTML tag function
 */
export type HTMLLiteralTagFunction = {
    (strings: TemplateStringsArray, ...values: unknown[]): HTMLLiteralResult;
};
