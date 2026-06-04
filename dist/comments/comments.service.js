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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_item_entity_1 = require("../orders/entities/order-item.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const product_entity_1 = require("../products/entities/product.entity");
const user_entity_1 = require("../users/entities/user.entity");
const comment_entity_1 = require("./entities/comment.entity");
let CommentsService = class CommentsService {
    commentsRepository;
    productsRepository;
    ordersRepository;
    orderItemsRepository;
    usersRepository;
    constructor(commentsRepository, productsRepository, ordersRepository, orderItemsRepository, usersRepository) {
        this.commentsRepository = commentsRepository;
        this.productsRepository = productsRepository;
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.usersRepository = usersRepository;
    }
    async findProductReviews(productId) {
        await this.ensureProductExists(productId);
        const reviews = await this.commentsRepository.find({
            where: {
                productId,
                status: comment_entity_1.ProductCommentStatus.VISIBLE,
            },
            order: { createdAt: 'DESC' },
        });
        return reviews.map((review) => ({
            id: review.commentId,
            userId: review.userId,
            orderItemId: review.orderItemId,
            content: review.content,
            rating: review.rating,
            likeCount: review.likeCount,
            dislikeCount: review.dislikeCount,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        }));
    }
    async createReview(userId, productId, dto) {
        await this.ensureUserExists(userId);
        await this.ensureProductExists(productId);
        const orderItem = await this.orderItemsRepository.findOneBy({
            orderItemId: dto.orderItemId,
        });
        if (!orderItem || orderItem.productId !== productId) {
            throw new common_1.NotFoundException('Order item not found');
        }
        const ownedOrder = await this.ordersRepository.findOneBy({
            orderId: orderItem.orderId,
            userId,
        });
        if (!ownedOrder) {
            throw new common_1.UnauthorizedException('Ban khong so huu san pham da mua nay');
        }
        if (ownedOrder.orderStatus !== order_entity_1.OrderStatus.DELIVERED) {
            throw new common_1.BadRequestException('Chi duoc danh gia sau khi don hang da giao thanh cong');
        }
        const existingReview = await this.commentsRepository.findOneBy({
            userId,
            orderItemId: dto.orderItemId,
        });
        if (existingReview) {
            throw new common_1.ConflictException('Ban da danh gia san pham nay roi');
        }
        const review = this.commentsRepository.create({
            userId,
            productId,
            orderItemId: dto.orderItemId,
            content: dto.content,
            rating: dto.rating,
            likeCount: 0,
            dislikeCount: 0,
            status: comment_entity_1.ProductCommentStatus.VISIBLE,
        });
        const savedReview = await this.commentsRepository.save(review);
        await this.refreshProductRating(productId);
        return {
            id: savedReview.commentId,
            userId: savedReview.userId,
            productId: savedReview.productId,
            orderItemId: savedReview.orderItemId,
            content: savedReview.content,
            rating: savedReview.rating,
            status: savedReview.status,
            createdAt: savedReview.createdAt,
            updatedAt: savedReview.updatedAt,
        };
    }
    async findMyReviews(userId, params) {
        await this.ensureUserExists(userId);
        const page = params.page;
        const limit = params.limit;
        const where = { userId };
        if (params.status && params.status !== 'all') {
            where.status = params.status;
        }
        const reviews = await this.commentsRepository.find({
            where,
            order: { createdAt: 'DESC' },
        });
        const productIds = [...new Set(reviews.map((item) => item.productId))];
        const products = productIds.length
            ? await this.productsRepository.find({
                where: { productId: (0, typeorm_2.In)(productIds) },
                select: ['productId', 'productName', 'productSlug'],
            })
            : [];
        const productMap = new Map(products.map((item) => [item.productId, item]));
        const mapped = reviews.map((review) => {
            const product = productMap.get(review.productId);
            return {
                id: review.commentId,
                commentId: review.commentId,
                productId: review.productId,
                productName: product?.productName ?? null,
                productSlug: product?.productSlug ?? null,
                orderItemId: review.orderItemId,
                content: review.content,
                rating: review.rating,
                imageUrls: [],
                likeCount: review.likeCount,
                dislikeCount: review.dislikeCount,
                status: review.status,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
            };
        });
        const normalizedSearch = params.search?.trim().toLowerCase();
        const filtered = normalizedSearch
            ? mapped.filter((item) => [
                item.productName,
                item.content,
                item.status,
                item.productId,
                item.commentId,
            ].filter(Boolean).join(' ').toLowerCase().includes(normalizedSearch))
            : mapped;
        const total = filtered.length;
        return {
            items: filtered.slice((page - 1) * limit, page * limit),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async likeComment(commentId) {
        const comment = await this.commentsRepository.findOneBy({ commentId });
        if (!comment)
            throw new common_1.NotFoundException('Review not found');
        await this.commentsRepository.increment({ commentId }, 'likeCount', 1);
        return { likeCount: comment.likeCount + 1, dislikeCount: comment.dislikeCount };
    }
    async unlikeComment(commentId) {
        const comment = await this.commentsRepository.findOneBy({ commentId });
        if (!comment)
            throw new common_1.NotFoundException('Review not found');
        if (comment.likeCount > 0) {
            await this.commentsRepository.decrement({ commentId }, 'likeCount', 1);
        }
        return { likeCount: Math.max(0, comment.likeCount - 1), dislikeCount: comment.dislikeCount };
    }
    async dislikeComment(commentId) {
        const comment = await this.commentsRepository.findOneBy({ commentId });
        if (!comment)
            throw new common_1.NotFoundException('Review not found');
        await this.commentsRepository.increment({ commentId }, 'dislikeCount', 1);
        return { likeCount: comment.likeCount, dislikeCount: comment.dislikeCount + 1 };
    }
    async undislikeComment(commentId) {
        const comment = await this.commentsRepository.findOneBy({ commentId });
        if (!comment)
            throw new common_1.NotFoundException('Review not found');
        if (comment.dislikeCount > 0) {
            await this.commentsRepository.decrement({ commentId }, 'dislikeCount', 1);
        }
        return { likeCount: comment.likeCount, dislikeCount: Math.max(0, comment.dislikeCount - 1) };
    }
    async findAdminReviews(params) {
        const { page, limit, status, rating, productId, search } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (status && status !== 'all') {
            where['status'] = status;
        }
        if (rating) {
            where['rating'] = rating;
        }
        if (productId) {
            where['productId'] = productId;
        }
        if (search && search.trim()) {
            where['content'] = (0, typeorm_2.Like)(`%${search.trim()}%`);
        }
        const [reviews, total] = await this.commentsRepository.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });
        const userIds = [...new Set(reviews.map((r) => r.userId))];
        const productIds = [...new Set(reviews.map((r) => r.productId))];
        const [users, products] = await Promise.all([
            userIds.length > 0
                ? this.usersRepository
                    .createQueryBuilder('u')
                    .select(['u.userId', 'u.username'])
                    .whereInIds(userIds)
                    .getMany()
                : Promise.resolve([]),
            productIds.length > 0
                ? this.productsRepository
                    .createQueryBuilder('p')
                    .select(['p.productId', 'p.productName'])
                    .whereInIds(productIds)
                    .getMany()
                : Promise.resolve([]),
        ]);
        const userMap = new Map(users.map((u) => [u.userId, u]));
        const productMap = new Map(products.map((p) => [p.productId, p]));
        const items = reviews.map((r) => {
            const user = userMap.get(r.userId);
            const product = productMap.get(r.productId);
            return {
                commentId: r.commentId,
                content: r.content,
                rating: r.rating,
                status: r.status,
                likeCount: r.likeCount,
                dislikeCount: r.dislikeCount,
                createdAt: r.createdAt,
                user: {
                    username: user?.username ?? null,
                },
                product: {
                    productName: product?.productName ?? null,
                },
            };
        });
        return {
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            items,
        };
    }
    async hideReview(id) {
        const review = await this.commentsRepository.findOneBy({ commentId: id });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        review.status = comment_entity_1.ProductCommentStatus.HIDDEN;
        await this.commentsRepository.save(review);
        await this.refreshProductRating(review.productId);
        return { commentId: review.commentId, status: review.status };
    }
    async showReview(id) {
        const review = await this.commentsRepository.findOneBy({ commentId: id });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        review.status = comment_entity_1.ProductCommentStatus.VISIBLE;
        await this.commentsRepository.save(review);
        await this.refreshProductRating(review.productId);
        return { commentId: review.commentId, status: review.status };
    }
    async deleteReview(id) {
        const review = await this.commentsRepository.findOneBy({ commentId: id });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        review.status = comment_entity_1.ProductCommentStatus.DELETED;
        await this.commentsRepository.save(review);
        await this.refreshProductRating(review.productId);
        return { commentId: review.commentId, status: review.status };
    }
    async getAdminStats() {
        const [totalVisible, totalHidden, totalDeleted, allVisible] = await Promise.all([
            this.commentsRepository.count({
                where: { status: comment_entity_1.ProductCommentStatus.VISIBLE },
            }),
            this.commentsRepository.count({
                where: { status: comment_entity_1.ProductCommentStatus.HIDDEN },
            }),
            this.commentsRepository.count({
                where: { status: comment_entity_1.ProductCommentStatus.DELETED },
            }),
            this.commentsRepository.find({
                where: { status: comment_entity_1.ProductCommentStatus.VISIBLE },
                select: ['rating'],
            }),
        ]);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const reviewsToday = await this.commentsRepository
            .createQueryBuilder('c')
            .where('c.created_at >= :today', { today })
            .andWhere('c.created_at < :tomorrow', { tomorrow })
            .getCount();
        const ratings = allVisible
            .map((r) => r.rating)
            .filter((r) => typeof r === 'number');
        const averageRating = ratings.length === 0
            ? 0
            : ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
        return {
            total: totalVisible + totalHidden + totalDeleted,
            totalVisible,
            totalHidden,
            totalDeleted,
            averageRating: Number(averageRating.toFixed(2)),
            reviewsToday,
        };
    }
    async refreshProductRating(productId) {
        const product = await this.productsRepository.findOneBy({ productId });
        if (!product) {
            return;
        }
        const reviews = await this.commentsRepository.find({
            where: {
                productId,
                status: comment_entity_1.ProductCommentStatus.VISIBLE,
            },
        });
        const ratingValues = reviews
            .map((review) => review.rating)
            .filter((rating) => typeof rating === 'number');
        const ratingCount = ratingValues.length;
        const ratingAverage = ratingCount === 0
            ? 0
            : ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingCount;
        product.ratingCount = ratingCount;
        product.ratingAverage = ratingAverage.toFixed(2);
        await this.productsRepository.save(product);
    }
    async ensureProductExists(productId) {
        const product = await this.productsRepository.findOneBy({ productId });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
    }
    async ensureUserExists(userId) {
        const user = await this.usersRepository.findOneBy({ userId });
        if (!user) {
            throw new common_1.UnauthorizedException('Nguoi dung khong ton tai');
        }
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(comment_entity_1.CommentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.OrderEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItemEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CommentsService);
//# sourceMappingURL=comments.service.js.map