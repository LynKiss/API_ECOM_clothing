"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const contact_entity_1 = require("../contacts/entities/contact.entity");
const cart_item_entity_1 = require("../carts/entities/cart-item.entity");
const shopping_cart_entity_1 = require("../carts/entities/shopping-cart.entity");
const notification_entity_1 = require("../notifications/entities/notification.entity");
const order_item_entity_1 = require("../orders/entities/order-item.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const payment_transaction_entity_1 = require("../orders/entities/payment-transaction.entity");
const return_entity_1 = require("../orders/entities/return.entity");
const shipping_address_entity_1 = require("../orders/entities/shipping-address.entity");
const wishlist_entity_1 = require("../products/entities/wishlist.entity");
const refresh_token_entity_1 = require("./entities/refresh-token.entity");
const user_entity_1 = require("./entities/user.entity");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.UserEntity,
                refresh_token_entity_1.RefreshTokenEntity,
                contact_entity_1.ContactEntity,
                shopping_cart_entity_1.ShoppingCartEntity,
                cart_item_entity_1.CartItemEntity,
                notification_entity_1.NotificationEntity,
                shipping_address_entity_1.ShippingAddressEntity,
                order_entity_1.OrderEntity,
                order_item_entity_1.OrderItemEntity,
                payment_transaction_entity_1.PaymentTransactionEntity,
                return_entity_1.ReturnEntity,
                wishlist_entity_1.WishlistEntity,
            ]),
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService, typeorm_1.TypeOrmModule],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map