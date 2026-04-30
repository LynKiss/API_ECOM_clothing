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
exports.ProductBundleItemEntity = exports.ProductBundleEntity = void 0;
const typeorm_1 = require("typeorm");
let ProductBundleEntity = class ProductBundleEntity {
    bundleId;
    bundleCode;
    bundleName;
    description;
    bundlePrice;
    imageUrl;
    isActive;
    createdAt;
    updatedAt;
};
exports.ProductBundleEntity = ProductBundleEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'bundle_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], ProductBundleEntity.prototype, "bundleId", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_bundle_code', { unique: true }),
    (0, typeorm_1.Column)({ name: 'bundle_code', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], ProductBundleEntity.prototype, "bundleCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bundle_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ProductBundleEntity.prototype, "bundleName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ProductBundleEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'bundle_price',
        type: 'decimal',
        precision: 15,
        scale: 2,
    }),
    __metadata("design:type", String)
], ProductBundleEntity.prototype, "bundlePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], ProductBundleEntity.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', width: 1, default: 1 }),
    __metadata("design:type", Boolean)
], ProductBundleEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ProductBundleEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ProductBundleEntity.prototype, "updatedAt", void 0);
exports.ProductBundleEntity = ProductBundleEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'product_bundles' })
], ProductBundleEntity);
let ProductBundleItemEntity = class ProductBundleItemEntity {
    bundleItemId;
    bundleId;
    productId;
    componentQty;
    createdAt;
};
exports.ProductBundleItemEntity = ProductBundleItemEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'bundle_item_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], ProductBundleItemEntity.prototype, "bundleItemId", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_bundle_item_bundle'),
    (0, typeorm_1.Column)({ name: 'bundle_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], ProductBundleItemEntity.prototype, "bundleId", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_bundle_item_product'),
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], ProductBundleItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'component_qty', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], ProductBundleItemEntity.prototype, "componentQty", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ProductBundleItemEntity.prototype, "createdAt", void 0);
exports.ProductBundleItemEntity = ProductBundleItemEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'product_bundle_items' })
], ProductBundleItemEntity);
//# sourceMappingURL=product-bundle.entity.js.map