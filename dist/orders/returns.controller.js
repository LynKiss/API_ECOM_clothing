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
exports.ReturnsController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const create_return_dto_1 = require("./dto/create-return.dto");
const inspect_return_dto_1 = require("./dto/inspect-return.dto");
const update_return_status_dto_1 = require("./dto/update-return-status.dto");
const orders_service_1 = require("./orders.service");
let ReturnsController = class ReturnsController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    createReturn(currentUser, createReturnDto) {
        return this.ordersService.createReturn(currentUser._id, createReturnDto);
    }
    getMyReturns(currentUser) {
        return this.ordersService.findMyReturns(currentUser._id);
    }
    getAllReturns() {
        return this.ordersService.findAllReturns();
    }
    updateReturnStatus(currentUser, id, updateReturnStatusDto) {
        return this.ordersService.updateReturnStatus(currentUser, id, updateReturnStatusDto);
    }
    inspectReturn(currentUser, id, dto) {
        return this.ordersService.inspectReturn(currentUser, id, dto.decision, dto.note);
    }
};
exports.ReturnsController = ReturnsController;
__decorate([
    (0, common_1.Post)(),
    (0, customize_1.ResponseMessage)('Create return request'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_return_dto_1.CreateReturnDto]),
    __metadata("design:returntype", void 0)
], ReturnsController.prototype, "createReturn", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, customize_1.ResponseMessage)('Get my returns'),
    __param(0, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReturnsController.prototype, "getMyReturns", null);
__decorate([
    (0, common_1.Get)('admin'),
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, customize_1.ResponseMessage)('Get returns list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReturnsController.prototype, "getAllReturns", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, customize_1.ResponseMessage)('Update return status'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_return_status_dto_1.UpdateReturnStatusDto]),
    __metadata("design:returntype", void 0)
], ReturnsController.prototype, "updateReturnStatus", null);
__decorate([
    (0, common_1.Patch)(':id/inspect'),
    (0, customize_1.RequirePermissions)('manage_orders'),
    (0, customize_1.ResponseMessage)('Inspect returned goods'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, inspect_return_dto_1.InspectReturnDto]),
    __metadata("design:returntype", void 0)
], ReturnsController.prototype, "inspectReturn", null);
exports.ReturnsController = ReturnsController = __decorate([
    (0, common_1.Controller)('returns'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], ReturnsController);
//# sourceMappingURL=returns.controller.js.map