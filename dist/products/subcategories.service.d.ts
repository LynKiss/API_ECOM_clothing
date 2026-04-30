import { Repository } from 'typeorm';
import { CategoryEntity } from '../categories/entities/category.entity';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { QuerySubcategoriesDto } from './dto/query-subcategories.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubcategoryEntity } from './entities/subcategory.entity';
export declare class SubcategoriesService {
    private readonly subcategoriesRepository;
    private readonly categoriesRepository;
    constructor(subcategoriesRepository: Repository<SubcategoryEntity>, categoriesRepository: Repository<CategoryEntity>);
    findAll(query: QuerySubcategoriesDto): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        items: SubcategoryEntity[];
    }>;
    findOne(subcategoryId: string): Promise<SubcategoryEntity>;
    create(dto: CreateSubcategoryDto): Promise<SubcategoryEntity>;
    update(subcategoryId: string, dto: UpdateSubcategoryDto): Promise<SubcategoryEntity>;
    remove(subcategoryId: string): Promise<{
        success: boolean;
    }>;
    private ensureSlugUnique;
    private normalizeSlug;
}
