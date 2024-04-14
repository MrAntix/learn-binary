/**
 * A component render function returned by a render function in a component
 */
export interface IComponentRender {
    render: (parent: DocumentOrShadowRoot) => Promise<void>;
}
