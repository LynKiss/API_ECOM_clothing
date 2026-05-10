export declare class CategoryEntity {
    categoryId: string;
    categoryName: string;
    categoryDescription: string | null;
    categorySlug: string;
    parentId: string | null;
    isActive: boolean;
    sortOrder: number;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    parent?: CategoryEntity | null;
    children?: CategoryEntity[];
}
