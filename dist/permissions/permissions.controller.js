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
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const update_role_permissions_dto_1 = require("./dto/update-role-permissions.dto");
const permissions_service_1 = require("./permissions.service");
let PermissionsController = class PermissionsController {
    permissionsService;
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    getPermissions() {
        return this.permissionsService.findAll();
    }
    getPermissionsByRole(role) {
        return this.permissionsService.findPermissionsByRole(role);
    }
    updateRolePermissions(role, updateRolePermissionsDto) {
        return this.permissionsService.updateRolePermissions(role, updateRolePermissionsDto);
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Get)(),
    (0, customize_1.RequirePermissions)('manage_permissions'),
    (0, customize_1.ResponseMessage)('Get permissions list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "getPermissions", null);
__decorate([
    (0, common_1.Get)('roles/:role'),
    (0, customize_1.RequirePermissions)('manage_permissions'),
    (0, customize_1.ResponseMessage)('Get permissions by role'),
    __param(0, (0, common_1.Param)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "getPermissionsByRole", null);
__decorate([
    (0, common_1.Put)('roles/:role'),
    (0, customize_1.RequirePermissions)('manage_permissions'),
    (0, customize_1.ResponseMessage)('Update permissions by role'),
    __param(0, (0, common_1.Param)('role')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_role_permissions_dto_1.UpdateRolePermissionsDto]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "updateRolePermissions", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, common_1.Controller)('permissions'),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map