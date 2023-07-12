import { logger } from '../../logger';

/**
 * Component decorator
 *
 * @param options.css relative path to css
 * @param options.delegatesFocus enable delegatesFocus
 */
export function Component(
    options: {
        tag?: string;
        css?: string;
        delegatesFocus?: boolean;
    } = {}) {

    const noOp = () => { /* no operation */ };

    return function (
        constructor: IComponent & { prototype: IComponent; }
    ) {
        const o = {
            tag: null,
            css: '',
            delegatesFocus: false,
            ...options
        };

        const connectedFn = constructor.prototype.connectedCallback ?? noOp;
        constructor.prototype.connectedCallback = function () {

            this.attachShadow({
                delegatesFocus: o.delegatesFocus,
                mode: 'open',
                slotAssignment: 'named'
            });
            this.shadowRoot.innerHTML = style;

            connectedFn.call(this);
        };

        const beforeRenderFn = constructor.prototype.beforeRender ?? noOp;
        const beforeRenderPromise = async function () { await beforeRenderFn.call(this); };
        const renderFn = constructor.prototype.render ?? noOp;
        const afterRenderFn = constructor.prototype.afterRender ?? noOp;
        const style = o.css == null ? '' : `<style>${o.css}</style>`;
        constructor.prototype.render = function () {

            if (this.__render)
                window.clearTimeout(this.__render);
            logger.debug('render', this);

            this.__render = window.setTimeout(() => beforeRenderPromise.call(this)
                .then(async () => {
                    if (this.shadowRoot == null) return;

                    this.shadowRoot.innerHTML = style;
                    const content = renderFn && renderFn.call(this);
                    if (content && 'render' in content)
                        await content.render(this.shadowRoot);

                    afterRenderFn.call(this);
                }),
                10
            );
        };
    };
}
