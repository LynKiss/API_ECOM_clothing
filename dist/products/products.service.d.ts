import { DataSource, Repository } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';
import { CategoryEntity } from '../categories/entities/category.entity';
import { DiscountCategoryEntity } from '../discounts/entities/discount-category.entity';
import { DiscountApplyTarget, DiscountEntity, DiscountType } from '../discounts/entities/discount.entity';
import { DiscountProductEntity } from '../discounts/entities/discount-product.entity';
import { UserEntity } from '../users/entities/user.entity';
import { AdjustInventoryDto } from './dto/adjust-inventory.dto';
import { CreateColorDto } from './dto/create-color.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateSizeDto } from './dto/create-size.dto';
import { ImportInventoryDto } from './dto/import-inventory.dto';
import { QueryInventoryTransactionsDto } from './dto/query-inventory-transactions.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { RecordDamageDto, RecordReturnDto } from './dto/record-damage-return.dto';
import { ReorderImagesDto } from './dto/reorder-images.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpsertProductVariantDto } from './dto/upsert-product-variant.dto';
import { InventoryTransactionEntity } from './entities/inventory-transaction.entity';
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
export declare class ProductsService {
    private readonly productsRepository;
    private readonly productImagesRepository;
    private readonly productDescriptionImagesRepository;
    private readonly productVariantsRepository;
    private readonly colorsRepository;
    private readonly sizesRepository;
    private readonly variantImagesRepository;
    private readonly categoriesRepository;
    private readonly subcategoriesRepository;
    private readonly originsRepository;
    private readonly tagsRepository;
    private readonly productTagsRepository;
    private readonly inventoryTransactionsRepository;
    private readonly wishlistRepository;
    private readonly usersRepository;
    private readonly discountsRepository;
    private readonly discountCategoriesRepository;
    private readonly discountProductsRepository;
    private readonly notificationsService;
    private readonly dataSource;
    constructor(productsRepository: Repository<ProductEntity>, productImagesRepository: Repository<ProductImageEntity>, productDescriptionImagesRepository: Repository<ProductDescriptionImageEntity>, productVariantsRepository: Repository<ProductVariantEntity>, colorsRepository: Repository<ColorEntity>, sizesRepository: Repository<SizeEntity>, variantImagesRepository: Repository<VariantImageEntity>, categoriesRepository: Repository<CategoryEntity>, subcategoriesRepository: Repository<SubcategoryEntity>, originsRepository: Repository<OriginEntity>, tagsRepository: Repository<TagEntity>, productTagsRepository: Repository<ProductTagEntity>, inventoryTransactionsRepository: Repository<InventoryTransactionEntity>, wishlistRepository: Repository<WishlistEntity>, usersRepository: Repository<UserEntity>, discountsRepository: Repository<DiscountEntity>, discountCategoriesRepository: Repository<DiscountCategoryEntity>, discountProductsRepository: Repository<DiscountProductEntity>, notificationsService: NotificationsService, dataSource: DataSource);
    private syncDefaultWarehouseStock;
    findAll(query: QueryProductsDto): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        items: {
            quantityAvailable: number;
            variants: {
                variantId: string;
                productId: string;
                sku: string | null;
                barcode: string | null;
                price: string | null;
                salePrice: string | null;
                stockQuantity: number;
                weightGrams: number | null;
                isActive: boolean;
                color: {
                    colorId: string;
                    colorName: string;
                    colorCode: string | null;
                } | null;
                size: {
                    sizeId: string;
                    sizeName: string;
                    sizeCode: string | null;
                    sortOrder: number;
                } | null;
                images: {
                    imageId: string;
                    imageUrl: string;
                    sortOrder: number;
                }[];
            }[];
            colorOptions: {
                colorId: string;
                colorName: string;
                colorCode: string | null;
            }[] | {
                sizeId: string;
                sizeName: string;
                sizeCode: string | null;
                sortOrder: number;
            }[];
            sizeOptions: {
                colorId: string;
                colorName: string;
                colorCode: string | null;
            }[] | {
                sizeId: string;
                sizeName: string;
                sizeCode: string | null;
                sortOrder: number;
            }[];
            primaryImageUrl: string | null;
            basePrice: string;
            effectivePrice: string;
            appliedDiscount: {
                id: string;
                code: string;
                name: string;
                type: DiscountType;
                value: string;
                appliesTo: DiscountApplyTarget;
            } | null;
            productId: string;
            productName: string;
            productSlug: string;
            categoryId: string;
            subcategoryId: string | null;
            originId: string | null;
            gender: "men" | "women" | "unisex" | "kids";
            material: string | null;
            fitType: string | null;
            style: string | null;
            productPrice: string;
            productPriceSale: string | null;
            quantityReserved: number;
            avgCost: string;
            description: string | null;
            ratingAverage: string;
            ratingCount: number;
            isShow: boolean;
            isFeatured: boolean;
            expiredAt: Date | null;
            unit: string | null;
            quantityPerBox: number | null;
            barcode: string | null;
            boxBarcode: string | null;
            costPrice: string | null;
            bulkPrice: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    findOne(productId: string): Promise<{
        quantityAvailable: number;
        images: ProductImageEntity[];
        descriptionImages: ProductDescriptionImageEntity[];
        tags: TagEntity[];
        origin: OriginEntity | null;
        subcategory: SubcategoryEntity | null;
        category: CategoryEntity | null;
        variants: {
            variantId: string;
            productId: string;
            sku: string | null;
            barcode: string | null;
            price: string | null;
            salePrice: string | null;
            stockQuantity: number;
            weightGrams: number | null;
            isActive: boolean;
            color: {
                colorId: string;
                colorName: string;
                colorCode: string | null;
            } | null;
            size: {
                sizeId: string;
                sizeName: string;
                sizeCode: string | null;
                sortOrder: number;
            } | null;
            images: {
                imageId: string;
                imageUrl: string;
                sortOrder: number;
            }[];
        }[];
        colorOptions: {
            colorId: string;
            colorName: string;
            colorCode: string | null;
        }[] | {
            sizeId: string;
            sizeName: string;
            sizeCode: string | null;
            sortOrder: number;
        }[];
        sizeOptions: {
            colorId: string;
            colorName: string;
            colorCode: string | null;
        }[] | {
            sizeId: string;
            sizeName: string;
            sizeCode: string | null;
            sortOrder: number;
        }[];
        primaryImageUrl: string | null;
        basePrice: string;
        effectivePrice: string;
        appliedDiscount: {
            id: string;
            code: string;
            name: string;
            type: DiscountType;
            value: string;
            appliesTo: DiscountApplyTarget;
        } | null;
        productId: string;
        productName: string;
        productSlug: string;
        categoryId: string;
        subcategoryId: string | null;
        originId: string | null;
        gender: "men" | "women" | "unisex" | "kids";
        material: string | null;
        fitType: string | null;
        style: string | null;
        productPrice: string;
        productPriceSale: string | null;
        quantityReserved: number;
        avgCost: string;
        description: string | null;
        ratingAverage: string;
        ratingCount: number;
        isShow: boolean;
        isFeatured: boolean;
        expiredAt: Date | null;
        unit: string | null;
        quantityPerBox: number | null;
        barcode: string | null;
        boxBarcode: string | null;
        costPrice: string | null;
        bulkPrice: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getRecommendationCards(options: {
        productIds?: string[];
        keywordHints?: string[];
        limit?: number;
    }): Promise<{
        productId: string;
        productName: string;
        productSlug: string;
        quantityAvailable: number;
        unit: string | null;
        isShow: boolean;
        basePrice: string;
        effectivePrice: string;
        primaryImageUrl: string | null;
        appliedDiscount: {
            id: string;
            code: string;
            name: string;
            type: DiscountType;
            value: string;
            appliesTo: DiscountApplyTarget;
        } | null;
        category: {
            categoryId: string;
            categoryName: string;
            categorySlug: string;
        } | null;
        origin: {
            originId: string;
            originName: string;
        } | null;
        ratingAverage: string;
        ratingCount: number;
    }[]>;
    getAdminProductOptions(search?: string, limit?: number): Promise<{
        productId: string;
        productName: string;
        productSlug: string;
        quantityAvailable: number;
        unit: string | null;
        isShow: boolean;
        basePrice: string;
        effectivePrice: string;
        primaryImageUrl: string | null;
        appliedDiscount: {
            id: string;
            code: string;
            name: string;
            type: DiscountType;
            value: string;
            appliesTo: DiscountApplyTarget;
        } | null;
        category: {
            categoryId: string;
            categoryName: string;
            categorySlug: string;
        } | null;
        origin: {
            originId: string;
            originName: string;
        } | null;
        ratingAverage: string;
        ratingCount: number;
    }[]>;
    create(createProductDto: CreateProductDto): Promise<ProductEntity>;
    update(productId: string, updateProductDto: UpdateProductDto): Promise<ProductEntity>;
    remove(productId: string): Promise<{
        success: boolean;
    }>;
    toggleVisibility(productId: string): Promise<{
        productId: string;
        isShow: boolean;
    }>;
    toggleFeatured(productId: string): Promise<{
        productId: string;
        isFeatured: boolean;
    }>;
    findColors(): Promise<ColorEntity[]>;
    createColor(dto: CreateColorDto): Promise<ColorEntity>;
    findSizes(): Promise<SizeEntity[]>;
    createSize(dto: CreateSizeDto): Promise<SizeEntity>;
    findProductVariants(productId: string): Promise<{
        variantId: string;
        productId: string;
        sku: string | null;
        barcode: string | null;
        price: string | null;
        salePrice: string | null;
        stockQuantity: number;
        weightGrams: number | null;
        isActive: boolean;
        color: {
            colorId: string;
            colorName: string;
            colorCode: string | null;
        } | null;
        size: {
            sizeId: string;
            sizeName: string;
            sizeCode: string | null;
            sortOrder: number;
        } | null;
        images: {
            imageId: string;
            imageUrl: string;
            sortOrder: number;
        }[];
    }[]>;
    createVariant(productId: string, dto: UpsertProductVariantDto): Promise<{
        variantId: string;
        productId: string;
        sku: string | null;
        barcode: string | null;
        price: string | null;
        salePrice: string | null;
        stockQuantity: number;
        weightGrams: number | null;
        isActive: boolean;
        color: {
            colorId: string;
            colorName: string;
            colorCode: string | null;
        } | null;
        size: {
            sizeId: string;
            sizeName: string;
            sizeCode: string | null;
            sortOrder: number;
        } | null;
        images: {
            imageId: string;
            imageUrl: string;
            sortOrder: number;
        }[];
    }>;
    updateVariant(productId: string, variantId: string, dto: UpsertProductVariantDto): Promise<{
        variantId: string;
        productId: string;
        sku: string | null;
        barcode: string | null;
        price: string | null;
        salePrice: string | null;
        stockQuantity: number;
        weightGrams: number | null;
        isActive: boolean;
        color: {
            colorId: string;
            colorName: string;
            colorCode: string | null;
        } | null;
        size: {
            sizeId: string;
            sizeName: string;
            sizeCode: string | null;
            sortOrder: number;
        } | null;
        images: {
            imageId: string;
            imageUrl: string;
            sortOrder: number;
        }[];
    }>;
    deactivateVariant(productId: string, variantId: string): Promise<{
        success: boolean;
    }>;
    uploadVariantImage(productId: string, variantId: string, file: UploadedImageFile | undefined): Promise<{
        imageId: string;
        variantId: string;
        imageUrl: string;
        sortOrder: number;
    }>;
    deleteVariantImage(productId: string, variantId: string, imageId: string): Promise<{
        success: boolean;
    }>;
    getProductImages(productId: string): Promise<ProductImageEntity[]>;
    uploadProductImage(productId: string, file: UploadedImageFile | undefined, isPrimary?: boolean): Promise<{
        productImageId: string;
        productId: string;
        imageUrl: string;
        isPrimary: boolean;
        sortOrder: number;
    }>;
    setPrimaryImage(productId: string, imageId: string): Promise<{
        success: boolean;
        primaryImageId: string;
    }>;
    deleteProductImage(productId: string, imageId: string): Promise<{
        success: boolean;
    }>;
    reorderProductImages(productId: string, dto: ReorderImagesDto): Promise<ProductImageEntity[]>;
    getDescriptionImages(productId: string): Promise<ProductDescriptionImageEntity[]>;
    uploadDescriptionImage(productId: string, file: UploadedImageFile | undefined): Promise<ProductDescriptionImageEntity>;
    deleteDescriptionImage(productId: string, imageId: string): Promise<{
        success: boolean;
    }>;
    importInventory(performedBy: string, importInventoryDto: ImportInventoryDto): Promise<{
        productId: string;
        quantityAvailable: number;
        transactionId: string;
    }>;
    adjustInventory(performedBy: string, adjustInventoryDto: AdjustInventoryDto): Promise<{
        productId: string;
        previousQuantity: number;
        currentQuantity: number;
        quantityChange: number;
        transactionId: string;
    }>;
    recordDamage(performedBy: string, dto: RecordDamageDto): Promise<{
        productId: string;
        quantityAvailable: number;
        transactionId: string;
    }>;
    recordReturn(performedBy: string, dto: RecordReturnDto): Promise<{
        productId: string;
        quantityAvailable: number;
        transactionId: string;
    }>;
    findInventoryTransactions(query: QueryInventoryTransactionsDto): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        items: any[];
    }>;
    getInventorySummary(): Promise<any[]>;
    getLowStockProducts(threshold?: number): Promise<{
        productId: string;
        productName: string;
        quantityAvailable: number;
        unit: string | null;
        barcode: string | null;
    }[]>;
    findWishlist(userId: string): Promise<{
        productId: string;
        createdAt: Date;
        product: {
            category: {
                categoryId: string;
                categoryName: string;
            } | null;
            primaryImageUrl: string | null;
            basePrice: string;
            effectivePrice: string;
            appliedDiscount: {
                id: string;
                code: string;
                name: string;
                type: DiscountType;
                value: string;
                appliesTo: DiscountApplyTarget;
            } | null;
            productId: string;
            productName: string;
            productSlug: string;
            categoryId: string;
            subcategoryId: string | null;
            originId: string | null;
            gender: "men" | "women" | "unisex" | "kids";
            material: string | null;
            fitType: string | null;
            style: string | null;
            productPrice: string;
            productPriceSale: string | null;
            quantityAvailable: number;
            quantityReserved: number;
            avgCost: string;
            description: string | null;
            ratingAverage: string;
            ratingCount: number;
            isShow: boolean;
            isFeatured: boolean;
            expiredAt: Date | null;
            unit: string | null;
            quantityPerBox: number | null;
            barcode: string | null;
            boxBarcode: string | null;
            costPrice: string | null;
            bulkPrice: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    }[]>;
    addWishlistItem(userId: string, productId: string): Promise<WishlistEntity>;
    removeWishlistItem(userId: string, productId: string): Promise<{
        success: boolean;
    }>;
    private ensureVariantOptionsExist;
    private ensureVariantPricesAreValid;
    private ensureUniqueVariantOptionPair;
    private ensureVariantExists;
    private getVariantDetail;
    private ensureProductExists;
    private ensureCategoryExists;
    private ensureOriginExists;
    private collectCategoryIds;
    private parseCategoryIds;
    private collectManyCategoryIds;
    private ensureUserExists;
    private enrichProductWithFullDetails;
    private getProductVariants;
    private getUniqueVariantOptions;
    private enrichProductCard;
    private enrichProductWithDiscount;
    private mapRecommendationCard;
    private calculateDiscountAmount;
    private findApplicableDiscount;
    private getProductTagsInternal;
    private ensureUniqueFields;
    private normalizeSlug;
    private uploadImageToCloudinary;
}
export {};
