import { CreateTagDto } from './dto/create-tag.dto';
import { ManageProductTagsDto } from './dto/manage-product-tags.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    getTags(search?: string): Promise<import("./entities/tag.entity").TagEntity[]>;
    getProductTags(productId: string): Promise<import("./entities/tag.entity").TagEntity[]>;
    addProductTags(productId: string, dto: ManageProductTagsDto): Promise<import("./entities/tag.entity").TagEntity[]>;
    setProductTags(productId: string, dto: ManageProductTagsDto): Promise<import("./entities/tag.entity").TagEntity[]>;
    removeProductTag(productId: string, tagId: string): Promise<{
        success: boolean;
    }>;
    getTag(id: string): Promise<import("./entities/tag.entity").TagEntity>;
    createTag(dto: CreateTagDto): Promise<import("./entities/tag.entity").TagEntity>;
    updateTag(id: string, dto: UpdateTagDto): Promise<import("./entities/tag.entity").TagEntity>;
    removeTag(id: string): Promise<{
        success: boolean;
    }>;
}
