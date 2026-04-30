import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { ManageProductTagsDto } from './dto/manage-product-tags.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ProductTagEntity } from './entities/product-tag.entity';
import { ProductEntity } from './entities/product.entity';
import { TagEntity } from './entities/tag.entity';
export declare class TagsService {
    private readonly tagsRepository;
    private readonly productTagsRepository;
    private readonly productsRepository;
    constructor(tagsRepository: Repository<TagEntity>, productTagsRepository: Repository<ProductTagEntity>, productsRepository: Repository<ProductEntity>);
    findAll(search?: string): Promise<TagEntity[]>;
    findOne(tagId: string): Promise<TagEntity>;
    create(dto: CreateTagDto): Promise<TagEntity>;
    update(tagId: string, dto: UpdateTagDto): Promise<TagEntity>;
    remove(tagId: string): Promise<{
        success: boolean;
    }>;
    getProductTags(productId: string): Promise<TagEntity[]>;
    setProductTags(productId: string, dto: ManageProductTagsDto): Promise<TagEntity[]>;
    addProductTags(productId: string, dto: ManageProductTagsDto): Promise<TagEntity[]>;
    removeProductTag(productId: string, tagId: string): Promise<{
        success: boolean;
    }>;
    private ensureProductExists;
    private ensureNameUnique;
}
