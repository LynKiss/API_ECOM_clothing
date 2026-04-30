import { StockTransferEntity } from './stock-transfer.entity';
export declare class StockTransferItemEntity {
    itemId: string;
    transferId: string;
    productId: string;
    qtyRequested: number;
    qtyReceived: number;
    notes: string | null;
    transfer: StockTransferEntity;
}
