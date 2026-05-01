import { CreateColorDto } from './dto/create-color.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateSizeDto } from './dto/create-size.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { ReorderImagesDto } from './dto/reorder-images.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpsertProductVariantDto } from './dto/upsert-product-variant.dto';
import { ProductsService } from './products.service';
type UploadedImageFile = {
    buffer: Buffer;
    mimetype: string;
    size: number;
    originalname: string;
};
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getProducts(query: QueryProductsDto): Promise<{
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
                sku: string;
                barcode: string | null;
                price: string;
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
                type: import("../discounts/entities/discount.entity").DiscountType;
                value: string;
                appliesTo: import("../discounts/entities/discount.entity").DiscountApplyTarget;
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
    getColors(): Promise<import("./entities/color.entity").ColorEntity[]>;
    createColor(dto: CreateColorDto): Promise<import("./entities/color.entity").ColorEntity>;
    getSizes(): Promise<import("./entities/size.entity").SizeEntity[]>;
    createSize(dto: CreateSizeDto): Promise<import("./entities/size.entity").SizeEntity>;
    getProduct(id: string): Promise<{
        quantityAvailable: number;
        images: import("./entities/product-image.entity").ProductImageEntity[];
        descriptionImages: import("./entities/product-description-image.entity").ProductDescriptionImageEntity[];
        tags: import("./entities/tag.entity").TagEntity[];
        origin: import("./entities/origin.entity").OriginEntity | null;
        subcategory: import("./entities/subcategory.entity").SubcategoryEntity | null;
        category: import("../categories/entities/category.entity").CategoryEntity | null;
        variants: {
            variantId: string;
            productId: string;
            sku: string;
            barcode: string | null;
            price: string;
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
            type: import("../discounts/entities/discount.entity").DiscountType;
            value: string;
            appliesTo: import("../discounts/entities/discount.entity").DiscountApplyTarget;
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
    createProduct(createProductDto: CreateProductDto): Promise<import("./entities/product.entity").ProductEntity>;
    updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<import("./entities/product.entity").ProductEntity>;
    getProductVariants(id: string): Promise<{
        variantId: string;
        productId: string;
        sku: string;
        barcode: string | null;
        price: string;
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
    createProductVariant(id: string, dto: UpsertProductVariantDto): Promise<{
        variantId: string;
        productId: string;
        sku: string;
        barcode: string | null;
        price: string;
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
    updateProductVariant(id: string, variantId: string, dto: UpsertProductVariantDto): Promise<{
        variantId: string;
        productId: string;
        sku: string;
        barcode: string | null;
        price: string;
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
    deactivateProductVariant(id: string, variantId: string): Promise<{
        success: boolean;
    }>;
    uploadProductVariantImage(id: string, variantId: string, file: UploadedImageFile): Promise<{
        imageId: string;
        variantId: string;
        imageUrl: string;
        sortOrder: number;
    }>;
    deleteProductVariantImage(id: string, variantId: string, imageId: string): Promise<{
        success: boolean;
    }>;
    toggleProductVisibility(id: string): Promise<{
        productId: string;
        isShow: boolean;
    }>;
    toggleProductFeatured(id: string): Promise<{
        productId: string;
        isFeatured: boolean;
    }>;
    removeProduct(id: string): Promise<{
        success: boolean;
    }>;
    getProductImages(id: string): Promise<import("./entities/product-image.entity").ProductImageEntity[]>;
    uploadProductImage(id: string, file: UploadedImageFile, isPrimary?: string): Promise<{
        productImageId: string;
        productId: string;
        imageUrl: string;
        isPrimary: boolean;
        sortOrder: number;
    }>;
    setPrimaryImage(id: string, imageId: string): Promise<{
        success: boolean;
        primaryImageId: string;
    }>;
    reorderProductImages(id: string, dto: ReorderImagesDto): Promise<import("./entities/product-image.entity").ProductImageEntity[]>;
    deleteProductImage(id: string, imageId: string): Promise<{
        success: boolean;
    }>;
    getDescriptionImages(id: string): Promise<import("./entities/product-description-image.entity").ProductDescriptionImageEntity[]>;
    uploadDescriptionImage(id: string, file: UploadedImageFile): Promise<import("./entities/product-description-image.entity").ProductDescriptionImageEntity>;
    deleteDescriptionImage(id: string, imageId: string): Promise<{
        success: boolean;
    }>;
}
export {};
