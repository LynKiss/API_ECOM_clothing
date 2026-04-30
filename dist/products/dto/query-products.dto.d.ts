export declare enum ProductSortBy {
    CREATED_AT = "created_at",
    PRICE = "product_price",
    NAME = "product_name",
    RATING = "rating_average",
    QUANTITY = "quantity_available"
}
export declare enum SortOrder {
    ASC = "ASC",
    DESC = "DESC"
}
export declare class QueryProductsDto {
    search?: string;
    categoryId?: string;
    categoryIds?: string;
    subcategoryId?: string;
    originId?: string;
    tagId?: string;
    priceMin?: string;
    priceMax?: string;
    sortBy?: ProductSortBy;
    sortOrder?: SortOrder;
    page?: number;
    limit?: number;
    includeHidden?: boolean;
    expiredSoon?: boolean;
    lowStock?: boolean;
    lowStockThreshold?: number;
    isFeatured?: boolean;
    hasSalePrice?: boolean;
}
