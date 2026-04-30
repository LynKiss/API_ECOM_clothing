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
exports.CommentEntity = exports.ProductCommentStatus = void 0;
const typeorm_1 = require("typeorm");
var ProductCommentStatus;
(function (ProductCommentStatus) {
    ProductCommentStatus["VISIBLE"] = "visible";
    ProductCommentStatus["HIDDEN"] = "hidden";
    ProductCommentStatus["DELETED"] = "deleted";
})(ProductCommentStatus || (exports.ProductCommentStatus = ProductCommentStatus = {}));
let CommentEntity = class CommentEntity {
    commentId;
    userId;
    productId;
    orderItemId;
    content;
    rating;
    likeCount;
    dislikeCount;
    status;
    createdAt;
    updatedAt;
};
exports.CommentEntity = CommentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        name: 'comment_id',
        type: 'bigint',
        unsigned: true,
    }),
    __metadata("design:type", String)
], CommentEntity.prototype, "commentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], CommentEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id', type: 'char', length: 36 }),
    __metadata("design:type", String)
], CommentEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'order_item_id',
        type: 'bigint',
        unsigned: true,
        nullable: true,
    }),
    __metadata("design:type", Object)
], CommentEntity.prototype, "orderItemId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content', type: 'text' }),
    __metadata("design:type", String)
], CommentEntity.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rating', type: 'tinyint', nullable: true }),
    __metadata("design:type", Object)
], CommentEntity.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'like_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], CommentEntity.prototype, "likeCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'dislike_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], CommentEntity.prototype, "dislikeCount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'enum',
        enum: ProductCommentStatus,
        default: ProductCommentStatus.VISIBLE,
    }),
    __metadata("design:type", String)
], CommentEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], CommentEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], CommentEntity.prototype, "updatedAt", void 0);
exports.CommentEntity = CommentEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'comments' })
], CommentEntity);
//# sourceMappingURL=comment.entity.js.map