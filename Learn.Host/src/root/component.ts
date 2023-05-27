import { html, elements, Component, Watch, toDecimal, toBinaryArray, arraysEqual, ScoresService, wait } from '../global';
import { ABinaryGridComponent, ABinaryGridSelect } from '../binary-grid/component';
import { bitmaps, emptyBitmap } from '../global/data';
import DOMPurify from 'dompurify';

import css from './component.css';
import { ATimerComponent } from '../timer/component';
import { NotificationService } from '../notifications/NotificationService';
import { ANumberPadComponent } from '../number-pad/component';
import { IScoreCard } from '../global';

@Component({
    css
})
export class ARootComponent extends HTMLElement implements IComponent {

    connectedCallback() {

        const names = Object.keys(bitmaps);
        if (
            names.length === this.scores.count
        ) {
            wait(1000).then(() => {
                //this.completed = true;
                this.notifications.show({
                    title: '<h1>No more bitmaps to solve.<h1>',
                    body: elements`<p>You&apos;re simply the best.</p><br />`,
                    allowClose: false,
                });
            });
        } else {

            this.score = this.scores.getByDate(new Date());
            this.bitmapName = this.score?.name;

            if (!this.score) {

                console.log('names', names);
                do {
                    const name = names[Math.floor(Math.random() * names.length)];
                    if (!this.scores.getByName(name)) this.bitmapName = name;
                } while (!this.bitmapName);
            }
        }

        this.render();
    }

    bitmapName: string;

    scores = new ScoresService();
    notifications = new NotificationService();

    timerElement: ATimerComponent;
    numberPadElement: ANumberPadComponent;

    score: IScoreCard;
    started: boolean = false;
    completed: boolean = false;
    errors: number = 0;

    start: () => void = () => {
        if (this.completed) return;

        this.started = true;
        this.inputRow = 0;
        this.numberPadElement.disabled = false;

        this.timerElement.start();
    };

    complete: () => void = () => {
        if (!this.started) return;

        this.timerElement.stop();

        this.completed = true;
        this.inputRow = null;
        this.numberPadElement.disabled = true;

        this.score = {
            date: new Date(),
            name: this.bitmapName,
            timeSeconds: this.timerElement.valueSeconds,
            errors: this.errors
        };
        this.scores.set(this.score);

        this.showComplete();
    };

    showComplete = async () => {

        let grid: ABinaryGridComponent;
        let input: HTMLInputElement;
        let submit: HTMLButtonElement;

        const validate = () => {
            const found = !!Object.keys(bitmaps)
                .find(key => arraysEqual(bitmaps[key], grid.value))
                || arraysEqual(emptyBitmap, grid.value);

            input.disabled = found;
            submit.disabled = found
                || !input.value
                || Object.keys(bitmaps).includes(input.value);
        };

        const gridRef = (el: ABinaryGridComponent) => {

            grid = el;
            el.value = bitmaps[this.bitmapName];
            el.addEventListener('select', (e: CustomEvent<ABinaryGridSelect>) => {

                el.toggleValue(e.detail.col, e.detail.row);
                validate();
            });
        };

        const clearRef = (el: HTMLButtonElement) => {

            el.addEventListener('click', async () => {
                grid.value = emptyBitmap;
                validate();
            });
        };

        const inputRef = (el: HTMLInputElement) => {

            input = el;
            el.addEventListener('input', () => {

                validate();
            });
        };

        const submitRef = (el: HTMLButtonElement) => {

            submit = el;
            el.addEventListener('click', async () => {

                const json = JSON.stringify(grid.value);
                //await navigator.clipboard.writeText(json);

                const name = DOMPurify.sanitize(input.value);
                const body = json
                    .replace('[[', '[%0D%0A[')
                    .replaceAll('],[', '],%0D%0A[')
                    .replace(']]', ']%0D%0A]');

                window.location.assign(
                    `mailto:binary@antix.co.uk?subject=bitmap: ${name}&body=${name}: ${body},`
                );
            });
        };

        await this.notifications.show({
            title: elements`
                <h3>You won!</h3>
                <p>Come back tomorrow for another go.</p>
                `,
            body: elements`
                <style>
                    a-binary-grid{font-size:2.2em;margin:0 auto}
                    p{display:flex}
                    input{margin-left:auto;flex-basis:12em}
                </style>                
                <p>In the meantime, make your own bitmap and submit for inclusion below.</p>
                <p>
                    <a-binary-grid show-binary ${gridRef} />
                </p>
                <p>Should be a new bitmap and new name too.</p>
                <p>
                    <button ${clearRef}>Clear</button>
                    <input ${inputRef} disabled type="text" placeholder="(name)" />
                    <button ${submitRef} class="submit" disabled>Submit</button>
                </p>
                <br />
                `,
            modal: true,
            allowClose: false
        });
    };

