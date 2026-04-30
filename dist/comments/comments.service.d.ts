import { Repository } from 'typeorm';
import { OrderItemEntity } from '../orders/entities/order-item.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { CommentEntity, ProductCommentStatus } from './entities/comment.entity';
export declare class CommentsService {
    private readonly commentsRepository;
    private readonly productsRepository;
    private readonly ordersRepository;
    private readonly orderItemsRepository;
    private readonly usersRepository;
    constructor(commentsRepository: Repository<CommentEntity>, productsRepository: Repository<ProductEntity>, ordersRepository: Repository<OrderEntity>, orderItemsRepository: Repository<OrderItemEntity>, usersRepository: Repository<UserEntity>);
    findProductReviews(productId: string): Promise<{
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
    createReview(userId: string, productId: string, dto: CreateReviewDto): Promise<{
        id: string;
        userId: string;
        productId: string;
        orderItemId: string | null;
        content: string;
        rating: number | null;
        status: ProductCommentStatus;
        createdAt: Date;
        updatedAt: Date;
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
    findAdminReviews(params: {
        page: number;
        limit: number;
        status?: string;
        rating?: number;
        productId?: string;
        search?: string;
    }): Promise<{
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
            status: ProductCommentStatus;
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
        status: ProductCommentStatus.HIDDEN;
    }>;
    showReview(id: string): Promise<{
        commentId: string;
        status: ProductCommentStatus.VISIBLE;
    }>;
    deleteReview(id: string): Promise<{
        commentId: string;
        status: ProductCommentStatus.DELETED;
    }>;
    getAdminStats(): Promise<{
        total: number;
        totalVisible: number;
        totalHidden: number;
        totalDeleted: number;
        averageRating: number;
        reviewsToday: number;
    }>;
    private refreshProductRating;
    private ensureProductExists;
    private ensureUserExists;
}
