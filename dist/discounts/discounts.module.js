"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const category_entity_1 = require("../categories/entities/category.entity");
const product_entity_1 = require("../products/entities/product.entity");
const discounts_controller_1 = require("./discounts.controller");
const coupon_usage_entity_1 = require("./entities/coupon-usage.entity");
const discount_category_entity_1 = require("./entities/discount-category.entity");
const discount_product_entity_1 = require("./entities/discount-product.entity");
const discount_entity_1 = require("./entities/discount.entity");
const saved_voucher_entity_1 = require("./entities/saved-voucher.entity");
const discounts_service_1 = require("./discounts.service");
let DiscountsModule = class DiscountsModule {
};
exports.DiscountsModule = DiscountsModule;
exports.DiscountsModule = DiscountsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                discount_entity_1.DiscountEntity,
                discount_category_entity_1.DiscountCategoryEntity,
                discount_product_entity_1.DiscountProductEntity,
                coupon_usage_entity_1.CouponUsageEntity,
                saved_voucher_entity_1.SavedVoucherEntity,
                category_entity_1.CategoryEntity,
                product_entity_1.ProductEntity,
            ]),
        ],
        controllers: [discounts_controller_1.DiscountsController],
        providers: [discounts_service_1.DiscountsService],
        exports: [discounts_service_1.DiscountsService, typeorm_1.TypeOrmModule],
    })
], DiscountsModule);
//# sourceMappingURL=discounts.module.js.map