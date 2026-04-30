export declare enum NewsStatusFilter {
    ALL = "all",
    PUBLISHED = "published",
    DRAFT = "draft"
}
export declare class QueryNewsDto {
    search?: string;
    status?: NewsStatusFilter;
    page?: number;
    limit?: number;
}
