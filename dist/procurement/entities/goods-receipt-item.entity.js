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
exports.GoodsReceiptItemEntity = void 0;
const typeorm_1 = require("typeorm");
const goods_receipt_entity_1 = require("./goods-receipt.entity");
let GoodsReceiptItemEntity = class GoodsReceiptItemEntity {
    itemId;
    grId;
    productId;
    variantId;
    unit;
    unitPerBase;
    qtyOrdered;
    qtyReceived;
    qtyDefective;
    qtyReturned;
    refundAmount;
    hasRefund;
    unitPrice;
    landedCost;
    notes;
    receipt;
};
exports.GoodsReceiptItemEntity = GoodsReceiptItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'item_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], GoodsReceiptItemEntity.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gr_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], GoodsReceiptItemEntity.prototype, "grId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], GoodsReceiptItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], GoodsReceiptItemEntity.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit', type: 'varchar', length: 50, default: 'cái' }),
    __metadata("design:type", String)
], GoodsReceiptItemEntity.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_per_base', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "unitPerBase", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_ordered', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "qtyOrdered", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_received', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "qtyReceived", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_defective', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "qtyDefective", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_returned', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], GoodsReceiptItemEntity.prototype, "qtyReturned", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refund_amount', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", String)
], GoodsReceiptItemEntity.prototype, "refundAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_refund', type: 'tinyint', width: 1, default: 1 }),
    __metadata("design:type", Boolean)
], GoodsReceiptItemEntity.prototype, "hasRefund", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_price', type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", String)
], GoodsReceiptItemEntity.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'landed_cost', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", String)
], GoodsReceiptItemEntity.prototype, "landedCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], GoodsReceiptItemEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => goods_receipt_entity_1.GoodsReceiptEntity, (r) => r.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'gr_id' }),
    __metadata("design:type", goods_receipt_entity_1.GoodsReceiptEntity)
], GoodsReceiptItemEntity.prototype, "receipt", void 0);
exports.GoodsReceiptItemEntity = GoodsReceiptItemEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'goods_receipt_items' })
], GoodsReceiptItemEntity);
//# sourceMappingURL=goods-receipt-item.entity.js.map