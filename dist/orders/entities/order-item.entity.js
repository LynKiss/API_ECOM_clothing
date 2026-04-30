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
exports.OrderItemEntity = void 0;
const typeorm_1 = require("typeorm");
let OrderItemEntity = class OrderItemEntity {
    orderItemId;
    orderId;
    productId;
    variantId;
    sku;
    colorName;
    sizeName;
    productName;
    quantity;
    quantityDelivered;
    unitPrice;
    lineTotal;
    createdAt;
    updatedAt;
};
exports.OrderItemEntity = OrderItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'order_item_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], OrderItemEntity.prototype, "orderItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], OrderItemEntity.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], OrderItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], OrderItemEntity.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sku', type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], OrderItemEntity.prototype, "sku", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'color_name', type: 'varchar', length: 80, nullable: true }),
    __metadata("design:type", Object)
], OrderItemEntity.prototype, "colorName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'size_name', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], OrderItemEntity.prototype, "sizeName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], OrderItemEntity.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', type: 'int' }),
    __metadata("design:type", Number)
], OrderItemEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity_delivered', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], OrderItemEntity.prototype, "quantityDelivered", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_price',
        type: 'decimal',
        precision: 15,
        scale: 2,
    }),
    __metadata("design:type", String)
], OrderItemEntity.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'line_total',
        type: 'decimal',
        precision: 15,
        scale: 2,
    }),
    __metadata("design:type", String)
], OrderItemEntity.prototype, "lineTotal", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], OrderItemEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], OrderItemEntity.prototype, "updatedAt", void 0);
exports.OrderItemEntity = OrderItemEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'order_items' })
], OrderItemEntity);
//# sourceMappingURL=order-item.entity.js.map