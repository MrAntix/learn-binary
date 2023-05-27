import { Component, Att, Event, EventEmitter, Watch, getArrayOfNumbers, html } from '../global';
import { CHANGE_EVENT } from '../events';
import css from './component.css';

@Component({
    css
})
export class ATimerComponent extends HTMLElement implements IComponent {

    connectedCallback() {
        this.render();

        if (this.startOnLoad) this.start();
    }

    value: number;
    valueSeconds: number;

    @Watch('value') valueChange(value: number) {

        this.valueSeconds = Math.round(value * this.timerInterval / 1000);
    }

    @Att({ access: 'read-only' }) timerInterval: number = 1000 / 8;
    @Att({ access: 'read-only' }) startOnLoad: boolean = false;
    @Att({ access: 'write-only' }) started: boolean = false;

    private then: number;

    private _timer: number = 0;
    get timer() { return this._timer; }

    @Watch('timer') timerChange(value: number) {
        this.started = value !== 0;
    }

    @Att({ access: 'read-only' }) bits: number = 8;

    @Watch('bits') bitsChange(value: number) {

        if (value > 0)
            window.requestAnimationFrame(() => this.render());
    }

    @Att({ access: 'read-only' }) progress: number;
    @Att({ access: 'read-only' }) progressTotal: number;
    progressElement: HTMLElement;

    @Watch('progress')
    @Watch('progressTotal') progressChange() {
        if (
            this.progressElement
            && this.progress >= 0
            && this.progressTotal > 0
        )
            this.progressElement.innerText = `${this.progress} of ${this.progressTotal}`;
    }

    start() {
        if (this._timer !== 0) return;

        this.then = Date.now();
        this._timer = window.setTimeout(() => this.tick(), this.timerInterval);
    }

    stop() {
        if (this._timer === 0) return;

        window.clearInterval(this._timer);
        this._timer = 0;
    }

    reset() {
        this.stop();
        this.value = 0;
        this.progress = 0;
        this.progressTotal = 0;
    }

    tick() {
        this.value = (this.value || 0) + 1;

        const now = Date.now();
        const offset = now - this.then - this.timerInterval;

        this._timer = window.setTimeout(() => this.tick(), this.timerInterval - offset);
        this.then = now;

        this.elements.forEach((el, i) => {
            el.classList.toggle('on', !!(this.value & Math.pow(2, this.elements.length - 1 - i)));
        });

        this.dispatchChange(this.value);
    }

    @Event({ type: CHANGE_EVENT }) dispatchChange: EventEmitter<number>;

    elements: HTMLElement[] = [];

    render() {
        return html`
            <table><tbody><tr>
                <th></th>
                ${getArrayOfNumbers(this.bits ?? 8).map(() => html`<td></td>`)}
            </tr></tbody></table>
        `;
    }

    afterRender() {
        this.elements = [...this.shadowRoot.querySelectorAll('td')];
        this.progressElement = this.shadowRoot.querySelector('th');
        this.progressChange();
    }
}
