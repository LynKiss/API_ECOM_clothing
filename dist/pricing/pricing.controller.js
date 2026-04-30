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
exports.PricingController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const price_suggestion_dto_1 = require("./dto/price-suggestion.dto");
const pricing_service_1 = require("./pricing.service");
function getPerformer(req, ip) {
    const user = req.user;
    if (!user?._id)
        return undefined;
    return { userId: user._id, username: user.username, ip };
}
function getIp(req) {
    return req.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ?? req.ip ?? undefined;
}
let PricingController = class PricingController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(page, limit) {
        return this.service.findAll(Number(page ?? 1), Number(limit ?? 20));
    }
    findByProduct(productId) {
        return this.service.findByProduct(productId);
    }
    preview(dto) {
        return this.service.preview(dto);
    }
    calculate(dto, req) {
        return this.service.calculate(dto, req.user?._id);
    }
    applyPrice(id, dto, req) {
        return this.service.applyPrice(id, dto, req.user?._id, getPerformer(req, getIp(req)));
    }
};
exports.PricingController = PricingController;
__decorate([
    (0, common_1.Get)('suggestions'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Get price suggestions'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('suggestions/product/:productId'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Get suggestions by product'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "findByProduct", null);
__decorate([
    (0, common_1.Post)('suggestions/preview'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Preview price calculation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [price_suggestion_dto_1.CalcPriceSuggestionDto]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "preview", null);
__decorate([
    (0, common_1.Post)('suggestions/calculate'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Calculate and save price suggestion'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [price_suggestion_dto_1.CalcPriceSuggestionDto, Object]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "calculate", null);
__decorate([
    (0, common_1.Post)('suggestions/:id/apply'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Apply price to product'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, price_suggestion_dto_1.ApplyPriceDto, Object]),
    __metadata("design:returntype", void 0)
], PricingController.prototype, "applyPrice", null);
exports.PricingController = PricingController = __decorate([
    (0, common_1.Controller)('pricing'),
    __metadata("design:paramtypes", [pricing_service_1.PricingService])
], PricingController);
//# sourceMappingURL=pricing.controller.js.map