import { INotification } from './INotification';

export interface INotificationService {
    show(notification: INotification): string;
    hide(id: string): void;
}
