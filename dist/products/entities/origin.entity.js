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
exports.OriginEntity = void 0;
const typeorm_1 = require("typeorm");
let OriginEntity = class OriginEntity {
    originId;
    originName;
    originImage;
    brandSlug;
    brandDescription;
    isActive;
    createdAt;
    updatedAt;
};
exports.OriginEntity = OriginEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'brand_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], OriginEntity.prototype, "originId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'brand_name', type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], OriginEntity.prototype, "originName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'logo_url',
        type: 'varchar',
        length: 500,
        nullable: true,
    }),
    __metadata("design:type", Object)
], OriginEntity.prototype, "originImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'brand_slug', type: 'varchar', length: 180, nullable: true }),
    __metadata("design:type", Object)
], OriginEntity.prototype, "brandSlug", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'brand_description', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], OriginEntity.prototype, "brandDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', width: 1, default: 1 }),
    __metadata("design:type", Boolean)
], OriginEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], OriginEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], OriginEntity.prototype, "updatedAt", void 0);
exports.OriginEntity = OriginEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'brands' })
], OriginEntity);
//# sourceMappingURL=origin.entity.js.map