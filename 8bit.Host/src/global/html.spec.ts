import { html } from './html';

describe('a literal tag function for html with DOMPurify sanitization', () => {

    it('result is an array', () => {
        const result = html``;
        expect(Array.isArray(result)).toBe(true);
    });

    it('false returns empty string', () => {
        const result = html`${false}`.render();
        expect(result).toEqual('');
    });

    it('rendes a simple string', () => {
        const result = html`hello`;
        expect(result.render()).toEqual('hello');
    });

    it('renders values in attributes in nested calls', () => {
        const result = html`<div>${html`<div class="${'hello'}"></div>`}</div>`;

        expect(result.render()).toEqual('<div><div class="hello"></div></div>');
    });

    it('works with nested calls', () => {
        const result = html`<div>${html`<div>${html`<div>hello</div>`}</div>`}</div>`;

        expect(result.render()).toEqual('<div><div><div>hello</div></div></div>');
    });

    it('encodes html from inner calls with attributes and quotes', () => {
        const result = html`<div>${'<div title="a & b">a & b</div>'}</div>`;
        expect(result.render()).toEqual('<div><div title="a &amp; b">a &amp; b</div></div>');
    });

    it('works with mapped arrays', () => {
        const values = [1, 2, 3];
        const result = html`<ul>${values.map(v => html`<li>${v}</li>`)}</ul>`;

        expect(result.render()).toEqual('<ul><li>1</li><li>2</li><li>3</li></ul>');
    });

    it('removes script tags', () => {
        const result = html`<div>${'<script>alert("boo")</script>'}</div>`;
        expect(result.render()).toEqual('<div></div>');
    });

    it('removes script tags from inner calls', () => {

        const values = [1, 2, 3, 'removes script tag <script>alert("boo")</script>'];
        const result = html`<ul>${values.map(v => html`<li>${v}</li>`)}</ul>`;

        expect(result.render()).toEqual('<ul><li>1</li><li>2</li><li>3</li><li>removes script tag </li></ul>');
    });

    it('removes javascript in attributes', () => {
        const result = html`<div>${'<img src="javascript:alert(\'XSS\');">'}</div>`;

        expect(result.render()).toEqual('<div><img></div>');
    });

    it('removes encoded javascript in attributes', () => {
        const result = html`<div>${'<img src="jav&#x0A;ascript:alert(\'XSS\');">'}</div>`;

        expect(result.render()).toEqual('<div><img></div>');
    });

    it('protects against attribute injection', () => {
        const result = html`<div>${'<img src="http://www.w3.org/1999/xhtml" onload="alert(\'XSS\');">'}</div>`;

        expect(result.render()).toEqual('<div><img src="http://www.w3.org/1999/xhtml"></div>');
    });

    it('protects against iframe', () => {
        const result = html`<div>${'<iframe src="http://example.com"></iframe>'}</div>`;

        expect(result.render()).toEqual('<div></div>');
    });

    it('protects against iframe javascript', () => {
        const result = html`<div>${'<iframe src="javascript:alert(\'XSS\');"></iframe>'}</div>`;

        expect(result.render()).toEqual('<div></div>');
    });
});