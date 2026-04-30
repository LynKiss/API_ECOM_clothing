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
exports.SupplierReturnEntity = exports.SupplierReturnStatus = void 0;
const typeorm_1 = require("typeorm");
const supplier_return_item_entity_1 = require("./supplier-return-item.entity");
var SupplierReturnStatus;
(function (SupplierReturnStatus) {
    SupplierReturnStatus["DRAFT"] = "draft";
    SupplierReturnStatus["CONFIRMED"] = "confirmed";
    SupplierReturnStatus["CANCELLED"] = "cancelled";
})(SupplierReturnStatus || (exports.SupplierReturnStatus = SupplierReturnStatus = {}));
let SupplierReturnEntity = class SupplierReturnEntity {
    srId;
    srCode;
    grId;
    supplierId;
    returnDate;
    status;
    totalRefund;
    notes;
    createdBy;
    items;
    createdAt;
    updatedAt;
};
exports.SupplierReturnEntity = SupplierReturnEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'sr_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], SupplierReturnEntity.prototype, "srId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sr_code', type: 'varchar', length: 50, unique: true }),
    __metadata("design:type", String)
], SupplierReturnEntity.prototype, "srCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gr_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], SupplierReturnEntity.prototype, "grId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], SupplierReturnEntity.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'return_date', type: 'date' }),
    __metadata("design:type", Date)
], SupplierReturnEntity.prototype, "returnDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', type: 'enum', enum: SupplierReturnStatus, default: SupplierReturnStatus.DRAFT }),
    __metadata("design:type", String)
], SupplierReturnEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_refund', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", String)
], SupplierReturnEntity.prototype, "totalRefund", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], SupplierReturnEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], SupplierReturnEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => supplier_return_item_entity_1.SupplierReturnItemEntity, (item) => item.supplierReturn, { cascade: true, eager: false }),
    __metadata("design:type", Array)
], SupplierReturnEntity.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], SupplierReturnEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], SupplierReturnEntity.prototype, "updatedAt", void 0);
exports.SupplierReturnEntity = SupplierReturnEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'supplier_returns' })
], SupplierReturnEntity);
//# sourceMappingURL=supplier-return.entity.js.map