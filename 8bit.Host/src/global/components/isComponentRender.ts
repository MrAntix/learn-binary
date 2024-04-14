import { IComponentRender } from './IComponentRender';

/**
 * check a value is an IComponentRender
 *
 * @param value Value to check
 * @returns value as IComponentRender
 */
export function isComponentRender(value: unknown): value is IComponentRender {

    return value != null
        && typeof value === 'object'
        && 'render' in value
        && typeof value.render === 'function'
        && value.render.length === 1;
}