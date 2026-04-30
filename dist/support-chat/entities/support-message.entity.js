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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportMessageEntity = void 0;
const typeorm_1 = require("typeorm");
const support_conversation_entity_1 = require("./support-conversation.entity");
let SupportMessageEntity = class SupportMessageEntity {
    messageId;
    conversationId;
    senderUserId;
    senderRole;
    content;
    readAt;
    createdAt;
};
exports.SupportMessageEntity = SupportMessageEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'message_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], SupportMessageEntity.prototype, "messageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conversation_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], SupportMessageEntity.prototype, "conversationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sender_user_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], SupportMessageEntity.prototype, "senderUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'sender_role',
        type: 'enum',
        enum: support_conversation_entity_1.SupportChatActorRole,
    }),
    __metadata("design:type", String)
], SupportMessageEntity.prototype, "senderRole", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content', type: 'text' }),
    __metadata("design:type", String)
], SupportMessageEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'read_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], SupportMessageEntity.prototype, "readAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], SupportMessageEntity.prototype, "createdAt", void 0);
exports.SupportMessageEntity = SupportMessageEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'support_chat_messages' })
], SupportMessageEntity);
//# sourceMappingURL=support-message.entity.js.map