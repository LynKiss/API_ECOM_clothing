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
exports.SupportConversationEntity = exports.SupportChatActorRole = exports.SupportConversationStatus = void 0;
const typeorm_1 = require("typeorm");
var SupportConversationStatus;
(function (SupportConversationStatus) {
    SupportConversationStatus["WAITING_STAFF"] = "waiting_staff";
    SupportConversationStatus["WAITING_CUSTOMER"] = "waiting_customer";
    SupportConversationStatus["RESOLVED"] = "resolved";
})(SupportConversationStatus || (exports.SupportConversationStatus = SupportConversationStatus = {}));
var SupportChatActorRole;
(function (SupportChatActorRole) {
    SupportChatActorRole["CUSTOMER"] = "customer";
    SupportChatActorRole["STAFF"] = "staff";
})(SupportChatActorRole || (exports.SupportChatActorRole = SupportChatActorRole = {}));
let SupportConversationEntity = class SupportConversationEntity {
    conversationId;
    customerUserId;
    assignedStaffUserId;
    status;
    lastMessagePreview;
    lastMessageSenderRole;
    lastMessageAt;
    customerUnreadCount;
    staffUnreadCount;
    firstResponseAt;
    resolvedAt;
    createdAt;
    updatedAt;
};
exports.SupportConversationEntity = SupportConversationEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'conversation_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], SupportConversationEntity.prototype, "conversationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_user_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], SupportConversationEntity.prototype, "customerUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'assigned_staff_user_id',
        type: 'char',
        length: 36,
        nullable: true,
    }),
    __metadata("design:type", Object)
], SupportConversationEntity.prototype, "assignedStaffUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'enum',
        enum: SupportConversationStatus,
        default: SupportConversationStatus.WAITING_STAFF,
    }),
    __metadata("design:type", String)
], SupportConversationEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'last_message_preview',
        type: 'varchar',
        length: 500,
        nullable: true,
    }),
    __metadata("design:type", Object)
], SupportConversationEntity.prototype, "lastMessagePreview", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'last_message_sender_role',
        type: 'enum',
        enum: SupportChatActorRole,
        nullable: true,
    }),
    __metadata("design:type", Object)
], SupportConversationEntity.prototype, "lastMessageSenderRole", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_message_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], SupportConversationEntity.prototype, "lastMessageAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'customer_unread_count',
        type: 'int',
        unsigned: true,
        default: () => '0',
    }),
    __metadata("design:type", Number)
], SupportConversationEntity.prototype, "customerUnreadCount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'staff_unread_count',
        type: 'int',
        unsigned: true,
        default: () => '0',
    }),
    __metadata("design:type", Number)
], SupportConversationEntity.prototype, "staffUnreadCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_response_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], SupportConversationEntity.prototype, "firstResponseAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resolved_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], SupportConversationEntity.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], SupportConversationEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], SupportConversationEntity.prototype, "updatedAt", void 0);
exports.SupportConversationEntity = SupportConversationEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'support_chat_conversations' })
], SupportConversationEntity);
//# sourceMappingURL=support-conversation.entity.js.map