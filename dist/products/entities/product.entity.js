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
exports.ProductEntity = void 0;
const typeorm_1 = require("typeorm");
let ProductEntity = class ProductEntity {
    productId;
    productName;
    productSlug;
    categoryId;
    subcategoryId;
    originId;
    gender;
    material;
    fitType;
    style;
    productPrice;
    productPriceSale;
    quantityAvailable;
    quantityReserved;
    avgCost;
    description;
    ratingAverage;
    ratingCount;
    isShow;
    isFeatured;
    expiredAt;
    unit;
    quantityPerBox;
    barcode;
    boxBarcode;
    costPrice;
    bulkPrice;
    createdAt;
    updatedAt;
};
exports.ProductEntity = ProductEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], ProductEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ProductEntity.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'product_slug',
        type: 'varchar',
        length: 255,
        unique: true,
    }),
    __metadata("design:type", String)
], ProductEntity.prototype, "productSlug", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_products_category'),
    (0, typeorm_1.Column)({ name: 'category_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], ProductEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_products_subcategory'),
    (0, typeorm_1.Column)({
        name: 'subcategory_id',
        type: 'bigint',
        unsigned: true,
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductEntity.prototype, "subcategoryId", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_products_brand'),
    (0, typeorm_1.Column)({
        name: 'brand_id',
        type: 'bigint',
        unsigned: true,
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductEntity.prototype, "originId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'gender',
        type: 'enum',
        enum: ['men', 'women', 'unisex', 'kids'],
        default: 'unisex',
    }),
    __metadata("design:type", String)
], ProductEntity.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'material', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], ProductEntity.prototype, "material", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fit_type', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], ProductEntity.prototype, "fitType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'style', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], ProductEntity.prototype, "style", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_products_price'),
    (0, typeorm_1.Column)({
        name: 'product_price',
        type: 'decimal',
        precision: 15,
        scale: 2,
    }),
    __metadata("design:type", String)
], ProductEntity.prototype, "productPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'product_price_sale',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductEntity.prototype, "productPriceSale", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity_available', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "quantityAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity_reserved', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "quantityReserved", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'avg_cost',
        type: 'decimal',
        precision: 15,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", String)
], ProductEntity.prototype, "avgCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'longtext', nullable: true }),
    __metadata("design:type", Object)
], ProductEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'rating_average',
        type: 'decimal',
        precision: 3,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", String)
], ProductEntity.prototype, "ratingAverage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rating_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductEntity.prototype, "ratingCount", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_products_is_show'),
    (0, typeorm_1.Column)({
        name: 'is_show',
        type: 'tinyint',
        width: 1,
        default: 1,
    }),
    __metadata("design:type", Boolean)
], ProductEntity.prototype, "isShow", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_featured',
        type: 'tinyint',
        width: 1,
        default: 0,
    }),
    __metadata("design:type", Boolean)
], ProductEntity.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_products_expired_at'),
    (0, typeorm_1.Column)({
        name: 'expired_at',
        type: 'date',
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductEntity.prototype, "expiredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit',
        type: 'varchar',
        length: 50,
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductEntity.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'quantity_per_box',
        type: 'int',
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductEntity.prototype, "quantityPerBox", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'barcode',
        type: 'varchar',
        length: 100,
        unique: true,
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductEntity.prototype, "barcode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'box_barcode',
        type: 'varchar',
        length: 100,
        unique: true,
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductEntity.prototype, "boxBarcode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cost_price',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductEntity.prototype, "costPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'bulk_price',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Object)
], ProductEntity.prototype, "bulkPrice", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], ProductEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({
        name: 'updated_at',
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], ProductEntity.prototype, "updatedAt", void 0);
exports.ProductEntity = ProductEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'products' })
], ProductEntity);
//# sourceMappingURL=product.entity.js.map