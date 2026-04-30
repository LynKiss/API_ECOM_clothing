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
exports.PurchaseOrderEntity = exports.PurchaseOrderStatus = void 0;
const typeorm_1 = require("typeorm");
const purchase_order_item_entity_1 = require("./purchase-order-item.entity");
var PurchaseOrderStatus;
(function (PurchaseOrderStatus) {
    PurchaseOrderStatus["DRAFT"] = "draft";
    PurchaseOrderStatus["ORDERED"] = "ordered";
    PurchaseOrderStatus["PARTIAL"] = "partial";
    PurchaseOrderStatus["RECEIVED"] = "received";
    PurchaseOrderStatus["CANCELLED"] = "cancelled";
})(PurchaseOrderStatus || (exports.PurchaseOrderStatus = PurchaseOrderStatus = {}));
let PurchaseOrderEntity = class PurchaseOrderEntity {
    poId;
    poCode;
    supplierId;
    status;
    orderDate;
    expectedDate;
    shippingCost;
    otherCost;
    totalAmount;
    paymentStatus;
    paidAmount;
    paidDate;
    paymentNotes;
    notes;
    createdBy;
    items;
    createdAt;
    updatedAt;
};
exports.PurchaseOrderEntity = PurchaseOrderEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'po_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], PurchaseOrderEntity.prototype, "poId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'po_code', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], PurchaseOrderEntity.prototype, "poCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], PurchaseOrderEntity.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: PurchaseOrderStatus, default: PurchaseOrderStatus.DRAFT }),
    __metadata("design:type", String)
], PurchaseOrderEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], PurchaseOrderEntity.prototype, "orderDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expected_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], PurchaseOrderEntity.prototype, "expectedDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_cost', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", String)
], PurchaseOrderEntity.prototype, "shippingCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'other_cost', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", String)
], PurchaseOrderEntity.prototype, "otherCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", String)
], PurchaseOrderEntity.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_status', type: 'enum', enum: ['unpaid', 'partial', 'paid'], default: 'unpaid' }),
    __metadata("design:type", String)
], PurchaseOrderEntity.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paid_amount', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", String)
], PurchaseOrderEntity.prototype, "paidAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paid_date', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], PurchaseOrderEntity.prototype, "paidDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], PurchaseOrderEntity.prototype, "paymentNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], PurchaseOrderEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], PurchaseOrderEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchase_order_item_entity_1.PurchaseOrderItemEntity, (item) => item.po, { cascade: true, eager: false }),
    __metadata("design:type", Array)
], PurchaseOrderEntity.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], PurchaseOrderEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], PurchaseOrderEntity.prototype, "updatedAt", void 0);
exports.PurchaseOrderEntity = PurchaseOrderEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'purchase_orders' })
], PurchaseOrderEntity);
//# sourceMappingURL=purchase-order.entity.js.map