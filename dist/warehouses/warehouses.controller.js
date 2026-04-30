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
exports.WarehousesController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const warehouses_service_1 = require("./warehouses.service");
function getPerformer(req, ip) {
    const user = req.user;
    if (!user?._id)
        return undefined;
    return { userId: user._id, username: user.username, ip };
}
function getIp(req) {
    return req.headers?.['x-forwarded-for']?.split(',')[0]?.trim()
        ?? req.ip
        ?? undefined;
}
let WarehousesController = class WarehousesController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return this.service.findAll();
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    getStock(id) {
        return this.service.getStock(id);
    }
    create(dto, req) {
        return this.service.create(dto, getPerformer(req, getIp(req)));
    }
    update(id, dto, req) {
        return this.service.update(id, dto, getPerformer(req, getIp(req)));
    }
    setDefault(id) {
        return this.service.setDefault(id);
    }
    findAllTransfers(page, limit, status) {
        return this.service.findAllTransfers(Number(page ?? 1), Number(limit ?? 20), status);
    }
    findOneTransfer(id) {
        return this.service.findOneTransfer(id);
    }
    createTransfer(dto, req) {
        return this.service.createTransfer(dto, req.user?.userId);
    }
    shipTransfer(id, req) {
        return this.service.shipTransfer(id, req.user?._id, getPerformer(req, getIp(req)));
    }
    receiveTransfer(id, items, req) {
        return this.service.receiveTransfer(id, items, req.user?._id, getPerformer(req, getIp(req)));
    }
    findAllAdjustments(page, limit, status) {
        return this.service.findAllAdjustments(Number(page ?? 1), Number(limit ?? 20), status);
    }
    findOneAdjustment(id) {
        return this.service.findOneAdjustment(id);
    }
    createAdjustment(dto, req) {
        return this.service.createAdjustment(dto, req.user?.userId);
    }
    approveAdjustment(id, req) {
        return this.service.approveAdjustment(id, req.user?._id, getPerformer(req, getIp(req)));
    }
    cancelAdjustment(id) {
        return this.service.cancelAdjustment(id);
    }
};
exports.WarehousesController = WarehousesController;
__decorate([
    (0, common_1.Get)(),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Get warehouses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Get warehouse'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/stock'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Get warehouse stock'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "getStock", null);
__decorate([
    (0, common_1.Post)(),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Create warehouse'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Update warehouse'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/set-default'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Set default warehouse'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "setDefault", null);
__decorate([
    (0, common_1.Get)('transfers/list'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Get stock transfers'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "findAllTransfers", null);
__decorate([
    (0, common_1.Get)('transfers/:id'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Get stock transfer'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "findOneTransfer", null);
__decorate([
    (0, common_1.Post)('transfers'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Create stock transfer'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "createTransfer", null);
__decorate([
    (0, common_1.Patch)('transfers/:id/ship'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Ship stock transfer'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "shipTransfer", null);
__decorate([
    (0, common_1.Patch)('transfers/:id/receive'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Receive stock transfer'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('items')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "receiveTransfer", null);
__decorate([
    (0, common_1.Get)('adjustments/list'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Get stock adjustments'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "findAllAdjustments", null);
__decorate([
    (0, common_1.Get)('adjustments/:id'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Get stock adjustment'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "findOneAdjustment", null);
__decorate([
    (0, common_1.Post)('adjustments'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Create stock adjustment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "createAdjustment", null);
__decorate([
    (0, common_1.Patch)('adjustments/:id/approve'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Approve stock adjustment'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "approveAdjustment", null);
__decorate([
    (0, common_1.Patch)('adjustments/:id/cancel'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Cancel stock adjustment'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "cancelAdjustment", null);
exports.WarehousesController = WarehousesController = __decorate([
    (0, common_1.Controller)('warehouses'),
    __metadata("design:paramtypes", [warehouses_service_1.WarehousesService])
], WarehousesController);
//# sourceMappingURL=warehouses.controller.js.map