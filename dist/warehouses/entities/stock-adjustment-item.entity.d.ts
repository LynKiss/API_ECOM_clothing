import { StockAdjustmentEntity } from './stock-adjustment.entity';
export declare class StockAdjustmentItemEntity {
    itemId: string;
    adjustmentId: string;
    productId: string;
    qtyBefore: number;
    qtyAfter: number;
    qtyDiff: number;
    notes: string | null;
    adjustment: StockAdjustmentEntity;
}
