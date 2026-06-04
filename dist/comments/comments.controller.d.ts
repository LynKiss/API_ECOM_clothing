import type { IUser } from '../users/users.interface';
import { CreateReviewDto } from './dto/create-review.dto';
import { CommentsService } from './comments.service';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    getProductReviews(productId: string): Promise<{
        id: string;
        userId: string;
        orderItemId: string | null;
        content: string;
        rating: number | null;
        likeCount: number;
        dislikeCount: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    likeReview(id: string): Promise<{
        likeCount: number;
        dislikeCount: number;
    }>;
    unlikeReview(id: string): Promise<{
        likeCount: number;
        dislikeCount: number;
    }>;
    dislikeReview(id: string): Promise<{
        likeCount: number;
        dislikeCount: number;
    }>;
    undislikeReview(id: string): Promise<{
        likeCount: number;
        dislikeCount: number;
    }>;
    createReview(currentUser: IUser, productId: string, createReviewDto: CreateReviewDto): Promise<{
        id: string;
        userId: string;
        productId: string;
        orderItemId: string | null;
        content: string;
        rating: number | null;
        status: import("./entities/comment.entity").ProductCommentStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMyReviews(currentUser: IUser, page?: string, limit?: string, status?: string, search?: string): Promise<{
        items: {
            id: string;
            commentId: string;
            productId: string;
            productName: string | null;
            productSlug: string | null;
            orderItemId: string | null;
            content: string;
            rating: number | null;
            imageUrls: never[];
            likeCount: number;
            dislikeCount: number;
            status: import("./entities/comment.entity").ProductCommentStatus;
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
    getAdminStats(): Promise<{
        total: number;
        totalVisible: number;
        totalHidden: number;
        totalDeleted: number;
        averageRating: number;
        reviewsToday: number;
    }>;
    listAdminReviews(page?: string, limit?: string, status?: string, rating?: string, productId?: string, search?: string): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        items: {
            commentId: string;
            content: string;
            rating: number | null;
            status: import("./entities/comment.entity").ProductCommentStatus;
            likeCount: number;
            dislikeCount: number;
            createdAt: Date;
            user: {
                username: string | null;
            };
            product: {
                productName: string | null;
            };
        }[];
    }>;
    hideReview(id: string): Promise<{
        commentId: string;
        status: import("./entities/comment.entity").ProductCommentStatus.HIDDEN;
    }>;
    showReview(id: string): Promise<{
        commentId: string;
        status: import("./entities/comment.entity").ProductCommentStatus.VISIBLE;
    }>;
    deleteReview(id: string): Promise<{
        commentId: string;
        status: import("./entities/comment.entity").ProductCommentStatus.DELETED;
    }>;
}
