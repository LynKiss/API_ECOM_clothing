"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cart_item_entity_1 = require("../carts/entities/cart-item.entity");
const coupon_usage_entity_1 = require("../discounts/entities/coupon-usage.entity");
const discount_category_entity_1 = require("../discounts/entities/discount-category.entity");
const discount_product_entity_1 = require("../discounts/entities/discount-product.entity");
const discount_entity_1 = require("../discounts/entities/discount.entity");
const shopping_cart_entity_1 = require("../carts/entities/shopping-cart.entity");
const notifications_module_1 = require("../notifications/notifications.module");
const auth_module_1 = require("../auth/auth.module");
const product_entity_1 = require("../products/entities/product.entity");
const product_variant_entity_1 = require("../products/entities/product-variant.entity");
const color_entity_1 = require("../products/entities/color.entity");
const size_entity_1 = require("../products/entities/size.entity");
const inventory_transaction_entity_1 = require("../products/entities/inventory-transaction.entity");
const roles_module_1 = require("../roles/roles.module");
const warehouse_entity_1 = require("../warehouses/entities/warehouse.entity");
const warehouse_stock_entity_1 = require("../warehouses/entities/warehouse-stock.entity");
const settings_module_1 = require("../settings/settings.module");
const user_entity_1 = require("../users/entities/user.entity");
const delivery_methods_controller_1 = require("./delivery-methods.controller");
const orders_controller_1 = require("./orders.controller");
const payments_controller_1 = require("./payments.controller");
const returns_controller_1 = require("./returns.controller");
const delivery_method_entity_1 = require("./entities/delivery-method.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const order_tracking_entity_1 = require("./entities/order-tracking.entity");
const order_status_history_entity_1 = require("./entities/order-status-history.entity");
const order_entity_1 = require("./entities/order.entity");
const payment_transaction_entity_1 = require("./entities/payment-transaction.entity");
const return_entity_1 = require("./entities/return.entity");
const shipping_address_entity_1 = require("./entities/shipping-address.entity");
const orders_admin_gateway_1 = require("./orders-admin.gateway");
const orders_admin_publisher_1 = require("./orders-admin.publisher");
const orders_service_1 = require("./orders.service");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            notifications_module_1.NotificationsModule,
            roles_module_1.RolesModule,
            settings_module_1.SettingsModule,
            typeorm_1.TypeOrmModule.forFeature([
                delivery_method_entity_1.DeliveryMethodEntity,
                shipping_address_entity_1.ShippingAddressEntity,
                order_entity_1.OrderEntity,
                order_tracking_entity_1.OrderTrackingEntity,
                order_item_entity_1.OrderItemEntity,
                order_status_history_entity_1.OrderStatusHistoryEntity,
                return_entity_1.ReturnEntity,
                shopping_cart_entity_1.ShoppingCartEntity,
                cart_item_entity_1.CartItemEntity,
                product_entity_1.ProductEntity,
                product_variant_entity_1.ProductVariantEntity,
                color_entity_1.ColorEntity,
                size_entity_1.SizeEntity,
                inventory_transaction_entity_1.InventoryTransactionEntity,
                warehouse_entity_1.WarehouseEntity,
                warehouse_stock_entity_1.WarehouseStockEntity,
                user_entity_1.UserEntity,
                discount_entity_1.DiscountEntity,
                discount_category_entity_1.DiscountCategoryEntity,
                discount_product_entity_1.DiscountProductEntity,
                coupon_usage_entity_1.CouponUsageEntity,
                payment_transaction_entity_1.PaymentTransactionEntity,
            ]),
        ],
        controllers: [orders_controller_1.OrdersController, payments_controller_1.PaymentsController, returns_controller_1.ReturnsController, delivery_methods_controller_1.DeliveryMethodsController],
        providers: [orders_service_1.OrdersService, orders_admin_publisher_1.OrdersAdminPublisher, orders_admin_gateway_1.OrdersAdminGateway],
        exports: [orders_service_1.OrdersService, typeorm_1.TypeOrmModule],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map