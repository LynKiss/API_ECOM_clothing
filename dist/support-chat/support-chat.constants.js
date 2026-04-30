"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORT_CHAT_STAFF_ROOM = exports.SUPPORT_CHAT_NAMESPACE = void 0;
exports.supportChatUserRoom = supportChatUserRoom;
exports.supportChatConversationRoom = supportChatConversationRoom;
exports.SUPPORT_CHAT_NAMESPACE = '/support-chat';
exports.SUPPORT_CHAT_STAFF_ROOM = 'support:staff';
function supportChatUserRoom(userId) {
    return `support:user:${userId}`;
}
function supportChatConversationRoom(conversationId) {
    return `support:conversation:${conversationId}`;
}
//# sourceMappingURL=support-chat.constants.js.map