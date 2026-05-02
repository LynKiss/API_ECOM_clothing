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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_permission_entity_1 = require("../permissions/entities/user-permission.entity");
const user_permission_override_entity_1 = require("../permissions/entities/user-permission-override.entity");
const user_entity_1 = require("../users/entities/user.entity");
const role_permission_entity_1 = require("./entities/role-permission.entity");
let RolesService = class RolesService {
    rolePermissionsRepository;
    userPermissionsRepository;
    userPermissionOverridesRepository;
    constructor(rolePermissionsRepository, userPermissionsRepository, userPermissionOverridesRepository) {
        this.rolePermissionsRepository = rolePermissionsRepository;
        this.userPermissionsRepository = userPermissionsRepository;
        this.userPermissionOverridesRepository = userPermissionOverridesRepository;
    }
    async findOne(role) {
        const rolePermissions = await this.rolePermissionsRepository.find({
            where: { role },
            order: { permissionId: 'ASC' },
        });
        return {
            _id: role,
            name: role,
            permissions: rolePermissions.map(({ permission }) => this.mapPermission(permission)),
        };
    }
    async findAll() {
        const roles = Object.values(user_entity_1.UserRole);
        return Promise.all(roles.map((role) => this.findOne(role)));
    }
    async findEffectivePermissionsForUser(userId, role) {
        const override = await this.userPermissionOverridesRepository.findOneBy({
            userId,
        });
        if (override) {
            const userPermissions = await this.userPermissionsRepository.find({
                where: { userId },
                order: { permissionId: 'ASC' },
            });
            return userPermissions.map(({ permission }) => this.mapPermission(permission));
        }
        const fullRole = await this.findOne(role);
        return fullRole.permissions;
    }
    mapPermission(permission) {
        return {
            _id: permission.permissionId.toString(),
            key: permission.permissionKey,
            name: permission.permissionName,
        };
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermissionEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_permission_entity_1.UserPermissionEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_permission_override_entity_1.UserPermissionOverrideEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map