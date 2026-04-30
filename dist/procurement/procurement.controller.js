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
exports.ProcurementController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const create_gr_dto_1 = require("./dto/create-gr.dto");
const create_po_dto_1 = require("./dto/create-po.dto");
const create_sr_dto_1 = require("./dto/create-sr.dto");
const query_procurement_dto_1 = require("./dto/query-procurement.dto");
const purchase_order_entity_1 = require("./entities/purchase-order.entity");
const procurement_service_1 = require("./procurement.service");
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
let ProcurementController = class ProcurementController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAllPos(query) {
        return this.service.findAllPos(query);
    }
    findOnePo(id) {
        return this.service.findOnePo(id);
    }
    createPo(dto, req) {
        return this.service.createPo(dto, getPerformer(req, getIp(req)));
    }
    updatePoStatus(id, status, req) {
        return this.service.updatePoStatus(id, status, getPerformer(req, getIp(req)));
    }
    findAllGrs(query) {
        return this.service.findAllGrs(query);
    }
    findOneGr(id) {
        return this.service.findOneGr(id);
    }
    createGr(dto, req) {
        return this.service.createGr(dto, getPerformer(req, getIp(req)));
    }
    previewCost(dto) {
        return this.service.previewGrCost(dto);
    }
    confirmGr(id, req) {
        return this.service.confirmGr(id, getPerformer(req, getIp(req)));
    }
    cancelGr(id, req) {
        return this.service.cancelGr(id, getPerformer(req, getIp(req)));
    }
    findAllSrs(query) {
        return this.service.findAllSrs(query);
    }
    findOneSr(id) {
        return this.service.findOneSr(id);
    }
    createSr(dto, req) {
        return this.service.createSr(dto, getPerformer(req, getIp(req)));
    }
    confirmSr(id, req) {
        return this.service.confirmSr(id, getPerformer(req, getIp(req)));
    }
    getCostHistory(productId) {
        return this.service.getCostHistory(productId);
    }
};
exports.ProcurementController = ProcurementController;
__decorate([
    (0, common_1.Get)('purchase-orders'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Get purchase orders'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_procurement_dto_1.QueryProcurementDto]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findAllPos", null);
__decorate([
    (0, common_1.Get)('purchase-orders/:id'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Get purchase order detail'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findOnePo", null);
__decorate([
    (0, common_1.Post)('purchase-orders'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Create purchase order'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_po_dto_1.CreatePoDto, Object]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "createPo", null);
__decorate([
    (0, common_1.Patch)('purchase-orders/:id/status'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Update PO status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "updatePoStatus", null);
__decorate([
    (0, common_1.Get)('goods-receipts'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Get goods receipts'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_procurement_dto_1.QueryProcurementDto]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findAllGrs", null);
__decorate([
    (0, common_1.Get)('goods-receipts/:id'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Get goods receipt detail'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findOneGr", null);
__decorate([
    (0, common_1.Post)('goods-receipts'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Create goods receipt'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_gr_dto_1.CreateGrDto, Object]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "createGr", null);
__decorate([
    (0, common_1.Post)('goods-receipts/preview-cost'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Preview landed cost'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_gr_dto_1.CreateGrDto]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "previewCost", null);
__decorate([
    (0, common_1.Patch)('goods-receipts/:id/confirm'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Confirm goods receipt'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "confirmGr", null);
__decorate([
    (0, common_1.Patch)('goods-receipts/:id/cancel'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Cancel goods receipt'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "cancelGr", null);
__decorate([
    (0, common_1.Get)('supplier-returns'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Get supplier returns'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_procurement_dto_1.QueryProcurementDto]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findAllSrs", null);
__decorate([
    (0, common_1.Get)('supplier-returns/:id'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Get supplier return detail'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findOneSr", null);
__decorate([
    (0, common_1.Post)('supplier-returns'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Create supplier return'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sr_dto_1.CreateSrDto, Object]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "createSr", null);
__decorate([
    (0, common_1.Patch)('supplier-returns/:id/confirm'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Confirm supplier return'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "confirmSr", null);
__decorate([
    (0, common_1.Get)('cost-history/:productId'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Get product cost history'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "getCostHistory", null);
exports.ProcurementController = ProcurementController = __decorate([
    (0, common_1.Controller)('procurement'),
    __metadata("design:paramtypes", [procurement_service_1.ProcurementService])
], ProcurementController);
//# sourceMappingURL=procurement.controller.js.map