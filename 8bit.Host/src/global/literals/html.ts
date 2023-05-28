import DOMPurify from 'dompurify';
import { HTMLLiteralResult } from './HTMLLiteralResult';
import { HTMLLiteralTagFunction } from './HTMLLiteralTagFunction';

/** 
 * a literal tag function for html with DOMPurify sanitization
 * 
 * @param strings the template strings
 * @param values the values to be inserted into the template
 * 
 * @example 
 * ```typescript
 * const values = [1,2,3,'<script>alert("boo")</script>'];
 * const result = html`<ul>${values.map(v => html`<li>${v}</li>`)}</ul>`;
 * ``` 
 * result => "<ul><li>1</li><li>2</li><li>3</li><li></li></ul>"
 */
export const html: HTMLLiteralTagFunction
    = (strings, ...values) => {

        const result = strings.reduce<unknown[]>((r, s, i) => {
            const value = values[i] ?? '';

            if (typeof value === 'string')
                return [...r, s, DOMPurify.sanitize(value)];

            if (value === false) return [...r, s];

            return Array.isArray(value)
                ? [...r, s, ...value]
                : [...r, s, value];
        }, []);

        return new HTMLLiteralResult(result);
    };
