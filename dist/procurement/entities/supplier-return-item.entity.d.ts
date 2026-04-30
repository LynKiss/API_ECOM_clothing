import { SupplierReturnEntity } from './supplier-return.entity';
export declare class SupplierReturnItemEntity {
    itemId: string;
    srId: string;
    productId: string;
    variantId: string | null;
    qtyReturned: number;
    unitPrice: string;
    hasRefund: boolean;
    refundAmount: string;
    reason: string | null;
    supplierReturn: SupplierReturnEntity;
}
