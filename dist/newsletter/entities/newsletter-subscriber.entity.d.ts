export declare enum SubscriberStatus {
    ACTIVE = "active",
    UNSUBSCRIBED = "unsubscribed"
}
export declare class NewsletterSubscriberEntity {
    subscriberId: string;
    email: string;
    name: string | null;
    status: SubscriberStatus;
    unsubscribeToken: string;
    createdAt: Date;
    updatedAt: Date;
}
