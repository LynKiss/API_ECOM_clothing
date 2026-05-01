import { createHash, randomUUID } from 'node:crypto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { WarehouseEntity } from '../warehouses/entities/warehouse.entity';
import { WarehouseStockEntity } from '../warehouses/entities/warehouse-stock.entity';
import { NotificationChannel } from '../notifications/entities/notification.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { CategoryEntity } from '../categories/entities/category.entity';
import { DiscountCategoryEntity } from '../discounts/entities/discount-category.entity';
import {
  DiscountApplyTarget,
  DiscountEntity,
  DiscountType,
} from '../discounts/entities/discount.entity';
import { DiscountProductEntity } from '../discounts/entities/discount-product.entity';
import { UserEntity } from '../users/entities/user.entity';
import {
  AdjustInventoryDto,
  InventoryAdjustmentMode,
} from './dto/adjust-inventory.dto';
import { CreateColorDto } from './dto/create-color.dto';
import {
  CreateProductDto,
  CreateProductVariantDto,
} from './dto/create-product.dto';
import { CreateSizeDto } from './dto/create-size.dto';
import { ImportInventoryDto } from './dto/import-inventory.dto';
import { QueryInventoryTransactionsDto } from './dto/query-inventory-transactions.dto';
import {
  ProductSortBy,
  QueryProductsDto,
  SortOrder,
} from './dto/query-products.dto';
import {
  RecordDamageDto,
  RecordReturnDto,
} from './dto/record-damage-return.dto';
import { ReorderImagesDto } from './dto/reorder-images.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpsertProductVariantDto } from './dto/upsert-product-variant.dto';
import {
  InventoryTransactionEntity,
  InventoryTransactionType,
} from './entities/inventory-transaction.entity';
import { ColorEntity } from './entities/color.entity';
import { OriginEntity } from './entities/origin.entity';
import { ProductDescriptionImageEntity } from './entities/product-description-image.entity';
import { ProductEntity } from './entities/product.entity';
import { ProductImageEntity } from './entities/product-image.entity';
import { ProductTagEntity } from './entities/product-tag.entity';
import { ProductVariantEntity } from './entities/product-variant.entity';
import { SizeEntity } from './entities/size.entity';
import { SubcategoryEntity } from './entities/subcategory.entity';
import { TagEntity } from './entities/tag.entity';
import { VariantImageEntity } from './entities/variant-image.entity';
import { WishlistEntity } from './entities/wishlist.entity';

