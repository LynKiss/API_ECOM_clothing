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
exports.BannerEntity = void 0;
const typeorm_1 = require("typeorm");
let BannerEntity = class BannerEntity {
    bannerId;
    title;
    imageUrl;
    linkUrl;
    position;
    sortOrder;
    isActive;
    createdAt;
    updatedAt;
};
exports.BannerEntity = BannerEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'banner_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], BannerEntity.prototype, "bannerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'title', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], BannerEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], BannerEntity.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'link_url', type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", Object)
], BannerEntity.prototype, "linkUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'position', type: 'varchar', length: 50, default: 'homepage' }),
    __metadata("design:type", String)
], BannerEntity.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], BannerEntity.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', width: 1, default: 1 }),
    __metadata("design:type", Boolean)
], BannerEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], BannerEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], BannerEntity.prototype, "updatedAt", void 0);
exports.BannerEntity = BannerEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'banners' })
], BannerEntity);
//# sourceMappingURL=banner.entity.js.map