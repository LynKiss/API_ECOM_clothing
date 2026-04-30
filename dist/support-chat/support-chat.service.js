"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportChatService = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const user_entity_2 = require("../users/entities/user.entity");
const support_conversation_entity_1 = require("./entities/support-conversation.entity");
const support_message_entity_1 = require("./entities/support-message.entity");
let SupportChatService = class SupportChatService {
    conversationsRepository;
    messagesRepository;
    usersRepository;
    constructor(conversationsRepository, messagesRepository, usersRepository) {
        this.conversationsRepository = conversationsRepository;
        this.messagesRepository = messagesRepository;
        this.usersRepository = usersRepository;
    }
    canManageSupport(currentUser) {
        return (currentUser.role?._id === user_entity_1.UserRole.ADMIN ||
            currentUser.permissions.some((permission) => permission.key === 'manage_support'));
    }
    async startConversationForCustomer(currentUser) {
        this.ensureCustomer(currentUser);
        const existingConversation = await this.conversationsRepository.findOne({
            where: {
                customerUserId: currentUser._id,
                status: (0, typeorm_2.In)([
                    support_conversation_entity_1.SupportConversationStatus.WAITING_STAFF,
                    support_conversation_entity_1.SupportConversationStatus.WAITING_CUSTOMER,
                ]),
            },
            order: {
                updatedAt: 'DESC',
            },
        });
        if (existingConversation) {
            return this.mapConversationWithUsers(existingConversation);
        }
        const conversation = this.conversationsRepository.create({
            conversationId: (0, node_crypto_1.randomUUID)(),
            customerUserId: currentUser._id,
            assignedStaffUserId: null,
            status: support_conversation_entity_1.SupportConversationStatus.WAITING_STAFF,
            lastMessagePreview: null,
            lastMessageSenderRole: null,
            lastMessageAt: null,
            customerUnreadCount: 0,
            staffUnreadCount: 0,
            firstResponseAt: null,
            resolvedAt: null,
        });
        const savedConversation = await this.conversationsRepository.save(conversation);
        return this.mapConversationWithUsers(savedConversation);
    }
    async startConversationForManager(currentUser, customerLookup) {
        this.ensureManager(currentUser);
        const customer = await this.findCustomerByLookup(customerLookup);
        const existingConversation = await this.conversationsRepository.findOne({
            where: {
                customerUserId: customer.userId,
                status: (0, typeorm_2.In)([
                    support_conversation_entity_1.SupportConversationStatus.WAITING_STAFF,
                    support_conversation_entity_1.SupportConversationStatus.WAITING_CUSTOMER,
                ]),
            },
            order: {
                updatedAt: 'DESC',
            },
        });
        if (existingConversation) {
            return this.mapConversationWithUsers(existingConversation);
        }
        const conversation = this.conversationsRepository.create({
            conversationId: (0, node_crypto_1.randomUUID)(),
            customerUserId: customer.userId,
            assignedStaffUserId: currentUser._id,
            status: support_conversation_entity_1.SupportConversationStatus.WAITING_STAFF,
            lastMessagePreview: null,
            lastMessageSenderRole: null,
            lastMessageAt: null,
            customerUnreadCount: 0,
            staffUnreadCount: 0,
            firstResponseAt: null,
            resolvedAt: null,
        });
        const savedConversation = await this.conversationsRepository.save(conversation);
        return this.mapConversationWithUsers(savedConversation);
    }
    async listMyConversations(currentUser) {
        this.ensureCustomer(currentUser);
        const conversations = await this.conversationsRepository.find({
            where: { customerUserId: currentUser._id },
            order: {
                lastMessageAt: 'DESC',
                updatedAt: 'DESC',
            },
            take: 20,
        });
        return this.mapConversationList(conversations);
    }
    async listAdminConversations(currentUser, query) {
        this.ensureManager(currentUser);
        const safePage = Math.max(1, query.page || 1);
        const safeLimit = Math.min(50, Math.max(1, query.limit || 20));
        const queryBuilder = this.conversationsRepository.createQueryBuilder('conversation');
        if (query.status) {
            queryBuilder.andWhere('conversation.status = :status', {
                status: query.status,
            });
        }
        if (query.search?.trim()) {
            queryBuilder.leftJoin(user_entity_2.UserEntity, 'customer', 'customer.userId = conversation.customerUserId');
            queryBuilder.andWhere('(conversation.conversationId LIKE :search OR customer.userId LIKE :search OR customer.username LIKE :search OR customer.email LIKE :search)', {
                search: `%${query.search.trim()}%`,
            });
        }
        queryBuilder
            .orderBy('conversation.lastMessageAt', 'DESC')
            .addOrderBy('conversation.updatedAt', 'DESC')
            .skip((safePage - 1) * safeLimit)
            .take(safeLimit);
        const [conversations, total] = await queryBuilder.getManyAndCount();
        const items = await this.mapConversationList(conversations);
        return {
            meta: {
                page: safePage,
                limit: safeLimit,
                total,
                totalPages: Math.max(1, Math.ceil(total / safeLimit)),
            },
            items,
        };
    }
    async getConversation(currentUser, conversationId) {
        const conversation = await this.findAccessibleConversation(currentUser, conversationId);
        return this.mapConversationWithUsers(conversation);
    }
    async getConversationMessages(currentUser, conversationId, limit = 100) {
        await this.findAccessibleConversation(currentUser, conversationId);
        const safeLimit = Math.min(200, Math.max(1, limit || 100));
        const messages = await this.messagesRepository.find({
            where: { conversationId },
            order: { createdAt: 'DESC' },
            take: safeLimit,
        });
        return this.mapMessageList(messages.reverse());
    }
    async markConversationRead(currentUser, conversationId) {
        const conversation = await this.findAccessibleConversation(currentUser, conversationId);
        const now = new Date();
        if (this.canManageSupport(currentUser)) {
            if (conversation.staffUnreadCount > 0) {
                conversation.staffUnreadCount = 0;
                await this.conversationsRepository.save(conversation);
            }
            await this.messagesRepository
                .createQueryBuilder()
                .update(support_message_entity_1.SupportMessageEntity)
                .set({ readAt: now })
                .where('conversation_id = :conversationId', { conversationId })
                .andWhere('sender_role = :senderRole', {
                senderRole: support_conversation_entity_1.SupportChatActorRole.CUSTOMER,
            })
                .andWhere('read_at IS NULL')
                .execute();
        }
        else {
            if (conversation.customerUnreadCount > 0) {
                conversation.customerUnreadCount = 0;
                await this.conversationsRepository.save(conversation);
            }
            await this.messagesRepository
                .createQueryBuilder()
                .update(support_message_entity_1.SupportMessageEntity)
                .set({ readAt: now })
                .where('conversation_id = :conversationId', { conversationId })
                .andWhere('sender_role = :senderRole', {
                senderRole: support_conversation_entity_1.SupportChatActorRole.STAFF,
            })
                .andWhere('read_at IS NULL')
                .execute();
        }
        return this.mapConversationWithUsers(conversation);
    }
    async assignConversation(currentUser, conversationId) {
        this.ensureManager(currentUser);
        const conversation = await this.findAccessibleConversation(currentUser, conversationId);
        conversation.assignedStaffUserId = currentUser._id;
        if (conversation.status === support_conversation_entity_1.SupportConversationStatus.WAITING_STAFF) {
            conversation.status = support_conversation_entity_1.SupportConversationStatus.WAITING_CUSTOMER;
        }
        const savedConversation = await this.conversationsRepository.save(conversation);
        return this.mapConversationWithUsers(savedConversation);
    }
    async updateConversationStatus(currentUser, conversationId, status) {
        this.ensureManager(currentUser);
        const conversation = await this.findAccessibleConversation(currentUser, conversationId);
        conversation.status = status;
        conversation.resolvedAt =
            status === support_conversation_entity_1.SupportConversationStatus.RESOLVED ? new Date() : null;
        if (status === support_conversation_entity_1.SupportConversationStatus.WAITING_CUSTOMER &&
            !conversation.assignedStaffUserId) {
            conversation.assignedStaffUserId = currentUser._id;
        }
        const savedConversation = await this.conversationsRepository.save(conversation);
        return this.mapConversationWithUsers(savedConversation);
    }
    async createMessage(currentUser, conversationId, createMessageDto) {
        const conversation = await this.findAccessibleConversation(currentUser, conversationId);
        const content = createMessageDto.content.trim();
        if (!content) {
            throw new common_1.BadRequestException('Noi dung tin nhan khong duoc de trong');
        }
        const senderRole = this.canManageSupport(currentUser)
            ? support_conversation_entity_1.SupportChatActorRole.STAFF
            : support_conversation_entity_1.SupportChatActorRole.CUSTOMER;
        const now = new Date();
        const message = this.messagesRepository.create({
            messageId: (0, node_crypto_1.randomUUID)(),
            conversationId,
            senderUserId: currentUser._id,
            senderRole,
            content,
            readAt: null,
        });
        const savedMessage = await this.messagesRepository.save(message);
        conversation.lastMessagePreview = this.toPreview(content);
        conversation.lastMessageSenderRole = senderRole;
        conversation.lastMessageAt = now;
        conversation.resolvedAt = null;
        if (senderRole === support_conversation_entity_1.SupportChatActorRole.STAFF) {
            conversation.assignedStaffUserId =
                conversation.assignedStaffUserId ?? currentUser._id;
            conversation.customerUnreadCount += 1;
            conversation.staffUnreadCount = 0;
            conversation.status = support_conversation_entity_1.SupportConversationStatus.WAITING_CUSTOMER;
            conversation.firstResponseAt = conversation.firstResponseAt ?? now;
        }
        else {
            conversation.customerUnreadCount = 0;
            conversation.staffUnreadCount += 1;
            conversation.status = support_conversation_entity_1.SupportConversationStatus.WAITING_STAFF;
        }
        const savedConversation = await this.conversationsRepository.save(conversation);
        return {
            conversation: await this.mapConversationWithUsers(savedConversation),
            message: await this.mapMessage(savedMessage),
        };
    }
    ensureCustomer(currentUser) {
        if (currentUser.role?._id !== user_entity_1.UserRole.CUSTOMER) {
            throw new common_1.ForbiddenException('Chi khach hang moi duoc su dung chat ho tro nay');
        }
    }
    ensureManager(currentUser) {
        if (!this.canManageSupport(currentUser)) {
            throw new common_1.ForbiddenException('Ban khong co quyen quan ly chat ho tro');
        }
    }
    async findCustomerByLookup(customerLookup) {
        const lookup = customerLookup.trim();
        if (!lookup) {
            throw new common_1.BadRequestException('Khong tim thay khach hang');
        }
        const customer = await this.usersRepository.findOne({
            where: [
                { userId: lookup, role: user_entity_1.UserRole.CUSTOMER },
                { username: lookup, role: user_entity_1.UserRole.CUSTOMER },
                { email: lookup, role: user_entity_1.UserRole.CUSTOMER },
            ],
        });
        if (!customer) {
            throw new common_1.NotFoundException('Khach hang khong ton tai');
        }
        return customer;
    }
    async findAccessibleConversation(currentUser, conversationId) {
        const conversation = await this.conversationsRepository.findOneBy({
            conversationId,
        });
        if (!conversation) {
            throw new common_1.NotFoundException('Cuoc tro chuyen khong ton tai');
        }
        if (this.canManageSupport(currentUser)) {
            return conversation;
        }
        if (currentUser.role?._id !== user_entity_1.UserRole.CUSTOMER ||
            conversation.customerUserId !== currentUser._id) {
            throw new common_1.ForbiddenException('Ban khong duoc truy cap cuoc tro chuyen nay');
        }
        return conversation;
    }
    async mapConversationList(conversations) {
        const userIds = [
            ...new Set(conversations.flatMap((conversation) => [
                conversation.customerUserId,
                conversation.assignedStaffUserId,
            ].filter((value) => Boolean(value)))),
        ];
        const users = userIds.length
            ? await this.usersRepository.find({
                where: { userId: (0, typeorm_2.In)(userIds) },
            })
            : [];
        const userMap = new Map(users.map((user) => [user.userId, user]));
        return conversations.map((conversation) => this.mapConversation(conversation, userMap));
    }
    async mapConversationWithUsers(conversation) {
        const userIds = [
            conversation.customerUserId,
            conversation.assignedStaffUserId,
        ].filter((value) => Boolean(value));
        const users = userIds.length
            ? await this.usersRepository.find({
                where: { userId: (0, typeorm_2.In)(userIds) },
            })
            : [];
        const userMap = new Map(users.map((user) => [user.userId, user]));
        return this.mapConversation(conversation, userMap);
    }
    mapConversation(conversation, userMap) {
        const customer = userMap.get(conversation.customerUserId);
        const assignedStaff = conversation.assignedStaffUserId
            ? userMap.get(conversation.assignedStaffUserId)
            : null;
        return {
            conversationId: conversation.conversationId,
            status: conversation.status,
            customerUnreadCount: conversation.customerUnreadCount,
            staffUnreadCount: conversation.staffUnreadCount,
            lastMessagePreview: conversation.lastMessagePreview,
            lastMessageSenderRole: conversation.lastMessageSenderRole,
            lastMessageAt: conversation.lastMessageAt,
            firstResponseAt: conversation.firstResponseAt,
            resolvedAt: conversation.resolvedAt,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
            customer: this.mapParticipant(customer, conversation.customerUserId, user_entity_1.UserRole.CUSTOMER),
            assignedStaff: assignedStaff
                ? this.mapParticipant(assignedStaff, assignedStaff.userId, assignedStaff.role)
                : null,
        };
    }
    async mapMessageList(messages) {
        const userIds = [...new Set(messages.map((message) => message.senderUserId))];
        const users = userIds.length
            ? await this.usersRepository.find({
                where: { userId: (0, typeorm_2.In)(userIds) },
            })
            : [];
        const userMap = new Map(users.map((user) => [user.userId, user]));
        return messages.map((message) => this.mapMessageRecord(message, userMap));
    }
    async mapMessage(message) {
        const users = await this.usersRepository.find({
            where: { userId: (0, typeorm_2.In)([message.senderUserId]) },
        });
        const userMap = new Map(users.map((user) => [user.userId, user]));
        return this.mapMessageRecord(message, userMap);
    }
    mapMessageRecord(message, userMap) {
        const sender = userMap.get(message.senderUserId);
        return {
            messageId: message.messageId,
            conversationId: message.conversationId,
            content: message.content,
            senderRole: message.senderRole,
            readAt: message.readAt,
            createdAt: message.createdAt,
            sender: this.mapParticipant(sender, message.senderUserId, sender?.role ?? user_entity_1.UserRole.CUSTOMER),
        };
    }
    mapParticipant(user, fallbackId, fallbackRole) {
        return {
            _id: user?.userId ?? fallbackId,
            username: user?.username ?? fallbackId,
            email: user?.email ?? null,
            avatarUrl: user?.avatarUrl ?? null,
            role: user?.role ?? fallbackRole,
        };
    }
    toPreview(content) {
        const normalized = content.replace(/\s+/g, ' ').trim();
        if (normalized.length <= 160) {
            return normalized;
        }
        return `${normalized.slice(0, 157)}...`;
    }
};
exports.SupportChatService = SupportChatService;
exports.SupportChatService = SupportChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(support_conversation_entity_1.SupportConversationEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(support_message_entity_1.SupportMessageEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_2.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SupportChatService);
//# sourceMappingURL=support-chat.service.js.map