"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_tag_entity_1 = require("./entities/product-tag.entity");
const product_entity_1 = require("./entities/product.entity");
const tag_entity_1 = require("./entities/tag.entity");
let TagsService = class TagsService {
    tagsRepository;
    productTagsRepository;
    productsRepository;
    constructor(tagsRepository, productTagsRepository, productsRepository) {
        this.tagsRepository = tagsRepository;
        this.productTagsRepository = productTagsRepository;
        this.productsRepository = productsRepository;
    }
    async findAll(search) {
        const where = search ? { tagName: (0, typeorm_2.Like)(`%${search}%`) } : {};
        return this.tagsRepository.find({
            where,
            order: { tagName: 'ASC' },
        });
    }
    async findOne(tagId) {
        const tag = await this.tagsRepository.findOneBy({ tagId });
        if (!tag) {
            throw new common_1.NotFoundException('Tag not found');
        }
        return tag;
    }
    async create(dto) {
        await this.ensureNameUnique(dto.tagName);
        const tag = this.tagsRepository.create({ tagName: dto.tagName });
        return this.tagsRepository.save(tag);
    }
    async update(tagId, dto) {
        const tag = await this.findOne(tagId);
        if (dto.tagName && dto.tagName !== tag.tagName) {
            await this.ensureNameUnique(dto.tagName, tagId);
        }
        tag.tagName = dto.tagName ?? tag.tagName;
        return this.tagsRepository.save(tag);
    }
    async remove(tagId) {
        const tag = await this.findOne(tagId);
        await this.productTagsRepository.delete({ tagId });
        await this.tagsRepository.remove(tag);
        return { success: true };
    }
    async getProductTags(productId) {
        await this.ensureProductExists(productId);
        const productTags = await this.productTagsRepository.findBy({ productId });
        if (productTags.length === 0)
            return [];
        const tagIds = productTags.map((pt) => pt.tagId);
        return this.tagsRepository.findBy(tagIds.map((tagId) => ({ tagId })));
    }
    async setProductTags(productId, dto) {
        await this.ensureProductExists(productId);
        if (dto.tagIds.length > 0) {
            const tags = await this.tagsRepository.findBy(dto.tagIds.map((tagId) => ({ tagId })));
            if (tags.length !== dto.tagIds.length) {
                throw new common_1.NotFoundException('One or more tags not found');
            }
        }
        await this.productTagsRepository.delete({ productId });
        if (dto.tagIds.length > 0) {
            const entities = dto.tagIds.map((tagId) => this.productTagsRepository.create({ productId, tagId }));
            await this.productTagsRepository.save(entities);
        }
        return this.getProductTags(productId);
    }
    async addProductTags(productId, dto) {
        await this.ensureProductExists(productId);
        const tags = await this.tagsRepository.findBy(dto.tagIds.map((tagId) => ({ tagId })));
        if (tags.length !== dto.tagIds.length) {
            throw new common_1.NotFoundException('One or more tags not found');
        }
        const existing = await this.productTagsRepository.findBy({ productId });
        const existingTagIds = new Set(existing.map((pt) => pt.tagId));
        const newEntities = dto.tagIds
            .filter((tagId) => !existingTagIds.has(tagId))
            .map((tagId) => this.productTagsRepository.create({ productId, tagId }));
        if (newEntities.length > 0) {
            await this.productTagsRepository.save(newEntities);
        }
        return this.getProductTags(productId);
    }
    async removeProductTag(productId, tagId) {
        await this.ensureProductExists(productId);
        await this.findOne(tagId);
        await this.productTagsRepository.delete({ productId, tagId });
        return { success: true };
    }
    async ensureProductExists(productId) {
        const product = await this.productsRepository.findOneBy({ productId });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
    }
    async ensureNameUnique(name, excludeId) {
        const existing = await this.tagsRepository.findOneBy({ tagName: name });
        if (existing && existing.tagId !== excludeId) {
            throw new common_1.ConflictException('Tag name already exists');
        }
    }
};
exports.TagsService = TagsService;
exports.TagsService = TagsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tag_entity_1.TagEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(product_tag_entity_1.ProductTagEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TagsService);
//# sourceMappingURL=tags.service.js.map