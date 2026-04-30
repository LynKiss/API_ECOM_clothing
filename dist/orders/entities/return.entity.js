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
exports.ReturnEntity = exports.ReturnInspectionStatus = exports.ReturnStatus = void 0;
const typeorm_1 = require("typeorm");
var ReturnStatus;
(function (ReturnStatus) {
    ReturnStatus["REQUESTED"] = "requested";
    ReturnStatus["APPROVED"] = "approved";
    ReturnStatus["REJECTED"] = "rejected";
    ReturnStatus["RECEIVED"] = "received";
    ReturnStatus["INSPECTED"] = "inspected";
    ReturnStatus["REFUNDED"] = "refunded";
})(ReturnStatus || (exports.ReturnStatus = ReturnStatus = {}));
var ReturnInspectionStatus;
(function (ReturnInspectionStatus) {
    ReturnInspectionStatus["PENDING"] = "pending";
    ReturnInspectionStatus["USABLE"] = "usable";
    ReturnInspectionStatus["DAMAGED"] = "damaged";
    ReturnInspectionStatus["RETURN_TO_SUPPLIER"] = "return_to_supplier";
})(ReturnInspectionStatus || (exports.ReturnInspectionStatus = ReturnInspectionStatus = {}));
let ReturnEntity = class ReturnEntity {
    returnId;
    orderId;
    orderItemId;
    userId;
    reason;
    description;
    returnStatus;
    refundAmount;
    inspectionStatus;
    inspectionNote;
    inspectedBy;
    inspectedAt;
    createdAt;
    updatedAt;
};
exports.ReturnEntity = ReturnEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'return_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], ReturnEntity.prototype, "returnId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], ReturnEntity.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_item_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], ReturnEntity.prototype, "orderItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], ReturnEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reason', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], ReturnEntity.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], ReturnEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'return_status',
        type: 'enum',
        enum: ReturnStatus,
        default: ReturnStatus.REQUESTED,
    }),
    __metadata("design:type", String)
], ReturnEntity.prototype, "returnStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'refund_amount',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Object)
], ReturnEntity.prototype, "refundAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'inspection_status',
        type: 'enum',
        enum: ReturnInspectionStatus,
        default: ReturnInspectionStatus.PENDING,
    }),
    __metadata("design:type", String)
], ReturnEntity.prototype, "inspectionStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inspection_note', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], ReturnEntity.prototype, "inspectionNote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inspected_by', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], ReturnEntity.prototype, "inspectedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inspected_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], ReturnEntity.prototype, "inspectedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ReturnEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], ReturnEntity.prototype, "updatedAt", void 0);
exports.ReturnEntity = ReturnEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'returns' })
], ReturnEntity);
//# sourceMappingURL=return.entity.js.map