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
var SupportChatGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const roles_service_1 = require("../roles/roles.service");
const user_entity_1 = require("../users/entities/user.entity");
const support_chat_constants_1 = require("./support-chat.constants");
const support_chat_publisher_1 = require("./support-chat.publisher");
const support_chat_service_1 = require("./support-chat.service");
let SupportChatGateway = SupportChatGateway_1 = class SupportChatGateway {
    jwtService;
    rolesService;
    supportChatService;
    supportChatPublisher;
    server;
    logger = new common_1.Logger(SupportChatGateway_1.name);
    constructor(jwtService, rolesService, supportChatService, supportChatPublisher) {
        this.jwtService = jwtService;
        this.rolesService = rolesService;
        this.supportChatService = supportChatService;
        this.supportChatPublisher = supportChatPublisher;
    }
    afterInit(server) {
        this.supportChatPublisher.attach(server);
    }
    async handleConnection(client) {
        try {
            const currentUser = await this.authenticateClient(client);
            client.data.user = currentUser;
            client.join((0, support_chat_constants_1.supportChatUserRoom)(currentUser._id));
            if (this.supportChatService.canManageSupport(currentUser)) {
                client.join(support_chat_constants_1.SUPPORT_CHAT_STAFF_ROOM);
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Socket authentication failed';
            this.logger.warn(`Reject support socket ${client.id}: ${message}`);
            client.emit('support:error', { message });
            client.disconnect();
        }
    }
    async handleConversationJoin(client, body) {
        const currentUser = this.getCurrentUser(client);
        const conversationId = body?.conversationId?.trim();
        if (!conversationId) {
            throw new common_1.ForbiddenException('conversationId is required');
        }
        client.join((0, support_chat_constants_1.supportChatConversationRoom)(conversationId));
        await this.supportChatService.markConversationRead(currentUser, conversationId);
        return {
            event: 'conversation:joined',
            data: {
                conversation: await this.supportChatService.getConversation(currentUser, conversationId),
                messages: await this.supportChatService.getConversationMessages(currentUser, conversationId, 100),
            },
        };
    }
    handleConversationLeave(client, body) {
        const conversationId = body?.conversationId?.trim();
        if (conversationId) {
            client.leave((0, support_chat_constants_1.supportChatConversationRoom)(conversationId));
        }
        return {
            event: 'conversation:left',
            data: {
                conversationId,
            },
        };
    }
    async handleConversationRead(client, body) {
        const currentUser = this.getCurrentUser(client);
        const conversationId = body?.conversationId?.trim();
        if (!conversationId) {
            throw new common_1.ForbiddenException('conversationId is required');
        }
        const conversation = await this.supportChatService.markConversationRead(currentUser, conversationId);
        this.supportChatPublisher.emitConversationUpdated(conversation);
        return {
            event: 'conversation:read',
            data: conversation,
        };
    }
    async handleMessageSend(client, body) {
        const currentUser = this.getCurrentUser(client);
        const conversationId = body?.conversationId?.trim();
        const content = body?.content?.trim();
        if (!conversationId || !content) {
            throw new common_1.ForbiddenException('conversationId and content are required');
        }
        client.join((0, support_chat_constants_1.supportChatConversationRoom)(conversationId));
        const result = await this.supportChatService.createMessage(currentUser, conversationId, { content });
        this.supportChatPublisher.emitMessageCreated(result.conversation, result.message);
        return {
            event: 'message:sent',
            data: result,
        };
    }
    getCurrentUser(client) {
        const currentUser = client.data.user;
        if (!currentUser) {
            throw new common_1.UnauthorizedException('Socket user is missing');
        }
        return currentUser;
    }
    async authenticateClient(client) {
        const token = this.extractToken(client);
        if (!token) {
            throw new common_1.UnauthorizedException('Missing access token');
        }
        const payload = await this.jwtService.verifyAsync(token);
        const role = payload.role?._id
            ? await this.rolesService.findOne(payload.role._id)
            : null;
        const currentUser = {
            _id: payload._id,
            username: payload.username,
            email: payload.email,
            role: payload.role,
            permissions: role?.permissions ?? [],
        };
        const isCustomer = currentUser.role?._id === user_entity_1.UserRole.CUSTOMER;
        const canManageSupport = this.supportChatService.canManageSupport(currentUser);
        if (!isCustomer && !canManageSupport) {
            throw new common_1.ForbiddenException('You cannot access support chat');
        }
        return currentUser;
    }
    extractToken(client) {
        const authToken = typeof client.handshake.auth?.token === 'string'
            ? client.handshake.auth.token
            : null;
        const authorizationHeader = client.handshake.headers.authorization;
        if (authToken) {
            return authToken.replace(/^Bearer\s+/i, '').trim();
        }
        if (typeof authorizationHeader === 'string') {
            return authorizationHeader.replace(/^Bearer\s+/i, '').trim();
        }
        return null;
    }
};
exports.SupportChatGateway = SupportChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Function)
], SupportChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('conversation:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], SupportChatGateway.prototype, "handleConversationJoin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('conversation:leave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", void 0)
], SupportChatGateway.prototype, "handleConversationLeave", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('conversation:read'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], SupportChatGateway.prototype, "handleConversationRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message:send'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], SupportChatGateway.prototype, "handleMessageSend", null);
exports.SupportChatGateway = SupportChatGateway = SupportChatGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: support_chat_constants_1.SUPPORT_CHAT_NAMESPACE,
        cors: {
            origin: true,
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        roles_service_1.RolesService,
        support_chat_service_1.SupportChatService,
        support_chat_publisher_1.SupportChatPublisher])
], SupportChatGateway);
//# sourceMappingURL=support-chat.gateway.js.map