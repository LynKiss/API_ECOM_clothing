import type { IUser } from '../users/users.interface';
import { CreateNewsDto } from './dto/create-news.dto';
import { QueryNewsDto } from './dto/query-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsService } from './news.service';
type UploadedImageFile = {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
};
export declare class NewsController {
    private readonly newsService;
    constructor(newsService: NewsService);
    getPublishedNews(page?: string, limit?: string, search?: string): Promise<{
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
    getNewsBySlug(slug: string): Promise<{
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
    getNews(query: QueryNewsDto): Promise<{
        items: import("./entities/news.entity").NewsEntity[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createNews(currentUser: IUser, createNewsDto: CreateNewsDto): Promise<import("./entities/news.entity").NewsEntity>;
    publishNews(id: string): Promise<import("./entities/news.entity").NewsEntity>;
    unpublishNews(id: string): Promise<import("./entities/news.entity").NewsEntity>;
    getNewsDetail(id: string): Promise<import("./entities/news.entity").NewsEntity>;
    updateNews(id: string, updateNewsDto: UpdateNewsDto): Promise<import("./entities/news.entity").NewsEntity>;
    uploadCoverImage(id: string, file: UploadedImageFile): Promise<{
        titleImageUrl: string;
    }>;
    incrementView(id: string): Promise<{
        views: number;
    }>;
    likeArticle(id: string): Promise<{
        likeCount: number;
    }>;
    unlikeArticle(id: string): Promise<{
        likeCount: number;
    }>;
    getMyComments(currentUser: IUser, page?: string, limit?: string, status?: string, search?: string): Promise<{
        items: {
            id: string;
            commentId: string;
            newsId: string;
            articleTitle: string | null;
            articleSlug: string | null;
            content: string;
            imageUrls: never[];
            likeCount: number;
            dislikeCount: number;
            status: import("./entities/news-comment.entity").NewsCommentStatus;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getComments(id: string): Promise<{
        id: string;
        content: string;
        likeCount: number;
        dislikeCount: number;
        createdAt: Date;
        author: {
            username: string;
        };
    }[]>;
    addComment(currentUser: IUser, id: string, body: {
        content: string;
    }): Promise<{
        id: string;
        content: string;
        likeCount: number;
        dislikeCount: number;
        createdAt: Date;
        author: {
            username: string;
        };
    }>;
    likeComment(commentId: string): Promise<{
        likeCount: number;
        dislikeCount: number;
    }>;
    unlikeComment(commentId: string): Promise<{
        likeCount: number;
        dislikeCount: number;
    }>;
    dislikeComment(commentId: string): Promise<{
        likeCount: number;
        dislikeCount: number;
    }>;
    undislikeComment(commentId: string): Promise<{
        likeCount: number;
        dislikeCount: number;
    }>;
    getAdminComments(page?: string, limit?: string, status?: string, newsId?: string, search?: string): Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        items: {
            id: string;
            content: string;
            status: import("./entities/news-comment.entity").NewsCommentStatus;
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
        status: import("./entities/news-comment.entity").NewsCommentStatus.VISIBLE | import("./entities/news-comment.entity").NewsCommentStatus.HIDDEN;
    }>;
    deleteComment(commentId: string): Promise<{
        id: string;
        status: import("./entities/news-comment.entity").NewsCommentStatus.DELETED;
    }>;
    deleteNews(id: string): Promise<{
        success: boolean;
    }>;
}
export {};
