export declare enum NewsCommentStatus {
    VISIBLE = "visible",
    HIDDEN = "hidden",
    DELETED = "deleted"
}
export declare class NewsCommentEntity {
    commentId: string;
    userId: string;
    newsId: string;
    content: string;
    likeCount: number;
    dislikeCount: number;
    status: NewsCommentStatus;
    createdAt: Date;
    updatedAt: Date;
}
