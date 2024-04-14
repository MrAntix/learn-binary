import { Component, Event, EventEmitter, Watch, html } from '../global';
import css from './component.css';

@Component({
    css
})
export class ANumberPadComponent extends HTMLElement implements IComponent {

    connectedCallback() {
        this.render();

        if (!this.disabled)
            this.attachListeners();
    }

    disconnectedCallback() {

        this.detachListeners();
    }

    disabled: boolean = false;
    @Watch('disabled') onDisabledChanged() {

        this.disabled ? this.detachListeners() : this.attachListeners();
    }

    attachListeners() {

        this.addEventListener('click', this.handleClick);
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.clearHighlight);
    }

    detachListeners() {

        this.removeEventListener('click', this.handleClick);
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.clearHighlight);
    }

    readonly handleClick = (e: MouseEvent) => {
        const cell = e.composedPath()
            .find(el => el instanceof HTMLElement && el.dataset.key) as HTMLElement;
        if (cell == null) return;

        this.act(cell.dataset.key!);
    };

    readonly handleKeyDown = (e: KeyboardEvent) => {
        if (e.altKey || e.ctrlKey) return;

        let key = e.key;
        switch (e.key) {
            case 'Tab': key = e.shiftKey ? 'ArrowUp' : 'ArrowDown'; break;
        }

        if (this.act(key))
            e.preventDefault();

        this.clearHighlight();
        this.highlightedElement = this.elements[key];
        if (this.highlightedElement) {

            this.highlightedElement.classList.toggle('pressed', true);
        }
    };

    readonly clearHighlight = () => {
        if (!this.highlightedElement) return;

        this.highlightedElement.classList.toggle('pressed', false);
        this.highlightedElement = null;
    };

    act(value: string): boolean {

        switch (value) {
            default: return false;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case 'ArrowUp':
            case 'ArrowDown':
            case 'Enter':
            case 'Backspace': this.press(value); return true;
        }
    }

    elements: { [key: string]: HTMLElement } = {};
    highlightedElement: HTMLElement | null = null;

    render() {

        return html`
            <table><tbody>
                <tr><th data-key="1">1</th><th data-key="2">2</th><th data-key="3">3</th><td></td></tr>
                <tr><th data-key="4">4</th><th data-key="5">5</th><th data-key="6">6</th><td data-key="ArrowUp"><a-icon type="arrow-head" rotate="180" /></td></tr>
                <tr><th data-key="7">7</th><th data-key="8">8</th><th data-key="9">9</th><td data-key="ArrowDown"><a-icon type="arrow-head" /></td></tr>
                <tr>
                    <td data-key="Backspace"><a-icon type="backspace" /></td>
                    <th data-key="0">0</th>
                    <td data-key="Enter" colspan="2"><a-icon type="enter" /></td>
                </tr>
            </tbody></table>
        `;
    }

    afterRender(): void {

        [...this.shadowRoot!.querySelectorAll<HTMLElement>('th,td')]
            .forEach(element => {
                if (element.dataset?.key)
                    this.elements[element.dataset.key] = element;
            });
    }

    @Event() press!: EventEmitter<string>;
}
