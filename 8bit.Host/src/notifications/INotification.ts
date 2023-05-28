import { HTMLLiteralResult } from '../global';

export interface INotification {
    id?: string;
    title: HTMLLiteralResult | string;
    body?: HTMLLiteralResult | string;
    footer?: HTMLLiteralResult | string;
    modal?: boolean;
    allowClose?: boolean;
}
