export declare class NewsEntity {
    newsId: string;
    userId: string;
    title: string;
    titleImageUrl: string | null;
    subTitle: string | null;
    slug: string;
    content: string | null;
    isDraft: boolean;
    isPublished: boolean;
    publishedAt: Date | null;
    views: number;
    likeCount: number;
    createdAt: Date;
    updatedAt: Date;
}
