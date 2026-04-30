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
exports.SupportChatController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const create_support_bot_reply_dto_1 = require("./dto/create-support-bot-reply.dto");
const create_support_message_dto_1 = require("./dto/create-support-message.dto");
const start_support_conversation_dto_1 = require("./dto/start-support-conversation.dto");
const update_support_conversation_status_dto_1 = require("./dto/update-support-conversation-status.dto");
const support_bot_service_1 = require("./support-bot.service");
const support_conversation_entity_1 = require("./entities/support-conversation.entity");
const support_chat_publisher_1 = require("./support-chat.publisher");
const support_chat_service_1 = require("./support-chat.service");
let SupportChatController = class SupportChatController {
    supportChatService;
    supportChatPublisher;
    supportBotService;
    constructor(supportChatService, supportChatPublisher, supportBotService) {
        this.supportChatService = supportChatService;
        this.supportChatPublisher = supportChatPublisher;
        this.supportBotService = supportBotService;
    }
    createBotReply(createSupportBotReplyDto) {
        return this.supportBotService.createReply(createSupportBotReplyDto);
    }
    createMyBotReply(currentUser, createSupportBotReplyDto) {
        return this.supportBotService.createReply(createSupportBotReplyDto, currentUser);
    }
    async startMyConversation(currentUser) {
        const conversation = await this.supportChatService.startConversationForCustomer(currentUser);
        this.supportChatPublisher.emitConversationUpdated(conversation);
        return conversation;
    }
    getMyConversations(currentUser) {
        return this.supportChatService.listMyConversations(currentUser);
    }
    getConversation(currentUser, id) {
        return this.supportChatService.getConversation(currentUser, id);
    }
    getConversationMessages(currentUser, id, limit) {
        return this.supportChatService.getConversationMessages(currentUser, id, limit);
    }
    async markConversationRead(currentUser, id) {
        const conversation = await this.supportChatService.markConversationRead(currentUser, id);
        this.supportChatPublisher.emitConversationUpdated(conversation);
        return conversation;
    }
    async createMessage(currentUser, id, createSupportMessageDto) {
        const result = await this.supportChatService.createMessage(currentUser, id, createSupportMessageDto);
        this.supportChatPublisher.emitMessageCreated(result.conversation, result.message);
        return result;
    }
    getAdminConversations(currentUser, page, limit, status, search) {
        return this.supportChatService.listAdminConversations(currentUser, {
            page,
            limit,
            status,
            search,
        });
    }
    async startConversationForCustomer(currentUser, startSupportConversationDto) {
        const conversation = await this.supportChatService.startConversationForManager(currentUser, startSupportConversationDto.customerLookup);
        this.supportChatPublisher.emitConversationUpdated(conversation);
        return conversation;
    }
    async assignConversation(currentUser, id) {
        const conversation = await this.supportChatService.assignConversation(currentUser, id);
        this.supportChatPublisher.emitConversationUpdated(conversation);
        return conversation;
    }
    async updateConversationStatus(currentUser, id, updateSupportConversationStatusDto) {
        const conversation = await this.supportChatService.updateConversationStatus(currentUser, id, updateSupportConversationStatusDto.status);
        this.supportChatPublisher.emitConversationUpdated(conversation);
        return conversation;
    }
};
exports.SupportChatController = SupportChatController;
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Post)('bot/reply'),
    (0, customize_1.ResponseMessage)('Generate support bot reply'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_support_bot_reply_dto_1.CreateSupportBotReplyDto]),
    __metadata("design:returntype", void 0)
], SupportChatController.prototype, "createBotReply", null);
__decorate([
    (0, common_1.Post)('bot/reply/me'),
    (0, customize_1.ResponseMessage)('Generate support bot reply for current user'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_support_bot_reply_dto_1.CreateSupportBotReplyDto]),
    __metadata("design:returntype", void 0)
], SupportChatController.prototype, "createMyBotReply", null);
__decorate([
    (0, common_1.Post)('conversations/me/start'),
    (0, customize_1.ResponseMessage)('Start my support conversation'),
    __param(0, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupportChatController.prototype, "startMyConversation", null);
__decorate([
    (0, common_1.Get)('conversations/me'),
    (0, customize_1.ResponseMessage)('Get my support conversations'),
    __param(0, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SupportChatController.prototype, "getMyConversations", null);
__decorate([
    (0, common_1.Get)('conversations/:id'),
    (0, customize_1.ResponseMessage)('Get support conversation detail'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SupportChatController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Get)('conversations/:id/messages'),
    (0, customize_1.ResponseMessage)('Get support conversation messages'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(100), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", void 0)
], SupportChatController.prototype, "getConversationMessages", null);
__decorate([
    (0, common_1.Patch)('conversations/:id/read'),
    (0, customize_1.ResponseMessage)('Mark support conversation as read'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SupportChatController.prototype, "markConversationRead", null);
__decorate([
    (0, common_1.Post)('conversations/:id/messages'),
    (0, customize_1.ResponseMessage)('Create support message'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_support_message_dto_1.CreateSupportMessageDto]),
    __metadata("design:returntype", Promise)
], SupportChatController.prototype, "createMessage", null);
__decorate([
    (0, common_1.Get)('admin/conversations'),
    (0, customize_1.RequirePermissions)('manage_support'),
    (0, customize_1.ResponseMessage)('Get admin support conversations'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, String, String]),
    __metadata("design:returntype", void 0)
], SupportChatController.prototype, "getAdminConversations", null);
__decorate([
    (0, common_1.Post)('admin/conversations/start'),
    (0, customize_1.RequirePermissions)('manage_support'),
    (0, customize_1.ResponseMessage)('Start support conversation for customer'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, start_support_conversation_dto_1.StartSupportConversationDto]),
    __metadata("design:returntype", Promise)
], SupportChatController.prototype, "startConversationForCustomer", null);
__decorate([
    (0, common_1.Patch)('admin/conversations/:id/assign'),
    (0, customize_1.RequirePermissions)('manage_support'),
    (0, customize_1.ResponseMessage)('Assign support conversation'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SupportChatController.prototype, "assignConversation", null);
__decorate([
    (0, common_1.Patch)('admin/conversations/:id/status'),
    (0, customize_1.RequirePermissions)('manage_support'),
    (0, customize_1.ResponseMessage)('Update support conversation status'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_support_conversation_status_dto_1.UpdateSupportConversationStatusDto]),
    __metadata("design:returntype", Promise)
], SupportChatController.prototype, "updateConversationStatus", null);
exports.SupportChatController = SupportChatController = __decorate([
    (0, common_1.Controller)('support-chat'),
    __metadata("design:paramtypes", [support_chat_service_1.SupportChatService,
        support_chat_publisher_1.SupportChatPublisher,
        support_bot_service_1.SupportBotService])
], SupportChatController);
//# sourceMappingURL=support-chat.controller.js.map