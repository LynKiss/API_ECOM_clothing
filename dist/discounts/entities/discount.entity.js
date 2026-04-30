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
exports.DiscountEntity = exports.DISCOUNT_APPROVAL_THRESHOLD_FIXED = exports.DISCOUNT_APPROVAL_THRESHOLD_PCT = exports.DiscountApprovalStatus = exports.DiscountApplyTarget = exports.DiscountType = void 0;
const typeorm_1 = require("typeorm");
var DiscountType;
(function (DiscountType) {
    DiscountType["PERCENT"] = "percent";
    DiscountType["FIXED"] = "fixed";
})(DiscountType || (exports.DiscountType = DiscountType = {}));
var DiscountApplyTarget;
(function (DiscountApplyTarget) {
    DiscountApplyTarget["ORDER"] = "order";
    DiscountApplyTarget["CATEGORY"] = "category";
    DiscountApplyTarget["PRODUCT"] = "product";
})(DiscountApplyTarget || (exports.DiscountApplyTarget = DiscountApplyTarget = {}));
var DiscountApprovalStatus;
(function (DiscountApprovalStatus) {
    DiscountApprovalStatus["NOT_REQUIRED"] = "not_required";
    DiscountApprovalStatus["PENDING_APPROVAL"] = "pending_approval";
    DiscountApprovalStatus["APPROVED"] = "approved";
    DiscountApprovalStatus["REJECTED"] = "rejected";
})(DiscountApprovalStatus || (exports.DiscountApprovalStatus = DiscountApprovalStatus = {}));
exports.DISCOUNT_APPROVAL_THRESHOLD_PCT = 30;
exports.DISCOUNT_APPROVAL_THRESHOLD_FIXED = 1_000_000;
let DiscountEntity = class DiscountEntity {
    discountId;
    discountCode;
    discountName;
    discountType;
    appliesTo;
    startAt;
    userId;
    discountDescription;
    discountValue;
    expireDate;
    isActive;
    usageLimit;
    usedCount;
    minOrderValue;
    maxDiscountAmount;
    approvalStatus;
    approvedBy;
    approvedAt;
    approvalNote;
    createdAt;
    updatedAt;
};
exports.DiscountEntity = DiscountEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'discount_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], DiscountEntity.prototype, "discountId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_code', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], DiscountEntity.prototype, "discountCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_name', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], DiscountEntity.prototype, "discountName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_type',
        type: 'enum',
        enum: DiscountType,
        default: DiscountType.PERCENT,
    }),
    __metadata("design:type", String)
], DiscountEntity.prototype, "discountType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'applies_to',
        type: 'enum',
        enum: DiscountApplyTarget,
        default: DiscountApplyTarget.ORDER,
    }),
    __metadata("design:type", String)
], DiscountEntity.prototype, "appliesTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_at', type: 'datetime' }),
    __metadata("design:type", Date)
], DiscountEntity.prototype, "startAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], DiscountEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], DiscountEntity.prototype, "discountDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'discount_value',
        type: 'decimal',
        precision: 15,
        scale: 2,
    }),
    __metadata("design:type", String)
], DiscountEntity.prototype, "discountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expire_date', type: 'datetime' }),
    __metadata("design:type", Date)
], DiscountEntity.prototype, "expireDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', width: 1, default: () => '1' }),
    __metadata("design:type", Boolean)
], DiscountEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usage_limit', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], DiscountEntity.prototype, "usageLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'used_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], DiscountEntity.prototype, "usedCount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'min_order_value',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: '0.00',
    }),
    __metadata("design:type", String)
], DiscountEntity.prototype, "minOrderValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'max_discount_amount',
        type: 'decimal',
        precision: 15,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Object)
], DiscountEntity.prototype, "maxDiscountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'approval_status',
        type: 'enum',
        enum: DiscountApprovalStatus,
        default: DiscountApprovalStatus.NOT_REQUIRED,
    }),
    __metadata("design:type", String)
], DiscountEntity.prototype, "approvalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', type: 'char', length: 36, nullable: true }),
    __metadata("design:type", Object)
], DiscountEntity.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], DiscountEntity.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approval_note', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], DiscountEntity.prototype, "approvalNote", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], DiscountEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], DiscountEntity.prototype, "updatedAt", void 0);
exports.DiscountEntity = DiscountEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'discounts' })
], DiscountEntity);
//# sourceMappingURL=discount.entity.js.map