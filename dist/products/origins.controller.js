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
exports.OriginsController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const create_origin_dto_1 = require("./dto/create-origin.dto");
const query_origins_dto_1 = require("./dto/query-origins.dto");
const update_origin_dto_1 = require("./dto/update-origin.dto");
const origins_service_1 = require("./origins.service");
let OriginsController = class OriginsController {
    originsService;
    constructor(originsService) {
        this.originsService = originsService;
    }
    getOrigins(query) {
        return this.originsService.findAll(query);
    }
    getOrigin(id) {
        return this.originsService.findOne(id);
    }
    createOrigin(dto) {
        return this.originsService.create(dto);
    }
    updateOrigin(id, dto) {
        return this.originsService.update(id, dto);
    }
    removeOrigin(id) {
        return this.originsService.remove(id);
    }
};
exports.OriginsController = OriginsController;
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)(),
    (0, customize_1.ResponseMessage)('Get origins list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_origins_dto_1.QueryOriginsDto]),
    __metadata("design:returntype", void 0)
], OriginsController.prototype, "getOrigins", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, customize_1.ResponseMessage)('Get origin detail'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OriginsController.prototype, "getOrigin", null);
__decorate([
    (0, common_1.Post)(),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Create origin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_origin_dto_1.CreateOriginDto]),
    __metadata("design:returntype", void 0)
], OriginsController.prototype, "createOrigin", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Update origin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_origin_dto_1.UpdateOriginDto]),
    __metadata("design:returntype", void 0)
], OriginsController.prototype, "updateOrigin", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Delete origin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OriginsController.prototype, "removeOrigin", null);
exports.OriginsController = OriginsController = __decorate([
    (0, common_1.Controller)('origins'),
    __metadata("design:paramtypes", [origins_service_1.OriginsService])
], OriginsController);
//# sourceMappingURL=origins.controller.js.map