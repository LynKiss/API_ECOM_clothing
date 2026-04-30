export declare class CreatePoItemDto {
    productId: string;
    variantId?: string;
    unit?: string;
    unitPerBase?: number;
    qtyOrdered: number;
    unitPrice: number;
    notes?: string;
}
export declare class CreatePoDto {
    supplierId: string;
    orderDate?: string;
    expectedDate?: string;
    shippingCost?: number;
    otherCost?: number;
    notes?: string;
    items: CreatePoItemDto[];
}
