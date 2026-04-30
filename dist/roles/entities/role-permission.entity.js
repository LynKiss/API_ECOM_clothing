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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionEntity = void 0;
const typeorm_1 = require("typeorm");
const permission_entity_1 = require("../../permissions/entities/permission.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let RolePermissionEntity = class RolePermissionEntity {
    role;
    permissionId;
    createdAt;
    permission;
};
exports.RolePermissionEntity = RolePermissionEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        name: 'role',
        type: 'enum',
        enum: user_entity_1.UserRole,
    }),
    __metadata("design:type", String)
], RolePermissionEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({
        name: 'permission_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], RolePermissionEntity.prototype, "permissionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], RolePermissionEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => permission_entity_1.PermissionEntity, { eager: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'permission_id', referencedColumnName: 'permissionId' }),
    __metadata("design:type", permission_entity_1.PermissionEntity)
], RolePermissionEntity.prototype, "permission", void 0);
exports.RolePermissionEntity = RolePermissionEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'role_permissions' })
], RolePermissionEntity);
//# sourceMappingURL=role-permission.entity.js.map