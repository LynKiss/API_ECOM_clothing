import { SupplierReturnEntity } from './supplier-return.entity';
export declare class SupplierReturnItemEntity {
    itemId: string;
    srId: string;
    productId: string;
    qtyReturned: number;
    unitPrice: string;
    hasRefund: boolean;
    refundAmount: string;
    reason: string | null;
    supplierReturn: SupplierReturnEntity;
}
