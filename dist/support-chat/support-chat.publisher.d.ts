import type { Server } from 'socket.io';
type ConversationPayload = {
    conversationId: string;
    customer: {
        _id: string;
    };
    assignedStaff?: {
        _id: string;
    } | null;
};
export declare class SupportChatPublisher {
    private server;
    attach(server: Server): void;
    emitConversationUpdated(conversation: ConversationPayload & Record<string, unknown>): void;
    emitMessageCreated(conversation: ConversationPayload & Record<string, unknown>, message: Record<string, unknown>): void;
}
export {};
