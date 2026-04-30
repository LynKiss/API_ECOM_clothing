"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSearchModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const discount_entity_1 = require("../discounts/entities/discount.entity");
const news_entity_1 = require("../news/entities/news.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const product_entity_1 = require("../products/entities/product.entity");
const supplier_entity_1 = require("../suppliers/entities/supplier.entity");
const user_entity_1 = require("../users/entities/user.entity");
const warehouse_entity_1 = require("../warehouses/entities/warehouse.entity");
const admin_search_controller_1 = require("./admin-search.controller");
const admin_search_service_1 = require("./admin-search.service");
let AdminSearchModule = class AdminSearchModule {
};
exports.AdminSearchModule = AdminSearchModule;
exports.AdminSearchModule = AdminSearchModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                product_entity_1.ProductEntity,
                order_entity_1.OrderEntity,
                user_entity_1.UserEntity,
                supplier_entity_1.SupplierEntity,
                news_entity_1.NewsEntity,
                discount_entity_1.DiscountEntity,
                warehouse_entity_1.WarehouseEntity,
            ]),
        ],
        controllers: [admin_search_controller_1.AdminSearchController],
        providers: [admin_search_service_1.AdminSearchService],
    })
], AdminSearchModule);
//# sourceMappingURL=admin-search.module.js.map