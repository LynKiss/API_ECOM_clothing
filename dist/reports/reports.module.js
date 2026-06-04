"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const category_entity_1 = require("../categories/entities/category.entity");
const comment_entity_1 = require("../comments/entities/comment.entity");
const coupon_usage_entity_1 = require("../discounts/entities/coupon-usage.entity");
const discount_entity_1 = require("../discounts/entities/discount.entity");
const order_item_entity_1 = require("../orders/entities/order-item.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const order_refund_entity_1 = require("../orders/entities/order-refund.entity");
const purchase_order_entity_1 = require("../procurement/entities/purchase-order.entity");
const inventory_transaction_entity_1 = require("../products/entities/inventory-transaction.entity");
const product_entity_1 = require("../products/entities/product.entity");
const rice_diagnosis_history_entity_1 = require("../rice-diagnosis/entities/rice-diagnosis-history.entity");
const roles_module_1 = require("../roles/roles.module");
const dashboard_events_subscriber_1 = require("./dashboard-events.subscriber");
const dashboard_gateway_1 = require("./dashboard.gateway");
const dashboard_publisher_1 = require("./dashboard.publisher");
const user_entity_1 = require("../users/entities/user.entity");
const reports_controller_1 = require("./reports.controller");
const reports_service_1 = require("./reports.service");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            roles_module_1.RolesModule,
            typeorm_1.TypeOrmModule.forFeature([
                order_entity_1.OrderEntity,
                order_refund_entity_1.OrderRefundEntity,
                order_item_entity_1.OrderItemEntity,
                product_entity_1.ProductEntity,
                user_entity_1.UserEntity,
                inventory_transaction_entity_1.InventoryTransactionEntity,
                discount_entity_1.DiscountEntity,
                coupon_usage_entity_1.CouponUsageEntity,
                purchase_order_entity_1.PurchaseOrderEntity,
                category_entity_1.CategoryEntity,
                comment_entity_1.CommentEntity,
                rice_diagnosis_history_entity_1.RiceDiagnosisHistoryEntity,
            ]),
        ],
        controllers: [reports_controller_1.ReportsController],
        providers: [
            reports_service_1.ReportsService,
            dashboard_publisher_1.DashboardPublisher,
            dashboard_gateway_1.DashboardGateway,
            dashboard_events_subscriber_1.DashboardEventsSubscriber,
        ],
    })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map