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
exports.ProductsService = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const warehouse_entity_1 = require("../warehouses/entities/warehouse.entity");
const warehouse_stock_entity_1 = require("../warehouses/entities/warehouse-stock.entity");
const notification_entity_1 = require("../notifications/entities/notification.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const category_entity_1 = require("../categories/entities/category.entity");
const discount_category_entity_1 = require("../discounts/entities/discount-category.entity");
const discount_entity_1 = require("../discounts/entities/discount.entity");
const discount_product_entity_1 = require("../discounts/entities/discount-product.entity");
const user_entity_1 = require("../users/entities/user.entity");
const adjust_inventory_dto_1 = require("./dto/adjust-inventory.dto");
const query_products_dto_1 = require("./dto/query-products.dto");
const inventory_transaction_entity_1 = require("./entities/inventory-transaction.entity");
const color_entity_1 = require("./entities/color.entity");
const origin_entity_1 = require("./entities/origin.entity");
const product_description_image_entity_1 = require("./entities/product-description-image.entity");
const product_entity_1 = require("./entities/product.entity");
const product_image_entity_1 = require("./entities/product-image.entity");
const product_tag_entity_1 = require("./entities/product-tag.entity");
const product_variant_entity_1 = require("./entities/product-variant.entity");
const size_entity_1 = require("./entities/size.entity");
const subcategory_entity_1 = require("./entities/subcategory.entity");
const tag_entity_1 = require("./entities/tag.entity");
const variant_image_entity_1 = require("./entities/variant-image.entity");
const wishlist_entity_1 = require("./entities/wishlist.entity");
let ProductsService = class ProductsService {
    productsRepository;
    productImagesRepository;
    productDescriptionImagesRepository;
    productVariantsRepository;
    colorsRepository;
    sizesRepository;
    variantImagesRepository;
    categoriesRepository;
    subcategoriesRepository;
    originsRepository;
    tagsRepository;
    productTagsRepository;
    inventoryTransactionsRepository;
    wishlistRepository;
    usersRepository;
    discountsRepository;
    discountCategoriesRepository;
    discountProductsRepository;
    notificationsService;
    dataSource;
    constructor(productsRepository, productImagesRepository, productDescriptionImagesRepository, productVariantsRepository, colorsRepository, sizesRepository, variantImagesRepository, categoriesRepository, subcategoriesRepository, originsRepository, tagsRepository, productTagsRepository, inventoryTransactionsRepository, wishlistRepository, usersRepository, discountsRepository, discountCategoriesRepository, discountProductsRepository, notificationsService, dataSource) {
        this.productsRepository = productsRepository;
        this.productImagesRepository = productImagesRepository;
        this.productDescriptionImagesRepository = productDescriptionImagesRepository;
        this.productVariantsRepository = productVariantsRepository;
        this.colorsRepository = colorsRepository;
        this.sizesRepository = sizesRepository;
        this.variantImagesRepository = variantImagesRepository;
        this.categoriesRepository = categoriesRepository;
        this.subcategoriesRepository = subcategoriesRepository;
        this.originsRepository = originsRepository;
        this.tagsRepository = tagsRepository;
        this.productTagsRepository = productTagsRepository;
        this.inventoryTransactionsRepository = inventoryTransactionsRepository;
        this.wishlistRepository = wishlistRepository;
        this.usersRepository = usersRepository;
        this.discountsRepository = discountsRepository;
        this.discountCategoriesRepository = discountCategoriesRepository;
        this.discountProductsRepository = discountProductsRepository;
        this.notificationsService = notificationsService;
        this.dataSource = dataSource;
    }
    async syncDefaultWarehouseStock(em, productId, qtyDelta) {
        if (qtyDelta === 0)
            return;
        const warehouse = await em.findOne(warehouse_entity_1.WarehouseEntity, { where: { isDefault: true } });
        if (!warehouse)
            return;
        const stock = await em.findOne(warehouse_stock_entity_1.WarehouseStockEntity, {
            where: { warehouseId: warehouse.warehouseId, productId },
        });
        if (stock) {
            stock.quantity = Math.max(0, stock.quantity + qtyDelta);
            await em.save(warehouse_stock_entity_1.WarehouseStockEntity, stock);
        }
        else if (qtyDelta > 0) {
            await em.save(warehouse_stock_entity_1.WarehouseStockEntity, em.create(warehouse_stock_entity_1.WarehouseStockEntity, {
                warehouseId: warehouse.warehouseId,
                productId,
                quantity: qtyDelta,
            }));
        }
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const sortBy = query.sortBy ?? query_products_dto_1.ProductSortBy.CREATED_AT;
        const sortOrder = query.sortOrder ?? query_products_dto_1.SortOrder.DESC;
        const queryBuilder = this.productsRepository.createQueryBuilder('product');
        if (query.search) {
            queryBuilder.andWhere('(product.product_name LIKE :search OR product.product_slug LIKE :search)', { search: `%${query.search}%` });
        }
        const requestedCategoryIds = this.parseCategoryIds(query);
        if (requestedCategoryIds.length > 0) {
            const nestedCategoryIds = await this.collectManyCategoryIds(requestedCategoryIds);
            queryBuilder.andWhere('product.category_id IN (:...categoryIds)', {
                categoryIds: nestedCategoryIds,
            });
        }
        if (query.subcategoryId) {
            queryBuilder.andWhere('product.subcategory_id = :subcategoryId', {
                subcategoryId: query.subcategoryId,
            });
        }
        if (query.originId) {
            queryBuilder.andWhere('product.brand_id = :originId', {
                originId: query.originId,
            });
        }
        if (query.tagId) {
            queryBuilder
                .innerJoin('product_tags', 'pt', 'pt.product_id = product.product_id AND pt.tag_id = :tagId', { tagId: query.tagId });
        }
        if (query.priceMin) {
            queryBuilder.andWhere('product.product_price >= :priceMin', {
                priceMin: query.priceMin,
            });
        }
        if (query.priceMax) {
            queryBuilder.andWhere('product.product_price <= :priceMax', {
                priceMax: query.priceMax,
            });
        }
        if (query.expiredSoon) {
            const soon = new Date();
            soon.setDate(soon.getDate() + 7);
            queryBuilder.andWhere('product.expired_at IS NOT NULL AND product.expired_at <= :soon', { soon });
        }
        if (query.lowStock) {
            const threshold = query.lowStockThreshold ?? 10;
            queryBuilder.andWhere('product.quantity_available <= :threshold', {
                threshold,
            });
        }
        if (!query.includeHidden) {
            queryBuilder.andWhere('product.is_show = :isShow', { isShow: true });
        }
        if (query.isFeatured !== undefined) {
            queryBuilder.andWhere('product.is_featured = :isFeatured', {
                isFeatured: query.isFeatured,
            });
        }
        if (query.hasSalePrice) {
            queryBuilder.andWhere('product.product_price_sale IS NOT NULL');
        }
        queryBuilder
            .orderBy(`product.${sortBy}`, sortOrder)
            .skip((page - 1) * limit)
            .take(limit);
        const [items, total] = await queryBuilder.getManyAndCount();
        const mappedItems = await Promise.all(items.map((item) => this.enrichProductCard(item)));
        return {
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
            items: mappedItems,
        };
    }
    async findOne(productId) {
        const product = await this.productsRepository.findOneBy({ productId });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return this.enrichProductWithFullDetails(product);
    }
    async getRecommendationCards(options) {
        const limit = Math.max(1, Math.min(options.limit ?? 4, 12));
        const explicitIds = [...new Set((options.productIds ?? []).filter(Boolean))];
        const normalizedHints = [...new Set((options.keywordHints ?? []).map((item) => item.trim()).filter(Boolean))].slice(0, 8);
        const products = [];
        if (explicitIds.length > 0) {
            const explicitProducts = await this.productsRepository.find({
                where: { productId: (0, typeorm_2.In)(explicitIds), isShow: true },
            });
            explicitProducts.sort((left, right) => explicitIds.indexOf(left.productId) - explicitIds.indexOf(right.productId));
            products.push(...explicitProducts);
        }
        if (products.length < limit && normalizedHints.length > 0) {
            const queryBuilder = this.productsRepository.createQueryBuilder('product');
            queryBuilder.andWhere('product.is_show = :isShow', { isShow: true });
            queryBuilder.andWhere('product.quantity_available > 0');
            if (explicitIds.length > 0) {
                queryBuilder.andWhere('product.product_id NOT IN (:...explicitIds)', {
                    explicitIds,
                });
            }
            const hintClauses = normalizedHints.map((_, index) => `(product.product_name LIKE :hint${index} OR product.description LIKE :hint${index})`);
            queryBuilder.andWhere(`(${hintClauses.join(' OR ')})`);
            normalizedHints.forEach((hint, index) => {
                queryBuilder.setParameter(`hint${index}`, `%${hint}%`);
            });
            queryBuilder
                .orderBy('product.is_featured', 'DESC')
                .addOrderBy('product.quantity_available', 'DESC')
                .addOrderBy('product.rating_average', 'DESC')
                .addOrderBy('product.created_at', 'DESC')
                .take(limit - products.length);
            const fallbackProducts = await queryBuilder.getMany();
            products.push(...fallbackProducts);
        }
        const uniqueProducts = products
            .filter((product, index, current) => current.findIndex((item) => item.productId === product.productId) === index)
            .slice(0, limit);
        return Promise.all(uniqueProducts.map((product) => this.mapRecommendationCard(product)));
    }
    async getAdminProductOptions(search, limit = 24) {
        const safeLimit = Math.max(1, Math.min(limit, 50));
        const queryBuilder = this.productsRepository.createQueryBuilder('product');
        if (search?.trim()) {
            queryBuilder.andWhere('(product.product_name LIKE :search OR product.product_slug LIKE :search OR product.description LIKE :search)', {
                search: `%${search.trim()}%`,
            });
        }
        queryBuilder
            .orderBy('product.is_show', 'DESC')
            .addOrderBy('product.quantity_available', 'DESC')
            .addOrderBy('product.created_at', 'DESC')
            .take(safeLimit);
        const products = await queryBuilder.getMany();
        return Promise.all(products.map((product) => this.mapRecommendationCard(product)));
    }
    async create(createProductDto) {
        await this.ensureCategoryExists(createProductDto.categoryId);
        if (createProductDto.originId) {
            await this.ensureOriginExists(createProductDto.originId);
        }
        await this.ensureUniqueFields(createProductDto);
        if (createProductDto.productPriceSale != null &&
            Number(createProductDto.productPriceSale) > Number(createProductDto.productPrice)) {
            throw new common_1.BadRequestException('Sale price cannot exceed regular price');
        }
        const product = this.productsRepository.create({
            productId: createProductDto.productId ?? (0, node_crypto_1.randomUUID)(),
            productName: createProductDto.productName,
            productSlug: this.normalizeSlug(createProductDto.productSlug ?? createProductDto.productName),
            categoryId: createProductDto.categoryId,
            subcategoryId: createProductDto.subcategoryId ?? null,
            originId: createProductDto.originId ?? null,
            productPrice: createProductDto.productPrice,
            productPriceSale: createProductDto.productPriceSale ?? null,
            quantityAvailable: createProductDto.quantityAvailable ?? 0,
            description: createProductDto.description ?? null,
            ratingAverage: '0',
            ratingCount: 0,
            isShow: createProductDto.isShow ?? true,
            isFeatured: createProductDto.isFeatured ?? false,
            expiredAt: createProductDto.expiredAt
                ? new Date(createProductDto.expiredAt)
                : null,
            unit: createProductDto.unit ?? null,
            quantityPerBox: createProductDto.quantityPerBox ?? null,
            barcode: createProductDto.barcode ?? null,
            boxBarcode: createProductDto.boxBarcode ?? null,
        });
        const saved = await this.productsRepository.save(product);
        void this.notificationsService.createNotification({
            channel: notification_entity_1.NotificationChannel.SYSTEM,
            title: 'Sáº£n pháº©m má»›i Ä‘Æ°á»£c thÃªm',
            message: `Sáº£n pháº©m "${saved.productName}" Ä‘Ã£ Ä‘Æ°á»£c thÃªm vÃ o há»‡ thá»‘ng.`,
            metadata: { productId: saved.productId, type: 'product_created' },
        });
        return saved;
    }
    async update(productId, updateProductDto) {
        const product = await this.productsRepository.findOneBy({ productId });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (updateProductDto.categoryId) {
            await this.ensureCategoryExists(updateProductDto.categoryId);
        }
        if (updateProductDto.originId) {
            await this.ensureOriginExists(updateProductDto.originId);
        }
        await this.ensureUniqueFields(updateProductDto, product.productId);
        const effectivePrice = updateProductDto.productPrice ?? product.productPrice;
        const effectiveSalePrice = updateProductDto.productPriceSale !== undefined
            ? updateProductDto.productPriceSale
            : product.productPriceSale;
        if (effectiveSalePrice != null &&
            Number(effectiveSalePrice) > Number(effectivePrice)) {
            throw new common_1.BadRequestException('Sale price cannot exceed regular price');
        }
        product.productName = updateProductDto.productName ?? product.productName;
        product.productSlug = updateProductDto.productSlug
            ? this.normalizeSlug(updateProductDto.productSlug)
            : updateProductDto.productName
                ? this.normalizeSlug(updateProductDto.productName)
                : product.productSlug;
        product.categoryId = updateProductDto.categoryId ?? product.categoryId;
        product.subcategoryId =
            updateProductDto.subcategoryId !== undefined
                ? (updateProductDto.subcategoryId ?? null)
                : product.subcategoryId;
        product.originId =
            updateProductDto.originId !== undefined
                ? (updateProductDto.originId ?? null)
                : product.originId;
        product.productPrice =
            updateProductDto.productPrice ?? product.productPrice;
        product.productPriceSale =
            updateProductDto.productPriceSale !== undefined
                ? (updateProductDto.productPriceSale ?? null)
                : product.productPriceSale;
        product.quantityAvailable =
            updateProductDto.quantityAvailable ?? product.quantityAvailable;
        product.description =
            updateProductDto.description !== undefined
                ? (updateProductDto.description ?? null)
                : product.description;
        product.isShow = updateProductDto.isShow ?? product.isShow;
        if (updateProductDto.isFeatured !== undefined) {
            product.isFeatured = updateProductDto.isFeatured;
        }
        product.expiredAt = updateProductDto.expiredAt
            ? new Date(updateProductDto.expiredAt)
            : product.expiredAt;
        product.unit =
            updateProductDto.unit !== undefined
                ? (updateProductDto.unit ?? null)
                : product.unit;
        product.quantityPerBox =
            updateProductDto.quantityPerBox ?? product.quantityPerBox;
        product.barcode =
            updateProductDto.barcode !== undefined
                ? (updateProductDto.barcode ?? null)
                : product.barcode;
        product.boxBarcode =
            updateProductDto.boxBarcode !== undefined
                ? (updateProductDto.boxBarcode ?? null)
                : product.boxBarcode;
        const updated = await this.productsRepository.save(product);
        void this.notificationsService.createNotification({
            channel: notification_entity_1.NotificationChannel.SYSTEM,
            title: 'Sáº£n pháº©m Ä‘Æ°á»£c cáº­p nháº­t',
            message: `Sáº£n pháº©m "${updated.productName}" Ä‘Ã£ Ä‘Æ°á»£c cáº­p nháº­t.`,
            metadata: { productId: updated.productId, type: 'product_updated' },
        });
        return updated;
    }
    async remove(productId) {
        const product = await this.productsRepository.findOneBy({ productId });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const name = product.productName;
        await this.productsRepository.remove(product);
        void this.notificationsService.createNotification({
            channel: notification_entity_1.NotificationChannel.SYSTEM,
            title: 'Sáº£n pháº©m bá»‹ xÃ³a',
            message: `Sáº£n pháº©m "${name}" Ä‘Ã£ bá»‹ xÃ³a khá»i há»‡ thá»‘ng.`,
            metadata: { type: 'product_deleted' },
        });
        return { success: true };
    }
    async toggleVisibility(productId) {
        const product = await this.productsRepository.findOneBy({ productId });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        product.isShow = !product.isShow;
        const saved = await this.productsRepository.save(product);
        return { productId: saved.productId, isShow: saved.isShow };
    }
    async toggleFeatured(productId) {
        const product = await this.productsRepository.findOneBy({ productId });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        product.isFeatured = !product.isFeatured;
        const saved = await this.productsRepository.save(product);
        return { productId: saved.productId, isFeatured: saved.isFeatured };
    }
    async findColors() {
        return this.colorsRepository.find({ order: { colorName: 'ASC' } });
    }
    async createColor(dto) {
        const colorName = dto.colorName.trim();
        const colorCode = dto.colorCode?.trim() || null;
        if (!colorName) {
            throw new common_1.BadRequestException('Color name is required');
        }
        const existing = await this.colorsRepository.findOneBy({ colorName });
        if (existing)
            return existing;
        return this.colorsRepository.save(this.colorsRepository.create({ colorName, colorCode }));
    }
    async findSizes() {
        return this.sizesRepository.find({
            order: { sortOrder: 'ASC', sizeName: 'ASC' },
        });
    }
    async createSize(dto) {
        const sizeName = dto.sizeName.trim();
        const sizeCode = dto.sizeCode?.trim() || null;
        if (!sizeName) {
            throw new common_1.BadRequestException('Size name is required');
        }
        const existing = await this.sizesRepository.findOneBy({ sizeName });
        if (existing)
            return existing;
        return this.sizesRepository.save(this.sizesRepository.create({
            sizeName,
            sizeCode,
            sortOrder: dto.sortOrder ?? 0,
        }));
    }
    async findProductVariants(productId) {
        await this.ensureProductExists(productId);
        return this.getProductVariants(productId);
    }
    async createVariant(productId, dto) {
        const product = await this.ensureProductExists(productId);
        await this.ensureVariantOptionsExist(dto);
        this.ensureVariantPricesAreValid(dto, product.productPrice);
        await this.ensureUniqueVariantOptionPair(productId, dto.colorId, dto.sizeId);
        const variant = this.productVariantsRepository.create({
            variantId: (0, node_crypto_1.randomUUID)(),
            productId,
            colorId: dto.colorId || null,
            sizeId: dto.sizeId || null,
            sku: dto.sku?.trim() || null,
            barcode: dto.barcode?.trim() || null,
            price: dto.price || null,
            salePrice: dto.salePrice || null,
            stockQuantity: dto.stockQuantity ?? 0,
            weightGrams: dto.weightGrams ?? null,
            isActive: dto.isActive ?? true,
        });
        await this.productVariantsRepository.save(variant);
        return this.getVariantDetail(productId, variant.variantId);
    }
    async updateVariant(productId, variantId, dto) {
        const product = await this.ensureProductExists(productId);
        const variant = await this.ensureVariantExists(productId, variantId);
        await this.ensureVariantOptionsExist(dto);
        const nextColorId = dto.colorId !== undefined ? dto.colorId || null : variant.colorId;
        const nextSizeId = dto.sizeId !== undefined ? dto.sizeId || null : variant.sizeId;
        await this.ensureUniqueVariantOptionPair(productId, nextColorId, nextSizeId, variantId);
        this.ensureVariantPricesAreValid({
            price: dto.price ?? variant.price ?? undefined,
            salePrice: dto.salePrice ?? variant.salePrice ?? undefined,
        }, product.productPrice);
        variant.colorId = nextColorId;
        variant.sizeId = nextSizeId;
        if (dto.sku !== undefined)
            variant.sku = dto.sku.trim() || null;
        if (dto.barcode !== undefined)
            variant.barcode = dto.barcode.trim() || null;
        if (dto.price !== undefined)
            variant.price = dto.price || null;
        if (dto.salePrice !== undefined)
            variant.salePrice = dto.salePrice || null;
        if (dto.stockQuantity !== undefined)
            variant.stockQuantity = dto.stockQuantity;
        if (dto.weightGrams !== undefined)
            variant.weightGrams = dto.weightGrams ?? null;
        if (dto.isActive !== undefined)
            variant.isActive = dto.isActive;
        await this.productVariantsRepository.save(variant);
        return this.getVariantDetail(productId, variantId);
    }
    async deactivateVariant(productId, variantId) {
        const variant = await this.ensureVariantExists(productId, variantId);
        variant.isActive = false;
        await this.productVariantsRepository.save(variant);
        return { success: true };
    }
    async uploadVariantImage(productId, variantId, file) {
        await this.ensureVariantExists(productId, variantId);
        if (!file) {
            throw new common_1.BadRequestException('Image file is required');
        }
        if (!file.mimetype.startsWith('image/')) {
            throw new common_1.BadRequestException('Only image files are allowed');
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new common_1.BadRequestException('Image size must be 5MB or less');
        }
        const imageUrl = await this.uploadImageToCloudinary(file, `${productId}-${variantId}`);
        const sortOrder = await this.variantImagesRepository.countBy({ variantId });
        const image = await this.variantImagesRepository.save(this.variantImagesRepository.create({ variantId, imageUrl, sortOrder }));
        return {
            imageId: image.variantImageId,
            variantId,
            imageUrl: image.imageUrl,
            sortOrder: image.sortOrder,
        };
    }
    async deleteVariantImage(productId, variantId, imageId) {
        await this.ensureVariantExists(productId, variantId);
        const image = await this.variantImagesRepository.findOneBy({
            variantImageId: imageId,
            variantId,
        });
        if (!image) {
            throw new common_1.NotFoundException('Variant image not found');
        }
        await this.variantImagesRepository.remove(image);
        return { success: true };
    }
    async getProductImages(productId) {
        await this.ensureProductExists(productId);
        return this.productImagesRepository.find({
            where: { productId },
            order: { isPrimary: 'DESC', sortOrder: 'ASC', createdAt: 'ASC' },
        });
    }
    async uploadProductImage(productId, file, isPrimary = false) {
        await this.ensureProductExists(productId);
        if (!file) {
            throw new common_1.BadRequestException('Image file is required');
        }
        if (!file.mimetype.startsWith('image/')) {
            throw new common_1.BadRequestException('Only image files are allowed');
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new common_1.BadRequestException('Image size must be 5MB or less');
        }
        const uploadedImageUrl = await this.uploadImageToCloudinary(file, productId);
        if (isPrimary) {
            await this.productImagesRepository.update({ productId, isPrimary: true }, { isPrimary: false });
        }
        const sortOrder = await this.productImagesRepository.countBy({ productId });
        const image = this.productImagesRepository.create({
            productId,
            imageUrl: uploadedImageUrl,
            isPrimary,
            sortOrder,
        });
        const saved = await this.productImagesRepository.save(image);
        return {
            productImageId: saved.productImageId,
            productId,
            imageUrl: saved.imageUrl,
            isPrimary: saved.isPrimary,
            sortOrder: saved.sortOrder,
        };
    }
    async setPrimaryImage(productId, imageId) {
        await this.ensureProductExists(productId);
        const image = await this.productImagesRepository.findOneBy({
            productImageId: imageId,
            productId,
        });
        if (!image) {
            throw new common_1.NotFoundException('Image not found for this product');
        }
        await this.productImagesRepository.update({ productId, isPrimary: true }, { isPrimary: false });
        image.isPrimary = true;
        await this.productImagesRepository.save(image);
        return { success: true, primaryImageId: imageId };
    }
    async deleteProductImage(productId, imageId) {
        await this.ensureProductExists(productId);
        const image = await this.productImagesRepository.findOneBy({
            productImageId: imageId,
            productId,
        });
        if (!image) {
            throw new common_1.NotFoundException('Image not found for this product');
        }
        await this.productImagesRepository.remove(image);
        return { success: true };
    }
    async reorderProductImages(productId, dto) {
        await this.ensureProductExists(productId);
        const images = await this.productImagesRepository.findBy({ productId });
        const imageMap = new Map(images.map((img) => [img.productImageId, img]));
        for (const id of dto.imageIds) {
            if (!imageMap.has(id)) {
                throw new common_1.NotFoundException(`Image ${id} not found for this product`);
            }
        }
        const updates = dto.imageIds.map((id, index) => {
            const img = imageMap.get(id);
            img.sortOrder = index;
            return img;
        });
        await this.productImagesRepository.save(updates);
        return this.getProductImages(productId);
    }
    async getDescriptionImages(productId) {
        await this.ensureProductExists(productId);
        return this.productDescriptionImagesRepository.find({
            where: { productId },
            order: { sortOrder: 'ASC', createdAt: 'ASC' },
        });
    }
    async uploadDescriptionImage(productId, file) {
        await this.ensureProductExists(productId);
        if (!file) {
            throw new common_1.BadRequestException('Image file is required');
        }
        if (!file.mimetype.startsWith('image/')) {
            throw new common_1.BadRequestException('Only image files are allowed');
        }
        if (file.size > 5 * 1024 * 1024) {
            throw new common_1.BadRequestException('Image size must be 5MB or less');
        }
        const imageUrl = await this.uploadImageToCloudinary(file, `${productId}-desc`);
        const sortOrder = await this.productDescriptionImagesRepository.countBy({
            productId,
        });
        const image = this.productDescriptionImagesRepository.create({
            productId,
            imageUrl,
            sortOrder,
        });
        return this.productDescriptionImagesRepository.save(image);
    }
    async deleteDescriptionImage(productId, imageId) {
        await this.ensureProductExists(productId);
        const image = await this.productDescriptionImagesRepository.findOneBy({
            productDescriptionImageId: imageId,
            productId,
        });
        if (!image) {
            throw new common_1.NotFoundException('Description image not found for this product');
        }
        await this.productDescriptionImagesRepository.remove(image);
        return { success: true };
    }
    async importInventory(performedBy, importInventoryDto) {
        await this.ensureUserExists(performedBy);
        const product = await this.productsRepository.findOneBy({
            productId: importInventoryDto.productId,
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        let transactionId;
        await this.dataSource.transaction(async (em) => {
            product.quantityAvailable += importInventoryDto.quantity;
            await em.save(product_entity_1.ProductEntity, product);
            const tx = em.create(inventory_transaction_entity_1.InventoryTransactionEntity, {
                productId: product.productId,
                performedBy,
                transactionType: inventory_transaction_entity_1.InventoryTransactionType.IMPORT,
                quantityChange: importInventoryDto.quantity,
                note: importInventoryDto.note ?? 'Import inventory by admin',
                relatedOrderId: null,
            });
            const saved = await em.save(inventory_transaction_entity_1.InventoryTransactionEntity, tx);
            transactionId = saved.transactionId;
            await this.syncDefaultWarehouseStock(em, product.productId, importInventoryDto.quantity);
        });
        return {
            productId: product.productId,
            quantityAvailable: product.quantityAvailable,
            transactionId: transactionId,
        };
    }
    async adjustInventory(performedBy, adjustInventoryDto) {
        await this.ensureUserExists(performedBy);
        const product = await this.productsRepository.findOneBy({
            productId: adjustInventoryDto.productId,
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const previousQuantity = product.quantityAvailable;
        let quantityChange = 0;
        if (adjustInventoryDto.mode === adjust_inventory_dto_1.InventoryAdjustmentMode.SET) {
            quantityChange = adjustInventoryDto.quantity - previousQuantity;
            product.quantityAvailable = adjustInventoryDto.quantity;
        }
        else if (adjustInventoryDto.mode === adjust_inventory_dto_1.InventoryAdjustmentMode.INCREASE) {
            quantityChange = adjustInventoryDto.quantity;
            product.quantityAvailable += adjustInventoryDto.quantity;
        }
        else if (adjustInventoryDto.mode === adjust_inventory_dto_1.InventoryAdjustmentMode.DECREASE) {
            if (adjustInventoryDto.quantity > product.quantityAvailable) {
                throw new common_1.BadRequestException('Quantity exceeds available stock');
            }
            quantityChange = -adjustInventoryDto.quantity;
            product.quantityAvailable -= adjustInventoryDto.quantity;
        }
        let transactionId;
        await this.dataSource.transaction(async (em) => {
            await em.save(product_entity_1.ProductEntity, product);
            const tx = em.create(inventory_transaction_entity_1.InventoryTransactionEntity, {
                productId: product.productId,
                performedBy,
                transactionType: inventory_transaction_entity_1.InventoryTransactionType.ADJUSTMENT,
                quantityChange,
                note: adjustInventoryDto.note ??
                    `Adjustment mode: ${adjustInventoryDto.mode}`,
                relatedOrderId: null,
            });
            const saved = await em.save(inventory_transaction_entity_1.InventoryTransactionEntity, tx);
            transactionId = saved.transactionId;
            await this.syncDefaultWarehouseStock(em, product.productId, quantityChange);
        });
        return {
            productId: product.productId,
            previousQuantity,
            currentQuantity: product.quantityAvailable,
            quantityChange,
            transactionId: transactionId,
        };
    }
    async recordDamage(performedBy, dto) {
        await this.ensureUserExists(performedBy);
        const product = await this.productsRepository.findOneBy({
            productId: dto.productId,
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (dto.quantity > product.quantityAvailable) {
            throw new common_1.BadRequestException('Damage quantity exceeds available stock');
        }
        product.quantityAvailable -= dto.quantity;
        let transactionId;
        await this.dataSource.transaction(async (em) => {
            await em.save(product_entity_1.ProductEntity, product);
            const tx = em.create(inventory_transaction_entity_1.InventoryTransactionEntity, {
                productId: product.productId,
                performedBy,
                transactionType: inventory_transaction_entity_1.InventoryTransactionType.DAMAGE,
                quantityChange: -dto.quantity,
                note: dto.note ?? 'Damaged apparel item recorded',
                relatedOrderId: null,
            });
            const saved = await em.save(inventory_transaction_entity_1.InventoryTransactionEntity, tx);
            transactionId = saved.transactionId;
            await this.syncDefaultWarehouseStock(em, product.productId, -dto.quantity);
        });
        return {
            productId: product.productId,
            quantityAvailable: product.quantityAvailable,
            transactionId: transactionId,
        };
    }
    async recordReturn(performedBy, dto) {
        await this.ensureUserExists(performedBy);
        const product = await this.productsRepository.findOneBy({
            productId: dto.productId,
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        product.quantityAvailable += dto.quantity;
        let transactionId;
        await this.dataSource.transaction(async (em) => {
            await em.save(product_entity_1.ProductEntity, product);
            const tx = em.create(inventory_transaction_entity_1.InventoryTransactionEntity, {
                productId: product.productId,
                performedBy,
                transactionType: inventory_transaction_entity_1.InventoryTransactionType.RETURN_IN,
                quantityChange: dto.quantity,
                note: dto.note ?? 'Return goods recorded',
                relatedOrderId: dto.relatedOrderId ?? null,
            });
            const saved = await em.save(inventory_transaction_entity_1.InventoryTransactionEntity, tx);
            transactionId = saved.transactionId;
            await this.syncDefaultWarehouseStock(em, product.productId, dto.quantity);
        });
        return {
            productId: product.productId,
            quantityAvailable: product.quantityAvailable,
            transactionId: transactionId,
        };
    }
    async findInventoryTransactions(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const queryBuilder = this.inventoryTransactionsRepository
            .createQueryBuilder('transaction')
            .leftJoin(product_entity_1.ProductEntity, 'product', 'product.product_id = transaction.product_id')
            .leftJoin(user_entity_1.UserEntity, 'user', 'user.user_id = transaction.performed_by')
            .select([
            'transaction.transactionId AS id',
            'transaction.productId AS productId',
            'transaction.transactionType AS transactionType',
            'transaction.quantityChange AS quantityChange',
            'transaction.note AS note',
            'transaction.relatedOrderId AS relatedOrderId',
            'transaction.createdAt AS createdAt',
            'product.product_name AS productName',
        ])
            .addSelect('COALESCE(user.username, user.email, transaction.performed_by)', 'performedBy');
        if (query.productId) {
            queryBuilder.andWhere('transaction.product_id = :productId', {
                productId: query.productId,
            });
        }
        if (query.transactionType) {
            queryBuilder.andWhere('transaction.transaction_type = :transactionType', {
                transactionType: query.transactionType,
            });
        }
        if (query.relatedOrderId) {
            queryBuilder.andWhere('transaction.related_order_id = :relatedOrderId', {
                relatedOrderId: query.relatedOrderId,
            });
        }
        if (query.performedBy) {
            queryBuilder.andWhere('transaction.performed_by = :performedBy', {
                performedBy: query.performedBy,
            });
        }
        if (query.dateFrom) {
            queryBuilder.andWhere('transaction.created_at >= :dateFrom', {
                dateFrom: new Date(query.dateFrom),
            });
        }
        if (query.dateTo) {
            const dateTo = new Date(query.dateTo);
            dateTo.setHours(23, 59, 59, 999);
            queryBuilder.andWhere('transaction.created_at <= :dateTo', { dateTo });
        }
        queryBuilder
            .orderBy('transaction.created_at', 'DESC')
            .offset((page - 1) * limit)
            .limit(limit);
        const [items, total] = await Promise.all([
            queryBuilder.getRawMany(),
            queryBuilder.getCount(),
        ]);
        return {
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
            items,
        };
    }
    async getInventorySummary() {
        const results = await this.productsRepository
            .createQueryBuilder('product')
            .select([
            'product.product_id AS productId',
            'product.product_name AS productName',
            'product.quantity_available AS quantityAvailable',
            'product.barcode AS barcode',
            'product.unit AS unit',
        ])
            .addSelect(`COALESCE(SUM(CASE WHEN t.transaction_type = 'import' THEN t.quantity_change ELSE 0 END), 0)`, 'totalImported')
            .addSelect(`COALESCE(SUM(CASE WHEN t.transaction_type = 'damage' THEN ABS(t.quantity_change) ELSE 0 END), 0)`, 'totalDamaged')
            .addSelect(`COALESCE(SUM(CASE WHEN t.transaction_type = 'export' THEN ABS(t.quantity_change) ELSE 0 END), 0)`, 'totalExported')
            .leftJoin('inventory_transactions', 't', 't.product_id = product.product_id')
            .where('product.is_show = :isShow', { isShow: true })
            .groupBy('product.product_id')
            .orderBy('product.product_name', 'ASC')
            .getRawMany();
        return results;
    }
    async getLowStockProducts(threshold = 10) {
        const products = await this.productsRepository
            .createQueryBuilder('product')
            .where('product.quantity_available <= :threshold', { threshold })
            .andWhere('product.is_show = :isShow', { isShow: true })
            .orderBy('product.quantity_available', 'ASC')
            .getMany();
        return products.map((p) => ({
            productId: p.productId,
            productName: p.productName,
            quantityAvailable: p.quantityAvailable,
            unit: p.unit,
            barcode: p.barcode,
        }));
    }
    async findWishlist(userId) {
        await this.ensureUserExists(userId);
        const items = await this.wishlistRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        const productIds = items.map((item) => item.productId);
        const products = productIds.length
            ? await this.productsRepository.findBy(productIds.map((productId) => ({ productId })))
            : [];
        const categoryIds = [...new Set(products.map((p) => p.categoryId).filter(Boolean))];
        const categories = categoryIds.length
            ? await this.categoriesRepository.findBy(categoryIds.map((id) => ({ categoryId: id })))
            : [];
        const categoriesById = new Map(categories.map((c) => [c.categoryId, c]));
        const enrichedEntries = await Promise.all(products.map(async (p) => [p.productId, await this.enrichProductWithDiscount(p)]));
        const enrichedById = new Map(enrichedEntries);
        return items.map((item) => {
            const enriched = enrichedById.get(item.productId) ?? null;
            const cat = enriched ? (categoriesById.get(enriched.categoryId) ?? null) : null;
            return {
                productId: item.productId,
                createdAt: item.createdAt,
                product: enriched
                    ? {
                        ...enriched,
                        category: cat ? { categoryId: cat.categoryId, categoryName: cat.categoryName } : null,
                    }
                    : null,
            };
        });
    }
    async addWishlistItem(userId, productId) {
        await this.ensureUserExists(userId);
        await this.ensureProductExists(productId);
        const existingItem = await this.wishlistRepository.findOneBy({
            userId,
            productId,
        });
        if (existingItem) {
            return { userId, productId, createdAt: existingItem.createdAt };
        }
        const item = this.wishlistRepository.create({ userId, productId });
        return this.wishlistRepository.save(item);
    }
    async removeWishlistItem(userId, productId) {
        await this.ensureUserExists(userId);
        const existingItem = await this.wishlistRepository.findOneBy({
            userId,
            productId,
        });
        if (!existingItem) {
            throw new common_1.NotFoundException('Wishlist item not found');
        }
        await this.wishlistRepository.delete({ userId, productId });
        return { success: true };
    }
    async ensureVariantOptionsExist(dto) {
        if (dto.colorId) {
            const color = await this.colorsRepository.findOneBy({ colorId: dto.colorId });
            if (!color)
                throw new common_1.NotFoundException('Color not found');
        }
        if (dto.sizeId) {
            const size = await this.sizesRepository.findOneBy({ sizeId: dto.sizeId });
            if (!size)
                throw new common_1.NotFoundException('Size not found');
        }
    }
    ensureVariantPricesAreValid(dto, fallbackPrice) {
        const basePrice = Number(dto.price ?? fallbackPrice);
        const salePrice = dto.salePrice !== undefined && dto.salePrice !== null && dto.salePrice !== ''
            ? Number(dto.salePrice)
            : null;
        if (!Number.isFinite(basePrice) || basePrice < 0) {
            throw new common_1.BadRequestException('Variant price is invalid');
        }
        if (salePrice !== null && (!Number.isFinite(salePrice) || salePrice < 0)) {
            throw new common_1.BadRequestException('Variant sale price is invalid');
        }
        if (salePrice !== null && salePrice > basePrice) {
            throw new common_1.BadRequestException('Variant sale price cannot exceed price');
        }
    }
    async ensureUniqueVariantOptionPair(productId, colorId, sizeId, excludeVariantId) {
        const qb = this.productVariantsRepository
            .createQueryBuilder('variant')
            .where('variant.product_id = :productId', { productId });
        if (excludeVariantId) {
            qb.andWhere('variant.variant_id <> :excludeVariantId', { excludeVariantId });
        }
        if (colorId) {
            qb.andWhere('variant.color_id = :colorId', { colorId });
        }
        else {
            qb.andWhere('variant.color_id IS NULL');
        }
        if (sizeId) {
            qb.andWhere('variant.size_id = :sizeId', { sizeId });
        }
        else {
            qb.andWhere('variant.size_id IS NULL');
        }
        const existing = await qb.getOne();
        if (existing) {
            throw new common_1.ConflictException('Variant with this color and size already exists');
        }
    }
    async ensureVariantExists(productId, variantId) {
        await this.ensureProductExists(productId);
        const variant = await this.productVariantsRepository.findOneBy({
            productId,
            variantId,
        });
        if (!variant) {
            throw new common_1.NotFoundException('Variant not found for this product');
        }
        return variant;
    }
    async getVariantDetail(productId, variantId) {
        const variants = await this.getProductVariants(productId);
        const variant = variants.find((item) => item.variantId === variantId);
        if (!variant) {
            throw new common_1.NotFoundException('Variant not found for this product');
        }
        return variant;
    }
    async ensureProductExists(productId) {
        const product = await this.productsRepository.findOneBy({ productId });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async ensureCategoryExists(categoryId) {
        const category = await this.categoriesRepository.findOneBy({ categoryId });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
    }
    async ensureOriginExists(originId) {
        const origin = await this.originsRepository.findOneBy({ originId });
        if (!origin) {
            throw new common_1.NotFoundException('Brand not found');
        }
    }
    async collectCategoryIds(rootCategoryId) {
        await this.ensureCategoryExists(rootCategoryId);
        const collectedIds = new Set([rootCategoryId]);
        const queue = [rootCategoryId];
        while (queue.length > 0) {
            const currentCategoryId = queue.shift();
            if (!currentCategoryId)
                continue;
            const childCategories = await this.categoriesRepository.find({
                where: { parentId: currentCategoryId },
                select: { categoryId: true },
            });
            for (const child of childCategories) {
                if (!collectedIds.has(child.categoryId)) {
                    collectedIds.add(child.categoryId);
                    queue.push(child.categoryId);
                }
            }
        }
        return [...collectedIds];
    }
    parseCategoryIds(query) {
        const rawIds = [
            ...(query.categoryIds?.split(',') ?? []),
            query.categoryId ?? '',
        ];
        return [
            ...new Set(rawIds.map((id) => id.trim()).filter((id) => id.length > 0)),
        ];
    }
    async collectManyCategoryIds(rootCategoryIds) {
        const collected = new Set();
        for (const categoryId of rootCategoryIds) {
            const nestedIds = await this.collectCategoryIds(categoryId);
            nestedIds.forEach((id) => collected.add(id));
        }
        return [...collected];
    }
    async ensureUserExists(userId) {
        const user = await this.usersRepository.findOneBy({ userId });
        if (!user) {
            throw new common_1.UnauthorizedException('Nguoi dung khong ton tai');
        }
    }
    async enrichProductWithFullDetails(product) {
        const [images, descriptionImages, tags, enriched, variants] = await Promise.all([
            this.productImagesRepository.find({
                where: { productId: product.productId },
                order: { isPrimary: 'DESC', sortOrder: 'ASC', createdAt: 'ASC' },
            }),
            this.productDescriptionImagesRepository.find({
                where: { productId: product.productId },
                order: { sortOrder: 'ASC', createdAt: 'ASC' },
            }),
            this.getProductTagsInternal(product.productId),
            this.enrichProductWithDiscount(product),
            this.getProductVariants(product.productId),
        ]);
        const [origin, subcategory, category] = await Promise.all([
            product.originId
                ? this.originsRepository.findOneBy({ originId: product.originId })
                : Promise.resolve(null),
            product.subcategoryId
                ? this.subcategoriesRepository.findOneBy({
                    subcategoryId: product.subcategoryId,
                })
                : Promise.resolve(null),
            this.categoriesRepository.findOneBy({ categoryId: product.categoryId }),
        ]);
        const activeVariantStock = variants
            .filter((variant) => variant.isActive)
            .reduce((sum, variant) => sum + variant.stockQuantity, 0);
        return {
            ...enriched,
            quantityAvailable: variants.length > 0 ? activeVariantStock : enriched.quantityAvailable,
            images,
            descriptionImages,
            tags,
            origin,
            subcategory,
            category,
            variants,
            colorOptions: this.getUniqueVariantOptions(variants, 'color'),
            sizeOptions: this.getUniqueVariantOptions(variants, 'size'),
        };
    }
    async getProductVariants(productId) {
        const variants = await this.productVariantsRepository.find({
            where: { productId },
            order: { colorId: 'ASC', sizeId: 'ASC', createdAt: 'ASC' },
        });
        if (variants.length === 0) {
            return [];
        }
        const colorIds = [...new Set(variants.map((variant) => variant.colorId).filter((id) => !!id))];
        const sizeIds = [...new Set(variants.map((variant) => variant.sizeId).filter((id) => !!id))];
        const variantIds = variants.map((variant) => variant.variantId);
        const [colors, sizes, images] = await Promise.all([
            colorIds.length ? this.colorsRepository.find({ where: { colorId: (0, typeorm_2.In)(colorIds) } }) : Promise.resolve([]),
            sizeIds.length ? this.sizesRepository.find({ where: { sizeId: (0, typeorm_2.In)(sizeIds) } }) : Promise.resolve([]),
            this.variantImagesRepository.find({
                where: { variantId: (0, typeorm_2.In)(variantIds) },
                order: { sortOrder: 'ASC', createdAt: 'ASC' },
            }),
        ]);
        const colorMap = new Map(colors.map((color) => [color.colorId, color]));
        const sizeMap = new Map(sizes.map((size) => [size.sizeId, size]));
        const imagesByVariantId = new Map();
        for (const image of images) {
            const current = imagesByVariantId.get(image.variantId) ?? [];
            current.push({
                imageId: image.variantImageId,
                imageUrl: image.imageUrl,
                sortOrder: image.sortOrder,
            });
            imagesByVariantId.set(image.variantId, current);
        }
        return variants.map((variant) => {
            const color = variant.colorId ? colorMap.get(variant.colorId) : null;
            const size = variant.sizeId ? sizeMap.get(variant.sizeId) : null;
            return {
                variantId: variant.variantId,
                productId: variant.productId,
                sku: variant.sku,
                barcode: variant.barcode,
                price: variant.price,
                salePrice: variant.salePrice,
                stockQuantity: variant.stockQuantity,
                weightGrams: variant.weightGrams,
                isActive: variant.isActive,
                color: color
                    ? {
                        colorId: color.colorId,
                        colorName: color.colorName,
                        colorCode: color.colorCode,
                    }
                    : null,
                size: size
                    ? {
                        sizeId: size.sizeId,
                        sizeName: size.sizeName,
                        sizeCode: size.sizeCode,
                        sortOrder: size.sortOrder,
                    }
                    : null,
                images: imagesByVariantId.get(variant.variantId) ?? [],
            };
        });
    }
    getUniqueVariantOptions(variants, key) {
        if (key === 'color') {
            const options = new Map();
            for (const variant of variants) {
                if (variant.color)
                    options.set(variant.color.colorId, variant.color);
            }
            return [...options.values()];
        }
        const options = new Map();
        for (const variant of variants) {
            if (variant.size)
                options.set(variant.size.sizeId, variant.size);
        }
        return [...options.values()];
    }
    async enrichProductCard(product) {
        const [enriched, variants] = await Promise.all([
            this.enrichProductWithDiscount(product),
            this.getProductVariants(product.productId),
        ]);
        const activeVariantStock = variants
            .filter((variant) => variant.isActive)
            .reduce((sum, variant) => sum + variant.stockQuantity, 0);
        return {
            ...enriched,
            quantityAvailable: variants.length > 0 ? activeVariantStock : enriched.quantityAvailable,
            variants,
            colorOptions: this.getUniqueVariantOptions(variants, 'color'),
            sizeOptions: this.getUniqueVariantOptions(variants, 'size'),
        };
    }
    async enrichProductWithDiscount(product) {
        const primaryImage = (await this.productImagesRepository.findOne({
            where: { productId: product.productId, isPrimary: true },
            order: { sortOrder: 'ASC', createdAt: 'ASC' },
        })) ??
            (await this.productImagesRepository.findOne({
                where: { productId: product.productId },
                order: { isPrimary: 'DESC', sortOrder: 'ASC', createdAt: 'ASC' },
            }));
        const appliedDiscount = await this.findApplicableDiscount(product);
        const basePrice = Number(product.productPriceSale ?? product.productPrice);
        const discountAmount = appliedDiscount
            ? this.calculateDiscountAmount(appliedDiscount, basePrice)
            : 0;
        const effectivePrice = Math.max(0, basePrice - discountAmount).toFixed(2);
        return {
            ...product,
            primaryImageUrl: primaryImage?.imageUrl ?? null,
            basePrice: basePrice.toFixed(2),
            effectivePrice,
            appliedDiscount: appliedDiscount
                ? {
                    id: appliedDiscount.discountId,
                    code: appliedDiscount.discountCode,
                    name: appliedDiscount.discountName,
                    type: appliedDiscount.discountType,
                    value: appliedDiscount.discountValue,
                    appliesTo: appliedDiscount.appliesTo,
                }
                : null,
        };
    }
    async mapRecommendationCard(product) {
        const [origin, category, enriched] = await Promise.all([
            product.originId
                ? this.originsRepository.findOneBy({ originId: product.originId })
                : Promise.resolve(null),
            this.categoriesRepository.findOneBy({ categoryId: product.categoryId }),
            this.enrichProductWithDiscount(product),
        ]);
        return {
            productId: product.productId,
            productName: product.productName,
            productSlug: product.productSlug,
            quantityAvailable: product.quantityAvailable,
            unit: product.unit,
            isShow: product.isShow,
            basePrice: enriched.basePrice,
            effectivePrice: enriched.effectivePrice,
            primaryImageUrl: enriched.primaryImageUrl,
            appliedDiscount: enriched.appliedDiscount,
            category: category
                ? {
                    categoryId: category.categoryId,
                    categoryName: category.categoryName,
                    categorySlug: category.categorySlug,
                }
                : null,
            origin: origin
                ? {
                    originId: origin.originId,
                    originName: origin.originName,
                }
                : null,
            ratingAverage: product.ratingAverage,
            ratingCount: product.ratingCount,
        };
    }
    calculateDiscountAmount(discount, amount) {
        const rawDiscount = discount.discountType === discount_entity_1.DiscountType.PERCENT
            ? (amount * Number(discount.discountValue)) / 100
            : Number(discount.discountValue);
        const maxDiscount = discount.maxDiscountAmount
            ? Number(discount.maxDiscountAmount)
            : null;
        const capped = maxDiscount !== null ? Math.min(rawDiscount, maxDiscount) : rawDiscount;
        return Math.min(capped, amount);
    }
    async findApplicableDiscount(product) {
        const now = new Date();
        const activeDiscounts = await this.discountsRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
        });
        const validDiscounts = activeDiscounts.filter((d) => d.startAt.getTime() <= now.getTime() &&
            d.expireDate.getTime() >= now.getTime() &&
            (d.usageLimit === null || d.usedCount < d.usageLimit));
        let bestDiscount = null;
        let bestValue = 0;
        const basePrice = Number(product.productPriceSale ?? product.productPrice);
        for (const discount of validDiscounts) {
            let applicable = false;
            if (discount.appliesTo === discount_entity_1.DiscountApplyTarget.ORDER) {
                applicable = true;
            }
            if (discount.appliesTo === discount_entity_1.DiscountApplyTarget.CATEGORY) {
                const exists = await this.discountCategoriesRepository.findOneBy({
                    discountId: discount.discountId,
                    categoryId: product.categoryId,
                });
                applicable = !!exists;
            }
            if (discount.appliesTo === discount_entity_1.DiscountApplyTarget.PRODUCT) {
                const exists = await this.discountProductsRepository.findOneBy({
                    discountId: discount.discountId,
                    productId: product.productId,
                });
                applicable = !!exists;
            }
            if (!applicable)
                continue;
            if (basePrice < Number(discount.minOrderValue))
                continue;
            const value = this.calculateDiscountAmount(discount, basePrice);
            if (value > bestValue) {
                bestDiscount = discount;
                bestValue = value;
            }
        }
        return bestDiscount;
    }
    async getProductTagsInternal(productId) {
        const productTags = await this.productTagsRepository.findBy({ productId });
        if (productTags.length === 0)
            return [];
        const tagIds = productTags.map((pt) => pt.tagId);
        return this.tagsRepository.findBy(tagIds.map((tagId) => ({ tagId })));
    }
    async ensureUniqueFields(payload, excludeProductId) {
        const slug = payload.productSlug
            ? this.normalizeSlug(payload.productSlug)
            : payload.productName
                ? this.normalizeSlug(payload.productName)
                : null;
        if (slug) {
            const existing = await this.productsRepository.findOneBy({
                productSlug: slug,
            });
            if (existing && existing.productId !== excludeProductId) {
                throw new common_1.ConflictException('Product slug already exists');
            }
        }
        if (payload.barcode) {
            const existing = await this.productsRepository.findOneBy({
                barcode: payload.barcode,
            });
            if (existing && existing.productId !== excludeProductId) {
                throw new common_1.ConflictException('Barcode already exists');
            }
        }
        if (payload.boxBarcode) {
            const existing = await this.productsRepository.findOneBy({
                boxBarcode: payload.boxBarcode,
            });
            if (existing && existing.productId !== excludeProductId) {
                throw new common_1.ConflictException('Box barcode already exists');
            }
        }
    }
    normalizeSlug(value) {
        return value
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    async uploadImageToCloudinary(file, publicIdPrefix) {
        const cloudName = process.env.CLOUD_NAME;
        const apiKey = process.env.API_KEY;
        const apiSecret = process.env.API_SECRET;
        if (!cloudName || !apiKey || !apiSecret) {
            throw new common_1.InternalServerErrorException('Cloudinary environment variables are missing');
        }
        const folder = 'agri_ecommerce/products';
        const timestamp = Math.floor(Date.now() / 1000);
        const publicId = `${publicIdPrefix}-${Date.now()}`;
        const signature = (0, node_crypto_1.createHash)('sha1')
            .update(`folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
            .digest('hex');
        const formData = new FormData();
        formData.append('file', new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }), file.originalname);
        formData.append('api_key', apiKey);
        formData.append('timestamp', String(timestamp));
        formData.append('signature', signature);
        formData.append('folder', folder);
        formData.append('public_id', publicId);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData });
        const payload = (await response.json());
        if (!response.ok || !payload.secure_url) {
            throw new common_1.InternalServerErrorException(payload.error?.message ?? 'Unable to upload image to Cloudinary');
        }
        return payload.secure_url;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(product_image_entity_1.ProductImageEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(product_description_image_entity_1.ProductDescriptionImageEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariantEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(color_entity_1.ColorEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(size_entity_1.SizeEntity)),
    __param(6, (0, typeorm_1.InjectRepository)(variant_image_entity_1.VariantImageEntity)),
    __param(7, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryEntity)),
    __param(8, (0, typeorm_1.InjectRepository)(subcategory_entity_1.SubcategoryEntity)),
    __param(9, (0, typeorm_1.InjectRepository)(origin_entity_1.OriginEntity)),
    __param(10, (0, typeorm_1.InjectRepository)(tag_entity_1.TagEntity)),
    __param(11, (0, typeorm_1.InjectRepository)(product_tag_entity_1.ProductTagEntity)),
    __param(12, (0, typeorm_1.InjectRepository)(inventory_transaction_entity_1.InventoryTransactionEntity)),
    __param(13, (0, typeorm_1.InjectRepository)(wishlist_entity_1.WishlistEntity)),
    __param(14, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(15, (0, typeorm_1.InjectRepository)(discount_entity_1.DiscountEntity)),
    __param(16, (0, typeorm_1.InjectRepository)(discount_category_entity_1.DiscountCategoryEntity)),
    __param(17, (0, typeorm_1.InjectRepository)(discount_product_entity_1.DiscountProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService,
        typeorm_2.DataSource])
], ProductsService);
//# sourceMappingURL=products.service.js.map