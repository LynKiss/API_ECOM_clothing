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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountsController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const apply_coupon_dto_1 = require("./dto/apply-coupon.dto");
const create_discount_dto_1 = require("./dto/create-discount.dto");
const query_available_coupons_dto_1 = require("./dto/query-available-coupons.dto");
const update_discount_dto_1 = require("./dto/update-discount.dto");
const validate_coupon_dto_1 = require("./dto/validate-coupon.dto");
const discounts_service_1 = require("./discounts.service");
let DiscountsController = class DiscountsController {
    discountsService;
    constructor(discountsService) {
        this.discountsService = discountsService;
    }
    getAvailableDiscounts() {
        return this.discountsService.findAvailableOrderDiscounts();
    }
    getDiscountsByProduct(productId) {
        return this.discountsService.findDiscountsByProduct(productId);
    }
    getDiscountsByCategory(categoryId) {
        return this.discountsService.findDiscountsByCategory(categoryId);
    }
    validateCoupon(user, dto) {
        return this.discountsService.validateCoupon(user._id, dto);
    }
    applyCoupon(user, dto) {
        return this.discountsService.applyCoupon(user._id, dto);
    }
    getAvailableCouponsForCart(user, dto) {
        return this.discountsService.findAvailableCouponsForUser(user._id, dto);
    }
    getUserCouponHistory(user) {
        return this.discountsService.getUserCouponHistory(user._id);
    }
    getMySavedVouchers(user) {
        return this.discountsService.getSavedVouchers(user._id);
    }
    saveVoucher(id, user) {
        return this.discountsService.saveVoucher(user._id, id);
    }
    getDiscountsForAdmin() {
        return this.discountsService.findAllForAdmin();
    }
    getDiscountDetail(id) {
        return this.discountsService.findOne(id);
    }
    getDiscountStats(id) {
        return this.discountsService.getDiscountStats(id);
    }
    createDiscount(dto) {
        return this.discountsService.create(dto);
    }
    approveDiscount(id, user, note) {
        return this.discountsService.approveDiscount(id, user._id, note);
    }
    rejectDiscount(id, user, note) {
        return this.discountsService.rejectDiscount(id, user._id, note);
    }
    updateDiscount(id, dto) {
        return this.discountsService.update(id, dto);
    }
    toggleActive(id) {
        return this.discountsService.toggleActive(id);
    }
    removeDiscount(id) {
        return this.discountsService.remove(id);
    }
};
exports.DiscountsController = DiscountsController;
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)(),
    (0, customize_1.ResponseMessage)('Get available discounts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "getAvailableDiscounts", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)('by-product/:productId'),
    (0, customize_1.ResponseMessage)('Get discounts by product'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "getDiscountsByProduct", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)('by-category/:categoryId'),
    (0, customize_1.ResponseMessage)('Get discounts by category'),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "getDiscountsByCategory", null);
__decorate([
    (0, common_1.Post)('validate'),
    (0, customize_1.SkipCheckPermission)(),
    (0, customize_1.ResponseMessage)('Validate coupon code'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, validate_coupon_dto_1.ValidateCouponDto]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "validateCoupon", null);
__decorate([
    (0, common_1.Post)('apply'),
    (0, customize_1.SkipCheckPermission)(),
    (0, customize_1.ResponseMessage)('Apply coupon to order'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, apply_coupon_dto_1.ApplyCouponDto]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "applyCoupon", null);
__decorate([
    (0, common_1.Post)('available-for-cart'),
    (0, customize_1.SkipCheckPermission)(),
    (0, customize_1.ResponseMessage)('Get coupons available for current cart'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_available_coupons_dto_1.QueryAvailableCouponsDto]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "getAvailableCouponsForCart", null);
__decorate([
    (0, common_1.Get)('my-history'),
    (0, customize_1.SkipCheckPermission)(),
    (0, customize_1.ResponseMessage)('Get my coupon usage history'),
    __param(0, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "getUserCouponHistory", null);
__decorate([
    (0, common_1.Get)('my-saved'),
    (0, customize_1.SkipCheckPermission)(),
    (0, customize_1.ResponseMessage)('Get my saved vouchers'),
    __param(0, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "getMySavedVouchers", null);
__decorate([
    (0, common_1.Post)(':id/save'),
    (0, customize_1.SkipCheckPermission)(),
    (0, customize_1.ResponseMessage)('Save voucher'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "saveVoucher", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, customize_1.RequirePermissions)('manage_discounts'),
    (0, customize_1.ResponseMessage)('Get discounts for admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "getDiscountsForAdmin", null);
__decorate([
    (0, common_1.Get)('admin/:id'),
    (0, customize_1.RequirePermissions)('manage_discounts'),
    (0, customize_1.ResponseMessage)('Get discount detail'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "getDiscountDetail", null);
__decorate([
    (0, common_1.Get)('admin/:id/stats'),
    (0, customize_1.RequirePermissions)('manage_discounts'),
    (0, customize_1.ResponseMessage)('Get discount statistics'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "getDiscountStats", null);
__decorate([
    (0, common_1.Post)(),
    (0, customize_1.RequirePermissions)('manage_discounts'),
    (0, customize_1.ResponseMessage)('Create discount'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_discount_dto_1.CreateDiscountDto]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "createDiscount", null);
__decorate([
    (0, common_1.Patch)('admin/:id/approve'),
    (0, customize_1.RequirePermissions)('manage_discounts'),
    (0, customize_1.ResponseMessage)('Approve high-discount'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, customize_1.User)()),
    __param(2, (0, common_1.Body)('note')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "approveDiscount", null);
__decorate([
    (0, common_1.Patch)('admin/:id/reject'),
    (0, customize_1.RequirePermissions)('manage_discounts'),
    (0, customize_1.ResponseMessage)('Reject high-discount'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, customize_1.User)()),
    __param(2, (0, common_1.Body)('note')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "rejectDiscount", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, customize_1.RequirePermissions)('manage_discounts'),
    (0, customize_1.ResponseMessage)('Update discount'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_discount_dto_1.UpdateDiscountDto]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "updateDiscount", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    (0, customize_1.RequirePermissions)('manage_discounts'),
    (0, customize_1.ResponseMessage)('Toggle discount active status'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, customize_1.RequirePermissions)('manage_discounts'),
    (0, customize_1.ResponseMessage)('Delete discount'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DiscountsController.prototype, "removeDiscount", null);
exports.DiscountsController = DiscountsController = __decorate([
    (0, common_1.Controller)('discounts'),
    __metadata("design:paramtypes", [discounts_service_1.DiscountsService])
], DiscountsController);
//# sourceMappingURL=discounts.controller.js.map