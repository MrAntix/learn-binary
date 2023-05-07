import DOMPurify from 'dompurify';

/**
 * the result of an html tag function
 */
export class HtmlResult extends Array<unknown> {
    constructor(items: unknown[]) {
        super(items);
    }

    render = () => {
        const r = (value: unknown) => Array.isArray(value)
            ? value.map(r).join('')
            : `${value}`;

        return r(this);
    };
}

/**
 * HTML tag function
 */
export interface IHtml {
    (strings: TemplateStringsArray, ...values: unknown[]): HtmlResult;
}

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
export const html: IHtml
    = (strings, ...values) => {

        const result = strings.reduce((r, s, i) => {
            const value = values[i] ?? '';

            if (typeof value === 'string')
                return [...r, s, DOMPurify.sanitize(value)];

            if (value === false) return [...r, s];

            return Array.isArray(value)
                ? [...r, s, ...value]
                : [...r, s, value];
        }, []);

        return new HtmlResult(result);
    };
