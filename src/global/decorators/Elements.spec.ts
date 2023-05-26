import { elements } from "./Elements";

describe('Elements', () => {

    const getHTML: (df: DocumentFragment) => string
        = df => {
            const div = document.createElement('div');
            div.appendChild(df);
            return div.innerHTML;
        };

    it('should create dom', async () => {

        const ref = (name: string) =>
            (el: HTMLElement) => { el.setAttribute('ref', name) };

        const sub = () => elements`<div ${ref('inner')}>sub</div>`;

        const result = await elements`<div ${ref('outer')}>${sub()}</div>`
            .render();

        expect(getHTML(result))
            .toEqual('<div ref="outer"><div ref="inner">sub</div></div>');
    });

    it('result is an array', () => {
        const result = elements``;
        expect(Array.isArray(result)).toBe(true);
    });

    it('false returns empty string', async () => {
        const result = await elements`${false}`
            .render();

        expect(getHTML(result)).toEqual('');
    });

    it('rendes a simple string', async () => {
        const result = await elements`hello`
            .render();

        expect(getHTML(result)).toEqual('hello');
    });

    it('renders values in attributes in nested calls', async () => {
        const result = await elements`<div>${elements`<div class="${'hello'}"></div>`}</div>`
            .render();

        expect(getHTML(result)).toEqual('<div><div class="hello"></div></div>');
    });

    it('works with nested calls', async () => {
        const result = await elements`<div>${elements`<div>${elements`<div>hello</div>`}</div>`}</div>`
            .render();

        expect(getHTML(result)).toEqual('<div><div><div>hello</div></div></div>');
    });

    it('encodes elements from inner calls with attributes and quotes', async () => {
        const result = await elements`<div>${'<div title="a & b">a & b</div>'}</div>`
            .render();

        expect(getHTML(result)).toEqual('<div><div title="a &amp; b">a &amp; b</div></div>');
    });

    it('works with mapped arrays', async () => {
        const values = [1, 2, 3];
        const result = await elements`<ul>${values.map(v => elements`<li>${v}</li>`)}</ul>`
            .render();

        expect(getHTML(result)).toEqual('<ul><li>1</li><li>2</li><li>3</li></ul>');
    });

    it('removes script tags', async () => {
        const result = await elements`<div>${'<script>alert("boo")</script>'}</div>`
            .render();

        expect(getHTML(result)).toEqual('<div></div>');
    });

    it('removes script tags from inner calls', async () => {

        const values = [1, 2, 3, 'removes script tag <script>alert("boo")</script>'];
        const result = await elements`<ul>${values.map(v => elements`<li>${v}</li>`)}</ul>`
            .render();

        expect(getHTML(result)).toEqual('<ul><li>1</li><li>2</li><li>3</li><li>removes script tag </li></ul>');
    });

    it('removes javascript in attributes', async () => {
        const result = await elements`<div>${'<img src="javascript:alert(\'XSS\');">'}</div>`
            .render();

        expect(getHTML(result)).toEqual('<div><img></div>');
    });

    it('removes encoded javascript in attributes', async () => {
        const result = await elements`<div>${'<img src="jav&#x0A;ascript:alert(\'XSS\');">'}</div>`
            .render();

        expect(getHTML(result)).toEqual('<div><img></div>');
    });

    it('protects against attribute injection', async () => {
        const result = await elements`<div>${'<img src="http://www.w3.org/1999/xelements" onload="alert(\'XSS\');">'}</div>`
            .render();

        expect(getHTML(result)).toEqual('<div><img src="http://www.w3.org/1999/xelements"></div>');
    });

    it('protects against iframe', async () => {
        const result = await elements`<div>${'<iframe src="http://example.com"></iframe>'}</div>`
            .render();

        expect(getHTML(result)).toEqual('<div></div>');
    });

    it('protects against iframe javascript', async () => {
        const result = await elements`<div>${'<iframe src="javascript:alert(\'XSS\');"></iframe>'}</div>`
            .render();

        expect(getHTML(result)).toEqual('<div></div>');
    });
});