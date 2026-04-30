import { PurchaseOrderItemEntity } from './purchase-order-item.entity';
export declare enum PurchaseOrderStatus {
    DRAFT = "draft",
    ORDERED = "ordered",
    PARTIAL = "partial",
    RECEIVED = "received",
    CANCELLED = "cancelled"
}
export declare class PurchaseOrderEntity {
    poId: string;
    poCode: string;
    supplierId: string;
    status: PurchaseOrderStatus;
    orderDate: Date | null;
    expectedDate: Date | null;
    shippingCost: string;
    otherCost: string;
    totalAmount: string;
    paymentStatus: 'unpaid' | 'partial' | 'paid';
    paidAmount: string;
    paidDate: Date | null;
    paymentNotes: string | null;
    notes: string | null;
    createdBy: string | null;
    items: PurchaseOrderItemEntity[];
    createdAt: Date;
    updatedAt: Date;
}
