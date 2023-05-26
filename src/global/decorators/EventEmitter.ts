/**
 * Types an Event decorator function @see {@link Event}
 */
export type EventEmitter<T> = {
    (detail: T): boolean;
};
