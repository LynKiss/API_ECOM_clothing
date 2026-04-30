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
exports.ShippingAddressEntity = void 0;
const typeorm_1 = require("typeorm");
let ShippingAddressEntity = class ShippingAddressEntity {
    shippingAddressId;
    userId;
    recipientName;
    phone;
    addressLine;
    ward;
    district;
    province;
    isDefault;
    createdAt;
    updatedAt;
};
exports.ShippingAddressEntity = ShippingAddressEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'shipping_address_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], ShippingAddressEntity.prototype, "shippingAddressId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], ShippingAddressEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recipient_name', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], ShippingAddressEntity.prototype, "recipientName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone', type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], ShippingAddressEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ShippingAddressEntity.prototype, "addressLine", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ward', type: 'varchar', length: 120, nullable: true }),
    __metadata("design:type", Object)
], ShippingAddressEntity.prototype, "ward", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'district', type: 'varchar', length: 120, nullable: true }),
    __metadata("design:type", Object)
], ShippingAddressEntity.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'province', type: 'varchar', length: 120, nullable: true }),
    __metadata("design:type", Object)
], ShippingAddressEntity.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_default',
        type: 'tinyint',
        width: 1,
        default: () => '0',
    }),
    __metadata("design:type", Boolean)
], ShippingAddressEntity.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ShippingAddressEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ShippingAddressEntity.prototype, "updatedAt", void 0);
exports.ShippingAddressEntity = ShippingAddressEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'shipping_addresses' })
], ShippingAddressEntity);
//# sourceMappingURL=shipping-address.entity.js.map