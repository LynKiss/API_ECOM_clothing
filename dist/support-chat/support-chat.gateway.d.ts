import { OnGatewayConnection, OnGatewayInit } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import type { Server, Socket } from 'socket.io';
import { RolesService } from '../roles/roles.service';
import { UserRole } from '../users/entities/user.entity';
import { SupportChatPublisher } from './support-chat.publisher';
import { SupportChatService } from './support-chat.service';
export declare class SupportChatGateway implements OnGatewayInit, OnGatewayConnection {
    private readonly jwtService;
    private readonly rolesService;
    private readonly supportChatService;
    private readonly supportChatPublisher;
    private server;
    private readonly logger;
    constructor(jwtService: JwtService, rolesService: RolesService, supportChatService: SupportChatService, supportChatPublisher: SupportChatPublisher);
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    handleConversationJoin(client: Socket, body: {
        conversationId?: string;
    }): Promise<{
        event: string;
        data: {
            conversation: {
                conversationId: string;
                status: import("./entities/support-conversation.entity").SupportConversationStatus;
                customerUnreadCount: number;
                staffUnreadCount: number;
                lastMessagePreview: string | null;
                lastMessageSenderRole: import("./entities/support-conversation.entity").SupportChatActorRole | null;
                lastMessageAt: Date | null;
                firstResponseAt: Date | null;
                resolvedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                customer: {
                    _id: string;
                    username: string;
                    email: string | null;
                    avatarUrl: string | null;
                    role: UserRole;
                };
                assignedStaff: {
                    _id: string;
                    username: string;
                    email: string | null;
                    avatarUrl: string | null;
                    role: UserRole;
                } | null;
            };
            messages: {
                messageId: string;
                conversationId: string;
                content: string;
                senderRole: import("./entities/support-conversation.entity").SupportChatActorRole;
                readAt: Date | null;
                createdAt: Date;
                sender: {
                    _id: string;
                    username: string;
                    email: string | null;
                    avatarUrl: string | null;
                    role: UserRole;
                };
            }[];
        };
    }>;
    handleConversationLeave(client: Socket, body: {
        conversationId?: string;
    }): {
        event: string;
        data: {
            conversationId: string | undefined;
        };
    };
    handleConversationRead(client: Socket, body: {
        conversationId?: string;
    }): Promise<{
        event: string;
        data: {
            conversationId: string;
            status: import("./entities/support-conversation.entity").SupportConversationStatus;
            customerUnreadCount: number;
            staffUnreadCount: number;
            lastMessagePreview: string | null;
            lastMessageSenderRole: import("./entities/support-conversation.entity").SupportChatActorRole | null;
            lastMessageAt: Date | null;
            firstResponseAt: Date | null;
            resolvedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            customer: {
                _id: string;
                username: string;
                email: string | null;
                avatarUrl: string | null;
                role: UserRole;
            };
            assignedStaff: {
                _id: string;
                username: string;
                email: string | null;
                avatarUrl: string | null;
                role: UserRole;
            } | null;
        };
    }>;
    handleMessageSend(client: Socket, body: {
        conversationId?: string;
        content?: string;
    }): Promise<{
        event: string;
        data: {
            conversation: {
                conversationId: string;
                status: import("./entities/support-conversation.entity").SupportConversationStatus;
                customerUnreadCount: number;
                staffUnreadCount: number;
                lastMessagePreview: string | null;
                lastMessageSenderRole: import("./entities/support-conversation.entity").SupportChatActorRole | null;
                lastMessageAt: Date | null;
                firstResponseAt: Date | null;
                resolvedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                customer: {
                    _id: string;
                    username: string;
                    email: string | null;
                    avatarUrl: string | null;
                    role: UserRole;
                };
                assignedStaff: {
                    _id: string;
                    username: string;
                    email: string | null;
                    avatarUrl: string | null;
                    role: UserRole;
                } | null;
            };
            message: {
                messageId: string;
                conversationId: string;
                content: string;
                senderRole: import("./entities/support-conversation.entity").SupportChatActorRole;
                readAt: Date | null;
                createdAt: Date;
                sender: {
                    _id: string;
                    username: string;
                    email: string | null;
                    avatarUrl: string | null;
                    role: UserRole;
                };
            };
        };
    }>;
    private getCurrentUser;
    private authenticateClient;
    private extractToken;
}
