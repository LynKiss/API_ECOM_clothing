export declare class ProductVariantEntity {
    variantId: string;
    productId: string;
    sizeId: string | null;
    colorId: string | null;
    sku: string;
    barcode: string | null;
    price: string;
    salePrice: string | null;
    stockQuantity: number;
    weightGrams: number | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
