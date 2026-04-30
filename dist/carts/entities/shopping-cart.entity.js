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
exports.ShoppingCartEntity = void 0;
const typeorm_1 = require("typeorm");
let ShoppingCartEntity = class ShoppingCartEntity {
    cartId;
    userId;
    createdAt;
    updatedAt;
};
exports.ShoppingCartEntity = ShoppingCartEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'cart_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], ShoppingCartEntity.prototype, "cartId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], ShoppingCartEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ShoppingCartEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ShoppingCartEntity.prototype, "updatedAt", void 0);
exports.ShoppingCartEntity = ShoppingCartEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'shopping_carts' })
], ShoppingCartEntity);
//# sourceMappingURL=shopping-cart.entity.js.map