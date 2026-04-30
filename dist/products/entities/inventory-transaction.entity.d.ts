export declare enum InventoryTransactionType {
    IMPORT = "import",
    EXPORT = "export",
    ADJUSTMENT = "adjustment",
    RETURN_IN = "return_in",
    RETURN_OUT = "return_out",
    DAMAGE = "damage"
}
export declare class InventoryTransactionEntity {
    transactionId: string;
    productId: string;
    variantId: string | null;
    performedBy: string | null;
    transactionType: InventoryTransactionType;
    quantityChange: number;
    quantityBefore: number | null;
    quantityAfter: number | null;
    unitCostAtTime: string | null;
    referenceType: string | null;
    referenceId: string | null;
    note: string | null;
    relatedOrderId: string | null;
    createdAt: Date;
    updatedAt: Date;
}
