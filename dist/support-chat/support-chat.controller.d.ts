import type { IUser } from '../users/users.interface';
import { CreateSupportBotReplyDto } from './dto/create-support-bot-reply.dto';
import { CreateSupportMessageDto } from './dto/create-support-message.dto';
import { StartSupportConversationDto } from './dto/start-support-conversation.dto';
import { UpdateSupportConversationStatusDto } from './dto/update-support-conversation-status.dto';
import { SupportBotService } from './support-bot.service';
import { SupportConversationStatus } from './entities/support-conversation.entity';
import { SupportChatPublisher } from './support-chat.publisher';
import { SupportChatService } from './support-chat.service';
export declare class SupportChatController {
    private readonly supportChatService;
    private readonly supportChatPublisher;
    private readonly supportBotService;
    constructor(supportChatService: SupportChatService, supportChatPublisher: SupportChatPublisher, supportBotService: SupportBotService);
    createBotReply(createSupportBotReplyDto: CreateSupportBotReplyDto): Promise<{
        reply: string;
        source: "fallback";
        handoffSuggested: boolean;
        products: {
            productId: string;
            productName: string;
            effectivePrice: string;
            basePrice: string;
            unit: string | null;
            quantityAvailable: number;
            primaryImageUrl: string | null;
        }[];
        intent: "returns" | "greeting" | "shipping" | "payment" | "product_search" | "product_recommendation" | "cart_add" | "cart_view" | "checkout" | "identity" | "my_orders" | "order_lookup" | "human_handoff" | "general";
        cartChanged: boolean;
    } | {
        reply: string;
        source: "ai";
        handoffSuggested: boolean;
        products: {
            productId: string;
            productName: string;
            effectivePrice: string;
            basePrice: string;
            unit: string | null;
            quantityAvailable: number;
            primaryImageUrl: string | null;
        }[];
        intent: "returns" | "greeting" | "shipping" | "payment" | "product_search" | "product_recommendation" | "cart_add" | "my_orders" | "order_lookup" | "general";
        cartChanged: boolean;
    }>;
    createMyBotReply(currentUser: IUser, createSupportBotReplyDto: CreateSupportBotReplyDto): Promise<{
        reply: string;
        source: "fallback";
        handoffSuggested: boolean;
        products: {
            productId: string;
            productName: string;
            effectivePrice: string;
            basePrice: string;
            unit: string | null;
            quantityAvailable: number;
            primaryImageUrl: string | null;
        }[];
        intent: "returns" | "greeting" | "shipping" | "payment" | "product_search" | "product_recommendation" | "cart_add" | "cart_view" | "checkout" | "identity" | "my_orders" | "order_lookup" | "human_handoff" | "general";
        cartChanged: boolean;
    } | {
        reply: string;
        source: "ai";
        handoffSuggested: boolean;
        products: {
            productId: string;
            productName: string;
            effectivePrice: string;
            basePrice: string;
            unit: string | null;
            quantityAvailable: number;
            primaryImageUrl: string | null;
        }[];
        intent: "returns" | "greeting" | "shipping" | "payment" | "product_search" | "product_recommendation" | "cart_add" | "my_orders" | "order_lookup" | "general";
        cartChanged: boolean;
    }>;
    startMyConversation(currentUser: IUser): Promise<{
        conversationId: string;
        status: SupportConversationStatus;
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
            role: import("../users/entities/user.entity").UserRole;
        };
        assignedStaff: {
            _id: string;
            username: string;
            email: string | null;
            avatarUrl: string | null;
            role: import("../users/entities/user.entity").UserRole;
        } | null;
    }>;
    getMyConversations(currentUser: IUser): Promise<{
        conversationId: string;
        status: SupportConversationStatus;
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
            role: import("../users/entities/user.entity").UserRole;
        };
        assignedStaff: {
            _id: string;
            username: string;
            email: string | null;
            avatarUrl: string | null;
            role: import("../users/entities/user.entity").UserRole;
        } | null;
    }[]>;
    getConversation(currentUser: IUser, id: string): Promise<{
        conversationId: string;
        status: SupportConversationStatus;
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
            role: import("../users/entities/user.entity").UserRole;
        };
        assignedStaff: {
            _id: string;
            username: string;
            email: string | null;
            avatarUrl: string | null;
            role: import("../users/entities/user.entity").UserRole;
        } | null;
    }>;
    getConversationMessages(currentUser: IUser, id: string, limit: number): Promise<{
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
            role: import("../users/entities/user.entity").UserRole;
        };
    }[]>;
    markConversationRead(currentUser: IUser, id: string): Promise<{
        conversationId: string;
        status: SupportConversationStatus;
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
            role: import("../users/entities/user.entity").UserRole;
        };
        assignedStaff: {
            _id: string;
            username: string;
            email: string | null;
            avatarUrl: string | null;
            role: import("../users/entities/user.entity").UserRole;
        } | null;
    }>;
    createMessage(currentUser: IUser, id: string, createSupportMessageDto: CreateSupportMessageDto): Promise<{
        conversation: {
            conversationId: string;
            status: SupportConversationStatus;
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
                role: import("../users/entities/user.entity").UserRole;
            };
            assignedStaff: {
                _id: string;
                username: string;
                email: string | null;
                avatarUrl: string | null;
                role: import("../users/entities/user.entity").UserRole;
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
                role: import("../users/entities/user.entity").UserRole;
            };
        };
    }>;
    getAdminConversations(currentUser: IUser, page: number, limit: number, status?: SupportConversationStatus, search?: string): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        items: {
            conversationId: string;
            status: SupportConversationStatus;
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
                role: import("../users/entities/user.entity").UserRole;
            };
            assignedStaff: {
                _id: string;
                username: string;
                email: string | null;
                avatarUrl: string | null;
                role: import("../users/entities/user.entity").UserRole;
            } | null;
        }[];
    }>;
    startConversationForCustomer(currentUser: IUser, startSupportConversationDto: StartSupportConversationDto): Promise<{
        conversationId: string;
        status: SupportConversationStatus;
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
            role: import("../users/entities/user.entity").UserRole;
        };
        assignedStaff: {
            _id: string;
            username: string;
            email: string | null;
            avatarUrl: string | null;
            role: import("../users/entities/user.entity").UserRole;
        } | null;
    }>;
    assignConversation(currentUser: IUser, id: string): Promise<{
        conversationId: string;
        status: SupportConversationStatus;
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
            role: import("../users/entities/user.entity").UserRole;
        };
        assignedStaff: {
            _id: string;
            username: string;
            email: string | null;
            avatarUrl: string | null;
            role: import("../users/entities/user.entity").UserRole;
        } | null;
    }>;
    updateConversationStatus(currentUser: IUser, id: string, updateSupportConversationStatusDto: UpdateSupportConversationStatusDto): Promise<{
        conversationId: string;
        status: SupportConversationStatus;
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
            role: import("../users/entities/user.entity").UserRole;
        };
        assignedStaff: {
            _id: string;
            username: string;
            email: string | null;
            avatarUrl: string | null;
            role: import("../users/entities/user.entity").UserRole;
        } | null;
    }>;
}
