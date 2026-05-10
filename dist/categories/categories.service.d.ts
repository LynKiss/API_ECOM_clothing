import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ReorderCategoryDto } from './dto/reorder-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { ProductEntity } from '../products/entities/product.entity';
export type CategoryTreeNode = {
    categoryId: string;
    categoryName: string;
    categoryDescription: string | null;
    categorySlug: string;
    parentId: string | null;
    isActive: boolean;
    sortOrder: number;
    imageUrl: string | null;
    directProductCount: number;
    productCount: number;
    createdAt: Date;
    updatedAt: Date;
    children: CategoryTreeNode[];
};
type UploadedImageFile = {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
};
export declare class CategoriesService {
    private readonly categoriesRepository;
    private readonly productsRepository;
    constructor(categoriesRepository: Repository<CategoryEntity>, productsRepository: Repository<ProductEntity>);
    findAll(): Promise<CategoryEntity[]>;
    findTree(): Promise<any>;
    findAllForAdmin(): Promise<CategoryEntity[]>;
    findTreeForAdmin(): Promise<any>;
    findOne(categoryId: string): Promise<CategoryEntity>;
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity>;
    update(categoryId: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity>;
    reorder(categoryId: string, reorderCategoryDto: ReorderCategoryDto): Promise<any>;
    uploadImage(categoryId: string, file: UploadedImageFile): Promise<CategoryEntity>;
    remove(categoryId: string): Promise<{
        success: boolean;
    }>;
    private normalizeParentId;
    private ensureNoCircularParent;
    private sortTree;
    private buildTreeFromCounts;
    private buildTree;
    private getProductCountsByCategory;
    private getNextSortOrder;
    private normalizeSlug;
    private uploadImageToCloudinary;
}
export {};
