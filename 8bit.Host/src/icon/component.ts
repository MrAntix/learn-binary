import { Component, Att, html } from '../global';
import css from './component.css';

export enum AIconTypes {
    arrowHead = 'arrow-head',
    backspace = 'backspace',
    enter = 'enter',
    share = 'share'
}

@Component({
    css
})
export class AIconComponent extends HTMLElement implements IComponent {

    connectedCallback() {
        this.render();
    }

    @Att() type: AIconTypes;
    @Att() rotate: number = 0;
    @Att() scale: number = 1;

    render() {

        return html`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g transform="translate(12,12) rotate(${this.rotate}) scale(${this.scale})">
                    ${this.renderType()}
                </g>
            </svg>
        `;
    }

    renderType() {

        switch (this.type) {
            case AIconTypes.arrowHead:
                return html`<path d="M-10,-5 10,-5 0,7Z" />`;
            case AIconTypes.backspace:
                return html`<path d="M-12,0 -6,9 11,9 11,-9 -6,-9Z M2,-1 6,-5 7,-4 3,0 7,4 6,5 2,1 -2,5 -3,4 1,0 -3,-4 -2,-5Z" />`;
            case AIconTypes.enter:
                return html`<path d="M9,-6 12,-6 12,2 -4,2 -4,8 -12,0 -4,-8 -4,-2 9,-2Z" />`;
            case AIconTypes.share:
                return html`<path
                    d="
                        M-9,-7 A1,1 0,0,1 -2,-7 A1,1 0,0,1 -9,-7
                        M-9,7 A1,1 0,0,1 -2,7 A1,1 0,0,1 -9,7
                        M9,0 A1,1 0,0,1 2,0 A1,1 0,0,1 9,0
                        M-5,-8 5,-2 5,2 -5,8 -5,6 5,0 -5,-6
                    " />`;
        }
    }
}