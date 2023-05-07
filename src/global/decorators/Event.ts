/**
 * CustomEvent emitter decorator
 *
 * @param options.type - event type name
 * @param options.bubbles - bubbles or not, default ```false```
 * @param options.cancelable - can be cancelled, default ```false```
 * @param options.composed - trigger listeners outside of a shadow root, default ```false```
 *
 * @example
 * ```typescript
 * ＠Event() MyChange: EventEmitter<number>;
 * ```
 */
export function Event(
    options: {
        type?: string;
    } & EventInit = {}
) {

    return function (
        target: HTMLElement,
        propertyKey: string
    ) {
        const o = {
            type: propertyKey,
            ...options
        };

        target[propertyKey] = function (detail: unknown) {

            const e = new CustomEvent(o.type, {
                detail,
                bubbles: o.bubbles,
                cancelable: o.cancelable,
                composed: o.composed,
            });

            return this.dispatchEvent(e);
        };
    };
}
