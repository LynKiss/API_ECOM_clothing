import { PurchaseOrderEntity } from './purchase-order.entity';
export declare class PurchaseOrderItemEntity {
    itemId: string;
    poId: string;
    productId: string;
    variantId: string | null;
    unit: string;
    unitPerBase: number;
    qtyOrdered: number;
    qtyReceived: number;
    unitPrice: string;
    notes: string | null;
    po: PurchaseOrderEntity;
}
