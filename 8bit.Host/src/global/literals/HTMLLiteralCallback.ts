/**
 * a callback for an html tag function
 */
export type HTMLLiteralCallback<T = Element> = {
    element: T;
    (el: T): void;
};
