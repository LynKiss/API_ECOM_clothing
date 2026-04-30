import { GoodsReceiptEntity } from './goods-receipt.entity';
export declare class GoodsReceiptItemEntity {
    itemId: string;
    grId: string;
    productId: string;
    variantId: string | null;
    unit: string;
    unitPerBase: number;
    qtyOrdered: number;
    qtyReceived: number;
    qtyDefective: number;
    qtyReturned: number;
    refundAmount: string;
    hasRefund: boolean;
    unitPrice: string;
    landedCost: string;
    notes: string | null;
    receipt: GoodsReceiptEntity;
}
