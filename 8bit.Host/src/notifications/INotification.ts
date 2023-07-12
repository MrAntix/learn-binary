import { HTMLLiteralResult } from '../global';

export interface INotification {
    id?: string;
    title: HTMLLiteralResult | string;
    body?: HTMLLiteralResult | string;
    footer?: HTMLLiteralResult | string;
    style?: Partial<CSSStyleDeclaration>,
    modal?: boolean;
    allowClose?: boolean;
    share?: {
        text?: string;
    }
}
