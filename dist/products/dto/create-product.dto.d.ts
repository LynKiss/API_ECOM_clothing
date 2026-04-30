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
}
