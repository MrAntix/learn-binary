import { HtmlResult } from "../html";

export const ref = (
    html: HtmlResult,
    fn: (el: DocumentFragment) => void
) => {
    const template = document.createElement('template');
    template.innerHTML = html.render();

    fn(template.content);

    return template.content as any;
};
