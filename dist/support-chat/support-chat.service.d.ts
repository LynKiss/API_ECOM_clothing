import { Repository } from 'typeorm';
import { UserRole } from '../users/entities/user.entity';
import type { IUser } from '../users/users.interface';
import { UserEntity } from '../users/entities/user.entity';
import { CreateSupportMessageDto } from './dto/create-support-message.dto';
import { SupportConversationEntity, SupportConversationStatus, SupportChatActorRole } from './entities/support-conversation.entity';
import { SupportMessageEntity } from './entities/support-message.entity';
type ConversationListQuery = {
    page: number;
    limit: number;
    status?: SupportConversationStatus;
    search?: string;
};
export declare class SupportChatService {
    private readonly conversationsRepository;
    private readonly messagesRepository;
    private readonly usersRepository;
    constructor(conversationsRepository: Repository<SupportConversationEntity>, messagesRepository: Repository<SupportMessageEntity>, usersRepository: Repository<UserEntity>);
    canManageSupport(currentUser: IUser): boolean;
    startConversationForCustomer(currentUser: IUser): Promise<{
        conversationId: string;
        status: SupportConversationStatus;
        customerUnreadCount: number;
        staffUnreadCount: number;
        lastMessagePreview: string | null;
        lastMessageSenderRole: SupportChatActorRole | null;
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
    }>;
    startConversationForManager(currentUser: IUser, customerLookup: string): Promise<{
        conversationId: string;
        status: SupportConversationStatus;
        customerUnreadCount: number;
        staffUnreadCount: number;
        lastMessagePreview: string | null;
        lastMessageSenderRole: SupportChatActorRole | null;
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
    }>;
    listMyConversations(currentUser: IUser): Promise<{
        conversationId: string;
        status: SupportConversationStatus;
        customerUnreadCount: number;
        staffUnreadCount: number;
        lastMessagePreview: string | null;
        lastMessageSenderRole: SupportChatActorRole | null;
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
    }[]>;
    listAdminConversations(currentUser: IUser, query: ConversationListQuery): Promise<{
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
            lastMessageSenderRole: SupportChatActorRole | null;
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
        }[];
    }>;
    getConversation(currentUser: IUser, conversationId: string): Promise<{
        conversationId: string;
        status: SupportConversationStatus;
        customerUnreadCount: number;
        staffUnreadCount: number;
        lastMessagePreview: string | null;
        lastMessageSenderRole: SupportChatActorRole | null;
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
    }>;
    getConversationMessages(currentUser: IUser, conversationId: string, limit?: number): Promise<{
        messageId: string;
        conversationId: string;
        content: string;
        senderRole: SupportChatActorRole;
        readAt: Date | null;
        createdAt: Date;
        sender: {
            _id: string;
            username: string;
            email: string | null;
            avatarUrl: string | null;
            role: UserRole;
        };
    }[]>;
    markConversationRead(currentUser: IUser, conversationId: string): Promise<{
        conversationId: string;
        status: SupportConversationStatus;
        customerUnreadCount: number;
        staffUnreadCount: number;
        lastMessagePreview: string | null;
        lastMessageSenderRole: SupportChatActorRole | null;
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
    }>;
    assignConversation(currentUser: IUser, conversationId: string): Promise<{
        conversationId: string;
        status: SupportConversationStatus;
        customerUnreadCount: number;
        staffUnreadCount: number;
        lastMessagePreview: string | null;
        lastMessageSenderRole: SupportChatActorRole | null;
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
    }>;
    updateConversationStatus(currentUser: IUser, conversationId: string, status: SupportConversationStatus): Promise<{
        conversationId: string;
        status: SupportConversationStatus;
        customerUnreadCount: number;
        staffUnreadCount: number;
        lastMessagePreview: string | null;
        lastMessageSenderRole: SupportChatActorRole | null;
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
    }>;
    createMessage(currentUser: IUser, conversationId: string, createMessageDto: CreateSupportMessageDto): Promise<{
        conversation: {
            conversationId: string;
            status: SupportConversationStatus;
            customerUnreadCount: number;
            staffUnreadCount: number;
            lastMessagePreview: string | null;
            lastMessageSenderRole: SupportChatActorRole | null;
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
            senderRole: SupportChatActorRole;
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
    }>;
    private ensureCustomer;
    private ensureManager;
    private findCustomerByLookup;
    private findAccessibleConversation;
    private mapConversationList;
    private mapConversationWithUsers;
    private mapConversation;
    private mapMessageList;
    private mapMessage;
    private mapMessageRecord;
    private mapParticipant;
    private toPreview;
}
export {};
