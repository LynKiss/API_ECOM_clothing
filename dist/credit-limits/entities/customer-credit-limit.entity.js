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
exports.CustomerCreditLimitEntity = void 0;
const typeorm_1 = require("typeorm");
let CustomerCreditLimitEntity = class CustomerCreditLimitEntity {
    limitId;
    userId;
    creditLimit;
    currentDebt;
    paymentTerms;
    isActive;
    notes;
    createdAt;
    updatedAt;
};
exports.CustomerCreditLimitEntity = CustomerCreditLimitEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'limit_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], CustomerCreditLimitEntity.prototype, "limitId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'char', length: 36, unique: true }),
    __metadata("design:type", String)
], CustomerCreditLimitEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'credit_limit', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", String)
], CustomerCreditLimitEntity.prototype, "creditLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_debt', type: 'decimal', precision: 15, scale: 2, nullable: true, default: 0 }),
    __metadata("design:type", String)
], CustomerCreditLimitEntity.prototype, "currentDebt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_terms', type: 'int', default: 30 }),
    __metadata("design:type", Number)
], CustomerCreditLimitEntity.prototype, "paymentTerms", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', width: 1, default: 1 }),
    __metadata("design:type", Boolean)
], CustomerCreditLimitEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'notes', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], CustomerCreditLimitEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], CustomerCreditLimitEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], CustomerCreditLimitEntity.prototype, "updatedAt", void 0);
exports.CustomerCreditLimitEntity = CustomerCreditLimitEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'customer_credit_limits' })
], CustomerCreditLimitEntity);
//# sourceMappingURL=customer-credit-limit.entity.js.map