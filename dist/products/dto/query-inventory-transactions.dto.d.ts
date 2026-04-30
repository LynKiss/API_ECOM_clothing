import { InventoryTransactionType } from '../entities/inventory-transaction.entity';
export declare class QueryInventoryTransactionsDto {
    productId?: string;
    variantId?: string;
    transactionType?: InventoryTransactionType;
    relatedOrderId?: string;
    performedBy?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
}
