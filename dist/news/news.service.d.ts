import { Repository } from 'typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { QueryNewsDto } from './dto/query-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsCommentEntity, NewsCommentStatus } from './entities/news-comment.entity';
import { NewsEntity } from './entities/news.entity';
import { UserEntity } from '../users/entities/user.entity';
type UploadedImageFile = {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
};
export declare class NewsService {
    private readonly newsRepository;
    private readonly newsCommentRepository;
    private readonly usersRepository;
    constructor(newsRepository: Repository<NewsEntity>, newsCommentRepository: Repository<NewsCommentEntity>, usersRepository: Repository<UserEntity>);
    private mapArticle;
    create(userId: string, createNewsDto: CreateNewsDto): Promise<NewsEntity>;
    findPublishedList(params: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        items: {
            _id: string;
            newsId: string;
            title: string;
            subTitle: string | null;
            slug: string;
            titleImageUrl: string | null;
            content: string | null;
            isPublished: boolean;
            views: number;
            likeCount: number;
            createdAt: Date;
            updatedAt: Date;
            author: {
                username?: string;
            } | undefined;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findBySlug(slug: string): Promise<{
        _id: string;
        newsId: string;
        title: string;
        subTitle: string | null;
        slug: string;
        titleImageUrl: string | null;
        content: string | null;
        isPublished: boolean;
        views: number;
        likeCount: number;
        createdAt: Date;
        updatedAt: Date;
        author: {
            username?: string;
        } | undefined;
    }>;
    getNewsComments(newsId: string): Promise<{
        id: string;
        content: string;
        likeCount: number;
        dislikeCount: number;
        createdAt: Date;
        author: {
            username: string;
        };
    }[]>;
    addNewsComment(newsId: string, userId: string, content: string): Promise<{
        id: string;
        content: string;
        likeCount: number;
        dislikeCount: number;
        createdAt: Date;
        author: {
            username: string;
        };
    }>;
    likeNewsComment(commentId: string): Promise<{
        likeCount: number;
        dislikeCount: number;
    }>;
    unlikeNewsComment(commentId: string): Promise<{
        likeCount: number;
        dislikeCount: number;
    }>;
    dislikeNewsComment(commentId: string): Promise<{
        likeCount: number;
        dislikeCount: number;
    }>;
    undislikeNewsComment(commentId: string): Promise<{
        likeCount: number;
        dislikeCount: number;
    }>;
    findAll(query: QueryNewsDto): Promise<{
        items: NewsEntity[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(newsId: string): Promise<NewsEntity>;
    update(newsId: string, updateNewsDto: UpdateNewsDto): Promise<NewsEntity>;
    publish(newsId: string): Promise<NewsEntity>;
    unpublish(newsId: string): Promise<NewsEntity>;
    incrementView(newsId: string): Promise<{
        views: number;
    }>;
    likeArticle(newsId: string): Promise<{
        likeCount: number;
    }>;
    unlikeArticle(newsId: string): Promise<{
        likeCount: number;
    }>;
    findAdminComments(params: {
        page?: number;
        limit?: number;
        status?: string;
        newsId?: string;
        search?: string;
    }): Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        items: {
            id: string;
            content: string;
            status: NewsCommentStatus;
            likeCount: number;
            dislikeCount: number;
            createdAt: Date;
            author: {
                username: string;
            };
            article: {
                newsId: string;
                title: string;
            };
        }[];
    }>;
    getAdminCommentStats(): Promise<{
        total: number;
        totalVisible: number;
        totalHidden: number;
        totalDeleted: number;
        totalReactions: number;
        commentsToday: number;
    }>;
    hideComment(commentId: string): Promise<{
        id: string;
        status: NewsCommentStatus.VISIBLE | NewsCommentStatus.HIDDEN;
    }>;
    deleteAdminComment(commentId: string): Promise<{
        id: string;
        status: NewsCommentStatus.DELETED;
    }>;
    remove(newsId: string): Promise<{
        success: boolean;
    }>;
    uploadCoverImage(newsId: string, file: UploadedImageFile): Promise<{
        titleImageUrl: string;
    }>;
    private uploadImageToCloudinary;
    private normalizeSlug;
}
export {};
