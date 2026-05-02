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
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
const role_permission_entity_1 = require("../roles/entities/role-permission.entity");
const user_entity_1 = require("../users/entities/user.entity");
const users_service_1 = require("../users/users.service");
const permission_entity_1 = require("./entities/permission.entity");
const user_permission_entity_1 = require("./entities/user-permission.entity");
const user_permission_override_entity_1 = require("./entities/user-permission-override.entity");
let PermissionsService = class PermissionsService {
    permissionsRepository;
    rolePermissionsRepository;
    userPermissionsRepository;
    userPermissionOverridesRepository;
    usersRepository;
    usersService;
    auditLogsService;
    constructor(permissionsRepository, rolePermissionsRepository, userPermissionsRepository, userPermissionOverridesRepository, usersRepository, usersService, auditLogsService) {
        this.permissionsRepository = permissionsRepository;
        this.rolePermissionsRepository = rolePermissionsRepository;
        this.userPermissionsRepository = userPermissionsRepository;
        this.userPermissionOverridesRepository = userPermissionOverridesRepository;
        this.usersRepository = usersRepository;
        this.usersService = usersService;
        this.auditLogsService = auditLogsService;
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
    async findAssignableUsers(actor) {
        const users = await this.usersRepository.find({
            where: [{ role: user_entity_1.UserRole.ADMIN }, { role: user_entity_1.UserRole.STAFF }],
            order: { createdAt: 'DESC' },
        });
        return Promise.all(users.map(async (user) => {
            const permissions = await this.findEffectivePermissionsForUserEntity(user);
            return {
                _id: user.userId,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: { _id: user.role, name: user.role },
                isActive: user.isActive,
                isSelf: actor.type === 'user' ? actor.user._id === user.userId : false,
                permissions,
            };
        }));
    }
    async findPermissionsByUser(userId) {
        const user = await this.findAssignableUserOrThrow(userId);
        const [permissions, override] = await Promise.all([
            this.findEffectivePermissionsForUserEntity(user),
            this.userPermissionOverridesRepository.findOneBy({ userId }),
        ]);
        return {
            user: {
                _id: user.userId,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: { _id: user.role, name: user.role },
                isActive: user.isActive,
            },
            source: override ? 'user' : 'role',
            permissions,
        };
    }
    async updateUserPermissions(actor, userId, dto, ipAddress) {
        const target = await this.findAssignableUserOrThrow(userId);
        if (actor.type === 'user' && actor.user._id === userId) {
            throw new common_1.BadRequestException('Khong the tu phan quyen cho chinh minh');
        }
        const uniquePermissionIds = [...new Set(dto.permissionIds)];
        const permissions = uniquePermissionIds.length
            ? await this.permissionsRepository.find({
                where: { permissionId: (0, typeorm_2.In)(uniquePermissionIds) },
                order: { permissionId: 'ASC' },
            })
            : [];
        if (permissions.length !== uniquePermissionIds.length) {
            throw new common_1.NotFoundException('One or more permissions were not found');
        }
        if (actor.type === 'user') {
            const actorPermissionIds = new Set(actor.user.permissions.map((permission) => permission._id));
            const actorPermissionKeys = new Set(actor.user.permissions.map((permission) => permission.key));
            const canGrantAll = permissions.every((permission) => actorPermissionIds.has(permission.permissionId.toString()) ||
                actorPermissionKeys.has(permission.permissionKey));
            if (!canGrantAll) {
                throw new common_1.ForbiddenException('Khong the cap quyen vuot qua quyen hien co');
            }
        }
        const before = await this.findPermissionsByUser(userId);
        await this.userPermissionsRepository.delete({ userId });
        await this.userPermissionOverridesRepository.save(this.userPermissionOverridesRepository.create({
            userId,
            updatedBy: this.actorId(actor),
            updatedAt: new Date(),
        }));
        if (permissions.length > 0) {
            await this.userPermissionsRepository.save(permissions.map((permission) => this.userPermissionsRepository.create({
                userId,
                permissionId: permission.permissionId,
                grantedBy: this.actorId(actor),
                createdAt: new Date(),
            })));
        }
        await this.usersService.revokeActiveRefreshTokens(userId);
        const after = await this.findPermissionsByUser(userId);
        await this.auditLogsService.log({
            changedBy: this.actorId(actor),
            entityType: 'user_permissions',
            entityId: target.userId,
            action: 'update',
            beforeData: {
                permissionKeys: before.permissions.map((permission) => permission.key),
            },
            afterData: {
                permissionKeys: after.permissions.map((permission) => permission.key),
            },
            ipAddress,
            notes: actor.type === 'super_admin'
                ? 'Updated by super admin'
                : 'Updated by admin',
        });
        return after;
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
    async findAssignableUserOrThrow(userId) {
        const user = await this.usersRepository.findOneBy({ userId });
        if (!user) {
            throw new common_1.NotFoundException('Nguoi dung khong ton tai');
        }
        if (![user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.STAFF].includes(user.role)) {
            throw new common_1.BadRequestException('Chi ho tro phan quyen cho admin/staff');
        }
        return user;
    }
    async findEffectivePermissionsForUserEntity(user) {
        const override = await this.userPermissionOverridesRepository.findOneBy({
            userId: user.userId,
        });
        if (override) {
            const userPermissions = await this.userPermissionsRepository.find({
                where: { userId: user.userId },
                order: { permissionId: 'ASC' },
            });
            return userPermissions.map(({ permission }) => this.mapPermission(permission));
        }
        return (await this.findPermissionsByRole(user.role)).permissions;
    }
    actorId(actor) {
        return actor.type === 'super_admin'
            ? `super:${actor.superAdmin._id}`
            : actor.user._id;
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
    __param(2, (0, typeorm_1.InjectRepository)(user_permission_entity_1.UserPermissionEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(user_permission_override_entity_1.UserPermissionOverrideEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        audit_logs_service_1.AuditLogsService])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map