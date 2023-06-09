import { html, Component, Watch, toDecimal, toBinaryArray, arraysEqual, ScoresService, wait } from '../global';
import { ABitGridComponent, ABinaryGridSelect } from '../bit-grid/component';
import { bitmaps } from '../global/data/bitmaps';
import { emptyBitmap } from '../global/data/emptyBitmap';

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

    bitmapName: string;

    scores = new ScoresService();
    notifications = new NotificationService();

    timerElement: ATimerComponent;
    numberPadElement: ANumberPadComponent;

    completedScore: IScoreCard;

    started: boolean = false;
    completed: boolean = false;
    errors: number = 0;

    start: () => void = () => {
        if (this.completed
            || this.started) return;

        console.log('oi');

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

    showComplete = async () => {

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

        const submitRef = (el: HTMLButtonElement) => {

            submit = el;
            validate();
        };

        const formRef = (el: HTMLFormElement) => {

            el.addEventListener('submit', async (e: Event) => {

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

        await this.notifications.show({
            title: html`
                ${this.completedScore && this.renderScore(this.completedScore)}                
                <h2>You have completed ${this.scores.count} / ${Object.keys(bitmaps).length} bitmaps.</h2>
                ${this.scores.count > 1 &&
                this.renderAverages()
                }`,
            body: html`
                <style>
                    a-bit-grid{font-size:2.2em;position:relative;left:50%;transform:translateX(-50%)}
                    p{display:flex}
                    .submit{margin-left:auto}
                </style>                
                <h3>Come back tomorrow for another go.</h3>
                <p>In the meantime, make your own bitmap and submit for inclusion below.</p>
                <a-bit-grid show-binary ${gridRef}></a-bit-grid>
                <form ${formRef}>
                    <p>
                        <button ${clearRef} type="button">Clear</button>
                        <button ${submitRef} class="submit" type="submit" disabled>Submit</button>
                    </p>
                </form>
                <br />
                `,
            style: { width: '40em' },
            modal: true,
            allowClose: false
        });
    };

    renderScore = (score: IScoreCard) => html`
        <h1>
            You took ${score.timeSeconds}s and had ${score.errors} errors
        </h1>`;

    renderAverages = () => html`
        <p>Average Time:&nbsp;&nbsp;&nbsp;<strong>${this.scores.averageTimeSeconds}s</strong></p>
        <p>Average Errors:&nbsp;<strong>${this.scores.averageErrors}</strong></p>
    `;

    targetGridElement: ABitGridComponent;

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
    inputRowValueElement: HTMLSpanElement;
    inputGridElement: ABitGridComponent;

    render() {

        return html`
            <a-timer id="Timer" bits="16"></a-timer>

            ${!this.completedScore && html`
                <div id="Footer">
                    <span id="InputRowValue">
                        8bit<br />
                        <small>
                            press a number to start
                        </small>
                    </span>
                    <a-number-pad disabled id="Input"></a-number-pad>
                </div>
            `}

            <div id="Board">
                    <a-bit-grid id="TargetGrid" show-header show-binary></a-bit-grid>
                    <a-bit-grid id="InputGrid"></a-bit-grid> 
            </div>

            <a-notifications></a-notifications>
        `;
    }

    afterRender() {
        this.timerElement = this.shadowRoot.querySelector<ATimerComponent>('#Timer');

        this.targetGridElement = this.shadowRoot.querySelector<ABitGridComponent>('#TargetGrid');
        this.targetGridElement.value = bitmaps[this.bitmapName]?.data;

        this.inputGridElement = this.shadowRoot.querySelector<ABitGridComponent>('#InputGrid');
        this.inputGridElement.addEventListener('select', this.handleInputGridSelect);

        if (this.completedScore) {
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
                    this.inputRow = (this.inputRow + 1) % 8;

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
