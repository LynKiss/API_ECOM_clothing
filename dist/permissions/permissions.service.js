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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_permission_entity_1 = require("../roles/entities/role-permission.entity");
const user_entity_1 = require("../users/entities/user.entity");
const permission_entity_1 = require("./entities/permission.entity");
let PermissionsService = class PermissionsService {
    permissionsRepository;
    rolePermissionsRepository;
    constructor(permissionsRepository, rolePermissionsRepository) {
        this.permissionsRepository = permissionsRepository;
        this.rolePermissionsRepository = rolePermissionsRepository;
    }
    async findAll() {
        const permissions = await this.permissionsRepository.find({
            order: { permissionId: 'ASC' },
        });
        return permissions.map((permission) => this.mapPermission(permission));
    }
    async findPermissionsByRole(role) {
        const normalizedRole = this.parseRole(role);
        const rolePermissions = await this.rolePermissionsRepository.find({
            where: { role: normalizedRole },
            order: { permissionId: 'ASC' },
        });
        return {
            role: normalizedRole,
            permissions: rolePermissions.map(({ permission }) => this.mapPermission(permission)),
        };
    }
    async updateRolePermissions(role, updateRolePermissionsDto) {
        const normalizedRole = this.parseRole(role);
        const uniquePermissionIds = [
            ...new Set(updateRolePermissionsDto.permissionIds),
        ];
        const permissions = await this.permissionsRepository.find({
            where: {
                permissionId: (0, typeorm_2.In)(uniquePermissionIds),
            },
            order: { permissionId: 'ASC' },
        });
        if (permissions.length !== uniquePermissionIds.length) {
            throw new common_1.NotFoundException('One or more permissions were not found');
        }
        await this.rolePermissionsRepository.delete({ role: normalizedRole });
        const rolePermissions = permissions.map((permission) => this.rolePermissionsRepository.create({
            role: normalizedRole,
            permissionId: permission.permissionId,
        }));
        await this.rolePermissionsRepository.save(rolePermissions);
        return this.findPermissionsByRole(normalizedRole);
    }
    parseRole(role) {
        const normalizedRole = role.toLowerCase();
        const supportedRoles = Object.values(user_entity_1.UserRole);
        if (!supportedRoles.includes(normalizedRole)) {
            throw new common_1.BadRequestException('Role is invalid');
        }
        return normalizedRole;
    }
    mapPermission(permission) {
        return {
            _id: permission.permissionId.toString(),
            key: permission.permissionKey,
            name: permission.permissionName,
        };
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(permission_entity_1.PermissionEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermissionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map