import { StockTransferItemEntity } from './stock-transfer-item.entity';
export declare enum StockTransferStatus {
    DRAFT = "draft",
    SHIPPED = "shipped",
    RECEIVED = "received",
    CANCELLED = "cancelled"
}
export declare class StockTransferEntity {
    transferId: string;
    transferCode: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    status: StockTransferStatus;
    transferDate: Date | null;
    receivedDate: Date | null;
    notes: string | null;
    createdBy: string | null;
    items: StockTransferItemEntity[];
    createdAt: Date;
    updatedAt: Date;
}
