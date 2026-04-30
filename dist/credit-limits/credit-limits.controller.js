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
exports.CreditLimitsController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const credit_limits_service_1 = require("./credit-limits.service");
const upsert_credit_limit_dto_1 = require("./dto/upsert-credit-limit.dto");
let CreditLimitsController = class CreditLimitsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    findAll(page = 1, limit = 20) {
        return this.svc.findAll(+page, +limit);
    }
    findByUser(userId) {
        return this.svc.findByUser(userId);
    }
    upsert(dto) {
        return this.svc.upsert(dto);
    }
    syncDebt(userId) {
        return this.svc.syncDebt(userId);
    }
    recordPayment(dto) {
        return this.svc.recordPayment(dto);
    }
    remove(userId) {
        return this.svc.remove(userId);
    }
};
exports.CreditLimitsController = CreditLimitsController;
__decorate([
    (0, common_1.Get)(),
    (0, customize_1.ResponseMessage)('Get credit limits list'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CreditLimitsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, customize_1.ResponseMessage)('Get credit limit by user'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CreditLimitsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Post)(),
    (0, customize_1.ResponseMessage)('Upsert credit limit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upsert_credit_limit_dto_1.UpsertCreditLimitDto]),
    __metadata("design:returntype", void 0)
], CreditLimitsController.prototype, "upsert", null);
__decorate([
    (0, common_1.Post)('sync-debt/:userId'),
    (0, customize_1.ResponseMessage)('Sync current debt from orders'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CreditLimitsController.prototype, "syncDebt", null);
__decorate([
    (0, common_1.Post)('record-payment'),
    (0, customize_1.ResponseMessage)('Record payment to reduce debt'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upsert_credit_limit_dto_1.RecordPaymentDto]),
    __metadata("design:returntype", void 0)
], CreditLimitsController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Delete)('user/:userId'),
    (0, customize_1.ResponseMessage)('Remove credit limit'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CreditLimitsController.prototype, "remove", null);
exports.CreditLimitsController = CreditLimitsController = __decorate([
    (0, common_1.Controller)('credit-limits'),
    __metadata("design:paramtypes", [credit_limits_service_1.CreditLimitsService])
], CreditLimitsController);
//# sourceMappingURL=credit-limits.controller.js.map