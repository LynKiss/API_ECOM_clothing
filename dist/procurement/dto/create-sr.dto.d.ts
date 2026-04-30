export declare class CreateSrItemDto {
    productId: string;
    variantId?: string;
    qtyReturned: number;
    unitPrice: number;
    hasRefund?: boolean;
    refundAmount?: number;
    reason?: string;
}
export declare class CreateSrDto {
    grId?: string;
    supplierId: string;
    returnDate: string;
    notes?: string;
    items: CreateSrItemDto[];
}
