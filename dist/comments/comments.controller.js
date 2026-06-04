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
exports.CommentsController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const create_review_dto_1 = require("./dto/create-review.dto");
const comments_service_1 = require("./comments.service");
let CommentsController = class CommentsController {
    commentsService;
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    getProductReviews(productId) {
        return this.commentsService.findProductReviews(productId);
    }
    likeReview(id) {
        return this.commentsService.likeComment(id);
    }
    unlikeReview(id) {
        return this.commentsService.unlikeComment(id);
    }
    dislikeReview(id) {
        return this.commentsService.dislikeComment(id);
    }
    undislikeReview(id) {
        return this.commentsService.undislikeComment(id);
    }
    createReview(currentUser, productId, createReviewDto) {
        return this.commentsService.createReview(currentUser._id, productId, createReviewDto);
    }
    getMyReviews(currentUser, page = '1', limit = '12', status, search) {
        return this.commentsService.findMyReviews(currentUser._id, {
            page: Math.max(1, parseInt(page, 10) || 1),
            limit: Math.min(100, Math.max(1, parseInt(limit, 10) || 12)),
            status,
            search,
        });
    }
    getAdminStats() {
        return this.commentsService.getAdminStats();
    }
    listAdminReviews(page = '1', limit = '12', status, rating, productId, search) {
        return this.commentsService.findAdminReviews({
            page: Math.max(1, parseInt(page, 10) || 1),
            limit: Math.min(100, Math.max(1, parseInt(limit, 10) || 12)),
            status,
            rating: rating ? parseInt(rating, 10) : undefined,
            productId,
            search,
        });
    }
    hideReview(id) {
        return this.commentsService.hideReview(id);
    }
    showReview(id) {
        return this.commentsService.showReview(id);
    }
    deleteReview(id) {
        return this.commentsService.deleteReview(id);
    }
};
exports.CommentsController = CommentsController;
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)('products/:productId'),
    (0, customize_1.ResponseMessage)('Get product reviews'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "getProductReviews", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Post)(':id/like'),
    (0, customize_1.ResponseMessage)('Like review'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "likeReview", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Delete)(':id/like'),
    (0, customize_1.ResponseMessage)('Unlike review'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "unlikeReview", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Post)(':id/dislike'),
    (0, customize_1.ResponseMessage)('Dislike review'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "dislikeReview", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Delete)(':id/dislike'),
    (0, customize_1.ResponseMessage)('Undislike review'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "undislikeReview", null);
__decorate([
    (0, common_1.Post)('products/:productId'),
    (0, customize_1.ResponseMessage)('Create product review'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_review_dto_1.CreateReviewDto]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "createReview", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, customize_1.ResponseMessage)('Get my product reviews'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String, String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "getMyReviews", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_reviews'),
    (0, common_1.Get)('admin/stats'),
    (0, customize_1.ResponseMessage)('Get review stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "getAdminStats", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_reviews'),
    (0, common_1.Get)('admin'),
    (0, customize_1.ResponseMessage)('List all reviews'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('rating')),
    __param(4, (0, common_1.Query)('productId')),
    __param(5, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "listAdminReviews", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_reviews'),
    (0, common_1.Patch)('admin/:id/hide'),
    (0, customize_1.ResponseMessage)('Review hidden'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "hideReview", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_reviews'),
    (0, common_1.Patch)('admin/:id/show'),
    (0, customize_1.ResponseMessage)('Review shown'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "showReview", null);
__decorate([
    (0, customize_1.RequirePermissions)('manage_reviews'),
    (0, common_1.Delete)('admin/:id'),
    (0, customize_1.ResponseMessage)('Review deleted'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommentsController.prototype, "deleteReview", null);
exports.CommentsController = CommentsController = __decorate([
    (0, common_1.Controller)('reviews'),
    __metadata("design:paramtypes", [comments_service_1.CommentsService])
], CommentsController);
//# sourceMappingURL=comments.controller.js.map