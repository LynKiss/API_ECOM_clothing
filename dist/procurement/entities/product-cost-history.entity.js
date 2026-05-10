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
exports.ProductCostHistoryEntity = void 0;
const typeorm_1 = require("typeorm");
let ProductCostHistoryEntity = class ProductCostHistoryEntity {
    historyId;
    productId;
    grId;
    costPerUnit;
    qtyAtReceipt;
    effectiveDate;
    notes;
};
exports.ProductCostHistoryEntity = ProductCostHistoryEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'history_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], ProductCostHistoryEntity.prototype, "historyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], ProductCostHistoryEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gr_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], ProductCostHistoryEntity.prototype, "grId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cost_per_unit', type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", String)
], ProductCostHistoryEntity.prototype, "costPerUnit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_at_receipt', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], ProductCostHistoryEntity.prototype, "qtyAtReceipt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'effective_date', type: 'datetime' }),
    __metadata("design:type", Date)
], ProductCostHistoryEntity.prototype, "effectiveDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ProductCostHistoryEntity.prototype, "notes", void 0);
exports.ProductCostHistoryEntity = ProductCostHistoryEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'product_cost_history' })
], ProductCostHistoryEntity);
//# sourceMappingURL=product-cost-history.entity.js.map