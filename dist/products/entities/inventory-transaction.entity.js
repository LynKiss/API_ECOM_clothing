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
exports.InventoryTransactionEntity = exports.InventoryTransactionType = void 0;
const typeorm_1 = require("typeorm");
var InventoryTransactionType;
(function (InventoryTransactionType) {
    InventoryTransactionType["IMPORT"] = "import";
    InventoryTransactionType["EXPORT"] = "export";
    InventoryTransactionType["ADJUSTMENT"] = "adjustment";
    InventoryTransactionType["RETURN_IN"] = "return_in";
    InventoryTransactionType["RETURN_OUT"] = "return_out";
    InventoryTransactionType["DAMAGE"] = "damage";
})(InventoryTransactionType || (exports.InventoryTransactionType = InventoryTransactionType = {}));
let InventoryTransactionEntity = class InventoryTransactionEntity {
    transactionId;
    productId;
    variantId;
    performedBy;
    transactionType;
    quantityChange;
    quantityBefore;
    quantityAfter;
    unitCostAtTime;
    referenceType;
    referenceId;
    note;
    relatedOrderId;
    createdAt;
    updatedAt;
};
exports.InventoryTransactionEntity = InventoryTransactionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'transaction_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], InventoryTransactionEntity.prototype, "transactionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], InventoryTransactionEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], InventoryTransactionEntity.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'performed_by', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], InventoryTransactionEntity.prototype, "performedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transaction_type',
        type: 'enum',
        enum: InventoryTransactionType,
    }),
    __metadata("design:type", String)
], InventoryTransactionEntity.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity_change', type: 'int' }),
    __metadata("design:type", Number)
], InventoryTransactionEntity.prototype, "quantityChange", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity_before', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], InventoryTransactionEntity.prototype, "quantityBefore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity_after', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], InventoryTransactionEntity.prototype, "quantityAfter", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'unit_cost_at_time',
        type: 'decimal',
        precision: 15,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Object)
], InventoryTransactionEntity.prototype, "unitCostAtTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_type', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], InventoryTransactionEntity.prototype, "referenceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_id', type: 'varchar', length: 36, nullable: true }),
    __metadata("design:type", Object)
], InventoryTransactionEntity.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'note', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], InventoryTransactionEntity.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'related_order_id',
        type: 'char',
        length: 36,
        nullable: true,
    }),
    __metadata("design:type", Object)
], InventoryTransactionEntity.prototype, "relatedOrderId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], InventoryTransactionEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], InventoryTransactionEntity.prototype, "updatedAt", void 0);
exports.InventoryTransactionEntity = InventoryTransactionEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'inventory_transactions' })
], InventoryTransactionEntity);
//# sourceMappingURL=inventory-transaction.entity.js.map