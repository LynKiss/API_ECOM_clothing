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
exports.DeliveryMethodEntity = void 0;
const typeorm_1 = require("typeorm");
let DeliveryMethodEntity = class DeliveryMethodEntity {
    deliveryId;
    name;
    description;
    basePrice;
    minOrderAmount;
    region;
    isActive;
    isDefault;
    createdAt;
    updatedAt;
};
exports.DeliveryMethodEntity = DeliveryMethodEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'delivery_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], DeliveryMethodEntity.prototype, "deliveryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], DeliveryMethodEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], DeliveryMethodEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'base_price',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: '0.00',
    }),
    __metadata("design:type", String)
], DeliveryMethodEntity.prototype, "basePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'min_order_amount',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: '0.00',
    }),
    __metadata("design:type", String)
], DeliveryMethodEntity.prototype, "minOrderAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'region', type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", Object)
], DeliveryMethodEntity.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', width: 1, default: () => '1' }),
    __metadata("design:type", Boolean)
], DeliveryMethodEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_default',
        type: 'tinyint',
        width: 1,
        default: () => '0',
    }),
    __metadata("design:type", Boolean)
], DeliveryMethodEntity.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], DeliveryMethodEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], DeliveryMethodEntity.prototype, "updatedAt", void 0);
exports.DeliveryMethodEntity = DeliveryMethodEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'delivery_methods' })
], DeliveryMethodEntity);
//# sourceMappingURL=delivery-method.entity.js.map