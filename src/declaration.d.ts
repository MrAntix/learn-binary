
declare module '*.css';
/**
 * available properties/methods on a component
 */
interface IComponent {
    connectedCallback?(): void;
    disconnectedCallback?(): void;

    beforeRender?(): Promise<void> | void;
    render?(): unknown;
    afterRender?(): void;
}
