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
exports.RefreshTokenEntity = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let RefreshTokenEntity = class RefreshTokenEntity {
    tokenId;
    userId;
    refreshToken;
    expiredAt;
    isRevoked;
    createdAt;
    user;
};
exports.RefreshTokenEntity = RefreshTokenEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'token_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], RefreshTokenEntity.prototype, "tokenId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], RefreshTokenEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refresh_token', type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], RefreshTokenEntity.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expired_at', type: 'datetime' }),
    __metadata("design:type", Date)
], RefreshTokenEntity.prototype, "expiredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_revoked', type: 'tinyint', width: 1, default: () => '0' }),
    __metadata("design:type", Boolean)
], RefreshTokenEntity.prototype, "isRevoked", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], RefreshTokenEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.refreshTokens, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id', referencedColumnName: 'userId' }),
    __metadata("design:type", user_entity_1.UserEntity)
], RefreshTokenEntity.prototype, "user", void 0);
exports.RefreshTokenEntity = RefreshTokenEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'refresh_tokens' })
], RefreshTokenEntity);
//# sourceMappingURL=refresh-token.entity.js.map