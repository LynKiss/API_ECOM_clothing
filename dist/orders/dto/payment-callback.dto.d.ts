export declare class PaymentCallbackDto {
    orderId: string;
    transactionRef: string;
    amount: string;
    success: boolean;
    gatewayCode?: string;
    gatewayMessage?: string;
    rawPayload?: Record<string, unknown>;
}
