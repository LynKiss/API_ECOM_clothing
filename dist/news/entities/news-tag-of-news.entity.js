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
exports.NewsTagOfNewsEntity = void 0;
const typeorm_1 = require("typeorm");
let NewsTagOfNewsEntity = class NewsTagOfNewsEntity {
    newsId;
    newsTagId;
    createdAt;
};
exports.NewsTagOfNewsEntity = NewsTagOfNewsEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'news_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], NewsTagOfNewsEntity.prototype, "newsId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'news_tag_id', type: 'bigint', unsigned: true }),
    __metadata("design:type", String)
], NewsTagOfNewsEntity.prototype, "newsTagId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], NewsTagOfNewsEntity.prototype, "createdAt", void 0);
exports.NewsTagOfNewsEntity = NewsTagOfNewsEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'news_tag_of_news' })
], NewsTagOfNewsEntity);
//# sourceMappingURL=news-tag-of-news.entity.js.map