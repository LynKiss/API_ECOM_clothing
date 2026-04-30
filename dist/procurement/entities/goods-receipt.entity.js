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
exports.GoodsReceiptEntity = exports.GoodsReceiptStatus = void 0;
const typeorm_1 = require("typeorm");
const goods_receipt_item_entity_1 = require("./goods-receipt-item.entity");
var GoodsReceiptStatus;
(function (GoodsReceiptStatus) {
    GoodsReceiptStatus["DRAFT"] = "draft";
    GoodsReceiptStatus["CONFIRMED"] = "confirmed";
    GoodsReceiptStatus["CANCELLED"] = "cancelled";
})(GoodsReceiptStatus || (exports.GoodsReceiptStatus = GoodsReceiptStatus = {}));
let GoodsReceiptEntity = class GoodsReceiptEntity {
    grId;
    grCode;
    poId;
    supplierId;
    receiptDate;
    shippingCost;
    otherCost;
    status;
    notes;
    createdBy;
    items;
    createdAt;
    updatedAt;
};
exports.GoodsReceiptEntity = GoodsReceiptEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'gr_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], GoodsReceiptEntity.prototype, "grId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gr_code', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], GoodsReceiptEntity.prototype, "grCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'po_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], GoodsReceiptEntity.prototype, "poId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], GoodsReceiptEntity.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receipt_date', type: 'date' }),
    __metadata("design:type", Date)
], GoodsReceiptEntity.prototype, "receiptDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_cost', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", String)
], GoodsReceiptEntity.prototype, "shippingCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'other_cost', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", String)
], GoodsReceiptEntity.prototype, "otherCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: GoodsReceiptStatus, default: GoodsReceiptStatus.DRAFT }),
    __metadata("design:type", String)
], GoodsReceiptEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], GoodsReceiptEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], GoodsReceiptEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => goods_receipt_item_entity_1.GoodsReceiptItemEntity, (item) => item.receipt, { cascade: true, eager: false }),
    __metadata("design:type", Array)
], GoodsReceiptEntity.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], GoodsReceiptEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], GoodsReceiptEntity.prototype, "updatedAt", void 0);
exports.GoodsReceiptEntity = GoodsReceiptEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'goods_receipts' })
], GoodsReceiptEntity);
//# sourceMappingURL=goods-receipt.entity.js.map