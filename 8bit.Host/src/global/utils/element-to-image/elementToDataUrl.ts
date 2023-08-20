export const elementToDataUrl
    : (element: HTMLElement, width: number, height: number) => string
    = (element, width, height) => {

        const clone = deepClone(element);

        clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        const html = new XMLSerializer()
            .serializeToString(clone)
            .replace(/#/g, '%23').replace(/\n/g, '%0A');

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" 
                      width="${width}" height="${height}">
                    <foreignObject x="0" y="0" width="100%" height="100%">${html}</foreignObject>
                </svg>`;

        return `data:image/svg+xml;charset=utf-8,${svg}`;
    };

const deepClone = (source: HTMLElement): HTMLElement => {
    const clone = (node: Node, parent: Node) => {

        const clonedNode = node.cloneNode();

        parent.appendChild(clonedNode);
        copyStyle(node, clonedNode);

        if (node instanceof Element && node.shadowRoot) {

            walk(node.shadowRoot.firstChild, clonedNode);

        } else {

            walk(node.firstChild, clonedNode);
        }
    };

    const walk = (n: Node | null, p: Node) => {
        while (n) {
            clone(n, p);
            n = n.nextSibling;
        }
    };

    const copyStyle = (sourceNode: Node, targetNode: Node): void => {
        if (!(sourceNode instanceof Element)
            || !(targetNode instanceof HTMLElement)) return;

        const computedStyle = window.getComputedStyle(sourceNode);

        Array
            .from(computedStyle)
            .forEach(key => {
                switch (key.split('-')[0]) {
                    default:
                        return;
                    case 'color': case 'background':
                    case 'display': case 'flex': case 'justify': case 'align': case 'grid':
                    case 'font': case 'text': case 'overflow': case 'line':
                    case 'padding': case 'margin': case 'border':
                    case 'position':
                    case 'top': case 'right': case 'bottom': case 'left':
                    case 'width': case 'height':
                        targetNode.style
                            .setProperty(key,
                                computedStyle.getPropertyValue(key),
                                computedStyle.getPropertyPriority(key)
                            );
                        break;
                }
            });
    };

    try {

        source.classList.add('sharing');

        const container = document.createDocumentFragment();

        clone(source, container);

        return container.firstChild as HTMLElement;

    } finally {
        //source.classList.remove('sharing');
    }
};
