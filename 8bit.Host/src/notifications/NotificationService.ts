import { HIDE_NOTIFICATION_EVENT, SHOW_NOTIFICATION_EVENT } from '../events';
import { INotification } from './INotification';
import { INotificationService } from './INotificationService';

export class NotificationService implements INotificationService {
    static ID: number = 0;

    show(notification: INotification): string {

        notification = {
            id: `${++NotificationService.ID}`,
            allowClose: true,
            ...notification
        };

        window.dispatchEvent(
            new CustomEvent(SHOW_NOTIFICATION_EVENT, {
                detail: notification
            })
        );

        return notification.id!;
    }

    hide(id: string): void {

        window.dispatchEvent(
            new CustomEvent(HIDE_NOTIFICATION_EVENT, {
                detail: id
            })
        );
    }
}
