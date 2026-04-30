export declare enum ContactStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    RESOLVED = "resolved",
    CLOSED = "closed"
}
export declare class ContactEntity {
    contactId: string;
    userId: string | null;
    subject: string;
    message: string;
    status: ContactStatus;
    createdAt: Date;
    updatedAt: Date;
}
