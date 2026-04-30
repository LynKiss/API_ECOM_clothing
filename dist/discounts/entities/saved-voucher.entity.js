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
exports.SavedVoucherEntity = void 0;
const typeorm_1 = require("typeorm");
let SavedVoucherEntity = class SavedVoucherEntity {
    savedVoucherId;
    userId;
    discountId;
    savedAt;
};
exports.SavedVoucherEntity = SavedVoucherEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'saved_voucher_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], SavedVoucherEntity.prototype, "savedVoucherId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], SavedVoucherEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], SavedVoucherEntity.prototype, "discountId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'saved_at', type: 'datetime' }),
    __metadata("design:type", Date)
], SavedVoucherEntity.prototype, "savedAt", void 0);
exports.SavedVoucherEntity = SavedVoucherEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'saved_vouchers' }),
    (0, typeorm_1.Unique)('uq_saved_vouchers_user_discount', ['userId', 'discountId'])
], SavedVoucherEntity);
//# sourceMappingURL=saved-voucher.entity.js.map