import { logger } from '../../logger';

/**
 * Watch a property and run the decorated function on change
 *
 * @param name property to watch
 *
 * @example
 * ```typescript
 * value: number;
 *
 * ＠Watch('value') valueChange(value: number, oldValue: number) {
 *      ...
 * }
 * ```
 * *note function parameters are not required
 */

export function Watch<T>(
    name: string & keyof T
) {
    const fieldKey = `_${name}`;

    return function (
        target: T,
        propertyKey: string
    ) {
        const property = Object.getOwnPropertyDescriptor(target, name);
        logger.debug('Watch.init', name, property);

        const get = property?.get ?? function () { return this[fieldKey]; };
        const set = property?.set ?? function (value: T) { this[fieldKey] = value; };

        Object.defineProperty(target, name, {
            get,
            set: function (value: T) {

                const oldValue = get.call(this);
                if (oldValue === value)
                    return;

                set.call(this, value);

                logger.debug('Watch.set', { name, value, oldValue, this: this });

                const result = this[propertyKey](value);
                if (result === false)
                    set.call(this, oldValue);
            },
            configurable: true
        });
    };
}
