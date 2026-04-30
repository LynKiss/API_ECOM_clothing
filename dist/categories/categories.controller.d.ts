import { CreateCategoryDto } from './dto/create-category.dto';
import { ReorderCategoryDto } from './dto/reorder-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getCategories(): Promise<import("./entities/category.entity").CategoryEntity[]>;
    getCategoryTree(): Promise<any>;
    getCategoriesForAdmin(): Promise<import("./entities/category.entity").CategoryEntity[]>;
    getCategoryTreeForAdmin(): Promise<any>;
    getCategory(id: string): Promise<import("./entities/category.entity").CategoryEntity>;
    createCategory(createCategoryDto: CreateCategoryDto): Promise<import("./entities/category.entity").CategoryEntity>;
    updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<import("./entities/category.entity").CategoryEntity>;
    reorderCategory(id: string, reorderCategoryDto: ReorderCategoryDto): Promise<any>;
    removeCategory(id: string): Promise<{
        success: boolean;
    }>;
}
