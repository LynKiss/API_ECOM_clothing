import { SupportChatActorRole } from './support-conversation.entity';
export declare class SupportMessageEntity {
    messageId: string;
    conversationId: string;
    senderUserId: string;
    senderRole: SupportChatActorRole;
    content: string;
    readAt: Date | null;
    createdAt: Date;
}
