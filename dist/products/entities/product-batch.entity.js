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
exports.ProductBatchEntity = void 0;
const typeorm_1 = require("typeorm");
let ProductBatchEntity = class ProductBatchEntity {
    batchId;
    productId;
    grId;
    batchCode;
    mfgDate;
    expDate;
    qtyReceived;
    qtyRemaining;
    unitCost;
    note;
    createdAt;
    updatedAt;
};
exports.ProductBatchEntity = ProductBatchEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'batch_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], ProductBatchEntity.prototype, "batchId", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_batch_product'),
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], ProductBatchEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gr_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], ProductBatchEntity.prototype, "grId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_code', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], ProductBatchEntity.prototype, "batchCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mfg_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], ProductBatchEntity.prototype, "mfgDate", void 0);
__decorate([
    (0, typeorm_1.Index)('idx_batch_exp'),
    (0, typeorm_1.Column)({ name: 'exp_date', type: 'date', nullable: true }),
    __metadata("design:type", Object)
], ProductBatchEntity.prototype, "expDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_received', type: 'int' }),
    __metadata("design:type", Number)
], ProductBatchEntity.prototype, "qtyReceived", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qty_remaining', type: 'int' }),
    __metadata("design:type", Number)
], ProductBatchEntity.prototype, "qtyRemaining", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_cost',
        type: 'decimal',
        precision: 15,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", String)
], ProductBatchEntity.prototype, "unitCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'note', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], ProductBatchEntity.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ProductBatchEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ProductBatchEntity.prototype, "updatedAt", void 0);
exports.ProductBatchEntity = ProductBatchEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'product_batches' })
], ProductBatchEntity);
//# sourceMappingURL=product-batch.entity.js.map