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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./entities/category.entity");
const product_entity_1 = require("../products/entities/product.entity");
let CategoriesService = class CategoriesService {
    categoriesRepository;
    productsRepository;
    constructor(categoriesRepository, productsRepository) {
        this.categoriesRepository = categoriesRepository;
        this.productsRepository = productsRepository;
    }
    async findAll() {
        return this.categoriesRepository.find({
            where: { isActive: true },
            order: { parentId: 'ASC', sortOrder: 'ASC', categoryName: 'ASC' },
        });
    }
    async findTree() {
        const categories = await this.categoriesRepository.find({
            where: { isActive: true },
            order: { sortOrder: 'ASC', categoryName: 'ASC' },
        });
        return this.buildTree(categories);
    }
    async findAllForAdmin() {
        return this.categoriesRepository.find({
            order: { parentId: 'ASC', sortOrder: 'ASC', categoryName: 'ASC' },
        });
    }
    async findTreeForAdmin() {
        const categories = await this.categoriesRepository.find({
            order: { sortOrder: 'ASC', categoryName: 'ASC' },
        });
        return this.buildTree(categories);
    }
    async findOne(categoryId) {
        const category = await this.categoriesRepository.findOne({
            where: { categoryId },
            relations: {
                parent: true,
                children: true,
            },
            order: {
                children: {
                    sortOrder: 'ASC',
                    categoryName: 'ASC',
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async create(createCategoryDto) {
        const categorySlug = this.normalizeSlug(createCategoryDto.categorySlug ?? createCategoryDto.categoryName);
        const existedCategory = await this.categoriesRepository.findOneBy({
            categorySlug,
        });
        if (existedCategory) {
            throw new common_1.ConflictException('Category slug already exists');
        }
        const normalizedParentId = await this.normalizeParentId(createCategoryDto.parentId);
        const categoryParentId = normalizedParentId ?? null;
        const category = this.categoriesRepository.create({
            categoryName: createCategoryDto.categoryName,
            categoryDescription: createCategoryDto.categoryDescription ?? null,
            categorySlug,
            parentId: categoryParentId,
            isActive: createCategoryDto.isActive ?? true,
            sortOrder: await this.getNextSortOrder(categoryParentId),
        });
        return this.categoriesRepository.save(category);
    }
    async update(categoryId, updateCategoryDto) {
        const category = await this.findOne(categoryId);
        if (updateCategoryDto.categorySlug !== undefined || updateCategoryDto.categoryName) {
            const slugSource = updateCategoryDto.categorySlug?.trim()
                ? updateCategoryDto.categorySlug
                : updateCategoryDto.categoryName
                    ? updateCategoryDto.categoryName
                    : category.categoryName;
            const nextSlug = this.normalizeSlug(slugSource);
            const existedCategory = await this.categoriesRepository.findOneBy({
                categorySlug: nextSlug,
            });
            if (existedCategory &&
                existedCategory.categoryId !== category.categoryId) {
                throw new common_1.ConflictException('Category slug already exists');
            }
            category.categorySlug = nextSlug;
        }
        if (updateCategoryDto.parentId !== undefined) {
            const previousParentId = category.parentId;
            const normalizedParentId = await this.normalizeParentId(updateCategoryDto.parentId, category.categoryId);
            if (normalizedParentId !== undefined) {
                category.parentId = normalizedParentId;
                if (normalizedParentId !== previousParentId) {
                    category.sortOrder = await this.getNextSortOrder(normalizedParentId);
                }
            }
        }
        category.categoryName =
            updateCategoryDto.categoryName ?? category.categoryName;
        category.categoryDescription =
            updateCategoryDto.categoryDescription !== undefined
                ? (updateCategoryDto.categoryDescription || null)
                : category.categoryDescription;
        category.isActive = updateCategoryDto.isActive ?? category.isActive;
        return this.categoriesRepository.save(category);
    }
    async reorder(categoryId, reorderCategoryDto) {
        const category = await this.findOne(categoryId);
        const nextParentId = reorderCategoryDto.parentId === undefined
            ? category.parentId
            : await this.normalizeParentId(reorderCategoryDto.parentId, category.categoryId);
        const siblings = await this.categoriesRepository.find({
            where: { parentId: nextParentId ?? (0, typeorm_2.IsNull)() },
            order: { sortOrder: 'ASC', categoryName: 'ASC' },
        });
        const siblingIds = siblings
            .filter((sibling) => sibling.categoryId !== categoryId)
            .map((sibling) => sibling.categoryId);
        const targetIndex = Math.min(Math.max(reorderCategoryDto.targetIndex, 0), siblingIds.length);
        siblingIds.splice(targetIndex, 0, categoryId);
        for (let index = 0; index < siblingIds.length; index += 1) {
            await this.categoriesRepository.update(siblingIds[index], {
                parentId: nextParentId ?? null,
                sortOrder: index,
            });
        }
        return this.findTreeForAdmin();
    }
    async remove(categoryId) {
        const category = await this.findOne(categoryId);
        const childCount = await this.categoriesRepository.count({
            where: { parentId: categoryId },
        });
        if (childCount > 0) {
            throw new common_1.BadRequestException('Cannot delete category while child categories still exist');
        }
        const productCount = await this.productsRepository.count({
            where: { categoryId },
        });
        if (productCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete category: ${productCount} product(s) are still assigned to it`);
        }
        await this.categoriesRepository.remove(category);
        return { success: true };
    }
    async normalizeParentId(parentId, currentCategoryId) {
        if (parentId === undefined) {
            return currentCategoryId ? undefined : null;
        }
        if (parentId === null || parentId === '') {
            return null;
        }
        if (currentCategoryId && parentId === currentCategoryId) {
            throw new common_1.BadRequestException('Category cannot be its own parent');
        }
        const parentCategory = await this.categoriesRepository.findOneBy({
            categoryId: parentId,
        });
        if (!parentCategory) {
            throw new common_1.NotFoundException('Parent category not found');
        }
        if (currentCategoryId) {
            await this.ensureNoCircularParent(parentId, currentCategoryId);
        }
        return parentId;
    }
    async ensureNoCircularParent(parentId, currentCategoryId) {
        let cursor = parentId;
        while (cursor) {
            if (cursor === currentCategoryId) {
                throw new common_1.BadRequestException('Circular category hierarchy is not allowed');
            }
            const currentParent = await this.categoriesRepository.findOne({
                where: { categoryId: cursor },
                select: {
                    categoryId: true,
                    parentId: true,
                },
            });
            cursor = currentParent?.parentId ?? null;
        }
    }
    sortTree(nodes) {
        return nodes
            .sort((a, b) => {
            if (a.sortOrder !== b.sortOrder) {
                return a.sortOrder - b.sortOrder;
            }
            return a.categoryName.localeCompare(b.categoryName);
        })
            .map((node) => {
            const sortedChildren = this.sortTree(node.children);
            const descendantCount = sortedChildren.reduce((total, child) => total + child.productCount, 0);
            return {
                ...node,
                children: sortedChildren,
                productCount: node.directProductCount + descendantCount,
            };
        });
    }
    buildTreeFromCounts(categories, nodeMap, directProductCounts) {
        const roots = [];
        for (const category of categories) {
            nodeMap.set(category.categoryId, {
                categoryId: category.categoryId,
                categoryName: category.categoryName,
                categoryDescription: category.categoryDescription,
                categorySlug: category.categorySlug,
                parentId: category.parentId,
                isActive: category.isActive,
                sortOrder: category.sortOrder,
                directProductCount: directProductCounts.get(category.categoryId) ?? 0,
                productCount: directProductCounts.get(category.categoryId) ?? 0,
                createdAt: category.createdAt,
                updatedAt: category.updatedAt,
                children: [],
            });
        }
        for (const category of categories) {
            const currentNode = nodeMap.get(category.categoryId);
            if (!currentNode) {
                continue;
            }
            if (category.parentId) {
                const parentNode = nodeMap.get(category.parentId);
                if (parentNode) {
                    parentNode.children.push(currentNode);
                    continue;
                }
            }
            roots.push(currentNode);
        }
        return this.sortTree(roots);
    }
    async buildTree(categories) {
        const directProductCounts = await this.getProductCountsByCategory();
        const nodeMap = new Map();
        return this.buildTreeFromCounts(categories, nodeMap, directProductCounts);
    }
    async getProductCountsByCategory() {
        const rows = await this.productsRepository
            .createQueryBuilder('product')
            .select('product.categoryId', 'categoryId')
            .addSelect('COUNT(product.productId)', 'productCount')
            .groupBy('product.categoryId')
            .getRawMany();
        return new Map(rows.map((row) => [row.categoryId, Number(row.productCount)]));
    }
    async getNextSortOrder(parentId) {
        const siblingCount = await this.categoriesRepository.count({
            where: { parentId: parentId ?? (0, typeorm_2.IsNull)() },
        });
        return siblingCount;
    }
    normalizeSlug(value) {
        return value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map