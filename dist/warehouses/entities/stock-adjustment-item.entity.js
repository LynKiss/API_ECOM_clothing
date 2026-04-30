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
exports.StockAdjustmentItemEntity = void 0;
const typeorm_1 = require("typeorm");
const stock_adjustment_entity_1 = require("./stock-adjustment.entity");
let StockAdjustmentItemEntity = class StockAdjustmentItemEntity {
    itemId;
    adjustmentId;
    productId;
    qtyBefore;
    qtyAfter;
    qtyDiff;
    notes;
    adjustment;
};
exports.StockAdjustmentItemEntity = StockAdjustmentItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'item_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], StockAdjustmentItemEntity.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adjustment_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], StockAdjustmentItemEntity.prototype, "adjustmentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], StockAdjustmentItemEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_before', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], StockAdjustmentItemEntity.prototype, "qtyBefore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_after', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], StockAdjustmentItemEntity.prototype, "qtyAfter", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_diff', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], StockAdjustmentItemEntity.prototype, "qtyDiff", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], StockAdjustmentItemEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_adjustment_entity_1.StockAdjustmentEntity, (a) => a.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'adjustment_id' }),
    __metadata("design:type", stock_adjustment_entity_1.StockAdjustmentEntity)
], StockAdjustmentItemEntity.prototype, "adjustment", void 0);
exports.StockAdjustmentItemEntity = StockAdjustmentItemEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'stock_adjustment_items' })
], StockAdjustmentItemEntity);
//# sourceMappingURL=stock-adjustment-item.entity.js.map