import { INotification } from './INotification';

export interface INotificationService {
    show(notification: INotification): Promise<string>;
    hide(id: string): Promise<void>;
}
