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
exports.PurchaseOrderItemEntity = void 0;
const typeorm_1 = require("typeorm");
const purchase_order_entity_1 = require("./purchase-order.entity");
let PurchaseOrderItemEntity = class PurchaseOrderItemEntity {
    itemId;
    poId;
    productId;
    variantId;
    unit;
    unitPerBase;
    qtyOrdered;
    qtyReceived;
    unitPrice;
    notes;
    po;
};
exports.PurchaseOrderItemEntity = PurchaseOrderItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'item_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], PurchaseOrderItemEntity.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'po_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], PurchaseOrderItemEntity.prototype, "poId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], PurchaseOrderItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], PurchaseOrderItemEntity.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit', type: 'varchar', length: 50, default: 'cái' }),
    __metadata("design:type", String)
], PurchaseOrderItemEntity.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_per_base', type: 'int', default: 1 }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "unitPerBase", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_ordered', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "qtyOrdered", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_received', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PurchaseOrderItemEntity.prototype, "qtyReceived", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_price', type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", String)
], PurchaseOrderItemEntity.prototype, "unitPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], PurchaseOrderItemEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_order_entity_1.PurchaseOrderEntity, (po) => po.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'po_id' }),
    __metadata("design:type", purchase_order_entity_1.PurchaseOrderEntity)
], PurchaseOrderItemEntity.prototype, "po", void 0);
exports.PurchaseOrderItemEntity = PurchaseOrderItemEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'purchase_order_items' })
], PurchaseOrderItemEntity);
//# sourceMappingURL=purchase-order-item.entity.js.map