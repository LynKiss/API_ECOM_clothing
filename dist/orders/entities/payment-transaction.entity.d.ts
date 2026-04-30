import { PaymentMethod, PaymentStatus } from './order.entity';
export declare enum PaymentTransactionStatus {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed"
}
export declare class PaymentTransactionEntity {
    paymentTransactionId: string;
    orderId: string;
    userId: string;
    provider: PaymentMethod;
    transactionRef: string;
    transactionStatus: PaymentTransactionStatus;
    paymentStatus: PaymentStatus;
    amount: string;
    gatewayCode: string | null;
    gatewayMessage: string | null;
    rawPayload: Record<string, unknown> | null;
    createdAt: Date;
    updatedAt: Date;
}
