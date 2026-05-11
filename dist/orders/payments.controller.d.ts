import type { IUser } from '../users/users.interface';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { PaymentCallbackDto } from './dto/payment-callback.dto';
import { OrdersService } from './orders.service';
export declare class PaymentsController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    initiatePayment(currentUser: IUser, orderId: string, initiatePaymentDto: InitiatePaymentDto): Promise<{
        orderId: string;
        provider: import("./entities/order.entity").PaymentMethod;
        transactionRef: string;
        paymentUrl: string;
        expiresAt: Date;
    }>;
    initiateGuestPayment(orderId: string, initiatePaymentDto: InitiatePaymentDto): Promise<{
        orderId: string;
        provider: import("./entities/order.entity").PaymentMethod;
        transactionRef: string;
        paymentUrl: string;
        expiresAt: Date;
    }>;
    handlePaymentCallback(provider: string, paymentCallbackDto: PaymentCallbackDto): Promise<{
        orderId: string;
        provider: import("./entities/order.entity").PaymentMethod;
        transactionRef: string;
        paymentStatus: import("./entities/order.entity").PaymentStatus;
        message: string;
    } | {
        orderId: string;
        provider: import("./entities/order.entity").PaymentMethod;
        transactionRef: string;
        paymentStatus: import("./entities/order.entity").PaymentStatus;
        message?: undefined;
    }>;
    getPaymentTransactions(currentUser: IUser, orderId: string): Promise<{
        id: string;
        orderId: string;
        provider: import("./entities/order.entity").PaymentMethod;
        transactionRef: string;
        transactionStatus: import("./entities/payment-transaction.entity").PaymentTransactionStatus;
        paymentStatus: import("./entities/order.entity").PaymentStatus;
        amount: string;
        gatewayCode: string | null;
        gatewayMessage: string | null;
        rawPayload: Record<string, unknown> | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    reconcileOrderPayment(currentUser: IUser, orderId: string): Promise<{
        orderId: string;
        paymentStatus: import("./entities/order.entity").PaymentStatus.PAID;
        message: string;
        transactionStatus?: undefined;
        gatewayCode?: undefined;
    } | {
        orderId: string;
        paymentStatus: import("./entities/order.entity").PaymentStatus.UNPAID | import("./entities/order.entity").PaymentStatus.FAILED | import("./entities/order.entity").PaymentStatus.REFUNDED;
        message: string;
        transactionStatus?: undefined;
        gatewayCode?: undefined;
    } | {
        orderId: string;
        paymentStatus: import("./entities/order.entity").PaymentStatus;
        transactionStatus: import("./entities/payment-transaction.entity").PaymentTransactionStatus;
        message: string;
        gatewayCode?: undefined;
    } | {
        orderId: string;
        paymentStatus: import("./entities/order.entity").PaymentStatus.UNPAID | import("./entities/order.entity").PaymentStatus.FAILED | import("./entities/order.entity").PaymentStatus.REFUNDED;
        transactionStatus: import("./entities/payment-transaction.entity").PaymentTransactionStatus;
        gatewayCode: string;
        message: string;
    }>;
    handleMomoIpn(body: Record<string, unknown>): Promise<{
        message: string;
        transId?: undefined;
    } | {
        message: string;
        transId: string | undefined;
    }>;
    verifyMomoRedirect(body: Record<string, unknown>): Promise<{
        message: string;
        transId?: undefined;
    } | {
        message: string;
        transId: string | undefined;
    }>;
    getAllTransactions(page?: string, limit?: string, provider?: string, status?: string): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        items: {
            id: string;
            orderId: string;
            provider: import("./entities/order.entity").PaymentMethod;
            transactionRef: string;
            transactionStatus: import("./entities/payment-transaction.entity").PaymentTransactionStatus;
            paymentStatus: import("./entities/order.entity").PaymentStatus;
            amount: string;
            gatewayCode: string | null;
            gatewayMessage: string | null;
            createdAt: Date;
            user: {
                username: string;
                email: string;
            } | null;
        }[];
    }>;
}
