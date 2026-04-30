export declare class OrderItemEntity {
    orderItemId: string;
    orderId: string;
    productId: string;
    variantId: string | null;
    sku: string | null;
    colorName: string | null;
    sizeName: string | null;
    productName: string;
    quantity: number;
    quantityDelivered: number;
    unitPrice: string;
    lineTotal: string;
    createdAt: Date;
    updatedAt: Date;
}
