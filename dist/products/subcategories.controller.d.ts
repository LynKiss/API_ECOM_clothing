import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { QuerySubcategoriesDto } from './dto/query-subcategories.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubcategoriesService } from './subcategories.service';
export declare class SubcategoriesController {
    private readonly subcategoriesService;
    constructor(subcategoriesService: SubcategoriesService);
    getSubcategories(query: QuerySubcategoriesDto): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        items: import("./entities/subcategory.entity").SubcategoryEntity[];
    }>;
    getSubcategory(id: string): Promise<import("./entities/subcategory.entity").SubcategoryEntity>;
    createSubcategory(dto: CreateSubcategoryDto): Promise<import("./entities/subcategory.entity").SubcategoryEntity>;
    updateSubcategory(id: string, dto: UpdateSubcategoryDto): Promise<import("./entities/subcategory.entity").SubcategoryEntity>;
    removeSubcategory(id: string): Promise<{
        success: boolean;
    }>;
}
