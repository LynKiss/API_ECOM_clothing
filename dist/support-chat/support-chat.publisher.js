"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportChatPublisher = void 0;
const common_1 = require("@nestjs/common");
const support_chat_constants_1 = require("./support-chat.constants");
let SupportChatPublisher = class SupportChatPublisher {
    server = null;
    attach(server) {
        this.server = server;
    }
    emitConversationUpdated(conversation) {
        if (!this.server) {
            return;
        }
        this.server
            .to((0, support_chat_constants_1.supportChatUserRoom)(conversation.customer._id))
            .emit('support:conversation', conversation);
        this.server
            .to(support_chat_constants_1.SUPPORT_CHAT_STAFF_ROOM)
            .emit('support:conversation', conversation);
        if (conversation.assignedStaff?._id) {
            this.server
                .to((0, support_chat_constants_1.supportChatUserRoom)(conversation.assignedStaff._id))
                .emit('support:conversation', conversation);
        }
    }
    emitMessageCreated(conversation, message) {
        if (!this.server) {
            return;
        }
        this.server
            .to((0, support_chat_constants_1.supportChatConversationRoom)(conversation.conversationId))
            .emit('support:message', {
            conversationId: conversation.conversationId,
            message,
        });
        this.emitConversationUpdated(conversation);
    }
};
exports.SupportChatPublisher = SupportChatPublisher;
exports.SupportChatPublisher = SupportChatPublisher = __decorate([
    (0, common_1.Injectable)()
], SupportChatPublisher);
//# sourceMappingURL=support-chat.publisher.js.map