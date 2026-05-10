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
exports.UserEntity = exports.MembershipTier = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const refresh_token_entity_1 = require("./refresh-token.entity");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["STAFF"] = "staff";
    UserRole["CUSTOMER"] = "customer";
})(UserRole || (exports.UserRole = UserRole = {}));
var MembershipTier;
(function (MembershipTier) {
    MembershipTier["NONE"] = "none";
    MembershipTier["SILVER"] = "silver";
    MembershipTier["GOLD"] = "gold";
    MembershipTier["DIAMOND"] = "diamond";
})(MembershipTier || (exports.MembershipTier = MembershipTier = {}));
let UserEntity = class UserEntity {
    userId;
    username;
    email;
    fullName;
    phoneNumber;
    avatarUrl;
    role;
    passwordHash;
    provider;
    providerId;
    isActive;
    resetPasswordCode;
    resetPasswordExpiresAt;
    membershipTier;
    totalSpent;
    createdAt;
    updatedAt;
    refreshTokens;
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'user_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], UserEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'username', type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", Object)
], UserEntity.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number', type: 'varchar', length: 30, nullable: true }),
    __metadata("design:type", Object)
], UserEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], UserEntity.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'role',
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'password_hash',
        type: 'varchar',
        length: 255,
        nullable: true,
    }),
    __metadata("design:type", Object)
], UserEntity.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'provider', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], UserEntity.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'provider_id', type: 'varchar', length: 191, nullable: true }),
    __metadata("design:type", Object)
], UserEntity.prototype, "providerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', width: 1, default: () => '1' }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'reset_password_code',
        type: 'varchar',
        length: 100,
        nullable: true,
    }),
    __metadata("design:type", Object)
], UserEntity.prototype, "resetPasswordCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'reset_password_expires_at',
        type: 'datetime',
        nullable: true,
    }),
    __metadata("design:type", Object)
], UserEntity.prototype, "resetPasswordExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'membership_tier',
        type: 'enum',
        enum: MembershipTier,
        default: MembershipTier.NONE,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "membershipTier", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_spent',
        type: 'decimal',
        precision: 15,
        scale: 2,
        default: '0.00',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "totalSpent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], UserEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => refresh_token_entity_1.RefreshTokenEntity, (refreshToken) => refreshToken.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "refreshTokens", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'users' })
], UserEntity);
//# sourceMappingURL=user.entity.js.map