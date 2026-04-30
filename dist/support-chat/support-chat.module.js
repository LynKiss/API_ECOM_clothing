"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportChatModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const carts_module_1 = require("../carts/carts.module");
const orders_module_1 = require("../orders/orders.module");
const products_module_1 = require("../products/products.module");
const roles_module_1 = require("../roles/roles.module");
const user_entity_1 = require("../users/entities/user.entity");
const users_module_1 = require("../users/users.module");
const support_bot_service_1 = require("./support-bot.service");
const support_chat_controller_1 = require("./support-chat.controller");
const support_chat_gateway_1 = require("./support-chat.gateway");
const support_chat_publisher_1 = require("./support-chat.publisher");
const support_chat_service_1 = require("./support-chat.service");
const support_conversation_entity_1 = require("./entities/support-conversation.entity");
const support_message_entity_1 = require("./entities/support-message.entity");
let SupportChatModule = class SupportChatModule {
};
exports.SupportChatModule = SupportChatModule;
exports.SupportChatModule = SupportChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                support_conversation_entity_1.SupportConversationEntity,
                support_message_entity_1.SupportMessageEntity,
                user_entity_1.UserEntity,
            ]),
            auth_module_1.AuthModule,
            carts_module_1.CartsModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
        ],
        controllers: [support_chat_controller_1.SupportChatController],
        providers: [
            support_bot_service_1.SupportBotService,
            support_chat_service_1.SupportChatService,
            support_chat_publisher_1.SupportChatPublisher,
            support_chat_gateway_1.SupportChatGateway,
        ],
        exports: [support_chat_service_1.SupportChatService],
    })
], SupportChatModule);
//# sourceMappingURL=support-chat.module.js.map