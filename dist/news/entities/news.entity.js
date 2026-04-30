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
exports.NewsEntity = void 0;
const typeorm_1 = require("typeorm");
let NewsEntity = class NewsEntity {
    newsId;
    userId;
    title;
    titleImageUrl;
    subTitle;
    slug;
    content;
    isDraft;
    isPublished;
    publishedAt;
    views;
    likeCount;
    createdAt;
    updatedAt;
};
exports.NewsEntity = NewsEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'news_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], NewsEntity.prototype, "newsId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], NewsEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'title', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], NewsEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'title_image_url',
        type: 'varchar',
        length: 500,
        nullable: true,
    }),
    __metadata("design:type", Object)
], NewsEntity.prototype, "titleImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sub_title', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", Object)
], NewsEntity.prototype, "subTitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'slug', type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], NewsEntity.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content', type: 'longtext', nullable: true }),
    __metadata("design:type", Object)
], NewsEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_draft', type: 'tinyint', width: 1, default: () => '1' }),
    __metadata("design:type", Boolean)
], NewsEntity.prototype, "isDraft", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_published',
        type: 'tinyint',
        width: 1,
        default: () => '0',
    }),
    __metadata("design:type", Boolean)
], NewsEntity.prototype, "isPublished", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'published_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], NewsEntity.prototype, "publishedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'views', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], NewsEntity.prototype, "views", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'like_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], NewsEntity.prototype, "likeCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], NewsEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], NewsEntity.prototype, "updatedAt", void 0);
exports.NewsEntity = NewsEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'news' })
], NewsEntity);
//# sourceMappingURL=news.entity.js.map