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
exports.CartItemEntity = void 0;
const typeorm_1 = require("typeorm");
let CartItemEntity = class CartItemEntity {
    cartItemId;
    cartId;
    productId;
    variantId;
    quantity;
    priceAtAdded;
    createdAt;
    updatedAt;
};
exports.CartItemEntity = CartItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'cart_item_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], CartItemEntity.prototype, "cartItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cart_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], CartItemEntity.prototype, "cartId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], CartItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], CartItemEntity.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity', type: 'int' }),
    __metadata("design:type", Number)
], CartItemEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'price_at_added',
        type: 'decimal',
        precision: 15,
        scale: 2,
    }),
    __metadata("design:type", String)
], CartItemEntity.prototype, "priceAtAdded", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], CartItemEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], CartItemEntity.prototype, "updatedAt", void 0);
exports.CartItemEntity = CartItemEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'cart_items' })
], CartItemEntity);
//# sourceMappingURL=cart-item.entity.js.map