    targetGridElement: ABinaryGridComponent;

    inputRow: number | null = null;
    @Watch('inputRow') inputRowChanged() {
        if (!this.inputGridElement) return;

        this.inputGridElement.selectedRow = this.inputRow;
        const text = this.inputRow === null
            ? ''
            : `${toDecimal(this.inputGridElement.value[this.inputRow])}`;

        this.inputRowValueElement.innerText = text;
        this.inputRowValue = '';
    }
    inputRowValue: string = '';
    inputRowValueElement: HTMLSpanElement;
    inputGridElement: ABinaryGridComponent;

    render() {

        return html`
            <a-timer id="Timer" bits="16"></a-timer>

            <div id="Board">
                <a-binary-grid id="TargetGrid" show-header show-binary></a-binary-grid>
                <a-binary-grid id="InputGrid"></a-binary-grid> 
            </div>

            ${!this.score && html`
                <div id="Footer">
                    <span id="InputRowValue">
                        <small>
                            press a number to start
                        </small>
                    </span>
                    <a-number-pad disabled id="Input"></a-number-pad>
                </div>
            `}
            <a-notifications></a-notifications>
        `;
    }

    afterRender() {
        this.timerElement = this.shadowRoot.querySelector<ATimerComponent>('#Timer');

        this.targetGridElement = this.shadowRoot.querySelector<ABinaryGridComponent>('#TargetGrid');
        this.targetGridElement.value = bitmaps[this.bitmapName];

        this.inputGridElement = this.shadowRoot.querySelector<ABinaryGridComponent>('#InputGrid');
        this.inputGridElement.addEventListener('select', this.handleRowClick);

        if (this.score) {
            this.started = true;
            this.completed = true;

            this.inputGridElement.value = this.targetGridElement.value;

            this.showComplete();

        } else {
            this.inputRowValueElement = this.shadowRoot.querySelector<HTMLSpanElement>('#InputRowValue');

            this.numberPadElement = this.shadowRoot.querySelector('a-number-pad');
            this.numberPadElement.addEventListener('press', this.handlePress);
        }

    }

    handleRowClick: (e: CustomEvent<ABinaryGridSelect>) => void = e => {
        if (this.completed) return;

        this.inputRow = e.detail.row;
    };

    handlePress: (e: CustomEvent<string>) => void = e => {
        if (this.completed) return;

        switch (e.detail) {
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
                this.setDecimal(`${this.inputRowValue}${e.detail}`);
                break;

            case 'Backspace':
                this.setDecimal(`${this.inputRowValue.slice(0, -1)}`);
                break;

            case 'ArrowUp':
                this.inputRow = (this.inputRow + 7) % 8;
                break;

            case 'ArrowDown':
                this.inputRow = (this.inputRow + 1) % 8;
                break;

            case 'Enter':
                if (this.apply())
                    this.inputRow = (this.inputRow + 1) % 8;
                break;
        }
    };

    setDecimal: (value: string) => void = value => {
        const decimal = parseInt(value);
        if (decimal > 255) return;

        if (!this.started) this.start();

        this.inputRowValue = value;
        this.inputRowValueElement.innerText = value;
    };

    apply: () => boolean = () => {
        if (this.inputRowValue === '') return true;

        const decimal = parseInt(this.inputRowValue);

        this.inputGridElement.value = [
            ...this.inputGridElement.value.slice(0, this.inputRow),
            toBinaryArray(decimal),
            ...this.inputGridElement.value.slice(this.inputRow + 1)
        ];

        this.inputGridElement.setRowError(
            this.inputRow,
            !arraysEqual(
                this.targetGridElement.value[this.inputRow],
                this.inputGridElement.value[this.inputRow]
            ));

        if (arraysEqual(
            this.targetGridElement.value,
            this.inputGridElement.value
        )) {
            this.complete();

            return false;
        }

        return true;
    };
}