type UploadedImageFile = {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname: string;
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    @InjectRepository(ProductImageEntity)
    private readonly productImagesRepository: Repository<ProductImageEntity>,
    @InjectRepository(ProductDescriptionImageEntity)
    private readonly productDescriptionImagesRepository: Repository<ProductDescriptionImageEntity>,
    @InjectRepository(ProductVariantEntity)
    private readonly productVariantsRepository: Repository<ProductVariantEntity>,
    @InjectRepository(ColorEntity)
    private readonly colorsRepository: Repository<ColorEntity>,
    @InjectRepository(SizeEntity)
    private readonly sizesRepository: Repository<SizeEntity>,
    @InjectRepository(VariantImageEntity)
    private readonly variantImagesRepository: Repository<VariantImageEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
    @InjectRepository(SubcategoryEntity)
    private readonly subcategoriesRepository: Repository<SubcategoryEntity>,
    @InjectRepository(OriginEntity)
    private readonly originsRepository: Repository<OriginEntity>,
    @InjectRepository(TagEntity)
    private readonly tagsRepository: Repository<TagEntity>,
    @InjectRepository(ProductTagEntity)
    private readonly productTagsRepository: Repository<ProductTagEntity>,
    @InjectRepository(InventoryTransactionEntity)
    private readonly inventoryTransactionsRepository: Repository<InventoryTransactionEntity>,
    @InjectRepository(WishlistEntity)
    private readonly wishlistRepository: Repository<WishlistEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(DiscountEntity)
    private readonly discountsRepository: Repository<DiscountEntity>,
    @InjectRepository(DiscountCategoryEntity)
    private readonly discountCategoriesRepository: Repository<DiscountCategoryEntity>,
    @InjectRepository(DiscountProductEntity)
    private readonly discountProductsRepository: Repository<DiscountProductEntity>,
    private readonly notificationsService: NotificationsService,
    private readonly dataSource: DataSource,
  ) {}

  private async syncDefaultWarehouseStock(
    em: EntityManager,
    productId: string,
    qtyDelta: number,
    variantId?: string | null,
  ): Promise<void> {
    if (qtyDelta === 0) return;
    const warehouse = await em.findOne(WarehouseEntity, { where: { isDefault: true } });
    if (!warehouse) return;
    const stockQuery = em
      .createQueryBuilder(WarehouseStockEntity, 'stock')
      .where('stock.warehouse_id = :warehouseId', {
        warehouseId: warehouse.warehouseId,
      })
      .andWhere('stock.product_id = :productId', { productId });

    if (variantId) {
      stockQuery.andWhere('stock.variant_id = :variantId', { variantId });
    } else {
      stockQuery.andWhere('stock.variant_id IS NULL');
    }

    const stock = await stockQuery.getOne();
    if (stock) {
      stock.quantity = Math.max(0, stock.quantity + qtyDelta);
      await em.save(WarehouseStockEntity, stock);
    } else if (qtyDelta > 0) {
      await em.save(WarehouseStockEntity, em.create(WarehouseStockEntity, {
        warehouseId: warehouse.warehouseId,
        productId,
        variantId: variantId ?? null,
        quantity: qtyDelta,
      }));
    }
  }

  // â”€â”€â”€ PRODUCTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async findAll(query: QueryProductsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sortBy = query.sortBy ?? ProductSortBy.CREATED_AT;
    const sortOrder = query.sortOrder ?? SortOrder.DESC;

    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    if (query.search) {
      queryBuilder.andWhere(
        '(product.product_name LIKE :search OR product.product_slug LIKE :search)',
        { search: `%${query.search}%` },
      );
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
        .innerJoin(
          'product_tags',
          'pt',
          'pt.product_id = product.product_id AND pt.tag_id = :tagId',
          { tagId: query.tagId },
        );
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
      queryBuilder.andWhere(
        'product.expired_at IS NOT NULL AND product.expired_at <= :soon',
        { soon },
      );
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
    const mappedItems = await Promise.all(
      items.map((item) => this.enrichProductCard(item)),
    );

    return {
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      items: mappedItems,
    };
  }

  async findOne(productId: string) {
    const product = await this.productsRepository.findOneBy({ productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.enrichProductWithFullDetails(product);
  }

  async getRecommendationCards(options: {
    productIds?: string[];
    keywordHints?: string[];
    limit?: number;
  }) {
    const limit = Math.max(1, Math.min(options.limit ?? 4, 12));
    const explicitIds = [...new Set((options.productIds ?? []).filter(Boolean))];
    const normalizedHints = [...new Set((options.keywordHints ?? []).map((item) => item.trim()).filter(Boolean))].slice(0, 8);

    const products: ProductEntity[] = [];

    if (explicitIds.length > 0) {
      const explicitProducts = await this.productsRepository.find({
        where: { productId: In(explicitIds), isShow: true },
      });
      explicitProducts.sort(
        (left, right) =>
          explicitIds.indexOf(left.productId) - explicitIds.indexOf(right.productId),
      );
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

      const hintClauses = normalizedHints.map((_, index) =>
        `(product.product_name LIKE :hint${index} OR product.description LIKE :hint${index})`,
      );
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
      .filter(
        (product, index, current) =>
          current.findIndex((item) => item.productId === product.productId) === index,
      )
      .slice(0, limit);

    return Promise.all(uniqueProducts.map((product) => this.mapRecommendationCard(product)));
  }

  async getAdminProductOptions(search?: string, limit = 24) {
    const safeLimit = Math.max(1, Math.min(limit, 50));
    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    if (search?.trim()) {
      queryBuilder.andWhere(
        '(product.product_name LIKE :search OR product.product_slug LIKE :search OR product.description LIKE :search)',
        {
          search: `%${search.trim()}%`,
        },
      );
    }

    queryBuilder
      .orderBy('product.is_show', 'DESC')
      .addOrderBy('product.quantity_available', 'DESC')
      .addOrderBy('product.created_at', 'DESC')
      .take(safeLimit);

    const products = await queryBuilder.getMany();
    return Promise.all(products.map((product) => this.mapRecommendationCard(product)));
  }

  async create(createProductDto: CreateProductDto) {
    await this.ensureCategoryExists(createProductDto.categoryId);
    if (createProductDto.originId) {
      await this.ensureOriginExists(createProductDto.originId);
    }
    await this.ensureUniqueFields(createProductDto);
    await this.ensureTagsExist(createProductDto.tagIds ?? []);

    if (
      createProductDto.productPriceSale != null &&
      Number(createProductDto.productPriceSale) > Number(createProductDto.productPrice)
    ) {
      throw new BadRequestException('Sale price cannot exceed regular price');
    }

    const productId = createProductDto.productId ?? randomUUID();
    const preparedVariants = await this.prepareCreateVariants(
      createProductDto.variants ?? [],
      createProductDto.productPrice,
      {
        productId,
        productName: createProductDto.productName,
        productSlug: createProductDto.productSlug ?? null,
      },
    );
    const variantStock = preparedVariants.reduce(
      (sum, variant) => sum + (variant.stockQuantity ?? 0),
      0,
    );
    const baseStock = createProductDto.quantityAvailable ?? 0;

    const product = this.productsRepository.create({
      productId,
      productName: createProductDto.productName,
      productSlug: this.normalizeSlug(
        createProductDto.productSlug ?? createProductDto.productName,
      ),
      categoryId: createProductDto.categoryId,
      subcategoryId: createProductDto.subcategoryId ?? null,
      originId: createProductDto.originId ?? null,
      productPrice: createProductDto.productPrice,
      productPriceSale: createProductDto.productPriceSale ?? null,
      quantityAvailable: baseStock + variantStock,
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

    const saved = await this.dataSource.transaction(async (em) => {
      const savedProduct = await em.save(ProductEntity, product);

      if ((createProductDto.tagIds ?? []).length > 0) {
        await em.save(
          ProductTagEntity,
          createProductDto.tagIds!.map((tagId) =>
            em.create(ProductTagEntity, {
              productId: savedProduct.productId,
              tagId,
            }),
          ),
        );
      }

      if (preparedVariants.length > 0) {
        await em.save(
          ProductVariantEntity,
          preparedVariants.map((variant) =>
            em.create(ProductVariantEntity, {
              ...variant,
              productId: savedProduct.productId,
            }),
          ),
        );
      }

      return savedProduct;
    });

    void this.notificationsService.createNotification({
      channel: NotificationChannel.SYSTEM,
      title: 'Sản phẩm mới được thêm',
      message: `Sản phẩm "${saved.productName}" đã được thêm vào hệ thống.`,
      metadata: { productId: saved.productId, type: 'product_created' },
    });
    return saved;
  }

  async update(productId: string, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepository.findOneBy({ productId });
    if (!product) {
      throw new NotFoundException('Product not found');
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
    if (
      effectiveSalePrice != null &&
      Number(effectiveSalePrice) > Number(effectivePrice)
    ) {
      throw new BadRequestException('Sale price cannot exceed regular price');
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
      channel: NotificationChannel.SYSTEM,
      title: 'Sản phẩm được cập nhật',
      message: `Sản phẩm "${updated.productName}" đã được cập nhật.`,
      metadata: { productId: updated.productId, type: 'product_updated' },
    });
    return updated;
  }

  async remove(productId: string) {
    const product = await this.productsRepository.findOneBy({ productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const name = product.productName;
    await this.productsRepository.remove(product);
    void this.notificationsService.createNotification({
      channel: NotificationChannel.SYSTEM,
      title: 'Sản phẩm bị xóa',
      message: `Sản phẩm "${name}" đã bị xóa khỏi hệ thống.`,
      metadata: { type: 'product_deleted' },
    });
    return { success: true };
  }

  async toggleVisibility(productId: string) {
    const product = await this.productsRepository.findOneBy({ productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.isShow = !product.isShow;
    const saved = await this.productsRepository.save(product);
    return { productId: saved.productId, isShow: saved.isShow };
  }

  async toggleFeatured(productId: string) {
    const product = await this.productsRepository.findOneBy({ productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.isFeatured = !product.isFeatured;
    const saved = await this.productsRepository.save(product);
    return { productId: saved.productId, isFeatured: saved.isFeatured };
  }

  // â”€â”€â”€ PRODUCT IMAGES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async findColors() {
    return this.colorsRepository.find({ order: { colorName: 'ASC' } });
  }

  async createColor(dto: CreateColorDto) {
    const colorName = dto.colorName.trim();
    const colorCode = dto.colorCode?.trim() || null;
    if (!colorName) {
      throw new BadRequestException('Color name is required');
    }

    const existing = await this.colorsRepository.findOneBy({ colorName });
    if (existing) return existing;

    return this.colorsRepository.save(
      this.colorsRepository.create({ colorName, colorCode }),
    );
  }

  async findSizes() {
    return this.sizesRepository.find({
      order: { sortOrder: 'ASC', sizeName: 'ASC' },
    });
  }

  async createSize(dto: CreateSizeDto) {
    const sizeName = dto.sizeName.trim();
    const sizeCode = dto.sizeCode?.trim() || null;
    if (!sizeName) {
      throw new BadRequestException('Size name is required');
    }

    const existing = await this.sizesRepository.findOneBy({ sizeName });
    if (existing) return existing;

    return this.sizesRepository.save(
      this.sizesRepository.create({
        sizeName,
        sizeCode,
        sortOrder: dto.sortOrder ?? 0,
      }),
    );
  }

  async findProductVariants(productId: string) {
    await this.ensureProductExists(productId);
    return this.getProductVariants(productId);
  }

  async createVariant(productId: string, dto: UpsertProductVariantDto) {
    const product = await this.ensureProductExists(productId);
    this.ensureVariantHasRequiredOptions(dto.colorId, dto.sizeId);
    await this.ensureVariantOptionsExist(dto);
    this.ensureVariantPricesAreValid(dto, product.productPrice);
    await this.ensureUniqueVariantOptionPair(productId, dto.colorId, dto.sizeId);
    const sku = await this.resolveVariantSku(
      product,
      dto.colorId!,
      dto.sizeId!,
      dto.sku,
    );

    const variant = this.productVariantsRepository.create({
      variantId: randomUUID(),
      productId,
      colorId: dto.colorId!,
      sizeId: dto.sizeId!,
      sku,
      barcode: dto.barcode?.trim() || null,
      price: this.resolveVariantPrice(dto.price, product.productPrice),
      salePrice: dto.salePrice || null,
      stockQuantity: dto.stockQuantity ?? 0,
      weightGrams: dto.weightGrams ?? null,
      isActive: dto.isActive ?? true,
    });

    await this.dataSource.transaction(async (em) => {
      await em.save(ProductVariantEntity, variant);
      if (variant.stockQuantity > 0) {
        product.quantityAvailable += variant.stockQuantity;
        await em.save(ProductEntity, product);
      }
    });
    return this.getVariantDetail(productId, variant.variantId);
  }

  async updateVariant(
    productId: string,
    variantId: string,
    dto: UpsertProductVariantDto,
  ) {
    const product = await this.ensureProductExists(productId);
    const variant = await this.ensureVariantExists(productId, variantId);
    await this.ensureVariantOptionsExist(dto);

    const nextColorId = dto.colorId !== undefined ? dto.colorId || null : variant.colorId;
    const nextSizeId = dto.sizeId !== undefined ? dto.sizeId || null : variant.sizeId;
    this.ensureVariantHasRequiredOptions(nextColorId, nextSizeId);
    await this.ensureUniqueVariantOptionPair(productId, nextColorId, nextSizeId, variantId);

    this.ensureVariantPricesAreValid(
      {
        price: dto.price ?? variant.price ?? undefined,
        salePrice: dto.salePrice ?? variant.salePrice ?? undefined,
      },
      product.productPrice,
    );

    variant.colorId = nextColorId;
    variant.sizeId = nextSizeId;
    if (dto.sku !== undefined || !variant.sku) {
      variant.sku = await this.resolveVariantSku(
        product,
        nextColorId!,
        nextSizeId!,
        dto.sku ?? variant.sku,
        variantId,
      );
    }
    if (dto.barcode !== undefined) variant.barcode = dto.barcode.trim() || null;
    if (dto.price !== undefined || !variant.price) {
      variant.price = this.resolveVariantPrice(dto.price ?? variant.price, product.productPrice);
    }
    if (dto.salePrice !== undefined) variant.salePrice = dto.salePrice || null;
    const previousStockQuantity = variant.stockQuantity;
    if (dto.stockQuantity !== undefined) variant.stockQuantity = dto.stockQuantity;
    if (dto.weightGrams !== undefined) variant.weightGrams = dto.weightGrams ?? null;
    if (dto.isActive !== undefined) variant.isActive = dto.isActive;

    await this.dataSource.transaction(async (em) => {
      await em.save(ProductVariantEntity, variant);
      const stockDelta = variant.stockQuantity - previousStockQuantity;
      if (stockDelta !== 0) {
        product.quantityAvailable += stockDelta;
        if (product.quantityAvailable < 0) {
          throw new BadRequestException('Quantity exceeds available stock');
        }
        await em.save(ProductEntity, product);
      }
    });
    return this.getVariantDetail(productId, variantId);
  }

  async deactivateVariant(productId: string, variantId: string) {
    const variant = await this.ensureVariantExists(productId, variantId);
    variant.isActive = false;
    await this.productVariantsRepository.save(variant);
    return { success: true };
  }

  async uploadVariantImage(
    productId: string,
    variantId: string,
    file: UploadedImageFile | undefined,
  ) {
    await this.ensureVariantExists(productId, variantId);

    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Image size must be 5MB or less');
    }

    const imageUrl = await this.uploadImageToCloudinary(
      file,
      `${productId}-${variantId}`,
    );
    const sortOrder = await this.variantImagesRepository.countBy({ variantId });
    const image = await this.variantImagesRepository.save(
      this.variantImagesRepository.create({ variantId, imageUrl, sortOrder }),
    );

    return {
      imageId: image.variantImageId,
      variantId,
      imageUrl: image.imageUrl,
      sortOrder: image.sortOrder,
    };
  }

  async deleteVariantImage(productId: string, variantId: string, imageId: string) {
    await this.ensureVariantExists(productId, variantId);
    const image = await this.variantImagesRepository.findOneBy({
      variantImageId: imageId,
      variantId,
    });
    if (!image) {
      throw new NotFoundException('Variant image not found');
    }
    await this.variantImagesRepository.remove(image);
    return { success: true };
  }
  async getProductImages(productId: string) {
    await this.ensureProductExists(productId);
    return this.productImagesRepository.find({
      where: { productId },
      order: { isPrimary: 'DESC', sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async uploadProductImage(
    productId: string,
    file: UploadedImageFile | undefined,
    isPrimary = false,
  ) {
    await this.ensureProductExists(productId);

    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Image size must be 5MB or less');
    }

    const uploadedImageUrl = await this.uploadImageToCloudinary(
      file,
      productId,
    );

    if (isPrimary) {
      await this.productImagesRepository.update(
        { productId, isPrimary: true },
        { isPrimary: false },
      );
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

  async setPrimaryImage(productId: string, imageId: string) {
    await this.ensureProductExists(productId);

    const image = await this.productImagesRepository.findOneBy({
      productImageId: imageId,
      productId,
    });
    if (!image) {
      throw new NotFoundException('Image not found for this product');
    }

    await this.productImagesRepository.update(
      { productId, isPrimary: true },
      { isPrimary: false },
    );
    image.isPrimary = true;
    await this.productImagesRepository.save(image);

    return { success: true, primaryImageId: imageId };
  }

  async deleteProductImage(productId: string, imageId: string) {
    await this.ensureProductExists(productId);

    const image = await this.productImagesRepository.findOneBy({
      productImageId: imageId,
      productId,
    });
    if (!image) {
      throw new NotFoundException('Image not found for this product');
    }

    await this.productImagesRepository.remove(image);
    return { success: true };
  }

  async reorderProductImages(productId: string, dto: ReorderImagesDto) {
    await this.ensureProductExists(productId);

    const images = await this.productImagesRepository.findBy({ productId });
    const imageMap = new Map(images.map((img) => [img.productImageId, img]));

    for (const id of dto.imageIds) {
      if (!imageMap.has(id)) {
        throw new NotFoundException(`Image ${id} not found for this product`);
      }
    }

    const updates = dto.imageIds.map((id, index) => {
      const img = imageMap.get(id)!;
      img.sortOrder = index;
      return img;
    });

    await this.productImagesRepository.save(updates);
    return this.getProductImages(productId);
  }

  // â”€â”€â”€ DESCRIPTION IMAGES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async getDescriptionImages(productId: string) {
    await this.ensureProductExists(productId);
    return this.productDescriptionImagesRepository.find({
      where: { productId },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async uploadDescriptionImage(
    productId: string,
    file: UploadedImageFile | undefined,
  ) {
    await this.ensureProductExists(productId);

    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Image size must be 5MB or less');
    }

    const imageUrl = await this.uploadImageToCloudinary(
      file,
      `${productId}-desc`,
    );
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

  async deleteDescriptionImage(productId: string, imageId: string) {
    await this.ensureProductExists(productId);

    const image = await this.productDescriptionImagesRepository.findOneBy({
      productDescriptionImageId: imageId,
      productId,
    });
    if (!image) {
      throw new NotFoundException('Description image not found for this product');
    }

    await this.productDescriptionImagesRepository.remove(image);
    return { success: true };
  }

  // â”€â”€â”€ INVENTORY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async importInventory(
    performedBy: string,
    importInventoryDto: ImportInventoryDto,
  ) {
    await this.ensureUserExists(performedBy);
    let result: {
      productId: string;
      variantId: string | null;
      quantityAvailable: number;
      targetQuantity: number;
      transactionId: string;
    };
    let transactionId: string;
    await this.dataSource.transaction(async (em) => {
      const { product, variant } = await this.getInventoryTarget(
        em,
        importInventoryDto.productId,
        importInventoryDto.variantId,
      );
      const quantityBefore = variant?.stockQuantity ?? product.quantityAvailable;

      product.quantityAvailable += importInventoryDto.quantity;
      if (variant) {
        variant.stockQuantity += importInventoryDto.quantity;
        await em.save(ProductVariantEntity, variant);
      }
      await em.save(ProductEntity, product);

      const tx = em.create(InventoryTransactionEntity, {
        productId: product.productId,
        variantId: variant?.variantId ?? null,
        performedBy,
        transactionType: InventoryTransactionType.IMPORT,
        quantityChange: importInventoryDto.quantity,
        quantityBefore,
        quantityAfter: variant?.stockQuantity ?? product.quantityAvailable,
        note: importInventoryDto.note ?? 'Import inventory by admin',
        relatedOrderId: null,
      });
      const saved = await em.save(InventoryTransactionEntity, tx);
      transactionId = saved.transactionId;

      await this.syncDefaultWarehouseStock(
        em,
        product.productId,
        importInventoryDto.quantity,
        variant?.variantId ?? null,
      );

      result = {
        productId: product.productId,
        variantId: variant?.variantId ?? null,
        quantityAvailable: product.quantityAvailable,
        targetQuantity: variant?.stockQuantity ?? product.quantityAvailable,
        transactionId,
      };
    });

    return result!;
  }

  async adjustInventory(
    performedBy: string,
    adjustInventoryDto: AdjustInventoryDto,
  ) {
    await this.ensureUserExists(performedBy);
    let result: {
      productId: string;
      variantId: string | null;
      previousQuantity: number;
      currentQuantity: number;
      quantityAvailable: number;
      quantityChange: number;
      transactionId: string;
    };
    let transactionId: string;
    await this.dataSource.transaction(async (em) => {
      const { product, variant } = await this.getInventoryTarget(
        em,
        adjustInventoryDto.productId,
        adjustInventoryDto.variantId,
      );
      const previousQuantity = variant?.stockQuantity ?? product.quantityAvailable;
      let quantityChange = 0;

      if (adjustInventoryDto.mode === InventoryAdjustmentMode.SET) {
        quantityChange = adjustInventoryDto.quantity - previousQuantity;
      } else if (adjustInventoryDto.mode === InventoryAdjustmentMode.INCREASE) {
        quantityChange = adjustInventoryDto.quantity;
      } else if (adjustInventoryDto.mode === InventoryAdjustmentMode.DECREASE) {
        if (adjustInventoryDto.quantity > previousQuantity) {
          throw new BadRequestException('Quantity exceeds available stock');
        }
        quantityChange = -adjustInventoryDto.quantity;
      }

      product.quantityAvailable += quantityChange;
      if (product.quantityAvailable < 0) {
        throw new BadRequestException('Quantity exceeds available stock');
      }
      if (variant) {
        variant.stockQuantity += quantityChange;
        if (variant.stockQuantity < 0) {
          throw new BadRequestException('Quantity exceeds available stock');
        }
        await em.save(ProductVariantEntity, variant);
      }
      await em.save(ProductEntity, product);

      const tx = em.create(InventoryTransactionEntity, {
        productId: product.productId,
        variantId: variant?.variantId ?? null,
        performedBy,
        transactionType: InventoryTransactionType.ADJUSTMENT,
        quantityChange,
        quantityBefore: previousQuantity,
        quantityAfter: variant?.stockQuantity ?? product.quantityAvailable,
        note:
          adjustInventoryDto.note ??
          `Adjustment mode: ${adjustInventoryDto.mode}`,
        relatedOrderId: null,
      });
      const saved = await em.save(InventoryTransactionEntity, tx);
      transactionId = saved.transactionId;

      await this.syncDefaultWarehouseStock(
        em,
        product.productId,
        quantityChange,
        variant?.variantId ?? null,
      );

      result = {
        productId: product.productId,
        variantId: variant?.variantId ?? null,
        previousQuantity,
        currentQuantity: variant?.stockQuantity ?? product.quantityAvailable,
        quantityAvailable: product.quantityAvailable,
        quantityChange,
        transactionId,
      };
    });

    return result!;
  }

  async recordDamage(performedBy: string, dto: RecordDamageDto) {
    await this.ensureUserExists(performedBy);
    let result: {
      productId: string;
      variantId: string | null;
      quantityAvailable: number;
      targetQuantity: number;
      transactionId: string;
    };
    let transactionId: string;
    await this.dataSource.transaction(async (em) => {
      const { product, variant } = await this.getInventoryTarget(
        em,
        dto.productId,
        dto.variantId,
      );
      const quantityBefore = variant?.stockQuantity ?? product.quantityAvailable;
      if (dto.quantity > quantityBefore) {
        throw new BadRequestException('Damage quantity exceeds available stock');
      }

      product.quantityAvailable -= dto.quantity;
      if (variant) {
        variant.stockQuantity -= dto.quantity;
        await em.save(ProductVariantEntity, variant);
      }
      await em.save(ProductEntity, product);

      const tx = em.create(InventoryTransactionEntity, {
        productId: product.productId,
        variantId: variant?.variantId ?? null,
        performedBy,
        transactionType: InventoryTransactionType.DAMAGE,
        quantityChange: -dto.quantity,
        quantityBefore,
        quantityAfter: variant?.stockQuantity ?? product.quantityAvailable,
        note: dto.note ?? 'Damaged apparel item recorded',
        relatedOrderId: null,
      });
      const saved = await em.save(InventoryTransactionEntity, tx);
      transactionId = saved.transactionId;

      await this.syncDefaultWarehouseStock(
        em,
        product.productId,
        -dto.quantity,
        variant?.variantId ?? null,
      );

      result = {
        productId: product.productId,
        variantId: variant?.variantId ?? null,
        quantityAvailable: product.quantityAvailable,
        targetQuantity: variant?.stockQuantity ?? product.quantityAvailable,
        transactionId,
      };
    });

    return result!;
  }

  async recordReturn(performedBy: string, dto: RecordReturnDto) {
    await this.ensureUserExists(performedBy);
    let result: {
      productId: string;
      variantId: string | null;
      quantityAvailable: number;
      targetQuantity: number;
      transactionId: string;
    };
    let transactionId: string;
    await this.dataSource.transaction(async (em) => {
      const { product, variant } = await this.getInventoryTarget(
        em,
        dto.productId,
        dto.variantId,
      );
      const quantityBefore = variant?.stockQuantity ?? product.quantityAvailable;

      product.quantityAvailable += dto.quantity;
      if (variant) {
        variant.stockQuantity += dto.quantity;
        await em.save(ProductVariantEntity, variant);
      }
      await em.save(ProductEntity, product);

      const tx = em.create(InventoryTransactionEntity, {
        productId: product.productId,
        variantId: variant?.variantId ?? null,
        performedBy,
        transactionType: InventoryTransactionType.RETURN_IN,
        quantityChange: dto.quantity,
        quantityBefore,
        quantityAfter: variant?.stockQuantity ?? product.quantityAvailable,
        note: dto.note ?? 'Return goods recorded',
        relatedOrderId: dto.relatedOrderId ?? null,
      });
      const saved = await em.save(InventoryTransactionEntity, tx);
      transactionId = saved.transactionId;

      await this.syncDefaultWarehouseStock(
        em,
        product.productId,
        dto.quantity,
        variant?.variantId ?? null,
      );

      result = {
        productId: product.productId,
        variantId: variant?.variantId ?? null,
        quantityAvailable: product.quantityAvailable,
        targetQuantity: variant?.stockQuantity ?? product.quantityAvailable,
        transactionId,
      };
    });

    return result!;
  }

  async findInventoryTransactions(query: QueryInventoryTransactionsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const queryBuilder = this.inventoryTransactionsRepository
      .createQueryBuilder('transaction')
      .leftJoin(
        ProductEntity,
        'product',
        'product.product_id = transaction.product_id',
      )
      .leftJoin(
        UserEntity,
        'user',
        'user.user_id = transaction.performed_by',
      )
      .leftJoin(
        ProductVariantEntity,
        'variant',
        'variant.variant_id = transaction.variant_id',
      )
      .leftJoin(ColorEntity, 'color', 'color.color_id = variant.color_id')
      .leftJoin(SizeEntity, 'size', 'size.size_id = variant.size_id')
      .select([
        'transaction.transactionId AS id',
        'transaction.productId AS productId',
        'transaction.variantId AS variantId',
        'transaction.transactionType AS transactionType',
        'transaction.quantityChange AS quantityChange',
        'transaction.quantityBefore AS quantityBefore',
        'transaction.quantityAfter AS quantityAfter',
        'transaction.note AS note',
        'transaction.relatedOrderId AS relatedOrderId',
        'transaction.createdAt AS createdAt',
        'product.product_name AS productName',
        'variant.sku AS variantSku',
        'variant.barcode AS variantBarcode',
        'color.color_name AS colorName',
        'size.size_name AS sizeName',
      ])
      .addSelect(
        'COALESCE(user.username, user.email, transaction.performed_by)',
        'performedBy',
      );

    if (query.productId) {
      queryBuilder.andWhere('transaction.product_id = :productId', {
        productId: query.productId,
      });
    }

    if (query.variantId) {
      queryBuilder.andWhere('transaction.variant_id = :variantId', {
        variantId: query.variantId,
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
    const productRows = await this.productsRepository
      .createQueryBuilder('product')
      .select([
        "'product' AS rowType",
        'product.product_id AS productId',
        'NULL AS variantId',
        'product.product_name AS productName',
        'NULL AS variantSku',
        'NULL AS colorName',
        'NULL AS sizeName',
        'product.quantity_available AS quantityAvailable',
        'product.barcode AS barcode',
        'product.unit AS unit',
      ])
      .addSelect(
        `COALESCE(SUM(CASE WHEN t.transaction_type = 'import' THEN t.quantity_change ELSE 0 END), 0)`,
        'totalImported',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN t.transaction_type = 'damage' THEN ABS(t.quantity_change) ELSE 0 END), 0)`,
        'totalDamaged',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN t.transaction_type = 'export' THEN ABS(t.quantity_change) ELSE 0 END), 0)`,
        'totalExported',
      )
      .leftJoin(
        'inventory_transactions',
        't',
        't.product_id = product.product_id AND t.variant_id IS NULL',
      )
      .where('product.is_show = :isShow', { isShow: true })
      .groupBy('product.product_id')
      .orderBy('product.product_name', 'ASC')
      .getRawMany();

    const variantRows = await this.productVariantsRepository
      .createQueryBuilder('variant')
      .innerJoin(ProductEntity, 'product', 'product.product_id = variant.product_id')
      .leftJoin(ColorEntity, 'color', 'color.color_id = variant.color_id')
      .leftJoin(SizeEntity, 'size', 'size.size_id = variant.size_id')
      .leftJoin(
        'inventory_transactions',
        't',
        't.variant_id = variant.variant_id',
      )
      .select([
        "'variant' AS rowType",
        'product.product_id AS productId',
        'variant.variant_id AS variantId',
        'product.product_name AS productName',
        'variant.sku AS variantSku',
        'color.color_name AS colorName',
        'size.size_name AS sizeName',
        'variant.stock_quantity AS quantityAvailable',
        'variant.barcode AS barcode',
        'product.unit AS unit',
      ])
      .addSelect(
        `COALESCE(SUM(CASE WHEN t.transaction_type = 'import' THEN t.quantity_change ELSE 0 END), 0)`,
        'totalImported',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN t.transaction_type = 'damage' THEN ABS(t.quantity_change) ELSE 0 END), 0)`,
        'totalDamaged',
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN t.transaction_type = 'export' THEN ABS(t.quantity_change) ELSE 0 END), 0)`,
        'totalExported',
      )
      .where('product.is_show = :isShow', { isShow: true })
      .andWhere('variant.is_active = :isActive', { isActive: true })
      .groupBy('variant.variant_id')
      .orderBy('product.product_name', 'ASC')
      .addOrderBy('color.color_name', 'ASC')
      .addOrderBy('size.sort_order', 'ASC')
      .getRawMany();

    return [...productRows, ...variantRows];
  }

  async getLowStockProducts(threshold = 10) {
    const productsWithoutVariants = await this.productsRepository
      .createQueryBuilder('product')
      .where('product.quantity_available <= :threshold', { threshold })
      .andWhere('product.is_show = :isShow', { isShow: true })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(ProductVariantEntity, 'variant')
          .where('variant.product_id = product.product_id')
          .getQuery();
        return `NOT EXISTS ${subQuery}`;
      })
      .orderBy('product.quantity_available', 'ASC')
      .getMany();

    const productRows = productsWithoutVariants.map((p) => ({
      rowType: 'product',
      productId: p.productId,
      variantId: null,
      productName: p.productName,
      variantSku: null,
      colorName: null,
      sizeName: null,
      quantityAvailable: p.quantityAvailable,
      unit: p.unit,
      barcode: p.barcode,
    }));

    const variantRows = await this.productVariantsRepository
      .createQueryBuilder('variant')
      .innerJoin(ProductEntity, 'product', 'product.product_id = variant.product_id')
      .leftJoin(ColorEntity, 'color', 'color.color_id = variant.color_id')
      .leftJoin(SizeEntity, 'size', 'size.size_id = variant.size_id')
      .select([
        "'variant' AS rowType",
        'product.product_id AS productId',
        'variant.variant_id AS variantId',
        'product.product_name AS productName',
        'variant.sku AS variantSku',
        'color.color_name AS colorName',
        'size.size_name AS sizeName',
        'variant.stock_quantity AS quantityAvailable',
        'product.unit AS unit',
        'variant.barcode AS barcode',
      ])
      .where('product.is_show = :isShow', { isShow: true })
      .andWhere('variant.is_active = :isActive', { isActive: true })
      .andWhere('variant.stock_quantity <= :threshold', { threshold })
      .orderBy('variant.stock_quantity', 'ASC')
      .addOrderBy('product.product_name', 'ASC')
      .getRawMany();

    return [...productRows, ...variantRows];
  }

  // â”€â”€â”€ WISHLIST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async findWishlist(userId: string) {
    await this.ensureUserExists(userId);

    const items = await this.wishlistRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const productIds = items.map((item) => item.productId);
    const products = productIds.length
      ? await this.productsRepository.findBy(
          productIds.map((productId) => ({ productId })),
        )
      : [];

    const categoryIds = [...new Set(products.map((p) => p.categoryId).filter(Boolean))];
    const categories = categoryIds.length
      ? await this.categoriesRepository.findBy(categoryIds.map((id) => ({ categoryId: id })))
      : [];
    const categoriesById = new Map(categories.map((c) => [c.categoryId, c]));

    const enrichedEntries = await Promise.all(
      products.map(async (p) => [p.productId, await this.enrichProductWithDiscount(p)] as const),
    );
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

  async addWishlistItem(userId: string, productId: string) {
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

  async removeWishlistItem(userId: string, productId: string) {
    await this.ensureUserExists(userId);

    const existingItem = await this.wishlistRepository.findOneBy({
      userId,
      productId,
    });
    if (!existingItem) {
      throw new NotFoundException('Wishlist item not found');
    }

    await this.wishlistRepository.delete({ userId, productId });
    return { success: true };
  }

  // â”€â”€â”€ PRIVATE HELPERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  private async ensureTagsExist(tagIds: string[]) {
    if (tagIds.length === 0) return;
    const uniqueTagIds = [...new Set(tagIds)];
    const tags = await this.tagsRepository.find({
      where: { tagId: In(uniqueTagIds) },
      select: { tagId: true },
    });
    if (tags.length !== uniqueTagIds.length) {
      throw new NotFoundException('One or more product tags were not found');
    }
  }

  private async getInventoryTarget(
    em: EntityManager,
    productId: string,
    variantId?: string | null,
  ) {
    const product = await em.findOne(ProductEntity, {
      where: { productId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!variantId) {
      return { product, variant: null };
    }

    const variant = await em.findOne(ProductVariantEntity, {
      where: { productId, variantId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!variant) {
      throw new NotFoundException('Variant not found for this product');
    }

    return { product, variant };
  }

  private async resolveCreateVariantColorId(dto: CreateProductVariantDto) {
    if (dto.colorId) return dto.colorId;
    if (!dto.newColor?.colorName?.trim()) return undefined;
    const color = await this.createColor({
      colorName: dto.newColor.colorName,
      colorCode: dto.newColor.colorCode,
    });
    return color.colorId;
  }

  private async resolveCreateVariantSizeId(dto: CreateProductVariantDto) {
    if (dto.sizeId) return dto.sizeId;
    if (!dto.newSize?.sizeName?.trim()) return undefined;
    const size = await this.createSize({
      sizeName: dto.newSize.sizeName,
      sizeCode: dto.newSize.sizeCode,
    });
    return size.sizeId;
  }

  private async prepareCreateVariants(
    variants: CreateProductVariantDto[],
    fallbackPrice: string,
    productIdentity: Pick<ProductEntity, 'productId' | 'productName'> & {
      productSlug?: string | null;
    },
  ) {
    const prepared: Array<Partial<ProductVariantEntity>> = [];
    const optionPairs = new Set<string>();
    const usedSkus = new Set<string>();

    for (const dto of variants) {
      const colorId = (await this.resolveCreateVariantColorId(dto)) ?? null;
      const sizeId = (await this.resolveCreateVariantSizeId(dto)) ?? null;
      this.ensureVariantHasRequiredOptions(colorId, sizeId);

      await this.ensureVariantOptionsExist({ colorId, sizeId });
      this.ensureVariantPricesAreValid(dto, fallbackPrice);

      const optionKey = `${colorId ?? 'null'}:${sizeId ?? 'null'}`;
      if (optionPairs.has(optionKey)) {
        throw new ConflictException(
          'Variant with this color and size already exists',
        );
      }
      optionPairs.add(optionKey);

      const sku = await this.resolveVariantSku(
        productIdentity,
        colorId!,
        sizeId!,
        dto.sku,
        undefined,
        usedSkus,
      );
      usedSkus.add(sku);

      prepared.push({
        variantId: randomUUID(),
        colorId: colorId!,
        sizeId: sizeId!,
        sku,
        barcode: dto.barcode?.trim() || null,
        price: this.resolveVariantPrice(dto.price, fallbackPrice),
        salePrice: dto.salePrice || null,
        stockQuantity: dto.stockQuantity ?? 0,
        weightGrams: dto.weightGrams ?? null,
        isActive: dto.isActive ?? true,
      });
    }

    return prepared;
  }

  private ensureVariantHasRequiredOptions(
    colorId?: string | null,
    sizeId?: string | null,
  ) {
    if (!colorId || !sizeId) {
      throw new BadRequestException('Variant must have both color and size');
    }
  }

  private async ensureVariantOptionsExist(
    dto: { colorId?: string | null; sizeId?: string | null },
  ) {
    if (dto.colorId) {
      const color = await this.colorsRepository.findOneBy({ colorId: dto.colorId });
      if (!color) throw new NotFoundException('Color not found');
    }
    if (dto.sizeId) {
      const size = await this.sizesRepository.findOneBy({ sizeId: dto.sizeId });
      if (!size) throw new NotFoundException('Size not found');
    }
  }

  private resolveVariantPrice(price: string | undefined | null, fallbackPrice: string) {
    const normalized = price?.trim();
    return normalized && normalized.length > 0 ? normalized : fallbackPrice;
  }

  private toSkuSegment(value: string | undefined | null, fallback: string) {
    const normalized = (value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 24);
    return normalized || fallback;
  }

  private async resolveVariantSku(
    product: Pick<ProductEntity, 'productId' | 'productName'> & {
      productSlug?: string | null;
    },
    colorId: string,
    sizeId: string,
    sku?: string | null,
    excludeVariantId?: string,
    reservedSkus = new Set<string>(),
  ) {
    const requestedSku = sku?.trim();
    if (requestedSku) {
      await this.ensureVariantSkuIsAvailable(requestedSku, excludeVariantId);
      if (reservedSkus.has(requestedSku)) {
        throw new ConflictException('Variant SKU already exists');
      }
      return requestedSku;
    }

    const [color, size] = await Promise.all([
      this.colorsRepository.findOneBy({ colorId }),
      this.sizesRepository.findOneBy({ sizeId }),
    ]);
    const productSegment = this.toSkuSegment(
      product.productSlug ?? product.productName,
      product.productId.slice(0, 8),
    );
    const colorSegment = this.toSkuSegment(
      color?.colorCode ?? color?.colorName,
      `C${colorId}`,
    );
    const sizeSegment = this.toSkuSegment(
      size?.sizeCode ?? size?.sizeName,
      `S${sizeId}`,
    );
    const baseSku = `${productSegment}-${colorSegment}-${sizeSegment}`.slice(0, 92);

    for (let index = 0; index < 50; index += 1) {
      const suffix = index === 0 ? '' : `-${index + 1}`;
      const candidate = `${baseSku}${suffix}`.slice(0, 100);
      const exists = await this.variantSkuExists(candidate, excludeVariantId);
      if (!exists && !reservedSkus.has(candidate)) {
        return candidate;
      }
    }

    return `${baseSku.slice(0, 91)}-${randomUUID().slice(0, 8).toUpperCase()}`;
  }

  private async ensureVariantSkuIsAvailable(
    sku: string,
    excludeVariantId?: string,
  ) {
    const exists = await this.variantSkuExists(sku, excludeVariantId);
    if (exists) {
      throw new ConflictException('Variant SKU already exists');
    }
  }

  private async variantSkuExists(sku: string, excludeVariantId?: string) {
    const qb = this.productVariantsRepository
      .createQueryBuilder('variant')
      .where('variant.sku = :sku', { sku });
    if (excludeVariantId) {
      qb.andWhere('variant.variant_id <> :excludeVariantId', {
        excludeVariantId,
      });
    }
    return (await qb.getCount()) > 0;
  }

  private ensureVariantPricesAreValid(
    dto: Pick<UpsertProductVariantDto, 'price' | 'salePrice'>,
    fallbackPrice: string,
  ) {
    const basePrice = Number(dto.price ?? fallbackPrice);
    const salePrice = dto.salePrice !== undefined && dto.salePrice !== null && dto.salePrice !== ''
      ? Number(dto.salePrice)
      : null;

    if (!Number.isFinite(basePrice) || basePrice < 0) {
      throw new BadRequestException('Variant price is invalid');
    }
    if (salePrice !== null && (!Number.isFinite(salePrice) || salePrice < 0)) {
      throw new BadRequestException('Variant sale price is invalid');
    }
    if (salePrice !== null && salePrice > basePrice) {
      throw new BadRequestException('Variant sale price cannot exceed price');
    }
  }

  private async ensureUniqueVariantOptionPair(
    productId: string,
    colorId?: string | null,
    sizeId?: string | null,
    excludeVariantId?: string,
  ) {
    const qb = this.productVariantsRepository
      .createQueryBuilder('variant')
      .where('variant.product_id = :productId', { productId });

    if (excludeVariantId) {
      qb.andWhere('variant.variant_id <> :excludeVariantId', { excludeVariantId });
    }
    if (colorId) {
      qb.andWhere('variant.color_id = :colorId', { colorId });
    } else {
      qb.andWhere('variant.color_id IS NULL');
    }
    if (sizeId) {
      qb.andWhere('variant.size_id = :sizeId', { sizeId });
    } else {
      qb.andWhere('variant.size_id IS NULL');
    }

    const existing = await qb.getOne();
    if (existing) {
      throw new ConflictException('Variant with this color and size already exists');
    }
  }

  private async ensureVariantExists(productId: string, variantId: string) {
    await this.ensureProductExists(productId);
    const variant = await this.productVariantsRepository.findOneBy({
      productId,
      variantId,
    });
    if (!variant) {
      throw new NotFoundException('Variant not found for this product');
    }
    return variant;
  }

  private async getVariantDetail(productId: string, variantId: string) {
    const variants = await this.getProductVariants(productId);
    const variant = variants.find((item) => item.variantId === variantId);
    if (!variant) {
      throw new NotFoundException('Variant not found for this product');
    }
    return variant;
  }
  private async ensureProductExists(productId: string) {
    const product = await this.productsRepository.findOneBy({ productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  private async ensureCategoryExists(categoryId: string) {
    const category = await this.categoriesRepository.findOneBy({ categoryId });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }

  private async ensureOriginExists(originId: string) {
    const origin = await this.originsRepository.findOneBy({ originId });
    if (!origin) {
      throw new NotFoundException('Brand not found');
    }
  }

  private async collectCategoryIds(rootCategoryId: string) {
    await this.ensureCategoryExists(rootCategoryId);

    const collectedIds = new Set<string>([rootCategoryId]);
    const queue = [rootCategoryId];

    while (queue.length > 0) {
      const currentCategoryId = queue.shift();
      if (!currentCategoryId) continue;

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

  private parseCategoryIds(query: QueryProductsDto) {
    const rawIds = [
      ...(query.categoryIds?.split(',') ?? []),
      query.categoryId ?? '',
    ];

    return [
      ...new Set(
        rawIds.map((id) => id.trim()).filter((id): id is string => id.length > 0),
      ),
    ];
  }

  private async collectManyCategoryIds(rootCategoryIds: string[]) {
    const collected = new Set<string>();
    for (const categoryId of rootCategoryIds) {
      const nestedIds = await this.collectCategoryIds(categoryId);
      nestedIds.forEach((id) => collected.add(id));
    }
    return [...collected];
  }

  private async ensureUserExists(userId: string) {
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) {
      throw new UnauthorizedException('Nguoi dung khong ton tai');
    }
  }

  private async enrichProductWithFullDetails(product: ProductEntity) {
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

  private async getProductVariants(productId: string) {
    const variants = await this.productVariantsRepository.find({
      where: { productId },
      order: { colorId: 'ASC', sizeId: 'ASC', createdAt: 'ASC' },
    });

    if (variants.length === 0) {
      return [];
    }

    const colorIds = [...new Set(variants.map((variant) => variant.colorId).filter((id): id is string => !!id))];
    const sizeIds = [...new Set(variants.map((variant) => variant.sizeId).filter((id): id is string => !!id))];
    const variantIds = variants.map((variant) => variant.variantId);

    const [colors, sizes, images] = await Promise.all([
      colorIds.length ? this.colorsRepository.find({ where: { colorId: In(colorIds) } }) : Promise.resolve([]),
      sizeIds.length ? this.sizesRepository.find({ where: { sizeId: In(sizeIds) } }) : Promise.resolve([]),
      this.variantImagesRepository.find({
        where: { variantId: In(variantIds) },
        order: { sortOrder: 'ASC', createdAt: 'ASC' },
      }),
    ]);

    const colorMap = new Map(colors.map((color) => [color.colorId, color]));
    const sizeMap = new Map(sizes.map((size) => [size.sizeId, size]));
    const imagesByVariantId = new Map<string, Array<{ imageId: string; imageUrl: string; sortOrder: number }>>();
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

  private getUniqueVariantOptions(
    variants: Awaited<ReturnType<ProductsService['getProductVariants']>>,
    key: 'color' | 'size',
  ) {
    if (key === 'color') {
      const options = new Map<string, NonNullable<(typeof variants)[number]['color']>>();
      for (const variant of variants) {
        if (variant.color) options.set(variant.color.colorId, variant.color);
      }
      return [...options.values()];
    }

    const options = new Map<string, NonNullable<(typeof variants)[number]['size']>>();
    for (const variant of variants) {
      if (variant.size) options.set(variant.size.sizeId, variant.size);
    }
    return [...options.values()];
  }

  private async enrichProductCard(product: ProductEntity) {
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

  private async enrichProductWithDiscount(product: ProductEntity) {
    const primaryImage =
      (await this.productImagesRepository.findOne({
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

  private async mapRecommendationCard(product: ProductEntity) {
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

  private calculateDiscountAmount(discount: DiscountEntity, amount: number) {
    const rawDiscount =
      discount.discountType === DiscountType.PERCENT
        ? (amount * Number(discount.discountValue)) / 100
        : Number(discount.discountValue);

    const maxDiscount = discount.maxDiscountAmount
      ? Number(discount.maxDiscountAmount)
      : null;

    const capped =
      maxDiscount !== null ? Math.min(rawDiscount, maxDiscount) : rawDiscount;

    return Math.min(capped, amount);
  }

  private async findApplicableDiscount(product: ProductEntity) {
    const now = new Date();
    const activeDiscounts = await this.discountsRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    const validDiscounts = activeDiscounts.filter(
      (d) =>
        d.startAt.getTime() <= now.getTime() &&
        d.expireDate.getTime() >= now.getTime() &&
        (d.usageLimit === null || d.usedCount < d.usageLimit),
    );

    let bestDiscount: DiscountEntity | null = null;
    let bestValue = 0;
    const basePrice = Number(product.productPriceSale ?? product.productPrice);

    for (const discount of validDiscounts) {
      let applicable = false;

      if (discount.appliesTo === DiscountApplyTarget.ORDER) {
        applicable = true;
      }
      if (discount.appliesTo === DiscountApplyTarget.CATEGORY) {
        const exists = await this.discountCategoriesRepository.findOneBy({
          discountId: discount.discountId,
          categoryId: product.categoryId,
        });
        applicable = !!exists;
      }
      if (discount.appliesTo === DiscountApplyTarget.PRODUCT) {
        const exists = await this.discountProductsRepository.findOneBy({
          discountId: discount.discountId,
          productId: product.productId,
        });
        applicable = !!exists;
      }

      if (!applicable) continue;
      if (basePrice < Number(discount.minOrderValue)) continue;

      const value = this.calculateDiscountAmount(discount, basePrice);
      if (value > bestValue) {
        bestDiscount = discount;
        bestValue = value;
      }
    }

    return bestDiscount;
  }

  private async getProductTagsInternal(productId: string) {
    const productTags = await this.productTagsRepository.findBy({ productId });
    if (productTags.length === 0) return [];
    const tagIds = productTags.map((pt) => pt.tagId);
    return this.tagsRepository.findBy(tagIds.map((tagId) => ({ tagId })));
  }

  private async ensureUniqueFields(
    payload: Partial<CreateProductDto>,
    excludeProductId?: string,
  ) {
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
        throw new ConflictException('Product slug already exists');
      }
    }

    if (payload.barcode) {
      const existing = await this.productsRepository.findOneBy({
        barcode: payload.barcode,
      });
      if (existing && existing.productId !== excludeProductId) {
        throw new ConflictException('Barcode already exists');
      }
    }

    if (payload.boxBarcode) {
      const existing = await this.productsRepository.findOneBy({
        boxBarcode: payload.boxBarcode,
      });
      if (existing && existing.productId !== excludeProductId) {
        throw new ConflictException('Box barcode already exists');
      }
    }
  }

  private normalizeSlug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async uploadImageToCloudinary(
    file: UploadedImageFile,
    publicIdPrefix: string,
  ) {
    const cloudName = process.env.CLOUD_NAME;
    const apiKey = process.env.API_KEY;
    const apiSecret = process.env.API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      throw new InternalServerErrorException(
        'Cloudinary environment variables are missing',
      );
    }

    const folder = 'agri_ecommerce/products';
    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = `${publicIdPrefix}-${Date.now()}`;
    const signature = createHash('sha1')
      .update(
        `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`,
      )
      .digest('hex');

    const formData = new FormData();
    formData.append(
      'file',
      new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }),
      file.originalname,
    );
    formData.append('api_key', apiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);
    formData.append('folder', folder);
    formData.append('public_id', publicId);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData },
    );

    const payload = (await response.json()) as {
      secure_url?: string;
      error?: { message?: string };
    };

    if (!response.ok || !payload.secure_url) {
      throw new InternalServerErrorException(
        payload.error?.message ?? 'Unable to upload image to Cloudinary',
      );
    }

    return payload.secure_url;
  }
}


