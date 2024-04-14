import { animationFrame } from '../utils';
import { HTMLLiteralCallback } from './HTMLLiteralCallback';

/**
 * the result of an html tag function
 */
export class HTMLLiteralResult extends Array<unknown> {
    constructor(items: unknown[]) {
        super(items);
    }

    render = (root: Element) => new Promise<void>((resolve) => {

        const template = document.createElement('template');

        const REF_ATTR = '_r_';
        const callbacks: { [key: string]: HTMLLiteralCallback; } = {};

        const mo = new MutationObserver(m => {

            m
                .filter(r => r.target.nodeType === 11)
                .forEach(async r => {

                    const documentFragment = r.target as DocumentFragment;

                    [...documentFragment.querySelectorAll(`[${REF_ATTR}]`)]
                        .forEach(async el => {

                            const key = el.getAttribute(REF_ATTR)!;
                            el.removeAttribute(REF_ATTR);

                            while (!el.isConnected)
                                await animationFrame();

                            const callback = callbacks[key];
                            callback.element = el;

                            callback(el);
                        });
                });

            complete();
        });
        mo.observe(template.content, { childList: true });

        const complete: () => void = () => {
            mo.disconnect();

            root.appendChild(template.content);
            resolve();
        };

        const getRefValue: (fn: unknown) => string = callback => {
            const key = `_${Object.keys(callbacks).length}`;
            callbacks[key] = callback as HTMLLiteralCallback;

            return key;
        };

        const walk: (value: unknown) => string
            = value => Array.isArray(value)
                ? value.map(walk).join('')
                : typeof (value) === 'function'
                    ? `${REF_ATTR}=${getRefValue(value)}`
                    : `${value}`;

        const resultHTML = walk(this);
        if (!resultHTML) {
            complete();
            return;
        }

        template.innerHTML = resultHTML;
    });
}
