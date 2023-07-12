import { wait } from '../utils';
import { html } from './html';

describe('Elements', () => {

    let root: HTMLElement;
    beforeEach(() => {
        root = document.createElement('div');
        document.body.appendChild(root);
    });

    it('should callback with element', async () => {

        const ref = (name: string) =>
            (el: HTMLElement) => el.setAttribute('ref', name);

        const sub = () => html`<div ${ref('inner')}>sub</div>`;

        await html`<div ${ref('outer')}>${sub()}</div>`
            .render(root);

        await wait(100);

        expect(root.innerHTML)
            .toEqual('<div ref="outer"><div ref="inner">sub</div></div>');

    });

    it('result is an array', () => {
        const result = html``;
        expect(Array.isArray(result)).toBe(true);
    });

    it('false returns empty string', async () => {
        await html`${false}`
            .render(root);

        expect(root.innerHTML).toEqual('');
    });

    it('rendes a simple string', async () => {
        await html`hello`
            .render(root);

        expect(root.innerHTML).toEqual('hello');
    });

    it('renders values in attributes in nested calls', async () => {
        await html`<div>${html`<div class="${'hello'}"></div>`}</div>`
            .render(root);

        expect(root.innerHTML).toEqual('<div><div class="hello"></div></div>');
    });

    it('works with nested calls', async () => {
        await html`<div>${html`<div>${html`<div>hello</div>`}</div>`}</div>`
            .render(root);

        expect(root.innerHTML).toEqual('<div><div><div>hello</div></div></div>');
    });

    it('encodes elements from inner calls with attributes and quotes', async () => {
        await html`<div>${'<div title="a & b">a & b</div>'}</div>`
            .render(root);

        expect(root.innerHTML).toEqual('<div><div title="a &amp; b">a &amp; b</div></div>');
    });

    it('works with mapped arrays', async () => {
        const values = [1, 2, 3];
        await html`<ul>${values.map(v => html`<li>${v}</li>`)}</ul>`
            .render(root);

        expect(root.innerHTML).toEqual('<ul><li>1</li><li>2</li><li>3</li></ul>');
    });

    it('removes script tags', async () => {
        await html`<div>${'<script>alert("boo")</script>'}</div>`
            .render(root);

        expect(root.innerHTML).toEqual('<div></div>');
    });

    it('removes script tags from inner calls', async () => {

        const values = [1, 2, 3, 'removes script tag <script>alert("boo")</script>'];
        await html`<ul>${values.map(v => html`<li>${v}</li>`)}</ul>`
            .render(root);

        expect(root.innerHTML).toEqual('<ul><li>1</li><li>2</li><li>3</li><li>removes script tag </li></ul>');
    });

    it('removes javascript in attributes', async () => {
        await html`<div>${'<img src="javascript:alert(\'XSS\');">'}</div>`
            .render(root);

        expect(root.innerHTML).toEqual('<div><img></div>');
    });

    it('removes encoded javascript in attributes', async () => {
        await html`<div>${'<img src="jav&#x0A;ascript:alert(\'XSS\');">'}</div>`
            .render(root);

        expect(root.innerHTML).toEqual('<div><img></div>');
    });

    it('protects against attribute injection', async () => {
        await html`<div>${'<img src="http://www.w3.org/1999/xelements" onload="alert(\'XSS\');">'}</div>`
            .render(root);

        expect(root.innerHTML).toEqual('<div><img src="http://www.w3.org/1999/xelements"></div>');
    });

    it('protects against iframe', async () => {
        await html`<div>${'<iframe src="http://example.com"></iframe>'}</div>`
            .render(root);

        expect(root.innerHTML).toEqual('<div></div>');
    });

    it('protects against iframe javascript', async () => {
        await html`<div>${'<iframe src="javascript:alert(\'XSS\');"></iframe>'}</div>`
            .render(root);

        expect(root.innerHTML).toEqual('<div></div>');
    });
});