export declare enum ProductCommentStatus {
    VISIBLE = "visible",
    HIDDEN = "hidden",
    DELETED = "deleted"
}
export declare class CommentEntity {
    commentId: string;
    userId: string;
    productId: string;
    orderItemId: string | null;
    content: string;
    rating: number | null;
    likeCount: number;
    dislikeCount: number;
    status: ProductCommentStatus;
    createdAt: Date;
    updatedAt: Date;
}
