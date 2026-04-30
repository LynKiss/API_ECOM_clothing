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
exports.NewsImageEntity = void 0;
const typeorm_1 = require("typeorm");
let NewsImageEntity = class NewsImageEntity {
    newsImageId;
    newsId;
    imageUrl;
    sortOrder;
    createdAt;
};
exports.NewsImageEntity = NewsImageEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'news_image_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], NewsImageEntity.prototype, "newsImageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'news_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], NewsImageEntity.prototype, "newsId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], NewsImageEntity.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], NewsImageEntity.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], NewsImageEntity.prototype, "createdAt", void 0);
exports.NewsImageEntity = NewsImageEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'news_images' })
], NewsImageEntity);
//# sourceMappingURL=news-image.entity.js.map