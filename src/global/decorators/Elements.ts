import DOMPurify from "dompurify";
import { animationFrame, wait } from "../utils";

/**
 * the result of an html tag function
 */
export class ElementsResult extends Array<unknown> {
    constructor(items: unknown[]) {
        super(items);
    }

    render = () => new Promise<DocumentFragment>((resolve) => {

        const template = document.createElement('template');

        const refName = '_r_';
        type Callback = (el: Element) => void;
        const callbacks: { [key: string]: Callback } = {};

        const mo = new MutationObserver(m => {
            m
                .filter(r => r.target.nodeType === 11)
                .forEach(r => {

                    const documentFragment = r.target as DocumentFragment;
                    [...documentFragment.querySelectorAll(`[${refName}]`)]
                        .forEach(async el => {

                            const key = el.getAttribute(refName);
                            el.removeAttribute(refName);

                            while (!el.isConnected)
                                await animationFrame();

                            callbacks[key](el);
                        });
                });

            complete(template.content);
        });
        mo.observe(template.content, { childList: true });

        const complete: (df: DocumentFragment) => void
            = df => {
                mo.disconnect();
                resolve(df);
            }

        const getRefValue: (fn: unknown) => string = callback => {
            const key = `_${Object.keys(callbacks).length}`;
            callbacks[key] = callback as Callback;

            return key;
        }

        const walk = (value: unknown) => Array.isArray(value)
            ? value.map(walk).join('')
            : typeof (value) === 'function'
                ? `${refName}=${getRefValue(value)}`
                : `${value}`;

        const html = walk(this);
        if (!html) {
            complete(template.content);
            return;
        }

        template.innerHTML = html;
    })
};


/**
 * HTML tag function
 */
export interface IElements {
    (strings: TemplateStringsArray, ...values: unknown[]): ElementsResult;
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
export const elements: IElements
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

        return new ElementsResult(result);
    };
