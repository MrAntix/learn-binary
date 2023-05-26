import { HtmlResult } from '../global';

export interface INotification {
    id?: string;
    title: HtmlResult | string;
    body?: HtmlResult | string;
    footer?: HtmlResult | string;
    modal?: boolean;
    allowClose?: boolean;
}
