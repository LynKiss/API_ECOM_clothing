import type { IUser } from '../users/users.interface';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(currentUser: IUser): Promise<{
        id: string;
        userId: string | null;
        email: string | null;
        channel: import("./entities/notification.entity").NotificationChannel;
        status: import("./entities/notification.entity").NotificationStatus;
        title: string;
        message: string;
        metadata: Record<string, unknown> | null;
        deliveryError: string | null;
        sentAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getAdminSummary(): Promise<{
        id: string | null;
        userId: string | null;
        email: string | null;
        channel: import("./entities/notification.entity").NotificationChannel;
        status: import("./entities/notification.entity").NotificationStatus;
        title: string;
        message: string;
        metadata: Record<string, unknown> | null;
        deliveryError: string | null;
        sentAt: Date | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    }[]>;
}
