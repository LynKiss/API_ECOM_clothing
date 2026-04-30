import { InventoryTransactionType } from '../entities/inventory-transaction.entity';
export declare class QueryInventoryTransactionsDto {
    productId?: string;
    transactionType?: InventoryTransactionType;
    relatedOrderId?: string;
    performedBy?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
}
