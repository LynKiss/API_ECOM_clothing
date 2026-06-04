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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const customize_1 = require("../decorator/customize");
const create_news_dto_1 = require("./dto/create-news.dto");
const query_news_dto_1 = require("./dto/query-news.dto");
const update_news_dto_1 = require("./dto/update-news.dto");
const news_service_1 = require("./news.service");
let NewsController = class NewsController {
    newsService;
    constructor(newsService) {
        this.newsService = newsService;
    }
    getPublishedNews(page, limit, search) {
        return this.newsService.findPublishedList({
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
        });
    }
    getNewsBySlug(slug) {
        return this.newsService.findBySlug(slug);
    }
    getNews(query) {
        return this.newsService.findAll(query);
    }
    createNews(currentUser, createNewsDto) {
        return this.newsService.create(currentUser._id, createNewsDto);
    }
    publishNews(id) {
        return this.newsService.publish(id);
    }
    unpublishNews(id) {
        return this.newsService.unpublish(id);
    }
    getNewsDetail(id) {
        return this.newsService.findOne(id);
    }
    updateNews(id, updateNewsDto) {
        return this.newsService.update(id, updateNewsDto);
    }
    uploadCoverImage(id, file) {
        return this.newsService.uploadCoverImage(id, file);
    }
    incrementView(id) {
        return this.newsService.incrementView(id);
    }
    likeArticle(id) {
        return this.newsService.likeArticle(id);
    }
    unlikeArticle(id) {
        return this.newsService.unlikeArticle(id);
    }
    getMyComments(currentUser, page = '1', limit = '12', status, search) {
        return this.newsService.findMyComments(currentUser._id, {
            page: Math.max(1, parseInt(page, 10) || 1),
            limit: Math.min(100, Math.max(1, parseInt(limit, 10) || 12)),
            status,
            search,
        });
    }
    getComments(id) {
        return this.newsService.getNewsComments(id);
    }
    addComment(currentUser, id, body) {
        return this.newsService.addNewsComment(id, currentUser._id, body.content);
    }
    likeComment(commentId) {
        return this.newsService.likeNewsComment(commentId);
    }
    unlikeComment(commentId) {
        return this.newsService.unlikeNewsComment(commentId);
    }
    dislikeComment(commentId) {
        return this.newsService.dislikeNewsComment(commentId);
    }
    undislikeComment(commentId) {
        return this.newsService.undislikeNewsComment(commentId);
    }
    getAdminComments(page, limit, status, newsId, search) {
        return this.newsService.findAdminComments({
            page: page ? parseInt(page, 10) : undefined,
            limit: limit ? parseInt(limit, 10) : undefined,
            status,
            newsId,
            search,
        });
    }
    getAdminCommentStats() {
        return this.newsService.getAdminCommentStats();
    }
    hideComment(commentId) {
        return this.newsService.hideComment(commentId);
    }
    deleteComment(commentId) {
        return this.newsService.deleteAdminComment(commentId);
    }
    deleteNews(id) {
        return this.newsService.remove(id);
    }
};
exports.NewsController = NewsController;
__decorate([
    (0, common_1.Get)('public/list'),
    (0, customize_1.Public)(),
    (0, customize_1.ResponseMessage)('Get published news list'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "getPublishedNews", null);
__decorate([
    (0, common_1.Get)('public/by-slug/:slug'),
    (0, customize_1.Public)(),
    (0, customize_1.ResponseMessage)('Get news by slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "getNewsBySlug", null);
__decorate([
    (0, common_1.Get)(),
    (0, customize_1.RequirePermissions)('manage_news'),
    (0, customize_1.ResponseMessage)('Get news list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_news_dto_1.QueryNewsDto]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "getNews", null);
__decorate([
    (0, common_1.Post)(),
    (0, customize_1.RequirePermissions)('manage_news'),
    (0, customize_1.ResponseMessage)('Create news article'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_news_dto_1.CreateNewsDto]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "createNews", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    (0, customize_1.RequirePermissions)('manage_news'),
    (0, customize_1.ResponseMessage)('Publish news article'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "publishNews", null);
__decorate([
    (0, common_1.Patch)(':id/unpublish'),
    (0, customize_1.RequirePermissions)('manage_news'),
    (0, customize_1.ResponseMessage)('Unpublish news article'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "unpublishNews", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, customize_1.RequirePermissions)('manage_news'),
    (0, customize_1.ResponseMessage)('Get news detail'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "getNewsDetail", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, customize_1.RequirePermissions)('manage_news'),
    (0, customize_1.ResponseMessage)('Update news article'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_news_dto_1.UpdateNewsDto]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "updateNews", null);
__decorate([
    (0, common_1.Post)(':id/cover-image'),
    (0, customize_1.RequirePermissions)('manage_news'),
    (0, customize_1.ResponseMessage)('Upload news cover image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "uploadCoverImage", null);
__decorate([
    (0, common_1.Patch)('public/:id/view'),
    (0, customize_1.Public)(),
    (0, customize_1.ResponseMessage)('Increment view count'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "incrementView", null);
__decorate([
    (0, common_1.Post)('public/:id/like'),
    (0, customize_1.Public)(),
    (0, customize_1.ResponseMessage)('Like article'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "likeArticle", null);
__decorate([
    (0, common_1.Delete)('public/:id/like'),
    (0, customize_1.Public)(),
    (0, customize_1.ResponseMessage)('Unlike article'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "unlikeArticle", null);
__decorate([
    (0, common_1.Get)('public/comments/me'),
    (0, customize_1.ResponseMessage)('Get my news comments'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String, String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "getMyComments", null);
__decorate([
    (0, common_1.Get)('public/:id/comments'),
    (0, customize_1.Public)(),
    (0, customize_1.ResponseMessage)('Get news comments'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "getComments", null);
__decorate([
    (0, common_1.Post)('public/:id/comments'),
    (0, customize_1.ResponseMessage)('Add news comment'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "addComment", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Post)('public/comments/:commentId/like'),
    (0, customize_1.ResponseMessage)('Like news comment'),
    __param(0, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "likeComment", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Delete)('public/comments/:commentId/like'),
    (0, customize_1.ResponseMessage)('Unlike news comment'),
    __param(0, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "unlikeComment", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Post)('public/comments/:commentId/dislike'),
    (0, customize_1.ResponseMessage)('Dislike news comment'),
    __param(0, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "dislikeComment", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Delete)('public/comments/:commentId/dislike'),
    (0, customize_1.ResponseMessage)('Undislike news comment'),
    __param(0, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "undislikeComment", null);
__decorate([
    (0, common_1.Get)('admin/comments'),
    (0, customize_1.RequirePermissions)('manage_news'),
    (0, customize_1.ResponseMessage)('Get admin news comments'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('newsId')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "getAdminComments", null);
__decorate([
    (0, common_1.Get)('admin/comments/stats'),
    (0, customize_1.RequirePermissions)('manage_news'),
    (0, customize_1.ResponseMessage)('Get news comment stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "getAdminCommentStats", null);
__decorate([
    (0, common_1.Patch)('admin/comments/:commentId/hide'),
    (0, customize_1.RequirePermissions)('manage_news'),
    (0, customize_1.ResponseMessage)('Toggle comment visibility'),
    __param(0, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "hideComment", null);
__decorate([
    (0, common_1.Delete)('admin/comments/:commentId'),
    (0, customize_1.RequirePermissions)('manage_news'),
    (0, customize_1.ResponseMessage)('Delete news comment'),
    __param(0, (0, common_1.Param)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "deleteComment", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, customize_1.RequirePermissions)('manage_news'),
    (0, customize_1.ResponseMessage)('Delete news article'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsController.prototype, "deleteNews", null);
exports.NewsController = NewsController = __decorate([
    (0, common_1.Controller)('news'),
    __metadata("design:paramtypes", [news_service_1.NewsService])
], NewsController);
//# sourceMappingURL=news.controller.js.map