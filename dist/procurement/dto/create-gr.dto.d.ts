export declare class CreateGrItemDto {
    productId: string;
    variantId?: string;
    unit?: string;
    unitPerBase?: number;
    qtyOrdered?: number;
    qtyReceived: number;
    qtyDefective?: number;
    qtyReturned?: number;
    refundAmount?: number;
    hasRefund?: boolean;
    unitPrice: number;
    notes?: string;
}
export declare class CreateGrDto {
    poId?: string;
    supplierId: string;
    receiptDate: string;
    shippingCost?: number;
    otherCost?: number;
    notes?: string;
    items: CreateGrItemDto[];
}
