import { logger } from '../../logger';
import { isPromise } from '../utils';
import { isComponentRender } from './isComponentRender';

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
        constructor: { prototype: IComponent; }
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
            this.shadowRoot!.innerHTML = style;

            connectedFn.call(this);
        };

        const beforeRenderFn = constructor.prototype.beforeRender ?? noOp;
        const renderFn = constructor.prototype.render ?? noOp;
        const afterRenderFn = constructor.prototype.afterRender ?? noOp;
        const style = o.css == null ? '' : `<style>${o.css}</style>`;
        constructor.prototype.render = function (this: Element & { __renderId: number }) {

            if (this.__renderId)
                window.clearTimeout(this.__renderId);
            logger.debug('render', this);

            this.__renderId = window.setTimeout(async () => {

                const beforeRenderRet = beforeRenderFn.call(this);
                if (isPromise(beforeRenderRet))
                    await beforeRenderRet;

                if (this.shadowRoot == null) return;

                this.shadowRoot.innerHTML = style;

                const content = renderFn.call(this);
                if (isComponentRender(content))
                    await content.render(this.shadowRoot);

                afterRenderFn.call(this);
            }, 10);
        };
    };
}
