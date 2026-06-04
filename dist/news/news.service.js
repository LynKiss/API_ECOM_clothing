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
exports.NewsService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const query_news_dto_1 = require("./dto/query-news.dto");
const news_comment_entity_1 = require("./entities/news-comment.entity");
const news_entity_1 = require("./entities/news.entity");
const user_entity_1 = require("../users/entities/user.entity");
let NewsService = class NewsService {
    newsRepository;
    newsCommentRepository;
    usersRepository;
    constructor(newsRepository, newsCommentRepository, usersRepository) {
        this.newsRepository = newsRepository;
        this.newsCommentRepository = newsCommentRepository;
        this.usersRepository = usersRepository;
    }
    mapArticle(article, author) {
        return {
            _id: article.newsId,
            newsId: article.newsId,
            title: article.title,
            subTitle: article.subTitle,
            slug: article.slug,
            titleImageUrl: article.titleImageUrl,
            content: article.content,
            isPublished: article.isPublished,
            views: article.views,
            likeCount: article.likeCount,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            author: author ?? undefined,
        };
    }
    async create(userId, createNewsDto) {
        const slug = this.normalizeSlug(createNewsDto.slug ?? createNewsDto.title);
        const existing = await this.newsRepository.findOneBy({ slug });
        if (existing) {
            throw new common_1.BadRequestException('Slug đã tồn tại');
        }
        const article = this.newsRepository.create({
            userId,
            title: createNewsDto.title.trim(),
            subTitle: createNewsDto.subTitle?.trim() || null,
            slug,
            titleImageUrl: createNewsDto.titleImageUrl?.trim() || null,
            content: createNewsDto.content ?? null,
            isDraft: true,
            isPublished: false,
            publishedAt: null,
        });
        return this.newsRepository.save(article);
    }
    async findPublishedList(params) {
        const page = params.page ?? 1;
        const limit = Math.min(params.limit ?? 9, 50);
        const skip = (page - 1) * limit;
        const qb = this.newsRepository
            .createQueryBuilder('news')
            .where('news.is_published = 1');
        if (params.search?.trim()) {
            qb.andWhere('(news.title LIKE :s OR news.sub_title LIKE :s)', {
                s: `%${params.search.trim()}%`,
            });
        }
        qb.orderBy('news.created_at', 'DESC').skip(skip).take(limit);
        const [rows, total] = await qb.getManyAndCount();
        const items = rows.map((a) => this.mapArticle(a));
        return { items, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findBySlug(slug) {
        const article = await this.newsRepository.findOneBy({ slug, isPublished: true });
        if (!article)
            throw new common_1.NotFoundException('Bài viết không tìm thấy');
        const author = await this.usersRepository.findOneBy({ userId: article.userId }).catch(() => null);
        return this.mapArticle(article, author ? { username: author.username } : null);
    }
    async getNewsComments(newsId) {
        const comments = await this.newsCommentRepository.find({
            where: { newsId, status: news_comment_entity_1.NewsCommentStatus.VISIBLE },
            order: { createdAt: 'DESC' },
        });
        const userIds = [...new Set(comments.map((c) => c.userId))];
        const users = userIds.length > 0
            ? await this.usersRepository.createQueryBuilder('u').select(['u.userId', 'u.username']).whereInIds(userIds).getMany()
            : [];
        const userMap = new Map(users.map((u) => [u.userId, u.username]));
        return comments.map((c) => ({
            id: c.commentId,
            content: c.content,
            likeCount: c.likeCount,
            dislikeCount: c.dislikeCount,
            createdAt: c.createdAt,
            author: { username: userMap.get(c.userId) ?? 'Độc giả' },
        }));
    }
    async addNewsComment(newsId, userId, content) {
        const article = await this.newsRepository.findOneBy({ newsId, isPublished: true });
        if (!article)
            throw new common_1.NotFoundException('Bài viết không tìm thấy');
        const comment = this.newsCommentRepository.create({ newsId, userId, content, likeCount: 0, dislikeCount: 0, status: news_comment_entity_1.NewsCommentStatus.VISIBLE });
        const saved = await this.newsCommentRepository.save(comment);
        const user = await this.usersRepository.findOneBy({ userId }).catch(() => null);
        return { id: saved.commentId, content: saved.content, likeCount: 0, dislikeCount: 0, createdAt: saved.createdAt, author: { username: user?.username ?? 'Độc giả' } };
    }
    async findMyComments(userId, params) {
        const page = params.page;
        const limit = params.limit;
        const where = { userId };
        if (params.status && params.status !== 'all') {
            where.status = params.status;
        }
        const comments = await this.newsCommentRepository.find({
            where,
            order: { createdAt: 'DESC' },
        });
        const newsIds = [...new Set(comments.map((comment) => comment.newsId))];
        const articles = newsIds.length
            ? await this.newsRepository.find({
                where: { newsId: (0, typeorm_2.In)(newsIds) },
                select: ['newsId', 'title', 'slug'],
            })
            : [];
        const articleMap = new Map(articles.map((article) => [article.newsId, article]));
        const mapped = comments.map((comment) => {
            const article = articleMap.get(comment.newsId);
            return {
                id: comment.commentId,
                commentId: comment.commentId,
                newsId: comment.newsId,
                articleTitle: article?.title ?? null,
                articleSlug: article?.slug ?? null,
                content: comment.content,
                imageUrls: [],
                likeCount: comment.likeCount,
                dislikeCount: comment.dislikeCount,
                status: comment.status,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
            };
        });
        const normalizedSearch = params.search?.trim().toLowerCase();
        const filtered = normalizedSearch
            ? mapped.filter((item) => [
                item.articleTitle,
                item.content,
                item.status,
                item.articleSlug,
                item.commentId,
            ].filter(Boolean).join(' ').toLowerCase().includes(normalizedSearch))
            : mapped;
        const total = filtered.length;
        return {
            items: filtered.slice((page - 1) * limit, page * limit),
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async likeNewsComment(commentId) {
        const c = await this.newsCommentRepository.findOneBy({ commentId });
        if (!c)
            throw new common_1.NotFoundException('Bình luận không tìm thấy');
        await this.newsCommentRepository.increment({ commentId }, 'likeCount', 1);
        return { likeCount: c.likeCount + 1, dislikeCount: c.dislikeCount };
    }
    async unlikeNewsComment(commentId) {
        const c = await this.newsCommentRepository.findOneBy({ commentId });
        if (!c)
            throw new common_1.NotFoundException('Bình luận không tìm thấy');
        if (c.likeCount > 0)
            await this.newsCommentRepository.decrement({ commentId }, 'likeCount', 1);
        return { likeCount: Math.max(0, c.likeCount - 1), dislikeCount: c.dislikeCount };
    }
    async dislikeNewsComment(commentId) {
        const c = await this.newsCommentRepository.findOneBy({ commentId });
        if (!c)
            throw new common_1.NotFoundException('Bình luận không tìm thấy');
        await this.newsCommentRepository.increment({ commentId }, 'dislikeCount', 1);
        return { likeCount: c.likeCount, dislikeCount: c.dislikeCount + 1 };
    }
    async undislikeNewsComment(commentId) {
        const c = await this.newsCommentRepository.findOneBy({ commentId });
        if (!c)
            throw new common_1.NotFoundException('Bình luận không tìm thấy');
        if (c.dislikeCount > 0)
            await this.newsCommentRepository.decrement({ commentId }, 'dislikeCount', 1);
        return { likeCount: c.likeCount, dislikeCount: Math.max(0, c.dislikeCount - 1) };
    }
    async findAll(query) {
        const { search, status = query_news_dto_1.NewsStatusFilter.ALL, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;
        const qb = this.newsRepository.createQueryBuilder('news');
        if (search?.trim()) {
            qb.where('(news.title LIKE :search OR news.sub_title LIKE :search OR news.slug LIKE :search)', { search: `%${search.trim()}%` });
        }
        if (status === query_news_dto_1.NewsStatusFilter.PUBLISHED) {
            qb.andWhere('news.is_published = 1');
        }
        else if (status === query_news_dto_1.NewsStatusFilter.DRAFT) {
            qb.andWhere('news.is_draft = 1 AND news.is_published = 0');
        }
        qb.orderBy('news.created_at', 'DESC').skip(skip).take(limit);
        const [items, total] = await qb.getManyAndCount();
        return {
            items,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(newsId) {
        const article = await this.newsRepository.findOneBy({ newsId });
        if (!article) {
            throw new common_1.NotFoundException('Bài viết không tìm thấy');
        }
        return article;
    }
    async update(newsId, updateNewsDto) {
        const article = await this.findOne(newsId);
        if (updateNewsDto.slug !== undefined || updateNewsDto.title) {
            const slugSource = updateNewsDto.slug?.trim()
                ? updateNewsDto.slug
                : updateNewsDto.title
                    ? updateNewsDto.title
                    : article.title;
            const nextSlug = this.normalizeSlug(slugSource);
            const existing = await this.newsRepository.findOneBy({ slug: nextSlug });
            if (existing && existing.newsId !== newsId) {
                throw new common_1.BadRequestException('Slug đã tồn tại');
            }
            article.slug = nextSlug;
        }
        article.title = updateNewsDto.title ?? article.title;
        article.subTitle =
            updateNewsDto.subTitle !== undefined
                ? updateNewsDto.subTitle?.trim() || null
                : article.subTitle;
        article.titleImageUrl =
            updateNewsDto.titleImageUrl !== undefined
                ? updateNewsDto.titleImageUrl?.trim() || null
                : article.titleImageUrl;
        article.content =
            updateNewsDto.content !== undefined ? updateNewsDto.content : article.content;
        return this.newsRepository.save(article);
    }
    async publish(newsId) {
        const article = await this.findOne(newsId);
        if (article.isPublished) {
            throw new common_1.BadRequestException('Bài viết đã được xuất bản');
        }
        article.isDraft = false;
        article.isPublished = true;
        article.publishedAt = new Date();
        return this.newsRepository.save(article);
    }
    async unpublish(newsId) {
        const article = await this.findOne(newsId);
        if (!article.isPublished) {
            throw new common_1.BadRequestException('Bài viết chưa được xuất bản');
        }
        article.isDraft = true;
        article.isPublished = false;
        return this.newsRepository.save(article);
    }
    async incrementView(newsId) {
        await this.newsRepository.increment({ newsId }, 'views', 1);
        const article = await this.newsRepository.findOneBy({ newsId });
        return { views: article?.views ?? 0 };
    }
    async likeArticle(newsId) {
        await this.newsRepository.increment({ newsId }, 'likeCount', 1);
        const article = await this.newsRepository.findOneBy({ newsId });
        return { likeCount: article?.likeCount ?? 0 };
    }
    async unlikeArticle(newsId) {
        const article = await this.newsRepository.findOneBy({ newsId });
        if (!article)
            return { likeCount: 0 };
        if (article.likeCount > 0) {
            await this.newsRepository.decrement({ newsId }, 'likeCount', 1);
        }
        const updated = await this.newsRepository.findOneBy({ newsId });
        return { likeCount: updated?.likeCount ?? 0 };
    }
    async findAdminComments(params) {
        const page = params.page ?? 1;
        const limit = Math.min(params.limit ?? 12, 100);
        const skip = (page - 1) * limit;
        const qb = this.newsCommentRepository
            .createQueryBuilder('comment')
            .leftJoin(user_entity_1.UserEntity, 'user', 'user.user_id = comment.user_id')
            .leftJoin(news_entity_1.NewsEntity, 'article', 'article.news_id = comment.news_id')
            .orderBy('comment.createdAt', 'DESC')
            .skip(skip)
            .take(limit);
        if (params.status && params.status !== 'all') {
            qb.andWhere('comment.status = :status', { status: params.status });
        }
        if (params.newsId) {
            qb.andWhere('comment.news_id = :newsId', { newsId: params.newsId });
        }
        if (params.search?.trim()) {
            qb.andWhere('(comment.content LIKE :search OR user.username LIKE :search OR article.title LIKE :search)', { search: `%${params.search.trim()}%` });
        }
        const [comments, total] = await qb.getManyAndCount();
        const userIds = [...new Set(comments.map((comment) => comment.userId))];
        const newsIds = [...new Set(comments.map((comment) => comment.newsId))];
        const [users, articles] = await Promise.all([
            userIds.length ? this.usersRepository.createQueryBuilder('u').select(['u.userId', 'u.username']).whereInIds(userIds).getMany() : [],
            newsIds.length ? this.newsRepository.createQueryBuilder('n').select(['n.newsId', 'n.title']).where('n.newsId IN (:...ids)', { ids: newsIds }).getMany() : [],
        ]);
        const userMap = new Map(users.map((user) => [user.userId, user.username]));
        const articleMap = new Map(articles.map((article) => [article.newsId, article.title]));
        return {
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            items: comments.map((c) => ({
                id: c.commentId,
                content: c.content,
                status: c.status,
                likeCount: c.likeCount,
                dislikeCount: c.dislikeCount,
                createdAt: c.createdAt,
                author: { username: userMap.get(c.userId) ?? 'Độc giả' },
                article: { newsId: c.newsId, title: articleMap.get(c.newsId) ?? '' },
            })),
        };
    }
    async getAdminCommentStats() {
        const [totalVisible, totalHidden, totalDeleted, reactionsRow] = await Promise.all([
            this.newsCommentRepository.count({
                where: { status: news_comment_entity_1.NewsCommentStatus.VISIBLE },
            }),
            this.newsCommentRepository.count({
                where: { status: news_comment_entity_1.NewsCommentStatus.HIDDEN },
            }),
            this.newsCommentRepository.count({
                where: { status: news_comment_entity_1.NewsCommentStatus.DELETED },
            }),
            this.newsCommentRepository
                .createQueryBuilder('comment')
                .select('COALESCE(SUM(comment.like_count + comment.dislike_count), 0)', 'totalReactions')
                .getRawOne(),
        ]);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const commentsToday = await this.newsCommentRepository
            .createQueryBuilder('comment')
            .where('comment.created_at >= :today', { today })
            .andWhere('comment.created_at < :tomorrow', { tomorrow })
            .getCount();
        return {
            total: totalVisible + totalHidden + totalDeleted,
            totalVisible,
            totalHidden,
            totalDeleted,
            totalReactions: Number(reactionsRow?.totalReactions ?? 0),
            commentsToday,
        };
    }
    async hideComment(commentId) {
        const comment = await this.newsCommentRepository.findOneBy({ commentId });
        if (!comment)
            throw new common_1.NotFoundException('Bình luận không tìm thấy');
        if (comment.status === news_comment_entity_1.NewsCommentStatus.DELETED) {
            throw new common_1.BadRequestException('Không thể thay đổi bình luận đã xóa');
        }
        comment.status =
            comment.status === news_comment_entity_1.NewsCommentStatus.VISIBLE
                ? news_comment_entity_1.NewsCommentStatus.HIDDEN
                : news_comment_entity_1.NewsCommentStatus.VISIBLE;
        await this.newsCommentRepository.save(comment);
        return { id: comment.commentId, status: comment.status };
    }
    async deleteAdminComment(commentId) {
        const comment = await this.newsCommentRepository.findOneBy({ commentId });
        if (!comment)
            throw new common_1.NotFoundException('Bình luận không tìm thấy');
        comment.status = news_comment_entity_1.NewsCommentStatus.DELETED;
        await this.newsCommentRepository.save(comment);
        return { id: comment.commentId, status: comment.status };
    }
    async remove(newsId) {
        const article = await this.findOne(newsId);
        await this.newsRepository.remove(article);
        return { success: true };
    }
    async uploadCoverImage(newsId, file) {
        const article = await this.findOne(newsId);
        const url = await this.uploadImageToCloudinary(file, `news-cover-${newsId}`);
        article.titleImageUrl = url;
        await this.newsRepository.save(article);
        return { titleImageUrl: url };
    }
    async uploadImageToCloudinary(file, publicIdPrefix) {
        const cloudName = process.env.CLOUD_NAME;
        const apiKey = process.env.API_KEY;
        const apiSecret = process.env.API_SECRET;
        if (!cloudName || !apiKey || !apiSecret) {
            throw new common_1.InternalServerErrorException('Cloudinary environment variables are missing');
        }
        const folder = 'agri_ecommerce/news';
        const timestamp = Math.floor(Date.now() / 1000);
        const publicId = `${publicIdPrefix}-${Date.now()}`;
        const signature = (0, crypto_1.createHash)('sha1')
            .update(`folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
            .digest('hex');
        const formData = new FormData();
        formData.append('file', new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }), file.originalname);
        formData.append('api_key', apiKey);
        formData.append('timestamp', String(timestamp));
        formData.append('signature', signature);
        formData.append('folder', folder);
        formData.append('public_id', publicId);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData,
        });
        const payload = (await response.json());
        if (!response.ok || !payload.secure_url) {
            throw new common_1.InternalServerErrorException(payload.error?.message ?? 'Unable to upload image to Cloudinary');
        }
        return payload.secure_url;
    }
    normalizeSlug(value) {
        return value
            .trim()
            .toLowerCase()
            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
            .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
            .replace(/[ìíịỉĩ]/g, 'i')
            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
            .replace(/[ùúụủũưừứựửữ]/g, 'u')
            .replace(/[ỳýỵỷỹ]/g, 'y')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(news_entity_1.NewsEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(news_comment_entity_1.NewsCommentEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], NewsService);
//# sourceMappingURL=news.service.js.map