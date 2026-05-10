import { SupplierReturnItemEntity } from './supplier-return-item.entity';
export declare enum SupplierReturnStatus {
    DRAFT = "draft",
    POSTED = "posted",
    CANCELLED = "cancelled"
}
export declare class SupplierReturnEntity {
    srId: string;
    srCode: string;
    grId: string | null;
    supplierId: string;
    returnDate: Date;
    status: SupplierReturnStatus;
    notes: string | null;
    createdBy: string | null;
    items: SupplierReturnItemEntity[];
    createdAt: Date;
    updatedAt: Date;
}
