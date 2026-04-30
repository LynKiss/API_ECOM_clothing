export declare class ProductBatchEntity {
    batchId: string;
    productId: string;
    grId: string | null;
    batchCode: string;
    mfgDate: Date | null;
    expDate: Date | null;
    qtyReceived: number;
    qtyRemaining: number;
    unitCost: string;
    note: string | null;
    createdAt: Date;
    updatedAt: Date;
}
