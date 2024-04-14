declare module '*.css';

/**
 * available properties/methods on a component
 */
interface IComponent extends Element {
    connectedCallback?: () => void;
    disconnectedCallback?: () => void;

    beforeRender?: () => Promise<void> | void;
    render?: () => unknown;
    afterRender?: () => void;

    attributeChangedCallback?: (name: string, oldValue: string | null, newValue: string | null) => void;
}

/**
 * Component constructor
 */
interface IComponentConstructor {
    new(...args: unknown[]): IComponent;
    observedAttributes?: string[];
}