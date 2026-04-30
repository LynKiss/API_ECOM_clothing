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
exports.SubcategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("../categories/entities/category.entity");
const subcategory_entity_1 = require("./entities/subcategory.entity");
let SubcategoriesService = class SubcategoriesService {
    subcategoriesRepository;
    categoriesRepository;
    constructor(subcategoriesRepository, categoriesRepository) {
        this.subcategoriesRepository = subcategoriesRepository;
        this.categoriesRepository = categoriesRepository;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const queryBuilder = this.subcategoriesRepository.createQueryBuilder('sub');
        if (query.search) {
            queryBuilder.andWhere('sub.subcategory_name LIKE :search', {
                search: `%${query.search}%`,
            });
        }
        if (query.categoryId) {
            queryBuilder.andWhere('sub.category_id = :categoryId', {
                categoryId: query.categoryId,
            });
        }
        if (query.isActive !== undefined) {
            queryBuilder.andWhere('sub.is_active = :isActive', {
                isActive: query.isActive,
            });
        }
        queryBuilder
            .orderBy('sub.subcategory_name', 'ASC')
            .skip((page - 1) * limit)
            .take(limit);
        const [items, total] = await queryBuilder.getManyAndCount();
        return {
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
            items,
        };
    }
    async findOne(subcategoryId) {
        const subcategory = await this.subcategoriesRepository.findOneBy({
            subcategoryId,
        });
        if (!subcategory) {
            throw new common_1.NotFoundException('Subcategory not found');
        }
        return subcategory;
    }
    async create(dto) {
        const category = await this.categoriesRepository.findOneBy({
            categoryId: dto.categoryId,
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const slug = this.normalizeSlug(dto.subcategorySlug ?? dto.subcategoryName);
        await this.ensureSlugUnique(slug);
        const subcategory = this.subcategoriesRepository.create({
            categoryId: dto.categoryId,
            subcategoryName: dto.subcategoryName,
            subcategorySlug: slug,
            isActive: dto.isActive ?? true,
        });
        return this.subcategoriesRepository.save(subcategory);
    }
    async update(subcategoryId, dto) {
        const subcategory = await this.findOne(subcategoryId);
        if (dto.categoryId) {
            const category = await this.categoriesRepository.findOneBy({
                categoryId: dto.categoryId,
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
        }
        const nextSlug = dto.subcategorySlug
            ? this.normalizeSlug(dto.subcategorySlug)
            : dto.subcategoryName
                ? this.normalizeSlug(dto.subcategoryName)
                : null;
        if (nextSlug && nextSlug !== subcategory.subcategorySlug) {
            await this.ensureSlugUnique(nextSlug, subcategoryId);
        }
        subcategory.categoryId = dto.categoryId ?? subcategory.categoryId;
        subcategory.subcategoryName =
            dto.subcategoryName ?? subcategory.subcategoryName;
        subcategory.subcategorySlug =
            nextSlug ?? subcategory.subcategorySlug;
        subcategory.isActive = dto.isActive ?? subcategory.isActive;
        return this.subcategoriesRepository.save(subcategory);
    }
    async remove(subcategoryId) {
        const subcategory = await this.findOne(subcategoryId);
        await this.subcategoriesRepository.remove(subcategory);
        return { success: true };
    }
    async ensureSlugUnique(slug, excludeId) {
        const existing = await this.subcategoriesRepository.findOneBy({
            subcategorySlug: slug,
        });
        if (existing && existing.subcategoryId !== excludeId) {
            throw new common_1.ConflictException('Subcategory slug already exists');
        }
    }
    normalizeSlug(value) {
        return value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
};
exports.SubcategoriesService = SubcategoriesService;
exports.SubcategoriesService = SubcategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subcategory_entity_1.SubcategoryEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SubcategoriesService);
//# sourceMappingURL=subcategories.service.js.map