import { html, Component, Watch, toDecimal, toBinaryArray, arraysEqual, ScoresService, wait } from '../global';
import { ABitGridComponent, ABinaryGridSelect } from '../bit-grid/component';
import { bitmaps } from '../global/data/bitmaps';
import { emptyBitmap } from '../global/data/emptyBitmap';

import css from './component.css';
import { ATimerComponent } from '../timer/component';
import { NotificationService } from '../notifications/NotificationService';
import { ANumberPadComponent } from '../number-pad/component';
import { IScoreCard } from '../global';
import { BitmapTypes } from '../global/data/BitmapTypes';

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
                    body: html`
                    <h2>Well done. Here are your stats.</h2>
                        ${this.renderAverages()}
                    `,
                    allowClose: false,
                });
            });
        } else {

            this.completedScore = this.scores.getByDate(new Date());
            this.bitmapName = this.completedScore?.name;

            if (!this.completedScore) {

                do {
                    const name = names[Math.floor(Math.random() * names.length)];

                    if (!this.scores.getByName(name)) this.bitmapName = name;
                } while (!this.bitmapName);
            }
        }

        this.render();
    }

    bitmapName: BitmapTypes = undefined!;

    scores = new ScoresService();
    notifications = new NotificationService();

    timerElement: ATimerComponent = undefined!;
    numberPadElement: ANumberPadComponent = undefined!;

    completedScore: IScoreCard | null = null;

    started: boolean = false;
    completed: boolean = false;
    errors: number = 0;

    start: () => void = () => {
        if (this.completed
            || this.started) return;

        this.started = true;
        if (this.inputRow === null) this.inputRow = 0;
        this.numberPadElement.disabled = false;

        this.timerElement.start();
    };

    complete: () => void = () => {
        if (!this.started) return;

        this.timerElement.stop();

        this.completed = true;
        this.inputRow = null;
        this.numberPadElement.disabled = true;

        this.completedScore = {
            date: new Date(),
            name: this.bitmapName,
            timeSeconds: this.timerElement.valueSeconds,
            errors: this.errors
        };
        this.scores.set(this.completedScore);

        this.errors = 0;

        this.showComplete();
    };

    showComplete = () => {

        let grid: ABitGridComponent;
        let submit: HTMLButtonElement;

        const validate = () => {
            const foundName = Object.keys(bitmaps)
                .find(key => arraysEqual(bitmaps[key].data, grid.value))
                || arraysEqual(emptyBitmap, grid.value) && 'empty';

            submit.disabled = !!foundName;
            submit.innerText = foundName ? `'${foundName}'` : 'Submit';
        };

        const gridRef = (el: ABitGridComponent) => {

            grid = el;
            el.value = bitmaps[this.bitmapName]?.data;
            el.addEventListener('select', (e: Event) => {
                const ce = e as CustomEvent<ABinaryGridSelect>;

                el.toggleValue(ce.detail.col, ce.detail.row);
                validate();
            });
        };

        const clearRef = (el: HTMLButtonElement) => {

            el.addEventListener('click', () => {
                grid.value = emptyBitmap;
                validate();
            });
        };

        const submitRef = (el: HTMLButtonElement) => {

            submit = el;
            validate();
        };

        const formRef = (el: HTMLFormElement) => {

            el.addEventListener('submit', (e: Event) => {

                e.preventDefault();

                const json = JSON.stringify(grid.value);
                //await navigator.clipboard.writeText(json);

                const body = json
                    .replace('[[', '[%0D%0A[')
                    .replaceAll('],[', '],%0D%0A[')
                    .replace(']]', ']%0D%0A]');

                window.location.assign(
                    `mailto:binary@antix.co.uk?subject=bitmap: [give it a name]&body=${body},`
                );
            });
        };

        this.notifications.show({
            title: html`
                ${this.completedScore && this.renderScore(this.completedScore)}                
                <h2>You completed ${this.scores.count} / ${Object.keys(bitmaps).length} bitmaps.</h2>
                ${this.scores.count > 1 &&
                this.renderAverages()
                }`,
            body: html`
                <style>
                    a-bit-grid{padding:var(--padding-unit) 0;font-size:2.2em;position:relative;left:50%;transform:translateX(-50%)}
                    p{display:flex}
                    .submit{margin-left:auto}
                </style>                
                <h3 class="not-shared">Come back tomorrow for another go.</h3>
                <p class="not-shared">In the meantime, make your own bitmap and submit for inclusion below.</p>
                <a-bit-grid show-binary ${gridRef}></a-bit-grid>
                <form ${formRef} class="not-shared">
                    <p>
                        <button ${clearRef} type="button">Clear</button>
                        <button ${submitRef} class="submit" type="submit" disabled>Submit</button>
                    </p>
                </form>
                <br />
                `,
            style: { width: '36em' },
            modal: true,
            allowClose: false,
            share: { text: '8bit Scores' }
        });
    };

    renderScore = (score: IScoreCard) => html`
        <h1>
            You took ${score.timeSeconds}s and had ${score.errors} errors
        </h1>`;

    renderAverages = () => html`
        <style>
            .scores p {display: grid;grid-template-columns: 10em min-content 1fr;}
        </style>
        <div class="scores">
            <p>Average Time   <strong>${this.scores.averageTimeSeconds}</strong>s</p>
            <p>Average Errors <strong>${this.scores.averageErrors}</strong></p>
        </div>`;

    targetGridElement: ABitGridComponent = undefined!;

    inputRow: number | null = null;
    @Watch('inputRow') inputRowChanged() {
        if (!this.inputGridElement) return;

        this.inputGridElement.selectedRow = this.inputRow;
        const text = this.inputRow === null
            ? ''
            : `${toDecimal(this.inputGridElement.value[this.inputRow])}`;

        this.inputRowValueElement.innerText = text;
    }
    inputRowValue: string = '';
    @Watch('inputRowValue') inputRowValueChanged() {

        if (this.inputRowValueElement)
            this.inputRowValueElement.ariaSelected = this.inputRowValue ? 'false' : 'true';
    }
    inputRowValueElement: HTMLSpanElement = undefined!;
    inputGridElement: ABitGridComponent = undefined!;

    render() {

        return html`
            <a-timer id="Timer" bits="16"></a-timer>

            <div id="Footer">
                <span id="InputRowValue">
                    8bit<br />
                    ${!this.completedScore && html`
                        <small>
                            press a number to start
                        </small>
                    `}
                </span>
                <a-number-pad disabled id="Input"></a-number-pad>
            </div>

            <div id="Board">
                    <a-bit-grid id="TargetGrid" show-header show-binary></a-bit-grid>
                    <a-bit-grid id="InputGrid"></a-bit-grid> 
            </div>

            <a-notifications></a-notifications>
        `;
    }

    afterRender() {
        const shadowRoot = this.shadowRoot!;

        this.timerElement = shadowRoot.querySelector<ATimerComponent>('#Timer')!;

        this.targetGridElement = shadowRoot.querySelector<ABitGridComponent>('#TargetGrid')!;
        this.targetGridElement.value = bitmaps[this.bitmapName]?.data;

        this.inputGridElement = shadowRoot.querySelector<ABitGridComponent>('#InputGrid')!;
        this.inputGridElement.addEventListener('select', e => this.handleInputGridSelect(e as CustomEvent<ABinaryGridSelect>));

        if (this.completedScore) {
            this.started = true;
            this.completed = true;

            this.inputGridElement.value = this.targetGridElement.value;

            this.showComplete();

        } else {
            this.inputRowValueElement = shadowRoot.querySelector<HTMLSpanElement>('#InputRowValue')!;

            this.numberPadElement = shadowRoot.querySelector('a-number-pad')!;
            this.numberPadElement.addEventListener('press', e => this.handlePress(e as CustomEvent<string>));
        }

    }

    handleInputGridSelect: (e: CustomEvent<ABinaryGridSelect>) => void = e => {
        if (this.completed) return;

        this.inputRow = e.detail.row;
        this.inputRowValue = '';
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
                this.inputRow = this.inputRow === null ? 0 : (this.inputRow + 7) % 8;
                this.inputRowValue = '';
                break;

            case 'ArrowDown':
                this.inputRow = this.inputRow === null ? 0 : (this.inputRow + 1) % 8;
                this.inputRowValue = '';
                break;

            case 'Enter':
                if (this.apply())
                    this.inputRow = (this.inputRow! + 1) % 8;

                this.inputRowValue = '';
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
        if (this.inputRow == null) return false;
        if (this.inputRowValue === '') return true;

        const decimal = parseInt(this.inputRowValue);

        this.inputGridElement.value = [
            ...this.inputGridElement.value.slice(0, this.inputRow),
            toBinaryArray(decimal),
            ...this.inputGridElement.value.slice(this.inputRow + 1)
        ];

        const error = !arraysEqual(
            this.targetGridElement.value[this.inputRow],
            this.inputGridElement.value[this.inputRow]
        );

        this.inputGridElement.setRowError(
            this.inputRow,
            error);

        if (error) {
            this.errors++;
            return false;
        }

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
