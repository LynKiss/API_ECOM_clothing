import { GoodsReceiptItemEntity } from './goods-receipt-item.entity';
export declare enum GoodsReceiptStatus {
    DRAFT = "draft",
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled"
}
export declare class GoodsReceiptEntity {
    grId: string;
    grCode: string;
    poId: string | null;
    supplierId: string;
    receiptDate: Date;
    shippingCost: string;
    otherCost: string;
    status: GoodsReceiptStatus;
    notes: string | null;
    createdBy: string | null;
    items: GoodsReceiptItemEntity[];
    createdAt: Date;
    updatedAt: Date;
}
