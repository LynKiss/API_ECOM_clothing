"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const audit_logs_module_1 = require("../audit-logs/audit-logs.module");
const role_permission_entity_1 = require("../roles/entities/role-permission.entity");
const roles_module_1 = require("../roles/roles.module");
const super_admin_module_1 = require("../super-admin/super-admin.module");
const user_entity_1 = require("../users/entities/user.entity");
const users_module_1 = require("../users/users.module");
const permissions_controller_1 = require("./permissions.controller");
const permission_entity_1 = require("./entities/permission.entity");
const user_permission_entity_1 = require("./entities/user-permission.entity");
const user_permission_override_entity_1 = require("./entities/user-permission-override.entity");
const permission_actor_guard_1 = require("./permission-actor.guard");
const permissions_service_1 = require("./permissions.service");
let PermissionsModule = class PermissionsModule {
};
exports.PermissionsModule = PermissionsModule;
exports.PermissionsModule = PermissionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                permission_entity_1.PermissionEntity,
                role_permission_entity_1.RolePermissionEntity,
                user_permission_entity_1.UserPermissionEntity,
                user_permission_override_entity_1.UserPermissionOverrideEntity,
                user_entity_1.UserEntity,
            ]),
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            super_admin_module_1.SuperAdminModule,
            audit_logs_module_1.AuditLogsModule,
            jwt_1.JwtModule.register({}),
        ],
        controllers: [permissions_controller_1.PermissionsController],
        providers: [permissions_service_1.PermissionsService, permission_actor_guard_1.PermissionActorGuard],
        exports: [permissions_service_1.PermissionsService, typeorm_1.TypeOrmModule],
    })
], PermissionsModule);
//# sourceMappingURL=permissions.module.js.map