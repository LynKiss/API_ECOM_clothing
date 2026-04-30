export declare enum SupportConversationStatus {
    WAITING_STAFF = "waiting_staff",
    WAITING_CUSTOMER = "waiting_customer",
    RESOLVED = "resolved"
}
export declare enum SupportChatActorRole {
    CUSTOMER = "customer",
    STAFF = "staff"
}
export declare class SupportConversationEntity {
    conversationId: string;
    customerUserId: string;
    assignedStaffUserId: string | null;
    status: SupportConversationStatus;
    lastMessagePreview: string | null;
    lastMessageSenderRole: SupportChatActorRole | null;
    lastMessageAt: Date | null;
    customerUnreadCount: number;
    staffUnreadCount: number;
    firstResponseAt: Date | null;
    resolvedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
