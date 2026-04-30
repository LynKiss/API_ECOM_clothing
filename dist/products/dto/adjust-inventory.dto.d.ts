export declare enum InventoryAdjustmentMode {
    SET = "set",
    INCREASE = "increase",
    DECREASE = "decrease"
}
export declare class AdjustInventoryDto {
    productId: string;
    variantId?: string;
    mode: InventoryAdjustmentMode;
    quantity: number;
    note?: string;
}
