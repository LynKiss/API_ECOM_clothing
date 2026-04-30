export declare enum NotificationChannel {
    SYSTEM = "system",
    EMAIL = "email"
}
export declare enum NotificationStatus {
    PENDING = "pending",
    SENT = "sent",
    FAILED = "failed",
    SKIPPED = "skipped"
}
export declare class NotificationEntity {
    notificationId: string;
    userId: string | null;
    email: string | null;
    channel: NotificationChannel;
    status: NotificationStatus;
    title: string;
    message: string;
    metadata: Record<string, unknown> | null;
    deliveryError: string | null;
    sentAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
