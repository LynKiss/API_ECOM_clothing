import { StockAdjustmentItemEntity } from './stock-adjustment-item.entity';
export declare enum AdjustmentReason {
    INVENTORY_COUNT = "inventory_count",
    DAMAGE = "damage",
    EXPIRED = "expired",
    LOST = "lost",
    OTHER = "other"
}
export declare enum AdjustmentStatus {
    DRAFT = "draft",
    APPROVED = "approved",
    CANCELLED = "cancelled"
}
export declare class StockAdjustmentEntity {
    adjustmentId: string;
    adjustmentCode: string;
    warehouseId: string | null;
    reason: AdjustmentReason;
    status: AdjustmentStatus;
    adjustmentDate: Date | null;
    notes: string | null;
    approvedBy: string | null;
    approvedAt: Date | null;
    createdBy: string | null;
    items: StockAdjustmentItemEntity[];
    createdAt: Date;
    updatedAt: Date;
}
