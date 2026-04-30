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
exports.SupplierReturnItemEntity = void 0;
const typeorm_1 = require("typeorm");
const supplier_return_entity_1 = require("./supplier-return.entity");
let SupplierReturnItemEntity = class SupplierReturnItemEntity {
    itemId;
    srId;
    productId;
    qtyReturned;
    unitPrice;
    hasRefund;
    refundAmount;
    reason;
    supplierReturn;
};
exports.SupplierReturnItemEntity = SupplierReturnItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'item_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], SupplierReturnItemEntity.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sr_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], SupplierReturnItemEntity.prototype, "srId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], SupplierReturnItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_returned', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SupplierReturnItemEntity.prototype, "qtyReturned", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_price', type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", String)
], SupplierReturnItemEntity.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_refund', type: 'tinyint', width: 1, default: 1 }),
    __metadata("design:type", Boolean)
], SupplierReturnItemEntity.prototype, "hasRefund", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refund_amount', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", String)
], SupplierReturnItemEntity.prototype, "refundAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reason', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], SupplierReturnItemEntity.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_return_entity_1.SupplierReturnEntity, (r) => r.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'sr_id' }),
    __metadata("design:type", supplier_return_entity_1.SupplierReturnEntity)
], SupplierReturnItemEntity.prototype, "supplierReturn", void 0);
exports.SupplierReturnItemEntity = SupplierReturnItemEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'supplier_return_items' })
], SupplierReturnItemEntity);
//# sourceMappingURL=supplier-return-item.entity.js.map