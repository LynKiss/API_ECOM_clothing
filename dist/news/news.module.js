"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const news_comment_entity_1 = require("./entities/news-comment.entity");
const news_image_entity_1 = require("./entities/news-image.entity");
const news_tag_of_news_entity_1 = require("./entities/news-tag-of-news.entity");
const news_tag_entity_1 = require("./entities/news-tag.entity");
const news_entity_1 = require("./entities/news.entity");
const user_entity_1 = require("../users/entities/user.entity");
const news_controller_1 = require("./news.controller");
const news_service_1 = require("./news.service");
let NewsModule = class NewsModule {
};
exports.NewsModule = NewsModule;
exports.NewsModule = NewsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                news_entity_1.NewsEntity,
                news_comment_entity_1.NewsCommentEntity,
                news_image_entity_1.NewsImageEntity,
                news_tag_entity_1.NewsTagEntity,
                news_tag_of_news_entity_1.NewsTagOfNewsEntity,
                user_entity_1.UserEntity,
            ]),
        ],
        controllers: [news_controller_1.NewsController],
        providers: [news_service_1.NewsService],
        exports: [news_service_1.NewsService, typeorm_1.TypeOrmModule],
    })
], NewsModule);
//# sourceMappingURL=news.module.js.map