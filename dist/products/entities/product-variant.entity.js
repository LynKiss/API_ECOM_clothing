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
exports.ProductVariantEntity = void 0;
const typeorm_1 = require("typeorm");
let ProductVariantEntity = class ProductVariantEntity {
    variantId;
    productId;
    sizeId;
    colorId;
    sku;
    barcode;
    price;
    salePrice;
    stockQuantity;
    weightGrams;
    isActive;
    createdAt;
    updatedAt;
};
exports.ProductVariantEntity = ProductVariantEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'variant_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], ProductVariantEntity.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], ProductVariantEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'size_id', type: 'bigint', unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], ProductVariantEntity.prototype, "sizeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'color_id', type: 'bigint', unsigned: true, nullable: true }),
    __metadata("design:type", Object)
], ProductVariantEntity.prototype, "colorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sku', type: 'varchar', length: 120, nullable: true }),
    __metadata("design:type", Object)
], ProductVariantEntity.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'barcode', type: 'varchar', length: 120, nullable: true }),
    __metadata("design:type", Object)
], ProductVariantEntity.prototype, "barcode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'price',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductVariantEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'sale_price',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductVariantEntity.prototype, "salePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_quantity', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductVariantEntity.prototype, "stockQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'weight_grams', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], ProductVariantEntity.prototype, "weightGrams", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', width: 1, default: 1 }),
    __metadata("design:type", Boolean)
], ProductVariantEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ProductVariantEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ProductVariantEntity.prototype, "updatedAt", void 0);
exports.ProductVariantEntity = ProductVariantEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'product_variants' })
], ProductVariantEntity);
//# sourceMappingURL=product-variant.entity.js.map