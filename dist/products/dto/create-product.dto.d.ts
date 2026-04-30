declare class CreateProductVariantColorDto {
    colorName: string;
    colorCode?: string;
}
declare class CreateProductVariantSizeDto {
    sizeName: string;
    sizeCode?: string;
}
export declare class CreateProductVariantDto {
    colorId?: string;
    newColor?: CreateProductVariantColorDto;
    sizeId?: string;
    newSize?: CreateProductVariantSizeDto;
    sku?: string;
    barcode?: string;
    price?: string;
    salePrice?: string;
    stockQuantity?: number;
    weightGrams?: number;
    isActive?: boolean;
}
export declare class CreateProductDto {
    productId?: string;
    productName: string;
    productSlug?: string;
    categoryId: string;
    subcategoryId?: string;
    originId?: string;
    productPrice: string;
    productPriceSale?: string;
    quantityAvailable?: number;
    description?: string;
    isShow?: boolean;
    expiredAt?: string;
    unit?: string;
    quantityPerBox?: number;
    barcode?: string;
    boxBarcode?: string;
    isFeatured?: boolean;
    tagIds?: string[];
    variants?: CreateProductVariantDto[];
}
export {};
