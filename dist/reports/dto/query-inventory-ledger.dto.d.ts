export declare class QueryInventoryLedgerDto {
    productId?: string;
    transactionType?: string;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
}
export declare class QueryProfitabilityDto {
    from?: string;
    to?: string;
    groupBy?: 'product' | 'day' | 'month';
    page?: number;
    limit?: number;
}
export declare class QueryAgingDebtDto {
    asOf?: string;
    supplierId?: string;
}
export declare class RecordPoPaymentDto {
    poId: string;
    amount: string;
    notes?: string;
}
